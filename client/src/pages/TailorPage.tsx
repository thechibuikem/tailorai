import { useState } from "react";
import { api } from "../services/api";
import CVEditor from "../components/CVEditor";
import type { EditingPlanItem } from "../../../shared/types";


export default function TailorPage({ sessionId }: { sessionId: string }) {
  const [doc, setDoc] = useState<Record<string, unknown> | null>(null);
  const [plan, setPlan] = useState<EditingPlanItem[]>([]);
  const [status, setStatus] = useState<
    "idle" | "tailoring" | "saving" | "error"
  >("idle");
  const [error, setError] = useState("");

  async function handleTailor() {
    setStatus("tailoring");
    setError("");
    try {
      const res = await api.post("/agent/tailor", { sessionId });
      setDoc(res.data.prosemirrorJSON);
      setPlan(res.data.editingPlan);
      setStatus("idle");
    } catch (err: any) {
      setStatus("error");
      setError(err?.response?.data?.error ?? "Tailoring failed");
    }
  }

  async function handleSave(updatedDoc: Record<string, unknown>) {
    setStatus("saving");
    try {
      await api.patch(`/sessions/${sessionId}`, { document: updatedDoc });
    } finally {
      setStatus("idle");
    }
  }

  const gaps = plan.filter((p) => p.changeType === "flag_gap");

  return (
    <div>
      <h2>3. Tailored CV</h2>
      {!doc && (
        <button onClick={handleTailor} disabled={status === "tailoring"}>
          {status === "tailoring" ? "Tailoring..." : "Generate tailored CV"}
        </button>
      )}
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      {gaps.length > 0 && (
        <div
          style={{
            background: "#fff8e1",
            padding: 12,
            borderRadius: 8,
            margin: "12px 0",
          }}
        >
          <strong>Skill gaps ({gaps.length})</strong>
          <ul>
            {gaps.map((g, i) => (
              <li key={i}>{g.description}</li>
            ))}
          </ul>
        </div>
      )}
      {doc && <CVEditor content={doc} onChange={handleSave} />}
      {status === "saving" && <p>Saving...</p>}
    </div>
  );
}
