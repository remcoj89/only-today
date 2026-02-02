import { getSupabaseAdminClient } from "../db/client";
import { AppError } from "../errors";
import { createUserSettings } from "./userService";
import { sendBlockedNotificationEmail } from "./emailService";

type AdminActionType = "create" | "block" | "unblock" | "delete";

export async function createUser(email: string, password: string) {
  const admin = getSupabaseAdminClient();
  // #region agent log
  fetch("http://127.0.0.1:7242/ingest/8f2b6680-c47c-4e5b-b9d7-488dc9e2d3be", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: "debug-session",
      runId: "pre-fix",
      hypothesisId: "H1",
      location: "services/adminService.ts:createUser",
      message: "createUser.start",
      data: { hasEmail: !!email, passwordLength: password?.length ?? 0 },
      timestamp: Date.now()
    })
  }).catch(() => {});
  // #endregion
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });

  // #region agent log
  fetch("http://127.0.0.1:7242/ingest/8f2b6680-c47c-4e5b-b9d7-488dc9e2d3be", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: "debug-session",
      runId: "pre-fix",
      hypothesisId: "H1",
      location: "services/adminService.ts:createUser",
      message: "createUser.auth.result",
      data: {
        hasUser: !!data?.user,
        hasError: !!error,
        errorCode: error?.code ?? null,
        errorStatus: error?.status ?? null
      },
      timestamp: Date.now()
    })
  }).catch(() => {});
  // #endregion

  if (error || !data.user) {
    throw AppError.internal(error?.message ?? "Failed to create user");
  }

  await createUserSettings(data.user.id);
  // #region agent log
  fetch("http://127.0.0.1:7242/ingest/8f2b6680-c47c-4e5b-b9d7-488dc9e2d3be", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: "debug-session",
      runId: "pre-fix",
      hypothesisId: "H1",
      location: "services/adminService.ts:createUser",
      message: "createUser.settings.done",
      data: { hasUserId: !!data.user?.id },
      timestamp: Date.now()
    })
  }).catch(() => {});
  // #endregion
  return data.user;
}

async function updateBlockedStatus(userId: string, blocked: boolean) {
  const admin = getSupabaseAdminClient();
  // #region agent log
  fetch("http://127.0.0.1:7242/ingest/8f2b6680-c47c-4e5b-b9d7-488dc9e2d3be", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: "debug-session",
      runId: "pre-fix",
      hypothesisId: "H3",
      location: "services/adminService.ts:updateBlockedStatus",
      message: "updateBlockedStatus.start",
      data: { hasUserId: !!userId, blocked },
      timestamp: Date.now()
    })
  }).catch(() => {});
  // #endregion
  const { data: existing, error: fetchError } = await admin.auth.admin.getUserById(userId);
  // #region agent log
  fetch("http://127.0.0.1:7242/ingest/8f2b6680-c47c-4e5b-b9d7-488dc9e2d3be", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: "debug-session",
      runId: "pre-fix",
      hypothesisId: "H3",
      location: "services/adminService.ts:updateBlockedStatus",
      message: "updateBlockedStatus.fetch.result",
      data: {
        hasUser: !!existing?.user,
        hasError: !!fetchError,
        errorCode: fetchError?.code ?? null,
        errorStatus: fetchError?.status ?? null
      },
      timestamp: Date.now()
    })
  }).catch(() => {});
  // #endregion
  if (fetchError || !existing.user) {
    throw AppError.internal(fetchError?.message ?? "Failed to load user");
  }

  const appMetadata = {
    ...(existing.user.app_metadata ?? {}),
    blocked
  };

  const { error } = await admin.auth.admin.updateUserById(userId, {
    app_metadata: appMetadata
  });
  // #region agent log
  fetch("http://127.0.0.1:7242/ingest/8f2b6680-c47c-4e5b-b9d7-488dc9e2d3be", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: "debug-session",
      runId: "pre-fix",
      hypothesisId: "H3",
      location: "services/adminService.ts:updateBlockedStatus",
      message: "updateBlockedStatus.update.result",
      data: {
        hasError: !!error,
        errorCode: error?.code ?? null,
        errorStatus: error?.status ?? null
      },
      timestamp: Date.now()
    })
  }).catch(() => {});
  // #endregion

  if (error) {
    throw AppError.internal(error.message);
  }
}

export async function blockUser(userId: string) {
  await updateBlockedStatus(userId, true);

  // Haal user email op
  const admin = getSupabaseAdminClient();
  const { data: user } = await admin.auth.admin.getUserById(userId);

  if (user?.user?.email) {
    await sendBlockedNotificationEmail(user.user.email);
  }
}

export async function unblockUser(userId: string) {
  await updateBlockedStatus(userId, false);
}

export async function deleteUser(userId: string) {
  const admin = getSupabaseAdminClient();
  const { error } = await admin.auth.admin.deleteUser(userId);
  // #region agent log
  fetch("http://127.0.0.1:7242/ingest/8f2b6680-c47c-4e5b-b9d7-488dc9e2d3be", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: "debug-session",
      runId: "pre-fix",
      hypothesisId: "H4",
      location: "services/adminService.ts:deleteUser",
      message: "deleteUser.result",
      data: {
        hasError: !!error,
        errorCode: error?.code ?? null,
        errorStatus: error?.status ?? null
      },
      timestamp: Date.now()
    })
  }).catch(() => {});
  // #endregion
  if (error) {
    throw AppError.internal(error.message);
  }
}

export async function logAdminAction(
  adminId: string,
  actionType: AdminActionType,
  targetUserId: string,
  metadata?: Record<string, unknown>
) {
  const admin = getSupabaseAdminClient();
  const { error } = await admin.from("admin_user_actions").insert({
    admin_id: adminId,
    action_type: actionType,
    target_user_id: targetUserId,
    metadata: metadata ?? null
  });
  // #region agent log
  fetch("http://127.0.0.1:7242/ingest/8f2b6680-c47c-4e5b-b9d7-488dc9e2d3be", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: "debug-session",
      runId: "pre-fix",
      hypothesisId: "H2",
      location: "services/adminService.ts:logAdminAction",
      message: "logAdminAction.result",
      data: {
        hasError: !!error,
        errorCode: error?.code ?? null
      },
      timestamp: Date.now()
    })
  }).catch(() => {});
  // #endregion

  if (error) {
    throw AppError.internal("Failed to log admin action");
  }
}
