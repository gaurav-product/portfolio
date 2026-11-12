import type { CaseSection } from "./types";

/**
 * Detailed narratives for the five featured case studies. Every section cites
 * the document it comes from. Where a part of the template is not supported by
 * evidence it is either absent or stated as not documented — never filled in.
 */

const NOT_DOC = (what: string): CaseSection["blocks"] => [{ note: `${what} is not publicly documented, so it is not described here.` }];

/* ================================================================ EVAMASTU */
export const evamastu: CaseSection[] = [
  { key: "summary", title: "Executive summary", sources: ["cv"], blocks: [
    { p: "Evamastu is a digital mindfulness platform built at Adhyatm Sadhna Kendra, New Delhi. I joined as Product Management Intern for early discovery (Nov 2024) and owned the product as Associate Product Manager from discovery through release (May 2025 – Apr 2026)." },
    { p: "The measurable outcome: a cohort analytics system across 50+ participant cohorts surfaced two funnel drop-offs, and the onboarding redesign that followed lifted user consistency 20–25% within six weeks." },
    { note: "This is employer work. The PRD, dashboards, cohort data and screens are confidential, so this case study is limited to what the CV states. Sections the evidence does not support are listed at the end rather than written." },
  ]},
  { key: "metadata", title: "Project metadata", sources: ["cv"], blocks: [
    { kv: [["Organisation", "Adhyatm Sadhna Kendra, New Delhi"], ["Type", "Employment — internship, then full-time"], ["Role", "PM Intern (Nov 2024 – Apr 2025) → Associate Product Manager (May 2025 – Apr 2026)"], ["Status", "Shipped"], ["Users", "Children, parents and facilitators (participant cohorts)"]] },
  ]},
  { key: "methodology", title: "Discovery", sources: ["cv"], blocks: [
    { p: "Discovery started with the people around the product, not with features. As intern I ran parent and facilitator interviews and turned the findings into the problem statements behind the first product brief." },
    { ol: ["Parent interviews and facilitator interviews", "Problem statements written from what the interviews surfaced", "Competitive scan and an initial backlog", "User stories with acceptance criteria for the first assessment module"] },
  ]},
  { key: "problem", title: "Problem framing", sources: ["cv"], blocks: [
    { p: "The first brief was built from interview problem statements rather than a feature wish-list — the framing came from what parents and facilitators described." },
    ...NOT_DOC("The exact problem statement wording"),
  ]},
  { key: "prd", title: "PRD and requirements", sources: ["cv"], blocks: [
    { p: "I wrote the full PRD and shipped three product surfaces:" },
    { ul: ["Parent Dashboard", "Child Wellness Assessment", "4 adaptive cognitive games"] },
  ]},
  { key: "prioritization", title: "Prioritization", sources: ["cv"], blocks: [
    { p: "12+ feature requests were scored with RICE and sorted with MoSCoW to hold roadmap discipline and cut scope creep." },
    ...NOT_DOC("The individual scores and the requests themselves"),
  ]},
  { key: "execution", title: "Execution", sources: ["cv"], blocks: [
    { p: "Agile delivery with sprint planning and backlog grooming, owning the product from discovery to release." },
  ]},
  { key: "analytics", title: "Metrics and analysis", sources: ["cv"], blocks: [
    { p: "A cohort analytics system across 50+ participant cohorts. Segmenting by cohort before averaging is what made the two drop-offs visible: an average across cohorts hides the one that is struggling." },
  ]},
  { key: "results", title: "Results", sources: ["cv"], blocks: [
    { table: { head: ["Measure", "Result", "Window"], rows: [["User consistency after the onboarding redesign", "+20–25%", "6 weeks"], ["Funnel drop-offs identified", "2", "—"], ["Participant cohorts analysed", "50+", "—"], ["Feature requests scored (RICE, MoSCoW)", "12+", "—"]], caption: "All figures as stated in the CV." } },
  ]},
  { key: "learnings", title: "Learnings", blocks: [
    { p: "Find the step where value stops transferring and change that step only. The same instinct shaped the PhonePe capstone's focus on the insight-to-action step and Aaroh's activation definition." },
  ]},
  { key: "evidence", title: "Evidence and what is not documented", sources: ["cv", "evamastu-employer"], blocks: [
    { p: "Not described here because no public evidence exists:" },
    { ul: ["Strategy and positioning documents", "Trade-offs made on specific features", "The definition of “consistency” used in the cohort analysis", "Screens or prototypes (employer material — none supplied)"] },
  ]},
];

/* ================================================================== AAROH */
export const aaroh: CaseSection[] = [
  { key: "summary", title: "Executive summary", sources: ["cv", "repo-aaroh"], blocks: [
    { p: "Aaroh is an AI root-cause health platform I have been building as founder and product lead since May 2026. Its hard constraint: understand, explain, recommend, support — never diagnose." },
    { p: "It is pre-launch. There is a 37-screen interactive prototype, 8 consented practitioners, zero live users, and a strategy reset on positioning and scope. This page shows a product mid-correction, not a tidy story." },
  ]},
  { key: "metadata", title: "Project metadata", sources: ["cv", "aaroh-roadmap"], blocks: [
    { kv: [["Type", "Independent — founder"], ["Role", "Founder and product lead"], ["Period", "May 2026 – present"], ["Status", "Pre-launch · interactive prototype · strategy reset"], ["Users", "0 live users"], ["Practitioners", "8 consented — yoga therapy, counselling psychology, nutrition, Ayurveda"], ["Prototype stack", "Not stated — being verified"]] },
  ]},
  { key: "problem", title: "Problem framing", sources: ["aaroh-docs"], blocks: [
    { p: "Health advice arrives as isolated answers: a recommendation without an explanation of why a person's situation produced it, and nothing that carries their context into the next conversation." },
    { p: "The product question: can an AI product help someone understand what is contributing to what they experience, without ever pretending to be a clinician?" },
  ]},
  { key: "methodology", title: "Discovery", sources: ["cv"], blocks: [
    { p: "20+ customer discovery interviews before committing to a roadmap, translated into a RICE/MoSCoW-prioritized roadmap and an end-to-end product vision. 8 practitioners were onboarded with consent across four disciplines." },
    { note: "The interview synthesis is not published, so no finding is quoted as a statistic." },
  ]},
  { key: "insights", title: "Insight", tag: "HYPOTHESIS", sources: ["aaroh-docs"], blocks: [
    { p: "The insight that changed the product was about authority, not features: people want to understand their situation, and they want a human professional to stay in charge of it. Aaroh treats those as one requirement rather than a trade-off." },
  ]},
  { key: "vision", title: "Product vision", sources: ["repo-aaroh"], blocks: [
    { table: { head: ["Capability", "What it means", "What it is not"], rows: [
      ["Understand", "Make sense of one's own health signals", "Not a diagnostic engine"],
      ["Explain", "Plain-language explanations grounded in evidence", "Not medical advice"],
      ["Recommend", "Evidence-informed next steps, including “talk to a professional”", "Not a prescription"],
      ["Support", "Continuity — records, reminders, practitioner communication", "Not a replacement for a clinician"],
    ], caption: "From the Aaroh repository README." } },
  ]},
  { key: "strategy", title: "Strategy and decisions", sources: ["aaroh-docs", "aaroh-roadmap"], blocks: [
    { flow: ["UNDERSTAND", "EXPLAIN", "RECOMMEND", "SUPPORT"] },
    { table: { head: ["Decision", "Why", "Trade-off"], rows: [
      ["Never diagnose", "Professional authority and patient agency are the premise, not a compliance add-on", "Gives up the most demo-friendly feature in AI health"],
      ["Gate commercial launch on legal review (M7 blocked on M3, enforced in tooling)", "Clinical and commercial claims need a formal citation pass first", "No revenue or willingness-to-pay signal yet"],
      ["Freeze the prototype at 37 screens", "Surface area was outrunning validated demand", "Visible progress from shipping screens stops"],
      ["Reset positioning and scope", "The scope outgrew the evidence behind it", "Harder to describe in one line, for now"],
    ] } },
  ]},
  { key: "prioritization", title: "Prioritization and roadmap", sources: ["aaroh-roadmap", "cv"], blocks: [
    { p: "The roadmap makes gating visible rather than hiding it behind “TBD” dates:" },
    { table: { head: ["Milestone", "Status"], rows: [
      ["M0 — Constitutional foundation", "Complete"], ["M1 — Prototype freeze (37 screens, 304 interactive elements)", "Complete"], ["M2 — Engineering handbook (21 documents)", "Complete"],
      ["M3 — Legal citation pass on clinical and commercial claims", "Pending — external"], ["M4 — Backend foundation", "In progress"], ["M5 — AI orchestrator v1", "Not started"],
      ["M6 — Closed beta", "Gated on M3, M4, M5"], ["M7 — Commercial unlock", "Blocked on M3"], ["M8 — Public launch", "Gated on M7"],
    ], caption: "From ROADMAP.md (v1.0, July 2026)." } },
  ]},
  { key: "prd", title: "PRD and requirements", sources: ["cv"], blocks: [
    { p: "PRDs for AI intake, root-cause mapping and recommendations, written under the non-diagnostic rule: a user story that requires diagnosis fails review regardless of its user value." },
    { ul: ["Conversational intake — structures what a person already knows about themselves", "Root-cause mapping — contributing factors shown as something explainable, not a verdict", "Recommendations — scoped to support and preparation, pointing back to a practitioner"] },
  ]},
  { key: "prototype", title: "Prototype", sources: ["cv", "aaroh-roadmap"], blocks: [
    { p: "A 37-screen interactive prototype with 304 interactive elements, verified with Playwright, then frozen (milestone M1)." },
    { note: "The prototype's implementation stack is being verified and is not stated. No prototype screenshots are published; the cover is an illustration." },
  ]},
  { key: "analytics", title: "Metrics", tag: "PROPOSED · NOT MEASURED", sources: ["aaroh-nsm", "cv"], blocks: [
    { kv: [["North Star (proposed, not ratified)", "Share of active users who took a coordinated health action — completed a recommended practice, prepared for or attended a consultation, or shared a record with a practitioner — in the trailing 30 days"], ["Supporting", "Activation, retention and adoption — defined"]] },
    { table: { head: ["Explicitly rejected metric", "Why"], rows: [["Daily active users", "Rewards dependence, not benefit"], ["Session length", "Longer sessions may mean confusion"], ["Check-in streak", "Measures habit, not health"], ["Healing Score improvement", "Self-reported and gameable"]] } },
    { note: "There are no live users, so none of these has data. Whether a coordinated health action can be measured without surveillance is itself an open assumption." },
  ]},
  { key: "risks", title: "Risks and limitations", sources: ["aaroh-roadmap"], blocks: [
    { ul: ["Clinical and commercial chapters pending an external legal citation pass", "Closed beta gated on legal, backend and AI orchestrator milestones", "The core hypothesis — explanation builds more trust than diagnosis — is untested", "Team of 1–3 contributors through M4"] },
  ]},
  { key: "learnings", title: "Learnings", sources: ["aaroh-docs"], blocks: [
    { ul: ["Set the boundary before demand arrives; boundaries decided under pressure are decided badly", "Freeze surface area when it outruns evidence", "A metric that rewards being used more is not the same as one that rewards helping"] },
  ]},
  { key: "next", title: "Next steps", blocks: [
    { p: "Narrow to the single job the discovery interviews most strongly support and put it in front of real users before building further." },
  ]},
  { key: "evidence", title: "Evidence and references", sources: ["cv", "repo-aaroh", "aaroh-roadmap", "aaroh-nsm", "aaroh-docs"], blocks: [
    { note: "Interview transcripts and the full product constitution are not public. Prototype size, milestones and the North Star proposal are verified in the public repository." },
  ]},
];

/* ============================================================ CARECONNECT */
export const careconnect: CaseSection[] = [
  { key: "summary", title: "Executive summary", sources: ["cc-case", "cv"], blocks: [
    { kv: [["The brief", "Help Indian families discover, evaluate, book and manage home caregivers — a marketplace"], ["What was built", "A post-discharge care accountability layer that supplies no caregivers at all"], ["Why", "The research said discovery was not the problem"]] },
    { note: "Solo project — research, strategy, design, build and QA, over three iterations. Research was secondary only: no user interviews have been run. No users, revenue or retention figures exist." },
  ]},
  { key: "metadata", title: "Project metadata", sources: ["repo-careconnect"], blocks: [
    { kv: [["Type", "Independent build"], ["Period", "Sep 2026"], ["Stack", "React 19 · TypeScript · Express 5 · SQLite · Tailwind"], ["Status", "Working MVP · no users"]] },
  ]},
  { key: "methodology", title: "Discovery", sources: ["cc-case"], blocks: [
    { p: "Method, stated first because it is the biggest limitation: secondary research only — government releases, peer-reviewed studies, market research, provider documentation and complaint boards. Every source is graded A–D in an evidence index, and provider marketing is never quoted as a statistic." },
    { p: "I went looking for families who could not find a caregiver. Supply turned out to be abundant: one provider advertises 2,000+ caregivers across ten cities with a three-hour allocation promise; another publishes a 24-hour replacement turnaround. What families described instead was what happened after hiring — untrained staff, helpers who “disappear without notice”, and care that “effectively resets to Day 1” when the agency rotates." },
  ]},
  { key: "problem", title: "Problem framing", sources: ["cc-case"], blocks: [
    { quote: "A family can hire a home attendant within a day, but has no way to verify that the day's care actually happened, no early warning when it did not, and nothing that survives the attendant being replaced.", cite: "Reframed problem statement" },
    { p: "The pivot rests on an inference from absence of evidence — so the falsifier is written down: if four of ten discharge interviews name finding an attendant as their hardest problem, the reframing is wrong and the marketplace deserves reconsideration." },
  ]},
  { key: "segments", title: "Target user", sources: ["cc-case"], blocks: [
    { table: { head: ["Segment", "Score (/45, nine criteria)"], rows: [["A · Away adult child", "35"], ["B · Post-hospitalisation family", "39"], ["C · Elder self-serving", "21 — rejected"]] } },
    { p: "The useful finding was that A and B are the same person at different moments: the away daughter becomes the post-discharge family for thirty days — an unmissable acquisition trigger plus a persistent relationship." },
    { kv: [["Beachhead", "The adult child in another city, arranging and paying for the first 30 days of home care after a parent's discharge"]] },
  ]},
  { key: "competition", title: "Competitive landscape", sources: ["cc-case"], blocks: [
    { table: { head: ["Layer", "Examples", "The gap"], rows: [
      ["Full-stack home healthcare", "Portea, Care24, HCAH, Apollo, Antara", "The unit is a placement, not an outcome"],
      ["Subscription elder care", "Samarth, Emoha, Anvayaa", "Reassurance is a phone call, not a record"],
      ["The offline default", "WhatsApp, neighbours, the discharge desk", "Nothing that survives the attendant leaving"],
    ] } },
    { note: "Two companies named in the brief did not surface in desk research and are recorded as not found rather than padded." },
  ]},
  { key: "strategy", title: "Strategy", sources: ["cc-case"], blocks: [
    { quote: "CareConnect is the care record that stays with the patient, not the agency." },
    { ul: ["The record belongs to the patient, not to whoever is currently paid", "Five minutes a shift or there is no product", "“Could not do it” is a first-class answer", "Escalate to a human, never interpret", "Be honest about what is not there"] },
    { p: "Payer: the family is assumed and is the weakest evidence in the plan; the agency is rejected as first payer because the record would belong to the party it might indict; employer elder-care benefits are the designated fallback." },
  ]},
  { key: "mvp", title: "MVP scope", sources: ["cc-case"], blocks: [
    { p: "Every candidate faced one question: remove it — does the core hypothesis become impossible to test?" },
    { kv: [["Kept", "Discharge-type care plan · invite by 6-character code · shifts · logging with a mandatory reason for anything not done · deterministic alerts · acknowledge-then-close · daily record · handover pack · bilingual attendant UI · per-plan access · append-only corrections"]] },
    { table: { head: ["Cut", "Reason"], rows: [
      ["Photo evidence", "Heavy on poor data, heavier privacy obligation"], ["Multiple family members", "Improves the experience, does not test the hypothesis"],
      ["Caregiver ratings", "Turns a trust product into a surveillance product"], ["In-app chat — permanently", "WhatsApp owns that conversation"], ["Caregiver booking", "The thing originally asked for"],
    ] } },
  ]},
  { key: "journey", title: "UX decisions", sources: ["cc-case"], blocks: [
    { ul: ["The family's screen answers: is someone with my parent, is anything wrong, did today go well, is the week trending well — with no vitals chart, to avoid inviting clinical interpretation", "The attendant's screen is the entire app: one screen, no navigation, emergency call at the top", "Both languages always (“Given · दे दी”), because the phone is shared", "“Could not do · नहीं हुआ” is an equal-weight button with a required reason"] },
  ]},
  { key: "tradeoffs", title: "Key decisions and trade-offs", sources: ["cc-decisions"], blocks: [
    { table: { head: ["#", "Decision", "Trade-off accepted"], rows: [
      ["D-01", "Reject the marketplace brief", "Gave up the larger, more obvious business"],
      ["D-02", "Own no supply, ever", "Cannot promise a replacement"],
      ["D-05", "The attendant is the primary writing user", "The data source has no financial stake — the biggest risk"],
      ["D-07", "“Could not do it” with a mandatory reason", "Slower to record a bad day"],
      ["D-17", "Care entries append-only; corrections shown", "One more table, one more section"],
      ["D-18", "“Verified” renamed to “documented”", "A weaker-sounding metric, and a truer one"],
      ["D-23", "Split the north star: documented vs complete days", "A low bar that needs guardrails"],
    ], caption: "Seven of 25 decisions in the repository's decision log." } },
  ]},
  { key: "execution", title: "Build and QA", sources: ["cv", "cc-case"], blocks: [
    { p: "React + Vite + TypeScript on the front; Express + SQLite behind; one process in production. Cookie auth with role-scoped authorisation, 17 tables where nothing is deleted or silently rewritten, a deterministic alert engine, and first-party analytics that never touch free text. WhatsApp/SMS delivery is stubbed and labelled inside the product." },
    { p: "At the time of the CV: 65 unit and integration tests and 30 end-to-end journeys. The repository's case study now reports 142 automated checks (70 unit/integration, 72 end-to-end, plus an accessibility sweep)." },
    { p: "QA changed the product seven times. The one that mattered most: care entries could be silently rewritten — an attendant could record “missed — strip finished” and change it to “given” before closing the shift. In a product whose only asset is the record, that made it unfalsifiable. Entries are now append-only and the family sees previous → new with time and author." },
  ]},
  { key: "analytics", title: "Metrics", sources: ["cc-metrics", "cc-case"], blocks: [
    { kv: [["North star", "Documented care days — a day with at least one care record by an identified user"], ["Quality measure", "Complete care days — every must-not-miss item recorded, ≥80% of the day recorded, no urgent alert open"]] },
    { p: "The metric was changed twice, both times to correct overclaiming: “verified” became “documented” because the product cannot confirm a tablet was swallowed, and the single near-perfect-day metric was split because it punished honest recording." },
    { table: { head: ["Guardrail", "Stops the roadmap when"], rows: [["Attendant time per shift", "> 5 minutes"], ["Burst logging", "> 30% of shifts"], ["False-alert rate", "> 20%"], ["Privacy incidents", "> 0"]] } },
  ]},
  { key: "results", title: "Validation status", sources: ["cc-case"], blocks: [
    { table: { head: ["", "Claim"], rows: [
      ["Validated (engineering)", "Core flows work on phone, tablet and desktop; entries cannot be silently rewritten; a family cannot open another family's case; accessibility sweep 0 issues"],
      ["NOT YET VALIDATED", "Attendants log a shift unsupervised in under 5 minutes · families pay for a record unbundled from care · the handover pack improves continuity · families prefer this to a WhatsApp group · discovery is not the binding constraint"],
    ] } },
    { note: "All validated claims are engineering facts. None is product validation." },
  ]},
  { key: "risks", title: "Limitations", sources: ["cc-case"], blocks: [
    { ul: ["No user research at all", "WhatsApp/SMS not connected; time-based alerts run when the app is opened", "No offline logging, one family member per plan", "Not DPDP-compliant — no versioned consent, export or erasure flow", "The patient is the data subject and not a user, and does not consent — named as unfinished business"] },
  ]},
  { key: "learnings", title: "Learnings", sources: ["cc-case"], blocks: [
    { ul: ["A brief is a hypothesis wearing a requirements document's clothes", "The unpaid user decides whether the product exists — design for the attendant first", "A record of only successes is worse than no record; the reasons are the product", "Auditing your own work is a distinct skill from doing it", "Naming things honestly changes what you build next"] },
    { p: "What I would do differently: talk to five families before writing code, design the attendant screen first, write metric definitions before the feature list, and audit the data model for integrity before building on it." },
  ]},
  { key: "next", title: "Next steps", sources: ["cc-case"], blocks: [
    { p: "Stop building, start interviewing. The experiments are written with fail conditions and are unused:" },
    { table: { head: ["Experiment", "Fail condition"], rows: [["E0 — ten discharge interviews", "4 of 10 name finding an attendant as the hardest problem"], ["E1 — five attendants, three families, 14 days", "Under 50% shift close rate, or over 50% burst logging"], ["E2 — willingness to pay (commitment test, no money taken)", "Defined in the validation plan"], ["E3 — handover value at attendant changes", "Directional only — 20 changes cannot reach significance"]] } },
  ]},
  { key: "evidence", title: "Evidence and references", sources: ["cv", "cc-case", "cc-decisions", "cc-metrics", "repo-careconnect"], blocks: [
    { note: "Sources in the repository are graded A–D with a claim register of 13 load-bearing conclusions, three of which were downgraded on re-audit. 18 real screenshots (demo data) exist and are pending your review." },
  ]},
];

/* ============================================================== GHARGYAAN */
export const ghargyaan: CaseSection[] = [
  { key: "summary", title: "Executive summary", sources: ["repo-ghargyaan"], blocks: [
    { p: "GharGyaan answers one question — “what happened?” — for everyday self-care situations, typed or spoken in English, Hindi or Hinglish. It screens for emergencies first, asks only the questions that change the advice, and returns a structured guide with an evidence label." },
    { note: "Working prototype in demo mode. Not deployed, no users, no primary user research, and no clinician has reviewed any guide or safety rule." },
  ]},
  { key: "problem", title: "Problem framing", tag: "HYPOTHESIS", sources: ["gg-docs"], blocks: [
    { quote: "Indian families handling everyday health and household situations get fragmented advice that mixes useful traditional knowledge, unsupported claims and unsafe practices, with no signal about which is which and weak signals about when to stop self-caring and get help.", cite: "docs/01-problem.md" },
    { p: "Cool running water on a burn and honey for a cough in children over one are evidence-backed; haldi doodh for a cold is harmless tradition; toothpaste on a burn, honey for a newborn and oil in an aching ear are harmful — and a dog bite or a baby with fever is an emergency. People have no easy way to tell these apart in the moment." },
    { kv: [["Not the problem", "Diagnosing disease · replacing doctors, pharmacies or telemedicine · access to care for serious illness"]] },
  ]},
  { key: "methodology", title: "Discovery", sources: ["gg-docs"], blocks: [
    { p: "Desk research only for V1: NHS, WHO, NIH, MedlinePlus, AAP and other public-health pages for each guide, with every cited URL checked to load and the claim matched to the page text; emergency signs mapped from NHS pages; India helplines verified; 46 traditional practices collected." },
    { p: "Assumptions still to test: the order people seek help in; Hinglish as the dominant typed form; whether an evidence label raises or lowers trust for traditional remedies; parents as the highest-intent segment; voice mattering most for older and Hindi-first users." },
    { note: "Planned and not run: 12–15 interviews across Delhi NCR and a tier-2 city, a two-week diary study, an unmoderated prototype test and a clinician review panel." },
  ]},
  { key: "segments", title: "Users and jobs", tag: "PROTO-PERSONAS", sources: ["gg-docs"], blocks: [
    { table: { head: ["Proto-persona", "Moment", "Need"], rows: [
      ["Priya, 32, parent (primary)", "Child's swelling mosquito bite; a small kitchen burn", "A fast, child-safe answer and a clear line for “see a doctor now”"],
      ["Arjun, 24, young adult", "Sore throat, acidity, stiff neck", "Quick practical steps"],
      ["Kamla ji, 67, family advisor", "Checking a remedy she suggests", "Respect for tradition, plain Hindi, voice"],
    ], caption: "Built from desk research, to be replaced after interviews." } },
    { ul: ["When something minor happens at home, I want to know what to do right now", "When an elder suggests a remedy, I want to check it is safe without disrespecting them", "When I'm unsure how serious it is, I want a clear signal about when to see a doctor"] },
    { kv: [["Anti-jobs", "“Tell me what disease I have” · “Give me a medicine and a dose” · “Tell me I don't need a doctor”"]] },
  ]},
  { key: "strategy", title: "Strategy", sources: ["gg-docs"], blocks: [
    { table: { head: ["Choice", "Chose", "Instead of", "Why"], rows: [
      ["Source of truth", "Small, sourced knowledge base", "Open-ended LLM answers", "Safety, consistency, reviewability"],
      ["Role of AI", "Framing, phrase mapping, photo context", "Writing the advice", "Model errors can't reach steps or red flags"],
      ["Safety", "Deterministic rules first", "Model-judged risk", "Predictable, testable, auditable"],
      ["Tradition", "Respect + evidence ladder", "Ignore or mock", "Trust, and honesty about evidence"],
      ["Breadth", "~48 situations done well", "Hundreds of thin pages", "Review cost"],
      ["Accounts", "None", "Sign-up wall", "Privacy; zero-friction first use"],
    ] } },
  ]},
  { key: "prd", title: "PRD scope", sources: ["gg-docs"], blocks: [
    { p: "Sixteen V1 requirements are built, including input safety, 21 emergency rule categories with India helplines, an intent router with hybrid retrieval, minimal clarification, deterministic escalation from answers, structured results, the evidence ladder, a sources drawer with a pipeline trace, feedback, privacy-safe analytics, Hindi UI and a PWA." },
    { kv: [["Out of scope", "Doctor marketplace, pharmacy, booking, accounts, diagnosis, dosing, agentic workflows"], ["Photo", "Always says it cannot identify a condition from an image; the user's description drives retrieval"]] },
  ]},
  { key: "flows", title: "Safety-first architecture", sources: ["repo-ghargyaan"], blocks: [
    { flow: ["INPUT", "SAFETY SCREEN", "RED-FLAG RULES (21)", "RETRIEVAL", "CLARIFY", "EVIDENCE LABEL", "STRUCTURED GUIDE", "ESCALATION"] },
    { ul: ["Safety screening runs before clarification and retrieval, and again on the answers", "Hard blocks on dosing, prescription and dangerous DIY; crisis routing to Tele-MANAS 14416", "The model never writes the advice; output is validated and falls back to templates", "Demo-mode retrieval is lexical (BM25, phrase and trigram), not semantic"] },
  ]},
  { key: "experimentation", title: "Evaluation", sources: ["repo-ghargyaan", "cv"], blocks: [
    { table: { head: ["Check", "Result"], rows: [
      ["Unit + evaluation tests", "214 / 214 pass (206 scenarios, 2 knowledge-base integrity, 6 output-validator)"],
      ["Safety suites", "Required to pass 100%"],
      ["Held-out round 1 (scored before fixes)", "37 / 42 (88%) · 1 safety miss"],
      ["Held-out round 2 (scored before fixes)", "21 / 28 (75%) · 3 safety misses"],
      ["Accessibility (axe-core WCAG 2 A/AA)", "0 violations on 9 pages and a result screen"],
    ] } },
    { note: "Most suites were used while tuning, so 100% overstates real quality. The four held-out misses — a stroke described as “can't move his right arm, speech is slurred”, an acid burn while cleaning, passive suicidal ideation, and a seizure described only as “unconscious” — were fixed and are now regression tests. Rule-based detection has recall gaps on new phrasing." },
  ]},
  { key: "analytics", title: "Metrics", tag: "DEFINED · NO USER DATA", sources: ["gg-docs"], blocks: [
    { kv: [["North Star", "Useful self-care sessions — a relevant, safe, actionable guide was viewed and not followed by “not my situation” or a quick restart"], ["Deliberately not optimised", "Time in app or sessions per user — a good outcome is often a short visit, or being sent to a doctor"], ["Guardrails", "Emergency false-negative rate (must trend to zero) · output-validator replacement rate · “not my situation” rate by guide"]] },
  ]},
  { key: "learnings", title: "Learnings", sources: ["gg-docs"], blocks: [
    { ul: ["Tuned tests lie a little — held-out testing is now part of the process, and first-run numbers are published", "“Burn” is two problems — routing health versus household before retrieval fixed a class of errors", "Merging red-flag questions kept the safety value and halved the effort", "Honesty about sources is a feature — 10 guides ship labelled as lacking a verified source", "Traditional practices need nuance, not verdicts — only 7 of 46 are “not recommended” and 1 is “evidence-supported”", "Keyword fixes are brittle — a structural fix replaced one, and the whole eval now runs on every change"] },
  ]},
  { key: "risks", title: "Limitations", sources: ["repo-ghargyaan"], blocks: [
    { ul: ["Prototype — not for real-world medical use", "No clinician review", "No users, interviews or usability tests", "10 guides lack a verified source", "Live AI mode written, not deployed", "Guide text is English; Hindi and Hinglish are supported for input and the interface"] },
  ]},
  { key: "evidence", title: "Evidence and references", sources: ["repo-ghargyaan", "gg-docs", "cv"], blocks: [
    { note: "Every number on this page is from the public repository. 7 real screenshots (demo mode) are pending your review." },
  ]},
];

/* ================================================================ PHONEPE */
export const phonepe: CaseSection[] = [
  { key: "summary", title: "Executive summary", sources: ["repo-phonepe"], blocks: [
    { note: "Academic case study — AI-Enabled Product Management Program, Masai School and IIT Roorkee faculty. Not employment at, or work for, PhonePe. Funnel figures are capstone-supplied case data. The A/B test was designed, not executed." },
    { p: "One feature, taken from segmentation to a growth experiment under a constraint carried on every page:" },
    { quote: "Smart Spend Coach does not know that a commitment is wasteful. It identifies transaction patterns that may indicate a commitment is worth reviewing. The user decides.", cite: "Capstone README" },
  ]},
  { key: "metadata", title: "Project metadata", sources: ["repo-phonepe"], blocks: [
    { kv: [["Type", "Academic capstone (Module 6)"], ["Period", "Aug 2026"], ["Data", "Case data supplied by the capstone"], ["Experiment", "Designed, not run"], ["Recorded grade", "95 / 100 (as recorded in the repository)"]] },
  ]},
  { key: "segments", title: "Segmentation and persona", sources: ["repo-phonepe"], blocks: [
    { kv: [["Primary persona", "Mid-career household financial managers, 33–45, tier-1/2 cities"], ["Secondary persona", "Young urban salaried professionals, 24–32"], ["Primary segmentation factor", "Expected retention (a hypothesis rating)"]] },
    { note: "No user research, interviews or surveys informed the personas; they are PM-derived and labelled so. Segment sizes are order-of-magnitude only, because PhonePe publishes no MAU or category mix." },
  ]},
  { key: "prioritization", title: "Prioritization", sources: ["repo-phonepe"], blocks: [
    { p: "Five opportunities were scored with RICE in an Airtable backlog. The selected feature was C2 — Flagged Commitment + One-Tap Action (RICE 2.800)." },
  ]},
  { key: "prd", title: "PRD: detection and the one-tap action", sources: ["pp-prd"], blocks: [
    { kv: [["Base condition", "Same merchant at a regular interval for ≥3 consecutive charges (a PM-selected threshold)"], ["Review trigger T1", "The amount increased against the user's own previous charges"], ["Review trigger T2", "The charge resumed after a gap"], ["Never claimed", "Service usage, merchant-side status, trial status, or that a commitment is objectively unnecessary"]] },
    { table: { head: ["Option for the action", "Assessment"], rows: [
      ["A — apply a spending cap", "Rejected: a cap cannot constrain an identical monthly charge"],
      ["B — stop future auto-debits behind a confirmation", "Selected — platform capability NOT VERIFIED"],
      ["C — remind me to review", "Rejected: converts the insight into a future chore"],
      ["D — deep-link to mandate management, pre-selected", "Documented fallback; better on feasibility and safety"],
    ] } },
    { p: "Essential categories (insurance, EMIs, utilities, school fees) still get the insight but the action degrades to a reminder. The confirmation screen states that stopping auto-debits does not cancel the service with the merchant." },
  ]},
  { key: "prototype", title: "Prototype and usability", sources: ["repo-phonepe"], blocks: [
    { p: "A 5-screen Figma prototype (one component set, two variants, 11 navigation interactions), tested with 7 real users. Three evidence sets are kept separate and never merged: real-user testing (A), designer self-walkthrough (B), and heuristic review (C) — only set A counts as user evidence." },
    { kv: [["F-01 · Medium", "Testers searched ~12 seconds for the action entry"], ["F-02 · Medium", "“Is this cancelling the subscription?”"], ["Required High finding", "Not observed — and not manufactured to satisfy the rubric"]] },
  ]},
  { key: "analytics", title: "Pilot funnel analysis", tag: "CASE DATA", sources: ["pp-partc"], blocks: [
    { table: { head: ["#", "Stage", "Users", "Step conversion"], rows: [
      ["1", "Entry banner shown", "40,000", "—"], ["2", "Feature opened", "16,000", "40.0%"],
      ["3", "Onboarding / transaction-linking completed", "11,200", "70.0%"], ["4", "First personalised insight viewed", "9,520", "85.0%"],
      ["5", "Recommended action taken", "2,856", "30.0%"],
    ], caption: "30-day pilot, capstone-supplied, used exactly as given. End to end: 2,856 ÷ 40,000 = 7.14%." } },
    { p: "Stage 1→2 loses more people in absolute terms, but 4→5 is where users had done everything asked and still did not act — a 70% loss at the moment of value, and the feature's own primary metric." },
  ]},
  { key: "experimentation", title: "Experiment design", tag: "DESIGNED, NOT RUN", sources: ["pp-partc"], blocks: [
    { kv: [
      ["Control", "Action entry below the evidence block"], ["Variant", "Same content and copy; the action as a persistent bar fixed to the bottom of the screen"],
      ["Primary", "Insight-to-Action Completion Rate — confirmed actions within 7 days ÷ insights first viewed (baseline 30.0%, case data)"],
      ["Secondary", "Median time from first view to confirmed action"], ["Guardrail", "Action Reversal Rate within 14 days — the variant is rejected if it rises, even if IACR improves"],
      ["Duration", "21 days: 14 enrolment + 7-day attribution tail; guardrail readable at day 35"],
    ] },
    { note: "A premise was corrected mid-way: the action button was always on screen, so the 12-second search was a salience problem, not a reach problem. The hypothesis was rewritten to match." },
  ]},
  { key: "tradeoffs", title: "Trade-offs and corrections", sources: ["repo-phonepe"], blocks: [
    { ul: ["A “usage signal” in an early PRD draft was invented and removed — PhonePe has no such capability, so detection stayed deterministic and the AI classification is “augmented”, not “native”", "An unsafe one-tap shortcut that bypassed confirmation was removed in QA", "A merchant-behaviour claim was removed from a user-facing screen", "Stale 600M/40M PhonePe figures were corrected to 700M/50M against the official release", "No price point is proposed — no willingness-to-pay data could be located"] },
  ]},
  { key: "learnings", title: "Learnings", sources: ["repo-phonepe"], blocks: [
    { ul: ["An insight-to-action gap is fixed at the moment of delivery — timing, specificity, salience — not with more acquisition", "Build the experiment on the evidence you have, and say which finding it rests on", "A guardrail that can veto a win is what makes it an experiment", "The two marks lost were for refusing to invent findings — an acceptable price"] },
  ]},
  { key: "evidence", title: "Evidence and references", sources: ["repo-phonepe", "pp-prd", "pp-partc", "cv"], blocks: [
    { note: "Every claim in the capstone carries an evidence class ([CASE DATA], [FACT], [DERIVED], [PM INFERENCE], [HYPOTHESIS], [NOT VERIFIED]…). No result exists for the A/B test." },
  ]},
];
