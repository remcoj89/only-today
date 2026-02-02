import type { NextFunction, Request, Response } from "express";
import { getSupabaseAdminClient, getSupabaseClient } from "../db/client";
import { AppError } from "../errors";
import { getUserFromSession, trackDeviceSession, validateSession } from "../services/sessionService";

type RateLimitEntry = {
  count: number;
  firstFailedAt: number;
};

const failedAuthAttempts = new Map<string, RateLimitEntry>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

function getClientIdentifier(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }
  return req.ip ?? "unknown";
}

function isExpiredToken(token: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 3) {
    return false;
  }
  try {
    const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8")) as {
      exp?: number;
    };
    if (!payload.exp) {
      return false;
    }
    return payload.exp * 1000 <= Date.now();
  } catch {
    return false;
  }
}

function recordFailure(identifier: string) {
  const existing = failedAuthAttempts.get(identifier);
  const now = Date.now();
  if (!existing || now - existing.firstFailedAt > RATE_LIMIT_WINDOW_MS) {
    failedAuthAttempts.set(identifier, { count: 1, firstFailedAt: now });
    return;
  }
  failedAuthAttempts.set(identifier, { count: existing.count + 1, firstFailedAt: existing.firstFailedAt });
}

function clearFailures(identifier: string) {
  failedAuthAttempts.delete(identifier);
}

function isRateLimited(identifier: string): boolean {
  const entry = failedAuthAttempts.get(identifier);
  if (!entry) {
    return false;
  }
  if (Date.now() - entry.firstFailedAt > RATE_LIMIT_WINDOW_MS) {
    failedAuthAttempts.delete(identifier);
    return false;
  }
  return entry.count >= RATE_LIMIT_MAX;
}

function getDeviceId(req: Request): string | null {
  const headerValue = req.header("x-device-id") ?? req.header("device-id");
  if (!headerValue) {
    return null;
  }
  return headerValue.trim();
}

export async function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const identifier = getClientIdentifier(req);
  // #region agent log
  fetch("http://127.0.0.1:7242/ingest/8f2b6680-c47c-4e5b-b9d7-488dc9e2d3be", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: "debug-session",
      runId: "pre-fix",
      hypothesisId: "H6",
      location: "middleware/auth.ts:authMiddleware",
      message: "authMiddleware.start",
      data: {
        hasAuthHeader: !!req.header("authorization"),
        hasDeviceId: !!getDeviceId(req)
      },
      timestamp: Date.now()
    })
  }).catch(() => {});
  // #endregion
  // #region agent log
  fetch("http://127.0.0.1:7242/ingest/8f2b6680-c47c-4e5b-b9d7-488dc9e2d3be", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: "debug-session",
      runId: "pre-fix",
      hypothesisId: "H21",
      location: "middleware/auth.ts:authMiddleware",
      message: "authMiddleware.request",
      data: { method: req.method, path: req.path },
      timestamp: Date.now()
    })
  }).catch(() => {});
  // #endregion
  if (isRateLimited(identifier)) {
    return next(AppError.rateLimited());
  }

  const authHeader = req.header("authorization");
  if (!authHeader) {
    recordFailure(identifier);
    return next(AppError.unauthorized("Missing Authorization header"));
  }

  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    recordFailure(identifier);
    return next(AppError.unauthorized("Invalid Authorization header"));
  }

  if (isExpiredToken(token)) {
    recordFailure(identifier);
    return next(AppError.unauthorized("Access token expired"));
  }

  if (!validateSession(token)) {
    recordFailure(identifier);
    return next(AppError.unauthorized("Session revoked"));
  }

  const client = getSupabaseClient();
  const { data, error } = await client.auth.getUser(token);
  // #region agent log
  fetch("http://127.0.0.1:7242/ingest/8f2b6680-c47c-4e5b-b9d7-488dc9e2d3be", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: "debug-session",
      runId: "pre-fix",
      hypothesisId: "H7",
      location: "middleware/auth.ts:authMiddleware",
      message: "authMiddleware.getUser.result",
      data: {
        hasUser: !!data?.user,
        hasError: !!error,
        errorStatus: error?.status ?? null
      },
      timestamp: Date.now()
    })
  }).catch(() => {});
  // #endregion

  if (error || !data.user) {
    if (error?.status !== 403) {
      recordFailure(identifier);
      return next(AppError.unauthorized());
    }

    const fallbackUser = getUserFromSession(token);
    if (!fallbackUser?.userId) {
      recordFailure(identifier);
      return next(AppError.unauthorized());
    }

    const adminClient = getSupabaseAdminClient();
    const { data: freshUser, error: adminError } = await adminClient.auth.admin.getUserById(
      fallbackUser.userId
    );
    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/8f2b6680-c47c-4e5b-b9d7-488dc9e2d3be", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "debug-session",
        runId: "pre-fix",
        hypothesisId: "H18",
        location: "middleware/auth.ts:authMiddleware",
        message: "authMiddleware.adminUser.fallback",
        data: {
          hasUser: !!freshUser?.user,
          hasError: !!adminError,
          isBlocked: !!freshUser?.user?.app_metadata?.blocked
        },
        timestamp: Date.now()
      })
    }).catch(() => {});
    // #endregion

    if (adminError || !freshUser?.user) {
      recordFailure(identifier);
      return next(AppError.unauthorized());
    }

    if (freshUser.user.app_metadata?.blocked) {
      recordFailure(identifier);
      return next(AppError.unauthorized("User is blocked"));
    }

    clearFailures(identifier);
    req.userId = freshUser.user.id;
    req.userEmail = freshUser.user.email ?? undefined;
    req.accessToken = token;

    const deviceId = getDeviceId(req);
    if (deviceId) {
      trackDeviceSession(req.userId, deviceId, token);
    }
    return next();
  }

  // #region agent log
  fetch("http://127.0.0.1:7242/ingest/8f2b6680-c47c-4e5b-b9d7-488dc9e2d3be", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: "debug-session",
      runId: "pre-fix",
      hypothesisId: "H17",
      location: "middleware/auth.ts:authMiddleware",
      message: "authMiddleware.userMetadata",
      data: {
        hasUser: !!data.user,
        isBlocked: !!data.user.app_metadata?.blocked
      },
      timestamp: Date.now()
    })
  }).catch(() => {});
  // #endregion

  const adminClient = getSupabaseAdminClient();
  const { data: freshUser, error: adminError } = await adminClient.auth.admin.getUserById(
    data.user.id
  );
  // #region agent log
  fetch("http://127.0.0.1:7242/ingest/8f2b6680-c47c-4e5b-b9d7-488dc9e2d3be", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: "debug-session",
      runId: "pre-fix",
      hypothesisId: "H18",
      location: "middleware/auth.ts:authMiddleware",
      message: "authMiddleware.adminUser.result",
      data: {
        hasUser: !!freshUser?.user,
        hasError: !!adminError,
        isBlocked: !!freshUser?.user?.app_metadata?.blocked
      },
      timestamp: Date.now()
    })
  }).catch(() => {});
  // #endregion

  if (adminError || !freshUser?.user) {
    recordFailure(identifier);
    return next(AppError.unauthorized());
  }

  if (freshUser.user.app_metadata?.blocked) {
    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/8f2b6680-c47c-4e5b-b9d7-488dc9e2d3be", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "debug-session",
        runId: "pre-fix",
        hypothesisId: "H18",
        location: "middleware/auth.ts:authMiddleware",
        message: "authMiddleware.blockedAdmin",
        data: { method: req.method, path: req.path },
        timestamp: Date.now()
      })
    }).catch(() => {});
    // #endregion
    recordFailure(identifier);
    return next(AppError.unauthorized("User is blocked"));
  }

  // #region agent log
  fetch("http://127.0.0.1:7242/ingest/8f2b6680-c47c-4e5b-b9d7-488dc9e2d3be", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: "debug-session",
      runId: "pre-fix",
      hypothesisId: "H17",
      location: "middleware/auth.ts:authMiddleware",
      message: "authMiddleware.allowed",
      data: {},
      timestamp: Date.now()
    })
  }).catch(() => {});
  // #endregion
  clearFailures(identifier);
  req.userId = freshUser.user.id;
  req.userEmail = freshUser.user.email ?? undefined;
  req.accessToken = token;

  const deviceId = getDeviceId(req);
  if (deviceId) {
    trackDeviceSession(req.userId, deviceId, token);
  }
  return next();
}
