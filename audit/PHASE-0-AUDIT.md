# GAURAV.OS — Healthcare Edition · Phase 0 Audit

Audit date: 2 November 2026. Read-only. No existing file was changed to produce it.

---

## 0. Headline finding — there are four versions of this portfolio

The brief treats `gaurav-os.lovable.app` and `gaurav-product/portfolio` as the same thing.
They are not.

| # | Lineage | Stack | Last change | Notes |
|---|---|---|---|---|
| A | `portfolio` → `main` | Vanilla JS, no build step, GitHub Pages from `/docs` | 6 Oct 2026 | Audited in full below. 156/156 tests pass. |
| B | `portfolio` → `claude/bold-ptolemy-tc1khf` | Vanilla JS | 29 Oct | Recruiter-first rebuild, phone removed, Lovable set as production URL, CV PDF. Unmerged. |
| C | `portfolio` → `claude/ai-product-portfolio-redesign` → `claude/gaurav-os-ai-product-system` | Vanilla JS, multi-page (`/work/`, `/lab/`, `/research/`) | 30 Oct | Stacked on B. Adds Evamastu and LYBL as project records and `tier` field. Unmerged. |
| D | Lovable project "Gaurav OS" (`7e8dfe68…`) — **this is gaurav-os.lovable.app** | TanStack Start, React 19, Tailwind 4, shadcn/ui, Vite 8 | 30 Oct | `src/data/content.ts` is labelled a "verbatim copy" of `site/content.js`, with owner overrides. **Not connected to any repository this session can reach.** |

The live site is D. The repository's `main` is A. Their content has diverged on facts, not only on
layout (see §4). Phase 1 cannot start until one of them is named the source of truth.

---

## 1. Existing architecture

### A — `main` (this repository)

```
site/                     source
├── index.html            shell: CSS tokens + empty mount points, no <html>/<head> (artifact fragment)
├── content.js            window.GOS_CONTENT — every hand-written word (658 lines)
├── corpus.js             window.GOS_CORPUS — GENERATED from product-management-case-studies
├── app.js                hero, orbit, work, thinking, ask, challenge, lab, about, contact, recruiter, search, intro
├── corpus-ui.js          constellation (canvas), atlas, evolution, operating model, capability graph
├── media/README.md       asset documentation (binaries live in docs/media)
└── scripts/
    ├── build_site.py     wraps fragment → docs/index.html, copies runtime + media
    ├── extract.py        walks case-study repo → corpus.json
    ├── build_corpus.py   aggregates + validates → corpus.js
    └── verify.py         Playwright suite (Python), 156 checks
docs/                     committed build output served by GitHub Pages
└── media/                gaurav-os-intro.mp4 (11.4 MiB, 1920×1080, 65.2 s), gaurav-os-poster.jpg
```

- Layering: **content → data model → application → UI**. Content edits touch `content.js` only.
- Design tokens: ink `#080A0C`, gold `#D2A63C`, jade `#4F9077`; Instrument Serif / IBM Plex Sans / IBM Plex Mono; a light theme used by Recruiter Mode.
- Breakpoints tested: 1440 / 1280 / 1024 / 768 / 390 / 360.
- Analytics: event names + timestamp only, no third parties (`content.js → analytics_events`).
- No `package.json`, no bundler, no TypeScript, no framework.

### D — Lovable (production)

- `src/routes/index.tsx` — one long page; sections rendered from `content.navigation`; corpus views `React.lazy`-loaded.
- `src/components/os/` — Hero, IntroFilm, ProductOrbit, Rail, **RoboGuide**, SearchDialog, Section.
- `src/components/sections/` — About, AskGaurav, Challenge, Contact, FeaturedWork, HowIThink, LabNotes, RecruiterView.
- `src/components/corpus/` — Atlas, Constellation, Evolution, StudyDetail, EvidencePill.
- `src/data/` — `content.ts`, `corpus.ts`, `ask-corpus.ts`. `src/lib/` — `ask.ts` (refuse-before-match), `public-profile.ts` (allowlisted public projection), `cv-pdf.ts` (pdf-lib), `sitemap.ts`.
- Server routes: `/cv.html`, `/media/gaurav-kumar-singh-cv.pdf`, `/media/gaurav-os-poster.jpg`, `/sitemap.xml`.
- Tests: `ask-recruiter.test.js`, `public-profile.test.js` (roadmap reports 13 passing).
- Assets referenced: `gaurav-os-intro.mp4`, `gaurav-os-intro-v2.mp4`, `gaurav-os-poster.jpg`, `gaurav-os-poster-v2.jpg` (Lovable asset-system pointers).

---

## 2. Complete content inventory (lineage A unless noted)

### Identity — `site_config`
Name, role ("AI Product Manager"), discipline, tagline, positioning, location (New Delhi), version v4.0,
opportunity block (label, line, detail, 6 role chips), 3-line summary, contact (email, **phone**, LinkedIn,
GitHub, resume `file: null`), current-focus (4 tiles), Product Orbit (5 domains + 3 loop stages),
product question.

### Navigation (11)
Home · Constellation · Product Atlas · Evolution · Featured Work · How I Think · Ask Gaurav · Challenge ·
Lab Notes · About · Contact. Plus Recruiter Mode toggle and `/` search.

### Journey (9 stops)
B.Sc. Patanjali (2017–20) → M.Sc. S-VYASA (2020–22) → Research Expert, LYBL (Sep 22–Jul 24) → MCA (2022–24)
→ PM Intern, Adhyatm Sadhna Kendra (Nov 24–Apr 25) → APM, same (May 25–Apr 26) → AI-Enabled PM, Masai × IIT
Roorkee faculty (Dec 25–Aug 26) → Aaroh (May 26–) → four portfolio builds (Aug–Sep 26).

### Projects (5)
| Project | Status | Evidence carried |
|---|---|---|
| **Aaroh** — AI root-cause health platform | IN PROGRESS · strategy reset | 20+ discovery interviews; 37 screens / 304 elements, frozen; 8 consented practitioners; **0 live users**; 13 sections; 4-entry decision log; "never diagnose" invariant |
| **CareConnect** — post-discharge care accountability | COMPLETED (MVP) | Brief rejected by own discovery; 65 unit/integration tests; 30 E2E journeys; 13 graded conclusions; iteration 2 = 0 features |
| **PhonePe Smart Spend Coach** — Masai × IIT Roorkee case | COMPLETED (case) | 5 features RICE-scored; 5-screen Figma prototype, 7 users; 40,000-user pilot; 7.14% end-to-end; 70% insight→action drop; 21-day A/B **designed, no results** |
| **GharGyaan** — self-care PWA | IN PROGRESS (thin) | Concept, evidence labels, safety escalation. No users, no outcomes |
| **Nexus** — situation inbox | IN PROGRESS (thin) | MVP in demo mode; public repo `gaurav-product/nexus` |

Not a project record on `main`: **Evamastu** (exists in experience/journey/research only).

### Experience (3)
APM, Adhyatm Sadhna Kendra (May 25–Apr 26) · PM Intern, same (Nov 24–Apr 25) · Research Expert, LYBL (Sep 22–Jul 24).
Evidenced figures: 50+ cohorts, 2 drop-offs, 20–25% consistency lift in 6 weeks, 12+ requests RICE/MoSCoW,
30+ interviews, 500+ users tracked, 3 feature iterations.

### Education (4)
AI-Enabled PM Program (Masai School & IIT Roorkee faculty) · MCA · M.Sc. S-VYASA · B.Sc. Patanjali.

### Credentials (3 groups)
Anthropic certifications: Claude Developer Platform, Claude Agent Development, MCP ·
Anthropic learning path: Claude Code ·
Product & AI: Product School (AI in PM & Strategy), Pendo Product Analytics, Qualcomm AI Upskilling, Generative AI Mastermind.

### Skills (3 groups, 29 items)
Product (9) · Analytics & Research (8) · AI & Tools (12).

### Research record
LYBL: 4 metrics, "produced", "now", integrity note.

### Method
Operating loop (8 stages with evidence) · `stage_practice` (8 stages) · 7 principles.

### Interactive content
- **Ask Gaurav**: 10 KB entries, no-evidence term list checked before topic match, refusal copy, `{{token}}` figures resolved from corpus, "SIMULATED · NO LIVE MODEL" badge.
- **Challenge**: 3 scenarios × 4 options × 6-step reasoning.
- **Lab Notes**: 5 notes, all `DRAFT`, unpublished; 7 categories; 1 open slot.
- **Experiments**: 5 (1 running, 1 in progress, 3 concept).

### 90-day corpus (generated, audited 29 Sep 2026)
90 directories · 90 written · 0 empty · 1,110,202 words · 1,389 references · 63 ASSUMPTIONS files ·
evidence levels VERIFIED 33 / DOCUMENTED 28 / SOURCED 23 / NARRATIVE 6 · categories (derived) Healthcare 24,
Consumer 22, Marketplace 11, AI 11, Fintech 8, SaaS 7, B2B 6, Analytics 1 · 8 operating stages · 13 capabilities ·
5 day-number mismatches (Days 8, 10, 11, 74, 75) · index contradictions surfaced · 32 studies with check counts.
Every study links to `gaurav-product/product-management-case-studies`.

### Media
`gaurav-os-intro.mp4` (Google Flow, from Gaurav's own photograph; H.264/AAC; 65 s) · `gaurav-os-poster.jpg` (1600×900).
Storyboard: PERSON → THINKING → PRODUCT INTELLIGENCE → PRODUCT LAB → 90-DAY CONSTELLATION → HUMAN IDENTITY → GAURAV.OS.

### Related public repositories
`product-management-case-studies`, `nexus`, `ghargyaan`, `careconnect`, `phonepe-smart-spend-coach-capstone`, `aaroh`, `rupee-radar`.
Only `nexus` and the case-study repo are linked from the portfolio today.

---

## 3. Existing features to preserve

1. Intro film — first-visit autoplay, muted, skippable immediately, sound toggle remembered, focus trapped in overlay, `contain` on narrow screens, poster under reduced motion, replay from hero, failure path.
2. Product Orbit — content-driven, explains itself, compact layout on small screens.
3. Constellation (canvas), Product Atlas (search + sector/day/completeness filters), Evolution charts, operating model, capability graph, study panel with day-by-day + arrow-key navigation.
4. Featured Work case panels with exec summary, pivot flow, funnel, decision log.
5. Ask Gaurav — refuse-before-match, sources on every answer, corpus figures never hand-typed.
6. Challenge Gaurav — reasoning revealed only after committing.
7. Lab Notes — reader, categories, derived counts.
8. About / Journey / Research / Credentials / Skills.
9. Recruiter Mode — fast single view, light theme.
10. Global search (`/`), mobile rail, scrollspy, keyboard navigation, skip-free focus order.
11. **Evidence system** — status labels (CONCEPT, HYPOTHESIS, DRAFT, IN PROGRESS, NOT VALIDATED, NOT DOCUMENTED, MISSING), integrity notes, claim discipline.
12. Corpus pipeline rules — tree canonical, missing stays missing, derived labelled, contradictions surfaced.
13. From D only: public CV HTML + PDF, sitemap, robots, canonical/OG/JSON-LD, allowlisted public profile, RoboGuide.

---

## 4. Content requiring your verification

These conflict between lineages, or risk overstating. I will not pick an answer for you.

| # | Item | Conflict |
|---|---|---|
| 1 | **MCA institution** | A: *Maharaja Agrasen Himalayan Garhwal University, Uttarakhand*. B/C/D: *Chaudhary Charan Singh University, Meerut*. D's roadmap also says MCA was **removed** on 30 Oct, yet D's `content.ts` at HEAD still contains it. Which is correct, and should MCA appear at all? |
| 2 | **GharGyaan status** | A: IN PROGRESS, "no users, no outcomes". D: **SHIPPED — BUILD & EVALUATION COMPLETE**, 48 guides / 7 categories / 10 unsourced, EN/HI/Hinglish, 21 emergency categories, 214-case eval, 4 safety misses fixed, 16 docs. C: CONCEPT · NOT LIVE. Which figures are current, and can they be checked against `gaurav-product/ghargyaan`? |
| 3 | **Positioning** | A: AI Product Manager · Healthcare × AI × Research. D: "Product Professional … across industries". C: AI PM / Product Builder, healthcare-leaning. A Healthcare City reads as healthcare-first — confirm that is still the positioning you want. |
| 4 | **Target roles** | A: 6 chips. C: AI PM, Healthcare PM, APM, Product Analyst, HealthTech. D: 7 chips incl. Product Owner, Growth Product. |
| 5 | **Aaroh title** | "Founder & Product Manager" (A, C) vs "Founder and product lead" (D). |
| 6 | **Phone number** | `+91 …` is in A's public `content.js` and in D's client bundle (not rendered, but shipped). B/C removed it. Recommend removal everywhere. |
| 7 | **PhonePe figures** | 40,000-user "pilot", 7.14%, 70%. This is a Masai × IIT Roorkee capstone. Confirm whether the dataset is real PhonePe data or a case dataset; the city must not present it as PhonePe production outcomes. |
| 8 | **"Verified" means two things** | Corpus `counts.verified = 35` (programmatic checks) vs 33 studies at evidence level VERIFIED. D's project description says "35 verified assumptions", which is a third, incorrect reading; it also says 89 written / 1,382 references (stale — current is 90 / 1,389). |
| 9 | **Certifications vs courses** | Qualcomm AI Upskilling and Generative AI Mastermind are listed as certifications. D's Ask prompt says "IIT Roorkee product-management certification" — C correctly says "a programme taught by … faculty — not an IIT Roorkee degree". |
| 10 | **Evamastu as a project** | Only B/C/D-plan promote it to a project record. Built from existing sentences only — confirm you want it in the city. |
| 11 | **Resume** | A: no PDF published (deliberately). D: generates one on demand. |
| 12 | **Intro film v2** | D references `-v2` film and poster. I cannot see the binaries; which film is canonical? |
| 13 | **"Existing product teardowns"** | No teardown collection exists outside the 90-day corpus. I'm treating the corpus as the teardowns unless you point me elsewhere. |

---

## 5. Pre-existing defects found (not fixed — audit only)

- **`docs/` on `main` is stale.** The last two commits changed `site/` but were never rebuilt — GitHub Pages serves a build without the opportunity block or the sound toggle.
- Scripts hard-code the original authoring machine (`/home/claude/…`) in `extract.py`, `build_corpus.py`, `verify.py`. The suite fails out of the box; I ran it with a container-only symlink.
- README states "91/91"; the suite is 156 checks.
- `verify.py` emits two Python `SyntaxWarning`s (unescaped `\{`, `\/` in JS strings).
- The phone number ships publicly (§4.6).

Test baseline on `main`: **156 / 156 PASS**, no console errors, no overflow at any width.
(Real-MP4 playback is verified statically; this Chromium build lacks H.264.)

---

## 6. Migration strategy

1. **Choose the base** (decision required — §8). Nothing is replaced; the city ships as a new route/mode beside the existing site.
2. **Freeze a parity snapshot** of the chosen content layer and add a test that every fact in it is still reachable after migration (string-level parity on claims, numbers and statuses).
3. **Split content into typed modules** (Phase 1) with no copy changes. Each claim carries `status` and `source`.
4. **Resolve §4** as data edits, each in its own commit, only after you answer.
5. **Build the city as a layer over the same modules.** Case-study panels reuse the existing section components, so content is written once.
6. **Keep the existing 2D site as the fallback** for mobile, low-power devices, no-WebGL, reduced motion and Recruiter Mode.
7. **Swap the default view only on your approval.**

---

## 7. Recommended implementation architecture

**Base: lineage D (Lovable, React/TanStack Start).** It is what's live, it's already React, and R3F +
GSAP drop in without changing the toolchain. The vanilla lineage would need a bundler and framework introduced
just to host Three.js.

To work on D from here, the Lovable project has to be connected to a GitHub repository (Lovable → GitHub
integration — your action). I can then work on a branch and Lovable syncs it. Fallback: I build the city
as a separate `city/` Vite + React package in this repo reading shared content modules.

```
src/content/                 Phase 1 — typed, single source
  profile.ts  projects.ts  experience.ts  education.ts  skills.ts  achievements.ts  evidence.ts
  schema.ts                  Status enum, Claim { text, status, source, validated_by? }
src/city/
  districts.ts               district → content mapping (data, not components)
  assets/manifest.ts         every image/video: id, kind, intended_use, status PLACEHOLDER|SUPPLIED|VERIFIED, path|null
  scene/                     R3F: <CityCanvas>, procedural placeholder buildings, lighting, fog
  camera/                    GSAP timelines: aerial reveal, descent, district fly-to, guided tour
  ui/                        DOM overlay: district HUD, building labels, case-study panel (reuses sections/*)
  a11y/                      DOM twin of the scene: focusable district/building list, live region
  fallback/                  capability gate → 2D SVG city map → existing site
```

District mapping (proposal — no new claims):

| District | Holds |
|---|---|
| Healthcare District | Aaroh, CareConnect, GharGyaan, Evamastu (if approved) |
| AI Innovation District | Nexus, Ask Gaurav, AI experiments 001–005, Anthropic credentials |
| Product Innovation Boulevard | PhonePe case, 90-day corpus (Constellation, Atlas, Evolution) |
| Knowledge Campus | Education, courses, How I Think, Challenge, Lab Notes |
| Professional Experience District | Adhyatm Sadhna Kendra, LYBL research record, Journey |
| Gaurav.OS HQ | Home, Product Orbit, intro film, About, Contact, Recruiter Mode |

Rules:
- **Assets**: manifest-driven; a missing file renders the procedural placeholder and is logged, never assumed.
- **Performance**: Three.js chunk lazy-loaded after first paint. Instanced geometry. DPR capped. Frame-loop paused when hidden.
- **Accessibility**: canvas `aria-hidden`; DOM twin is the real interface. Tab/arrows move between districts and buildings, Enter opens, Esc returns. Visible focus.
- **Reduced motion**: no camera flights; cuts and a static aerial still.
- **Mobile**: 2D map by default below a width/GPU threshold, opt-in to 3D.
- **Design tokens**: midnight charcoal, emerald, cyan, Space Grotesk, added as a new token set scoped to the city; the existing palette stays for the 2D site until you approve a global change.

---

## 8. Phase 1 execution plan

**Blocking decisions:**
1. Base lineage: D (recommended), A, or C.
2. If D: connect the Lovable project to GitHub and tell me the repo/branch.
3. Answers to §4 items 1–13.

**Then, in order:**
1. Branch from the chosen base. Run its existing tests and record the baseline.
2. Add `src/content/schema.ts` — `Status` enum (VERIFIED · DOCUMENTED · IN PROGRESS · CONCEPT · HYPOTHESIS · DRAFT · NOT VALIDATED · NOT DOCUMENTED · MISSING), `Claim`, `Project`, `Role`, `Credential`, `Evidence`.
3. Create `profile.ts`, `projects.ts`, `experience.ts`, `education.ts`, `skills.ts`, `achievements.ts`, `evidence.ts` by **moving** records out of the content file. Copy unchanged. `achievements.ts` only re-indexes CV-backed figures already present (e.g. 20–25% lift, 30+ interviews); no new achievements.
4. Keep the old export as a compatibility facade built from the new modules, so no component changes in Phase 1.
5. Add tests: content parity (every old string/number still present), status presence on every claim, no-evidence refusal unchanged, no phone in the public bundle (if approved).
6. Apply §4 resolutions as separate, labelled commits.
7. Typecheck, build, existing + new tests at 1440/1024/768/390/360. Report diff and results. Wait for approval before Phase 2.

Out of scope for Phase 1: any 3D, any visual change, any asset, any deployment.
