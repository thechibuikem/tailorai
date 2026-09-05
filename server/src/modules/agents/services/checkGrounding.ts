import type {
  EditingPlanItem,
  EvidenceResult,
} from "../../../../../shared/types/index.js";

export function checkGrounding(
  plan: EditingPlanItem[],
  evidence: Record<string, EvidenceResult>,
): EditingPlanItem[] {
  return plan.filter((item) => {
    const ev = evidence[item.requirementId];
    const isUnsupported = !Array.isArray(ev);

    if (isUnsupported) {
      return (
        item.changeType === "flag_gap" && item.evidenceChunkIds.length === 0
      );
    }

    const validChunkIds = new Set(
      (ev as Array<{ chunkId: string }>).map((e) => e.chunkId),
    );
    const allCitationsValid = item.evidenceChunkIds.every((id) =>
      validChunkIds.has(id),
    );
    return allCitationsValid && item.evidenceChunkIds.length > 0;
  });
}
