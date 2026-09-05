import { useState } from "react";
import { api } from "../services/api";

export default function JobDescriptionPage({
  sessionId,
  onDone,
}: {
  sessionId: string;
  onDone: () => void;
}) {
  const [jd, setJd] = useState("");
  const [status, setStatus] = useState<"idle" | "analyzing" | "error">("idle");
  const [error, setError] = useState("");

  async function handleAnalyze() {
    setStatus("analyzing");
    setError("");
    try {
      await api.post("/jobs/analyze", { sessionId, jobDescription: jd });
      onDone();
    } catch (err: any) {
      setStatus("error");
      setError(err?.response?.data?.error ?? "Analysis failed");
    }
  }

  return (
    <div>
      <h2>2. Paste the job description</h2>
      <textarea
        rows={12}
        style={{ width: "100%" }}
        value={jd}
        onChange={(e) => setJd(e.target.value)}
      />
      <button
        onClick={handleAnalyze}
        disabled={jd.trim().length < 20 || status === "analyzing"}
      >
        {status === "analyzing" ? "Analyzing..." : "Analyze"}
      </button>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
    </div>
  );
}
