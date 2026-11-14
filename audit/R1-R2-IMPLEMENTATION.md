# R1 and R2 implementation: handover

Status: 8 Nov 2026. **Local and uncommitted.** Nothing is committed, pushed, merged or deployed, PR #1 is untouched, and Phase 3 hasn't started.
Baseline: `claude/beautiful-goldberg-radrlu` at `310332f` (= origin). `main` is at `0f453f7`.

**Where the work lives.** It was done in the Claude Code cloud copy of the repository. Your Windows copy (`C:\path\to\portfolio-1`) wasn't connected to this session. All changes are delivered as **`gaurav-os-r1-r2.patch`**: apply it with `git apply` on a clean checkout of `310332f`. It creates no commit.

## 1. Task register

Estimates are from the approved blueprint (§7.2). Actual effort is this session's working time, measured in sessions, not engineering days.

| # | Task | Priority | Status | Main files | Tests | Outstanding dependency |
|---|---|---|---|---|---|---|
| R1.1 | On-demand rendering, idle stop, power preference, frame-time clamp | P0 | **Done** | `universe/motion.tsx` (new), `Scene.tsx`, `Earth.tsx`, `World.tsx` | `unit/motion.test.ts`; `e2e/gpu.spec.ts` (idle frames, ambient cap) | Real-device frame rate, heat and battery (device QA) |
| R1.2 | GPU resource lifecycle (leaks fixed) | P0 | **Done** | `World.tsx` → `kit.tsx`, `Scene.tsx` | `e2e/gpu.spec.ts` (objects level across repeated use) | — |
| R1.3 | Reduced motion in every 3D scene | P0 | **Done** | `Scene.tsx` (stars), `kit.tsx`, `World.tsx` (rings, dish, workshop, tickets) | `e2e/worlds.spec.ts` (10 worlds: no frames when still) | — |
| R1.4 | Phone layout: building visible, safe areas, landscape | P0 | **Done** | `app.css` (`side` variant), `universe/layout.ts` (new), `Panels.tsx`, `WorldPage.tsx`, `World.tsx`, `Earth.tsx`, `routes/universe.tsx`, `shell.tsx` | `e2e/universe.spec.ts` (portrait sheet, collapse, landscape side panel) | Notch and home-indicator insets on a real iPhone |
| R1.5 | Sitemap without redirects; canonical; per-project social cards | P1 | **Done** | `scripts/postbuild.mjs`, `scripts/build-og-projects.mjs` (new), `public/og/*.png` (7, new), `lib/meta.ts`, `project-detail.tsx`, `world.tsx` | `unit/publication.test.ts`; production-URL build checked | Production `VITE_SITE_URL` when deploying |
| R1.6 | Content accuracy (Nexus note; claims re-audit) | P1 | **Done**, plus 2 owner items | `content/projects.ts` | `unit/publication.test.ts` | Owner: newsletter count; CV-only numbers |
| R1.7 | Browser tests for all 7 worlds + Teardown, Interview Radar, Repass | P1 | **Done** | `e2e/worlds.spec.ts` (new) | 30+ tests | — |
| R1.8 | Image viewer: swipe, focus trap, focus restore | P1 | **Done** | `Panels.tsx` | `e2e/worlds.spec.ts` (trap and restore × 10 worlds, swipe) | Swipe feel on real phones |
| R2.1 | WorldKit v2 shell: shared kit, placeable stations and directory, status-first plaque, skippable arrival with a 7 s cap, Journey panel | P0 | **Done** | `universe/kit.tsx` (new), `World.tsx`, `WorldPage.tsx`, `Panels.tsx`, `content/universe.ts` | `e2e/worlds.spec.ts` | — |
| R2.2 | Bespoke CareConnect world | P0 | **Done** | `universe/worlds/CareConnect.tsx` (new), `content/universe.ts` (journey) | `e2e/worlds.spec.ts` (CareConnect block) | Owner: confirm journey order (M7); device QA |

**Estimate versus actual.** The blueprint estimated R1 at 10–13 days. R2 was estimated at 23–31.5 days in total, of which the framework was 10–14 days and CareConnect 6–8. This session delivered **R1 and a first R2 pilot** in one sitting. That isn't evidence the estimates were too high: the device-QA fix cycle, owner reviews and visual polish rounds those estimates include haven't happened yet (§9).

## 2. What changed, by area

### Rendering and GPU (R1.1–R1.3)

**On-demand rendering**
- The Canvas now runs `frameloop="demand"`.
- A motion driver (`motion.tsx`) decides each tick:
  - "fast" while something moves: a camera flight, damping or a tween;
  - "ambient" for decorative motion, capped at 30 fps, at full rate for 3 s after input, and **stopped after 60 s without input**;
  - otherwise nothing.
- Input always draws a frame.

| Measured in headless Chromium | Result |
|---|---|
| Idle scene, reduced motion, world and Earth | **0 frames per second** once loaded (10 s trace) |
| Earth with ambient motion, no input | ≤ 70 frames in 2 s (the 30 fps cap) |

**Behaviour change for you to review.** After 60 s with no input, the Earth's slow spin and the worlds' auto-rotation pause until the next touch, mouse move or key press. This saves battery and heat in sustained sessions.

**GPU power preference.** `high-performance` (the discrete GPU) is now requested only on the high tier. Laptops and phones use the browser default.

**Frame-time clamp.** A long gap between frames (idle, background tab) no longer makes motion jump.

**Leaks found and fixed**
- `GlassBox` cloned its material and texture on **every re-render**, because its size array is new each render, and never disposed them.
- The floor directory rebuilt all its label textures on every render.
- The concept boards in Interview Radar and Repass were never disposed.
- The tower's chart texture was never disposed.
- The bloom post-processing pass wasn't disposed.

**Measured after the fixes:** geometry count stays flat across 40+ study selections and repeated gallery use. Textures rise once to a ceiling (each category label is uploaded the first time it comes into view) and then stay level.

**Reduced motion now also stops** the drifting stars, Nexus's rings, RupeeRadar's dish, The Teardown's floating parts and Repass's tickets. Before, only the Earth spin and auto-rotation were gated.

### Phone layout (R1.4)

**Portrait.** The building is now framed in the strip between the top bar and the bottom sheet:
- the camera's view offset moves the picture up;
- the camera steps back on narrow screens;
- the sheet is 56% of the screen height (was 62%).

Collapsing the sheet re-frames the scene, and a pinch or wheel zoom is respected afterwards.

**Landscape phones** (short screens) now use the side panel. Before, the sheet covered almost the whole scene. A Tailwind quirk was found and fixed on the way: a comma-separated `@custom-variant` silently dropped the landscape query, so the block form is used.

**Safe areas** (`env(safe-area-inset-*)`) are respected by the top bar, both panels' footers and the image viewer.

**Evidence:** before and after screenshots in portrait and landscape (session scratch files). Real-device confirmation is in the device QA plan.

### Search metadata and content (R1.5–R1.6)

**Sitemap:** **326 URLs**, which is the 337 pages minus the 11 `noindex` redirect pages. Checked with a production-URL build.

**Canonical links and share images**
- Each project world and project page has its own share image.
- Old addresses point their canonical link at the new address.
- The research corpus keeps the site-wide card.

**Seven new share cards** (`public/og/*.png`) are built only from approved art and the content modules' own text.
- **PhonePe uses the original 3D render, not the brand art,** so no third-party logo appears on a share card. Its not-affiliated disclaimer is printed on the card.

**Nexus note corrected.** It said "12 real screenshots … await approval". It now says they're "approved by the owner for this portfolio on 7 Nov 2026".

**Claims re-audit.** Every highlight on all 8 project records carries a recognised label (VERIFIED, CV, CASE DATA, DESIGNED NOT RUN). A unit test now enforces that.
- **For owner confirmation (not changed):**
  - seven numeric claims labelled CV, all owner-attested: Evamastu 4, Aaroh 2, CareConnect 1;
  - the newsletter count "800 (self-reported, Nov 2026)".

### Image viewer (R1.8)

- Horizontal swipe on touch screens, with a 50 px threshold that must be clearly horizontal. Vertical drags still scroll tall screenshots.
- Tab and Shift+Tab are trapped inside the dialog.
- Escape and Close return focus to the item that opened the viewer.
- An "n / total" counter.
- Safe areas.

### R2: WorldKit v2 and CareConnect

**WorldKit v2** (shared by all worlds)
- The reusable parts move to `kit.tsx`: plaza, materials, glass volumes, placeable stations, placeable floor directory, reduced-motion context.
- Every world's arrival now shows a **status plaque first**: status, name, and the project's own honesty line quoted from its labelled highlights (for example "No users, no revenue, no traction — stated by the repository itself").
- **"Skip arrival"** appears while the camera moves. Touching the scene also skips, and a 7 s cap ends the flight on any device.
- An optional **Journey** panel tab (CareConnect only in R2).
- The other six worlds keep their existing buildings; nothing project-specific was redesigned.

**CareConnect bespoke world.** Every element maps to the case study:

| Element | What it stands for (source) |
|---|---|
| Ghost outlines, back, unlit | The rejected caregiver-marketplace brief, decision D-01: "gave up the larger, more obvious business". Labelled "Not built". |
| Family wing, left, three storeys | "The family's screen answers: is someone with my parent, is anything wrong, did today go well…" |
| Attendant wing, right, single storey | "The attendant's screen is the entire app" |
| Handover bridge | The handover pack. The case study's problem statement: "nothing that survives the attendant being replaced". |
| Walkway | All 18 real screenshots ("demo episode seeded by the repository, fictional patient") in 4 groups by caption: set-up, family, handover, attendant. Titled "The first 30 days after discharge". No screen is tied to a specific day. |
| Arrival, about 4.6 s | Down over the rejected brief, along the bridge, out to the walkway |
| Lighting | Clinical dawn: cool haze and a warm low key light |

**CareConnect on phones**
- Only the first station of each group is shown (4 instead of 18), to stay within the phone texture budget. All 18 remain one tap away in the Journey tab.
- The group signs, which overlapped on a narrow screen, are hidden.

**Performance, measured in software rendering**

| World | Frame rate | Draw calls | Triangles |
|---|---|---|---|
| CareConnect | ≈ 4.5 fps | 96 | 1.4k |
| Nexus (reference) | ≈ 4.8 fps | 58 | 8.1k |

Software-rendering frame rates indicate only relative cost. The blueprint's laptop budget is ≤ 250 draw calls and ≤ 400k triangles.

**Screenshot textures load staggered** (1.2 s, then one every 0.22 s) so decoding doesn't stall the arrival. This removed a measured 2.5 s stall.

**Scene code size:** 34.0 KB → 41.4 KB uncompressed (+7.4 KB for the kit, CareConnect and the motion driver).

**Honesty checks**
- No product behaviour, users or results are depicted.
- The journey order is the documented flow (set-up, join, shift, report).
- Screens are grouped only by their own captions. **M7:** you can re-order them.

## 3. Verification (newly run this session, on the final build)

| Check | Result |
|---|---|
| TypeScript | clean |
| Vitest | **106 / 106** (was 97; new: motion and publication) |
| Playwright, full suite (desktop + Pixel 7) | **140 passed, 2 skipped by design, 0 failed** (was 109; new: `gpu.spec.ts`, `worlds.spec.ts`, phone-landscape and sheet-collapse tests) |
| Flakiness checks | `gpu.spec.ts` 12/12 over 3 repeats; `worlds.spec.ts` 44/44 and 59/60 over 2 repeats, with the one failure fixed as a test-timing issue (explained in the session) |
| Accessibility crawler | **337 routes × 2 viewports, 0 problems** |
| Link and control crawler | included in the full suite (12 shards) — passed |
| Production-URL build | sitemap 326 URLs (redirects excluded); canonical links and share images correct |
| Route count | 337 prerendered (unchanged) |

**Lighthouse** (mobile / desktop). All pages are within the 2-point budget. Accessibility, best practices and SEO are 100 on all.

| Page | Before | Now |
|---|---|---|
| `/` | 85–86 / 99 (four-run range 84–86) | 84 / 99 |
| `/universe` | 90 / 100 | 90 / 100 |
| `/worlds` | 90 / 100 | 90 / 100 |
| `/worlds/careconnect` (bespoke) | 90 / 100 | 90 / 100 |
| `/worlds/nexus` | — | 90 / 100 |
| `/writing/the-teardown` | 90 / — | 90 / 100 |
| `/ventures/repass/world` | 90 / 100 | 90 / 100 |
| `/projects` | 91 / 100 | 91 / 100 |
| `/research` | 92 / 100 | 91 / 100 |
| `/projects/careconnect` | 87 / 100 | 87 / 100 |

Layout shift is 0 everywhere except `/projects/careconnect` desktop at 0.001, the same as before.

**Inherited, not re-measured:** none. Every figure above was measured in this session. **Not measurable here:** real-GPU frame rate, heat, battery and safe-area insets. Those belong to device QA (§6).

## 4. Owner decisions and items

1. **M7:** confirm or re-order the CareConnect journey grouping. The default is by caption, in flow order.
2. **The 60 s idle pause** of ambient motion (§2): keep it, or change the timeout.
3. **Newsletter count** "800 (self-reported, Nov 2026)": confirm or update.
4. **Seven CV-labelled numeric claims** (Evamastu 4, Aaroh 2, CareConnect 1): confirm they're still current.
5. **Production `VITE_SITE_URL`**, needed for the sitemap, canonical links and share-image URLs when deploying. Deployment remains unapproved.
6. **Still open from before:** CV PDF regeneration, research bylines (legal name), what to do with `/explore`, the guide-api, and merge or deploy approval.

## 5. R3 backlog (not implemented)

| World | Bespoke concept (blueprint §3) | Missing assets and approvals | Gate |
|---|---|---|---|
| GharGyaan | Safety gate (21 lanterns), test wall 214/214, disclosure alcove | Optional: the names of the 21 categories, if documented (M8) | Scope decision D-P1 after CareConnect device results |
| Nexus | Four situation rings, evidence core, "never acts for you" rail | None | D-P1 |
| Evamastu | Cohort garden, two narrowings, features hall (CV-labelled) | Employer permission for any screens or brand art (M1, M2); buildable without them | Owner order |
| Aaroh | Discovery terraces, scaffolded "reset" terrace | Prototype screenshots (M3) | M3 |
| PhonePe Smart Spend Coach | Disclaimer-first study tower, CASE DATA funnel, unbuilt A/B scaffold | 5 Figma screens (M4); trademark decision (M5) | M4, M5 |
| RupeeRadar | Pipeline hall in documented stage order | Screenshots from a fictional statement (M6) | M6 |

Each R3 world reuses `kit.tsx` and follows the CareConnect pattern: content config, a `worlds/<Name>.tsx` scene, a Journey tab only if the data supports it, and its own tests.

## 6. Physical-device QA plan (final gate; nothing here is verified yet)

**Devices:** Android (Chrome), iPhone (Safari), mid-range laptop (Chrome or Edge). **Serve:** the LAN preview instructions given earlier (`serve-lan.mjs`). **Record:** the evidence template given earlier (device, OS, browser, URL, steps, expected, actual, evidence, frequency, severity, measured versus observed).

| ID | Device | Page | Check | Expected |
|---|---|---|---|---|
| D1 | All | `/universe?intro=1` | Load time to a usable Earth; intro; Skip; no sound | Title card at once; intro plays or skips; silent |
| D2 | Phones | `/universe` | Drag, pinch, tap markers; study number matches | Responsive; no page scroll or zoom; correct study |
| D3 | Phones | `/universe?study=40`, `?study=1`, `?study=12` (portrait and landscape) | Selected marker clear of the panel; labels never under the top bar | Marker visible; side panel in landscape |
| D4 | All | `/universe` | Stop touching for 60 s, then touch | Spin pauses, then resumes on touch (new behaviour) |
| D5 | All | `/worlds/careconnect` | Status plaque first; arrival; Skip arrival; touch to skip | Plaque reads "MVP · no users" and the honesty line; flight about 5 s, never over 7 s |
| D6 | All | `/worlds/careconnect` | Journey tab; open screens; swipe in the viewer; Escape or close; focus returns | All 18 reachable; swipe works; nothing stuck |
| D7 | Phones | `/worlds/careconnect` | Portrait: building above the sheet; collapse the sheet; landscape side panel; notch and home-indicator areas | Nothing hidden behind the notch or home bar |
| D8 | Phones | `/worlds/careconnect` and `/universe` | **5-minute sustained session:** battery % before and after (measured); warmth (observed); any stutter, freeze or reload | No freeze or reload; no "hot to touch" |
| D9 | Android and laptop | `/worlds/careconnect` | Frame rate during arrival and dragging (DevTools frame stats, **measured**) | Proposed: median ≥ 30 fps on phone, ≥ 50 on laptop |
| D10 | All | Any 3D page with OS reduced motion on | No flights, no decorative motion; still usable | Static scenes; panels work |
| D11 | Laptop | `/`, `/projects`, `/universe` | Cursor labels, card tilt, page transitions, circular reveal, Back and Forward | As in the Phase 1 and 2 reports |
| D12 | iPhone | `/universe`, `/worlds/careconnect` | Safari's address bar collapsing and expanding; rotation | Panels and buttons stay reachable |

**Release acceptance:** no Critical or High issue on any device; D3, D7 and D12 without overlap; D8 without freeze or reload; D9 measured, not estimated; sound only after a tap.

## 7. Remaining engineering estimate

| Item | Days |
|---|---|
| R1 remainder: fix device-QA findings (unknown until tested), owner items, launch preparation | 2–6 |
| R2 remainder: CareConnect polish after device QA and owner review (camera tuning, sign legibility, possible LOD on phones), visual sign-off | 3–6 |
| R2 coherence links (the Earth's "Related project" link; `/explore` once decided) | 1–3 |
| Release QA for R2 | 2–3 |
| **Pre-launch remainder** | **8–18** |
| R3: six bespoke worlds, each an increment with its own QA | Unchanged from the blueprint (41–54) |

## 8. Git and working-tree status (cloud copy)

- Branch `claude/beautiful-goldberg-radrlu` at `310332f` (= origin). **No commits made.**
- `main` is at `0f453f7`, unchanged. PR #1 is unchanged (draft). Nothing is deployed.
- Uncommitted changes: modified source and test files, new files (kit, layout, motion, the CareConnect scene, the share-card script, 7 share cards, 4 test files) and this document. The blueprint remains untracked.
- Delivery: `gaurav-os-r1-r2.patch`, which is everything above except the blueprint.
