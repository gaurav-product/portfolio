import type { Block } from "./types";

/**
 * Ask Gaurav — a deterministic, local knowledge base. No language model is
 * connected. Each answer is pre-written from verified content; the engine
 * selects, it never composes. Unsupported questions are refused BEFORE topic
 * matching, so "Aaroh's revenue" is refused rather than answered with the
 * general Aaroh entry.
 */
export interface KbEntry {
  id: string;
  q: string;
  keys: string[];
  answer: Block[];
  links: { label: string; to: string }[];
}

export const suggested = [
  "What products has Gaurav worked on?",
  "What is his product discovery experience?",
  "Tell me about Evamastu.",
  "What is his AI product experience?",
  "What does he know about product analytics?",
  "What are his healthcare product projects?",
  "What are his strongest case studies?",
  "What tools has he used?",
];

export const kb: KbEntry[] = [
  {
    id: "products", q: "What products has Gaurav worked on?",
    keys: ["products", "worked on", "projects", "built", "portfolio", "work"],
    answer: [
      { p: "Seven, and they are different kinds of work:" },
      { ul: [
        "Evamastu — digital mindfulness platform, as Associate Product Manager at Adhyatm Sadhna Kendra (employment). Shipped.",
        "Aaroh — AI root-cause health platform, as founder and product lead. Pre-launch interactive prototype, 0 live users.",
        "CareConnect — post-discharge care accountability layer. Independent build; working MVP, no users.",
        "GharGyaan — self-care knowledge app with a safety engine. Independent build; prototype in demo mode, not deployed.",
        "Nexus — situation inbox over email, calendar and documents. Independent build; demo mode with fictional data.",
        "PhonePe Smart Spend Coach — academic capstone (Masai School × IIT Roorkee faculty). Case data; A/B test designed, not run.",
        "90 daily product case studies — public repository.",
      ] },
    ],
    links: [{ label: "Project library", to: "/projects" }],
  },
  {
    id: "discovery", q: "What is his product discovery experience?",
    keys: ["discovery", "research", "interview", "interviews", "user research", "validate", "customer"],
    answer: [
      { ul: [
        "30+ structured user interviews at Live Your Best Life (USA), 2022–2024; findings adopted across 3 major feature iterations.",
        "Parent and facilitator interviews at Adhyatm Sadhna Kendra that became the problem statements behind Evamastu's first brief.",
        "20+ customer discovery interviews on Aaroh before a roadmap existed.",
        "CareConnect: discovery contradicted his own marketplace brief, and he rejected it — documented as decision D-01.",
      ] },
      { note: "Interview transcripts and syntheses are not public, so no interview finding is quoted as a statistic." },
    ],
    links: [{ label: "Experience", to: "/experience" }, { label: "CareConnect", to: "/projects/careconnect" }],
  },
  {
    id: "evamastu", q: "Tell me about Evamastu.",
    keys: ["evamastu", "mindfulness", "adhyatm", "sadhna", "parent dashboard", "cognitive games", "consistency"],
    answer: [
      { p: "Evamastu is a digital mindfulness platform at Adhyatm Sadhna Kendra, New Delhi. Gaurav joined as PM intern for early discovery (Nov 2024) and owned it as Associate Product Manager (May 2025 – Apr 2026)." },
      { ul: [
        "Wrote the full PRD; shipped a Parent Dashboard, a Child Wellness Assessment and 4 adaptive cognitive games.",
        "Built a cohort analytics system across 50+ participant cohorts and found 2 funnel drop-offs.",
        "The onboarding redesign that followed lifted consistency 20–25% in 6 weeks.",
        "Scored 12+ feature requests with RICE and MoSCoW.",
      ] },
    ],
    links: [{ label: "Evamastu case study", to: "/projects/evamastu" }],
  },
  {
    id: "ai", q: "What is his AI product experience?",
    keys: ["ai", "llm", "model", "claude", "artificial intelligence", "machine learning", "rag", "safety", "guardrail", "mcp"],
    answer: [
      { ul: [
        "Aaroh: PRDs for AI intake, root-cause mapping and recommendations under a strict non-diagnostic rule; a 37-screen interactive prototype. Pre-launch.",
        "GharGyaan: a deterministic safety engine that runs before any AI — 21 emergency categories, crisis routing, hard blocks on dosing — and a 214-case evaluation suite. Held-out rounds found 4 safety misses before fixes; all are now regression tests.",
        "Nexus: optional AI that is schema-validated and grounding-checked; it never acts on the user's behalf.",
        "Certifications: Anthropic Claude Developer Platform, Claude Agent Development, MCP; Claude Code learning path; AI-Enabled PM Program (Masai School × IIT Roorkee faculty).",
      ] },
      { note: "No AI system he built is in production with users." },
    ],
    links: [{ label: "AI Lab", to: "/ai-lab" }],
  },
  {
    id: "analytics", q: "What does he know about product analytics?",
    keys: ["analytics", "funnel", "cohort", "metric", "metrics", "north star", "a/b", "ab test", "experiment", "data", "kpi"],
    answer: [
      { ul: [
        "Evamastu: cohort analytics across 50+ participant cohorts; 2 funnel drop-offs; onboarding redesign → +20–25% consistency in 6 weeks.",
        "Live Your Best Life: engagement tracked for 500+ users; A/B tests on feature and content variants; weekly insight reports.",
        "PhonePe capstone: a 40,000-user pilot funnel (capstone-supplied case data), 7.14% end to end; the 70% insight-to-action loss prioritised; a 21-day A/B test with a guardrail metric — designed, not run.",
        "CareConnect: north star split into documented vs complete care days, with three guardrails.",
      ] },
    ],
    links: [{ label: "Funnel explorer", to: "/product-thinking/funnel" }, { label: "PhonePe case", to: "/projects/phonepe-smart-spend-coach" }],
  },
  {
    id: "healthcare", q: "What are his healthcare product projects?",
    keys: ["healthcare", "health", "medical", "patient", "clinical", "wellness", "care", "hospital", "discharge", "healthtech"],
    answer: [
      { ul: [
        "Evamastu — child and family mindfulness/wellness platform (employment, shipped).",
        "Aaroh — non-diagnostic AI health platform, 8 consented practitioners, 0 live users.",
        "CareConnect — the first 30 days after hospital discharge; MVP, no users.",
        "GharGyaan — everyday self-care with safety-first routing; prototype in demo mode, not clinically reviewed.",
        "24 of the 90 case studies are about healthcare or health-AI products.",
      ] },
      { note: "No clinical qualification or regulatory compliance is claimed." },
    ],
    links: [{ label: "Healthcare projects", to: "/projects?filter=Healthcare" }],
  },
  {
    id: "clinical-status", q: "Are any of his health products clinically validated or diagnostic?",
    keys: ["diagnostic", "diagnose", "diagnoses", "diagnosis", "clinically", "clinical validation", "clinically validated", "validated", "medical advice", "medical device", "doctor", "regulated", "regulatory", "fda", "cdsco", "approved", "certified"],
    answer: [
      { p: "No. None of the health products on this site is clinically validated, regulator-approved or diagnostic." },
      { ul: [
        "Aaroh — designed as non-diagnostic; pre-launch prototype with 0 live users; clinical and commercial claims await an external legal citation pass.",
        "GharGyaan — working prototype in demo mode; not deployed, no users, not clinically reviewed. Its safety suites pass, but held-out evaluation found 4 safety misses, disclosed on the case study.",
        "CareConnect — MVP with no users; no clinical study.",
        "Evamastu — a wellness and mindfulness platform, not a medical product.",
      ] },
      { note: "No clinical qualification or regulatory compliance is claimed anywhere on this site." },
    ],
    links: [{ label: "GharGyaan case study", to: "/projects/ghargyaan" }, { label: "Aaroh case study", to: "/projects/aaroh" }, { label: "AI Lab", to: "/ai-lab" }],
  },
  {
    id: "phonepe", q: "Did he work at PhonePe?",
    keys: ["phonepe", "phone pe", "smart spend", "spend coach", "work at phonepe", "worked at phonepe"],
    answer: [
      { p: "No. The PhonePe Smart Spend Coach is an academic capstone (Masai School × IIT Roorkee) — not employment at, or work for, PhonePe." },
      { ul: [
        "The 40,000-user pilot funnel (7.14 % end to end) is course-supplied case data, not PhonePe production data.",
        "The 21-day A/B test with a guardrail metric was designed, not run.",
      ] },
    ],
    links: [{ label: "PhonePe case study", to: "/projects/phonepe-smart-spend-coach" }],
  },
  {
    id: "strongest", q: "What are his strongest case studies?",
    keys: ["strongest", "best", "case study", "case studies", "recommend", "start with", "favourite"],
    answer: [
      { ul: [
        "Evamastu — the only one with a shipped product and a measured outcome.",
        "CareConnect — rejecting his own brief, and a claim register that grades every conclusion.",
        "GharGyaan — the most technically detailed safety story, including its failures.",
        "PhonePe capstone — the clearest analytics and experiment design, on case data.",
      ] },
    ],
    links: [{ label: "Case studies", to: "/case-studies" }],
  },
  {
    id: "tools", q: "What tools has he used?",
    keys: ["tools", "tool", "stack", "software", "jira", "figma", "notion", "react", "typescript", "sqlite", "cursor", "lovable"],
    answer: [
      { kv: [
        ["Product", "Jira, Notion, Miro, Figma"],
        ["Analytics", "Google Analytics, Excel"],
        ["Build", "GitHub, React, TypeScript, SQLite"],
        ["AI", "Claude API, MCP, Cursor, Lovable"],
      ] },
    ],
    links: [{ label: "Skills library", to: "/skills" }],
  },
  {
    id: "education", q: "What is his education?",
    keys: ["education", "degree", "mca", "university", "study", "studied", "qualification", "msc", "bsc", "iit"],
    answer: [
      { ul: [
        "AI-Enabled Product Management Program — Masai School and IIT Roorkee faculty, Dec 2025 – Aug 2026 (a programme, not an IIT degree).",
        "MCA — Chaudhary Charan Singh University, Meerut, 2022 – 2024.",
        "M.Sc. — S-VYASA University, Bengaluru, 2020 – 2022.",
        "B.Sc. — University of Patanjali, Haridwar, 2017 – 2020.",
      ] },
    ],
    links: [{ label: "About", to: "/about" }],
  },
  {
    id: "experience", q: "What is his work experience?",
    keys: ["experience", "job", "jobs", "employment", "career", "worked", "apm", "intern", "roles", "years"],
    answer: [
      { ul: [
        "Associate Product Manager — Adhyatm Sadhna Kendra, New Delhi, May 2025 – Apr 2026.",
        "Product Management Intern — Adhyatm Sadhna Kendra, Nov 2024 – Apr 2025.",
        "Research Expert — Live Your Best Life (USA), remote, Sep 2022 – Jul 2024.",
      ] },
      { note: "Aaroh, CareConnect, GharGyaan and Nexus are independent builds, and PhonePe is an academic capstone — none is employment." },
    ],
    links: [{ label: "Experience", to: "/experience" }],
  },
  {
    id: "contact", q: "How can I contact him?",
    keys: ["contact", "email", "reach", "hire", "linkedin", "cv", "resume", "available", "interview"],
    answer: [
      { p: "Email gauravkumarsingh773@gmail.com or LinkedIn. He is available to interview immediately. The CV is downloadable from every page." },
    ],
    links: [{ label: "Contact", to: "/contact" }],
  },
];

/** Asked-for figures the portfolio does not contain. Checked first. */
export const NO_EVIDENCE_TERMS = [
  "revenue", "arr", "mrr", "salary", "ctc", "compensation", "expected pay", "profit", "monetis", "monetiz",
  "how many users", "user count", "active users", "dau", "mau", "traction", "churn", "ltv", "cac",
  "valuation", "funding", "raised", "investor", "test result", "a/b result", "ab result", "conversion lift",
  "roi", "net worth", "package", "phone number", "phone", "address", "age", "married", "religion",
];

export const NO_EVIDENCE_REPLY: Block[] = [
  { p: "I don't have portfolio evidence to answer that." },
  { p: "The question asks for something this portfolio does not contain, and inventing it is exactly what this assistant is built not to do. For the record: Aaroh has no live users and no revenue; CareConnect, GharGyaan and Nexus have no users; the PhonePe A/B test was designed, not run, so it has no result. Private details such as a phone number are not published." },
];
