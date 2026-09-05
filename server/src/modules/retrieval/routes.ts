import { Router } from "express";
import { retrievalController } from "./controller.js";

const router = Router();
router.get("/:sessionId", retrievalController.getEvidence);
export default router;
