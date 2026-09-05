import "dotenv/config";
import express from "express";
import { getUrls } from "./config/urls.js";
import { connectDB } from "./infrastructure/database/pool.js";
// import documentsRouter from "./modules/documents/documents.routes.js";
// import jobsRouter from "./modules/jobs/jobs.routes.js";

// import { embedText, generateCompletion } from "./config/providers.js";

// console.log("API key loaded:", Boolean(process.env.GOOGLE_API_KEY));
// const embedding = await embedText("Node.js backend developer");
// console.log("Embedding length:", embedding.length);

// const response = await generateCompletion("Say hello in one sentence.");
// console.log("LLM:", response);




const app = express();
const { backendUrl } = getUrls();
const PORT = process.env.PORT;
app.use(express.json());

// app.use("/api/documents", documentsRouter);
// app.use("/api/jobs", jobsRouter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port:${backendUrl}`);
    });
  } catch (err) {
    console.error("Startup failed:", err);
  }
}

await startServer();



