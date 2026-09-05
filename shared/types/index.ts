export interface DocumentRecord {
  id: string;
  filename: string;
  type: "cv";
  createdAt: string;
}

export interface ChunkMetadata {
  section:
    | "work_experience"
    | "education"
    | "skills"
    | "projects"
    | "summary"
    | "other";
  type: string;
  company: string | null;
  role: string | null;
  project: string | null;
  date: string | null;
  technology: string | null;
}

export interface Chunk {
  id: string;
  documentId: string;
  content: string;
  embedding: number[];
  metadata: ChunkMetadata;
}

export interface Session {
  id: string;
  documentId: string | null;
  createdAt: string;
}

export type RequirementCategory =
  | "required_technology"
  | "preferred_technology"
  | "responsibility"
  | "skill"
  | "domain_knowledge"
  | "experience"
  | "keyword";

export interface JobRequirement {
  id: string;
  text: string;
  category: RequirementCategory;
  importance: "required" | "preferred";
}

export interface RetrievedEvidence {
  requirementId: string;
  chunkId: string;
  similarityScore: number;
  metadata: ChunkMetadata;
  content: string;
}

export interface UnsupportedRequirement {
  requirementId: string;
  unsupported: true;
}

export type EvidenceResult = RetrievedEvidence[] | UnsupportedRequirement;

export type ChangeType =
  | "emphasize"
  | "reorder"
  | "rephrase"
  | "deemphasize"
  | "flag_gap";

export interface EditingPlanItem {
  requirementId: string;
  evidenceChunkIds: string[];
  changeType: ChangeType;
  description: string;
}

export interface TailoredDocument {
  sessionId: string;
  prosemirrorJSON: Record<string, unknown>;
  editingPlan: EditingPlanItem[];
}
