# 90-study Earth: final architecture for review

Status: 7 Nov 2026. **Design only; nothing in Part 2 is implemented.** It follows the owner's decisions of 7 Nov:
1. The CTA goes to `/projects`, with a secondary "Explore 90 case studies in 3D".
2. The 7 project worlds move to `/worlds/<slug>`, with redirects; the hub lists the 7 project worlds only.
3. The corpus marker is removed; there's one marker per study; `/research/:day` stays canonical; no deleted or duplicated data.
4. The Teardown stays separate.
5. The ventures stay under `/ventures`.
6. `/atlas` is preserved.

## 1. Route map

| Route | Content | Change |
|---|---|---|
| `/universe` | **Earth with 90 study markers** | Rebuilt content, same URL |
| `/universe?study=N` | Earth facing study N, study panel open | New (query, handled in the browser) |
| `/universe?q=…&cat=…&ev=…&has=…` | Earth with filters applied | New (query) |
| `/worlds` | **Project Worlds hub: the 7 actual projects only** | New |
| `/worlds/evamastu`, `/aaroh`, `/careconnect`, `/ghargyaan`, `/phonepe-smart-spend-coach`, `/nexus`, `/rupee-radar` | Project worlds (building, approved screenshots, floor directory, case panel, sound) | Moved from `/universe/<slug>`, unchanged inside |
| `/research`, `/research/:day` (1–90) | Study library and **canonical full reading** | Unchanged |
| `/atlas` | 2D constellation of the 90 | Unchanged experience; only shares its palette constants with the Earth |
| `/projects`, `/projects/:slug` | Project list and case studies | Unchanged, plus "Visit in 3D" links to `/worlds/<slug>` |
| `/ventures`, `/ventures/:slug` | Concepts in development | Unchanged; their "Visit in 3D" buttons are removed (see §3) |
| `/about#writing-h` | The Teardown (newsletter feature, subscribe link) | Unchanged |
| Everything else | — | Unchanged |

**Prerendered routes:** 326 → **334** (+ `/worlds`, + 7 worlds). The 11 old `/universe/<slug>` pages remain as redirect pages.

## 2. Redirects

GitHub Pages is static and has no server redirects. Each old URL therefore keeps a prerendered page that redirects in three ways:
- **With JavaScript:** a client-side `navigate(…, { replace: true })`, so Back doesn't land on the redirect.
- **Without JavaScript:** `<meta http-equiv="refresh" content="0; url=…">`.
- **For search engines:** `<link rel="canonical">` to the new URL, plus `noindex`.

| Old URL | Redirects to |
|---|---|
| `/universe/evamastu` · `aaroh` · `careconnect` · `ghargyaan` · `phonepe-smart-spend-coach` · `nexus` · `rupee-radar` | `/worlds/<same slug>` |
| `/universe/90-day-case-studies` | `/universe` (the Earth is now the corpus) |
| `/universe/the-teardown` | `/about#writing-h` |
| `/universe/interview-radar` | `/ventures/interview-radar` |
| `/universe/repass` | `/ventures/repass` |

**Owner confirmation needed:** this retires the 3D worlds of The Teardown and the two concepts, because decisions 4 and 5 keep them off both the Earth and the hub. The alternative is to keep them at `/ventures/<slug>/world` and `/writing/the-teardown`.

## 3. Navigation hierarchy

**Header (desktop primary nav):** unchanged — About · Experience · Projects · Product Thinking · Research · Contact; Search, Recruiter Mode, CV.

**Menu drawer** (all routes):

| Section | Items |
|---|---|
| Home | Home |
| About | About, Experience |
| Work | Projects, **Project Worlds** (`/worlds`), Case Studies |
| Research | Research library, **90 case studies in 3D** (`/universe`), Product Atlas |
| Thinking | Product Thinking, AI Lab |
| Concepts | **Emerging Ventures** |
| Contact | Contact |

**Home hero**
- **Primary:** "Explore my work" → `/projects`.
- **Prominent secondary** (second button, same size): "Explore 90 case studies in 3D" → `/universe`.
- **Tertiary links:** Project worlds · 3D city · Recruiter Mode · intro film.

**Cross-links**

| Where | Link |
|---|---|
| `/projects` hero | "Project worlds in 3D" → `/worlds` |
| `/projects` chapters | "Visit in 3D" → `/worlds/<slug>`, only for the 7 projects with worlds |
| `/projects/:slug` header | "Explore in 3D" (the 7) |
| `/research` | "See all 90 on the 3D Earth" |
| `/research/:day` | "Show on the Earth" (`/universe?study=N`) and "Show on Atlas" |
| `/atlas` | "Open on the 3D Earth" |
| The Earth | "Project Worlds" in its top bar |
| A world | "All worlds" (→ `/worlds`) and "90 case studies on Earth" |

**Oz and search**
- Oz: "show me healthcare case studies" → `/universe?cat=Healthcare`; "take me to CareConnect in 3D" → `/worlds/careconnect`; "take me to Repass" → `/ventures/repass`.
- The search index gets `/worlds`, and the `/universe` entry is updated.

## 4. How the 90 markers use the existing data

**Source**
- `content/corpus.ts` → `corpus.studies`: the generated JSON from the public case-study repository, which `/research` already uses.
- Nothing is copied, edited or added. The Earth reads `day`, `company`, `title`, `category`, `evidence_level`, `summary`, `has_prd`, `has_experiment`, `has_assumptions`, `verification`, `words`, `sources`, `github_url` and `readme_url`.

**Layout** (new pure function `studyLayout(corpus.studies)` in `content/studyMap.ts`)
- 8 category regions; sizes follow the counts (Healthcare 24, Consumer 22, Marketplace 11, AI 11, Fintech 8, SaaS 7, B2B 6, Analytics 1).
- Studies sit in day order on a golden-angle spiral, at least 4° apart.
- Positions are deterministic.
- Unit tests check: exactly 90; unique days; no two markers closer than the minimum; every study in its own category region; stable output.

**Shared visual vocabulary** (moved out of `atlas.tsx` into `studyMap.ts`; Atlas looks identical)
- Category colour (`CAT_COLOR`) and evidence-level size (`LEVEL_R`).
- The label "Category is derived by rule", as on `/atlas`.

**Honesty labels**
- Every preview and panel says "Case study (research) — not a launched product".
- The evidence level is shown with its definition.

## 5. Search, filters, selection, shareable URLs, Back/Forward

**Study browser** (DOM drawer; the accessible equivalent of the markers)

| Control | Matches | URL |
|---|---|---|
| Search | company, title, summary (normalised, accent-insensitive; same `norm` helper as `/research`) | `?q=` |
| Category chips (with counts) | derived category, multi-select | `?cat=Healthcare,AI` |
| Evidence level | VERIFIED / DOCUMENTED / SOURCED / NARRATIVE | `?ev=` |
| Has… | PRD · experiment · ASSUMPTIONS file · executed checks | `?has=prd,experiment` |

- **Results:** a list of buttons, sorted by day, with a live count ("24 of 90 studies") for screen readers.
- **On the Earth,** non-matching markers dim to 15% and matching ones stay lit. "Show results" turns the globe to the largest matching region.

**Selecting a study** (marker click, list button, or a deep link)
- The globe turns so the study faces the camera and the camera eases closer; reduced motion skips the movement.
- The **study panel** opens:
  - Day N · company · title;
  - category, evidence level and flags;
  - the summary; words and sources;
  - **Read the full study** → `/research/N`;
  - **Original on GitHub**; **Show on Atlas**;
  - **Previous / Next study**, within the current filter results.

**History behaviour**

| Action | History |
|---|---|
| Select a study | **push** `?study=N` |
| Filter or search | **replace** (the history isn't flooded while typing) |
| Back | Goes to the previous selection, or closes the panel; the camera follows |
| Forward | Re-opens it |
| "Read the full study" → `/research/N`, then Back | Returns to `/universe?study=N`, facing that study, panel open |
| Deep link `/universe?study=N` | Skips the intro and opens directly on study N; any combination of filters plus a study is shareable |

- **Invalid `study`** (not 1–90): the panel stays closed, with a polite notice "No study N".
- **Invalid filters** are ignored.

## 6. Interaction flows

**Desktop (mouse)**
1. Home → "Explore 90 case studies in 3D" → circular reveal → intro (Skip / Replay; it plays once, then is remembered).
2. The Earth slowly turns. Category regions are labelled. Hovering a pin shows the preview card, with the cursor's VIEW label from Phase 1.
3. Click a pin → the globe turns to it → the panel opens. Open the full study, or step with Previous / Next.
4. "Studies" opens the browser: search and filter, and the Earth highlights matches.
5. Exit (top left) returns to where the visitor came from. "Project Worlds" in the top bar → `/worlds`.

**Mobile (touch)**
1. Same entry. On devices without a graphics chip, or by choice, the **list leads** ("Browse list" / "Start 3D").
2. Drag to turn, pinch to zoom.
3. **Two-step selection:** tap a pin → a compact preview sheet → "Open study" → the panel opens as a bottom sheet (62 svh, fixed height, no layout shift).
4. Hit areas are 44 px minimum; markers are larger on the mobile tier.
5. The study browser is a full-height sheet with sticky search and filters.

**Keyboard**
- Tab order: Exit → Studies → Project Worlds → Recruiter → Sound → the 3D view → panel (when open).
- In the 3D view: ←/→/↑/↓ rotate, +/- zoom, `[`/`]` previous/next study, Enter opens the study facing the camera.
- In the browser: the search field, then the chips (Space toggles), then the results; ↑/↓ move through results, Enter selects, Esc closes.
- On selection, focus moves to the panel heading; Esc closes the panel and returns focus to where it was.
- A "Skip to study list" link comes first on the page.

## 7. Performance strategy (2-point Lighthouse budget retained)

- **Markers:** `InstancedMesh` for pins, plus one for selection and hover rings; about 3 draw calls in total versus about 44 today.
- **Fading and dimming happen in the shader:** far-side fade and filter dimming are per-instance attributes. There's no per-frame JavaScript loop over 90 markers.
- **Picking:** an instanced raycast against 90 low-poly spheres, done only on pointer move and batched once per frame.
- **No 90 DOM labels.** Only 8 region labels plus one preview card.
- **Data:** the Earth page imports the existing corpus module, about 22 KB gzipped, already split into its own chunk for `/research`. No new data file.
- **Unchanged:** textures and tiers, the software-renderer list-first fallback, the paused render loop when the tab is hidden, and Phase 1 and 2 behaviour.
- **Budget**

| Page | Baseline (mobile / desktop) | Budget |
|---|---|---|
| `/universe` | 88 / 100 | ≥ 86 / ≥ 98 |
| `/worlds` | new | ≥ 88 mobile (simple page) |
| Each world | 89–90 / 100 | ≥ 87 / ≥ 98 |
| Other representative pages | Phase 2 numbers | Within 2 points |

  Layout shift stays 0 on all of them.

## 8. Accessibility strategy

- **The study browser is the full, equivalent way through the 90 studies.**
  - Buttons with accessible names (Day N, company, title, category, evidence level).
  - `aria-pressed` on the selected study; a polite live region for result counts.
- **The 3D canvas** is `role="application"`, with instructions in its label; markers are `aria-hidden`.
- **The study panel** is a labelled region with a heading.
  - Focus moves in on open and returns to the trigger on close.
  - Previous / Next study buttons have explicit names.
- **Contrast and motion:** category colours always come with a text label (colour is never the only cue), and reduced motion means no camera movement or intro motion.
- **Crawler and tests:** the crawler covers `/universe`, `/universe?study=12`, `/worlds`, the 7 worlds and the 11 redirect pages. New e2e tests cover:
  - search, filters, selection and deep links;
  - Back and Forward;
  - keyboard paths and the mobile two-step flow;
  - redirects;
  - no-WebGL and no-GPU fallbacks.

## 9. Delivery

- **One commit for Part 2:** code, tests and docs, separate from the Phase 2 fix.
- **Estimated size:** about 1,000–1,400 changed lines.
- **Tests and audits:** e2e for the Universe is rewritten and the world paths in the interaction tests are updated; new unit tests for the layout; full suite, crawler and Lighthouse comparison.

## 10. Owner confirmations before implementation

1. **Retire the 3D worlds of The Teardown, Interview Radar and Repass**, with redirects as in §2 (recommended), or keep them at `/writing/the-teardown` and `/ventures/<slug>/world`?
2. **Remove the "Visit in 3D" buttons from `/ventures`?** This follows from 1.
