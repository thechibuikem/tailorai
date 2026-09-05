import type { Request, Response, NextFunction } from "express";
import { sessionsRepository } from "./repository.js";
import { Session } from "node:inspector";

export const sessionsController = {
  async create(_req: Request, res: Response, next: NextFunction) {
    try {
      res.status(201).json(await sessionsRepository.create());
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request<{sessionId: string}>, res: Response, next: NextFunction) {
    try {
      const session = await sessionsRepository.findById(req.params.sessionId);
      if (!session) return res.status(404).json({ error: "Session not found" });
      res.json(session);
    } catch (err) {
      next(err);
    }
  },

  async updateDocument(req: Request<{sessionId: string}>, res: Response, next: NextFunction) {
    try {
      const { document } = req.body as { document?: Record<string, unknown> };
      if (!document)
        return res.status(400).json({ error: "document is required" });
      const saved = await sessionsRepository.updateDocument(
        req.params.sessionId,
        document,
      );
      if (!saved) return res.status(404).json({ error: "Session not found" });
      res.json({ saved: true });
    } catch (err) {
      next(err);
    }
  },
};
