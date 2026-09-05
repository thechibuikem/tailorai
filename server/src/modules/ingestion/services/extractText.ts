import pdfParse from "pdf-parse";

export async function extractText(buffer: Buffer): Promise<string> {
  const result = await pdfParse(buffer);
  if (!result.text || result.text.trim().length < 20) {
    throw new Error("Could not extract readable text from PDF");
  }
  return result.text;
}
