// ingestDocument.ts
import { pool } from "../../../infrastructure/database/pool.js";
import { embedText } from "../../../config/providers.js";
import { extractText } from "./extractText.js";
import { cleanText } from "./cleanText.js";
import { detectSections } from "./detectSections.js";
import { chunkSections } from "./chunkSections.js";
import { documentRepository } from "../repository.js";

export interface IngestResult {
  documentId: string;
  chunkCount: number;
}

export async function ingestDocument(
  sessionId: string,
  filename: string,
  buffer: Buffer,
): Promise<IngestResult> {
  const text = cleanText(await extractText(buffer));
  const chunks = chunkSections(detectSections(text));
  if (chunks.length === 0)
    throw new Error("No CV content could be extracted after sectioning");

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const documentId = await documentRepository.createDocument(
      client,
      sessionId,
      filename,
      "cv",
    );

    for (const chunk of chunks) {
      const embedding = await embedText(chunk.content);
      await documentRepository.insertChunk(client, documentId, {
        ...chunk,
        embedding,
      });
    }

    await documentRepository.updateSessionDocument(
      client,
      sessionId,
      documentId,
    );

    await client.query("COMMIT");
    return { documentId, chunkCount: chunks.length };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
