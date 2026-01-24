import express from "express";
import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "./errors";
import { authMiddleware } from "./middleware/auth";

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use((req, _res, next) => {
  console.info(`${req.method} ${req.path}`);
  next();
});

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/protected", authMiddleware, (req, res) => {
  res.status(200).json({ userId: req.userId });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Not found" });
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({ success: false, message: "Invalid JSON" });
  }
  return errorHandler(err, req, res, next);
});
