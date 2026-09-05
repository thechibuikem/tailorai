import { Router } from "express";
import { sessionsController } from "./controller.js";

const router = Router();
router.post("/", sessionsController.create);
router.get("/:sessionId", sessionsController.getById);
router.patch("/:sessionId", sessionsController.updateDocument);
export default router;
