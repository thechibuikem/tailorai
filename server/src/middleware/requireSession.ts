import type { Request, Response, NextFunction } from "express";

export function requireSession(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const sessionId = req.body?.sessionId || req.query?.sessionId;
  if (!sessionId || typeof sessionId !== "string") {
    return res.status(400).json({ error: "sessionId is required" });
  }
  next();
}
