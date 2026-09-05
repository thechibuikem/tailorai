import type { Request, Response, NextFunction } from "express";
import { retrievalRepository } from "./repository.js";
import { retrieveEvidence } from "./retrievalEvidence.js";

export const retrievalController = {
  async getEvidence(req: Request<{sessionId:string}>, res: Response, next: NextFunction) {
    try {
      const { sessionId } = req.params;
      const documentId =
        await retrievalRepository.getSessionDocumentId(sessionId);
      if (!documentId)
        return res
          .status(400)
          .json({ error: "Session has no ingested CV yet" });

      const requirements =
        await retrievalRepository.getJobRequirements(sessionId);
      if (requirements.length === 0)
        return res
          .status(400)
          .json({ error: "Session has no analyzed job description yet" });

      res.json({ evidence: await retrieveEvidence(documentId, requirements) });
    } catch (err) {
      next(err);
    }
  },
};
