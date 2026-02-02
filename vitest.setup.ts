import { config } from "dotenv";
import { existsSync, statSync } from "node:fs";

const envPath = ".env.test";
const envExists = existsSync(envPath);
const envSize = envExists ? statSync(envPath).size : null;
const dotenvResult = config({ path: envPath });

// #region agent log
fetch("http://127.0.0.1:7242/ingest/8f2b6680-c47c-4e5b-b9d7-488dc9e2d3be", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    location: "vitest.setup.ts:8",
    message: "env file presence",
    data: {
      cwd: process.cwd(),
      envPath,
      envExists,
      envSize
    },
    timestamp: Date.now(),
    sessionId: "debug-session",
    runId: "pre-fix",
    hypothesisId: "H1"
  })
}).catch(() => {});
// #endregion agent log

// #region agent log
fetch("http://127.0.0.1:7242/ingest/8f2b6680-c47c-4e5b-b9d7-488dc9e2d3be", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    location: "vitest.setup.ts:24",
    message: "dotenv loaded .env.test",
    data: {
      parsedKeys: dotenvResult.parsed ? Object.keys(dotenvResult.parsed) : [],
      error: dotenvResult.error ? dotenvResult.error.message : null,
      hasSupabaseUrl: Boolean(process.env.SUPABASE_URL),
      hasDatabaseUrl: Boolean(process.env.DATABASE_URL)
    },
    timestamp: Date.now(),
    sessionId: "debug-session",
    runId: "pre-fix",
    hypothesisId: "H1"
  })
}).catch(() => {});
// #endregion agent log
