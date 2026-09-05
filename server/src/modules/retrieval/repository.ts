import { pool } from "../../infrastructure/database/pool.js";
import type { JobRequirement } from "../../../../shared/types/index.js";

export const retrievalRepository = {
  async getSessionDocumentId(sessionId: string): Promise<string | null> {
    const { rows } = await pool.query(
      "SELECT document_id FROM sessions WHERE id = $1",
      [sessionId],
    );
    return rows[0]?.document_id ?? null;
  },

  async getJobRequirements(sessionId: string): Promise<JobRequirement[]> {
    const { rows } = await pool.query<JobRequirement>(
      "SELECT id, text, category, importance FROM job_requirements WHERE session_id = $1",
      [sessionId],
    );
    return rows;
  },

  async searchChunksByEmbedding(
    documentId: string,
    embedding: number[],
    topK: number,
  ) {
    const { rows } = await pool.query(
      `SELECT id, content, section, type, company, role, project, date, technology, (embedding <=> $1) AS distance
       FROM chunks WHERE document_id = $2 ORDER BY distance ASC LIMIT $3`,
      [`[${embedding.join(",")}]`, documentId, topK],
    );
    return rows;
  },
};
