import type { Project } from "./types";
import * as CASE from "./case-studies";

/**
 * The project library. Sections follow the 28-part case-study template, but a
 * project only carries the parts its evidence supports — absent parts are
 * absent, not padded. Employment work (Evamastu) is marked "professional";
 * self-directed builds "independent"; course work "academic".
 */
export const projects: Project[] = [
  /* ------------------------------------------------------------ EVAMASTU */
  {
    slug: "evamastu",
    name: "Evamastu",
    subtitle: "Digital mindfulness platform",
    kind: "professional",
    kindLabel: "Professional · Adhyatm Sadhna Kendra",
    role: "Associate Product Manager (PM Intern before May 2025)",
    period: "Nov 2024 – Apr 2026",
    status: "SHIPPED",
    statusTone: "green",
    oneLine: "Owned discovery through release; cohort analysis found two drop-offs, and the onboarding redesign lifted consistency 20–25% in six weeks.",
    categories: ["Healthcare", "Product Management", "Analytics", "Professional Projects"],
    skills: ["prd", "cohort-analysis", "funnel-analysis", "rice", "moscow", "stakeholder-interviews", "sprint-planning", "onboarding", "user-stories"],
    district: "product-leadership",
    cover: "/brand/covers/cover-evamastu.svg",
    featured: true,
    highlights: [
      { text: "Wrote the full PRD and shipped a Parent Dashboard, a Child Wellness Assessment and 4 adaptive cognitive games", status: "CV", sources: ["cv"] },
      { text: "Cohort analytics across 50+ participant cohorts found 2 funnel drop-offs", status: "CV", sources: ["cv"] },
      { text: "Onboarding redesign lifted consistency 20–25% in 6 weeks", status: "CV", sources: ["cv"] },
      { text: "12+ feature requests scored with RICE and MoSCoW", status: "CV", sources: ["cv"] },
    ],
    limits: [
      "Employer artefacts (PRD, dashboards, cohort data) are not public, so none is reproduced here.",
      "\"Consistency\" is the metric as reported in the CV; its exact definition is not published.",
    ],
    sections: CASE.evamastu,
  },

  /* --------------------------------------------------------------- AAROH */
  {
    slug: "aaroh",
    name: "Aaroh",
    subtitle: "AI root-cause health platform",
    kind: "independent",
    kindLabel: "Independent · founder",
    role: "Founder and product lead",
    period: "May 2026 – Present",
    status: "PRE-LAUNCH · PROTOTYPE",
    statusTone: "amber",
    oneLine: "A non-diagnostic health platform: 20+ discovery interviews, 8 consented practitioners, a 37-screen interactive prototype — and a strategy reset in progress.",
    categories: ["Healthcare", "AI", "Product Management", "Independent Builds"],
    skills: ["discovery-interviews", "prd", "ai-product-strategy", "guardrails", "non-diagnostic-design", "consent-onboarding", "north-star", "rice", "moscow", "product-vision"],
    district: "healthtech-innovation",
    cover: "/brand/covers/cover-aaroh.svg",
    repo: { label: "github.com/gaurav-product/aaroh", href: "https://github.com/gaurav-product/aaroh" },
    featured: true,
    highlights: [
      { text: "20+ discovery interviews before a roadmap existed", status: "CV", sources: ["cv"] },
      { text: "8 consented practitioners across yoga therapy, counselling psychology, nutrition and Ayurveda", status: "CV", sources: ["cv"] },
      { text: "37-screen interactive prototype (304 interactive elements per the repository)", status: "VERIFIED", sources: ["cv", "repo-aaroh"] },
      { text: "0 live users · pre-launch · positioning and scope being reset", status: "VERIFIED", sources: ["cv", "repo-aaroh"] },
    ],
    limits: [
      "Nothing is validated with live users — there are none.",
      "Activation, retention and adoption are defined but have no data.",
      "The prototype's implementation stack is being confirmed, so it is not stated here.",
      "Commercial features are sealed pending legal review.",
    ],
    sections: CASE.aaroh,
  },

  /* --------------------------------------------------------- CARECONNECT */
  {
    slug: "careconnect",
    name: "CareConnect",
    subtitle: "Post-discharge care accountability layer",
    kind: "independent",
    kindLabel: "Independent build",
    role: "Self-directed product build",
    period: "Sep 2026",
    status: "MVP · NO USERS",
    statusTone: "cyan",
    oneLine: "Discovery rejected my own marketplace brief. The pivot: the care record that stays with the patient for the first 30 days after discharge.",
    categories: ["Healthcare", "Product Management", "Research", "Independent Builds"],
    skills: ["problem-framing", "hypothesis", "pivot", "decision-log", "north-star", "guardrail-metrics", "claim-register", "caregiver-journey", "post-discharge"],
    district: "healthtech-innovation",
    cover: "/brand/covers/cover-careconnect.svg",
    repo: { label: "github.com/gaurav-product/careconnect", href: "https://github.com/gaurav-product/careconnect" },
    featured: true,
    highlights: [
      { text: "Pivoted from a caregiver marketplace to a care record, documented as decision D-01", status: "VERIFIED", sources: ["cv", "repo-careconnect"] },
      { text: "Working MVP: React, Express, TypeScript, SQLite", status: "VERIFIED", sources: ["repo-careconnect"] },
      { text: "65 unit and integration tests and 30 end-to-end journeys (as of the CV)", status: "CV", sources: ["cv"] },
      { text: "No users, no revenue, no traction — stated by the repository itself", status: "VERIFIED", sources: ["repo-careconnect"] },
    ],
    limits: [
      "Usability claims are design judgement until the planned interviews run.",
      "WhatsApp/SMS delivery is not connected.",
      "Research was secondary only — no user interviews have been run.",
      "Test counts: the CV states 65 unit/integration and 30 end-to-end; the repository case study now reports 142 checks (70 / 72 plus an accessibility sweep).",
    ],
    sections: CASE.careconnect,
  },

  /* ----------------------------------------------------------- GHARGYAAN */
  {
    slug: "ghargyaan",
    name: "GharGyaan",
    subtitle: "Everyday self-care knowledge app",
    kind: "independent",
    kindLabel: "Independent build",
    role: "Self-directed product build",
    period: "Sep 2026",
    status: "PROTOTYPE · DEMO MODE",
    statusTone: "cyan",
    oneLine: "A safety engine that runs before any AI. 214/214 tests pass — and the held-out rounds found four safety misses first, which are disclosed here.",
    categories: ["Healthcare", "AI", "Independent Builds"],
    skills: ["guardrails", "crisis-routing", "evaluation-datasets", "evidence-labelling", "hallucination-mitigation", "human-in-the-loop", "model-evaluation", "privacy"],
    district: "ai-safety-lab",
    cover: "/brand/covers/cover-ghargyaan.svg",
    repo: { label: "github.com/gaurav-product/ghargyaan", href: "https://github.com/gaurav-product/ghargyaan" },
    featured: true,
    highlights: [
      { text: "Deterministic safety screening across 21 emergency categories runs before retrieval and AI", status: "VERIFIED", sources: ["repo-ghargyaan", "cv"] },
      { text: "214/214 tests: 206 scenario cases, 2 knowledge-base integrity checks, 6 output-validator checks", status: "VERIFIED", sources: ["repo-ghargyaan"] },
      { text: "Held-out rounds found 4 safety misses before fixes; all are now regression tests", status: "VERIFIED", sources: ["repo-ghargyaan"] },
      { text: "Working prototype in demo mode · not deployed · no users · not clinically reviewed", status: "VERIFIED", sources: ["repo-ghargyaan"] },
    ],
    limits: [
      "Not for real-world medical use; no clinician has reviewed any guide or rule.",
      "10 of 48 guides lack a verified source and are labelled so.",
      "The live AI layer is written but not deployed or tested with real keys.",
      "Guide text is English; Hindi and Hinglish are supported for input and the UI.",
    ],
    sections: CASE.ghargyaan,
  },

  /* ------------------------------------------------------------- PHONEPE */
  {
    slug: "phonepe-smart-spend-coach",
    name: "PhonePe Smart Spend Coach",
    subtitle: "Feature design and growth case",
    kind: "academic",
    kindLabel: "Academic case study · Masai School × IIT Roorkee",
    role: "Capstone, AI-Enabled Product Management Program",
    period: "Aug 2026",
    status: "ACADEMIC CASE",
    statusTone: "violet",
    oneLine: "A capstone on supplied case data: the loss sits at insight-to-action, so a 21-day A/B test targets that step — designed, not run.",
    categories: ["Analytics", "Growth", "Product Management", "Academic"],
    skills: ["funnel-analysis", "ab-testing", "experiment-design", "guardrail-metrics", "rice", "prd", "usability-testing", "hypothesis"],
    district: "research-analytics",
    cover: "/brand/covers/cover-phonepe-smart-spend-coach.svg",
    repo: { label: "phonepe-smart-spend-coach-capstone", href: "https://github.com/gaurav-product/phonepe-smart-spend-coach-capstone" },
    featured: true,
    highlights: [
      { text: "Academic capstone — not employment at, or work for, PhonePe", status: "VERIFIED", sources: ["repo-phonepe"] },
      { text: "40,000-user pilot funnel, 7.14% end to end — capstone-supplied case data", status: "CASE DATA", sources: ["repo-phonepe", "cv"] },
      { text: "5-screen Figma prototype tested with 7 real users", status: "VERIFIED", sources: ["repo-phonepe"] },
      { text: "21-day A/B test with a guardrail metric — designed, not executed", status: "DESIGNED, NOT RUN", sources: ["repo-phonepe", "cv"] },
    ],
    limits: [
      "The funnel figures are supplied course data, not PhonePe production data.",
      "The A/B test has no result because it was never run.",
      "No High-severity friction was observed in testing; the experiment is built on the strongest Medium finding, and says so.",
    ],
    sections: CASE.phonepe,
  },

  /* --------------------------------------------------------------- NEXUS */
  {
    slug: "nexus",
    name: "Nexus",
    subtitle: "Personal decision and context engine",
    kind: "independent",
    kindLabel: "Independent build",
    role: "Self-directed 0→1 build",
    period: "Sep 2026",
    status: "PROTOTYPE · DEMO MODE",
    statusTone: "cyan",
    oneLine: "A situation inbox over email, calendar and documents: conflicts, changes, commitments and missing information — evidence first, never acting for you.",
    categories: ["AI", "Product Management", "Independent Builds"],
    skills: ["ai-product-strategy", "guardrails", "hallucination-mitigation", "rag", "privacy", "hypothesis", "competitive-research"],
    district: "ai-safety-lab",
    cover: "/brand/covers/cover-nexus.svg",
    repo: { label: "github.com/gaurav-product/nexus", href: "https://github.com/gaurav-product/nexus" },
    featured: false,
    highlights: [
      { text: "Working MVP in demo mode with fictional data; no AI model is called", status: "VERIFIED", sources: ["repo-nexus"] },
      { text: "Deterministic rules for dates, linking and status; optional AI is schema-validated and grounding-checked", status: "VERIFIED", sources: ["repo-nexus"] },
      { text: "95 engine + 21 UI tests per the repository", status: "VERIFIED", sources: ["repo-nexus"] },
    ],
    limits: ["No real accounts are connected.", "Nothing has been validated with real users; product work is frozen until there is evidence."],
    sections: [
      { key: "summary", title: "Executive summary", sources: ["repo-nexus"], blocks: [
        { p: "Nexus is a situation inbox: it finds where your sources disagree, what changed, and what is still open, then shows the exact source text and lets you decide. It is deliberately not a chatbot, a second brain or an autonomous agent." },
      ]},
      { key: "strategy", title: "Product thesis", sources: ["repo-nexus"], blocks: [
        { quote: "For personal information spread across sources, a small set of persistent, evidence-backed situations is more useful and more trusted than a daily narrative briefing or an autonomous agent.", cite: "Nexus README" },
        { p: "Research across 20 products showed proactive briefings already exist, so the thesis is about the interaction model, not about being first — and its falsification conditions are written down." },
      ]},
      { key: "flows", title: "Situation types", sources: ["repo-nexus"], blocks: [
        { table: { head: ["Type", "Example from the demo (fictional data)"], rows: [
          ["Conflict", "Calendar and an email disagree on an interview date; Nexus shows both and does not pick"],
          ["Change", "A flight moved; the calendar still shows the old time"],
          ["Commitment", "\"I'll send the revised proposal by Thursday\" — no evidence it was sent"],
          ["Missing information", "A signed NDA was requested; only an unsigned copy was found"],
        ] } },
      ]},
      { key: "risks", title: "Limitations", sources: ["repo-nexus"], blocks: [
        { ul: ["Demo mode with fictional data", "No AI model called in the demo", "Postgres schema applied to a test DB only; not deployed", "No user validation yet"] },
      ]},
      { key: "evidence", title: "Evidence and references", sources: ["repo-nexus"], blocks: [
        { note: "Facts from the public repository. 12 real screenshots (fictional demo data) await approval for use here." },
      ]},
    ],
  },

  /* --------------------------------------------------------- RUPEERADAR */
  {
    slug: "rupee-radar",
    name: "RupeeRadar",
    subtitle: "AI-assisted bank-statement analysis",
    kind: "independent",
    kindLabel: "Independent build · AI engineering challenge",
    role: "Solo build to a challenge brief",
    period: "Jun 2026",
    status: "PROTOTYPE · NOT DEPLOYED",
    statusTone: "cyan",
    oneLine: "Upload a CSV or Excel bank statement and see where the money goes: cleaned merchant names, categories, recurring payments, a dashboard and a printable report.",
    categories: ["AI", "Analytics", "Independent Builds"],
    skills: ["ai-product-strategy", "dashboards", "privacy", "guardrails"],
    district: "research-analytics",
    cover: "/brand/covers/cover-rupee-radar.webp",
    repo: { label: "github.com/gaurav-product/rupee-radar", href: "https://github.com/gaurav-product/rupee-radar" },
    featured: false,
    highlights: [
      { text: "Working prototype: FastAPI and pandas pipeline behind a React 19 dashboard (CSV and Excel upload)", status: "VERIFIED", sources: ["repo-rupee-radar"] },
      { text: "Hybrid categorisation: rules and a merchant dictionary first, Groq-hosted Llama 3.1 only as a fallback", status: "VERIFIED", sources: ["repo-rupee-radar"] },
      { text: "4 automated pipeline tests: description cleaning, date parsing, rule categorisation, recurring detection", status: "VERIFIED", sources: ["repo-rupee-radar"] },
    ],
    limits: [
      "Not deployed: the production API address in the repository is still a placeholder.",
      "Built to an AI engineering challenge brief; no users and no outcome data.",
      "The README's screenshot sections are placeholders, so no screenshots are shown here.",
      "PDF export uses the browser's print dialog.",
    ],
    sections: [
      { key: "summary", title: "Executive summary", sources: ["repo-rupee-radar"], blocks: [
        { p: "RupeeRadar turns a messy bank statement into a readable picture of spending. A user uploads a CSV or Excel file; the pipeline cleans each transaction description into a merchant name, assigns one of ten categories, finds recurring payments such as subscriptions, EMIs, rent and SIPs, and calculates income, spend, savings and the largest transactions for a dashboard and a printable report." },
      ]},
      { key: "problem", title: "Problem framing", sources: ["repo-rupee-radar"], blocks: [
        { p: "The challenge brief: working professionals make hundreds of transactions a month, but statements are hard to read because descriptions are inconsistent strings of UPI IDs, reference numbers and merchant codes. The questions to answer were the user's own: what are my biggest spending categories, how much did I spend this month, which payments recur, and what was my biggest transaction." },
        { kv: [["Input", "UPI/DR/9876543210/ZOMATO-DELHI"], ["Cleaned", "Zomato"]] },
      ]},
      { key: "flows", title: "How it works", sources: ["repo-rupee-radar"], blocks: [
        { flow: ["Upload CSV / Excel", "Parse", "Clean and normalise", "Categorise", "Detect recurring", "Metrics", "Dashboard and report"] },
        { p: "Categories: Food, Shopping, Travel, Bills, Salary, Investments, EMI, Rent, Subscriptions and Others. Recurring payments are detected from how often a payment repeats and how similar the amounts are." },
      ]},
      { key: "tradeoffs", title: "Key decisions and trade-offs", sources: ["repo-rupee-radar"], blocks: [
        { quote: "This approach minimizes AI calls while maintaining accurate categorization.", cite: "RupeeRadar README, on the hybrid pipeline" },
        { ul: [
          "Rules and a merchant dictionary run before any model, so most transactions never reach the AI step.",
          "The model is a fallback with structured JSON output, and is skipped entirely when no API key is set.",
          "Privacy by design in the README: session-based processing, no permanent storage of uploaded statements, minimal data sent to AI services and session deletion.",
        ] },
      ]},
      { key: "risks", title: "Limitations", sources: ["repo-rupee-radar"], blocks: [
        { ul: ["Not deployed; no live URL", "No users or outcome data", "Accuracy of categorisation is not measured in the repository", "Four unit tests cover the pipeline; the API and interface have no automated tests"] },
      ]},
      { key: "next", title: "Next steps (from the README roadmap)", sources: ["repo-rupee-radar"], blocks: [
        { ul: ["PDF statement parsing and OCR", "Budget planner and spending forecasting", "Mobile application and more languages"] },
      ]},
      { key: "evidence", title: "Evidence and references", sources: ["repo-rupee-radar"], blocks: [
        { note: "Every statement on this page comes from the public repository (README, problem statement, pipeline code and tests)." },
      ]},
    ],
  },

  /* ------------------------------------------------------ 90-DAY CORPUS */
  {
    slug: "90-day-case-studies",
    name: "90-Day Product Case Studies",
    subtitle: "Daily product research corpus",
    kind: "research",
    kindLabel: "Independent research & writing",
    role: "Author",
    period: "Jul – Sep 2026",
    status: "PUBLISHED",
    statusTone: "green",
    oneLine: "90 product case studies in a public repository, read by this site straight from the generated corpus — with every evidence level shown.",
    categories: ["Research", "Product Management", "Analytics", "Independent Builds"],
    skills: ["market-research", "competitive-research", "tam-sam-som", "jtbd", "rice", "moscow", "prd", "experiment-design", "north-star"],
    district: "research-analytics",
    cover: "/brand/covers/cover-90-day-corpus.svg",
    repo: { label: "product-management-case-studies", href: "https://github.com/gaurav-product/product-management-case-studies" },
    featured: false,
    highlights: [
      { text: "90 directories, 90 written studies, 0 empty", status: "VERIFIED", sources: ["repo-corpus"] },
      { text: "Evidence level shown for every study (VERIFIED, DOCUMENTED, SOURCED, NARRATIVE)", status: "VERIFIED", sources: ["repo-corpus"] },
    ],
    limits: ["Evidence level counts what a study carries; it is not a judgement of quality.", "Category is derived by rule and labelled DERIVED."],
    sections: [
      { key: "summary", title: "Executive summary", sources: ["repo-corpus"], blocks: [
        { p: "Ninety daily product case studies, Day 01 to Day 90, in one public repository. This site reads them from a generated corpus rather than retyping them, so counts cannot drift." },
        { p: "Browse them in the Research library and the Product Atlas." },
      ]},
      { key: "methodology", title: "Method", sources: ["repo-corpus"], blocks: [
        { ul: ["Assumptions became mandatory: every study from Day 28 carries an ASSUMPTIONS file", "Verification became programmatic: executed checks appear from Day 57", "Later studies work primary regulatory and filing sources directly"] },
        { note: "The counts are documented; reading them as a deliberate arc is interpretation." },
      ]},
      { key: "evidence", title: "Evidence and references", sources: ["repo-corpus"], blocks: [
        { note: "Every study links back to its directory in the repository." },
      ]},
    ],
  },
];

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug);
export const featuredProjects = projects.filter((p) => p.featured);
export const PROJECT_FILTERS = ["All", "Healthcare", "AI", "Product Management", "Research", "Analytics", "Growth", "Academic", "Independent Builds", "Professional Projects"] as const;
