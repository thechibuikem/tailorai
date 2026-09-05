import { pool } from "../../infrastructure/database/pool.js";
import type { JobRequirement } from "../../../../shared/types/index.js";

export const agentRepository = {
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

  async getChunks(documentId: string) {
    const { rows } = await pool.query(
      "SELECT id, content, section FROM chunks WHERE document_id = $1",
      [documentId],
    );
    return rows;
  },

  async saveTailoredDocument(
    sessionId: string,
    prosemirrorJSON: Record<string, unknown>,
  ): Promise<void> {
    await pool.query(
      "UPDATE sessions SET current_document = $1 WHERE id = $2",
      [JSON.stringify(prosemirrorJSON), sessionId],
    );
  },
};
