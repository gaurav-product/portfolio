/** Shared content types. Every factual claim carries where it came from and
 *  how strong the evidence behind it is. */

export type EvidenceStatus =
  | "VERIFIED"          // checked against a primary artefact (repo, CV)
  | "CV"                // stated in the healthcare CV; the artefact itself is not public
  | "CASE DATA"         // supplied by a course; not production data
  | "DESIGNED, NOT RUN" // an experiment that has a design and no result
  | "SELF-REPORTED"     // owner-stated with no public artefact (e.g. subscriber count)
  | "NOT DOCUMENTED";   // no evidence exists — said plainly

export interface Source {
  id: string;
  label: string;
  href?: string;
  /** what kind of artefact this is */
  kind: "cv" | "repo" | "doc" | "corpus" | "course" | "self";
}

export interface Claim {
  text: string;
  status: EvidenceStatus;
  sources: string[]; // Source ids
}

export type ProjectKind = "professional" | "independent" | "academic" | "research";

export type ProjectStatus =
  | "SHIPPED"
  | "PRE-LAUNCH · PROTOTYPE"
  | "MVP · NO USERS"
  | "PROTOTYPE · DEMO MODE"
  | "ACADEMIC CASE"
  | "PUBLISHED";

export type Block =
  | { p: string }
  | { ul: string[] }
  | { ol: string[] }
  | { note: string }
  | { flow: string[] }
  | { kv: [string, string][] }
  | { table: { head: string[]; rows: string[][]; caption?: string } }
  | { quote: string; cite?: string };

/** The 28-part case-study template; a project uses only the parts it has evidence for. */
export type CaseSectionKey =
  | "summary" | "metadata" | "problem" | "why" | "segments" | "methodology" | "insights" | "jtbd"
  | "opportunity" | "competition" | "vision" | "strategy" | "mvp" | "prioritization" | "journey"
  | "ia" | "flows" | "prototype" | "prd" | "execution" | "experimentation" | "analytics" | "results"
  | "tradeoffs" | "risks" | "learnings" | "next" | "evidence";

export interface CaseSection {
  key: CaseSectionKey;
  title: string;
  blocks: Block[];
  sources?: string[];
  tag?: string; // e.g. "HYPOTHESIS", "NOT YET VALIDATED"
}

export interface Project {
  slug: string;
  name: string;
  subtitle: string;
  kind: ProjectKind;
  kindLabel: string;
  role: string;
  period: string;
  status: ProjectStatus;
  statusTone: "green" | "cyan" | "amber" | "violet";
  oneLine: string;
  categories: ProjectCategory[];
  skills: string[];      // capability ids
  district: DistrictId;
  cover: string;         // public path
  repo?: { label: string; href: string };
  highlights: Claim[];   // the evidence-backed facts shown on cards / recruiter mode
  limits: string[];      // what this project does NOT show
  sections: CaseSection[];
  featured: boolean;
}

export type ProjectCategory =
  | "Healthcare" | "AI" | "Product Management" | "Research" | "Analytics" | "Growth"
  | "Academic" | "Independent Builds" | "Professional Projects";

export type DistrictId =
  | "product-leadership" | "healthtech-innovation" | "ai-safety-lab"
  | "research-analytics" | "professional-experience" | "knowledge-hq";
