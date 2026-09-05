// job.routes.ts
import { Router } from "express";
import { analyzeJobController } from "./controller.js";

const router = Router();

router.post("/analyze", analyzeJobController);

export default router;
