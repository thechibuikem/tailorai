import { generateCompletion } from "../../config/providers.js";
import type { RequirementCategory } from "../../../../shared/types/index.js";

export interface ExtractedRequirement {
  text: string;
  category: RequirementCategory;
  importance: "required" | "preferred";
}

const PROMPT = (
  jd: string,
) => `You extract structured requirements from a job description.

Return ONLY a JSON array, no prose, no markdown fences. Each item:
{"text": string, "category": "required_technology"|"preferred_technology"|"responsibility"|"skill"|"domain_knowledge"|"experience"|"keyword", "importance": "required"|"preferred"}

Rules:
- One requirement per item. Split compound sentences.
- "importance" is "required" only if the JD uses language like "must", "required", "X+ years" without "nice to have". Otherwise "preferred".
- Do not infer requirements the text does not state.

Job description:
"""
${jd}
"""`;

export async function extractRequirements(
  jobDescription: string,
): Promise<ExtractedRequirement[]> {
  const raw = await generateCompletion(PROMPT(jobDescription), { json: true });
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Requirement extraction returned non-JSON output");
  }
  if (!Array.isArray(parsed))
    throw new Error("Requirement extraction did not return an array");
  return (parsed as ExtractedRequirement[]).filter(
    (r) => typeof r.text === "string" && r.text.trim().length > 0,
  );
}
