import { Router } from "express";
import { adminAuthMiddleware } from "../middleware/adminAuth";
import { authMiddleware } from "../middleware/auth";
import { adminRoutes } from "./admin";
import { authRoutes } from "./auth";
import { deviceRoutes } from "./devices";
import { documentRoutes } from "./documents";
import { settingsRoutes } from "./settings";

export const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/settings", authMiddleware, settingsRoutes);
routes.use("/devices", authMiddleware, deviceRoutes);
routes.use("/documents", authMiddleware, documentRoutes);
routes.use("/admin", authMiddleware, adminAuthMiddleware, adminRoutes);
