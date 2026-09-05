// document.routes.ts
import { Router } from "express";
import multer from "multer";
import {
  uploadDocumentController,
  getChunksController,
} from "./controller.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const router = Router();

router.post("/upload", upload.single("cv"), uploadDocumentController);
router.get("/:documentId/chunks", getChunksController);

export default router;
