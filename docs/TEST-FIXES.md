# Wat te doen om alle tests te laten slagen

## Al gedaan (in deze sessie)

1. **MVP integration**
   - Registratie en admin create user verwachten nu **201** (niet 200).
   - Accountability request body: test stuurt nu `{ toUserEmail: userBEmail }` (niet `email`).
   - "Complete user journey" heeft een **timeout van 30s** en **slaagt** nu.

2. **Timezone**
   - **"UTC"** en **"Etc/UTC"** worden expliciet geaccepteerd in `userService` en `schemas/settings.ts`.

3. **Jobs**
   - **missedDaysJob** en **notificationJobs** gebruiken `Array.isArray(data) ? data : []` zodat `data` altijd een array is.

4. **Vitest**
   - **testTimeout: 15000** in `vitest.config.ts` (standaard 15s per test).

5. **Debug**
   - Alle debug-instrumentatie is verwijderd uit `packages/api/src/db/client.ts`.

---

## Huidige stand (na deze fixes)

- **22 test files** slagen, **20** falen.
- **116 tests** slagen, **34** falen, **32** overgeslagen.

---

## Wat jij nog kunt doen

### 1. Supabase rate limit (veel falende tests)

Fout: **"Request rate limit reached"** bij `createUser` / `signInWithPassword`.

- **Oorzaak:** te veel auth-aanroepen in korte tijd (veel tests die elk users aanmaken).
- **Opties:**
  - Tests **niet parallel** draaien: in `vitest.config.ts` zetten: `fileParallelism: false` of `maxWorkers: 1`. Daarmee gaan minder gelijktijdige requests naar Supabase.
  - **Wacht even** tussen test runs (rate limit is per tijdvenster).
  - In het Supabase-dashboard: kijken of je het rate limit kunt verhogen (afhankelijk van je plan).

### 2. MVP "runs the accountability journey" (400)

POST `/accountability/request` geeft **400** terwijl de test 200 verwacht.

- Controleer de **response body** (bijv. in de test even `console.log(requestResponse.body)`).
- Mogelijke oorzaken: validatiefout in de service (bijv. "Pending request already exists") of een andere business rule. Aanpassen van de test of de service afhankelijk van de gewenste API-contract.

### 3. MVP "runs the admin journey" (401)

`loginUser()` geeft **401** (Invalid email or password).

- Admin journey: eerst admin-user registreren, dan inloggen. Als login 401 geeft: verkeerde credentials of gebruiker nog niet zichtbaar (timing).
- Controleer of de net geregistreerde admin-user daadwerkelijk in Supabase staat en of je in de test met hetzelfde e-mailadres en wachtwoord inlogt.

### 4. missedDaysJob: "Failed to load user settings for missed day job"

De job doet `getSupabaseAdminClient().from("user_settings").select(...)` en krijgt een **error** van Supabase.

- **Mogelijke oorzaken:**
  - RLS op `user_settings` die de service role blokkeert (onwaarschijnlijk, maar controleren in Supabase).
  - Andere permissies of schema (kolomnamen, tabelnaam) in de test-DB.
- **Debug:** in `missedDaysJob.ts` tijdelijk de echte Supabase-`error` loggen (bijv. `console.error(error)`) en opnieuw draaien om de exacte foutmelding te zien.

### 5. Overige failures

- **schema.test.ts** – "deadlock detected" bij migrations: waarschijnlijk parallelle tests die dezelfde DB migreren. Oplossing: migrations alleen in één process/worker draaien of test-DB per worker.
- **notificationJobs** – "expected 0 to be 1": reminder wordt niet aangemaakt (bijv. `loadReminderUsers` geeft andere data of tijdzone/logica klopt niet in de test).
- **auth.test / settings.test / session.test** – vaak rate limit of één specifieke assertion; per test de foutmelding bekijken en ofwel rate limit verminderen (zie punt 1) of de test/implementatie lokaal aanpassen.

---

## Snelste verbetering: minder paralleliteit

Om **rate limit** sterk te verminderen:

In **vitest.config.ts**:

```ts
export default defineConfig({
  test: {
    environment: "node",
    setupFiles: [resolve(__dirname, "vitest.setup.ts")],
    testTimeout: 15000,
    fileParallelism: false   // of: maxWorkers: 1
  }
});
```

Daarna opnieuw `npm run test` of `pnpm test` draaien. Verwacht: minder "Request rate limit reached", meer slaggende tests.

---

## Samenvatting

- **Code-fixes** voor MVP (statuscodes, body, timeout), timezone, array-guards en debug zijn gedaan.
- De rest van de falende tests hangt vooral samen met **Supabase rate limit**, **accountability/admin flow** (400/401) en **job/DB-permissies**. Door paralleliteit te beperken en de bovenstaande punten per failure door te lopen, kun je de suite stap voor stap groen krijgen.
