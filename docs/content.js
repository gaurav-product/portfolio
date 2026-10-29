/* ============================================================================
   GAURAV.OS — CONTENT LAYER
   ----------------------------------------------------------------------------
   This file is the entire content model. The UI (app.js) reads from it and
   never hard-codes content. Adding a Lab Note, project or credential means
   editing a record HERE — no frontend file is touched.

   Evidence rule enforced throughout: every factual claim traces to the CV or
   to Gaurav's own product documentation. Anything unvalidated carries an
   explicit status — CONCEPT, HYPOTHESIS, DRAFT, IN PROGRESS, NOT YET VALIDATED.
   ========================================================================== */

window.GOS_CONTENT = {

  /* ---------------------------------------------------------------- config */
  site_config: {
    id: "site",
    name: "GAURAV.OS",
    owner: "Gaurav Kumar Singh",
    /* Positioning, not a past job title. The titles actually held are in
       experience[] and projects[] and are never upgraded.                  */
    role: "AI Product Professional",
    discipline: "AI · Product · Healthcare",
    /* The hero's positioning line: what kind of product work, in one line. */
    headline: "AI product professional building evidence-led, safety-conscious products from discovery to delivery.",
    /* The hero's one-paragraph answer to "who is this?". Every clause is a
       documented fact: Evamastu PRD → release, Live Your Best Life research,
       the Masai School programme with IIT Roorkee faculty.                  */
    intro: "I owned a digital mindfulness platform from discovery through release, after two years of structured user research for a US wellness company — and I build AI products with hard safety boundaries, labelled by what is and isn't validated.",
    positioning: "I research behaviour, frame problems, build products, measure outcomes, and use AI where it creates genuine product value.",
    location: "New Delhi, India",
    version: "v6.0",
    updated: "29 October 2026",
    seeking: "AI PM · Healthcare PM · APM · Product Analyst · HealthTech",
    /* Stated positioning, not an inference. Said once in the hero (as the
       role chips), once at Contact and once in Recruiter View.             */
    opportunity: {
      enabled: true,
      label: "OPEN TO AI & HEALTHCARE PRODUCT ROLES",
      line: "I'm looking for AI Product Manager, Healthcare Product Manager, Associate Product Manager, Product Analyst and HealthTech product roles.",
      detail: "I'm strongest where a product has to be researched before it is built, measured after it ships, and kept honest about what AI should and shouldn't do.",
      roles: ["AI Product Manager", "Healthcare Product Manager", "Associate Product Manager", "Product Analyst", "HealthTech Product"],
      cta_label: "LET'S TALK",
      cta_href: "#contact",
      cta_href_recruiter: "#rec-contact"
    },
    /* The three verified proof points the hero leads with. Each names the
       project record it summarises and the evidence label it carries; the
       wording is the verified wording and is not to be strengthened.        */
    proof_points: [
      { project: "evamastu", label: "EVAMASTU · ASSOCIATE PRODUCT MANAGER",
        claim: "Owned discovery through release and wrote the full PRD; cohort analysis across 50+ participant cohorts supported a 20–25% lift in consistency over six weeks.",
        evidence: "SHIPPED · FROM CV" },
      { project: "live-your-best-life", label: "LIVE YOUR BEST LIFE · RESEARCH EXPERT",
        claim: "30+ structured user interviews and engagement tracked for 500+ users; the research influenced three major feature iterations.",
        evidence: "FROM CV" },
      { project: "careconnect", label: "CARECONNECT · SELF-DIRECTED BUILD",
        claim: "Reframed a caregiver marketplace into a post-discharge care accountability layer, then built an MVP with 65 unit/integration tests and 30 end-to-end journeys.",
        evidence: "MVP · NOT IN PRODUCTION" }
    ],
    summary: [
      "3+ years in HealthTech product, user research and behavioral analytics — 30+ structured user interviews, 500+ users tracked, findings adopted across 3 feature iterations.",
      "Owned a digital mindfulness platform end to end, PRD through release, where cohort analysis across 50+ cohorts supported a 20–25% lift in user consistency.",
      "Currently building an AI health product with the Claude API, Cursor and Lovable, and seeking AI Product Manager, Healthcare Product Manager, Associate Product Manager, Product Analyst or HealthTech product roles."
    ],
    contact: {
      email: "gauravkumarsingh773@gmail.com",
      /* No phone number and no street address: content.js is served publicly,
         so neither is stored here. Public contact: email, LinkedIn, GitHub, city. */
      linkedin: "linkedin.com/in/gaurav-singh-product",
      github: "github.com/gaurav-product",
      /* DOWNLOAD CV appears in the hero, Contact, the rail and Recruiter
         View whenever `file` names a PDF. The PDF is printed from cv.html,
         which renders this content layer — so it can never say more than
         the site does. To ship a hand-made CV instead, drop the PDF into
         site/media/ under this name (or change `file`) and rebuild.        */
      resume: {
        file: "media/gaurav-kumar-singh-cv.pdf",
        page: "cv.html",
        label: "DOWNLOAD CV",
        filename: "Gaurav-Kumar-Singh-CV.pdf",
        note: "Generated from the same records this site renders."
      }
    },
    /* The Product Orbit, shown in Explore the Lab → How I Think. */
    orbit: {
      core: "GAURAV.OS",
      core_label: "PRODUCT SYSTEM",
      caption: "ORBIT: DOMAINS · BELOW: OPERATING LOOP",
      /* The five domains are the single source of truth for the Product Orbit on
         every surface. `id` is the stable key; `blurb` is the node's caption. */
      inner: [
        { id: "research",   label: "RESEARCH",   blurb: "Evidence before certainty." },
        { id: "ai",         label: "AI",         blurb: "Technology should amplify reasoning, not replace reasoning." },
        { id: "healthcare", label: "HEALTHCARE", blurb: "Build for trust, safety and real-world constraints." },
        { id: "product",    label: "PRODUCT",    blurb: "Turn ambiguous problems into measurable systems." },
        { id: "behaviour",  label: "BEHAVIOUR",  blurb: "Understand people before designing for them." }
      ],
      outer: [
        { label: "BUILD",   blurb: "Ship the smallest thing that can be judged." },
        { label: "MEASURE", blurb: "Instrument it before it ships, or the result is an opinion." },
        { label: "LEARN",   blurb: "Write down what changed — including what did not work." }
      ]
    },
    product_question: {
      text: "What should an AI product actually automate, and what should remain human?",
      status: "PORTFOLIO FRAMING",
      note: "This is the question I use to frame my own work — not a documented research project. The closest thing I have to an answer is Aaroh's hard constraint: understand, explain, recommend, support — never diagnose."
    }
  },

  /* ------------------------------------------------------------ navigation */
  /* The page order. "lab" entries live inside the collapsed Explore the Lab
     disclosure; following one of these links opens it.                    */
  navigation: [
    { id: "home",           label: "Overview",          idx: "01", group: "Portfolio" },
    { id: "work",           label: "Selected work",     idx: "02", group: "Portfolio" },
    { id: "product-lab",    label: "AI & Product Lab",  idx: "03", group: "Portfolio" },
    { id: "ask",            label: "Ask Gaurav",        idx: "04", group: "Portfolio" },
    { id: "experience",     label: "Experience",        idx: "05", group: "Portfolio" },
    { id: "education",      label: "Education",         idx: "06", group: "Portfolio" },
    { id: "certifications", label: "Certifications",    idx: "07", group: "Portfolio" },
    { id: "contact",        label: "Contact & CV",      idx: "08", group: "Portfolio" },
    { id: "constellation",  label: "90-day corpus",     idx: "L1", group: "Explore the Lab", lab: true },
    { id: "atlas",          label: "Product Atlas",     idx: "L2", group: "Explore the Lab", lab: true },
    { id: "evolution",      label: "Evolution",         idx: "L3", group: "Explore the Lab", lab: true },
    { id: "thinking",       label: "How I Think",       idx: "L4", group: "Explore the Lab", lab: true },
    { id: "challenge",      label: "Challenges",        idx: "L5", group: "Explore the Lab", lab: true },
    { id: "lab",            label: "Lab Notes",         idx: "L6", group: "Explore the Lab", lab: true },
    { id: "film",           label: "Intro film",        idx: "L7", group: "Explore the Lab", lab: true }
  ],

  /* -------------------------------------------------------------- projects */
  /* tier "primary" = the three Selected Work case studies. tier "lab" = the
     AI & Product Lab. Every figure in a primary record is already stated in
     experience[] — these records restructure CV facts, they add none.
     `status` is the one place a project's state is named; unfinished work
     never says shipped, live or completed. recruiter[] is the résumé view. */
  projects: [
    {
      id: "evamastu", slug: "evamastu", order: 1, featured: true, tier: "primary",
      name: "Evamastu", subtitle: "Digital mindfulness platform",
      domain: "HealthTech / Wellness", role: "Associate Product Manager",
      org: "Adhyatm Sadhna Kendra, New Delhi",
      period: "Nov 2024 – Apr 2026", status: "SHIPPED", status_tone: "jade",
      evidence: "FROM CV",
      headline: "Discovery through release — then the analytics that showed where onboarding was losing people.",
      metrics: [
        { n: "20–25%", l: "lift in user consistency in six weeks after the onboarding redesign" },
        { n: "50+", l: "participant cohorts in the cohort analytics system" },
        { n: "2", l: "funnel drop-offs found, which drove the redesign" },
        { n: "12+", l: "feature requests scored with RICE and MoSCoW" }
      ],
      exec: [
        { k: "DISCOVERY", t: "As Product Management Intern: parent and facilitator interviews, turned into the problem statements behind the first product brief." },
        { k: "OWNERSHIP", t: "As Associate Product Manager: discovery through release, and the full PRD." },
        { k: "SHIPPED", t: "A Parent Dashboard, a Child Wellness Assessment and 4 adaptive cognitive games." },
        { k: "OUTCOME", t: "Cohort analysis found 2 funnel drop-offs; the onboarding redesign that followed lifted consistency 20–25% in six weeks.", alert: true }
      ],
      sections: [
        { id: "discovery", label: "DISCOVERY", body: "<p>I joined as Product Management Intern (Nov 2024 – Apr 2025) and supported early discovery: I ran <b>parent and facilitator interviews</b> and turned the findings into the problem statements behind the first product brief.</p><p>From there I built the initial backlog and a competitive scan, and wrote user stories and acceptance criteria for the first assessment module.</p>" },
        { id: "ownership", label: "OWNERSHIP: PRD THROUGH RELEASE", body: "<p>As Associate Product Manager (May 2025 – Apr 2026) I owned Evamastu from discovery through release and wrote the full PRD.</p><ul><li><b>Parent Dashboard</b></li><li><b>Child Wellness Assessment</b></li><li><b>4 adaptive cognitive games</b></li></ul>" },
        { id: "analytics", label: "COHORT ANALYTICS", body: "<p>I built a cohort analytics system across <b>50+ participant cohorts</b>. Segmenting by cohort rather than averaging is what surfaced <b>2 funnel drop-offs</b> — an average across cohorts hides the one that is struggling.</p><p>Those two drop-offs drove an onboarding redesign, and consistency rose <b>20–25% in six weeks</b> after it.</p>" },
        { id: "prioritization", label: "PRIORITIZATION & DELIVERY", body: "<p>Ran Agile sprint planning and backlog grooming, and scored <b>12+ feature requests with RICE and MoSCoW</b> to hold roadmap discipline and cut scope creep.</p>" },
        { id: "evidence", label: "EVIDENCE", tag: "FROM CV", body: "<p class='note'>Every figure here is from my CV. The cohort data, dashboards and PRD are not published on this site, so no figure beyond these is quoted.</p>" }
      ],
      recruiter: [
        "Owned discovery through release; wrote the full PRD and shipped a Parent Dashboard, Child Wellness Assessment and 4 adaptive cognitive games.",
        "Built a cohort analytics system across 50+ participant cohorts; found 2 funnel drop-offs that drove an onboarding redesign — consistency rose 20–25% in 6 weeks.",
        "Scored 12+ feature requests with RICE and MoSCoW; ran sprint planning and backlog grooming."
      ]
    },

    {
      id: "live-your-best-life", slug: "live-your-best-life", order: 2, featured: true, tier: "primary",
      name: "Live Your Best Life", subtitle: "Wellness-team user research (USA, remote)",
      domain: "Wellness / User Research", role: "Research Expert, Wellness Team",
      org: "Live Your Best Life (USA) · Remote",
      period: "Sep 2022 – Jul 2024", status: "RESEARCH ROLE", status_tone: "jade",
      evidence: "FROM CV",
      headline: "Two years of structured user research, written so a product team could act on it.",
      metrics: [
        { n: "30+", l: "structured user interviews" },
        { n: "3", l: "major feature iterations informed by the research" },
        { n: "500+", l: "users tracked for engagement" },
        { n: "Weekly", l: "insight reports shaping sprint prioritization" }
      ],
      exec: [
        { k: "RESEARCH", t: "30+ structured user interviews." },
        { k: "SYNTHESIS", t: "Behavioural patterns and onboarding drop-offs, turned into recommendations." },
        { k: "OUTCOME", t: "Recommendations adopted across 3 major feature iterations.", alert: true },
        { k: "CADENCE", t: "Engagement tracked for 500+ users; weekly insight reports fed sprint prioritization." }
      ],
      sections: [
        { id: "research", label: "WHAT I DID", body: "<p>As Research Expert on the Wellness Team (remote, for a US company) I conducted <b>30+ structured user interviews</b> and synthesized the behavioural patterns and onboarding drop-offs they revealed into product recommendations.</p>" },
        { id: "impact", label: "WHAT IT CHANGED", body: "<p>The recommendations were <b>adopted across three major feature iterations</b>. Alongside the interviews I tracked engagement metrics for <b>500+ users</b> and delivered <b>weekly insight reports</b> that shaped sprint prioritization directly.</p>" },
        { id: "carried", label: "WHAT I CARRIED FORWARD", body: "<p>At Evamastu it became a cohort analytics system across 50+ participant cohorts: two funnel drop-offs found, an onboarding redesign shipped, consistency up 20–25% in six weeks. At Aaroh it became 20+ discovery interviews before a roadmap existed. The order never changes — behaviour first, feature second.</p>" },
        { id: "evidence", label: "EVIDENCE", tag: "FROM CV", body: "<p class='note'>The interview transcripts and synthesis documents are not published here. The numbers above are the ones I can stand behind.</p>" }
      ],
      recruiter: [
        "Conducted 30+ structured user interviews; synthesized behavioral patterns and onboarding drop-offs into recommendations adopted across 3 major feature iterations.",
        "Tracked engagement metrics for 500+ users and delivered weekly insight reports that shaped sprint prioritization."
      ]
    },

    {
      id: "aaroh", slug: "aaroh", order: 4, featured: true, tier: "lab",
      card: "An AI-enabled health product that explains contributing factors and points to a human practitioner — built around a hard rule never to diagnose.",
      name: "Aaroh", subtitle: "AI Root-Cause Health Platform",
      domain: "AI / Healthcare", role: "Founder & Product Manager",
      period: "May 2026 – Present", status: "IN PROGRESS · STRATEGY RESET", status_tone: "gold",
      status_note: "AI-enabled health product. Eight consented practitioners, zero live users, and no validated live-user outcomes. A strict non-diagnostic boundary; a strategy reset on positioning and scope is in progress.",
      headline: "The product I own outright — including its strategy mistakes.",
      exec: [
        { k: "PROBLEM", t: "Health advice arrives as isolated answers — no explanation of why, and no context that carries forward." },
        { k: "DISCOVERY", t: "20+ customer discovery interviews before a roadmap existed." },
        { k: "DECISION", t: "Never diagnose. Understand → explain → recommend → support, enforced as a hard constraint." },
        { k: "PRODUCT", t: "A personal health OS: continuity, preparation and coordination across preventive healthcare." },
        { k: "AI", t: "Conversational intake · root-cause mapping · personalized recommendations." },
        { k: "MEASUREMENT", t: "North Star Metric defined; activation, retention and adoption instrumented — and unread, with no live users." },
        { k: "CURRENT STATE", t: "STRATEGY RESET IN PROGRESS — positioning and scope both open. 8 consented practitioners, 0 live users.", alert: true },
        { k: "INTEGRITY", t: "Nothing here is validated with live users. Where evidence doesn't exist, this page says so." }
      ],
      chain: ["RESEARCH", "DISCOVERY", "HYPOTHESIS", "PRODUCT", "AI", "MEASUREMENT", "LEARNING", "STRATEGY RESET"],
      sections: [
        { id: "context", label: "CONTEXT", body: "<p>Aaroh is an AI root-cause health platform I have been building as Founder and Product Manager since May 2026. It sits at the intersection I have worked in for four years: behavioural research, healthcare, and now AI.</p><p>It is the first product where I own the outcome rather than a feature area — which means the strategy mistakes are also mine, and they are on this page.</p>" },
        { id: "problem", label: "PROBLEM", body: "<p>Health advice is delivered as isolated answers. A person gets a recommendation without an explanation of why their situation produced it, and without anything that carries their context forward to the next conversation.</p><p>The product question I set out to answer: can an AI product help someone understand the root cause of what they are experiencing, without ever pretending to be a clinician?</p>" },
        { id: "discovery", label: "DISCOVERY", body: "<p>I ran <b>20+ customer discovery interviews</b> before committing to a roadmap, and translated the findings into a RICE/MoSCoW-prioritized roadmap and an end-to-end product vision.</p><p class='note'><b>Integrity note.</b> The interview synthesis is not published in this portfolio, so no specific finding is quoted here as a statistic. What the interviews produced — a prioritized roadmap and a product vision — is what I can evidence.</p>" },
        { id: "insights", label: "INSIGHTS", tag: "HYPOTHESIS", body: "<p>The insight that changed the product was about authority rather than features: people want to <i>understand</i> their situation, and they want a human professional to remain in charge of it. Those two wants are usually treated as a trade-off. Aaroh treats them as a single requirement.</p>" },
        { id: "hypothesis", label: "HYPOTHESIS", tag: "NOT YET VALIDATED", body: "<p>If an AI product explains the <i>why</i> behind a health recommendation and coordinates continuity between a person and their practitioners, it will earn more trust than a product that offers a confident answer.</p><p>Status: unvalidated. There are zero live users today and 8 consented practitioners across yoga therapy, counselling psychology, nutrition and Ayurveda. Saying otherwise would be the easiest lie on this page.</p>" },
        { id: "vision", label: "PRODUCT VISION", body: "<p>A personal health operating system: information, continuity, preparation, communication and coordination held in one place, across preventive healthcare — combining psychology, yoga therapy, Ayurveda, nutrition, community and AI.</p><p>Explicitly not an AI doctor, therapist or diagnostician.</p>" },
        { id: "ai-opportunity", label: "AI OPPORTUNITY", body: "<p>AI is useful here for the parts that are tedious and human-limited: turning messy self-description into structured intake, mapping contributing factors into a picture a person can read, and keeping context continuous between sessions.</p><p>It is not useful for the part everyone reaches for first — telling someone what they have.</p>" },
        { id: "decisions", label: "PRODUCT DECISIONS", flow: ["UNDERSTAND", "EXPLAIN", "RECOMMEND", "SUPPORT"], body: "<p>The invariant, set early and enforced as a hard constraint. Never diagnose. Never guarantee outcomes. Every product decision is evaluated against whether it moves a person closer to health — defined as dynamic, personal, lifelong and relational, not as the absence of disease or a score.</p>" },
        { id: "prd", label: "PRD", body: "<p>I authored the PRDs and user stories for the core AI features, with acceptance criteria written against the invariant — a story that would require the product to diagnose does not pass review regardless of its user value.</p><p>Prioritization ran on RICE and MoSCoW, the same discipline I used to score 12+ feature requests at Evamastu.</p>" },
        { id: "ai-features", label: "AI FEATURES", body: "<ul><li><b>Conversational intake</b> — turns unstructured self-description into structured, reusable context.</li><li><b>Root-cause mapping</b> — presents contributing factors and their relationships as something explainable, not a verdict.</li><li><b>Personalized recommendations</b> — scoped to support and preparation, always pointing back toward a human practitioner.</li></ul>" },
        { id: "build", label: "BUILD", chips: ["CLAUDE API", "LOVABLE", "CURSOR"], body: "<p>Built and validated the MVP with AI-assisted tooling. The prototype reached 37 screens and 304 interactive elements before I froze it. Freezing it was the right call and it is logged as a decision below — polish had outrun validated demand.</p>" },
        { id: "measurement", label: "MEASUREMENT", body: "<ul><li><b>Activation</b> — did the first session deliver an explanation the person understood?</li><li><b>Retention</b> — did they come back with their own context intact?</li><li><b>Adoption</b> — are the core AI features actually used, or decorative?</li></ul><p class='note'>With zero live users, these are instrumented but unread. Instrumentation without traffic is preparation, not evidence, and I won't present it as evidence.</p>" },
        { id: "current", label: "CURRENT STATE", tag: "IN PROGRESS", body: "<p><b>A strategy reset on positioning and scope is in progress.</b></p><p>The honest reading: the product's ambition — a full personal health operating system — outgrew the evidence behind it. Commercial features are sealed pending legal review of the clinical, regulatory and commercial chapters. There are 8 consented practitioners and no live users.</p><p>The reset is the work right now: narrow the scope to the one job the evidence actually supports, and get it in front of real users. I would rather show a product mid-correction than a tidy story.</p>" }
      ],
      decision_log: [
        { id: "d1", decision: "Never diagnose — understand, explain, recommend, support",
          why: "Preserving professional authority and patient agency is the premise of the product, not a compliance add-on.",
          evidence: "The constitutional definition of health the product is built on, plus the consented practitioner panel across yoga therapy, counselling psychology, nutrition and Ayurveda.",
          tradeoff: "Gives up the most demo-friendly feature in AI health, and some user demand with it.",
          changed: "Intake copy, recommendation phrasing and acceptance criteria are all constrained by it. A user story requiring diagnosis fails review.",
          next: "That explanation quality, not diagnosis, is what drives trust. Untested — it needs live users." },
        { id: "d2", decision: "Seal all commercial features pending legal review",
          why: "The clinical/regulatory boundary and commercial principles are unresolved in writing, and monetizing an unresolved boundary in health is not a risk worth taking.",
          evidence: "The chapters covering clinical boundaries and commercial principles are flagged for a legal and regulatory citation pass before external circulation.",
          tradeoff: "No revenue signal, no willingness-to-pay data, and the milestone that depends on it is gated.",
          changed: "Payments and monetization are disabled in the build rather than hidden behind a flag.",
          next: "Willingness to pay can be probed qualitatively with practitioners before anything is unsealed." },
        { id: "d3", decision: "Freeze the prototype instead of adding screens",
          why: "The build had reached 37 screens and 304 interactive elements while validated demand had not moved.",
          evidence: "Zero live users; 8 consented practitioners. Prototype surface area was outrunning evidence.",
          tradeoff: "A polished prototype sits idle, and the visible progress that comes from shipping screens stops.",
          changed: "Effort moved from building to positioning — which is what produced the strategy reset.",
          next: "A narrower product validated with real users beats a broad prototype nobody has used." },
        { id: "d4", decision: "Run a strategy reset on positioning and scope",
          why: "The scope — a full personal health operating system — outgrew the evidence supporting it.",
          evidence: "Zero live users against a large, frozen prototype and an extensive product definition.",
          tradeoff: "Resets narrative momentum and makes the project harder to describe in one line, for now.",
          changed: "In progress. Positioning and scope are both open.",
          next: "Narrow to the single job-to-be-done the discovery interviews most strongly support, and put that in front of users before building further." }
      ],
      recruiter: [
        "Ran 20+ customer discovery interviews; translated findings into a RICE/MoSCoW-prioritized roadmap and end-to-end product vision.",
        "Authored PRDs and user stories for conversational intake, root-cause mapping, and personalized recommendations.",
        "Built and validated the MVP with Claude API, Lovable and Cursor; defined the North Star Metric and instrumented activation, retention and adoption analytics.",
        "Now running a strategy reset on positioning and scope."
      ]
    },

    {
      id: "careconnect", slug: "careconnect", order: 3, featured: true, tier: "primary",
      name: "CareConnect", subtitle: "Post-Discharge Care Accountability Layer",
      domain: "Healthcare / Product Discovery", role: "Self-directed product build",
      period: "Sep 2026", status: "MVP · NOT IN PRODUCTION", status_tone: "gold",
      evidence: "MVP · NOT IN PRODUCTION",
      /* "Tested" means automated tests. The validation interviews are owed
         work, and the product has never been deployed to real patients.   */
      production_note: "CareConnect is not in production. It is a self-directed MVP: \"tested\" means 65 unit and integration tests and 30 end-to-end journeys — the validation interviews in its plan have not been run yet.",
      headline: "The story here is not the build. It is that I killed my own brief.",
      metrics: [
        { n: "65", l: "unit & integration tests" },
        { n: "30", l: "end-to-end journeys" },
        { n: "13", l: "conclusions graded in the claim register" },
        { n: "0", l: "features added in iteration 2" }
      ],
      pivot: [
        { k: "ORIGINAL HYPOTHESIS", t: "Families discover, evaluate, book and manage home caregivers — a caregiver marketplace. I wrote this brief myself." },
        { k: "DISCOVERY", t: "Research run against my own framing rather than in support of it." },
        { k: "CONTRADICTION", t: "The evidence did not support the marketplace hypothesis.", tone: "hot" },
        { k: "DECISION", t: "Reject the brief and document the rejection as a product decision, not a quiet rewrite.", tone: "hot" },
        { k: "PIVOT", t: "A post-discharge care accountability layer: the care record that stays with the patient, not the agency. Beachhead — the adult child supervising the first 30 days after a parent's discharge.", tone: "hot" },
        { k: "MVP", t: "React · Express · TypeScript · SQLite" },
        { k: "VALIDATION", t: "65 unit and integration tests · 30 end-to-end journeys · a claim register grading all 13 conclusions by evidence strength.", tone: "end" }
      ],
      sections: [
        { id: "brief", label: "THE BRIEF I WROTE, AND WHY I LET IT DIE", body: "<p>CareConnect started as a self-directed product build with one rule attached: if the evidence contradicted the brief, the brief was to be rejected — and the rejection documented as a product decision.</p><p>It was. The marketplace concept did not survive discovery, and the pivot is recorded as a decision record rather than presented as the plan all along.</p>" },
        { id: "claim-register", label: "THE CLAIM REGISTER", body: "<p>The mechanism I am most proud of. Every conclusion the project reached was entered into a register and <b>graded by the strength of the evidence behind it</b> — 13 conclusions in total.</p><p>What it prevents is the ordinary failure of product storytelling: an anecdote hardening into a statistic somewhere between the interview and the deck. If a claim is only an assumption, the register says so, in the artefact itself, where a reader can check it.</p><p>The build also carries a written validation plan with interview guides that have not been run yet — listed as owed work rather than quietly omitted.</p>" },
        { id: "iteration-2", label: "ITERATION 2: SHIPPING NOTHING ON PURPOSE", body: "<p>The second pass added <b>no features at all</b>. It did this instead:</p><ul><li>Challenged over-strong claims in my own documentation.</li><li>Renamed metrics that overstated what the system could prove — \"verified\" care days became \"documented\" care days, because documentation is what the product can evidence.</li><li>Added append-only corrections to care entries, so the record has a history rather than an edit.</li><li>Graded the 13 conclusions and wrote the validation plan for the research still outstanding.</li></ul><p>A feature-count reading of that iteration says nothing happened. A credibility reading says it was the most valuable pass in the project.</p>" },
        { id: "beachhead", label: "BEACHHEAD & SCOPE", body: "<p>Narrowed from \"families managing caregiving\" to a specific person in a specific window: <b>the adult child living away from their parent, supervising the first 30 days after a hospital discharge</b>.</p><p>Everything the product refuses to do follows from that choice.</p>" },
        { id: "differently", label: "WHAT I WOULD DO DIFFERENTLY", body: "<p>Run the interviews the validation plan describes before the second build pass, not after it. The claim register made the gap visible — which is exactly what it is for — but visible is not the same as closed.</p>" }
      ],
      recruiter: [
        "Repositioned from a caregiver marketplace to a post-discharge care accountability layer after discovery contradicted the original hypothesis; documented the pivot as a decision record.",
        "Built a working MVP (React, Express, TypeScript, SQLite) with 65 unit and integration tests, 30 end-to-end journeys, and a claim register grading every conclusion by evidence strength. Not in production."
      ]
    },

    {
      id: "phonepe", slug: "phonepe-smart-spend-coach", order: 7, featured: true, tier: "lab",
      card: "A 40,000-user pilot funnel analysed at 7.14% end to end; the 70% insight-to-action drop-off prioritized, and a 21-day A/B test designed against it — designed, not run.",
      name: "PhonePe Smart Spend Coach", subtitle: "Feature Design & Growth Case",
      domain: "Fintech / Product Analytics", role: "AI-Enabled PM Program · Masai School with IIT Roorkee faculty",
      period: "Aug 2026", status: "CASE STUDY · A/B DESIGNED, NOT RUN", status_tone: "gold",
      status_note: "A programme case study. The 40,000-user pilot funnel was analysed; the A/B test was designed but not run, so there is no A/B result.",
      headline: "A 7.14% funnel is not a conversion problem. It is a map of where value fails to transfer.",
      funnel: [
        { label: "Pilot cohort", width: 100, value: "40,000 users" },
        { label: "Insight → action", width: 30, value: "70% drop-off" },
        { label: "End to end", width: 7.14, value: "7.14%", outside: true }
      ],
      funnel_note: "Three measured figures — the 40,000-user pilot, 7.14% end-to-end conversion, and the 70% insight-to-action drop-off. The bars are drawn to those three numbers and nothing is interpolated between them.",
      sections: [
        { id: "problem", label: "PROBLEM", body: "<p>A spend-coaching feature can surface something true about a person's money and still change nothing about their behaviour. The product question was not \"what should we build\" but \"where does value stop transferring\".</p>" },
        { id: "options", label: "OPTIONS", body: "<p>Five candidate features were put on the table rather than one favourite. Carrying five options into prioritization is what makes the framework meaningful — with one candidate, RICE is decoration.</p>" },
        { id: "prioritization", label: "PRIORITIZATION", body: "<p>All five were scored with <b>RICE</b>. The winner got a full PRD and a <b>5-screen Figma prototype</b>, tested with <b>7 users</b> before any analytics work began — prototype first, so the funnel analysis interpreted a design decision rather than guessing at one.</p>" },
        { id: "evidence", label: "EVIDENCE", body: "<p>The pilot covered <b>40,000 users</b> and converted at <b>7.14% end to end</b>. The instructive number isn't the 7.14% — it's where the loss concentrates.</p><p><b>70% of users dropped between seeing a spending insight and acting on it.</b> The product was successfully telling people something true and failing to convert it into a decision.</p>" },
        { id: "decision", label: "DECISION", body: "<p>Attack the insight-to-action step, not the top of the funnel. An insight-to-action gap is not fixed with more acquisition, more insights or a better model — it is fixed at the moment of delivery: timing, specificity, and whether the next step is small enough to take immediately.</p>" },
        { id: "experiment", label: "EXPERIMENT", tag: "DESIGNED, NOT RUN", body: "<p>A <b>21-day A/B test</b> designed to target that step.</p><p class='note'>The test was designed, not run. There is no A/B result, so none is shown. The case study is the design of the test, not a claimed win.</p>" },
        { id: "guardrails", label: "GUARDRAILS", body: "<p><b>Guardrail metrics defined up front</b>, so a lift in action could not be bought with harm elsewhere. An experiment that can only report its win is not an experiment.</p>" }
      ],
      recruiter: [
        "Scored 5 candidate features with RICE, wrote the PRD for the winner, built a 5-screen Figma prototype tested with 7 users.",
        "Analysed a 40,000-user pilot funnel (7.14% end-to-end), prioritized the 70% insight-to-action drop-off, and designed a 21-day A/B test with guardrail metrics (designed, not run)."
      ]
    },

    {
      id: "ghargyaan", slug: "ghargyaan", order: 5, featured: false, tier: "lab",
      card: "Everyday self-care guidance labelled by evidence strength, with a safety engine covering 21 emergency categories and a 214-case evaluation suite.",
      name: "GharGyaan", subtitle: "Self-care & traditional-knowledge product concept",
      domain: "Healthcare / AI safety", role: "Self-directed product build",
      period: "Sep 2026", status: "CONCEPT · NOT LIVE", status_tone: "gold",
      status_note: "A product concept, not a live product. The safety engine and its evaluation suite are engineering work; there are no users and no real-world outcomes.",
      headline: "Traditional household knowledge, labelled by how strong the evidence behind it actually is — behind a safety engine that runs first.",
      metrics: [
        { n: "21", l: "emergency categories in the safety engine" },
        { n: "214", l: "cases in the evaluation suite" }
      ],
      sections: [
        { id: "concept", label: "WHAT IT IS", tag: "CONCEPT", body: "<p>A self-care and Indian traditional-knowledge product concept. Working name — it may change.</p><p>Two design commitments carried over from Aaroh: <b>evidence labels</b> on every piece of guidance, so a reader can see what is well-supported and what is folk practice, and <b>safety escalation</b> that routes anything serious toward a human professional.</p><p>Explicitly not an AI doctor.</p>" },
        { id: "safety", label: "SAFETY ENGINE", body: "<p>A safety engine covering <b>21 emergency categories</b>, built to route anything serious toward a human professional rather than answer it.</p>" },
        { id: "evaluation", label: "EVALUATION", body: "<p>A <b>214-case evaluation suite</b> behind the safety engine.</p><p class='note'>An evaluation suite says the rules hold against the cases written for them. It is not a real-world outcome: GharGyaan is not live, and there are no users, no adoption and no measured effectiveness.</p>" }
      ],
      recruiter: [
        "Self-care and traditional-knowledge product concept, with evidence labels on guidance and safety escalation toward professionals. Working name.",
        "Safety engine covering 21 emergency categories, with a 214-case evaluation suite. Not live — no users and no measured outcomes."
      ]
    },

    {
      id: "nexus", slug: "nexus", order: 6, featured: false, tier: "lab",
      card: "An evidence-first situation inbox that surfaces conflicts, changes, commitments and missing information across Gmail, Calendar and documents. Not a chatbot.",
      name: "Nexus", subtitle: "Personal Decision & Context Engine",
      domain: "AI / Productivity", role: "Self-directed 0→1 build",
      period: "Sep 2026", status: "MVP · DEMO MODE · NOT LIVE", status_tone: "gold",
      headline: "A situation inbox — not a chatbot, and not a second brain.",
      thin: true,
      link: { label: "github.com/gaurav-product/nexus", url: "https://github.com/gaurav-product/nexus" },
      sections: [
        { id: "concept", label: "WHAT IT IS", body: "<p>An evidence-first system that surfaces four things across Gmail, Google Calendar and uploaded documents: <b>conflicts, changes, commitments and missing information</b>.</p><p>The framing matters as much as the build. It is deliberately <b>not a chatbot and not a second brain</b> — both of those put the burden of asking the right question back on the user. A situation inbox does the noticing.</p>" },
        { id: "state", label: "CURRENT STATE", tag: "IN PROGRESS", body: "<p>MVP runs in <b>demo mode</b>, with no fabricated users and no fabricated results. The repository is public.</p><p class='note'>No adoption, retention or accuracy numbers appear here because none have been measured. Demo mode is a build state, not traction.</p>" }
      ],
      recruiter: [
        "Evidence-first “situation inbox” surfacing conflicts, changes, commitments and missing information across Gmail, Calendar and uploaded documents. Not a chatbot or second brain.",
        "MVP in demo mode; repository public. No adoption or accuracy figures measured yet."
      ]
    }
  ],

  /* ------------------------------------------------------------- lab notes */
  /* status: DRAFT | SCHEDULED | PUBLISHED | ARCHIVED
     Adding a note = appending a record here. The UI derives latest, featured,
     archive, categories, tags and counts automatically.                     */
  lab_notes: [
    {
      id: "ln-001", slug: "ai-health-product-ai-ux", week: "WEEK 01",
      title: "What building an AI health product taught me about AI UX",
      date: "Sep 2026", date_note: "Draft", category: "AI Product",
      tags: ["Aaroh", "AI UX", "Constraints"], reading_time: "4 min",
      related_project: "aaroh", sources: [],
      status: "DRAFT", featured: true, published: false, cover_image: null,
      excerpt: "The most important interface decision in Aaroh was a refusal.",
      content: "<p>Every AI health product faces the same fork in the first week of design: do you let the model name the thing, or not?</p><h4>The constraint</h4><p>Aaroh's answer is written into the product as an invariant — understand, explain, recommend, support, and never diagnose. It is not a disclaimer at the bottom of a screen. It is a rule that decides whether a user story passes review.</p><h4>What that does to the UX</h4><p>Once the product cannot hand over a label, the entire interface has to earn trust another way. Intake stops being a form and becomes a conversation that structures what the person already knows about themselves. The output stops being a verdict and becomes a map of contributing factors a person can read, disagree with, and take to a practitioner.</p><h4>The uncomfortable part</h4><p>This is a worse demo. A product that says \"here is what you likely have\" lands harder in thirty seconds than one that says \"here is what seems to be contributing, and here is who to talk to.\"</p><p>My bet is that the second one survives contact with a real user's second week. That bet is currently unvalidated — Aaroh has no live users — and I would rather say so than dress a design principle up as a proven result.</p>"
    },
    {
      id: "ln-002", slug: "why-i-changed-careconnect-hypothesis", week: "WEEK 02",
      title: "Why I changed the CareConnect hypothesis",
      date: "Sep 2026", date_note: "Draft", category: "Product Strategy",
      tags: ["CareConnect", "Pivots", "Decision records"], reading_time: "3 min",
      status: "DRAFT", featured: true, published: false, cover_image: null,
      excerpt: "I wrote the brief. Discovery contradicted it. Rejecting it was the deliverable.",
      content: "<p>CareConnect began as a caregiver marketplace: families discover, evaluate, book and manage home caregivers. I wrote that brief myself, and I attached a rule to it — if the evidence contradicted it, reject it, and document the rejection as a product decision.</p><h4>What changed</h4><p>Discovery did not support the marketplace framing. The product became a post-discharge care accountability layer: the care record that stays with the patient, not the agency. The beachhead narrowed to one person in one window — the adult child living away, supervising the first 30 days after a parent's discharge.</p><h4>Why the documentation matters more than the pivot</h4><p>Pivots are common. Pivots you can audit are not. The rejection is written as a decision record, and every conclusion the project reached sits in a claim register graded by evidence strength, so a reader can see which parts are proven and which are still assumptions.</p><h4>The rule I took from it</h4><p>A brief is a hypothesis wearing a confident voice. Give it a way to die before you start building, or it will find a way to survive the evidence.</p>"
    },
    {
      id: "ln-003", slug: "what-discovery-interviews-changed-about-aaroh", week: "WEEK 03",
      title: "What discovery interviews changed about Aaroh",
      date: "Sep 2026", date_note: "Draft", category: "Research",
      tags: ["Discovery", "Aaroh", "Evidence"], reading_time: "3 min",
      status: "DRAFT", featured: false, published: false, cover_image: null,
      excerpt: "Twenty-plus conversations, and the biggest change was to what the product refuses to do.",
      content: "<p>I ran 20+ customer discovery interviews for Aaroh before there was a prioritized roadmap. The output was a RICE/MoSCoW-prioritized roadmap and an end-to-end product vision.</p><h4>What I will and won't claim</h4><p>I am not going to quote interview findings as statistics here. The synthesis is not published, and twenty conversations is a qualitative instrument — it tells you what to build next, not what percentage of a market believes something. Turning that into a number is the most common dishonesty in product portfolios.</p><h4>What the interviews actually moved</h4><p>They moved the boundary rather than the feature list. The strongest signal was about authority: people want to understand their situation, and they want a human professional to stay in charge of it. That produced the constraint the product is now built around.</p><h4>What is still owed</h4><p>Validation with live users. There are none yet. The interviews shaped the product's definition; they did not prove the product works, and those are different claims.</p>"
    },
    {
      id: "ln-004", slug: "what-i-learned-from-funnel-analysis", week: "WEEK 04",
      title: "What I learned from product funnel analysis",
      date: "Aug 2026", date_note: "Draft", category: "Product Analytics",
      tags: ["PhonePe", "Funnels", "Experiments"], reading_time: "4 min",
      status: "DRAFT", featured: false, published: false, cover_image: null,
      excerpt: "A 7.14% funnel is not a conversion problem. It is a map of where value fails to transfer.",
      content: "<p>In the PhonePe Smart Spend Coach case, the pilot funnel across 40,000 users converted at 7.14% end to end. The instinct is to attack the biggest number at the top.</p><h4>The step that mattered</h4><p>70% of the loss sat at a single transition: users saw a spending insight and did not act on it. The product was doing the hard technical work — surfacing something true about a person's money — and failing at the easy-sounding part, turning that into a decision.</p><h4>Why that reframes the work</h4><p>An insight-to-action gap is not fixed with more acquisition, more insights, or a better model. It is fixed at the moment of delivery: timing, specificity, and whether the next step is small enough to take immediately.</p><h4>The same pattern elsewhere</h4><p>At Evamastu, a cohort analytics system across 50+ cohorts surfaced two funnel drop-offs. The onboarding redesign that followed lifted consistency 20–25% in six weeks. Same discipline: find the step where value stops transferring, then change that step only.</p><h4>And the guardrails</h4><p>The 21-day A/B test was designed with guardrail metrics from the start. It was designed, not run, so there is no result to report. Any experiment that can only report its win is not an experiment.</p>"
    },
    {
      id: "ln-005", slug: "ai-features-start-with-user-problems", week: "WEEK 05",
      title: "Why AI features should begin with user problems, not models",
      date: "Sep 2026", date_note: "Draft", category: "Healthcare",
      tags: ["AI features", "PRDs", "Boundaries"], reading_time: "3 min",
      status: "DRAFT", featured: false, published: false, cover_image: null,
      excerpt: "The model is the cheapest part of the decision now. The boundary is the expensive part.",
      content: "<p>Building Aaroh's MVP with the Claude API, Lovable and Cursor made something obvious: capability is no longer the constraint. I can put a competent model behind almost any feature in an afternoon.</p><h4>What actually constrains the product</h4><p>The question that costs real thought is the boundary — what should this product automate, and what should stay human? In health, getting that wrong is not a UX problem.</p><h4>How that changes the PRD</h4><p>The AI features in Aaroh — conversational intake, root-cause mapping, personalized recommendations — are each defined by a user problem and then bounded by what the product is not allowed to do. Acceptance criteria are written against the invariant, so a technically achievable feature can still fail review.</p><h4>The test I apply</h4><p>If a feature only makes sense because the model can do it, it is a capability demo. If it makes sense as a description of the user's problem before any model is named, it is a product feature. Only the second kind survives the first real user.</p>"
    }
  ],

  lab_config: {
    subtitle: "A living record of what I'm learning, building and questioning.",
    categories: ["AI Product", "Product Strategy", "Product Analytics", "Healthcare", "Research", "UX", "Building in Public"],
    publishing_note: "All five notes are written but unpublished — they have not appeared anywhere. The queue below is the intended order; no publication dates are committed.",
    open_slots: [{ week: "WEEK 06", label: "Open slot" }]
  },

  /* ----------------------------------------------------------- experiments */
  experiments: [
    { id: "exp-001", num: "001", name: "AI Portfolio Copilot", status: "RUNNING", tone: "jade",
      question: "Can a portfolio answer questions about itself without ever fabricating an answer?",
      method: "A deterministic index over hand-written portfolio facts, wrapped in the interface shape of a real retrieval pipeline: question → intent → evidence → grounded answer → sources.",
      evidence: "Running live in the Ask Gaurav module on this page. Every answer carries its source sections; unmatched questions return a refusal rather than a guess.",
      next: "Replace the response engine with real retrieval over the same portfolio corpus — the interface should not have to change." },
    { id: "exp-002", num: "002", name: "AI-assisted PRD workflow", status: "IN PROGRESS", tone: "gold",
      question: "How much of the distance from discovery notes to a reviewable PRD can AI tooling actually carry?",
      method: "Using the Claude API, Cursor and Lovable on Aaroh's PRDs and user stories, with acceptance criteria written against the product invariant.",
      evidence: "In active use on Aaroh. Not yet written up as a repeatable method, and no measured comparison against writing them unaided.",
      next: "Document the workflow as a repeatable method before claiming anything about its speed or quality." },
    { id: "exp-003", num: "003", name: "Prompt evaluation for product research synthesis", status: "CONCEPT", tone: "dim",
      question: "Does prompt design change the quality of interview synthesis in a way that can be measured, or only in a way that feels better?",
      method: "Planned: fixed interview set, several synthesis prompts, blind comparison against a rubric.",
      evidence: "None. Nothing has been run.",
      next: "Define the rubric first — without it this becomes preference dressed up as evaluation." },
    { id: "exp-004", num: "004", name: "RAG vs generic LLM portfolio answers", status: "CONCEPT", tone: "dim",
      question: "On the same portfolio questions, how much does grounded retrieval reduce fabrication compared with an unconstrained model?",
      method: "Planned: same question set through both, scored for claims that cannot be traced to a source document.",
      evidence: "None. This is the intended successor to Experiment 001.",
      next: "Build the retrieval layer for Experiment 001 first; this experiment needs it to exist." },
    { id: "exp-005", num: "005", name: "AI UX patterns for healthcare products", status: "CONCEPT", tone: "dim",
      question: "Which interface patterns let an AI health product explain without drifting into diagnosis?",
      method: "Planned: catalogue the patterns already used in Aaroh's intake and recommendation flows, then test them against the invariant.",
      evidence: "Drawn from Aaroh's design constraint. Not a formal study, and no user testing behind it.",
      next: "Run it after the strategy reset, once the scope it applies to is settled." }
  ],

  /* ------------------------------------------------------------ experience */
  experience: [
    { id: "ex1", role: "Associate Product Manager", org: "Adhyatm Sadhna Kendra", where: "New Delhi", period: "May 2025 – Apr 2026",
      bullets: [
        "Owned discovery through release for Evamastu, a digital mindfulness platform; wrote the full PRD and shipped a Parent Dashboard, Child Wellness Assessment, and 4 adaptive cognitive games.",
        "Built a cohort analytics system across 50+ participant cohorts; found 2 funnel drop-offs that drove an onboarding redesign, lifting consistency 20–25% in 6 weeks.",
        "Ran Agile sprint planning and backlog grooming; scored 12+ feature requests with RICE and MoSCoW to hold roadmap discipline and cut scope creep."
      ] },
    { id: "ex2", role: "Product Management Intern", org: "Adhyatm Sadhna Kendra", where: "New Delhi", period: "Nov 2024 – Apr 2025",
      bullets: [
        "Supported early discovery for Evamastu; ran parent and facilitator interviews and turned findings into the problem statements behind the first product brief.",
        "Built the initial backlog and competitive scan; wrote user stories and acceptance criteria for the first assessment module."
      ] },
    { id: "ex3", role: "Research Expert, Wellness Team", org: "Live Your Best Life (USA)", where: "Remote", period: "Sep 2022 – Jul 2024",
      bullets: [
        "Conducted 30+ structured user interviews; synthesized behavioral patterns and onboarding drop-offs into recommendations adopted across 3 major feature iterations.",
        "Tracked engagement metrics for 500+ users and delivered weekly insight reports that shaped sprint prioritization."
      ] }
  ],

  /* ------------------------------------------------------------- education */
  education: [
    { id: "ed1", what: "AI-Enabled Product Management Program", org: "Masai School with IIT Roorkee faculty", period: "Dec 2025–Aug 2026", kind: "program" },
    /* Confirmed by Gaurav as the verified entry; replaces an earlier record of
       the institution. Render exactly: MCA — Chaudhary Charan Singh
       University, Meerut (2022–2024).                                        */
    { id: "ed2", what: "MCA", org: "Chaudhary Charan Singh University, Meerut", period: "2022–2024", kind: "degree" },
    { id: "ed3", what: "M.Sc.", org: "S-VYASA University, Bengaluru", period: "2020–2022", kind: "degree" },
    { id: "ed4", what: "B.Sc.", org: "University of Patanjali, Haridwar", period: "2017–2020", kind: "degree" }
  ],

  /* ----------------------------------------------------------- credentials */
  /* The CV groups these under "Certifications". Where the source calls a line
     a learning path or a program rather than a certification, it is listed
     under Courses & learning paths — not upgraded.                          */
  credentials: [
    { id: "cr1", group: "Professional certifications", issuer: "Anthropic",
      items: ["Claude Developer Platform", "Claude Agent Development", "Model Context Protocol (MCP)"] },
    { id: "cr2", group: "Courses & learning paths", issuer: "Anthropic",
      items: ["Claude Code Learning Path"] },
    { id: "cr3", group: "Professional certifications", issuer: "Product & AI",
      items: ["AI in Product Management and Product Strategy — Product School", "Product Analytics — Pendo", "Qualcomm AI Upskilling", "Generative AI Mastermind"] }
  ],

  /* ---------------------------------------------------------------- skills */
  skills: [
    { id: "sk1", group: "PRODUCT", items: ["Discovery", "PRD Writing", "Roadmapping", "MVP Definition", "User Stories", "RICE", "MoSCoW", "Agile", "Sprint Planning"] },
    { id: "sk2", group: "ANALYTICS & RESEARCH", items: ["Funnel Analysis", "Cohort Analysis", "A/B Testing", "North Star Metrics", "KPIs", "User Interviews", "Journey Mapping", "Google Analytics"] },
    { id: "sk3", group: "AI & TOOLS", items: ["Prompt Engineering", "Claude API", "MCP", "Cursor", "Lovable", "Emergent", "Figma", "Jira", "Notion", "Miro", "GitHub", "Excel"] }
  ],

  /* ----------------------------------------------------------- how i think */
  loop: [
    { id: "lp1", k: "OBSERVE", d: "Watch behaviour before forming an opinion. This is the habit the rest of the loop depends on — everything downstream is only as good as what was actually seen.",
      e: [["30+", "structured user interviews at Live Your Best Life"], ["500+", "users tracked for engagement"], ["Parent & facilitator", "interviews for the first Evamastu brief"]] },
    { id: "lp2", k: "FRAME", d: "Turn what I saw into a problem statement someone can disagree with. A framing nobody can argue with is usually too vague to build against.",
      e: [["3", "major feature iterations shaped by the synthesis"], ["1st", "Evamastu product brief built from interview problem statements"]] },
    { id: "lp3", k: "RESEARCH", d: "Go deeper where the framing is weakest, not where it is most comfortable.",
      e: [["20+", "customer discovery interviews on Aaroh before a roadmap existed"]] },
    { id: "lp4", k: "HYPOTHESIZE", d: "Write the hypothesis down so it can be killed. CareConnect's brief was written with an explicit rejection condition attached — and the condition fired.",
      e: [["13", "conclusions graded by evidence strength in the claim register"], ["1", "brief rejected on its own terms"]] },
    { id: "lp5", k: "BUILD", d: "The smallest thing that can be judged. Prototype before instrumenting, so the analysis interprets a decision rather than guessing at one.",
      e: [["5-screen", "Figma prototype tested with 7 users"], ["MVP", "Aaroh, built with Claude API, Lovable and Cursor"], ["65 / 30", "tests and end-to-end journeys on CareConnect"]] },
    { id: "lp6", k: "MEASURE", d: "Instrument before launching, and segment before averaging — an average across cohorts hides the one that is drowning.",
      e: [["50+", "participant cohorts in the Evamastu analytics system"], ["NSM", "North Star Metric plus activation, retention, adoption on Aaroh"]] },
    { id: "lp7", k: "LEARN", d: "Read the step where value stops transferring, not the biggest number on the chart.",
      e: [["70%", "insight-to-action drop-off prioritized on PhonePe"], ["2", "funnel drop-offs found at Evamastu"], ["7.14%", "end-to-end pilot funnel, read for shape not size"]] },
    { id: "lp8", k: "ITERATE", d: "Change one thing, keep the guardrails on, and re-grade what you now believe. Sometimes an iteration ships no features at all.",
      e: [["20–25%", "consistency lift in six weeks after the onboarding redesign"], ["12+", "feature requests scored with RICE and MoSCoW"], ["21-day", "A/B test designed (not run) with guardrail metrics"], ["0", "features added in CareConnect iteration 2"]] }
  ],

  /* Stage-level evidence from Gaurav's own products (the corpus supplies the
     other half). Keyed to the operating-model stage ids in corpus.js.      */
  stage_practice: {
    research:       [["30+", "structured user interviews at Live Your Best Life"],
                     ["20+", "discovery interviews on Aaroh before a roadmap existed"],
                     ["500+", "users tracked for engagement"]],
    problem:        [["1st", "Evamastu product brief written from interview problem statements"],
                     ["Rejected", "CareConnect's own brief, once discovery contradicted it"]],
    insight:        [["3", "feature iterations that adopted the research synthesis"],
                     ["Authority", "the Aaroh insight: explain, but leave the professional in charge"]],
    product:        [["PRD → release", "Evamastu: Parent Dashboard, Wellness Assessment, 4 adaptive games"],
                     ["MVP", "Aaroh, built with Claude API, Lovable and Cursor"],
                     ["65 / 30", "tests and end-to-end journeys on CareConnect"]],
    prioritization: [["12+", "feature requests scored with RICE and MoSCoW at Evamastu"],
                     ["5", "candidate features scored with RICE on the PhonePe case"]],
    experiment:     [["21-day", "A/B test designed with guardrail metrics"],
                     ["5-screen", "Figma prototype tested with 7 users before instrumenting"]],
    metrics:        [["50+", "participant cohorts in the Evamastu analytics system"],
                     ["20–25%", "consistency lift in six weeks after the onboarding redesign"],
                     ["7.14% / 70%", "end-to-end funnel, and the insight-to-action drop-off inside it"]],
    decision:       [["13", "conclusions graded by evidence strength in CareConnect's claim register"],
                     ["Never diagnose", "Aaroh's invariant — the boundary set before the demand arrived"],
                     ["0", "features added in CareConnect iteration 2"]]
  },

  principles: [
    ["Evidence over assumptions", "Every conclusion gets graded by the strength of the evidence behind it — 13 of them in CareConnect's claim register."],
    ["User problems before features", "A feature that only makes sense because the technology can do it is a capability demo, not a product decision."],
    ["Explicit hypotheses", "Written down, with a way to be proven wrong. A brief with no rejection condition will always survive the evidence."],
    ["Measurable outcomes", "Consistency lifted 20–25% in six weeks is a result. \"Users love it\" is a feeling."],
    ["Prioritization with constraints", "RICE and MoSCoW against real engineering capacity — 12+ feature requests scored at Evamastu to hold the roadmap."],
    ["Continuous learning", "An AI-enabled PM programme run alongside the job, and Anthropic credentials on the platform I build with."],
    ["Responsible AI", "Aaroh's hard constraint: understand, explain, recommend, support. Never diagnose, never guarantee outcomes."]
  ],

  /* -------------------------------------------- ask gaurav: knowledge base */
  /* Deterministic retrieval corpus — not a live model. Every answer is four
     parts, always in this order: Gaurav's ROLE, the WORK (the product decision
     or what he did), the EVIDENCE, and the current STATUS. Each part restates
     facts already on this page; the engine never composes a new claim.
     `suggested: true` puts the question in the prompt list.                 */
  copilot_kb: [
    { id: "kb-ai-products", suggested: true, q: "What AI products has Gaurav built?",
      keys: ["ai product", "ai products", "built", "build", "builds", "what has he made", "products has", "aaroh", "ghargyaan", "nexus"],
      role: "Founder & Product Manager on Aaroh; self-directed builder on GharGyaan and Nexus.",
      work: "<ul><li><b>Aaroh</b> — an AI-enabled health product: PRDs and user stories for conversational intake, root-cause mapping and personalized recommendations; MVP built with the Claude API, Lovable and Cursor.</li><li><b>GharGyaan</b> — a self-care and traditional-knowledge product concept with a safety engine in front of it.</li><li><b>Nexus</b> — an evidence-first “situation inbox” across Gmail, Calendar and uploaded documents. Not a chatbot.</li></ul>",
      evidence: "Aaroh: 20+ discovery interviews and 8 consented practitioners. GharGyaan: a safety engine covering 21 emergency categories and a 214-case evaluation suite. Nexus: a public repository at github.com/gaurav-product/nexus.",
      status: "None of these is a live product with users. Aaroh: in progress, strategy reset, zero live users. GharGyaan: concept, not live. Nexus: MVP in demo mode, not live.",
      sources: [["Aaroh", "aaroh"], ["GharGyaan", "ghargyaan"], ["Nexus", "nexus"]] },

    { id: "kb-safety", suggested: true, q: "How does Gaurav approach AI safety?",
      keys: ["safety", "safe", "diagnose", "diagnosis", "diagnostic", "boundary", "harm", "risk", "responsible", "guardrail", "clinical"],
      role: "The product owner who sets the boundary — on Aaroh as Founder & PM, on GharGyaan as builder.",
      work: "<p>He decides the boundary before the demand arrives, and makes it testable. Aaroh's invariant is <b>understand → explain → recommend → support — never diagnose, never guarantee outcomes</b>; a user story that would require diagnosis fails review regardless of its user value. GharGyaan puts a safety engine ahead of everything else and routes anything serious to a human professional.</p>",
      evidence: "Aaroh: acceptance criteria written against the invariant, commercial features sealed pending legal review, and 8 consented practitioners across yoga therapy, counselling psychology, nutrition and Ayurveda. GharGyaan: 21 emergency categories and a 214-case evaluation suite. This copilot itself refuses any question it has no documented answer for.",
      status: "The boundaries are designed and, for GharGyaan, evaluated against written cases. None is validated with live users: Aaroh has zero live users and GharGyaan is not live.",
      sources: [["Aaroh", "aaroh"], ["GharGyaan", "ghargyaan"]] },

    { id: "kb-different", suggested: true, q: "What makes him different from a generic PM?",
      keys: ["different", "background", "unique", "why you", "why him", "generic", "stand out", "behaviour", "behavior", "live your best life", "research expert", "wellness"],
      role: "A product person who came in through behavioural research in healthcare, not engineering or consulting.",
      work: "<p>He researches before he builds and labels what he can't prove. Two years of structured user research at Live Your Best Life came before product ownership at Evamastu; on CareConnect he rejected his own brief when discovery contradicted it.</p>",
      evidence: "An M.Sc. (S-VYASA University) and B.Sc. (University of Patanjali), then an MCA. 30+ structured interviews and 500+ users tracked at Live Your Best Life; PRD through release at Evamastu; a claim register grading 13 conclusions by evidence strength on CareConnect; CareConnect's iteration 2 added no new features — it tightened claims instead.",
      status: "Background and record are complete as listed. The healthcare AI work (Aaroh, GharGyaan) is not yet validated with live users.",
      sources: [["Live Your Best Life", "live-your-best-life"], ["Evamastu", "evamastu"], ["CareConnect", "careconnect"], ["Education", "education"]] },

    { id: "kb-program", suggested: true, q: "Tell me about his IIT Roorkee product-management program.",
      keys: ["iit", "roorkee", "masai", "program", "programme", "course", "certification", "education", "ai-enabled"],
      role: "Participant in the AI-Enabled Product Management Program — Masai School with IIT Roorkee faculty.",
      work: "<p>A formal AI product-management programme run alongside his job, Dec 2025–Aug 2026. The PhonePe Smart Spend Coach case study was produced in it.</p>",
      evidence: "Listed under Education. The PhonePe case: 5 candidate features scored with RICE, a 5-screen Figma prototype tested with 7 users, and a 40,000-user pilot funnel converting at 7.14% end to end.",
      status: "Completed in August 2026. It is a programme taught by Masai School with IIT Roorkee faculty — not an IIT Roorkee degree.",
      sources: [["Education", "education"], ["PhonePe case", "phonepe"]] },

    { id: "kb-end-to-end", suggested: true, q: "What can Gaurav own end to end?",
      keys: ["end to end", "end-to-end", "own", "owns", "ownership", "responsible", "responsibility", "prd", "discovery to", "release", "deliver", "delivery", "evamastu", "mindfulness"],
      role: "Associate Product Manager on Evamastu, owning discovery through release.",
      work: "<p>Discovery interviews, the problem statements and the full PRD; delivery of a Parent Dashboard, a Child Wellness Assessment and 4 adaptive cognitive games; sprint planning and backlog grooming; and the cohort analytics that showed where onboarding was losing people.</p>",
      evidence: "A cohort analytics system across 50+ participant cohorts found 2 funnel drop-offs; the onboarding redesign that followed supported a 20–25% lift in consistency over six weeks. 12+ feature requests scored with RICE and MoSCoW.",
      status: "Shipped during his role at Adhyatm Sadhna Kendra (May 2025 – Apr 2026). Its current availability is not documented here.",
      sources: [["Evamastu", "evamastu"], ["Experience", "experience"]] },

    { id: "kb-status", suggested: true, q: "Which projects are live, in progress, or not in production?",
      keys: ["live", "in progress", "production", "status", "shipped", "which projects", "launched", "state", "not in production"],
      role: "Varies by project: Associate Product Manager (Evamastu), Research Expert (Live Your Best Life), Founder & Product Manager (Aaroh), self-directed builder (CareConnect, GharGyaan, Nexus), and programme case study (PhonePe).",
      work: "<ul><li><b>Evamastu</b> — shipped during his role (current availability not documented).</li><li><b>Live Your Best Life</b> — a research role, Sep 2022 – Jul 2024.</li><li><b>CareConnect</b> — MVP · NOT IN PRODUCTION.</li><li><b>Aaroh</b> — in progress; strategy reset; zero live users.</li><li><b>GharGyaan</b> — concept; not live.</li><li><b>Nexus</b> — MVP in demo mode; not live.</li><li><b>PhonePe Smart Spend Coach</b> — case study; A/B test designed, not run.</li><li><b>This copilot</b> — running on this page, answering from a fixed index.</li></ul>",
      evidence: "Each status is the one shown on that project's card in Selected Work and the AI & Product Lab.",
      status: "Only Evamastu shipped. Nothing else here is live or in production.",
      sources: [["Selected work", "work"], ["AI & Product Lab", "product-lab"]] },

    { id: "kb-discovery", q: "How does Gaurav approach product discovery?",
      keys: ["discovery", "research", "interview", "interviews", "approach", "process", "validate", "user research"],
      role: "Researcher first, product owner second.",
      work: "<p>Interviews before roadmaps; findings turned into artefacts a team can argue with (problem statements, a prioritized roadmap); conclusions graded before they are trusted.</p>",
      evidence: "30+ structured interviews at Live Your Best Life; parent and facilitator interviews that became the first Evamastu brief; 20+ discovery interviews on Aaroh before a roadmap existed; 13 conclusions graded in CareConnect's claim register, where discovery overturned his own brief.",
      status: "Documented across his record. Aaroh's interview synthesis is not published, so no finding from it is quoted as a statistic.",
      sources: [["Live Your Best Life", "live-your-best-life"], ["Aaroh", "aaroh"], ["CareConnect", "careconnect"]] },

    { id: "kb-careconnect", q: "What did Gaurav learn from CareConnect?",
      keys: ["careconnect", "pivot", "caregiver", "marketplace", "claim register", "discharge"],
      role: "Self-directed product build.",
      work: "<p>He wrote a caregiver-marketplace brief with a rule attached — if the evidence contradicted it, reject it — and the rule fired. He reframed the product as a post-discharge care accountability layer for the adult child supervising the first 30 days after a parent's discharge, and documented the pivot as a decision record.</p>",
      evidence: "An MVP (React, Express, TypeScript, SQLite) with 65 unit/integration tests and 30 end-to-end journeys; a claim register grading all 13 conclusions by evidence strength; iteration 2 added no features and renamed metrics that overstated what the system could prove.",
      status: "MVP · NOT IN PRODUCTION. The validation interviews in its plan have not been run yet.",
      sources: [["CareConnect", "careconnect"]] },

    { id: "kb-analytics", q: "Show me an example of analytical thinking.",
      keys: ["analytics", "analytical", "analysis", "funnel", "data", "metric", "metrics", "number", "phonepe", "spend", "cohort", "experiment", "a/b"],
      role: "Product analyst on the PhonePe Smart Spend Coach case (AI-Enabled PM Program), and APM on Evamastu.",
      work: "<p>On PhonePe he prioritized the step where value stopped transferring — the 70% drop between seeing a spending insight and acting on it — rather than the top of the funnel, and designed a 21-day A/B test with guardrail metrics against it.</p>",
      evidence: "A 40,000-user pilot funnel converting at 7.14% end to end; 5 candidate features scored with RICE; a 5-screen Figma prototype tested with 7 users. On Evamastu, cohort analysis across 50+ cohorts found 2 drop-offs and supported a 20–25% consistency lift over six weeks.",
      status: "PhonePe is a case study: the A/B test was designed, not run, so there is no A/B result. Evamastu's analysis is from his shipped work.",
      sources: [["PhonePe case", "phonepe"], ["Evamastu", "evamastu"]] },

    { id: "kb-corpus", q: "Tell me about the 90-day case study challenge.",
      /* Figures are {{tokens}} resolved from the generated corpus at render time —
         never typed in here, so they cannot drift from the repository. */
      keys: ["90 day", "90-day", "challenge", "case study", "case studies", "study", "studies", "corpus", "repository", "repo"],
      role: "Author of a 90-day product case-study series, one study per day.",
      work: "<p>{{directories}} case-study directories, Day 01 to Day 90, in one public repository. Assumptions became a separate file from Day 28; programmatic verification appears from Day 57.</p>",
      evidence: "<b>{{written}}</b> written studies, <b>{{empty}}</b> empty; about <b>{{words_m}} million words</b> and <b>{{sources}} references</b>; <b>{{assumption_files}}</b> studies with an ASSUMPTIONS file; <b>{{verified}}</b> at the VERIFIED evidence level. One anomaly stays visible: the Day 74 and Day 75 directories hold studies that number themselves the other way round.",
      status: "Complete and public. These are research case studies about other companies' products — not products he built.",
      sources: [["90-day corpus", "constellation"], ["Product Atlas", "atlas"]] },

    { id: "kb-day90", q: "What is Day 90 about?",
      keys: ["day 90", "final case", "last case", "chatgpt health", "day ninety"],
      role: "Author of the closing case study in the 90-day series.",
      work: "<p><b>Day 90 — Health in ChatGPT: What Happens When Nothing Compels.</b> It asks what evidence exists when no regulator requires any.</p>",
      evidence: "Zero regimes compelling clinical evidence; 21,033 peer-reviewed papers on LLMs and health, 220 tagged as randomised controlled trials (1.05%); of ten RCTs read in full, five involved no language model and none measured a patient health outcome; 180 programmatic checks behind the figures.",
      status: "Published in the case-study repository. It tested no model and asserts no accuracy figure for any system.",
      sources: [["90-day corpus", "constellation"], ["Product Atlas", "atlas"]] }
  ],

  copilot_config: {
    subtitle: "Ask about my work. Every answer gives my role, the work, the evidence and the current status — from my CV and product records only.",
    placeholder: "Ask about a project, a role or a decision…",
    trace: ["QUESTION", "MATCH", "EVIDENCE", "ANSWER", "SOURCES"],
    badge: "ANSWERS FROM DOCUMENTED RECORDS · NO LIVE MODEL",
    greeting: "<p>Hi — this answers from a fixed index of my CV and product records, not a live AI model. Pick a question or type your own. If something isn't documented, it will say so rather than guess.</p>",
    /* Questions asking for figures this portfolio does not have. Checked
       BEFORE topic matching, so "revenue at Aaroh" refuses rather than
       returning the general Aaroh answer and appearing to dodge.          */
    no_evidence_terms: ["revenue", "arr", "mrr", "salary", "ctc", "compensation", "profit", "monetiz",
                        "how many users", "user count", "active users", "dau", "mau", "traction",
                        "churn", "ltv", "cac", "valuation", "funding", "raised", "investor",
                        "test result", "a/b result", "conversion lift", "roi", "how much money", "net worth", "package"],
    no_evidence_reply: "<p><b>That isn't documented.</b> It asks for a figure my records don't contain, and I won't estimate one.</p><p>For the record: Aaroh has zero live users and no revenue; GharGyaan is not live; Nexus has no measured outcomes; and the PhonePe A/B test was designed but not run, so it has no result.</p>",
    refusal: "<p><b>That isn't documented in my CV or product records</b>, so I won't infer an answer.</p><p>I can answer questions about the AI products I've built, my approach to AI safety, what I can own end to end, my programme with IIT Roorkee faculty, and which projects are live, in progress or not in production. Or email me at <a href=\"mailto:gauravkumarsingh773@gmail.com\">gauravkumarsingh773@gmail.com</a>.</p>",
    explainer: "No language model is connected to this page. Your question is matched against a hand-written index of documented facts and answered from stored text, so nothing can be invented — and if the index has no answer, it says so."
  },

  /* ------------------------------------------------------------ challenges */
  challenges: [
    { id: "ch1", num: "01", tag: "RETENTION · HEALTH PRODUCT",
      scenario: "A health product has strong acquisition but poor retention. You have limited engineering capacity.",
      ask: "What would you investigate or decide first?",
      options: ["Ship a push-notification streak system to pull users back",
                "Find where in the first session users stop, and who they were",
                "Run a pricing experiment — low intent usually means low commitment",
                "Add more content so there is a reason to return"],
      approach: [
        ["FRAME", "Retention is an outcome, not a problem. The real question is which behaviour failed to form, and when — and with limited engineering I need a diagnosis before I spend a sprint."],
        ["EVIDENCE", "Exhaust the instrumentation I already have — activation, retention, adoption — and segment before averaging. At Evamastu the unit was the participant cohort, 50+ of them, because an average across cohorts hides the one that is drowning."],
        ["DECISION", "Fix the single step where value stops transferring rather than bolt on a re-engagement mechanic. On the PhonePe case that step was insight-to-action, where <b>70%</b> of users saw the value and did nothing with it."],
        ["TRADE-OFF", "Slower than shipping notifications, and nothing visible ships in week one. I'm spending the first week on diagnosis rather than output."],
        ["GUARDRAIL", "One change, one cohort, a fixed window — and watch what the fix could break: notification fatigue, opt-outs, support load. The PhonePe A/B test was designed for <b>21 days with guardrail metrics</b> for exactly this reason — designed, not run."],
        ["NEXT QUESTION", "Did the first session actually deliver a felt outcome, or did we just make returning easier? At Evamastu the answer showed up as a <b>20–25% lift in consistency in six weeks</b>, not as more sessions."]
      ] },
    { id: "ch2", num: "02", tag: "AI SCOPE · CLINICAL BOUNDARY",
      scenario: "Your AI health product could tell users what condition they likely have. Users are asking for it. Clinicians on your panel are uneasy.",
      ask: "What would you decide first?",
      options: ["Ship it with a disclaimer — users are explicitly asking for it",
                "Ship it to a small cohort and measure satisfaction",
                "Set the boundary as a product invariant before the demand grows",
                "Delay the decision until there is more usage data"],
      approach: [
        ["FRAME", "This is a boundary decision, not a feature decision. Boundaries decided under demand pressure are decided badly, so they get set once, in writing, before the demand arrives."],
        ["EVIDENCE", "The practitioner panel is the evidence. Aaroh is built with <b>8 consented practitioners</b> across yoga therapy, counselling psychology, nutrition and Ayurveda, and clinical unease from that panel outranks feature demand from users."],
        ["DECISION", "Aaroh's invariant: <b>understand → explain → recommend → support. Never diagnose, never guarantee outcomes.</b> A hard constraint, not a guideline — a user story requiring diagnosis fails review regardless of its user value."],
        ["TRADE-OFF", "It costs the single most demo-friendly feature in AI health, and some users will leave for a product that hands them a label."],
        ["GUARDRAIL", "Acceptance criteria written against the invariant, and commercial features sealed until the clinical, regulatory and commercial chapters clear legal review."],
        ["NEXT QUESTION", "Is explanation quality — not diagnosis — what actually builds trust? That is the version worth testing, and it is currently untested: Aaroh has no live users."]
      ] },
    { id: "ch3", num: "03", tag: "EVIDENCE · SELF-CORRECTION",
      scenario: "Two weeks into a build, discovery evidence contradicts the hypothesis the whole project was scoped around. The ship date is fixed.",
      ask: "What would you decide first?",
      options: ["Ship the original scope — the date is a commitment, learnings can come after",
                "Stop, reposition the product, and document the contradiction as a decision",
                "Keep the build and reframe the messaging around the new evidence",
                "Split the difference and build both directions"],
      approach: [
        ["FRAME", "A fixed date protects delivery, not value. If the hypothesis is dead, shipping it on time only makes the wrong thing arrive punctually."],
        ["EVIDENCE", "Grade it before acting. On CareConnect every conclusion went into a claim register scored by evidence strength — <b>13 graded conclusions</b> — so a pivot rests on strong evidence rather than one loud interview."],
        ["DECISION", "Reposition, and write the contradiction up as a decision record. I have done exactly this: CareConnect went from a caregiver marketplace to a post-discharge care accountability layer, narrowed to one person in one window — the adult child supervising the first 30 days after a parent's discharge."],
        ["TRADE-OFF", "The original scope and the date both go, and the project becomes harder to describe in one line for a while."],
        ["GUARDRAIL", "Validation infrastructure travels with the pivot — <b>65 unit and integration tests, 30 end-to-end journeys</b>, and a written validation plan for the interviews still owed. Iteration 2 then added <b>no features at all</b>, only tighter claims."],
        ["NEXT QUESTION", "Which of those 13 conclusions still rest on assumption rather than evidence — and what is the cheapest way to close the strongest one?"]
      ] }
  ],

  /* ------------------------------------------------------------ intro film */
  /* The production film. `video` and `poster` are the only places the asset
     is named; the player reads them and nothing else does. To replace the
     film, drop a new MP4 into media/ and change the path here.            */
  intro: {
    enabled: true,
    video: "media/gaurav-os-intro.mp4",
    poster: "media/gaurav-os-poster.jpg",
    duration: 65,
    duration_note: "65s",
    skip_label: "SKIP INTRO",
    reducedMotionFallback: "poster",
    mobileFallback: "poster",
    /* the beats of the film, recorded so the page can caption it */
    storyboard: ["PERSON", "THINKING", "PRODUCT INTELLIGENCE", "PRODUCT LAB",
                 "90-DAY CONSTELLATION", "HUMAN IDENTITY", "GAURAV.OS"],
    continues_into: "constellation"
  },

  /* ----------------------------------------------------------------- media */
  /* Nothing is hard-coded into a page. Records here are referenced by id. */
  media: [
    { media_id: "m-intro", filename: "gaurav-os-intro.mp4", type: "video",
      path: "media/gaurav-os-intro.mp4", url: null,
      alt_text: "GAURAV.OS introduction film",
      caption: "Produced externally in Google Flow from Gaurav's own photograph.",
      spec: "1920x1080 · H.264 High + AAC · 65s · faststart",
      created_at: "2026-09-30", used_by: ["intro"], status: "LIVE" },
    { media_id: "m-intro-poster", filename: "gaurav-os-poster.jpg", type: "image",
      path: "media/gaurav-os-poster.jpg", url: null,
      alt_text: "Final frame of the GAURAV.OS introduction film",
      caption: "Poster frame, reduced-motion still, and Open Graph image.",
      spec: "1600x900 JPEG",
      created_at: "2026-09-30", used_by: ["intro", "og:image"], status: "LIVE" }
  ],

  /* ------------------------------------------------- analytics event names
     The canonical names, as they reach the data layer. Call sites may use
     older names; app.js maps those onto these. Event names and a timestamp
     only — no identifiers, no personal data, no third-party beacons.      */
  analytics_events: [
    "portfolio_view",
    "intro_started", "intro_completed", "intro_skipped", "intro_replayed", "intro_failed",
    "project_opened", "study_opened", "corpus_opened",
    "copilot_question", "challenge_started", "challenge_completed",
    "lab_note_opened", "recruiter_mode_opened"
  ]
};
