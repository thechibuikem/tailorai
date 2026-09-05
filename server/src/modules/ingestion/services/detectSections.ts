import type { ChunkMetadata } from "../../../../../shared/types/index.js";

// Defines the structure of a detected section within the text
export interface DetectedSection {
  section: ChunkMetadata["section"];
  heading: string;
  content: string;
}

// Maps section category names to regular expressions used to identify resume headings
const HEADERS: Record<ChunkMetadata["section"], RegExp> = {
  summary: /^(summary|profile|objective|about)/i,
  work_experience:
    /^(work experience|experience|employment|professional experience)/i,
  education: /^(education|academic background)/i,
  skills: /^(skills|technical skills|core competencies)/i,
  projects: /^(projects|personal projects|portfolio)/i,
  other: /$^/, // Fallback regex that matches nothing
};

// Parses raw text line by line to group content into logical sections based on recognized headings
export function detectSections(text: string): DetectedSection[] {
  const lines = text.split("\n");
  const sections: DetectedSection[] = [];
  let current: DetectedSection | null = null;

  for (const line of lines) {
    // Heuristic: A line is header-shaped if it's relatively short (< 40 chars) and doesn't end with a period
    const isHeaderShaped = line.length < 40 && !line.endsWith(".");

    // Check if the line matches any known section header regex (excluding 'other')
    const matched = isHeaderShaped
      ? (Object.entries(HEADERS).find(
          ([k, re]) => k !== "other" && re.test(line),
        )?.[0] as ChunkMetadata["section"] | undefined)
      : undefined;

    if (matched) {
      // If we find a new section header, save the previous section and start a new one
      if (current) sections.push(current);
      current = { section: matched, heading: line, content: "" };
    } else if (current) {
      // If we are already inside a section, append the current line to its content
      current.content += line + "\n";
    } else {
      // If text appears before any known header, bucket it under the 'other' section
      current = { section: "other", heading: "Header", content: line + "\n" };
    }
  }

  // Push the final remaining section into the array
  if (current) sections.push(current);

  // Clean up whitespace for each section and filter out any sections that ended up empty
  return sections
    .map((s) => ({ ...s, content: s.content.trim() }))
    .filter((s) => s.content.length > 0);
}
