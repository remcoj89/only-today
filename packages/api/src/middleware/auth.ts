import type { NextFunction, Request, Response } from "express";
import { getSupabaseClient } from "../db/client";
import { AppError } from "../errors";

export async function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.header("authorization");
  if (!authHeader) {
    return next(AppError.unauthorized("Missing Authorization header"));
  }

  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    return next(AppError.unauthorized("Invalid Authorization header"));
  }

  const client = getSupabaseClient();
  const { data, error } = await client.auth.getUser(token);

  if (error || !data.user) {
    return next(AppError.unauthorized());
  }

  req.userId = data.user.id;
  return next();
}
