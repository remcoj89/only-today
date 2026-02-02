import { Router } from "express";
import { AppError } from "../errors";
import { validateRequest } from "../middleware/validateRequest";
import { userSettingsUpdateSchema } from "../schemas/settings";
import { getUserSettings, updateUserSettings } from "../services/userService";

export const settingsRoutes = Router();

settingsRoutes.get("/", async (req, res, next) => {
  try {
    if (!req.userId || !req.accessToken) {
      return next(AppError.unauthorized("Missing user context"));
    }

    const settings = await getUserSettings(req.userId, req.accessToken);
    return res.status(200).json({ success: true, data: { settings } });
  } catch (err) {
    return next(err as Error);
  }
});

settingsRoutes.patch("/", validateRequest({ body: userSettingsUpdateSchema }), async (req, res, next) => {
  try {
    if (!req.userId || !req.accessToken) {
      return next(AppError.unauthorized("Missing user context"));
    }

    const settings = await updateUserSettings(req.userId, req.accessToken, req.body);
    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/8f2b6680-c47c-4e5b-b9d7-488dc9e2d3be", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "debug-session",
        runId: "pre-fix",
        hypothesisId: "H9",
        location: "routes/settings.ts:patch",
        message: "settings.patch.result",
        data: { hasSettings: !!settings },
        timestamp: Date.now()
      })
    }).catch(() => {});
    // #endregion
    return res.status(200).json({ success: true, data: { settings } });
  } catch (err) {
    return next(err as Error);
  }
});
