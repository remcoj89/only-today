import type { NextFunction, Request, Response } from "express";
import { ErrorCode } from "@hemera/shared";
import { AppError } from "./AppError";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/8f2b6680-c47c-4e5b-b9d7-488dc9e2d3be", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "debug-session",
        runId: "pre-fix",
        hypothesisId: "H22",
        location: "errors/errorHandler.ts:errorHandler",
        message: "errorHandler.appError",
        data: { status: err.httpStatus, code: err.code },
        timestamp: Date.now()
      })
    }).catch(() => {});
    // #endregion
    const payload = {
      success: false,
      code: err.code,
      message: err.message,
      details: err.details
    };
    if (!payload.details) {
      delete payload.details;
    }
    return res.status(err.httpStatus).json(payload);
  }

  console.error(err);

  return res.status(500).json({
    success: false,
    code: ErrorCode.InternalError,
    message: "Internal server error"
  });
}
