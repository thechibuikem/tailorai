// document.controller.ts
import { Request, Response, NextFunction } from "express";
import { pool } from "../../infrastructure/database/pool.js";
import { ingestDocument } from "./services/ingestdocument.js";
// 
export async function uploadDocumentController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const sessionId = req.body?.sessionId as string | undefined;
    if (!sessionId) {
      return res.status(400).json({ error: "sessionId is required" });
    }
    if (!req.file) {
      return res
        .status(400)
        .json({ error: 'cv file is required (field name "cv")' });
    }
    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({ error: "Only PDF uploads are supported" });
    }

    const result = await ingestDocument(
      sessionId,
      req.file.originalname,
      req.file.buffer,
    );
    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

// 
export async function getChunksController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { rows } = await pool.query(
      `SELECT id, content, section, type, company, role, project, date, technology FROM chunks WHERE document_id = $1`,
      [req.params.documentId],
    );
    return res.json(rows);
  } catch (err) {
    next(err);
  }
}
