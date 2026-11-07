/**
 * Product Management capability library.
 *
 * Every capability has a plain definition and why it matters. Evidence links
 * only to real work: a project, a role, or the corpus stage that counts it.
 * Status is DERIVED from the evidence, never assigned:
 *   - "Demonstrated in work"     — a project or role shows it
 *   - "Applied in case studies"  — only the 90-day corpus shows it
 *   - "Not yet evidenced"        — listed for completeness; no claim made
 * There are no proficiency percentages.
 */

export type CapabilityCategory =
  | "Product Strategy" | "Discovery" | "Execution" | "Analytics" | "Growth"
  | "Design" | "AI" | "Healthcare" | "Technical" | "Communication & Collaboration";

export const CAPABILITY_CATEGORIES: CapabilityCategory[] = [
  "Discovery", "Product Strategy", "Execution", "Analytics", "Growth", "Design", "AI", "Healthcare", "Technical", "Communication & Collaboration",
];

/** ref: "project:<slug>" | "role:<id>" | "corpus:<stage-or-capability id>" */
export interface Evidence { ref: string; note: string }
export type CapabilityStatus = "Demonstrated in work" | "Applied in case studies" | "Not yet evidenced";

export interface Capability {
  id: string;
  name: string;
  category: CapabilityCategory;
  definition: string;
  why: string;
  evidence: Evidence[];
  limitation?: string;
  status: CapabilityStatus;
}

const P = (slug: string, note: string): Evidence => ({ ref: `project:${slug}`, note });
const R = (id: string, note: string): Evidence => ({ ref: `role:${id}`, note });
const K = (id: string, note: string): Evidence => ({ ref: `corpus:${id}`, note });
const APM = "apm-adhyatm-sadhna-kendra", INTERN = "pm-intern-adhyatm-sadhna-kendra", LYBL = "research-expert-lybl";

type Raw = [id: string, name: string, category: CapabilityCategory, definition: string, why: string, evidence?: Evidence[], limitation?: string];

const RAW: Raw[] = [
  /* ---------------------------------------------------------- DISCOVERY */
  ["problem-discovery", "Problem discovery", "Discovery", "Finding the problems worth solving before choosing a solution.", "Building the wrong thing well is the most expensive failure in product.", [P("careconnect", "Discovery showed finding an attendant was not the scarce problem; continuity after discharge was."), P("aaroh", "20+ interviews before a roadmap existed.")]],
  ["problem-framing", "Problem framing", "Discovery", "Stating a problem so that someone could disagree with it.", "A framing nobody can argue with is too vague to build against.", [P("careconnect", "Reframed from \"find a caregiver\" to \"prove the day's care happened\"."), K("problem", "Explicit problem statements in all 90 studies.")]],
  ["opportunity-identification", "Opportunity identification", "Discovery", "Spotting where an unmet need meets a feasible response.", "Separates interesting problems from ones a product can address.", [P("phonepe-smart-spend-coach", "The insight-to-action step identified as the opportunity."), K("decision", "Opportunity mapping in 82 studies.")]],
  ["user-research", "User research", "Discovery", "Systematic study of users' behaviour, needs and context.", "Behaviour beats stated preference as a guide to what to build.", [R(LYBL, "30+ structured interviews; findings adopted across 3 feature iterations."), R(INTERN, "Parent and facilitator interviews for Evamastu.")]],
  ["discovery-interviews", "Customer interviews", "Discovery", "Structured conversations with prospective users about their problems.", "The cheapest way to learn what a roadmap should contain.", [P("aaroh", "20+ customer discovery interviews."), R(LYBL, "30+ structured user interviews.")]],
  ["stakeholder-interviews", "Stakeholder interviews", "Discovery", "Interviews with the people around the user — buyers, facilitators, operators.", "In many products the user is not the only person whose needs decide adoption.", [R(INTERN, "Parent and facilitator interviews shaped the first Evamastu brief.")]],
  ["jtbd", "Jobs to Be Done", "Discovery", "Describing the progress a person is trying to make in a situation.", "Keeps a team focused on the outcome rather than the feature.", [K("insight", "JTBD and persona synthesis present in all 90 studies.")]],
  ["jtbd-interviews", "Jobs-to-be-Done interviews", "Discovery", "Interviews that reconstruct the moment someone chose a solution.", "Reveals the real competing alternatives.", [], "No JTBD-format interview is documented in public evidence."],
  ["personas", "User personas", "Discovery", "Evidence-based archetypes of target users.", "Gives a team a shared picture of who it is building for.", [K("users", "Persona sections present in all 90 studies."), P("phonepe-smart-spend-coach", "Primary persona: mid-career household financial manager, 33–45.")]],
  ["segmentation", "User segmentation", "Discovery", "Dividing users into groups that behave differently.", "Averages hide the segment that is failing.", [R(APM, "Cohort-level analysis across 50+ participant cohorts."), P("careconnect", "Beachhead narrowed to one segment in one window.")]],
  ["empathy-mapping", "Empathy mapping", "Discovery", "Mapping what a user says, thinks, does and feels.", "Surfaces gaps between stated and actual behaviour.", []],
  ["journey-mapping", "User journey mapping", "Discovery", "Mapping a user's steps, touchpoints and pain across a task.", "Shows where value is lost between steps.", [K("discovery", "User journey work present in all 90 studies."), P("careconnect", "Family and attendant journeys across the first 30 days.")]],
  ["pain-points", "Pain-point analysis", "Discovery", "Identifying and ranking the frictions users experience.", "Ranks where effort will matter most.", [K("problem", "Documented pain points in all 90 studies."), R(LYBL, "Onboarding drop-offs synthesised into recommendations.")]],
  ["ost", "Opportunity solution trees", "Discovery", "Linking an outcome to opportunities and candidate solutions.", "Keeps solutions traceable to the outcome they serve.", []],
  ["assumption-mapping", "Assumption mapping", "Discovery", "Listing and ranking the assumptions a plan depends on.", "Tells you what to test first.", [K("research", "63 studies carry a separate ASSUMPTIONS file, unbroken from Day 28."), P("careconnect", "Claim register grading 13 conclusions by evidence strength.")]],
  ["hypothesis", "Hypothesis generation", "Discovery", "Writing beliefs as falsifiable statements.", "A hypothesis with no way to fail will always survive the evidence.", [P("careconnect", "Brief written with an explicit rejection condition — which fired."), P("ghargyaan", "Product hypothesis stated and marked not yet validated."), P("phonepe-smart-spend-coach", "A/B hypothesis in the We-believe / will-result / because form.")]],
  ["problem-validation", "Problem validation", "Discovery", "Testing that a problem is real, frequent and painful enough.", "Prevents building for a problem that only exists in the brief.", [P("careconnect", "Validation plan with pre-registered thresholds — written, not yet run.")], "No problem-validation study has been completed with users on the independent builds."],
  ["market-research", "Market research", "Discovery", "Understanding market size, structure and dynamics.", "Decides whether a solution can become a business.", [K("research", "Market research or industry analysis in 79 studies.")]],
  ["competitive-research", "Competitive research", "Discovery", "Studying alternatives users already have.", "Positioning only makes sense against the alternative.", [R(LYBL, "Ran competitive analysis."), P("nexus", "Research across 20 products shaped the thesis.")]],
  ["voc", "Voice of Customer", "Discovery", "Capturing customer language and feedback systematically.", "Customers' words make better requirements than a team's.", [R(LYBL, "Weekly insight reports from engagement and interviews.")]],
  ["qualitative-research", "Qualitative research", "Discovery", "Interviews, observation and synthesis of meaning.", "Explains why behaviour happens.", [R(LYBL, "Behavioural pattern synthesis from 30+ interviews.")]],
  ["quantitative-research", "Quantitative research", "Discovery", "Measurement across many users.", "Shows how much and how often.", [R(APM, "Cohort analytics across 50+ cohorts."), R(LYBL, "Engagement tracked for 500+ users.")]],

  /* --------------------------------------------------- PRODUCT STRATEGY */
  ["product-vision", "Product vision", "Product Strategy", "The future a product is trying to create.", "Aligns decisions that the roadmap cannot anticipate.", [P("aaroh", "Vision: understand, explain, recommend, support — never diagnose.")]],
  ["product-mission", "Product mission", "Product Strategy", "What the product does, for whom, now.", "Turns the vision into a present-tense commitment.", [K("strategy", "Vision/mission or strategy in all 90 studies.")]],
  ["positioning", "Product positioning", "Product Strategy", "How a product is framed against alternatives in a user's mind.", "The same product wins or loses on its frame.", [P("nexus", "Deliberately not a chatbot, second brain or agent."), P("careconnect", "\"The care record that stays with the patient, not the agency.\"")]],
  ["product-strategy", "Product strategy", "Product Strategy", "The choices about where to play and how to win.", "Strategy is mostly the things you decide not to do.", [P("aaroh", "Strategy reset on positioning and scope."), K("strategy", "Product or growth strategy in all 90 studies.")]],
  ["pmf", "Product-market fit", "Product Strategy", "Evidence that a market pulls a product.", "Everything before it is a hypothesis.", [], "None of the independent builds has users, so no product-market fit is claimed."],
  ["market-segmentation", "Market segmentation", "Product Strategy", "Dividing a market into addressable groups.", "Picks the beachhead.", [P("careconnect", "Beachhead: the adult child supervising the first 30 days after discharge.")]],
  ["tam-sam-som", "TAM, SAM and SOM", "Product Strategy", "Total, serviceable and obtainable market sizing.", "Bounds the opportunity honestly.", [K("research", "TAM/SAM/SOM or Porter's Five Forces in 79 studies.")]],
  ["differentiation", "Competitive differentiation", "Product Strategy", "What makes a product meaningfully different.", "Without it, a product competes on price or luck.", [P("ghargyaan", "Evidence labels and safety-first routing as the differentiator."), P("nexus", "Interaction model, not being first.")]],
  ["value-proposition", "Value proposition", "Product Strategy", "The promise of value to a specific user.", "Decides what to say and what to build.", [P("careconnect", "Proof the day's care happened, surviving attendant changes.")]],
  ["business-model", "Business model", "Product Strategy", "How a product creates and captures value.", "A product without one is a project.", [K("strategy", "Business-model analysis across the case studies.")], "No business model has been validated on the independent builds."],
  ["monetization", "Monetization", "Product Strategy", "Choosing how and when to charge.", "Charging the wrong way can kill adoption.", [P("aaroh", "Commercial features deliberately sealed pending legal review.")], "No willingness-to-pay data exists."],
  ["gtm", "Go-to-market strategy", "Product Strategy", "How a product reaches its first users.", "Distribution is often harder than the product.", [P("careconnect", "Distribution options documented: discharge desks, physiotherapists, employer benefits.")], "Not executed."],
  ["product-lifecycle", "Product lifecycle", "Product Strategy", "Managing a product from introduction through decline.", "Different stages need different metrics and bets.", [R(APM, "Discovery through release on Evamastu.")]],
  ["tradeoffs", "Strategic trade-offs", "Product Strategy", "Choosing what to give up, explicitly.", "Hidden trade-offs become surprises later.", [P("careconnect", "25 decisions logged with alternatives and trade-offs."), P("aaroh", "Each decision logged with what it gives up.")]],
  ["roadmap", "Strategic roadmap", "Product Strategy", "Sequencing bets over time against a goal.", "Communicates intent, not a delivery promise.", [P("aaroh", "RICE/MoSCoW-prioritized roadmap from discovery."), K("strategy", "Roadmaps across the case studies.")]],
  ["opportunity-sizing", "Opportunity sizing", "Product Strategy", "Estimating the value of solving a problem.", "Lets opportunities be compared.", [K("research", "Market sizing in 79 studies.")]],
  ["build-vs-buy", "Build vs buy", "Product Strategy", "Deciding what to build, buy or partner for.", "Focuses scarce engineering on what differentiates.", [P("careconnect", "D-02: own no supply, ever — sit on top of existing attendants.")]],

  /* ---------------------------------------------------------- EXECUTION */
  ["roadmap-planning", "Product roadmap", "Execution", "Turning strategy into a sequenced plan.", "Makes trade-offs visible to the team.", [R(APM, "Roadmap discipline held with RICE and MoSCoW.")]],
  ["quarterly-planning", "Quarterly planning", "Execution", "Committing a quarter's goals and capacity.", "Matches ambition to capacity.", []],
  ["mvp", "MVP definition", "Execution", "The smallest product that tests the riskiest assumption.", "Learning per unit of effort.", [P("careconnect", "MVP scoped to one beachhead in one window."), P("aaroh", "Prototype frozen once surface area outran evidence.")]],
  ["feature-prioritization", "Feature prioritization", "Execution", "Ordering features by value, cost and risk.", "Capacity is always smaller than the backlog.", [R(APM, "12+ feature requests scored."), P("phonepe-smart-spend-coach", "5 candidates scored before one was designed.")]],
  ["rice", "RICE", "Execution", "Reach × Impact × Confidence ÷ Effort.", "Forces explicit estimates instead of opinions.", [R(APM, "RICE on 12+ feature requests."), P("phonepe-smart-spend-coach", "RICE on 5 candidate features."), K("prioritization", "RICE and/or MoSCoW in 88 studies.")]],
  ["moscow", "MoSCoW", "Execution", "Must, Should, Could, Won't.", "Makes scope cuts explicit.", [R(APM, "MoSCoW alongside RICE at Evamastu."), P("aaroh", "MoSCoW-prioritized roadmap.")]],
  ["ice", "ICE", "Execution", "Impact × Confidence × Ease.", "Fast scoring for experiments.", []],
  ["kano", "Kano Model", "Execution", "Classifying features as basic, performance or delight.", "Explains why some features matter only when absent.", []],
  ["impact-effort", "Impact vs effort", "Execution", "A two-axis quick prioritization.", "Finds quick wins and money pits.", []],
  ["value-complexity", "Value vs complexity", "Execution", "Weighing user value against delivery complexity.", "Keeps complexity honest.", []],
  ["cost-of-delay", "Cost of delay", "Execution", "The value lost by waiting.", "Sequencing by urgency, not just size.", []],
  ["dependency-mapping", "Dependency mapping", "Execution", "Making cross-team and technical dependencies explicit.", "Unmapped dependencies are where plans slip.", [P("aaroh", "Milestones gated on legal, backend and AI orchestrator dependencies.")]],
  ["scope-management", "Scope management", "Execution", "Holding scope to the goal.", "Scope creep is the default.", [R(APM, "Prioritization used to cut scope creep."), P("aaroh", "Prototype frozen at 37 screens.")]],
  ["prd", "Product Requirement Document", "Execution", "The written definition of what to build and why.", "One source of truth for the team.", [R(APM, "Wrote the full Evamastu PRD."), P("aaroh", "PRDs for intake, root-cause mapping and recommendations."), P("phonepe-smart-spend-coach", "PRD-lite for the winning feature."), K("prd", "PRD-style specs in 78 studies.")]],
  ["prs", "Product requirement specifications", "Execution", "Detailed functional specifications.", "Removes ambiguity for engineering.", [K("prd", "Feature breakdowns and requirements in 78 studies.")]],
  ["user-stories", "User stories", "Execution", "Requirements written from the user's point of view.", "Keeps the why attached to the what.", [R(INTERN, "User stories for the first assessment module.")]],
  ["acceptance-criteria", "Acceptance criteria", "Execution", "Testable conditions for done.", "Done becomes checkable.", [R(INTERN, "Acceptance criteria for the first assessment module."), P("aaroh", "Criteria written against the never-diagnose rule.")]],
  ["functional-requirements", "Functional requirements", "Execution", "What the system must do.", "The contract with engineering.", [K("prd", "Present across PRD-style studies.")]],
  ["nfr", "Non-functional requirements", "Execution", "Performance, security, accessibility and reliability needs.", "Often decides whether a product is usable.", [P("careconnect", "Append-only records, role checks, parameterised SQL."), P("ghargyaan", "Accessibility checked with axe-core.")]],
  ["user-flows", "User flows", "Execution", "Step-by-step paths through a product.", "Reveals dead ends and edge cases.", [P("careconnect", "Family and attendant flows with failure states.")]],
  ["wireframes", "Wireframes", "Execution", "Low-fidelity layouts.", "Cheap to change.", []],
  ["prototypes", "Prototypes", "Execution", "Interactive models of a product.", "Lets users react before code.", [P("aaroh", "37-screen interactive prototype."), P("phonepe-smart-spend-coach", "5-screen Figma prototype tested with 7 users.")]],
  ["backlog", "Backlog management", "Execution", "Keeping the backlog ordered and current.", "A stale backlog is a planning liability.", [R(APM, "Backlog grooming."), R(INTERN, "Built the initial backlog.")]],
  ["sprint-planning", "Sprint planning", "Execution", "Committing a sprint's scope.", "Matches goals to capacity.", [R(APM, "Ran sprint planning.")]],
  ["sprint-reviews", "Sprint reviews", "Execution", "Demonstrating and inspecting sprint output.", "Feedback while it is cheap.", []],
  ["retrospectives", "Sprint retrospectives", "Execution", "Improving how the team works.", "Compounds team effectiveness.", []],
  ["agile", "Agile", "Execution", "Iterative, feedback-driven delivery.", "Reduces the cost of being wrong.", [R(APM, "Agile sprint delivery on Evamastu.")]],
  ["scrum", "Scrum", "Execution", "An Agile framework of sprints and roles.", "A shared delivery rhythm.", [], "Sprint practices are documented; formal Scrum roles are not."],
  ["kanban", "Kanban", "Execution", "Flow-based work management.", "Limits work in progress.", []],
  ["cross-functional", "Cross-functional collaboration", "Execution", "Working across design, engineering and business.", "Products are built by teams.", [R(APM, "Owned delivery from discovery through release.")]],
  ["eng-handoff", "Engineering handoff", "Execution", "Transferring requirements to engineering clearly.", "Prevents rework.", [R(APM, "PRD and user stories for delivery.")]],
  ["qa-uat", "QA and UAT", "Execution", "Testing quality and user acceptance.", "Defects found late cost more.", [P("careconnect", "Automated suite; 22 defects found and fixed across three iterations."), P("ghargyaan", "214-case evaluation suite.")]],
  ["release-management", "Release management", "Execution", "Planning and coordinating releases.", "Releases are a product decision.", [R(APM, "Shipped Parent Dashboard, assessment and 4 games.")]],
  ["change-management", "Change management", "Execution", "Helping users and teams adopt change.", "Shipped is not adopted.", []],

  /* ------------------------------------------------------------- DESIGN */
  ["information-architecture", "Information architecture", "Design", "Structuring content so people can find it.", "Findability is usability.", [P("careconnect", "Role-split IA for family and attendant.")]],
  ["ux-research", "UX research", "Design", "Research focused on interaction and usability.", "Finds friction before users do.", [P("phonepe-smart-spend-coach", "Usability testing with 7 real users; findings graded by severity.")]],
  ["interaction-design", "Interaction design", "Design", "Designing how users act and the system responds.", "The product is the interaction.", [P("careconnect", "\"Could not do\" requires a reason — a deliberate interaction cost.")]],
  ["usability-testing", "Usability testing", "Design", "Watching users attempt real tasks.", "The fastest way to find what's broken.", [P("phonepe-smart-spend-coach", "7 testers; ~12-second search for the action entry observed.")]],
  ["lofi", "Low-fidelity prototypes", "Design", "Rough interactive sketches.", "Tests flow, not polish.", []],
  ["hifi", "High-fidelity prototypes", "Design", "Near-final interactive designs.", "Tests comprehension and trust.", [P("phonepe-smart-spend-coach", "5-screen Figma prototype."), P("aaroh", "37-screen interactive prototype.")]],
  ["design-systems", "Design systems", "Design", "Reusable components and tokens.", "Consistency at speed.", [], "This portfolio's own design system is the current example; not a professional claim."],
  ["accessibility", "Accessibility", "Design", "Making products usable by everyone.", "Excluding users is a product failure.", [P("ghargyaan", "axe-core WCAG 2 A/AA: 0 violations on 9 pages."), P("careconnect", "Accessibility sweep: 0 issues.")]],
  ["responsive", "Responsive design", "Design", "Layouts that work at every size.", "Most users are on phones.", [P("ghargyaan", "Mobile-first PWA tested at 390 and 1280 px.")]],
  ["onboarding", "Onboarding", "Design", "A new user's first experience.", "Most churn happens here.", [R(APM, "Onboarding redesign lifted consistency 20–25% in 6 weeks."), R(LYBL, "Onboarding drop-offs synthesised.")]],
  ["activation", "Activation", "Design", "The moment a user first gets value.", "Retention starts here.", [P("aaroh", "Activation defined — no data, no users.")]],
  ["retention-design", "Retention", "Design", "Bringing users back because they get value.", "Growth without retention leaks.", [R(APM, "Consistency lift after onboarding redesign.")]],
  ["customer-journey", "Customer journey", "Design", "The end-to-end relationship with a product.", "Shows value and loss across touchpoints.", [K("discovery", "Journey work in all 90 studies.")]],

  /* ---------------------------------------------------------- ANALYTICS */
  ["north-star", "North Star Metric", "Analytics", "The one metric that best captures delivered value.", "Aligns a team on value, not activity.", [P("careconnect", "Documented care days, split from complete care days."), P("aaroh", "North Star defined."), K("metrics", "North Star defined in 80 studies.")]],
  ["kpis", "KPIs", "Analytics", "The key indicators a team tracks.", "What gets measured gets managed.", [R(LYBL, "Weekly insight reports on engagement.")]],
  ["input-output-metrics", "Input and output metrics", "Analytics", "Leading actions vs lagging results.", "Teams can move inputs; outputs follow.", [P("careconnect", "North star plus quality measure plus guardrails.")]],
  ["engagement", "Engagement", "Analytics", "How actively users use a product.", "A proxy for value delivered.", [R(LYBL, "Engagement tracked for 500+ users.")]],
  ["churn", "Churn", "Analytics", "Users or revenue lost over time.", "Retention's mirror image.", []],
  ["conversion", "Conversion", "Analytics", "The share of users who complete a step.", "Locates loss in a flow.", [P("phonepe-smart-spend-coach", "Stage conversions computed from case data.")]],
  ["funnel-analysis", "Funnel analysis", "Analytics", "Measuring step-by-step conversion through a flow.", "Finds the step where value stops transferring.", [R(APM, "2 funnel drop-offs found."), P("phonepe-smart-spend-coach", "40,000-user case funnel; 4→5 prioritised.")]],
  ["cohort-analysis", "Cohort analysis", "Analytics", "Comparing groups that started at the same time or condition.", "Averages hide failing cohorts.", [R(APM, "Cohort analytics across 50+ participant cohorts.")]],
  ["segmentation-analytics", "Segmentation analysis", "Analytics", "Breaking metrics down by user group.", "Finds where effects differ.", [R(APM, "Segment before averaging.")]],
  ["dau-wau-mau", "DAU, WAU and MAU", "Analytics", "Daily, weekly and monthly active users.", "Basic usage health.", [], "No independent build has users to measure."],
  ["stickiness", "Stickiness", "Analytics", "DAU ÷ MAU — how habitual use is.", "Habit predicts retention.", []],
  ["time-to-value", "Time to value", "Analytics", "How long until a user first gets value.", "Shorter is usually better.", [P("phonepe-smart-spend-coach", "Median time-to-action as the secondary metric.")]],
  ["ltv", "Customer lifetime value", "Analytics", "Expected value of a customer over time.", "Bounds acquisition spend.", []],
  ["cac", "CAC", "Analytics", "Cost to acquire a customer.", "Decides whether growth is affordable.", []],
  ["ltv-cac", "LTV:CAC", "Analytics", "Lifetime value relative to acquisition cost.", "Unit economics in one number.", []],
  ["aarrr", "AARRR funnel", "Analytics", "Acquisition, activation, retention, referral, revenue.", "A shared growth vocabulary.", []],
  ["event-tracking", "Event tracking", "Analytics", "Recording user actions as events.", "No events, no analytics.", [P("careconnect", "First-party analytics; no free text or readings recorded."), P("ghargyaan", "10 privacy-safe events.")]],
  ["instrumentation", "Instrumentation", "Analytics", "Designing what to measure before launch.", "Unmeasured launches teach nothing.", [P("aaroh", "Activation, retention and adoption defined before launch.")]],
  ["dashboards", "Analytics dashboards", "Analytics", "Visualising product metrics.", "Makes trends visible to a team.", [R(APM, "Cohort analytics system.")]],
  ["data-driven", "Data-driven decision-making", "Analytics", "Letting evidence decide.", "Opinions are cheap.", [R(APM, "Analysis drove the onboarding redesign."), R(LYBL, "Insight reports shaped sprint prioritization.")]],

  /* -------------------------------------------------------------- GROWTH */
  ["hypothesis-development", "Hypothesis development", "Growth", "Turning an observation into a testable bet.", "Every experiment starts here.", [P("phonepe-smart-spend-coach", "Hypothesis tied to observation F-01 and the funnel.")]],
  ["ab-testing", "A/B testing", "Growth", "Randomised comparison of variants.", "Separates causation from coincidence.", [R(LYBL, "Ran A/B tests on feature and content variants."), P("phonepe-smart-spend-coach", "21-day A/B test designed — not run.")]],
  ["experiment-design", "Experiment design", "Growth", "Defining variants, metrics, duration and stopping rules.", "A badly designed test teaches the wrong lesson.", [P("phonepe-smart-spend-coach", "Control, variant, primary, secondary, guardrail and duration defined."), K("experiment", "Experiment design or rollout plans in 76 studies.")]],
  ["control-treatment", "Control and treatment groups", "Growth", "Comparing a baseline with a change.", "Isolates the effect.", [P("phonepe-smart-spend-coach", "One variable changed between arms.")]],
  ["primary-metrics", "Primary metrics", "Growth", "The metric an experiment is decided on.", "Prevents choosing a winner after the fact.", [P("phonepe-smart-spend-coach", "Insight-to-Action Completion Rate.")]],
  ["guardrail-metrics", "Guardrail metrics", "Growth", "Metrics that must not get worse.", "A win bought with harm is a loss.", [P("phonepe-smart-spend-coach", "Action Reversal Rate can veto a win."), P("careconnect", "Three guardrails that stop the roadmap.")]],
  ["stat-sig", "Statistical significance", "Growth", "Whether a difference is likely to be real.", "Avoids shipping noise.", [], "No experiment has been run to analyse."],
  ["sample-size", "Sample size", "Growth", "How many users a test needs.", "Underpowered tests mislead.", []],
  ["experiment-duration", "Experiment duration", "Growth", "How long a test must run.", "Too short and weekly cycles bias the result.", [P("phonepe-smart-spend-coach", "14 days enrolment + 7-day attribution tail; guardrail read at day 35.")]],
  ["cro", "Conversion optimization", "Growth", "Improving conversion at a step.", "Small step changes compound.", [P("phonepe-smart-spend-coach", "Targets the 4→5 step.")]],
  ["growth-loops", "Growth loops", "Growth", "Self-reinforcing acquisition cycles.", "More durable than funnels.", []],
  ["referral-loops", "Referral loops", "Growth", "Users bringing in users.", "Lowers CAC.", []],
  ["funnel-optimization", "Funnel optimization", "Growth", "Systematically reducing loss across a funnel.", "Most value is lost between steps.", [R(APM, "Redesign targeted the two drop-offs found.")]],
  ["onboarding-optimization", "Onboarding optimization", "Growth", "Improving first-run completion and value.", "The highest-leverage growth surface.", [R(APM, "Onboarding redesign → +20–25% consistency.")]],
  ["retention-strategies", "Retention strategies", "Growth", "Deliberate efforts to keep users.", "Retention is the base of growth.", []],
  ["iteration", "Iteration", "Growth", "Changing one thing at a time and re-measuring.", "Learning compounds.", [P("careconnect", "Iteration 2 shipped no features — it tightened claims.")]],

  /* ------------------------------------------------------------------ AI */
  ["ai-product-strategy", "AI product strategy", "AI", "Deciding where AI earns its place in a product.", "Capability is cheap; the boundary is expensive.", [P("aaroh", "AI for intake and explanation, never diagnosis."), P("nexus", "AI optional and fenced.")]],
  ["ai-use-cases", "AI use-case discovery", "AI", "Finding user problems AI is suited to.", "Avoids capability demos.", [P("aaroh", "AI scoped to tedious, human-limited work.")]],
  ["ai-feasibility", "AI feasibility", "AI", "Judging whether AI can do a job reliably enough.", "Reliability decides trust.", [P("phonepe-smart-spend-coach", "AI classification judged augmented rather than native.")]],
  ["ai-requirements", "AI product requirements", "AI", "Requirements that include model behaviour and limits.", "Model behaviour is part of the spec.", [P("aaroh", "PRDs for AI intake, root-cause mapping and recommendations.")]],
  ["llm-design", "LLM product design", "AI", "Designing products around language models.", "UX decides whether a model is trusted.", [P("ghargyaan", "The model never writes advice; it frames and maps to fixed guide IDs.")]],
  ["prompt-engineering", "Prompt engineering", "AI", "Designing instructions for models.", "Small wording changes move behaviour.", [], "Listed as a CV skill; no public prompt artefact is shown."],
  ["rag", "RAG concepts", "AI", "Retrieval-augmented generation.", "Grounds answers in sources.", [P("ghargyaan", "Hybrid retrieval over reviewed guides; pgvector schema written, not deployed."), P("nexus", "Grounding check rejects sentences that introduce facts.")]],
  ["context-engineering", "Context engineering", "AI", "Choosing what context a model sees.", "Context quality bounds answer quality.", [P("nexus", "Evidence-only context with schema-validated output.")]],
  ["agentic", "Agentic workflows", "AI", "Models that plan and act with tools.", "Powerful, and risky without limits.", [], "Nexus deliberately does not act on the user's behalf."],
  ["model-evaluation", "Model evaluation", "AI", "Measuring model or system behaviour against cases.", "Untested AI is a liability.", [P("ghargyaan", "214-case suite; held-out rounds scored before fixes.")]],
  ["evaluation-datasets", "Evaluation datasets", "AI", "Curated cases that define good behaviour.", "The dataset is the spec.", [P("ghargyaan", "12 scenario suites, including red-team and held-out rounds.")]],
  ["hallucination-mitigation", "Hallucination mitigation", "AI", "Preventing unsupported model output.", "Wrong-but-fluent is the worst failure.", [P("ghargyaan", "Output validator with template fallback."), P("nexus", "Sentences introducing facts not in evidence are rejected.")]],
  ["ai-safety", "AI safety", "AI", "Preventing harm from AI behaviour.", "In health, safety is the product.", [P("ghargyaan", "Deterministic safety screen before any AI."), P("aaroh", "Never-diagnose invariant.")]],
  ["human-in-the-loop", "Human-in-the-loop", "AI", "Keeping humans in decisions that matter.", "Preserves accountability.", [P("aaroh", "Practitioners stay in charge."), P("nexus", "Nexus shows evidence and lets the user decide.")]],
  ["model-limitations", "Model limitations", "AI", "Knowing and stating what a model cannot do.", "Honesty builds trust.", [P("ghargyaan", "Recall gaps on new phrasing disclosed.")]],
  ["guardrails", "Guardrails", "AI", "Hard limits on system behaviour.", "Some outputs must never happen.", [P("ghargyaan", "Hard blocks on dosing and dangerous DIY."), P("aaroh", "Diagnosis blocked at the requirement level.")]],
  ["ai-ux", "AI UX", "AI", "Interfaces that make AI behaviour legible.", "Users need to know why.", [P("ghargyaan", "\"Why am I seeing this?\" source drawer.")]],
  ["cost-latency", "Cost and latency", "AI", "Trading model quality against cost and speed.", "Unit economics of AI features.", []],
  ["ai-observability", "AI observability", "AI", "Monitoring AI behaviour in production.", "You cannot fix what you cannot see.", [], "No AI system is in production."],
  ["responsible-ai", "Responsible AI", "AI", "Designing AI for fairness, safety and accountability.", "Trust is earned slowly.", [P("aaroh", "Non-diagnostic boundary set before demand.")]],
  ["privacy", "Privacy and consent", "AI", "Collecting only what is needed, with consent.", "Health data is sensitive.", [P("ghargyaan", "Analytics carry no text, voice or photo content."), P("nexus", "Read-only by design; export and delete-all.")]],

  /* ---------------------------------------------------------- HEALTHCARE */
  ["patient-journey", "Patient journey", "Healthcare", "A patient's path through care.", "Care breaks at handoffs.", [P("careconnect", "The first 30 days after discharge.")]],
  ["caregiver-journey", "Caregiver journey", "Healthcare", "The family and attendant side of care.", "Caregivers carry most home care.", [P("careconnect", "Adult child and attendant journeys.")]],
  ["provider-workflow", "Provider workflow", "Healthcare", "How practitioners actually work.", "Products that fight workflow are abandoned.", [P("aaroh", "Practitioner panel across four disciplines.")]],
  ["digital-health-discovery", "Digital health discovery", "Healthcare", "Discovery for health products.", "Health problems carry safety and trust constraints.", [P("aaroh", "20+ discovery interviews."), K("healthcare", "24 healthcare or health-AI studies.")]],
  ["health-onboarding", "Healthcare onboarding", "Healthcare", "First-run experiences for health products.", "Consent and trust start here.", [R(APM, "Evamastu onboarding redesign.")]],
  ["patient-engagement", "Patient engagement", "Healthcare", "Sustained participation in care.", "Outcomes depend on it.", [R(APM, "Consistency as the engagement measure.")]],
  ["post-discharge", "Post-discharge care", "Healthcare", "Care after leaving hospital.", "A high-risk transition.", [P("careconnect", "Product built for this window.")]],
  ["care-continuity", "Care continuity", "Healthcare", "Information that survives handoffs.", "Rotating staff reset care.", [P("careconnect", "Handover pack on every attendant change.")]],
  ["health-ia", "Health information architecture", "Healthcare", "Structuring health information for laypeople.", "Comprehension is safety.", [P("ghargyaan", "Do now · Avoid · Evidence · Watch for · Get help.")]],
  ["non-diagnostic-design", "Non-diagnostic product design", "Healthcare", "Designing health products that never diagnose.", "Keeps clinicians in charge and users safe.", [P("aaroh", "Hard constraint on every user story."), P("ghargyaan", "Explicitly not an AI doctor.")]],
  ["consent-onboarding", "Consent-based onboarding", "Healthcare", "Onboarding participants with explicit consent.", "Trust and ethics.", [P("aaroh", "8 consented practitioners.")]],
  ["evidence-labelling", "Evidence labelling", "Healthcare", "Showing how strong the evidence behind guidance is.", "Lets users calibrate trust.", [P("ghargyaan", "Four-level evidence ladder on every guide.")]],
  ["clinical-safety", "Clinical safety boundaries", "Healthcare", "Limits that keep a product out of clinical practice.", "Avoids harm and regulatory risk.", [P("aaroh", "Commercial features sealed pending legal review.")], "No clinical qualification or regulatory compliance is claimed."],
  ["crisis-routing", "Crisis routing", "Healthcare", "Sending emergencies to the right help immediately.", "Seconds matter.", [P("ghargyaan", "21 emergency categories; Tele-MANAS, 112 and poison lines.")]],
  ["health-privacy", "Healthcare privacy", "Healthcare", "Protecting health data.", "Breaches destroy trust.", [P("careconnect", "No free text or readings in analytics events.")], "Not DPDP-compliant; stated in the repository."],
  ["responsible-health-comms", "Responsible health communication", "Healthcare", "Plain, honest, non-alarming health language.", "Misinformation harms.", [P("ghargyaan", "Folk practice and evidence labelled side by side.")]],

  /* ---------------------------------------------------------- TECHNICAL */
  ["react-typescript", "React and TypeScript", "Technical", "Building web interfaces.", "Lets a PM prototype and talk build.", [P("careconnect", "React 19 + TypeScript MVP."), P("ghargyaan", "React 19 + TypeScript PWA.")]],
  ["sqlite", "SQLite", "Technical", "Embedded relational database.", "Simple, real persistence.", [P("careconnect", "better-sqlite3 with 17 tables.")]],
  ["claude-api", "Claude API and MCP", "Technical", "Building with Anthropic's platform.", "Hands-on AI building.", [P("aaroh", "Prototype work with the Claude API, Cursor and Lovable.")]],
  ["testing-automation", "Automated testing", "Technical", "Unit, integration and end-to-end tests.", "Evidence that software works.", [P("careconnect", "65 unit/integration + 30 E2E (CV)."), P("ghargyaan", "214 tests.")]],
  ["github", "GitHub", "Technical", "Version control and public artefacts.", "Work you can inspect.", [P("90-day-case-studies", "Public case-study repository.")]],

  /* --------------------------------------- COMMUNICATION & COLLABORATION */
  ["stakeholder-management", "Stakeholder management", "Communication & Collaboration", "Aligning people with different interests.", "Products need sponsors.", [R(INTERN, "Parent and facilitator input into the brief.")]],
  ["cross-functional-comms", "Cross-functional communication", "Communication & Collaboration", "Clear communication across disciplines.", "Misunderstanding is the main source of rework.", [R(LYBL, "Weekly insight reports to the team.")]],
  ["documentation", "Product documentation", "Communication & Collaboration", "Writing that a team can act on.", "Decisions outlive meetings.", [P("ghargyaan", "16 product documents."), P("careconnect", "Problem, decisions, metrics and validation docs.")]],
  ["decision-log", "Decision logs", "Communication & Collaboration", "Recording decisions with context and trade-offs.", "Prevents relitigating.", [P("careconnect", "25 decisions with alternatives."), P("aaroh", "Decision log with evidence and trade-offs.")]],
  ["claim-register", "Claim registers", "Communication & Collaboration", "Grading conclusions by evidence strength.", "Stops anecdotes hardening into statistics.", [P("careconnect", "13 conclusions graded.")]],
  ["risk-register", "Risk registers", "Communication & Collaboration", "Tracking risks and mitigations.", "Makes risk visible early.", [K("risk", "Risk and mitigation analysis in all 90 studies.")]],
  ["sprint-reporting", "Sprint reporting", "Communication & Collaboration", "Reporting sprint outcomes.", "Keeps stakeholders informed.", [R(LYBL, "Weekly insight reports shaped sprint priority.")]],
  ["release-coordination", "Release coordination", "Communication & Collaboration", "Coordinating teams around a release.", "Releases cross team boundaries.", [R(APM, "Owned through release.")]],
  ["process-improvement", "Process improvement", "Communication & Collaboration", "Improving how work gets done.", "Compounds over time.", [K("research", "Method changes measurable across the 90 days.")]],
  ["pivot", "Pivoting on evidence", "Communication & Collaboration", "Changing direction when evidence demands it, and documenting it.", "Sunk cost is the enemy of good product.", [P("careconnect", "Rejected own brief; documented as D-01.")]],
];

function statusOf(e: Evidence[]): CapabilityStatus {
  if (e.some((x) => x.ref.startsWith("project:") || x.ref.startsWith("role:"))) return "Demonstrated in work";
  if (e.length) return "Applied in case studies";
  return "Not yet evidenced";
}

export const capabilities: Capability[] = RAW.map(([id, name, category, definition, why, evidence = [], limitation]) => ({
  id, name, category, definition, why, evidence, limitation, status: statusOf(evidence),
}));

export const capabilityById = (id: string) => capabilities.find((c) => c.id === id);
