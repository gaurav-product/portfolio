# Phase 1 — Repository, content and source of truth

Date: 2 November 2026 · Branch: `claude/beautiful-goldberg-radrlu` · Nothing on `main` or on Lovable was changed.

---

## 1. Repository and branch — confirmed

| | |
|---|---|
| Source repository | `github.com/gaurav-product/portfolio` |
| Working branch | `claude/beautiful-goldberg-radrlu` (from `main` @ `0f453f7`) |
| Production today | Lovable project "Gaurav OS" → `gaurav-os.lovable.app` — **untouched** |
| Unmerged prior work | `claude/bold-ptolemy-tc1khf`, `claude/ai-product-portfolio-redesign`, `claude/gaurav-os-ai-product-system` — read, not merged |
| Rollback | Everything here is additive. `main` is unchanged; production is unchanged. Discard the branch to roll back. |

**Lovable independence.** Lovable source was *read* through its file API (no messages sent, no credits used). The rebuild will live in this repository and deploy independently; Lovable stays live until you approve a cut-over.

---

## 2. Factual source of truth

Order of authority, applied to every claim:

1. **`Gaurav_Kumar_Singh_CV_Healthcare.pdf`** (supplied 2 Nov 2026) — the factual reference.
2. **The project's own repository** — for build facts (test counts, status, what is deployed).
3. **`Gaurav_Kumar_Singh_APM_Resume.pdf`** (Drive, 8 Sep 2026) — earlier CV; used only where the healthcare CV is silent.
4. Portfolio content files (`site/content.js`, Lovable `content.ts`) — wording and structure, never a source of a fact on their own.

### What the evidence settles

| Item | Was | Now | Evidence |
|---|---|---|---|
| Positioning | "AI Product Manager" / "Product Professional across industries" | **Healthcare product, research and analytics** · brand line **Product × AI × Building** | Healthcare CV headline; brand board |
| Target roles | three different lists | **Product Analyst · APM · Research Associate · Health-Tech Operations**, plus AI Product (portfolio scope) | Healthcare CV |
| Aaroh role | Founder & PM / Founder and product lead | **Founder and product lead** | Healthcare CV |
| Aaroh status | — | **Pre-launch · strategy reset · 8 consented practitioners · 0 live users** | CV; repo badge "pre-alpha" |
| GharGyaan | IN PROGRESS / SHIPPED / CONCEPT | **Working prototype · demo mode · not deployed** — 214/214 tests (206 scenarios + 8 integrity/validator), 21 emergency categories, 48 guides, 10 lacking a verified source, 4 held-out safety misses fixed, 16 product documents, no users, not clinically reviewed | `ghargyaan/README.md`, `docs/11-safety.md`, `src/data/evalReport.json` |
| PhonePe funnel | "40,000-user pilot" | Same figures, **labelled "case data supplied by the capstone"** — not PhonePe production data | `capstone/part-c/part-c-full.md §1.1 [CASE DATA — supplied by the Capstone]` |
| PhonePe A/B | — | **Designed, not run.** No result exists. | CV; repo |
| Nexus | — | **MVP in demo mode with fictional data; no AI model called; not validated with users** | `nexus/README.md` |
| CareConnect | — | MVP, **no users, no revenue, no traction**; 65 unit/integration tests, 30 E2E journeys, 13 graded conclusions | CV; `careconnect/README.md` |
| LYBL | 2 bullets | Adds: led multiple research projects end to end, research-backed wellness modules, competitive analysis, A/B tests on feature and content variants | Healthcare CV |
| Writing | 90 case studies | Adds **The Teardown**, weekly LinkedIn newsletter, 674 subscribers (self-reported at CV date) | Healthcare CV |
| Tools | — | Adds React, TypeScript, SQLite | Healthcare CV |
| Corpus counts | 89 written / 1,382 refs (Lovable) | **90 written · 0 empty · 1,389 references · 33 at VERIFIED evidence level · 35 with programmatic checks** — two different "verified" measures, always labelled separately | `corpus.js` (generated 29 Sep) |
| Phone number | public in `main` and Lovable bundle | **Removed from all public code** (rule 9). Email, LinkedIn, GitHub only. | Your rule 9 |

### Discrepancy report — still needs your decision

| # | Conflict | Sources | What I will do until you answer |
|---|---|---|---|
| D1 | **MCA university** | Healthcare CV: Chaudhary Charan Singh University, Meerut. APM CV (8 Sep): Maharaja Agrasen Himalayan Garhwal University, Uttarakhand. | Use the healthcare CV. Please confirm. |
| D2 | **Aaroh prototype stack** | CV: "37-screen interactive prototype (React, FastAPI)". `aaroh/ROADMAP.md`: "self-contained HTML prototype: 37 screens, 304 interactive elements". | Say "37-screen interactive prototype", omit the stack, until confirmed. |
| D3 | **CareConnect test counts** | CV and README body: 65 unit / 30 E2E. README command table: 70 unit / 72 E2E. CHANGELOG mentions 63. | Use 65 / 30 (CV). I could not re-run the suite here — executing external repo code was blocked by the session's safety policy. |
| D4 | **GharGyaan languages** | CV: "21 emergency categories in English, Hindi and Hinglish". Repo: input in all three; guide text is English only. | Say "screens input in English, Hindi and Hinglish". |
| D5 | **Downloadable CV** | The CV contains your phone number. | Ship a phone-free CV PDF generated from the same content, unless you approve publishing the original. |
| D6 | **The Teardown — 674 subscribers** | CV only; no verifiable source. | Show as "674 subscribers (as of Nov 2026)". |
| D7 | **Real screenshots** | 37 exist in your public repos (CareConnect 18, GharGyaan 7, Nexus 12), all demo data. | Not used until approved; captioned "Demo data" when used. |
| D8 | **Portrait** | Only the composited avatar was shared, in chat. | Hero works without a portrait. Supply an original photo file if you want one. |
| D9 | **Brand accent** | Brand board ≈ `#4DFF4D`; Drive brand guide `#B7FF35`; brief `#4DFF4D`. | `#4DFF4D` (matches the board and the brief). |
| D10 | **Concept boards** | You mentioned boards; one image arrived. | Proceeding with the avatar as the reference. |

---

## 3. Feature map (verified in code, both implementations)

| Feature | `main` (vanilla) | Lovable (React) | Plan |
|---|---|---|---|
| Intro film | `app.js` `buildIntro` | `IntroFilm.tsx` | Keep · first-visit only, skip, sound toggle, focus trap, reduced-motion poster |
| Product Orbit | `app.js` orbit | `ProductOrbit.tsx` | Keep · becomes the HQ district centrepiece |
| Constellation / Atlas / Evolution | `corpus-ui.js` | `components/corpus/*` | Keep · Research & Knowledge |
| Ask Gaurav | `app.js` + `copilot_kb` | `lib/ask.ts` | Keep · refuse-before-match, sources on every answer |
| Challenge, Lab Notes | `app.js` | `sections/*` | Keep |
| Recruiter Mode | toggle | toggle + `RecruiterView` | Rebuild as a first-class route `/recruiter` |
| Search (`/`) | `app.js` | `SearchDialog.tsx` | Keep |
| Evidence status labels | content + CSS | `EvidencePill.tsx` | Keep · one `Status` type |
| CV / sitemap / OG / JSON-LD | branches only | server routes | Static build-time equivalents |
| RoboGuide | — | `RoboGuide.tsx` | Evaluate in Phase 3; not essential |
| Corpus pipeline | `scripts/extract.py`, `build_corpus.py` | consumes copy | Keep; fix hard-coded `/home/claude` paths |
| Tests | 156 Playwright checks | 2 unit test files | Port the assertions; add new ones |

---

## 4. Decisions taken ("best in class", per your instruction)

| Area | Decision | Why |
|---|---|---|
| Stack | **React 19 + TypeScript + Vite**, **React Router 7 with static prerendering**, **Tailwind CSS 4** | Same React generation as production; prerendered HTML gives SEO and fast first paint on any static host; no server to run. |
| 3D | **three.js + React Three Fiber + drei**, loaded only in Explore Mode | Recruiter Mode and every content page ship zero WebGL. |
| Motion | **GSAP** for camera paths; CSS for UI motion; everything off under `prefers-reduced-motion` | — |
| Content | Typed modules in `app/src/content/` with a `Claim` type carrying `status` and `source` | Satisfies "preserve source attribution and evidence status". |
| Hosting | GitHub Pages or Cloudflare Pages from this repository; Lovable untouched until cut-over approval | Independent of Lovable credits. |
| Tokens | Brief's tokens adopted; accent `#4DFF4D` on dark only; `#138A1E` for accent text on light (4.5:1) | `#4DFF4D` fails contrast on white. |
| Type | Space Grotesk (display) · Inter (body) · IBM Plex Mono (labels) — all OFL | — |
| Mobile | No 3D by default under 1024 px or on low-power devices; 2D district map instead | "No mandatory 3D loading". |

---

## 5. Asset library — proposed, not integrated

`brand/` contains **48 original, code-drawn SVGs (389 KB total)**, generated by
`brand/tools/generate_assets.py` from one token set. Manifest: `brand/asset-manifest.json`.
Review sheet: `brand/preview/index.html`.

| Category | Count | Notes |
|---|---|---|
| Brand | 5 | Wordmark (dark, light, compact), app icon, favicon. The ".OS" O is a broken ring — an original take on the board. |
| Hero | 2 | Desktop and mobile orbit fields; the ring centre is an empty slot for an owner-supplied portrait or the wordmark. |
| Social | 1 | OG card (+ PNG). |
| Spatial | 3 | Ground grid tile, abstract skyline (6 clusters = 6 districts), 2D district map (the mobile / no-WebGL fallback). |
| Districts | 6 | Text-free backgrounds; left 45% clear for content. |
| Project covers | 6 | Aaroh, CareConnect, PhonePe, GharGyaan, Nexus, 90-day corpus. Each carries "ILLUSTRATION · NOT A PRODUCT SCREENSHOT". |
| Sections | 5 | Operating loop, Ask Gaurav pipeline, evidence levels, Challenge, Lab Notes. Words are verbatim from content. |
| UI | 2 + 18 icons | Divider, focus frame, 18 line icons (`currentColor`). |

Guarantees: no AI-generated imagery, no person depicted, no product screens, no chart or number encoded
in any motif, all text outlined from OFL fonts, every file validated as XML at generation time.

Also listed in the manifest: 37 real screenshot candidates (with sizes and the "demo data" caveat) and
8 assets that are needed but not supplied.

---

## 6. Pre-existing defects carried forward

- `docs/` on `main` is stale against `site/` (two commits not rebuilt).
- Scripts hard-code `/home/claude/…`.
- README claims 91/91 checks; the suite runs 156 (all pass).
- Phone number in public content.

All four are fixed by the rebuild; none is patched on `main`.

---

## 7. Next — Phase 2 (design system) and Phase 3 (core portfolio)

1. Scaffold `app/` (Vite, React 19, TS, React Router 7 prerender, Tailwind 4) beside `site/`.
2. Typed content modules from `site/content.js` + the healthcare CV, with a parity test against the old content.
3. Design tokens and components: type scale, spacing, buttons, status pills, cards, case-study template.
4. Routes: `/`, `/recruiter`, `/work`, `/work/:slug`, `/research`, `/lab`, `/ask`, `/about`, `/explore`.
5. Port Ask Gaurav, the corpus views and the intro film; build and test at 1440 / 1024 / 768 / 390 / 360.
