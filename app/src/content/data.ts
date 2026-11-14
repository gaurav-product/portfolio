/** Typed access to the data bridged from the existing portfolio. */
import summaryJson from "../data/generated/corpus-summary.json";
import legacyJson from "../data/generated/legacy.json";

export interface Study {
  day: number; company: string; title: string; slug: string; category: string; industry: string | null;
  summary: string; words: number; sources: number; evidence_level: "VERIFIED" | "DOCUMENTED" | "SOURCED" | "NARRATIVE";
  evidence_score: number; has_prd: boolean; has_experiment: boolean; has_metrics: boolean; has_assumptions: boolean;
  verification: boolean | string; checks: number | null; github_url: string; readme_url: string;
  assumptions_url: string | null; flags: string[]; internal_day: number | null;
}
export interface Corpus {
  repo: string; audited: string;
  counts: { directories: number; written: number; empty: number; words: number; sources: number; assumption_files: number; verified: number; assets: number };
  categories: Record<string, number>;
  evidence_levels: Record<string, number | { count: number }>;
  evidence_formula: string[];
  blocks: { label: string; from: number; to: number; avg_words: number; avg_sources: number; assumptions: number; verification: number; avg_evidence: number }[];
  stages: { id: string; label: string; basis: string; count: number }[];
  capabilities: { id: string; label: string; basis: string; count: number; days: number[] }[];
  anomalies: { day_mismatch: { day: number; internal: number; company: string }[]; index_contradictions: { claim: string; tree: string }[] };
  studies: Study[];
}
export interface LabNote {
  id: string; slug: string; week: string; title: string; date: string; category: string; tags: string[];
  reading_time: string; status: string; excerpt: string; content: string; related_project?: string;
}
export interface Legacy {
  lab_notes: LabNote[];
  lab_config: { subtitle: string; categories: string[]; publishing_note: string };
  experiments: { id: string; num: string; name: string; status: string; question: string; method: string; evidence: string; next: string }[];
  loop: { id: string; k: string; d: string; e: [string, string][] }[];
  principles: [string, string][];
  challenges: { id: string; num: string; tag: string; scenario: string; ask: string; options: string[]; approach: [string, string][] }[];
  orbit: { inner: { id: string; label: string; blurb: string }[]; outer: { label: string; blurb: string }[] };
  product_question: { text: string; note: string };
  research: { metrics: { n: string; l: string }[]; produced: string; now: string; note: string };
  aaroh_decision_log: { id: string; decision: string; why: string; evidence: string; tradeoff: string; changed: string; next: string }[];
  intro: { video: string; poster: string; duration: number };
}

/** Counts, stages and blocks only — cheap enough for any page. */
export const corpusSummary = summaryJson as unknown as Omit<Corpus, "studies">;
export const legacy = legacyJson as unknown as Legacy;
export const noteBySlug = (s: string) => legacy.lab_notes.find((n) => n.slug === s);
