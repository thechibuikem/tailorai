import { generateCompletion } from "../../../config/providers.js";
import type {
  EditingPlanItem,
  EvidenceResult,
  JobRequirement,
} from "../../../../../shared/types/index.js";

const PROMPT = (
  requirements: JobRequirement[],
  evidence: Record<string, EvidenceResult>,
) => `You are tailoring a CV to a job description using ONLY the evidence given below. You never invent skills, employers, or achievements not present in the evidence.

Requirements and their evidence (some have no evidence — those are gaps, not to be filled in):
${requirements
  .map((r) => {
    const ev = evidence[r.id];
    const evText = Array.isArray(ev)
      ? ev
          .map((e) => `  - chunkId=${e.chunkId}: "${e.content.slice(0, 200)}"`)
          .join("\n")
      : "  - NO EVIDENCE (unsupported)";
    return `Requirement [${r.id}] (${r.importance}, ${r.category}): "${r.text}"\n${evText}`;
  })
  .join("\n\n")}

Return ONLY a JSON array, no prose, no markdown fences. Each item:
{"requirementId": string, "evidenceChunkIds": string[], "changeType": "emphasize"|"reorder"|"rephrase"|"deemphasize"|"flag_gap", "description": string}

Rules:
- For a requirement with evidence: evidenceChunkIds MUST be a subset of the chunkIds listed for it above. changeType is emphasize/reorder/rephrase/deemphasize.
- For a requirement with NO EVIDENCE: evidenceChunkIds MUST be []. changeType MUST be "flag_gap". description should say the CV does not show this.
- description is one short sentence explaining the change, plain English.`;

export async function buildEditingPlan(
  requirements: JobRequirement[],
  evidence: Record<string, EvidenceResult>,
): Promise<EditingPlanItem[]> {
  const raw = await generateCompletion(PROMPT(requirements, evidence), {
    json: true,
  });
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Editing plan generation returned non-JSON output");
  }
  if (!Array.isArray(parsed))
    throw new Error("Editing plan did not return an array");
  return parsed as EditingPlanItem[];
}
