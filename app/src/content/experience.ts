/** Employment only. Independent builds and academic work live in projects.ts
 *  and are never shown as jobs. Source: Healthcare CV (Nov 2026). */
export interface Role {
  id: string;
  role: string;
  employer: string;
  location: string;
  period: string;
  start: string; // YYYY-MM
  end: string;
  type: "Full-time" | "Internship" | "Remote role";
  scope: string;
  work: string[];
  outcomes: { value: string; label: string }[];
  tools: string[];
  related: string[]; // project slugs
  sources: string[];
}

export const experience: Role[] = [
  {
    id: "apm-adhyatm-sadhna-kendra",
    role: "Associate Product Manager",
    employer: "Adhyatm Sadhna Kendra",
    location: "New Delhi",
    period: "May 2025 – Apr 2026",
    start: "2025-05", end: "2026-04",
    type: "Full-time",
    scope: "Owned Evamastu, a digital mindfulness platform, from discovery through release.",
    work: [
      "Owned discovery through release for Evamastu, a digital mindfulness platform; wrote the full PRD and shipped a Parent Dashboard, a Child Wellness Assessment and 4 adaptive cognitive games.",
      "Built a cohort analytics system across 50+ participant cohorts; found 2 funnel drop-offs that drove an onboarding redesign, lifting consistency 20–25% in 6 weeks.",
      "Ran sprint planning and backlog grooming; scored 12+ feature requests with RICE and MoSCoW to hold roadmap discipline and cut scope creep.",
    ],
    outcomes: [
      { value: "20–25%", label: "consistency lift in 6 weeks" },
      { value: "50+", label: "participant cohorts analysed" },
      { value: "2", label: "funnel drop-offs found" },
      { value: "12+", label: "feature requests scored (RICE, MoSCoW)" },
    ],
    tools: ["PRD writing", "Cohort analysis", "Funnel analysis", "RICE", "MoSCoW", "Agile sprints", "Jira", "Notion"],
    related: ["evamastu"],
    sources: ["cv"],
  },
  {
    id: "pm-intern-adhyatm-sadhna-kendra",
    role: "Product Management Intern",
    employer: "Adhyatm Sadhna Kendra",
    location: "New Delhi",
    period: "Nov 2024 – Apr 2025",
    start: "2024-11", end: "2025-04",
    type: "Internship",
    scope: "Early discovery for Evamastu.",
    work: [
      "Ran parent and facilitator interviews that shaped the first product brief.",
      "Built the initial backlog and wrote user stories for the first assessment module.",
    ],
    outcomes: [{ value: "1st", label: "product brief, from interview problem statements" }],
    tools: ["Stakeholder interviews", "User stories", "Acceptance criteria", "Backlog"],
    related: ["evamastu"],
    sources: ["cv"],
  },
  {
    id: "research-expert-lybl",
    role: "Research Expert",
    employer: "Live Your Best Life (USA)",
    location: "Remote",
    period: "Sep 2022 – Jul 2024",
    start: "2022-09", end: "2024-07",
    type: "Remote role",
    scope: "Product research for a US wellness company.",
    work: [
      "Led multiple product research projects end to end and developed research-backed wellness modules.",
      "Conducted 30+ structured user interviews; synthesized behavioral patterns and onboarding drop-offs into recommendations adopted across 3 major feature iterations.",
      "Ran competitive analysis and A/B tests on feature and content variants; tracked engagement for 500+ users and delivered weekly insight reports that shaped sprint prioritization.",
    ],
    outcomes: [
      { value: "30+", label: "structured user interviews" },
      { value: "500+", label: "users' engagement tracked" },
      { value: "3", label: "feature iterations adopted the findings" },
    ],
    tools: ["User interviews", "Synthesis", "Competitive analysis", "A/B testing", "Engagement analytics"],
    related: [],
    sources: ["cv"],
  },
];

export const education = [
  { id: "ai-pm", what: "AI-Enabled Product Management Program", org: "Masai School and IIT Roorkee faculty", period: "Dec 2025 – Aug 2026", kind: "Program", note: "A programme taught by Masai School and IIT Roorkee faculty — not an IIT Roorkee degree." },
  { id: "mca", what: "MCA", org: "Chaudhary Charan Singh University, Meerut", period: "2022 – 2024", kind: "Degree" },
  { id: "msc", what: "M.Sc.", org: "S-VYASA University, Bengaluru", period: "2020 – 2022", kind: "Degree" },
  { id: "bsc", what: "B.Sc.", org: "University of Patanjali, Haridwar", period: "2017 – 2020", kind: "Degree" },
] as const;

export const certifications = [
  { issuer: "Anthropic", items: ["Claude Developer Platform", "Claude Agent Development", "Model Context Protocol (MCP)", "Claude Code Learning Path"] },
  { issuer: "Product and AI", items: ["AI in Product Management and Product Strategy (Product School)", "Product Analytics (Pendo)", "Qualcomm AI Upskilling", "Generative AI Mastermind"] },
] as const;

export { newsletter } from "./newsletter";

export const writing = [
  { title: "90 daily product case studies", detail: "Jul – Sep 2026 · public repository", href: "/research", status: "VERIFIED" },
  { title: "The Teardown", detail: "Weekly LinkedIn newsletter · 674 subscribers (self-reported, Nov 2026)", href: "https://www.linkedin.com/build-relation/newsletter-follow?entityUrn=7488215816266584064", status: "SELF-REPORTED" }, // mirrors `newsletter`
] as const;

export const tools = {
  "Product and delivery": ["Requirements gathering", "PRD writing", "User stories & acceptance criteria", "Roadmapping", "MVP definition", "RICE", "MoSCoW", "Agile", "Sprint planning", "Backlog grooming"],
  "Research and analytics": ["User & stakeholder interviews", "Journey mapping", "Competitive analysis", "Funnel & cohort analysis", "A/B test design", "KPIs & North Star metrics", "Google Analytics", "Excel"],
  "Health product safety": ["Evidence-level labelling", "Crisis routing", "Non-diagnostic guardrails", "Consent-based practitioner onboarding", "Claim registers"],
  Tools: ["Jira", "Notion", "Miro", "Figma", "GitHub", "React", "TypeScript", "SQLite", "Claude API", "MCP", "Cursor", "Lovable"],
} as const;
