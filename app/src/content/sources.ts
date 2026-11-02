import type { Source } from "./types";

/** Every source a claim on this site can cite. */
export const SOURCES: Record<string, Source> = {
  cv: { id: "cv", label: "Healthcare CV (November 2026)", kind: "cv", href: "/cv" },
  "repo-careconnect": { id: "repo-careconnect", label: "github.com/gaurav-product/careconnect", kind: "repo", href: "https://github.com/gaurav-product/careconnect" },
  "repo-ghargyaan": { id: "repo-ghargyaan", label: "github.com/gaurav-product/ghargyaan", kind: "repo", href: "https://github.com/gaurav-product/ghargyaan" },
  "repo-nexus": { id: "repo-nexus", label: "github.com/gaurav-product/nexus", kind: "repo", href: "https://github.com/gaurav-product/nexus" },
  "repo-aaroh": { id: "repo-aaroh", label: "github.com/gaurav-product/aaroh", kind: "repo", href: "https://github.com/gaurav-product/aaroh" },
  "repo-phonepe": { id: "repo-phonepe", label: "github.com/gaurav-product/phonepe-smart-spend-coach-capstone", kind: "course", href: "https://github.com/gaurav-product/phonepe-smart-spend-coach-capstone" },
  "repo-corpus": { id: "repo-corpus", label: "github.com/gaurav-product/product-management-case-studies", kind: "corpus", href: "https://github.com/gaurav-product/product-management-case-studies" },
  "aaroh-docs": { id: "aaroh-docs", label: "Aaroh product documentation (not public)", kind: "doc" },
  "evamastu-employer": { id: "evamastu-employer", label: "Evamastu work at Adhyatm Sadhna Kendra (employer artefacts, not public)", kind: "doc" },
  "cc-case": { id: "cc-case", label: "CareConnect — docs/09-portfolio/case-study.md", kind: "repo", href: "https://github.com/gaurav-product/careconnect/blob/main/docs/09-portfolio/case-study.md" },
  "cc-decisions": { id: "cc-decisions", label: "CareConnect — docs/05-decisions/decision-log.md", kind: "repo", href: "https://github.com/gaurav-product/careconnect/blob/main/docs/05-decisions/decision-log.md" },
  "cc-metrics": { id: "cc-metrics", label: "CareConnect — docs/06-metrics/metrics.md", kind: "repo", href: "https://github.com/gaurav-product/careconnect/blob/main/docs/06-metrics/metrics.md" },
  "gg-docs": { id: "gg-docs", label: "GharGyaan — docs/01–16 (problem, research, personas, JTBD, strategy, PRD, metrics, learnings)", kind: "repo", href: "https://github.com/gaurav-product/ghargyaan/tree/main/docs" },
  "pp-prd": { id: "pp-prd", label: "PhonePe capstone — part-a/task-5-prd-lite.md", kind: "course", href: "https://github.com/gaurav-product/phonepe-smart-spend-coach-capstone/blob/main/capstone/part-a/task-5-prd-lite.md" },
  "pp-partc": { id: "pp-partc", label: "PhonePe capstone — part-c/part-c-full.md", kind: "course", href: "https://github.com/gaurav-product/phonepe-smart-spend-coach-capstone/blob/main/capstone/part-c/part-c-full.md" },
  "aaroh-roadmap": { id: "aaroh-roadmap", label: "Aaroh — ROADMAP.md", kind: "repo", href: "https://github.com/gaurav-product/aaroh/blob/main/ROADMAP.md" },
  "aaroh-nsm": { id: "aaroh-nsm", label: "Aaroh — docs/product/metrics/north-star-metric.md", kind: "repo", href: "https://github.com/gaurav-product/aaroh/blob/main/docs/product/metrics/north-star-metric.md" },
  self: { id: "self", label: "Owner-stated", kind: "self" },
};

export const source = (id: string): Source => {
  const s = SOURCES[id];
  if (!s) throw new Error(`Unknown source "${id}"`);
  return s;
};
