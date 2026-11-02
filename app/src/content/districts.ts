import type { DistrictId } from "./types";
import type { IconName } from "~/components/Icon";

/** The six Explore Mode districts. Every district opens real destinations. */
export interface District {
  id: DistrictId;
  index: string;
  name: string;
  icon: IconName;
  tone: "green" | "cyan";
  summary: string;
  background: string;
  destinations: { label: string; to: string; note: string }[];
  /** position on the 3D ground plane and the 2D map */
  pos: [number, number];
  /** centre of this district's box on brand/assets/spatial/district-map-2d.svg, in % */
  map: [number, number];
}

export const districts: District[] = [
  { id: "product-leadership", index: "01", name: "Product Leadership", icon: "leadership", tone: "green",
    summary: "Ownership from discovery to release, prioritization and the operating loop behind it.",
    background: "/brand/districts/district-01-product-leadership.svg", pos: [-9, -4], map: [50, 17],
    destinations: [
      { label: "Evamastu", to: "/projects/evamastu", note: "Shipped · APM" },
      { label: "Product Thinking", to: "/product-thinking", note: "Operating loop, principles, challenges" },
      { label: "Skills library", to: "/skills", note: "Capabilities mapped to evidence" },
    ] },
  { id: "healthtech-innovation", index: "02", name: "HealthTech Innovation", icon: "health", tone: "green",
    summary: "Health products built with safety designed in — none presented as more than it is.",
    background: "/brand/districts/district-02-healthtech-innovation.svg", pos: [-4, -9], map: [73.3, 33.5],
    destinations: [
      { label: "Aaroh", to: "/projects/aaroh", note: "Pre-launch prototype" },
      { label: "CareConnect", to: "/projects/careconnect", note: "MVP · no users" },
      { label: "Healthcare projects", to: "/projects?filter=Healthcare", note: "Filtered library" },
    ] },
  { id: "ai-safety-lab", index: "03", name: "AI & Safety Lab", icon: "shield", tone: "cyan",
    summary: "Guardrails before models: evaluation suites, refusals and human-in-the-loop design.",
    background: "/brand/districts/district-03-ai-safety-lab.svg", pos: [4, -9], map: [73.3, 66.5],
    destinations: [
      { label: "AI Lab", to: "/ai-lab", note: "Safety architecture and experiments" },
      { label: "GharGyaan", to: "/projects/ghargyaan", note: "214-case evaluation" },
      { label: "Nexus", to: "/projects/nexus", note: "Evidence-first AI" },
      { label: "Ask Gaurav", to: "/ask", note: "Refuses before it matches" },
    ] },
  { id: "research-analytics", index: "04", name: "Research & Analytics", icon: "research", tone: "cyan",
    summary: "90 published case studies, the Product Atlas and the analytics tools.",
    background: "/brand/districts/district-04-research-analytics.svg", pos: [9, -4], map: [50, 83],
    destinations: [
      { label: "Research library", to: "/research", note: "90 case studies" },
      { label: "Product Atlas", to: "/atlas", note: "Constellation and evolution" },
      { label: "PhonePe capstone", to: "/projects/phonepe-smart-spend-coach", note: "Academic · case data" },
      { label: "Funnel explorer", to: "/product-thinking/funnel", note: "Interactive tool" },
    ] },
  { id: "experience-growth", index: "05", name: "Experience & Growth", icon: "experience", tone: "green",
    summary: "Three roles, in order: research, internship, then product ownership.",
    background: "/brand/districts/district-05-professional-experience.svg", pos: [-6, 6], map: [26.8, 66.5],
    destinations: [
      { label: "Experience", to: "/experience", note: "Timeline of roles" },
      { label: "Associate Product Manager", to: "/experience/apm-adhyatm-sadhna-kendra", note: "May 2025 – Apr 2026" },
      { label: "Research Expert, LYBL", to: "/experience/research-expert-lybl", note: "Sep 2022 – Jul 2024" },
    ] },
  { id: "knowledge-hq", index: "06", name: "Knowledge & HQ", icon: "hq", tone: "green",
    summary: "Who Gaurav is, what he has studied and how to reach him.",
    background: "/brand/districts/district-06-knowledge-hq.svg", pos: [6, 6], map: [50, 50],
    destinations: [
      { label: "About", to: "/about", note: "Background, education, certifications" },
      { label: "Lab Notes", to: "/lab-notes", note: "Writing (drafts)" },
      { label: "Recruiter Mode", to: "/recruiter", note: "30-second overview" },
      { label: "Contact", to: "/contact", note: "Email, LinkedIn, CV" },
    ] },
];

export const districtById = (id: string) => districts.find((d) => d.id === id);
