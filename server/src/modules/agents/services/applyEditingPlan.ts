import type { EditingPlanItem } from "../../../../../shared/types/index.js";

export interface SourceChunk {
  id: string;
  content: string;
  section: string;
}

const SECTION_ORDER = [
  "summary",
  "work_experience",
  "projects",
  "skills",
  "education",
  "other",
];
const SECTION_TITLES: Record<string, string> = {
  summary: "Summary",
  work_experience: "Work experience",
  projects: "Projects",
  skills: "Skills",
  education: "Education",
  other: "Other",
};

export function applyEditingPlan(
  chunks: SourceChunk[],
  plan: EditingPlanItem[],
) {
  const chunkIdToChangeTypes = new Map<
    string,
    EditingPlanItem["changeType"][]
  >();
  for (const item of plan) {
    for (const chunkId of item.evidenceChunkIds) {
      const list = chunkIdToChangeTypes.get(chunkId) ?? [];
      list.push(item.changeType);
      chunkIdToChangeTypes.set(chunkId, list);
    }
  }

  const bySection = new Map<string, SourceChunk[]>();
  for (const chunk of chunks) {
    const list = bySection.get(chunk.section) ?? [];
    list.push(chunk);
    bySection.set(chunk.section, list);
  }

  for (const [section, list] of bySection) {
    list.sort((a, b) => {
      const aTypes = chunkIdToChangeTypes.get(a.id) ?? [];
      const bTypes = chunkIdToChangeTypes.get(b.id) ?? [];
      const aScore =
        aTypes.includes("emphasize") || aTypes.includes("reorder") ? 1 : 0;
      const bScore =
        bTypes.includes("emphasize") || bTypes.includes("reorder") ? 1 : 0;
      return bScore - aScore;
    });
    bySection.set(section, list);
  }

  const content = [];
  for (const section of SECTION_ORDER) {
    const items = bySection.get(section);
    if (!items || items.length === 0) continue;

    content.push({
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: SECTION_TITLES[section] ?? section }],
    });

    for (const chunk of items) {
      const types = chunkIdToChangeTypes.get(chunk.id) ?? [];
      const marks = types.includes("emphasize") ? [{ type: "bold" }] : [];
      content.push({
        type: "paragraph",
        attrs: {
          chunkId: chunk.id,
          deemphasized: types.includes("deemphasize"),
        },
        content: [
          {
            type: "text",
            text: chunk.content,
            marks: marks.length ? marks : undefined,
          },
        ],
      });
    }
  }

  const gaps = plan.filter((p) => p.changeType === "flag_gap");
  if (gaps.length > 0) {
    content.push({
      type: "heading",
      attrs: { level: 2 },
      content: [
        {
          type: "text",
          text: "Gaps (not on your CV — review before applying)",
        },
      ],
    });
    for (const gap of gaps) {
      content.push({
        type: "paragraph",
        attrs: { gap: true },
        content: [{ type: "text", text: gap.description }],
      });
    }
  }

  return { type: "doc", content };
}
