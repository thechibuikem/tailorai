import type {
  EditingPlanItem,
  EvidenceResult,
  JobRequirement,
} from "../../../../../shared/types/index.js";

export interface AuditRow {
  requirementId: string;
  requirementText: string;
  importance: string;
  status: "grounded" | "gap" | "dropped";
  citedChunkContents: string[];
  changeType: EditingPlanItem["changeType"] | null;
}

export function buildGroundingAudit(
  requirements: JobRequirement[],
  evidence: Record<string, EvidenceResult>,
  groundedPlan: EditingPlanItem[],
): AuditRow[] {
  return requirements.map((req) => {
    const planItem = groundedPlan.find((p) => p.requirementId === req.id);
    const ev = evidence[req.id];
    const isUnsupported = !Array.isArray(ev);

    if (!planItem) {
      return {
        requirementId: req.id,
        requirementText: req.text,
        importance: req.importance,
        status: "dropped",
        citedChunkContents: [],
        changeType: null,
      };
    }

    if (isUnsupported || planItem.changeType === "flag_gap") {
      return {
        requirementId: req.id,
        requirementText: req.text,
        importance: req.importance,
        status: "gap",
        citedChunkContents: [],
        changeType: "flag_gap",
      };
    }

    const citedChunkContents = (
      ev as Array<{ chunkId: string; content: string }>
    )
      .filter((e) => planItem.evidenceChunkIds.includes(e.chunkId))
      .map((e) => e.content);

    return {
      requirementId: req.id,
      requirementText: req.text,
      importance: req.importance,
      status: "grounded",
      citedChunkContents,
      changeType: planItem.changeType,
    };
  });
}
