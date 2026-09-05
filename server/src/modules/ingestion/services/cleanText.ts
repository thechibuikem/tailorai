export function cleanText(raw: string): string {
  return (
    raw
      // Convert Windows-style carriage returns (\r\n) to Unix-style line feeds (\n)
      .replace(/\r\n/g, "\n")

      // Replace common bullet point symbols (•, ●, ▪) with a standard hyphen (-)
      .replace(/[\u2022\u25CF\u25A0]/g, "-")

      // Collapse multiple consecutive spaces or tabs into a single space
      .replace(/[ \t]{2,}/g, " ")

      // Reduce three or more consecutive line breaks down to a double line break (paragraph break)
      .replace(/\n{3,}/g, "\n\n")

      // Split the text into an array of individual lines
      .split("\n")

      // Remove leading and trailing whitespace from each line
      .map((l) => l.trim())

      // Filter out completely empty lines (falsy strings)
      .filter(Boolean)

      // Rejoin the lines back into a single string separated by single line breaks
      .join("\n")

      // Final trim to remove any remaining whitespace at the very beginning or end of the text
      .trim()
  );
}
