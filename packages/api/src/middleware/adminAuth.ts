import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors";

function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS ?? "";
  return raw
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function adminAuthMiddleware(req: Request, _res: Response, next: NextFunction) {
  const adminEmails = getAdminEmails();
  // #region agent log
  fetch("http://127.0.0.1:7242/ingest/8f2b6680-c47c-4e5b-b9d7-488dc9e2d3be", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: "debug-session",
      runId: "pre-fix",
      hypothesisId: "H13",
      location: "middleware/adminAuth.ts:adminAuthMiddleware",
      message: "adminAuth.start",
      data: { hasUserEmail: !!req.userEmail, adminEmailsCount: adminEmails.length },
      timestamp: Date.now()
    })
  }).catch(() => {});
  // #endregion
  if (!req.userEmail || adminEmails.length === 0) {
    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/8f2b6680-c47c-4e5b-b9d7-488dc9e2d3be", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "debug-session",
        runId: "pre-fix",
        hypothesisId: "H13",
        location: "middleware/adminAuth.ts:adminAuthMiddleware",
        message: "adminAuth.missingContext",
        data: { hasUserEmail: !!req.userEmail, adminEmailsCount: adminEmails.length },
        timestamp: Date.now()
      })
    }).catch(() => {});
    // #endregion
    return next(AppError.forbidden("Admin access required"));
  }

  const isAdmin = adminEmails.includes(req.userEmail.toLowerCase());
  if (!isAdmin) {
    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/8f2b6680-c47c-4e5b-b9d7-488dc9e2d3be", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "debug-session",
        runId: "pre-fix",
        hypothesisId: "H13",
        location: "middleware/adminAuth.ts:adminAuthMiddleware",
        message: "adminAuth.forbidden",
        data: { adminEmailsCount: adminEmails.length },
        timestamp: Date.now()
      })
    }).catch(() => {});
    // #endregion
    return next(AppError.forbidden("Admin access required"));
  }

  // #region agent log
  fetch("http://127.0.0.1:7242/ingest/8f2b6680-c47c-4e5b-b9d7-488dc9e2d3be", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: "debug-session",
      runId: "pre-fix",
      hypothesisId: "H13",
      location: "middleware/adminAuth.ts:adminAuthMiddleware",
      message: "adminAuth.allowed",
      data: { adminEmailsCount: adminEmails.length },
      timestamp: Date.now()
    })
  }).catch(() => {});
  // #endregion
  return next();
}
