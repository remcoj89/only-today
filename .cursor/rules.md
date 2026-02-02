## Lessons Learned

- TypeScript build pitfalls: enable `esModuleInterop` + `allowSyntheticDefaultImports` for default imports (`express`, `supertest`), import Node ESM modules as namespaces (`import * as fs from "node:fs/promises"`), annotate Express app as `Application` to avoid TS2742, and type middleware params to avoid implicit `any`.
- Supabase test setup: `.env.test` must use exact key names (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL` as **postgresql://** URI, plus test user email/password); URL‑encode special chars in DB password; make RLS policy migrations idempotent (avoid duplicate policy errors); client tests should reuse existing test users; allow longer timeouts for DB/RLS schema tests.
