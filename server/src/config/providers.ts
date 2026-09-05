import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
  throw new Error("GOOGLE_API_KEY missing — set them in .env");
}

const genAI = new GoogleGenerativeAI(apiKey);
const embeddingModel = genAI.getGenerativeModel({
  model: "gemini-embedding-001",
});
const llmModel = genAI.getGenerativeModel({ model: "gemini-3.7-flash" });

export async function embedText(text: string): Promise<number[]> {
  const result = await embeddingModel.embedContent(text);
  return result.embedding.values;
}

export async function generateCompletion(input: string, opts: { json?: boolean } = {},
): Promise<string> {
  const result = await llmModel.generateContent({
    contents: [{ role: "user", parts: [{ text: input }] }],
    generationConfig: opts.json
      ? { responseMimeType: "application/json" }
      : undefined,
  });
  return result.response.text();
}
