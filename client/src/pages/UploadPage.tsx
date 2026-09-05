import { useState } from "react";
import { api } from "../services/api";

export default function UploadPage({
  sessionId,
  onDone,
}: {
  sessionId: string;
  onDone: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [error, setError] = useState("");

  async function handleUpload() {
    if (!file) return;
    setStatus("uploading");
    setError("");
    const form = new FormData();
    form.append("sessionId", sessionId);
    form.append("cv", file);
    try {
      await api.post("/documents/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onDone();
    } catch (err: any) {
      setStatus("error");
      setError(err?.response?.data?.error ?? "Upload failed");
    }
  }

  return (
    <div>
      <h2>1. Upload your CV (PDF)</h2>
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />
      <button onClick={handleUpload} disabled={!file || status === "uploading"}>
        {status === "uploading" ? "Uploading..." : "Upload"}
      </button>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
    </div>
  );
}
