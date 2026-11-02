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
  self: { id: "self", label: "Owner-stated", kind: "self" },
};

export const source = (id: string): Source => {
  const s = SOURCES[id];
  if (!s) throw new Error(`Unknown source "${id}"`);
  return s;
};
