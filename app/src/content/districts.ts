import type { DistrictId } from "./types";
import type { IconName } from "~/components/Icon";

/** The six Gaurav.OS districts. Every district opens a dedicated page and real destinations. */
export interface District {
  id: DistrictId;
  index: string;
  name: string;
  icon: IconName;
  tone: "green" | "cyan";
  summary: string;
  /** what this district represents, from the brief — every line is backed by a destination */
  represents: string[];
  /** cinematic illustration id (brand/cinematic/manifest.json) or null → original SVG substitute */
  image: string | null;
  background: string;
  destinations: { label: string; to: string; note: string }[];
  /** position on the 3D ground plane, mirroring the world illustration */
  pos: [number, number];
  /** centre of this district's label on the world illustration (gaurav-world-hero), in % */
  world: [number, number];
}

export const districts: District[] = [
  { id: "product-leadership", index: "01", name: "Product Leadership", icon: "product", tone: "green",
    summary: "Product strategy, discovery, prioritization and delivery — owned end to end on Evamastu.",
    represents: ["Product strategy and discovery", "Roadmaps and PRDs", "Prioritization with RICE and MoSCoW", "Product delivery"],
    image: "product-leadership", background: "/brand/districts/district-01-product-leadership.svg", pos: [-6, -8], world: [26.3, 31.5],
    destinations: [
      { label: "Evamastu", to: "/projects/evamastu", note: "Shipped · Associate Product Manager" },
      { label: "Product Thinking", to: "/product-thinking", note: "Operating loop, principles, challenges" },
      { label: "PRD builder", to: "/product-thinking/prd", note: "Working tool" },
      { label: "RICE calculator", to: "/product-thinking/rice", note: "Working tool" },
    ] },
  { id: "healthtech-innovation", index: "02", name: "HealthTech Innovation", icon: "health", tone: "green",
    summary: "Health products designed with safety in mind — prototypes and an MVP, none presented as more than it is.",
    represents: ["Aaroh — non-diagnostic AI health platform", "CareConnect — post-discharge care record", "Healthcare product design"],
    image: "gaurav-world-hero", background: "/brand/districts/district-02-healthtech-innovation.svg", pos: [6, -8], world: [78.1, 31.3],
    destinations: [
      { label: "Aaroh", to: "/projects/aaroh", note: "Pre-launch · interactive prototype" },
      { label: "CareConnect", to: "/projects/careconnect", note: "MVP · no users" },
      { label: "Healthcare projects", to: "/projects?filter=Healthcare", note: "Filtered library" },
    ] },
  { id: "ai-safety-lab", index: "03", name: "AI & Safety Lab", icon: "shield", tone: "cyan",
    summary: "Responsible AI: safety screening before models, evaluation suites, evidence labels and refusals.",
    represents: ["GharGyaan safety architecture", "AI evaluation", "Guardrails and evidence classification", "AI-assisted workflows"],
    image: "ai-safety-lab", background: "/brand/districts/district-03-ai-safety-lab.svg", pos: [11, 1], world: [90.4, 51.5],
    destinations: [
      { label: "GharGyaan", to: "/projects/ghargyaan", note: "214-case evaluation · demo mode" },
      { label: "AI Lab", to: "/ai-lab", note: "Safety architecture and experiments" },
      { label: "Ask Gaurav", to: "/ask", note: "Refuses before it matches" },
      { label: "Nexus", to: "/projects/nexus", note: "Evidence-first AI · demo mode" },
    ] },
  { id: "research-analytics", index: "04", name: "Research & Analytics", icon: "research", tone: "cyan",
    summary: "User research, funnel and cohort analysis, experiment design and 90 published case studies.",
    represents: ["LYBL user research", "PhonePe capstone — funnel and experiment design", "Competitive research", "90 case studies"],
    image: "research-analytics", background: "/brand/districts/district-04-research-analytics.svg", pos: [-6, 9], world: [21.3, 74.1],
    destinations: [
      { label: "Research Expert, LYBL", to: "/experience/research-expert-lybl", note: "30+ interviews · 500+ users tracked" },
      { label: "PhonePe Smart Spend Coach", to: "/projects/phonepe-smart-spend-coach", note: "Academic case · case data" },
      { label: "Research library", to: "/research", note: "90 full case studies" },
      { label: "Funnel explorer", to: "/product-thinking/funnel", note: "Working tool" },
    ] },
  { id: "professional-experience", index: "05", name: "Professional Experience", icon: "experience", tone: "green",
    summary: "Three roles in order: research at Live Your Best Life, then product at Adhyatm Sadhna Kendra.",
    represents: ["Adhyatm Sadhna Kendra — Associate Product Manager", "Adhyatm Sadhna Kendra — Product Management Intern", "Live Your Best Life — Research Expert"],
    image: "professional-experience", background: "/brand/districts/district-05-professional-experience.svg", pos: [-11, 1], world: [13.5, 51.5],
    destinations: [
      { label: "Experience timeline", to: "/experience", note: "All roles" },
      { label: "Associate Product Manager", to: "/experience/apm-adhyatm-sadhna-kendra", note: "May 2025 – Apr 2026" },
      { label: "Product Management Intern", to: "/experience/pm-intern-adhyatm-sadhna-kendra", note: "Nov 2024 – Apr 2025" },
      { label: "Research Expert", to: "/experience/research-expert-lybl", note: "Sep 2022 – Jul 2024" },
    ] },
  { id: "knowledge-hq", index: "06", name: "Knowledge & Headquarters", icon: "hq", tone: "green",
    summary: "About Gaurav, education, certifications, skills, the Product Atlas, the CV and contact.",
    represents: ["Education and certifications", "Skills and product management knowledge", "Product Atlas", "CV and contact"],
    image: "knowledge-headquarters", background: "/brand/districts/district-06-knowledge-hq.svg", pos: [0, 0], world: [51.4, 59.5],
    destinations: [
      { label: "About Gaurav", to: "/about", note: "Background, education, certifications" },
      { label: "Skills library", to: "/skills", note: "174 capabilities mapped to evidence" },
      { label: "Product Atlas", to: "/atlas", note: "Constellation and evolution" },
      { label: "CV", to: "/cv", note: "View or download" },
      { label: "Contact", to: "/contact", note: "Email, LinkedIn, GitHub" },
    ] },
];

export const districtById = (id: string) => districts.find((d) => d.id === id);
