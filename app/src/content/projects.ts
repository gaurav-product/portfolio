import type { Project } from "./types";

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
    sections: [
      { key: "summary", title: "Executive summary", sources: ["cv"], blocks: [
        { p: "Evamastu is a digital mindfulness platform built at Adhyatm Sadhna Kendra, New Delhi. I joined as a Product Management Intern for early discovery and then owned the product as Associate Product Manager from discovery through release." },
        { p: "The outcome I can evidence: cohort analysis across 50+ participant cohorts surfaced two funnel drop-offs, and the onboarding redesign that followed lifted user consistency 20–25% within six weeks." },
      ]},
      { key: "metadata", title: "Project metadata", sources: ["cv"], blocks: [
        { kv: [["Organisation", "Adhyatm Sadhna Kendra, New Delhi"], ["Type", "Employment — internship, then full-time"], ["Role", "PM Intern (Nov 2024 – Apr 2025) → Associate Product Manager (May 2025 – Apr 2026)"], ["Status", "Shipped"]] },
      ]},
      { key: "methodology", title: "Research methodology", sources: ["cv"], blocks: [
        { p: "Discovery started with people, not features: parent and facilitator interviews, turned into the problem statements behind the first product brief." },
        { ul: ["Parent interviews", "Facilitator interviews", "Problem statements written from the interview findings", "Initial backlog and competitive scan"] },
      ]},
      { key: "prd", title: "PRD and requirements", sources: ["cv"], blocks: [
        { p: "I wrote the full PRD and the user stories with acceptance criteria for the first assessment module." },
        { ul: ["Parent Dashboard", "Child Wellness Assessment", "4 adaptive cognitive games"] },
      ]},
      { key: "prioritization", title: "Prioritization", sources: ["cv"], blocks: [
        { p: "12+ feature requests were scored with RICE and sorted with MoSCoW to hold roadmap discipline and cut scope creep. The individual scores are employer material and are not reproduced." },
      ]},
      { key: "analytics", title: "Analytics framework", sources: ["cv"], blocks: [
        { p: "A cohort analytics system across 50+ participant cohorts. Segmenting by cohort before averaging is what made the two drop-offs visible — an average across cohorts hides the one that is struggling." },
      ]},
      { key: "results", title: "Results", sources: ["cv"], blocks: [
        { table: { head: ["Measure", "Result", "Window"], rows: [["User consistency after onboarding redesign", "+20–25%", "6 weeks"], ["Funnel drop-offs identified", "2", "—"], ["Cohorts in the analytics system", "50+", "—"]], caption: "Figures as stated in the CV." } },
      ]},
      { key: "execution", title: "Execution", sources: ["cv"], blocks: [
        { p: "Agile delivery: sprint planning and backlog grooming, with prioritization decisions recorded against RICE and MoSCoW." },
      ]},
      { key: "learnings", title: "Learnings", blocks: [
        { p: "Find the step where value stops transferring, then change that step only. The same instinct later shaped the PhonePe capstone and Aaroh's measurement plan." },
      ]},
      { key: "evidence", title: "Evidence and limitations", sources: ["cv", "evamastu-employer"], blocks: [
        { note: "Every figure on this page comes from the CV. Employer artefacts are confidential and are not shown. No screenshots are available." },
      ]},
    ],
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
    sections: [
      { key: "summary", title: "Executive summary", sources: ["cv", "repo-aaroh"], blocks: [
        { p: "Aaroh is an AI root-cause health platform I have been building as founder and product lead since May 2026. Its hard constraint: understand, explain, recommend, support — never diagnose." },
        { p: "It is pre-launch. There is a 37-screen interactive prototype, 8 consented practitioners and zero live users, and a strategy reset on positioning and scope is in progress. This page shows a product mid-correction, not a tidy story." },
      ]},
      { key: "metadata", title: "Project metadata", sources: ["cv", "repo-aaroh"], blocks: [
        { kv: [["Type", "Independent — founder"], ["Role", "Founder and product lead"], ["Period", "May 2026 – present"], ["Status", "Pre-launch · interactive prototype · strategy reset"], ["Users", "0 live users"]] },
      ]},
      { key: "problem", title: "Problem statement", sources: ["aaroh-docs"], blocks: [
        { p: "Health advice arrives as isolated answers: a recommendation without an explanation of why a person's situation produced it, and nothing that carries their context into the next conversation." },
        { p: "The product question: can an AI product help someone understand what is contributing to what they experience, without ever pretending to be a clinician?" },
      ]},
      { key: "methodology", title: "Research methodology", sources: ["cv"], blocks: [
        { p: "20+ customer discovery interviews before committing to a roadmap, translated into a RICE/MoSCoW-prioritized roadmap and an end-to-end product vision." },
        { note: "The interview synthesis is not published, so no finding is quoted as a statistic." },
      ]},
      { key: "insights", title: "User insights", tag: "HYPOTHESIS", sources: ["aaroh-docs"], blocks: [
        { p: "The insight that changed the product was about authority, not features: people want to understand their situation, and they want a human professional to stay in charge of it. Aaroh treats those as one requirement rather than a trade-off." },
      ]},
      { key: "vision", title: "Product vision", sources: ["repo-aaroh"], blocks: [
        { table: { head: ["Capability", "What it means", "What it is not"], rows: [
          ["Understand", "Make sense of one's own health signals", "Not a diagnostic engine"],
          ["Explain", "Plain-language explanations grounded in evidence", "Not medical advice"],
          ["Recommend", "Evidence-informed next steps, including \"talk to a professional\"", "Not a prescription"],
          ["Support", "Continuity — records, reminders, practitioner communication", "Not a replacement for a clinician"],
        ], caption: "From the Aaroh repository README." } },
      ]},
      { key: "strategy", title: "Product strategy and decisions", sources: ["aaroh-docs"], blocks: [
        { flow: ["UNDERSTAND", "EXPLAIN", "RECOMMEND", "SUPPORT"] },
        { table: { head: ["Decision", "Why", "Trade-off"], rows: [
          ["Never diagnose", "Professional authority and patient agency are the premise, not a compliance add-on", "Gives up the most demo-friendly feature in AI health"],
          ["Seal commercial features pending legal review", "The clinical/regulatory boundary is unresolved in writing", "No revenue or willingness-to-pay signal yet"],
          ["Freeze the prototype at 37 screens", "Surface area was outrunning validated demand", "Visible progress from shipping screens stops"],
          ["Reset positioning and scope", "The scope outgrew the evidence behind it", "Harder to describe in one line, for now"],
        ] } },
      ]},
      { key: "prd", title: "PRD and requirements", sources: ["cv"], blocks: [
        { p: "PRDs for AI intake, root-cause mapping and recommendations, written under the non-diagnostic rule: a user story that requires diagnosis fails review regardless of its user value." },
        { ul: ["Conversational intake — structures what a person already knows about themselves", "Root-cause mapping — contributing factors shown as something explainable, not a verdict", "Recommendations — scoped to support and preparation, pointing back to a practitioner"] },
      ]},
      { key: "prototype", title: "Prototype", sources: ["cv", "repo-aaroh"], blocks: [
        { p: "A 37-screen interactive prototype (304 interactive elements, per the repository milestone M1), then frozen." },
        { note: "No prototype screenshots are published yet; the cover is an illustration." },
      ]},
      { key: "analytics", title: "Analytics framework", tag: "NOT MEASURED", sources: ["cv"], blocks: [
        { ul: ["Activation — did the first session deliver an explanation the person understood?", "Retention — did they return with their context intact?", "Adoption — are the AI features used, or decorative?"] },
        { note: "Defined, with no data: there are no live users. Instrumentation without traffic is preparation, not evidence." },
      ]},
      { key: "risks", title: "Risks and limitations", sources: ["repo-aaroh"], blocks: [
        { ul: ["Clinical and regulatory chapters pending a legal citation pass (repository milestone M3)", "Closed beta gated on legal, backend and AI orchestrator milestones", "Hypothesis — explanation quality builds more trust than diagnosis — is untested"] },
      ]},
      { key: "next", title: "Next steps", blocks: [
        { p: "Narrow to the single job the discovery interviews most strongly support, and put it in front of real users before building further." },
      ]},
      { key: "evidence", title: "Evidence and references", sources: ["cv", "repo-aaroh", "aaroh-docs"], blocks: [
        { note: "Interview transcripts and the product constitution are not public. Prototype size and milestone status are verified in the public repository." },
      ]},
    ],
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
      "No user research has been run; usability claims are design judgement.",
      "WhatsApp/SMS delivery is not connected.",
      "The repository now reports a larger suite than the CV (70 unit/integration, 51 end-to-end in its test table); the CV figures are shown.",
    ],
    sections: [
      { key: "summary", title: "Executive summary", sources: ["cv", "repo-careconnect"], blocks: [
        { p: "CareConnect started as a caregiver marketplace brief I wrote myself, with one rule attached: if the evidence contradicted the brief, reject it and document the rejection." },
        { p: "It was rejected. The product became a post-discharge care accountability layer — the record of what actually happened in a parent's first 30 days at home, kept by whoever is in the room, that survives the attendant leaving." },
      ]},
      { key: "metadata", title: "Project metadata", sources: ["repo-careconnect"], blocks: [
        { kv: [["Type", "Independent build"], ["Period", "Sep 2026"], ["Stack", "React 19 · TypeScript · Express 5 · SQLite · Tailwind"], ["Status", "Working MVP · no users"]] },
      ]},
      { key: "problem", title: "Problem statement", sources: ["repo-careconnect"], blocks: [
        { p: "A family can hire a home attendant within a day. What it cannot buy is proof that the day's care happened, an early warning when it did not, or anything that survives the attendant being replaced." },
      ]},
      { key: "insights", title: "Research insight", sources: ["repo-careconnect"], blocks: [
        { p: "Discovery is not the scarce thing — agencies, hospital desks and WhatsApp networks all produce an attendant within a day. Sources described what happened after: untrained staff, helpers who disappear, care that \"resets to Day 1\" on rotation." },
        { note: "Absence of evidence, not evidence of absence. The falsifier is written down: if 4 of 10 discharge interviews name finding an attendant as the hardest problem, this reframing is wrong." },
      ]},
      { key: "segments", title: "User segments", sources: ["repo-careconnect"], blocks: [
        { kv: [["Beachhead", "The adult child living away from a parent, supervising the first 30 days after discharge"], ["Primary writing user", "The attendant, on shift (decision D-05)"]] },
      ]},
      { key: "flows", title: "Core workflow", sources: ["repo-careconnect"], blocks: [
        { ol: ["Family builds the care plan from the discharge summary", "Invites the attendant with a 6-character code — no app to install", "Attendant records medicines, tasks and readings each shift; \"could not do\" requires a reason", "Alerts on red flags, out-of-range readings or unrecorded critical doses; the family closes each with a note", "A handover pack is generated on every attendant change"] },
      ]},
      { key: "tradeoffs", title: "Key decisions and trade-offs", sources: ["repo-careconnect"], blocks: [
        { table: { head: ["#", "Decision", "Trade-off"], rows: [
          ["D-01", "Reject the marketplace brief", "Gave up the larger, more obvious business"],
          ["D-02", "Own no supply, ever", "Cannot promise a replacement"],
          ["D-07", "\"Could not do it\" needs a reason", "Slower to record a bad day"],
          ["D-17", "Care entries append-only; corrections shown", "One more table, one more section"],
          ["D-18", "\"Verified\" renamed to \"documented\"", "A weaker-sounding metric, and a truer one"],
          ["D-23", "Split the north star: documented vs complete days", "A low bar that needs guardrails to stay honest"],
        ], caption: "Six of 25 decisions in the repository's decision log." } },
      ]},
      { key: "analytics", title: "Analytics framework", sources: ["repo-careconnect"], blocks: [
        { kv: [["North star", "Documented care days — a day with at least one record by an identified user"], ["Quality measure", "Complete care days — every must-not-miss item recorded, no urgent alert open"], ["Guardrails", "Attendant time > 5 min/shift · burst logging > 30% of shifts · false-alert rate > 20% — each stops the roadmap"]] },
      ]},
      { key: "execution", title: "Execution and testing", sources: ["cv", "repo-careconnect"], blocks: [
        { p: "65 unit and integration tests and 30 end-to-end journeys at the time of the CV, plus a claim register grading 13 load-bearing conclusions by evidence strength." },
        { p: "Iteration 2 added no features: it renamed metrics that overstated what the system could prove and made care entries append-only." },
      ]},
      { key: "risks", title: "Risks and limitations", sources: ["repo-careconnect"], blocks: [
        { ul: ["No user research yet", "Delivery channels stubbed and shown as such", "Time-based alerts run when the app is opened, not on a scheduler", "Not DPDP-compliant; the patient is the data subject and not a user"] },
      ]},
      { key: "next", title: "Next steps", sources: ["repo-careconnect"], blocks: [
        { p: "Run the discharge interviews the validation plan describes. Interview guides, pre-registered thresholds and a pilot runbook are written; none has been used." },
      ]},
      { key: "evidence", title: "Evidence and references", sources: ["cv", "repo-careconnect"], blocks: [
        { note: "Facts on this page are from the CV and the public repository. 18 real screenshots exist in the repository (demo data) and await approval for use here." },
      ]},
    ],
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
    sections: [
      { key: "summary", title: "Executive summary", sources: ["repo-ghargyaan"], blocks: [
        { p: "GharGyaan answers one question — \"what happened?\" — for everyday self-care situations, in English, Hindi or Hinglish. It screens for emergencies first, asks only the questions that change the advice, and returns a structured guide with an evidence label." },
        { p: "It is a working prototype in demo mode. It is not deployed, has no users and has not been clinically reviewed." },
      ]},
      { key: "problem", title: "Problem statement", sources: ["repo-ghargyaan"], blocks: [
        { p: "Toothpaste on a burn, honey for a newborn and oil in an aching ear arrive with the same authority as cooling a burn under running water. People need help telling useful household knowledge from unsupported or unsafe advice — and knowing when to get professional help." },
        { quote: "Could a structured, safety-first system help people distinguish useful everyday knowledge from unsupported or potentially unsafe advice?", cite: "Product hypothesis — not yet validated" },
      ]},
      { key: "flows", title: "Safety-first architecture", sources: ["repo-ghargyaan"], blocks: [
        { flow: ["INPUT", "SAFETY SCREEN", "RED-FLAG RULES (21)", "RETRIEVAL", "CLARIFY", "EVIDENCE LABEL", "STRUCTURED GUIDE", "ESCALATION"] },
        { ul: ["Safety screening runs before clarification and retrieval, and again on the answers", "Hard blocks on dosing, prescription and dangerous DIY requests; crisis routing to Tele-MANAS", "The language model never writes the advice — steps and warnings come from the knowledge base; output is validated and falls back to templates", "Demo mode retrieval is lexical (BM25, phrase and trigram), not semantic"] },
      ]},
      { key: "experimentation", title: "Evaluation", sources: ["repo-ghargyaan", "cv"], blocks: [
        { table: { head: ["Check", "Result"], rows: [
          ["Unit + evaluation tests", "214 / 214 pass (206 scenarios, 2 KB integrity, 6 output-validator)"],
          ["Safety suites", "Required to pass 100%"],
          ["Held-out round 1 (scored before fixes)", "37 / 42 (88%) · 1 safety miss"],
          ["Held-out round 2 (scored before fixes)", "21 / 28 (75%) · 3 safety misses"],
          ["Accessibility (axe-core WCAG 2 A/AA)", "0 violations on 9 pages + a result screen"],
        ], caption: "All figures from the repository's evaluation section." } },
        { note: "Most suites were used while tuning, so 100% overstates real quality. The four held-out misses — a stroke described as \"can't move his right arm, speech is slurred\", an acid burn while cleaning, passive suicidal ideation, and a seizure described only as \"unconscious\" — were fixed and are now regression tests. Rule-based red-flag detection has recall gaps on new phrasing." },
      ]},
      { key: "risks", title: "Risks and limitations", sources: ["repo-ghargyaan"], blocks: [
        { ul: ["Prototype — not for real-world medical use", "No clinician review of any guide or safety rule", "No users, interviews or usability tests yet", "10 guides lack a verified source", "Live AI mode written, not deployed", "Guide text English only"] },
      ]},
      { key: "evidence", title: "Evidence and references", sources: ["repo-ghargyaan", "cv"], blocks: [
        { note: "Every number on this page is from the public repository. 7 real screenshots (demo mode) await approval for use here." },
      ]},
    ],
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
    sections: [
      { key: "summary", title: "Executive summary", sources: ["repo-phonepe"], blocks: [
        { note: "Academic case study — AI-Enabled Product Management Program, Masai School and IIT Roorkee faculty. Funnel figures are capstone-supplied case data. The A/B test was designed, not executed." },
        { p: "Smart Spend Coach is a feature concept that flags recurring commitments and recommends an action. The capstone question was where value stops transferring — and the answer was the step between seeing an insight and acting on it." },
      ]},
      { key: "metadata", title: "Project metadata", sources: ["repo-phonepe"], blocks: [
        { kv: [["Type", "Academic capstone"], ["Program", "AI-Enabled Product Management — Masai School × IIT Roorkee faculty"], ["Period", "Aug 2026"], ["Data", "Case data supplied by the capstone"], ["Experiment", "Designed, not run"]] },
      ]},
      { key: "prioritization", title: "Prioritization", sources: ["cv", "repo-phonepe"], blocks: [
        { p: "Five candidate features were scored with RICE; the winner got a PRD-lite and a 5-screen Figma prototype, tested with 7 real users before any funnel work." },
      ]},
      { key: "analytics", title: "Pilot funnel analysis", tag: "CASE DATA", sources: ["repo-phonepe"], blocks: [
        { table: { head: ["#", "Stage", "Users", "Step conversion"], rows: [
          ["1", "Entry banner shown", "40,000", "—"],
          ["2", "Feature opened", "16,000", "40.0%"],
          ["3", "Onboarding / transaction-linking completed", "11,200", "70.0%"],
          ["4", "First personalised insight viewed", "9,520", "85.0%"],
          ["5", "Recommended action taken", "2,856", "30.0%"],
        ], caption: "30-day pilot. Capstone-supplied case data, used exactly as given. End to end: 2,856 ÷ 40,000 = 7.14%." } },
        { p: "Stage 1→2 loses more people in absolute terms, but 4→5 is the step where users had done everything the product asked and still did not act: a 70% loss at the moment of value. It is also the feature's primary metric." },
      ]},
      { key: "experimentation", title: "Experiment design", tag: "DESIGNED, NOT RUN", sources: ["repo-phonepe"], blocks: [
        { kv: [
          ["Observation", "Testers searched ~12 seconds for the action entry (F-01, Medium severity, 7 testers)"],
          ["Control", "Action entry below the evidence block"],
          ["Variant", "Same content and copy; action as a persistent bar fixed to the bottom of the screen"],
          ["Primary metric", "Insight-to-Action Completion Rate — confirmed actions within 7 days ÷ insights first viewed (baseline 30.0%, case data)"],
          ["Secondary", "Median time from first view to confirmed action"],
          ["Guardrail", "Action Reversal Rate within 14 days — the variant is rejected if it rises, even if IACR improves"],
          ["Duration", "21 days: 14 enrolment + 7-day attribution tail; guardrail readable at day 35"],
        ] },
        { note: "A premise was corrected during the work: the action button was always on screen, so the 12-second search was a salience problem, not a reach problem. The hypothesis was rewritten to match." },
      ]},
      { key: "learnings", title: "Learnings", sources: ["repo-phonepe"], blocks: [
        { ul: ["An insight-to-action gap is fixed at the moment of delivery — timing, specificity, salience — not with more acquisition", "Build the experiment on the evidence you have; a High-severity finding was not manufactured to satisfy the rubric", "A guardrail that can veto a win is what makes it an experiment"] },
      ]},
      { key: "evidence", title: "Evidence and references", sources: ["repo-phonepe", "cv"], blocks: [
        { note: "All figures and design details are from the public capstone repository (part C). No result exists for the A/B test." },
      ]},
    ],
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
