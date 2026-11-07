# Part 2: the 90-study Earth, project worlds and preserved 3D experiences (Option A)

Status: 7 Nov 2026. Branch `claude/beautiful-goldberg-radrlu`. PR #1 stays **draft**. Nothing is merged or deployed, and `main` is unchanged.

## 1. What changed

| | Before | After |
|---|---|---|
| `/universe` | Earth with 11 hand-placed markers (7 projects, 1 corpus marker, The Teardown, 2 concepts) | **Earth with 90 markers, one per case study**, from `corpus.studies` |
| Project worlds | `/universe/<slug>` | **`/worlds/<slug>`**, plus a new hub at **`/worlds`** with the 7 projects |
| The Teardown 3D | `/universe/the-teardown` | **`/writing/the-teardown`**; linked as "See it in 3D" in the Writing section on `/about` |
| Concept 3D | `/universe/interview-radar`, `/universe/repass` | **`/ventures/<slug>/world`**; the "Visit in 3D" buttons are re-pointed |
| Corpus world (`/universe/90-day-case-studies`) | A world for the whole corpus | Removed as approved. The old address redirects to `/universe` |
| Home hero | Primary "Explore my work" → `/universe` | Primary **"Explore my work" → `/projects`**; secondary **"Explore 90 case studies in 3D" → `/universe`**; tertiary "Project worlds in 3D", 3D city, Recruiter Mode, film |
| Prerendered pages | 334 | **337** |

`/research/:day` (canonical study pages) and `/atlas` are unchanged apart from new cross-links. The Atlas now shares its colours and sizes with the Earth from one module and accepts `?day=N`.

## 2. Routes

| Route | Page |
|---|---|
| `/universe` | The 90-study Earth (full screen) |
| `/universe?study=N&q=…&cat=…&ev=…&has=…` | Shareable state: selected study, search, categories, evidence levels, contents |
| `/universe?view=2d` | List view |
| `/worlds` | Hub of the 7 project worlds (an ordinary page with the site header) |
| `/worlds/<slug>` | 7 project worlds: evamastu, aaroh, careconnect, ghargyaan, nexus, phonepe-smart-spend-coach, rupee-radar |
| `/writing/the-teardown` | The Teardown workshop |
| `/ventures/interview-radar/world`, `/ventures/repass/world` | Concept worlds |

### Redirects (11 prerendered pages)

| Old | New |
|---|---|
| `/universe/<7 project slugs>` | `/worlds/<slug>` |
| `/universe/the-teardown` | `/writing/the-teardown` |
| `/universe/interview-radar`, `/universe/repass` | `/ventures/<slug>/world` |
| `/universe/90-day-case-studies` | `/universe` |

**How they work.** GitHub Pages has no server-side redirects, so each old address is a prerendered page with:
- `<meta http-equiv="refresh" content="0; url=…">`, which works without JavaScript;
- a client-side `navigate(…, { replace: true })`, so Back doesn't return to the stub;
- `robots: noindex`;
- a canonical link to the new address when `VITE_SITE_URL` is set.

The data lives in `UNIVERSE_REDIRECTS` (`content/universe.ts`).

## 3. The 90 markers

**Source.** One marker per `corpus.studies` entry, so there are exactly 90 and nothing is copied or invented. Layout is `studyLayout()` in `app/src/content/studyMap.ts`.

**Grouping.** Each of the corpus's 8 derived categories gets one region. Region centres are spread over the globe with a Fibonacci sphere, and studies sit in day order on a golden-angle spiral.
- Healthcare: 24
- Consumer: 22
- AI: 11
- Marketplace: 11
- Fintech: 8
- SaaS: 7
- B2B: 6
- Analytics: 1

**Layout checks.** The layout is deterministic. Markers are never closer than 5.0° (the unit test requires more than 4.1°). The page states that positions are a visual layout by category, not geography.

**Encoding.**
- Colour is the category.
- Size is the evidence level (VERIFIED > DOCUMENTED > SOURCED > NARRATIVE).
- Both use the same values as `/atlas`.

**Rendering.** One instanced mesh draws all 90 markers. Far-side fading and filter dimming are computed per marker on the GPU, and an instanced, invisible hit layer handles clicks. On top sit one hover ring, one selection ring and 8 category labels.

**Interaction**
- Hover shows a preview card: Day, company, category, title and evidence level.
- Click, Enter on a hovered marker, or a pick from the list selects a study. The camera flies around the globe (never through it), and the view shifts so the marker stays clear of the panel.
- **Study panel**
  - Shows Day N, company, title, the category (marked "derived") and the label "Case study (research) — not a launched product".
  - Shows the evidence level with its note and score, the corpus's own flags, and "has PRD" / "has experiment".
  - Shows the summary as written.
  - Links: Read the full study (`/research/N`), On GitHub, Show on Atlas.
  - Has Previous/Next within the filtered set (all 90 when unfiltered) and a close button.
- **Study browser.** Opened with the "Studies" button; in 2D or without a GPU it is the whole page.
  - Search, which also accepts "day 40" as an exact match.
  - Category chips with counts, evidence-level chips with counts, and "contains" chips (PRD, experiment, ASSUMPTIONS file, executed checks).
  - A live "n of 90" count and Clear filters.
  - A list of all matching studies as buttons. Hovering or focusing an item turns the Earth to it.
- **URL and history**
  - Selecting a study pushes a history entry, so Back and Forward step through selections.
  - Filters replace the current entry.
  - A deep link (`?study=` or filters) skips the intro.
  - A new filter turns the Earth to its first match.
- **Keyboard:** arrows rotate, +/− zoom, `[` `]` previous/next, Enter selects, Escape closes the panel or the list.

## 4. The preserved 3D experiences

The building, panels, floor directory, gallery, lightbox and case panel code are reused unchanged through a shared `WorldPage` (`app/src/universe/WorldPage.tsx`). Only the route and the back target are configurable.

| Experience | Route | Back button | Labelling |
|---|---|---|---|
| 7 project worlds | `/worlds/<slug>` | "All worlds" → `/worlds` | Statuses from `projects.ts`; screenshots "Actual product screenshot · demo data"; "Product screens not supplied" placeholders unchanged |
| The Teardown | `/writing/the-teardown` | "Writing" → `/about#writing-h` | Brand artwork, newsletter facts (self-reported subscriber count), Subscribe on LinkedIn |
| Interview Radar, Repass | `/ventures/<slug>/world` | Concept name → `/ventures/<slug>` | "Concept in development", "Not built, not launched and not validated", every board labelled a concept visual |

None of them appears on the Earth or in the `/worlds` hub. All three remain reachable, and none was deleted.

## 5. Navigation, search, Oz and cross-links

**Navigation**
- Menu drawer: Projects, Project Worlds, 90 case studies in 3D, Emerging Ventures.
- Footer: Project worlds; 90 case studies in 3D.

**Pages**

| Page | Links added or changed |
|---|---|
| `/projects` hero | "Project worlds in 3D" and "Explore 90 case studies in 3D" |
| Each `/projects` chapter | "Explore in 3D" (the corpus chapter goes to the Earth) |
| Emerging Ventures cards | "Visit in 3D" → `/ventures/<slug>/world` |
| `/projects/<slug>` | "Explore in 3D"; on the corpus page, "See all 90 on the 3D Earth" |
| `/research` | "See all 90 on the 3D Earth" and "Product Atlas (2D)" |
| `/research/N` | "Show on the 3D Earth" (`/universe?study=N`) and "Show on Atlas" |
| `/atlas` | "See the 90 on the 3D Earth" |
| `/about` | "See it in 3D" (The Teardown) |
| `/ventures`, `/ventures/<slug>` | "Visit in 3D" re-pointed |

**Search.** Entries for "90 case studies in 3D", "Project worlds" and "The Teardown in 3D".

**Oz**
- "Take me to Repass" opens `/ventures/repass` and offers "Visit Repass in 3D".
- "Show me his healthcare projects" lists the project worlds.
- "project worlds" opens `/worlds`.
- "the Earth" opens `/universe`.
- "teardown in 3D" opens `/writing/the-teardown`.
- The AI knowledge pack (`guide-api/src/knowledge.generated.ts`) was regenerated. The guide-api is still not deployed and no keys were added.

**Shared behaviour**
- Full-screen mode (no site header or footer, Oz silent) applies to the Earth and every world through one helper, `lib/immersive.ts`.
- The cursor's EXPLORE label and the circular reveal transition apply to the same set.

## 6. Tests

| Suite | Result |
|---|---|
| `tsc` | clean |
| Vitest | **95/95** (was 85; universe tests rewritten and extended) |
| Playwright, full suite on the final build | **107 passed, 2 skipped by design, 0 failed** |
| Accessibility crawler (`npm run audit`) | **337 routes × 2 viewports, 0 problems** (after one fix, below) |

**New and rewritten unit tests**
- Exactly 90 markers, one per study, matching the corpus days.
- No project, concept, newsletter or corpus marker on the Earth.
- Colour and size match the Atlas vocabulary.
- Minimum spacing between markers, and one region per category.
- The layout is deterministic.
- URL filter parsing and matching.
- The hub holds exactly the 7 projects.
- The Teardown and concept routes and back targets.
- All 11 redirects are prerendered and point at their new homes.
- Which routes are full-screen.
- Oz intents and the knowledge pack.

**New and rewritten browser tests**
- The Earth lists exactly 90 studies.
- Select a study, then use the panel, the URL, Previous/Next, Back/Forward, close, and the full study.
- Search and filters in the URL, and Previous/Next inside a filtered set from a shared link.
- 2D list without WebGL.
- List-first without a GPU.
- Reduced motion.
- The home CTAs.
- The hub, and a world's gallery and lightbox.
- The Teardown and the concept routes.
- The redirects.
- Oz.
- Mobile bottom sheets with no overflow.

The interaction, journey and drawer tests were updated for the new CTAs, routes and menu.

**Defects found and fixed by the tests**
1. The load-time "nothing selected" call cancelled the intro (caught by the intro test).
2. Oz covered the study panel's Next button (caught by the selection test). Previous/Next now sit at the left, clear of Oz.
3. In the 2D world view, The Teardown's LinkedIn link didn't open a new tab (caught by the link crawler).
4. The `/worlds` card links' accessible names didn't contain their visible text (caught by axe).

## 7. Performance (Lighthouse, mobile / desktop)

| Page | Before | After |
|---|---|---|
| `/` | 85–86 / 99 | 86 / 99 |
| `/universe` | 88 / 100 | **90 / 100** |
| `/worlds` | — | 90 / 100 |
| `/worlds/careconnect` (was `/universe/careconnect`) | 89–90 / 100 | 90 / 100 |
| `/writing/the-teardown` | — | 90 / — |
| `/ventures/repass/world` (was `/universe/repass`) | 90 / — | 90 / 100 |
| `/projects` | — | 91 / 100 |
| `/research` | 93 | 91 |
| `/research/90` | 88 | 88 |
| `/projects/careconnect` | 87–90 | 87 |

**Budget.** Every page is within the 2-point budget. Layout shift is 0 on every page measured.

**`/research/12`** scored 73, 80 and 84 across runs. I measured the previous commit on the same machine: 77, 83 and 79. Same range, so it is variance on a heavier page, not a regression.

**Bundle.** The 3D code stays lazy-loaded. The corpus data loads only on `/universe`, as it already did on `/research`. No new dependencies.

## 8. Screenshots (`audit/screens/universe-90/`)

| Before | After |
|---|---|
| `before-earth.png` (11 markers) | `after-earth.png` (90 markers, 8 regions) |
| `before-earth-list.png` | `after-earth-list.png` (search, filters, 90 studies) |
| — | `after-study.png`, `after-filtered.png` (Healthcare + Verified) |
| `before-world-careconnect.png` | `after-world-careconnect.png` |
| `before-concept-repass.png` | `after-concept-repass.png` |
| — | `after-teardown.png`, `after-hub.png`, `after-home.png` |
| `before-mobile-earth.png` | `after-mobile-earth.png`, `after-mobile-study.png` |
| — | `after-no-gpu-list.png` |

## 9. Known limitations

- **Software rendering.** Headless Chromium draws WebGL without a GPU, so the tests check behaviour, not frame rate or visual quality on real devices.
- **Mobile labels.** On phones the category labels can sit under the top-bar buttons at some angles. They fade on the far side but are not repositioned.
- **Filtered-out markers** dim to about 13% opacity rather than disappearing, so the shape of the corpus stays visible. On bright parts of the globe they are faint.
- **Many summaries are boilerplate.** Several study summaries in the corpus are the studies' own boilerplate notice (for example Day 12, Netflix). They are shown as written, not rewritten.
- **Old URLs drop their query string.** The meta refresh fires before the app starts, so an old `/universe/<slug>?…` URL loses its query. Paths are preserved.
- **Cold arrival in worlds.** A world opened from the hub plays the standard 1.8 s arrival, not the old descent from the Earth, because worlds are no longer entered from the Earth.
- **Unused archetype.** The `archive` building (the old corpus world) is no longer used by any route. Its code remains in `World.tsx`; it can be removed in a follow-up.
- **Duplicate drawer link.** The menu drawer shows "90 case studies in 3D" twice: in the list and in the shortcut block, as the old universe link did before.
