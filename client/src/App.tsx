import { useEffect, useState } from "react";
import { createSession } from "./services/sessions";
import UploadPage from "./pages/UploadPage";
import JobDescriptionPage from "./pages/JobDescriptionPage";
import TailorPage from "./pages/TailorPage";

type Step = "upload" | "job" | "tailor";

export default function App() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [step, setStep] = useState<Step>("upload");
  const [error, setError] = useState("");

  useEffect(() => {
    createSession()
      .then(setSessionId)
      .catch(() =>
        setError("Could not start a session. Is the server running?"),
      );
  }, []);

  return (
    <div
      style={{
        fontFamily: "sans-serif",
        padding: 24,
        maxWidth: 800,
        margin: "0 auto",
      }}
    >
      <h1>CVForge</h1>
      <nav style={{ marginBottom: 16 }}>
        {(["upload", "job", "tailor"] as Step[]).map((s) => (
          <span
            key={s}
            style={{ marginRight: 12, fontWeight: s === step ? 700 : 400 }}
          >
            {s}
          </span>
        ))}
      </nav>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      {!sessionId && !error && <p>Starting session...</p>}
      {sessionId && step === "upload" && (
        <UploadPage sessionId={sessionId} onDone={() => setStep("job")} />
      )}
      {sessionId && step === "job" && (
        <JobDescriptionPage
          sessionId={sessionId}
          onDone={() => setStep("tailor")}
        />
      )}
      {sessionId && step === "tailor" && <TailorPage sessionId={sessionId} />}
    </div>
  );
}
