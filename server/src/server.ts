import "dotenv/config";
import express from "express";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler.js";
import sessionsRoutes from "./modules/sessions/routes.js";
import documentsRoutes from "./modules/ingestion/routes.js";
import jobsRoutes from "./modules/jobs/routes.js";
import retrievalRoutes from "./modules/retrieval/routes.js";
import agentRoutes from "./modules/agents/routes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.get("/api/health", (_req, res) => res.status(200).json({ status: "ok" }));
app.use("/api/sessions", sessionsRoutes);
app.use("/api/documents", documentsRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api/retrieval", retrievalRoutes);
app.use("/api/agent", agentRoutes);
app.use(errorHandler);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`cvforge server on :${port}`));
