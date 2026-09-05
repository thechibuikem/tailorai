import { embedText } from "../../config/providers.js";
import { retrievalRepository } from "./repository.js";
import type {
  EvidenceResult,
  JobRequirement,
} from "../../../../shared/types/index.js";

const SIMILARITY_THRESHOLD = 0.35;
const TOP_K = 3;

export async function retrieveEvidence(
  documentId: string,
  requirements: JobRequirement[],
): Promise<Record<string, EvidenceResult>> {
  const results: Record<string, EvidenceResult> = {};

  for (const req of requirements) {
    const embedding = await embedText(req.text);
    const rows = await retrievalRepository.searchChunksByEmbedding(
      documentId,
      embedding,
      TOP_K,
    );
    const matches = rows.filter((r) => r.distance <= SIMILARITY_THRESHOLD);

    results[req.id] =
      matches.length === 0
        ? { requirementId: req.id, unsupported: true }
        : matches.map((r) => ({
            requirementId: req.id,
            chunkId: r.id,
            similarityScore: 1 - r.distance,
            content: r.content,
            metadata: {
              section: r.section,
              type: r.type,
              company: r.company,
              role: r.role,
              project: r.project,
              date: r.date,
              technology: r.technology,
            },
          }));
  }
  return results;
}
