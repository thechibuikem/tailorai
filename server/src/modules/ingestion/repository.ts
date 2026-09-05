// document.repository.ts
import { PoolClient } from "pg";
import { RawChunk } from "./services/chunkSections.js";

export interface InsertChunkData extends RawChunk {
  embedding: number[];
}

export const documentRepository = {
  async createDocument(
    client: PoolClient,
    sessionId: string,
    filename: string,
    type: string = "cv",
  ): Promise<string> {
    const result = await client.query(
      `INSERT INTO documents (session_id, filename, type) VALUES ($1, $2, $3) RETURNING id`,
      [sessionId, filename, type],
    );
    return result.rows[0].id as string;
  },

  async insertChunk(
    client: PoolClient,
    documentId: string,
    chunk: InsertChunkData,
  ): Promise<void> {
    await client.query(
      `INSERT INTO chunks (document_id, content, embedding, section, type, company, role, project, date, technology)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        documentId,
        chunk.content,
        `[${chunk.embedding.join(",")}]`,
        chunk.metadata.section,
        chunk.metadata.type,
        chunk.metadata.company,
        chunk.metadata.role,
        chunk.metadata.project,
        chunk.metadata.date,
        chunk.metadata.technology,
      ],
    );
  },

  async updateSessionDocument(
    client: PoolClient,
    sessionId: string,
    documentId: string,
  ): Promise<void> {
    await client.query(`UPDATE sessions SET document_id = $1 WHERE id = $2`, [
      documentId,
      sessionId,
    ]);
  },
};
