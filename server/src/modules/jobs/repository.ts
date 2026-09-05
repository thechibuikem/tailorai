// job.repository.ts
import { PoolClient } from "pg";

export interface RequirementData {
  text: string;
  category: string;
  importance: string;
}

export const jobRepository = {
  async deleteBySessionId(
    client: PoolClient,
    sessionId: string,
  ): Promise<void> {
    await client.query("DELETE FROM job_requirements WHERE session_id = $1", [
      sessionId,
    ]);
  },

  async insertRequirement(
    client: PoolClient,
    sessionId: string,
    r: RequirementData,
  ) {
    const { rows } = await client.query(
      `INSERT INTO job_requirements (session_id, text, category, importance) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, text, category, importance`,
      [sessionId, r.text, r.category, r.importance],
    );
    return rows[0];
  },
};
