# Only Today — Frontend Todo

> **Doel:** Stap-voor-stap takenlijst waarmee een developer de volledige MVP frontend kan bouwen.  
> **Referentie:** Lees eerst `blueprint.md` voor context, design system en architectuur.  
> **Conventies:** Elke taak heeft een geschatte complexiteit (S/M/L/XL) en acceptatiecriteria.

---

## Fase 0: Project Setup & Foundation

### 0.1 — Project initialisatie `[S]`

- [x] Initialiseer Astro project in de `web/` directory
- [x] Installeer dependencies: `astro`, `@astrojs/react`, `react`, `react-dom`
- [x] Configureer `astro.config.mjs` met React-integratie en SSG output
- [x] Configureer `tsconfig.json` met strict mode en path aliases (`@/` → `src/`)
- [x] Maak `.env.example` aan met alle benodigde variabelen (zie blueprint §10.4)
- [x] Voeg scripts toe aan `package.json`: `dev`, `build`, `preview`

**Acceptatie:** `npm run dev` start zonder fouten, `npm run build` produceert statische output in `dist/`.

---

### 0.2 — Design tokens & global styles `[M]`

- [x] Maak `src/styles/tokens.css` aan met alle CSS custom properties:
  - Kleuren (light mode als default op `:root`)
  - Dark mode varianten op `[data-theme="dark"]`
  - Spacing schaal (space-1 t/m space-20)
  - Border radius schaal
  - Schaduw varianten (light + dark)
  - Transitie variabelen
  - Typografie variabelen (font families, sizes, weights)
- [x] Maak `src/styles/global.css` aan:
  - CSS reset (box-sizing, margin, html font-size)
  - Base typografie (body, headings h1–h3, p, a, small)
  - Focus-visible styling (gouden ring)
  - `prefers-reduced-motion` media query
  - Scrollbar styling (subtiel, passend bij theme)
- [x] Maak `src/styles/utilities.css` aan:
  - `.sr-only` (screen reader only)
  - `.sr-skip-link` (skip to content)
  - `.truncate` (text overflow ellipsis)
  - `.visually-hidden`
- [x] Laad Google Fonts in Astro head: Bellefair 400, Source Sans 3 (400, 600), JetBrains Mono 400
- [x] Importeer alle stylesheets in een base Astro layout

**Acceptatie:** Pagina's gebruiken correct de design tokens. Dark mode schakelt alle kleuren om via data-theme attribuut. Fonts laden met display=swap.

---

### 0.3 — Base layout & pagina-structuur `[M]`

- [x] Maak `src/components/layout/AppShell.astro`:
  - Slot voor sidebar (desktop) en main content
  - Responsieve grid: sidebar + main op desktop, stacked op mobile
  - Import global styles
- [x] Maak `src/components/layout/AppShell.css`:
  - Desktop: sidebar 240px vast, main flex-grow
  - Mobile: sidebar verborgen, full-width main
  - Transitie voor sidebar collapse
- [x] Maak placeholder pagina's aan in `src/pages/`:
  - `index.astro` (redirect logica)
  - `login.astro`
  - `register.astro`
  - `forgot-password.astro`
  - `onboarding.astro`
  - `today.astro`
  - `planning/index.astro`
  - `planning/quarter.astro`
  - `planning/month.astro`
  - `planning/week.astro`
  - `calendar.astro`
  - `accountability.astro`
  - `analytics.astro`
  - `settings.astro`
- [x] Elke pagina gebruikt AppShell als layout

**Acceptatie:** Alle routes zijn bereikbaar. Layout schaalt correct van mobile naar desktop. Sidebar toont/verbergt op juiste breakpoint.

---

### 0.4 — Navigatie componenten `[M]`

- [x] Maak `src/components/layout/Sidebar.tsx` + `.css`:
  - Logo bovenaan
  - Nav-items met Lucide iconen + labels (zie blueprint §5.3)
  - Actieve route highlighting (gouden accent)
  - Navy achtergrond (#071333)
  - Inklapbaar naar icon-only modus (64px breed)
  - Collapse toggle knop
  - Settings onderaan, gescheiden door lijn
- [x] Maak `src/components/layout/MobileNav.tsx` + `.css`:
  - Fixed bottom tab bar
  - 5 items: Vandaag, Planning, Kalender, Analyse, Instellingen
  - Actieve tab: gouden icoon + label
  - Niet-actief: muted kleur, alleen icoon
  - Badge support (voor unread check-ins)
- [x] Maak `src/components/layout/Header.tsx` + `.css`:
  - Desktop: datum (dd-mm-yyyy), streak counter, settings icoon
  - Mobile: logo links, datum midden, hamburger/menu rechts
  - Compact variant voor mobile
- [x] Integreer navigatie in AppShell:
  - Sidebar op ≥1024px
  - MobileNav op <1024px
  - Header altijd zichtbaar

**Acceptatie:** Navigatie werkt op alle breakpoints. Actieve route is visueel duidelijk. Sidebar kan inklapppen. MobileNav heeft correcte highlight. Keyboard navigatie werkt (tab door items).

---

## Fase 1: UI Component Library

### 1.1 — Button component `[S]`

- [x] `src/components/ui/Button.tsx` + `Button.css`
- [x] Varianten: `primary` (goud), `secondary` (outline), `ghost` (transparant), `danger` (rood)
- [x] Sizes: `sm`, `md`, `lg`
- [x] States: default, hover, active, disabled, loading (met spinner)
- [x] Icon support: `leftIcon`, `rightIcon` props
- [x] Full-width optie
- [x] Correcte aria-attributen (aria-disabled, aria-busy voor loading)
- [x] Focus-visible ring

**Acceptatie:** Alle varianten zijn visueel consistent met design system. Disabled state voorkomt clicks. Loading toont spinner en disabled interactions.

---

### 1.2 — Form componenten `[M]`

- [x] `Input.tsx` + `.css`: tekstveld met label, error state, helper text, icoon links/rechts
- [x] `Textarea.tsx` + `.css`: meerdere regels, auto-resize optie, character counter
- [x] `Checkbox.tsx` + `.css`: custom checkbox met animatie (scale bounce), label rechts
- [x] `Toggle.tsx` + `.css`: switch component voor aan/uit, met label
- [x] `Select.tsx` + `.css`: dropdown met custom styling, placeholder support
- [x] `Slider.tsx` + `.css`: range slider (voor levenswiel 1–10), waarde-label, gouden track
- [x] Alle componenten:
  - Geassocieerde `<label>` via htmlFor/id
  - Error state met `aria-describedby` naar foutmelding
  - `aria-required` waar nodig
  - Focus-visible styling
  - Dark mode compatible

**Acceptatie:** Elk form component functioneert in isolatie. Error states tonen rode border + foutmelding. Keyboard navigatie (tab, space/enter) werkt correct. Screen reader leest labels en errors.

---

### 1.3 — Feedback componenten `[M]`

- [x] `Card.tsx` + `.css`: container met padding, border-radius, shadow. Varianten: `default`, `elevated`, `accent` (gouden rand)
- [x] `Badge.tsx` + `.css`: klein label. Varianten: `success`, `warning`, `error`, `neutral`, `accent`
- [x] `ProgressBar.tsx` + `.css`: horizontale balk met animatie. Props: value (0–100), variant (accent/success)
- [x] `Spinner.tsx` + `.css`: loading indicator. Sizes: sm, md, lg. Kleuren volgen theme
- [x] `Toast.tsx` + `.css`:
  - Slide-in van rechts
  - Varianten: success, error, warning, info
  - Auto-dismiss na 5 seconden
  - Handmatig sluiten
  - Gestapeld (meerdere toasts)
  - `aria-live="polite"` voor screen readers
- [x] `EmptyState.tsx` + `.css`: icoon + titel + beschrijving + optionele CTA
- [x] `Tooltip.tsx` + `.css`: hover/focus tooltip met pijl, positie configureerbaar

**Acceptatie:** Alle componenten volgen design tokens. Toast stapeling werkt. Progress bar animate soepel. Screen readers melden toast-berichten.

---

### 1.4 — Modal & Dialog componenten `[M]`

- [x] `Modal.tsx` + `.css`:
  - Backdrop overlay (fade-in)
  - Content (scale + fade-in)
  - Sluit met Escape-toets
  - Sluit bij klik op backdrop
  - Focus trap (tab cyclet binnen modal)
  - `aria-modal="true"`, `role="dialog"`
  - Titel + content + footer slots
  - Sizes: `sm` (400px), `md` (560px), `lg` (720px)
- [x] `ConfirmDialog.tsx` + `.css`:
  - Bouwt voort op Modal
  - Titel + beschrijving + bevestig/annuleer knoppen
  - Destructieve variant (rode bevestig-knop)
  - "Weet je het zeker?" patroon

**Acceptatie:** Modal vangt focus correct. Escape sluit modal. Backdrop click sluit modal. Tab-navigatie blijft binnen modal.

---

## Fase 2: Contexten, Hooks & Infrastructuur

### 2.1 — Theme systeem `[S]`

- [x] `src/context/ThemeContext.tsx`: Provider met `theme` state ("light" | "dark" | "system")
- [x] `src/hooks/useTheme.ts`: Hook die theme uitleest en toggle functie biedt
- [x] Initialisatie: check localStorage → dan `prefers-color-scheme` → fallback "light"
- [x] Bij wijziging: set `data-theme` attribuut op `<html>`, sla op in localStorage
- [x] CSS transitie op theme switch (300ms op alle color properties)

**Acceptatie:** Theme wisselt real-time zonder page reload. Voorkeur persisted over sessies. "System" optie volgt OS instelling.
**Status:** Gedeeltelijk gevalideerd (implementatie + build/lint). Nog handmatige UI-test nodig voor live switch en system-theme gedrag.

---

### 2.2 — i18n systeem `[M]`

- [x] `src/i18n/config.ts`: default locale ("nl"), supported locales, date format per locale
- [x] `src/i18n/nl.json`: complete Nederlandse vertalingen voor alle schermen
- [x] `src/i18n/en.json`: complete Engelse vertalingen
- [x] `src/i18n/de.json`: complete Duitse vertalingen
- [x] `src/i18n/useTranslation.ts`: React hook
  - `t('key.path')` → vertaalde string
  - `t('key.path', { name: 'value' })` → met interpolatie
  - Fallback naar NL als key niet bestaat
- [x] `src/context/I18nContext.tsx`: Provider met huidige locale
- [x] Locale opslaan in localStorage
- [x] Datumformattering via date-fns locale

**Acceptatie:** Alle UI-teksten komen uit vertaalbestanden (geen hardcoded tekst in componenten). Taalswitch werkt instant. Datums formatteren correct per locale (dd-mm-yyyy voor NL).
**Status:** Gedeeltelijk gevalideerd (implementatie + build/lint). Nog handmatige test nodig voor runtime taalswitch en visuele controle op alle schermen.

---

### 2.3 — Auth context & hooks `[M]`

- [x] `src/context/AuthContext.tsx`:
  - Houdt bij: user object, session tokens, loading state, isAuthenticated
  - Bij app start: check bestaande sessie (localStorage/cookie)
  - Biedt: login(), register(), logout(), refreshToken()
- [x] `src/hooks/useAuth.ts`: hook die AuthContext consumed
- [x] `src/lib/supabase.ts`: Supabase client initialisatie met env vars
- [x] `src/lib/auth.ts`: Auth helpers die Supabase auth wrappen
- [x] `src/lib/api.ts`:
  - Fetch wrapper die automatisch auth headers toevoegt
  - Automatische token refresh bij 401
  - Error parsing naar standaard format
  - Typed responses

**Acceptatie:** Login/register flow werkt end-to-end met Supabase. Token refresh is transparant. Niet-ingelogde gebruikers worden geredirect naar `/login`.
**Status:** Gedeeltelijk gevalideerd (guard + refresh pad geïmplementeerd). Nog handmatige/E2E test nodig met echte Supabase credentials.

---

### 2.4 — Offline & sync hooks `[M]`

- [x] `src/lib/offline.ts`:
  - IndexedDB setup (Dexie of idb-keyval)
  - Stores: `documents`, `syncQueue`, `settings`
  - CRUD operaties voor documents
  - Queue operaties voor pending syncs
- [x] `src/hooks/useOfflineSync.ts`:
  - Detecteer online/offline status
  - Bij online: verwerk sync queue
  - Bij offline: queue writes
  - Conflict detectie + melding aan gebruiker
  - Sync status: "synced" | "syncing" | "offline" | "error"
- [x] `src/hooks/useDocument.ts`:
  - `getDocument(docType, docKey)` → uit IndexedDB
  - `saveDocument(doc)` → naar IndexedDB + sync queue
  - `subscribeToChanges(docType, docKey, callback)`
- [x] Offline indicator in Header:
  - Bannermelding bij offline
  - Sync icoon met status

**Acceptatie:** App blijft functioneel zonder internet. Wijzigingen worden lokaal opgeslagen. Bij herverbinding worden changes gesyncet. Conflict toont keuze-dialog.
**Status:** Gedeeltelijk gevalideerd (offline queue/sync infrastructuur + header indicator aanwezig). Nog handmatige test nodig voor offline/online overgang en conflictscenario.

---

### 2.5 — Pomodoro hook `[S]`

- [x] `src/hooks/usePomodoro.ts`:
  - State: `idle` | `running` | `paused` | `break` | `completed`
  - Timer: countdown van 25:00 (configureerbaar via constants)
  - Start, pauze, hervat, stop functies
  - Bij 0:00: trigger notificatie + automatisch break timer (5 min)
  - Track: welke taak, welke pomodoro nummer
  - Browser Notification API (vraag toestemming)
- [x] Constanten uit `src/lib/constants.ts`

**Acceptatie:** Timer telt correct af. Pauze en hervat werken. Notification verschijnt bij einde. Break timer start automatisch. State wordt correct bijgehouden.
**Status:** Gedeeltelijk gevalideerd (state machine en notificatieflow geïmplementeerd). Nog handmatige test nodig voor timergedrag en browser notification permissies.

### 2.6 — Handmatige testchecklist Fase 2 `[S]`

- [x] **Theme switch:** wissel tussen light/dark/system en controleer directe UI-update zonder reload
- [x] **Theme persistence:** refresh pagina en heropen browser; controleer of gekozen theme behouden blijft
- [x] **System theme:** zet OS op dark/light terwijl app op system staat; controleer of theme meeschakelt
- [x] **i18n switch:** wissel `nl/en/de`; controleer dat labels in header/sidebar/mobile nav direct wijzigen
- [x] **Date locale:** controleer datumweergave per locale (`nl: dd-mm-yyyy`, `en: mm/dd/yyyy`, `de: dd.mm.yyyy`)
- [x] **Auth guard:** open protected route zonder token; controleer redirect naar `/login`
- [ ] **Auth refresh:** forceer verlopen access token met geldige refresh token; controleer transparante retry
- [ ] **Offline banner:** zet browser offline; controleer banner en sync status in header
- [ ] **Offline queue:** maak documentwijziging offline, ga online; controleer dat queue wordt verwerkt
- [ ] **Sync error pad:** simuleer API-fout tijdens sync; controleer status `error` en herstelgedrag
- [ ] **Pomodoro flow:** start/pauze/hervat/stop; controleer state-overgangen en countdown
- [ ] **Pomodoro notifications:** verleen permissie, laat timer aflopen; controleer focus-einde + automatische break-notificatie

---

## Fase 3: Auth Schermen

### 3.1 — Login pagina `[M]`

- [x] `src/components/auth/LoginForm.tsx` + `.css`:
  - E-mail + wachtwoord velden
  - "Inloggen" knop (primary)
  - "Wachtwoord vergeten?" link
  - "Account aanmaken" link
  - Validatie: verplichte velden, email format
  - Loading state op button tijdens API call
  - Error melding bij verkeerde credentials
- [x] `src/pages/login.astro`:
  - Geen AppShell (eigen layout)
  - Gecentreerd formulier
  - Logo + tagline prominent
  - Navy achtergrond (#071333) met gouden accenten
  - Premium, clean uitstraling
- [x] Redirect naar `/today` na succesvolle login
- [x] Redirect naar `/onboarding` als gebruiker nieuw is (geen quarter document)

**Acceptatie:** Succesvol inloggen redirect naar today. Fout toont leesbare melding. Tab-navigatie door formulier werkt. Responsive op alle breakpoints.

---

### 3.2 — Register pagina `[M]`

- [x] `src/components/auth/RegisterForm.tsx` + `.css`:
  - E-mail + wachtwoord + bevestig wachtwoord
  - Wachtwoord-sterkte indicator (visuele bar: zwak/matig/sterk)
  - Min 8 karakters validatie
  - Voorwaarden checkbox
  - "Account aanmaken" knop
  - Error handling (email al in gebruik, etc.)
- [x] `src/pages/register.astro`:
  - Zelfde layout als login (consistentie)
  - "Al een account? Inloggen" link

**Acceptatie:** Account wordt aangemaakt in Supabase. Wachtwoord sterkte indicator werkt. Bevestig wachtwoord moet matchen. Na register → redirect naar onboarding.

---

### 3.3 — Wachtwoord vergeten `[S]`

- [x] `src/components/auth/ForgotPassword.tsx` + `.css`:
  - E-mail veld
  - "Verstuur reset link" knop
  - Bevestigingsmelding ("Check je inbox")
  - Terug naar login link
- [x] `src/pages/forgot-password.astro`

**Acceptatie:** E-mail wordt verstuurd via Supabase. Bevestiging wordt getoond ongeacht of email bestaat (security). Link terug naar login werkt.

---

## Fase 4: Onboarding (Start Sterk)

### 4.1 — Onboarding wizard container `[M]`

- [x] `src/components/auth/OnboardingWizard.tsx` + `.css`:
  - Multi-step wizard (4 stappen)
  - Progress indicator bovenaan (stappen-balk met nummers)
  - Volgende/Vorige navigatie
  - Stap-validatie (kan niet verder zonder verplichte velden)
  - Stap-transitie animatie (fade + slide)
  - Eigen full-screen layout (geen sidebar)
- [x] `src/pages/onboarding.astro`:
  - Beschermde route (moet ingelogd zijn)
  - Redirect naar `/today` als onboarding al afgerond

**Acceptatie:** Wizard navigeert vooruit en achteruit. Progress bar update correct. Validatie voorkomt doorgaan zonder vereiste input.

---

### 4.2 — Stap 1: Welkom `[S]`

- [x] Welkom-scherm in OnboardingWizard:
  - Hero: "Welkom bij Only Today" (Bellefair, groot)
  - 3 korte bullets over het systeem
  - CTA: "Begin je kwartaal" → volgende stap
  - Premium feel: navy bg, gouden accenten, subtiele animatie

**Acceptatie:** Visueel aantrekkelijk, consistent met branding. CTA navigeert naar stap 2.

---

### 4.3 — Stap 2: Levenswiel `[L]`

- [x] `src/components/planning/LifeWheel.tsx` + `.css`:
  - 8 categorieën: Werk, Plezier, Sociaal, Geven, Geld, Groei, Gezondheid, Liefde
  - Per categorie: Slider component (1–10)
  - Radarchart/spider diagram visualisatie (SVG of Canvas)
    - Gouden lijnen op navy achtergrond
    - Real-time update bij slider-wijziging
    - Geanimeerde transitie bij waarde-verandering
  - Labels rondom het diagram
  - Responsive: diagram + sliders naast elkaar op desktop, gestapeld op mobile

**Acceptatie:** Alle 8 categorieën zijn instelbaar. Diagram update live. Visueel premium (goud op navy). Werkt op mobile en desktop. Sliders zijn keyboard-accessible (pijltoetsen).

---

### 4.4 — Stap 3: Kwartaaldoelen `[L]`

- [x] `src/components/planning/GoalEditor.tsx` + `.css`:
  - 3 doel-kaarten (altijd exact 3)
  - Per doel:
    - Titel (verplicht, text input)
    - "Wat is anders als ik dit bereikt heb?" (textarea)
    - "Wat gebeurt er als ik het niet bereik?" (textarea)
    - "Welke beloning geef ik mezelf?" (textarea)
    - Voortgang slider (0–100%, standaard 0%)
  - Kaart-nummering: Doel 1, 2, 3
  - Validatie: alle titels moeten ingevuld zijn
  - Accordeon-stijl of volledige weergave (developer keuze, mits overzichtelijk)

**Acceptatie:** Exact 3 doelen verplicht. Kan niet naar volgende stap zonder 3 titels. Voortgang slider werkt.

---

### 4.5 — Stap 4: Bevestiging `[S]`

- [x] Bevestigingsscherm:
  - Samenvatting levenswiel (mini-diagram, read-only)
  - Samenvatting 3 doelen (titels + voortgang)
  - CTA: "Start je eerste dag" → sla op (API/IndexedDB) + redirect `/today`
  - Opslaan: maak `quarter` document aan met levenswiel scores + doelen

**Acceptatie:** Data wordt correct opgeslagen. Redirect naar `/today`. Bij terugkomen op `/onboarding` → redirect naar `/today`.

---

## Fase 5: Today Screen (Hoofdscherm)

### 5.1 — Today screen container `[M]`

- [x] `src/components/today/TodayScreen.tsx` + `.css`:
  - Verticale scrollbare container
  - Secties in volgorde: DayStart → Mindset → EEN → DRIE → Overige → Levenszagen → Dag afronden
  - Status indicator bovenaan: datum + status badge
  - Max-width 720px gecentreerd op desktop
  - Full-width op mobile
  - Staggered fade-in animatie per sectie bij laden
  - Read-only modus als dag gesloten of auto-gesloten (visuele overlay + melding)
- [x] `src/pages/today.astro`:
  - Beschermde route
  - AppShell layout
  - Laad TodayScreen als `client:load` island
- [x] Dag document laden/aanmaken:
  - Check of document voor vandaag bestaat in IndexedDB
  - Zo niet: maak leeg dag-document aan
  - Morgen is ook al beschikbaar (24u vooraf)

**Acceptatie:** Pagina laadt met correcte datum. Secties tonen in juiste volgorde. Read-only modus werkt voor gesloten dagen. Morgen is bereikbaar.

---

### 5.2 — Dagstart checklist `[M]`

- [x] `src/components/today/DayStartChecklist.tsx` + `.css`:
  - Card container met titel "Dagstart"
  - 4 checkbox items:
    - 8 uur geslapen
    - 3 glazen water
    - 5 min meditatie
    - 5 min mobility
  - Circulaire progress ring (SVG) die vult: 0/4 → 4/4
  - Check-animatie: scale bounce bij aanvinken
  - Auto-save bij elke toggle (naar IndexedDB + sync queue)
  - Status indicator: "0 van 4" of "Compleet ✓"

**Acceptatie:** Checkboxes toggelen correct. Progress ring update real-time. Data persisted (herlaad pagina → staat er nog). Animatie speelt bij check.

---

### 5.3 — Mindset sectie `[S]`

- [x] `src/components/today/MindsetSection.tsx` + `.css`:
  - Card met subtiele gouden rand
  - Tekstveld: "Ik ben dankbaar voor…"
  - Tekstveld: "Mijn intentie voor vandaag"
  - Auto-save bij blur of na 2 seconden inactiviteit (debounce)
  - Warm, uitnodigend design

**Acceptatie:** Tekst wordt opgeslagen. Debounced auto-save werkt. Gouden rand zichtbaar. Placeholder teksten komen uit i18n.

---

### 5.4 — EEN (One Thing) kaart `[M]`

- [x] `src/components/today/OneThingCard.tsx` + `.css`:
  - Prominente kaart (groter dan DRIE, gouden accent rand)
  - Label: "Je EEN" (Bellefair heading)
  - Titel input (verplicht)
  - Omschrijving textarea
  - Pomodoro planner: 1–6 klikbare tomatjes (cirkels)
    - Klik = toggle gepland
    - Aparte indicator voor voltooid (gevulde cirkel)
  - "Start Pomodoro" knop → opent PomodoroTimer
  - Status: "2 van 4 pomodoro's voltooid"
  - Auto-save

**Acceptatie:** Kaart is visueel prominent (hiërarchie boven DRIE). Pomodoro's zijn klikbaar. Start Pomodoro opent timer. Data saved.

---

### 5.5 — DRIE (Top Three) lijst `[M]`

- [x] `src/components/today/TopThreeList.tsx` + `.css`:
  - 3 genummerde kaarten (1, 2, 3)
  - Elk met: titel, omschrijving, pomodoro planner (zelfde als EEN maar compacter)
  - Visueel kleiner dan EEN (hiërarchie)
  - Verplicht: alle 3 titels moeten ingevuld worden voor dag afronden
  - `TaskItem.tsx` als herbruikbaar sub-component
- [x] `src/components/today/TaskItem.tsx` + `.css`:
  - Herbruikbaar voor EEN en DRIE
  - Props: title, description, pomodorosPlanned, pomodorosDone, variant ("one" | "three")
  - Checkbox voor "voltooid"

**Acceptatie:** 3 kaarten tonen altijd. Visuele hiërarchie klopt (kleiner dan EEN). Pomodoro planner werkt per taak.

---

### 5.6 — Overige taken `[S]`

- [x] `src/components/today/OtherTasksList.tsx` + `.css`:
  - Inklapbare sectie (standaard ingeklapt)
  - "Overige taken" header met chevron
  - Vrije takenlijst: toevoegen (input + enter/knop), verwijderen, afvinken
  - Geen pomodoro's — eenvoudige checkboxes
  - "Parking lot" label/beschrijving

**Acceptatie:** Sectie klapt in/uit. Taken zijn toevoegbaar, verwijderbaar en afvinkbaar. Auto-save.

---

### 5.7 — Levenszagen `[M]`

- [x] `src/components/today/LifePillars.tsx` + `.css`:
  - 4 grote toggle-kaarten:
    - 🏋️ Training
    - 🧘 Diepe ontspanning
    - 🥗 Gezonde voeding
    - 💬 Echte verbinding
  - Bij afvinken: kaart krijgt gouden achtergrond + check-icoon (animatie)
  - Progress: "2 van 4 pijlers"
  - Grid: 2x2 op desktop, 1 kolom op mobile
  - Auto-save

**Acceptatie:** 4 pijlers tonen. Toggle werkt met visuele feedback (gouden achtergrond). Progress telt correct. Responsive grid.

---

### 5.8 — Pomodoro timer `[L]`

- [x] `src/components/today/PomodoroTimer.tsx` + `.css`:
  - Modal of overlay (full-screen optie op mobile)
  - Grote circulaire timer (SVG ring die leegloopt)
  - Digitale tijdsweergave (JetBrains Mono, 48px)
  - Taaknaam bovenaan
  - Knoppen: Start ▶ / Pauze ⏸ / Stop ⏹
  - Pulserende gouden glow-ring tijdens actieve focus
  - Bij 0:00:
    - Browser Notification: "Pomodoro klaar! Tijd voor pauze."
    - Geluidssignaal (optioneel, configureerbaar)
    - Automatisch 5 min break timer
  - Pomodoro teller: "Pomodoro 2/4 voor [taaknaam]"
  - Bij break einde: notificatie "Pauze voorbij!"
  - Sla voltooide pomodoro op (pomodorosDone++)

**Acceptatie:** Timer telt nauwkeurig af (geen drift). Pauze/hervat werkt. Notificatie verschijnt. Break timer start automatisch. Pomodoro count wordt bijgewerkt in de taak.

---

### 5.9 — Dag afronden flow `[L]`

- [x] `src/components/today/DayCloseFlow.tsx` + `.css`:
  - Modal of overlay met multi-stap flow
  - Voorwaarde: EEN + DRIE moeten ingevuld zijn (anders disabled met uitleg)
- [x] Stap 1 — `CloseChecklist.tsx` + `.css`:
  - 4 checkboxes:
    - 2 uur voor slapen geen scherm
    - 3 uur voor slapen geen koolhydraten
    - Planning voor morgen gemaakt
    - Doelen bekeken
  - Volgende knop
- [x] Stap 2 — `ReflectionForm.tsx` + `.css`:
  - 6 textareas (alle verplicht):
    - Wat ging er goed?
    - Waarom ging het goed?
    - Hoe kan ik dit herhalen?
    - Wat ging er fout?
    - Waarom ging het fout?
    - Wat doe ik volgende keer anders?
  - Validatie: alle velden moeten ingevuld zijn
- [x] Stap 3 — `DaySummary.tsx` + `.css`:
  - Dag-samenvatting: stats van de dag
  - Checkmark animatie (SVG draw, 600ms)
  - Boodschap: "Goed gedaan. Rust lekker."
  - Sluit knop → dag status wordt "closed"
  - Opslaan naar IndexedDB + sync

**Acceptatie:** Flow voorkomt sluiten zonder reflectie. Alle verplichte velden enforced. SVG checkmark animeert. Dag status wordt "closed". Gesloten dag is read-only bij terugkomen.

---

## Fase 6: Period Planning Schermen

### 6.1 — Planning overzicht `[M]`

- [x] `src/components/planning/PeriodOverview.tsx` + `.css`:
  - Tabs of segmented control: Kwartaal | Maand | Week
  - Toont actieve periode
  - Per tab: lijst van doelen met voortgang
- [x] `src/pages/planning/index.astro`

**Acceptatie:** Tabs wisselen content. Correcte periode wordt getoond. Doelen laden uit IndexedDB.

---

### 6.2 — Kwartaal view `[M]`

- [x] `src/pages/planning/quarter.astro` + QuarterStart React component
- [x] Toont:
  - Levenswiel (read-only LifeWheel component, compact)
  - "Opnieuw scoren" knop (opent editor-modus)
  - 3 kwartaaldoelen met:
    - Titel, beschrijvingen
    - Voortgangsslider (bewerkbaar)
    - Progressbar
    - Gekoppelde maanddoelen (als lijst/links)
- [x] `GoalProgressCard.tsx` + `.css`: herbruikbare kaart per doel

**Acceptatie:** Levenswiel toont correct. Doelen zijn bewerkbaar. Voortgang slider update progressbar. Links naar gekoppelde maanddoelen.

---

### 6.3 — Maand & Week views `[M]`

- [x] `src/pages/planning/month.astro` + MonthStart React component
- [x] `src/pages/planning/week.astro` + WeekStart React component
- [x] Maanddoelen:
  - Per doel: titel, beschrijving, voortgang, gekoppeld kwartaaldoel (dropdown/link)
  - "Nieuw maanddoel" knop
- [x] Weekdoelen:
  - Zelfde structuur als maand
  - Extra: week-overzicht met 7 dag-mini-statusjes (afgerond/open/gemist — kleurcodes)
  - Gekoppeld aan maanddoel

**Acceptatie:** Doelen zijn aanmaakbaar en bewerkbaar. Koppeling met hoger doel werkt. Week toont 7-dagen overzicht.

---

## Fase 7: Calendar / History

### 7.1 — Calendar heatmap `[L]`

- [x] `src/components/calendar/CalendarHeatmap.tsx` + `.css`:
  - Jaar-overzicht in GitHub-style grid (52 weken × 7 dagen)
  - Kleurintensiteit = completeness score (0% → transparant, 100% → vol goud)
  - Maandlabels bovenaan
  - Dag-van-de-week labels links
  - Hover: tooltip met datum + score
  - Klik: open DayDetailModal
- [x] `src/components/calendar/CalendarView.tsx` + `.css`:
  - Toggle: Heatmap | Maandweergave
  - Jaar-selector (pijlen links/rechts)
- [x] `src/pages/calendar.astro`

**Acceptatie:** Heatmap toont correct voor het hele jaar. Kleuren schalen met completeness. Klik opent detail. Responsive (horizontaal scrollbaar op mobile).

---

### 7.2 — Maand grid & dag detail `[M]`

- [x] `src/components/calendar/MonthGrid.tsx` + `.css`:
  - Traditioneel kalenderraster (ma–zo)
  - Per dag: mini status-icoon/kleur
  - Navigatie: vorige/volgende maand
- [x] `src/components/calendar/DayDetailModal.tsx` + `.css`:
  - Read-only weergave van een specifieke dag
  - Secties: Dagstart score, Mindset, EEN + DRIE, Levenszagen, Reflectie
  - Sluit met Escape of backdrop click

**Acceptatie:** Maandgrid toont correcte dagen. Detail modal toont alle dag-data. Read-only (geen editing).

---

## Fase 8: Accountability

### 8.1 — Buddy setup & overzicht `[M]`

- [x] `src/components/accountability/BuddyOverview.tsx` + `.css`:
  - Als geen buddy: EmptyState + uitnodigingsflow
  - Als wel buddy: partner status + check-in interface
- [x] `src/components/accountability/PairSetup.tsx` + `.css`:
  - "Nodig een buddy uit" flow
  - Genereert invite-link of stuurt e-mail
  - Accepteer-flow voor ontvanger
- [x] `src/components/accountability/PartnerStatus.tsx` + `.css`:
  - Partner naam/avatar
  - Vandaag status: dag afgesloten? / EEN gedaan? / Reflectie ingevuld?
  - Visueel: 3 indicatoren (groen check / rood kruis / grijs onbekend)
  - Partner streak
- [x] `src/pages/accountability.astro`

**Acceptatie:** Zonder buddy toont lege state met uitleg. Met buddy toont high-level status (geen details). Pair setup flow werkt.

---

### 8.2 — Check-in systeem `[S]`

- [x] `src/components/accountability/CheckinComposer.tsx` + `.css`:
  - Tekstveld (max 500 karakters) met teller
  - "Verstuur" knop
  - Max 1 check-in per dag (disabled na versturen)
- [x] `src/components/accountability/CheckinHistory.tsx` + `.css`:
  - Chronologische lijst van ontvangen + verstuurde check-ins
  - Datum + afzender + bericht
  - Visueel onderscheid tussen eigen en partner check-ins

**Acceptatie:** Check-in verstuurt en verschijnt in history. Max 1 per dag enforced. Character limit werkt.

---

## Fase 9: Analytics

### 9.1 — Analytics dashboard `[L]`

- [x] `src/components/analytics/AnalyticsDashboard.tsx` + `.css`:
  - Periode selector: 7 dagen / 30 dagen / kwartaal
  - Grid van kaarten met charts
- [x] `src/components/analytics/CompletionChart.tsx` + `.css`:
  - Lijndiagram: dag-afsluiting rate over tijd
  - Gebruik SVG of lichtgewicht chart library (bv. recharts als beschikbaar, of custom SVG)
- [x] `src/components/analytics/PomodoroChart.tsx` + `.css`:
  - Staafdiagram: gepland vs voltooid per dag/week
- [x] `src/components/analytics/StreakDisplay.tsx` + `.css`:
  - Grote getallen: "12 dagen op rij"
  - Sub-streaks: per pijler, dagstart, etc.
- [x] `src/components/analytics/PillarAdherence.tsx` + `.css`:
  - 4 mini progress bars (per levenszaag)
  - Percentage label
- [x] `src/components/analytics/CorrelationInsight.tsx` + `.css`:
  - Inzichtskaart: "Dagstart compleet → 85% vaker dag afgesloten"
  - Visueel: twee verbonden metrics
- [x] `src/pages/analytics.astro`

**Acceptatie:** Alle 6 kaarten tonen data. Periode selector filtert correct. Charts zijn responsive. Lege state bij geen data.

---

## Fase 10: Settings

### 10.1 — Settings scherm `[M]`

- [x] `src/components/settings/SettingsPanel.tsx` + `.css`:
  - Secties met duidelijke scheiding
- [x] `src/components/settings/ProfileSection.tsx` + `.css`:
  - Naam (bewerkbaar), e-mail (read-only)
- [x] `src/components/settings/NotificationPrefs.tsx` + `.css`:
  - Toggle: dagstart herinnering + tijdkiezer
  - Toggle: dag-afsluiting herinnering + tijdkiezer
  - Toggle: push-notificaties
  - Toggle: e-mail escalaties
- [x] `src/components/settings/ThemeToggle.tsx` + `.css`:
  - 3 opties: Licht / Donker / Systeem
  - Segmented control of radio buttons
- [x] `src/components/settings/LanguageSelector.tsx` + `.css`:
  - Dropdown: Nederlands / English / Deutsch
- [x] `src/components/settings/AccountSection.tsx` + `.css`:
  - Wachtwoord wijzigen (modal met oud + nieuw wachtwoord)
  - Account verwijderen (destructieve actie, dubbele bevestiging)
  - Tijdzone dropdown
- [x] `src/pages/settings.astro`

**Acceptatie:** Alle settings zijn opslaan-baar. Theme wisselt direct. Taal wisselt direct. Account verwijderen vraagt dubbele bevestiging. Data persisted.

---

## Fase 11: Polish & Integratie

### 11.1 — Page transitions & loading states `[S]`

- [x] `src/components/layout/PageTransition.tsx` + `.css`:
  - Fade + translateY animatie bij pagina-wissel
  - Consistente laad-ervaring
- [x] Skeleton loaders voor kaarten en lijsten
- [x] Spinner/loading state op alle async operaties
- [x] Error boundaries rond React eilanden

**Acceptatie:** Pagina-overgangen voelen soepel. Laden toont skeleton/spinner. Fouten crashen niet de hele app.

---

### 11.2 — Conflict resolution UI `[M]`

- [x] Sync conflict dialog:
  - Melding: "Er was een sync conflict"
  - Toon beide versies (lokaal vs server) met timestamps
  - Keuze: "Gebruik mijn versie" / "Gebruik server versie"
  - Na keuze: opslaan en sync
- [x] Integreer in useOfflineSync hook

**Acceptatie:** Bij gesimuleerd conflict verschijnt dialog. Keuze wordt correct verwerkt. Na keuze verdwijnt conflict.

---

### 11.3 — Analytics integratie (GTM) `[S]`

- [x] Google Tag Manager script in Astro head
- [x] DataLayer push helper functie
- [x] Events implementeren conform blueprint §9.2 (sign_up, login, day_closed, etc.)
- [x] Consent-banner placeholder (voor cookie-compliance)

**Acceptatie:** GTM laadt correct. Events verschijnen in GTM debug modus. Geen tracking zonder consent.

---

### 11.4 — SEO & Meta `[S]`

- [x] Favicon set (16, 32, 180, 192, 512 — navy achtergrond met goud accent)
- [x] Open Graph meta tags per pagina
- [x] `<title>` per pagina (via Astro head)
- [x] `robots.txt` (blokkeer auth pagina's)
- [x] `sitemap.xml` (via Astro integratie)
- [x] `manifest.json` (PWA basis — toekomst)

**Acceptatie:** Sociale previews tonen correct. Favicon zichtbaar. Auth pagina's niet geïndexeerd.

---

### 11.5 — Automatisch dag sluiten (48u) `[S]`

- [x] Client-side check bij laden Today-scherm:
  - Als dag >48 uur oud en status is "open" → set naar "auto_closed"
  - Toon melding: "Deze dag is automatisch afgesloten"
  - Dag wordt read-only (geen reflectie vereist)
- [x] Visueel: andere badge-kleur voor "auto_closed" vs "closed"

**Acceptatie:** Dag van >48u geleden wordt automatisch gesloten bij laden. Read-only modus actief. Melding getoond.

---

### 11.6 — Responsiveness audit `[M]`

- [x] Test alle schermen op:
  - 375px (iPhone SE)
  - 390px (iPhone 14)
  - 640px (sm breakpoint)
  - 768px (tablet)
  - 1024px (desktop start)
  - 1280px (breed desktop)
- [x] Fix overflow issues
- [x] Fix touch targets (minimaal 44×44px)
- [x] Fix tekst dat afkapt
- [x] Fix modals op kleine schermen

**Acceptatie:** Geen horizontale scroll op enig scherm. Alle touch targets ≥44px. Tekst is leesbaar op alle formaten. Modals zijn bruikbaar op mobile.

---

### 11.7 — Accessibility audit `[M]`

- [x] Run axe DevTools op alle pagina's
- [x] Fix alle kleur-contrast issues
- [x] Verifieer focus-volgorde op alle pagina's
- [x] Test met keyboard-only navigatie
- [x] Test met screen reader (VoiceOver/NVDA)
- [x] Verifieer alle aria-labels
- [x] Verifieer `prefers-reduced-motion` support

**Acceptatie:** Geen axe-errors op WCAG 2.1 AA niveau. Keyboard navigatie werkt volledig. Focus-ring is altijd zichtbaar.

---

## Samenvatting per Fase

| Fase | Taken | Focus | Geschatte effort |
|------|-------|-------|-----------------|
| 0 | 0.1 – 0.4 | Setup, tokens, layout, navigatie | 2–3 dagen |
| 1 | 1.1 – 1.4 | UI component library | 2–3 dagen |
| 2 | 2.1 – 2.5 | Context, hooks, infra | 3–4 dagen |
| 3 | 3.1 – 3.3 | Auth schermen | 1–2 dagen |
| 4 | 4.1 – 4.5 | Onboarding wizard | 2–3 dagen |
| 5 | 5.1 – 5.9 | Today screen (kern!) | 4–6 dagen |
| 6 | 6.1 – 6.3 | Period planning | 2–3 dagen |
| 7 | 7.1 – 7.2 | Calendar / history | 2–3 dagen |
| 8 | 8.1 – 8.2 | Accountability | 1–2 dagen |
| 9 | 9.1 | Analytics dashboard | 2–3 dagen |
| 10 | 10.1 | Settings | 1–2 dagen |
| 11 | 11.1 – 11.7 | Polish & integratie | 3–4 dagen |
| **Totaal** | **~46 taken** | | **~25–38 werkdagen** |

---

## Prioriteiten (wat eerst)

Als je beperkte tijd hebt, bouw in deze volgorde:

1. **Fase 0** → zonder fundament kan niets
2. **Fase 1** → UI-componenten zijn herbruikbaar overal
3. **Fase 2** → Auth + offline infra nodig voor alles
4. **Fase 3 + 4** → Gebruiker moet kunnen inloggen en onboarden
5. **Fase 5** → Today screen is het hart van de app (80% van gebruik)
6. **Fase 6** → Planning geeft context aan de dag
7. **Fase 7** → Calendar maakt voortgang zichtbaar
8. **Fase 10** → Settings is nodig maar simpel
9. **Fase 8 + 9** → Accountability en Analytics zijn belangrijk maar niet launch-blocking
10. **Fase 11** → Polish maakt het af
