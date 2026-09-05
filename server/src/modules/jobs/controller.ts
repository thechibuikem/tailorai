// job.controller.ts
import { Request, Response, NextFunction } from "express";
import { pool } from "../../infrastructure/database/pool.js";
import { extractRequirements } from "./extractRequiremnts.js";
import { jobRepository } from "./repository.js";


export async function analyzeJobController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { sessionId, jobDescription } = req.body as {
      sessionId?: string;
      jobDescription?: string;
    };

    if (!sessionId) {
      return res.status(400).json({ error: "sessionId is required" });
    }
    if (!jobDescription || jobDescription.trim().length < 20) {
      return res
        .status(400)
        .json({ error: "jobDescription is required and must be substantial" });
    }

    const requirements = await extractRequirements(jobDescription);
    if (requirements.length === 0) {
      return res
        .status(422)
        .json({
          error: "Could not extract any requirements from this job description",
        });
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      await jobRepository.deleteBySessionId(client, sessionId);

      const inserted = [];
      for (const r of requirements) {
        const insertedRow = await jobRepository.insertRequirement(
          client,
          sessionId,
          r,
        );
        inserted.push(insertedRow);
      }

      await client.query("COMMIT");
      return res.status(201).json({ requirements: inserted });
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    next(err);
  }
}
