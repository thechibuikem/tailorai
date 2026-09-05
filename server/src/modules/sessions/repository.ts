import { pool } from "../../infrastructure/database/pool.js";

export const sessionsRepository = {
  async create() {
    const { rows } = await pool.query(
      "INSERT INTO sessions DEFAULT VALUES RETURNING id, created_at",
    );
    return rows[0];
  },

  async findById(sessionId: string) {
    const { rows } = await pool.query(
      "SELECT id, document_id, current_document, created_at FROM sessions WHERE id = $1",
      [sessionId],
    );
    return rows[0] ?? null;
  },

  async updateDocument(
    sessionId: string,
    document: Record<string, unknown>,
  ): Promise<boolean> {
    const { rows } = await pool.query(
      "UPDATE sessions SET current_document = $1 WHERE id = $2 RETURNING id",
      [JSON.stringify(document), sessionId],
    );
    return rows.length > 0;
  },
};
