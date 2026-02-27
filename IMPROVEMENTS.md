# Verbeteringen: Prestaties & Beveiliging

Gegenereerd op basis van een volledige code-analyse van het only-today project (hemera-journal).
De punten zijn gerangschikt op prioriteit en bevatten verwijzingen naar de exacte bestanden.

---

## BEVEILIGING

### 🔴 Kritiek

#### 1. Credentials verwijderen uit versiebeheer

**Bestanden:** `.env`, `.env.test`

**Probleem:**
Echte credentials staan in `.env`-bestanden die door git worden bijgehouden:
- Supabase service role key (volledige database-toegang, bypast Row Level Security)
- Database-wachtwoord `Amstelbier1234`
- Test-gebruikerswachtwoord en e-mailadres

**Oplossing:**
- Voeg `.env` en `.env.test` toe aan `.gitignore`
- Roteer onmiddellijk alle gelekte keys en wachtwoorden in Supabase en PostgreSQL
- Gebruik uitsluitend `.env.example` met placeholder-waarden in de repository

---

#### 2. Debug telemetry verwijderen uit authenticatieroutes

**Bestanden:**
- `packages/api/src/routes/auth.ts` (regels 13–27, 137–157)
- `packages/api/src/services/userService.ts` (regels 45–59)

**Probleem:**
Auth-events (registraties, logins, fouten en gebruikersdata) worden doorgestuurd naar een
extern debug-endpoint `http://127.0.0.1:7242/ingest/...` via `#region agent log` blokken.
Dit lekt gevoelige informatie en voegt onnodige netwerkverzoeken toe aan de auth-flow.

**Oplossing:**
- Verwijder alle `#region agent log` blokken volledig
- Gebruik een gecontroleerde logging-bibliotheek (bijv. `pino` of `winston`) als
  structured logging gewenst is

---

### 🔴 Hoog

#### 3. CORS beperken tot toegestane origins

**Bestand:** `packages/api/src/server.ts` (regel 12)

**Probleem:**
`app.use(cors())` staat zonder configuratie alle origins toe. Elke website kan
verzoeken sturen naar de API.

**Oplossing:**
```typescript
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(",") ?? [],
  credentials: true
}));
```
Voeg `ALLOWED_ORIGINS=https://app.onlytoday.nl` toe aan de omgevingsvariabelen.

---

#### 4. Tokens niet in localStorage opslaan (XSS-risico)

**Bestanden:**
- `packages/web/src/lib/auth.ts`
- `packages/web/src/context/AuthContext.tsx`

**Probleem:**
`accessToken`, `refreshToken` en `authUser` worden opgeslagen in localStorage.
Bij een XSS-kwetsbaarheid kan aanvallende JavaScript deze tokens uitlezen en
de sessie overnemen.

**Oplossing:**
- Gebruik `httpOnly` cookies via Supabase SSR-cookies (`@supabase/ssr`)
- Of: implementeer een BFF (Backend For Frontend) patroon waarbij de API
  de sessie beheert via cookies

---

#### 5. In-memory rate limiting vervangen door persistente oplossing

**Bestand:** `packages/api/src/middleware/auth.ts`

**Probleem:**
Rate limiting-state wordt in geheugen bijgehouden en gaat verloren bij elke herstart.
Bij meerdere server-instanties werkt de limiet ook niet correct — elke instantie
heeft zijn eigen teller.

**Oplossing:**
Gebruik Redis-gebaseerde rate limiting:
```typescript
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";

const limiter = rateLimit({
  store: new RedisStore({ client: redisClient }),
  windowMs: 10 * 60 * 1000,
  max: 5
});
```

---

### 🟡 Medium

#### 6. Sterkere wachtwoordvereisten afdwingen

**Bestanden:**
- `packages/api/src/schemas/auth.ts`
- `packages/web/src/components/auth/RegisterForm.tsx`

**Probleem:**
Alleen minimaal 8 tekens zijn vereist — geen hoofdletters, cijfers of speciale tekens.

**Oplossing:**
```typescript
password: z.string()
  .min(8, "Minimaal 8 tekens")
  .regex(/[A-Z]/, "Minimaal één hoofdletter")
  .regex(/[0-9]/, "Minimaal één cijfer")
  .regex(/[^a-zA-Z0-9]/, "Minimaal één speciaal teken")
```

---

#### 7. Admin-toegangscontrole versterken

**Bestand:** `packages/api/src/middleware/adminAuth.ts`

**Probleem:**
Admin-toegang wordt gecontroleerd via een e-mail uit een omgevingsvariabele.
Als de auth-flow kwetsbaar is of e-mails kunnen worden gespoofed, biedt dit geen
voldoende bescherming.

**Oplossing:**
Sla admin-status op in Supabase `app_metadata`:
```typescript
const { data: user } = await adminClient.auth.admin.getUserById(userId);
const isAdmin = user?.app_metadata?.role === "admin";
```

---

#### 8. Auth-fallback naar in-memory session-cache beveiligen

**Bestand:** `packages/api/src/middleware/auth.ts`

**Probleem:**
Bij een 403-fout van Supabase valt de middleware terug op de lokale in-memory cache.
Dit kan authenticatiecontroles omzeilen als Supabase tijdelijk onbereikbaar is.

**Oplossing:**
- Verwijder de fallback naar de cache bij een 403-fout
- Geef een duidelijke `503 Service Unavailable` terug als Supabase niet bereikbaar is
- Implementeer monitoring/alerting voor auth-service-storingen

---

#### 9. Session-revocatielijst persistent maken

**Bestand:** `packages/api/src/services/sessionService.ts`

**Probleem:**
De in-memory revocatielijst verdwijnt bij elke serverherstart. Ingetrokken tokens
(bijv. na logout of wachtwoordwijziging) kunnen na een herstart opnieuw worden gebruikt.

**Oplossing:**
Sla gerevoceerde tokens op in de database of Redis:
```sql
CREATE TABLE revoked_tokens (
  jti TEXT PRIMARY KEY,
  revoked_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);
```

---

#### 10. Content Security Policy (CSP) expliciet configureren

**Bestand:** `packages/api/src/server.ts`

**Probleem:**
Helmet wordt gebruikt met standaardwaarden. De standaard CSP kan te permissief zijn
voor een productieomgeving met externe API-aanroepen naar Supabase.

**Oplossing:**
```typescript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", process.env.SUPABASE_URL],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    }
  }
}));
```

---

### 🟢 Laag

#### 11. Beveiligingsheaders voor de frontend toevoegen

**Bestand:** `packages/web/astro.config.mjs`

**Probleem:**
De statische Astro-frontend heeft geen beveiligingsheaders geconfigureerd aan de hosting-kant.

**Oplossing:**
Voeg headers toe via de hostingprovider (Netlify/Vercel/Nginx):
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

---

#### 12. Wachtwoord-reset open redirect voorkomen

**Bestand:** `packages/api/src/routes/auth.ts`

**Probleem:**
De `redirectTo`-parameter bij wachtwoordherstel wordt niet gevalideerd en kan
leiden tot open redirects.

**Oplossing:**
Valideer dat de redirect-URL behoort tot een toegestane lijst:
```typescript
const ALLOWED_REDIRECT_HOSTS = ["app.onlytoday.nl"];
const url = new URL(redirectTo);
if (!ALLOWED_REDIRECT_HOSTS.includes(url.hostname)) {
  throw AppError.validationError("Ongeldige redirect URL");
}
```

---

#### 13. Audit logging voor gevoelige operaties

**Bestanden:**
- `packages/api/src/routes/settings.ts`
- `packages/api/src/services/userService.ts`

**Probleem:**
Wachtwoordwijzigingen en accountverwijderingen worden niet geauditlogd.
De bestaande `admin_user_actions` tabel wordt niet consequent gebruikt.

**Oplossing:**
Voeg audit-records toe bij elke gevoelige actie (wachtwoordwijziging, accountverwijdering,
rolwijziging) in de bestaande `admin_user_actions` tabel.

---

## PRESTATIES

### 🔴 Hoog

#### 14. HTTP-compressie toevoegen aan de API

**Bestand:** `packages/api/src/server.ts`

**Probleem:**
API-responses worden ongecomprimeerd verstuurd. Bij grote JSON-payloads (sync met 1000
documenten, analytics-respons) is dit een significant prestatieprobleem.

**Oplossing:**
```typescript
import compression from "compression";
app.use(compression());
```
Voeg `compression` toe als dependency: `pnpm add compression @types/compression`

---

#### 15. Database-indexes uitbreiden voor analytische queries

**Bestand:** `packages/api/src/db/migrations/002_indexes.sql`

**Probleem:**
Er zijn slechts 5 basisindexen gedefinieerd. Analytics-queries (correlaties, heatmaps,
streaks) en sync-pull-operaties draaien over grote tijdreeksen zonder geoptimaliseerde
samengestelde indexes.

**Oplossing:**
Nieuwe migratie aanmaken (bijv. `008_analytics_indexes.sql`):
```sql
-- Snellere document-queries per gebruiker en type
CREATE INDEX IF NOT EXISTS idx_journal_documents_user_type_key
  ON journal_documents (user_id, doc_type, doc_key);

-- Snellere check-in queries gesorteerd op datum
CREATE INDEX IF NOT EXISTS idx_checkins_user_date
  ON accountability_daily_checkins (user_id, date DESC);

-- Snellere summary-queries voor analytics
CREATE INDEX IF NOT EXISTS idx_daily_summary_user_date
  ON daily_status_summary (user_id, date DESC);

-- Snellere tijdsbereik-queries voor sync
CREATE INDEX IF NOT EXISTS idx_journal_documents_received_at
  ON journal_documents (user_id, server_received_at DESC);
```

---

#### 16. Scheduler-interval voor notificatiejobs verhogen

**Bestand:** `packages/api/src/jobs/scheduler.ts`

**Probleem:**
Notificatiejobs draaien elke 60 seconden (`60_000 ms`) en bevragen alle gebruikers
elke minuut. Dit is extreem belastend bij schaling.

**Oplossing:**
- Verhoog het interval naar minimaal 5 minuten (`300_000 ms`)
- Overweeg Supabase `pg_cron` voor een event-driven aanpak buiten de applicatieserver

---

### 🟡 Medium

#### 17. Cursor-gebaseerde paginering toevoegen aan sync pull

**Bestanden:**
- `packages/api/src/routes/sync.ts`
- `packages/api/src/services/syncService.ts`

**Probleem:**
`MAX_PULL_DOCUMENTS = 1000` trekt tot 1000 documenten tegelijk op zonder paginering.
Bij gebruikers met veel documenten kan dit trage responses en hoog geheugengebruik veroorzaken.

**Oplossing:**
Implementeer cursor-gebaseerde paginering:
```typescript
GET /sync/pull?since=<timestamp>&limit=100&cursor=<lastDocKey>
// Response: { documents: [...], nextCursor: "...", hasMore: true }
```

---

#### 18. Caching voor user settings implementeren

**Bestand:** `packages/api/src/services/userService.ts`

**Probleem:**
`getUserSettings()` wordt bij vrijwel elk beveiligd verzoek aangeroepen — altijd een
database-roundtrip — zonder enige caching.

**Oplossing:**
Voeg een in-memory TTL-cache toe per gebruiker:
```typescript
import NodeCache from "node-cache";
const settingsCache = new NodeCache({ stdTTL: 300 }); // 5 minuten

export async function getUserSettings(userId: string) {
  const cached = settingsCache.get(userId);
  if (cached) return cached;
  const settings = await fetchFromDatabase(userId);
  settingsCache.set(userId, settings);
  return settings;
}
```
Invalideer de cache bij `updateUserSettings()`.

---

#### 19. Background jobs batchen om database-belasting te verminderen

**Bestanden:**
- `packages/api/src/jobs/missedDaysJob.ts`
- `packages/api/src/jobs/backfillSummariesJob.ts`

**Probleem:**
Jobs verwerken alle gebruikers in één doorloop. Bij een grote gebruikersbasis kan dit
lang duren en de database overbelasten.

**Oplossing:**
Verwerk gebruikers in batches met een korte pauze ertussen:
```typescript
const BATCH_SIZE = 50;
const BATCH_DELAY_MS = 1000;

for (let i = 0; i < users.length; i += BATCH_SIZE) {
  const batch = users.slice(i, i + BATCH_SIZE);
  await Promise.all(batch.map(processUser));
  if (i + BATCH_SIZE < users.length) {
    await new Promise(resolve => setTimeout(resolve, BATCH_DELAY_MS));
  }
}
```

---

#### 20. Frontend lazy loading met Astro-directives

**Bestand:** `packages/web/astro.config.mjs` en alle Astro-paginabestanden

**Probleem:**
Zware React-componenten (analytics, charts, accountability) worden altijd geladen,
ook als ze niet direct zichtbaar zijn.

**Oplossing:**
Gebruik Astro's hydration-directives in `.astro`-pagina's:
```astro
<!-- Laad alleen als de component zichtbaar wordt -->
<AnalyticsDashboard client:visible />

<!-- Laad wanneer de browser inactief is -->
<AccountabilityPanel client:idle />

<!-- Laad alleen op specifieke schermformaten -->
<MobileNav client:media="(max-width: 768px)" />
```

---

#### 21. Supabase admin-client gebruik minimaliseren

**Bestanden:**
- `packages/api/src/middleware/auth.ts`
- `packages/api/src/services/userService.ts`

**Probleem:**
De admin-client (service role key, bypast Row Level Security) wordt gebruikt voor
operaties die ook met de reguliere anon-client met gebruikerstoken kunnen.
Dit vergroot het risico als de admin-client wordt misbruikt.

**Oplossing:**
- Gebruik de anon-client met de gebruikerstoken (`getSupabaseClient()`) voor
  alle data-toegang die de gebruiker zelf bezit
- Reserveer `getSupabaseAdminClient()` uitsluitend voor echte admin-operaties
  (gebruikersbeheer, bulk-updates, migraties)

---

### 🟢 Laag

#### 22. Cache-Control headers toevoegen aan statische endpoints

**Bestand:** `packages/api/src/server.ts` en route-handlers

**Probleem:**
Analytics- en period-endpoints retourneren geen caching-headers, waardoor browsers
en tussenliggende proxies de data niet kunnen cachen.

**Oplossing:**
```typescript
// In analytics routes
res.setHeader("Cache-Control", "private, max-age=300"); // 5 minuten
res.json({ success: true, data: analyticsData });
```

---

#### 23. Dexie compound-indexes toevoegen voor offline sync

**Bestand:** `packages/web/src/lib/offline.ts`

**Probleem:**
De Dexie IndexedDB-database heeft geen samengestelde indexes, waardoor sync-queries
langzamer zijn dan nodig.

**Oplossing:**
```typescript
db.version(2).stores({
  documents: "[docType+docKey], clientUpdatedAt, syncedAt",
  syncQueue: "++id, createdAt, retryCount"
});
```

---

#### 24. Dubbele Supabase-key verwijderen

**Bestanden:** `.env`, `packages/api/src/config/index.ts`

**Probleem:**
Zowel `SUPABASE_KEY` als `SUPABASE_ANON_KEY` worden geladen, maar ze bevatten
dezelfde waarde. Dit vergroot het aanvalsoppervlak onnodig.

**Oplossing:**
Verwijder `SUPABASE_KEY` volledig uit de configuratie en gebruik uitsluitend
`SUPABASE_ANON_KEY`.

---

## Samenvatting

| Prioriteit | # | Categorie |
|---|---|---|
| 🔴 Kritiek | 2 | Beveiliging |
| 🔴 Hoog | 5 | Beveiliging (3) + Prestaties (2) |
| 🟡 Medium | 9 | Beveiliging (5) + Prestaties (4) |
| 🟢 Laag | 6 | Beveiliging (3) + Prestaties (3) |
| **Totaal** | **22** | |

### Aanbevolen volgorde van implementatie

1. Roteer alle gelekte credentials en voeg `.env` toe aan `.gitignore` **(direct actie vereist)**
2. Verwijder debug telemetry uit auth-routes
3. Configureer CORS met whitelist
4. Maak rate limiting persistent (Redis)
5. Voeg HTTP-compressie toe
6. Voeg database-indexes toe voor analytics
7. Verhoog scheduler-interval
8. Overige medium en lage prioriteiten
