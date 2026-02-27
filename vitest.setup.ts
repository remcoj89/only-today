import { config } from "dotenv";
import { existsSync, statSync } from "node:fs";

const envPath = ".env.test";
const envExists = existsSync(envPath);
const envSize = envExists ? statSync(envPath).size : null;
const dotenvResult = config({ path: envPath });
