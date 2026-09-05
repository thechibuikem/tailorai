import type { ChunkMetadata } from "../../../../../shared/types/index.js";
import type { DetectedSection } from "./detectSections.js";

// Defines the structure of an individual text chunk along with its associated metadata
export interface RawChunk {
  content: string;
  metadata: ChunkMetadata;
}

// Regular expression to match date ranges (e.g., "2020 - 2023", "2019 – Present") or single years ("2021")
const DATE_RE = /(\b\d{4}\b\s*[-\u2013]\s*(?:\b\d{4}\b|present)|\b\d{4}\b)/i;

// Extracts metadata (role, company/institution, and date) from the first line of a job or project entry
function parseEntryHeader(line: string) {
  // Extract the date string if found, otherwise default to null
  const date = line.match(DATE_RE)?.[0] ?? null;

  // Remove the date from the line, then split by commas, "at", hyphens, or en-dashes to separate parts like role and company
  const parts = line
    .replace(DATE_RE, "")
    .trim()
    .split(/,| at | - |\u2013/)
    .map((p) => p.trim())
    .filter(Boolean);

  return { role: parts[0] ?? null, company: parts[1] ?? null, date };
}

// Splits a standard section (like work experience or education) into separate chunks based on blank lines (paragraph breaks)
function chunkByBlankLine(section: DetectedSection): RawChunk[] {
  return section.content
    .split(/\n\s*\n/)
    .filter((b) => b.trim())
    .map((block) => {
      // Parse header metadata from the very first line of the current block
      const { role, company, date } = parseEntryHeader(block.split("\n")[0]);
      return {
        content: block.trim(),
        metadata: {
          section: section.section,
          type: section.section,
          company,
          role,
          project: section.section === "projects" ? role : null,
          date,
          technology: null,
        },
      };
    });
}

// Splits a skills section into individual item chunks based on delimiters like newlines, commas, bullets, or dashes
function chunkSkills(section: DetectedSection): RawChunk[] {
  return section.content
    .split(/[\n,\u2022-]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 1)
    .map((item) => ({
      content: item,
      metadata: {
        section: "skills",
        type: "skill",
        company: null,
        role: null,
        project: null,
        date: null,
        technology: item, // Treat each individual skill as a technology metadata tag
      },
    }));
}

// Routes each detected section to its proper chunking strategy and flattens them into a single array of raw chunks
export function chunkSections(sections: DetectedSection[]): RawChunk[] {
  const chunks: RawChunk[] = [];
  for (const s of sections) {
    if (s.section === "skills") {
      chunks.push(...chunkSkills(s));
    } else if (
      ["work_experience", "education", "projects"].includes(s.section)
    ) {
      chunks.push(...chunkByBlankLine(s));
    } else {
      // Fallback for general sections (like summary or other) where line-by-line block splitting isn't needed
      chunks.push({
        content: s.content,
        metadata: {
          section: s.section,
          type: s.section,
          company: null,
          role: null,
          project: null,
          date: null,
          technology: null,
        },
      });
    }
  }
  // Filter out any accidentally empty chunks
  return chunks.filter((c) => c.content.length > 0);
}
