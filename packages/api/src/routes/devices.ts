import { Router } from "express";
import { z } from "zod";
import { AppError } from "../errors";
import { validateRequest } from "../middleware/validateRequest";
import { listDeviceSessions, revokeDeviceSession } from "../services/sessionService";

export const deviceRoutes = Router();

const deviceParamsSchema = z.object({
  deviceId: z.string().min(1)
});

deviceRoutes.get("/", (req, res, next) => {
  try {
    if (!req.userId) {
      return next(AppError.unauthorized("Missing user context"));
    }
    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/8f2b6680-c47c-4e5b-b9d7-488dc9e2d3be", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "debug-session",
        runId: "pre-fix",
        hypothesisId: "H10",
        location: "routes/devices.ts:get",
        message: "devices.get.entry",
        data: { hasUserId: !!req.userId },
        timestamp: Date.now()
      })
    }).catch(() => {});
    // #endregion

    const devices = listDeviceSessions(req.userId);
    return res.status(200).json({ success: true, data: { devices } });
  } catch (err) {
    return next(err as Error);
  }
});

deviceRoutes.delete(
  "/:deviceId",
  validateRequest({ params: deviceParamsSchema }),
  (req, res, next) => {
    try {
      if (!req.userId) {
        return next(AppError.unauthorized("Missing user context"));
      }
      // #region agent log
      fetch("http://127.0.0.1:7242/ingest/8f2b6680-c47c-4e5b-b9d7-488dc9e2d3be", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: "debug-session",
          runId: "pre-fix",
          hypothesisId: "H10",
          location: "routes/devices.ts:delete",
          message: "devices.delete.entry",
          data: { hasUserId: !!req.userId, hasDeviceId: !!req.params?.deviceId },
          timestamp: Date.now()
        })
      }).catch(() => {});
      // #endregion

      const { deviceId } = req.params as { deviceId: string };
      const revoked = revokeDeviceSession(req.userId, deviceId);
      if (!revoked) {
        return next(AppError.validationError("Device not found", { deviceId }));
      }

      return res.status(200).json({ success: true });
    } catch (err) {
      return next(err as Error);
    }
  }
);
