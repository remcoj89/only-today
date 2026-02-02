import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { config } from "../config";
import { getSupabaseAdminClient } from "../db/client";
import { AppError } from "../errors";

export type UserSettingsUpdate = {
  day_start_reminder_time?: string | null;
  day_close_reminder_time?: string | null;
  push_enabled?: boolean;
  email_for_escalations_enabled?: boolean;
  timezone?: string;
};

function createAuthedClient(accessToken: string): SupabaseClient {
  return createClient(config.supabaseUrl, config.supabaseAnonKey, {
    auth: { persistSession: false },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  });
}

function isValidTimeZone(timeZone: string): boolean {
  const hasSupportedValues = typeof Intl.supportedValuesOf === "function";
  if (hasSupportedValues) {
    return Intl.supportedValuesOf("timeZone").includes(timeZone);
  }
  try {
    Intl.DateTimeFormat("en-US", { timeZone });
    return true;
  } catch {
    return false;
  }
}

export async function createUserSettings(userId: string) {
  const admin = getSupabaseAdminClient();
  // #region agent log
  fetch("http://127.0.0.1:7242/ingest/8f2b6680-c47c-4e5b-b9d7-488dc9e2d3be", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: "debug-session",
      runId: "pre-fix",
      hypothesisId: "H2",
      location: "services/userService.ts:createUserSettings",
      message: "createUserSettings.start",
      data: { hasUserId: !!userId },
      timestamp: Date.now()
    })
  }).catch(() => {});
  // #endregion
  const { data, error } = await admin
    .from("user_settings")
    .insert({ user_id: userId })
    .select("*")
    .single();

  // #region agent log
  fetch("http://127.0.0.1:7242/ingest/8f2b6680-c47c-4e5b-b9d7-488dc9e2d3be", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: "debug-session",
      runId: "pre-fix",
      hypothesisId: "H2",
      location: "services/userService.ts:createUserSettings",
      message: "createUserSettings.result",
      data: {
        hasData: !!data,
        hasError: !!error,
        errorCode: error?.code ?? null
      },
      timestamp: Date.now()
    })
  }).catch(() => {});
  // #endregion

  if (error) {
    throw AppError.internal("Failed to create user settings");
  }

  return data;
}

export async function getUserSettings(userId: string, accessToken: string) {
  const client = createAuthedClient(accessToken);
  const { data, error } = await client
    .from("user_settings")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    throw AppError.internal("Failed to load user settings");
  }

  return data;
}

export async function updateUserSettings(
  userId: string,
  accessToken: string,
  updates: UserSettingsUpdate
) {
  if (updates.timezone && !isValidTimeZone(updates.timezone)) {
    throw AppError.validationError("Invalid timezone", { timezone: updates.timezone });
  }

  const client = createAuthedClient(accessToken);
  const { data, error } = await client
    .from("user_settings")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error) {
    throw AppError.internal("Failed to update user settings");
  }

  return data;
}

export const userServiceUtils = {
  isValidTimeZone
};
