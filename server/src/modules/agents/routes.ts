import { Router } from "express";
import { agentController } from "./controller.js";

const router = Router();
router.post("/tailor", agentController.tailor);
export default router;
