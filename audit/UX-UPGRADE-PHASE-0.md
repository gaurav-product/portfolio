# Premium interaction upgrade — Phase 0 audit and plan

Status: 7 Nov 2026. Branch `claude/beautiful-goldberg-radrlu` at `72fd7f3`.
**Audit only. No code has changed. Implementation waits for the owner's approval.**

## 1. Current architecture

| Area | What exists today |
|---|---|
| App | React 19, React Router 7 (prerender, `ssr:false`, 326 routes), Vite 7, Tailwind 4. Static GitHub Pages. |
| Shell | `root.tsx`: `SearchProvider` → Header → `<main>` → Footer → `GuideRoot` (Oz). The header and footer are hidden on `/universe*`. |
| Design tokens | `app.css` `@theme`: bg `#0B1110`, green, cyan, amber, line, surface; Space Grotesk, Inter, IBM Plex Mono. Primitives in `components/ui.tsx`: `Container`, `ButtonLink`, `Button`, `Pill`, `PageHero`, `Blocks`, `card`. |
| Animation | CSS keyframes (Oz, chapters). GSAP 3.13 drives the 3D camera in Explore and the Universe. R3F 9 + three 0.180 in two lazy scene chunks (`components/explore/Scene.tsx`, `universe/*`). No page-transition system and no View Transitions yet. |
| **Search (Ctrl/⌘+K)** | **Already exists.** `components/Search.tsx` (Ctrl/⌘+K and `/`) plus a lazy `SearchDialog.tsx`, over the `lib/search.ts` index: pages, 8 projects and their case-study sections, experience, education, certifications, skills, tools, and **all 90 studies**. |
| **2D map of the 90 studies** | **Already exists.** `/atlas` is an SVG constellation of the 90 studies (category colour, evidence-level size, click to open `/research/:day`), plus evolution and operating-model views. |
| 90 studies data | `corpus.studies` (generated). Fields: day, company, title, **category** (8 values, derived by rule), evidence level, PRD / experiment / assumptions flags. Routes: `/research/:day`. |
| Projects | `content/projects.ts` is the single source. `ProjectCard` (`components/cards.tsx`) is used on home and experience pages. `/projects` uses film chapters. `/case-studies` covers the **project** case studies. |
| Universe | `routes/universe.tsx` (page, state, URLs) plus `universe/*` (Earth, World, Panels, audio, bus). The floor directory already exists in `World.tsx` (a pylon of section labels → panel). |
| Oz | `guide/*`: state machine, grounded local brain, TTS/STT adapters, `GuideRoot` (site-wide), `GuidePanel` (lazy). The navigation intents already exist. |
| Other guides | `RoboGuide.tsx` (ai-lab and ask pages) and the Explore city's own guided tour. |
| QA baseline | tsc 0 errors; Vitest 85; Playwright 82 passed (+2 skipped by design); a11y crawler 326 routes × 2 viewports, 0 problems. Lighthouse in §6. CI `app-ci` is green. |

## 2. Reuse instead of rebuild

- **Phase 4: extend the existing Ctrl+K `SearchDialog`** into a command palette by adding an "Actions" group and a category filter. The index in `lib/search.ts` already covers projects and the 90 studies, so there's no second index and no duplicate data.
- **Phase 6: upgrade `/atlas`**, which is already the 2D constellation of the 90 studies. It gains cluster grouping, search, filters, a hover preview and a link back to the Earth. The URLs `/atlas` and `/research/:day` stay as they are.
- **Phase 7: extend the existing floor directory and `CaseStudyPanel`**, not a new system.
- **Phase 5: build the tour into `GuideRoot` and `GuidePanel`**, so it uses the same state machine, brain data and voice rules (voice stays off unless the visitor turns it on).
- **Phase 3: use the browser's View Transitions** via React Router 7's built-in `viewTransition` support. It needs no new dependency, never remounts the app, keeps back and forward working, and browsers without support simply navigate instantly.
- **Phase 2: decorate the existing `ProjectCard`, chapter art and Universe preview cards**; no new card components.

## 3. Files likely to change

| Phase | New | Modified |
|---|---|---|
| 1 Cursor, magnetic, spotlight | `src/interaction/Cursor.tsx`, `src/interaction/interaction.css` | `root.tsx` (mount once), `components/ui.tsx` (`data-cursor` and `data-magnetic` on `ButtonLink`/`Button` variants), cards, Universe canvas (`data-cursor="drag"`) |
| 2 Tilt | `src/interaction/tilt.ts` (one delegated listener) | `cards.tsx`, `routes/projects.tsx` (chapter art), `universe/Panels.tsx` gallery thumbnails |
| 3 Transitions | `src/interaction/transitions.css` | `ui.tsx` `ButtonLink`, `Header.tsx`, `routes/universe.tsx` (circular reveal on entry; building enter/exit) |
| 4 Palette | — | `components/SearchDialog.tsx`, `components/Search.tsx`, `lib/search.ts` (category filter, actions), `Header.tsx` (visible search button on mobile already exists — check and reuse) |
| 5 Oz tour | `src/guide/tour.ts` (stops built from content modules) | `guide/GuideRoot.tsx`, `guide/GuidePanel.tsx`, `guide/guide.css` |
| 6 2D map | — | `routes/atlas.tsx` (constellation upgrade), small link from `/universe` and the palette |
| 7 Floors | — | `universe/World.tsx` (floor bands and camera focus), `universe/Panels.tsx` (floor list as an accessible 2D control), `content/universe.ts` (floor → section-key map) |
| 8 Consistency | — | `app.css` focus, hover and tooltip tokens; small fixes found in the pass |
| QA | tests in `tests/unit` and `tests/e2e`; `audit/UX-UPGRADE.md` | the existing specs only where behaviour intentionally changes |

**Dependencies: none.** GSAP, R3F and three are already installed. Cursor, tilt and magnetic effects are about 3–4 KB of plain TypeScript plus CSS.

## 4. Floors: what the evidence supports (Phase 7)

Each floor maps to existing case-study section keys:

| Floor | Section keys |
|---|---|
| Problem | `problem` / `why` |
| Research | `segments` / `methodology` / `jtbd` |
| Insights | `insights` |
| Strategy | `opportunity` / `strategy` / `vision` / `competition` / `prioritization` |
| Solution | `mvp` / `prd` / `prototype` / `flows` / `journey` / `ia` / `execution` |
| Results / Learnings | `results` / `analytics` / `experimentation` / `learnings` / `next` |

What each project has evidence for:

| Project | Problem | Research | Insights | Strategy | Solution | Results / Learnings |
|---|---|---|---|---|---|---|
| Evamastu | ✓ | ✓ | — | ✓ | ✓ | ✓ |
| Aaroh | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| CareConnect | ✓ | ✓ | — | ✓ | ✓ | ✓ |
| GharGyaan | ✓ | ✓ | — | ✓ | ✓ | ✓ |
| PhonePe | — | ✓ | — | ✓ | ✓ | ✓ |
| Nexus | — | — | — | ✓ | ✓ | — |
| RupeeRadar | ✓ | — | — | — | ✓ | ✓ |
| 90-day corpus | — | ✓ | — | — | — | — |

"—" means the floor shows **"Not documented in this case study"**, with nothing filled in.

The concepts and The Teardown have no case-study sections, so they keep their current panel. Approved screenshots are not tagged by section, so they appear only on the **Solution** floor (product UI = solution) unless you want a different rule.

## 5. Risks and performance

| Risk | Mitigation |
|---|---|
| Hiding the native cursor harms usability | The native cursor is hidden only after the cursor script starts, and only on `(pointer: fine) and (hover: hover)` without reduced motion. It stays native over text fields and selectable text (I-beam), and if the script fails. Decorative layers use `pointer-events: none`. |
| Cursor and spotlight cost | A single `pointermove` listener on the document, rAF-batched. Movement uses `transform` only. The spotlight is one fixed layer with a static radial gradient that is moved, not repainted. The loop stops when the pointer is idle or the tab is hidden. |
| Delegated hover detection | One `pointerover` listener reads `data-cursor` / `data-magnetic` / `data-tilt` from `closest()`. No per-component listeners. |
| Tilt and magnetic break hit-testing | Transforms are small: tilt ≤ 6°, magnetic ≤ 6 px. Focus rings are unaffected. Keyboard activation is unchanged. Off for touch and reduced motion. |
| View Transitions vs the full-screen Universe and Oz | Oz and the cursor layer get their own `view-transition-name` so they don't flash. Transitions are skipped for same-page hash links and under reduced motion. The universe's existing fade and title card stay as the in-scene transition. |
| Tour vs existing conversations | The tour starts only from an explicit button. It pauses (never clears) an open conversation, and it never speaks unless voice is on. |
| Command palette vs `/` shortcut | Keep both. `/` stays as search; Ctrl/⌘+K opens the same palette. |
| Test churn | Existing e2e tests use roles and test ids, so a custom cursor doesn't affect them. Each phase adds its own tests. |
| Lighthouse | Budget: no representative page loses more than 2 points, and layout shift stays 0. Universe tier logic and the software-renderer fallback are unchanged. |

## 6. Lighthouse baseline (mobile / desktop)

| Page | Mobile | Desktop |
|---|---|---|
| `/` | 86 | 99 |
| `/recruiter` | 91 | 100 |
| `/projects/careconnect` | 87–89 | 100 |
| `/research` | 93 | 100 |
| `/research/90` | 88 | 100 |
| `/about` | 89 | 100 |
| `/universe` | 88 | 100 |
| `/universe/careconnect` | 89 | 100 |

Accessibility, best practices and SEO are 100 on every page.

## 7. Proposed commit sequence

1. Signature cursor, context labels, magnetic CTAs, spotlight.
2. Tilt cards and page transitions (View Transitions plus the Universe circular reveal).
3. Command palette (extend the existing Ctrl+K search).
4. Oz guided tour.
5. 2D case-study map (upgrade `/atlas`).
6. Interactive building floors.
7. Design-consistency pass, QA, documentation (`audit/UX-UPGRADE.md`).

Each commit includes its tests, the a11y crawler, Lighthouse spot checks, and desktop and mobile screenshots.

## 8. Decisions for the owner

1. **2D map location.** Upgrade the existing `/atlas` (recommended; no duplicate), or a new route?
2. **Cursor style.** Hide the native arrow and show only the dot and ring (with the native cursor kept for text and fields), or show the dot and ring alongside the native arrow?
3. **Screenshots on floors.** Show approved screenshots on the Solution floor only?
4. **Transitions.** Is the browser View Transitions approach acceptable? Firefox users would get instant navigation instead of the animation.
