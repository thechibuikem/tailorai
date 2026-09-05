import type { Request, Response, NextFunction } from "express";
import { agentRepository } from "./repository.js";
import { retrieveEvidence } from "../retrieval/retrievalEvidence.js";
import { buildEditingPlan } from "./services/buildEditingPlan.js";
import { checkGrounding } from "./services/checkGrounding.js";
import { applyEditingPlan } from "./services/applyEditingPlan.js";
import { buildGroundingAudit } from "./services/groundingAudit.js";


export const agentController = {
  async tailor(req: Request, res: Response, next: NextFunction) {
    try {
      const { sessionId } = req.body as { sessionId?: string };
      if (!sessionId)
        return res.status(400).json({ error: "sessionId is required" });

      const documentId = await agentRepository.getSessionDocumentId(sessionId);
      if (!documentId)
        return res.status(400).json({ error: "Upload a CV first" });

      const requirements = await agentRepository.getJobRequirements(sessionId);
      if (requirements.length === 0)
        return res
          .status(400)
          .json({ error: "Analyze a job description first" });

      const evidence = await retrieveEvidence(documentId, requirements);
      const rawPlan = await buildEditingPlan(requirements, evidence);
      const groundedPlan = checkGrounding(rawPlan, evidence);

      const chunks = await agentRepository.getChunks(documentId);
      const prosemirrorJSON = applyEditingPlan(chunks, groundedPlan);

      await agentRepository.saveTailoredDocument(sessionId, prosemirrorJSON);

      res.status(200).json({
        sessionId,
        prosemirrorJSON,
        editingPlan: groundedPlan,
        droppedItemCount: rawPlan.length - groundedPlan.length,
        audit: buildGroundingAudit(requirements, evidence, groundedPlan),
      });
    } catch (err) {
      next(err);
    }
  },
};
