# Gaurav.OS — the Product Universe: handover

Status date: 7 Nov 2026. Branch `claude/beautiful-goldberg-radrlu`. **Not merged, not deployed.**

The plan and audit are in `audit/UNIVERSE-PHASE-0.md`. Owner decisions (7 Nov 2026):
- `/universe` is the new entry point.
- Solar System Scope Earth textures, used with credit.
- All 37 screenshots approved.
- Sound synthesised in the browser.

## 1. What was built

**"Explore my work" now opens a full-screen cinematic mode at `/universe`.**

- **Intro.** A directed opening of about 9 s.
  - Deep space, then "Gaurav.OS" and "Product × AI × Building".
  - The camera pulls in to a slowly revolving Earth.
  - Markers light up cluster by cluster, then "Explore the Product Universe".
  - Controls: Skip intro (works even while loading), Replay intro, Enter exploration, Exit cinematic mode.
  - Second visits skip the intro automatically.
- **Earth.**
  - A day/night shader with city lights, ocean glint and a drifting cloud shell.
  - A soft atmosphere, axial tilt, and a star field.
  - Drag to rotate, scroll or pinch to zoom; arrow keys and +/- work too. A slow spin pauses on interaction.
- **Markers.** 11 destinations:
  - 7 projects;
  - the 90-day research corpus;
  - The Teardown;
  - 2 concepts.

  They are grouped by cluster: Healthcare, AI, Fintech, Research & writing, Emerging Ventures. Markers fade on the far side of the globe.

  On hover or focus, a preview card follows the marker. It shows the name, category, status label, artwork and a one-line description.

  A caption states that positions are a visual layout, not where the work happened.
- **Into a world.** Clicking a marker turns the globe so it faces the camera and the camera flies in. A cut to black follows, then a crane shot onto that project's own procedural building.
- **Buildings.** 11 distinct archetypes:
  - Evamastu: pavilion with timber fins and a water court.
  - Aaroh: terraced retreat.
  - CareConnect: two-wing glass campus with a handover bridge.
  - GharGyaan: stacked knowledge house.
  - PhonePe: faceted tower with a decorative chart façade (no data).
  - Nexus: research core with orbiting rings.
  - RupeeRadar: radar station.
  - 90 case studies: archive tower with 90 lit volumes.
  - The Teardown: teardown workshop.
  - Interview Radar: recruitment command centre (concept).
  - Repass: ticket hall (concept).
- **Images in the scene.** A curved gallery behind each building shows the project's **real** images at their true aspect ratio:
  - approved screenshots, labelled "Actual product screenshot · demo data";
  - otherwise owner brand art or original renders, labelled as such;
  - a labelled "Product screens not supplied" placeholder where screens are missing.

  Clicking any panel opens a readable lightbox: full resolution, tall screens scroll, and the provenance and source link are always shown.
- **Floor directory.** It lists the project's own case-study sections (only the ones that exist). Clicking a floor opens that section in the panel.
- **Case-study panel.** Three tabs:
  - **Recruiter summary**: role, period, type, status, highlights with evidence labels, and "what this does not show".
  - **Case study**: sections in case-study order.
  - **Gallery.**

  There are also links to "Back to Earth" and "Read the full page". It is a side panel on desktop and a bottom sheet on mobile.
- **Emerging Ventures.** Interview Radar and Repass, using copy from your brief only.
  - Status is "Concept in development", with the note "Not built, not launched and not validated: no users, revenue or results exist".
  - Business models are labelled hypotheses.
  - Repass's ₹2,000 → ₹1,000 example is labelled "Illustrative — not transaction data".
  - Repass carries its legal and trust limits, with Indian Railways explicitly excluded.
  - Pages: `/ventures` and `/ventures/:slug`. They also appear as a separate section on `/projects`, never counted among the builds.
- **Sound.**
  - **Cues:** original, synthesised in the browser for enter, Earth reveal, hover, select, zoom, entering a building, opening a panel, return, and Oz opening.
  - **Ambient:** a calm pad that ducks about 12 dB while Oz speaks.
  - **Control:** on/off, volume, ambient on/off (cues stay), remembered on the device.
  - **Default:** silent. No AudioContext is created before a click; this is tested.
- **Oz.**
  - Requests it now handles: "show me Gaurav's healthcare projects" (also AI and fintech), "take me to Interview Radar", "show me Repass", "take me back to Earth", "what is Repass?" (concept answer), and "Repass revenue" (refused).
  - It shows no speech bubbles inside the cinematic mode.
  - The knowledge pack for the optional AI endpoint now includes the concepts, with an instruction never to describe them as built.
- **Fallbacks.**
  - **No WebGL:** the list view, with every destination and every case study.
  - **No GPU (software rendering):** the list view leads, with "Start the 3D universe anyway".
  - **Reduced motion:** no flights and no intro motion.
  - **Device tiers:** high (bloom, 4K Earth) / laptop / mobile (1K, fewer stars, no clouds).
- **Unchanged and still reachable:**
  - `/projects` (the classic list, linked from the hero as "Project list");
  - every case-study page, Recruiter Mode and the CV;
  - the 3D district city, now also at `/explore/city` (`/explore` still works);
  - Oz everywhere except `/cv`.

## 2. Architecture

```
routes/universe.tsx          page: routing (/universe/:slug?), tiers, intro titles, list, preview card, panels, fades
universe/Scene.tsx  (lazy)   Canvas: stars, Earth OR one world (never both), bloom on high tier
universe/Earth.tsx           Earth shader, clouds, atmosphere, markers, orbit controls, intro / fly / return camera direction
universe/World.tsx           plaza, lighting + studio reflections, 11 procedural buildings, gallery panels, floor directory
universe/Panels.tsx          CaseStudyPanel (recruiter summary / case study / gallery) + Lightbox
universe/audio.ts            AudioManager (Web Audio: buses, reverb, cues, ambient pad, Oz ducking, prefs)
universe/SoundController.tsx sound on/off, volume, ambient toggle
universe/bus.ts              page ↔ scene contract (events + imperative API for keyboard and list)
content/universe.ts          destinations: derived from projects.ts, newsletter.ts, ventures.ts (single source of truth)
content/ventures.ts          Interview Radar, Repass
```

The page owns state and URLs. Back and forward work: each world is its own URL, and "Back to Earth" returns facing the marker you left. The scene only renders and reports back.

## 3. Files

**New**
- `src/routes/universe.tsx`, `src/routes/ventures.tsx`, `src/routes/venture-detail.tsx`
- `src/universe/*` (9 files)
- `src/content/universe.ts`, `src/content/ventures.ts`
- `public/universe/` (7 Earth textures)
- `public/screenshots/` (37 + 37 panel crops, produced by the approval gate)
- `tests/unit/universe.test.ts` and `tests/e2e/universe.spec.ts`
- `audit/UNIVERSE-PHASE-0.md`, `audit/universe-asset-inventory.json`, this file, and `audit/screens/universe/`

**Modified**

| File | Change |
|---|---|
| `routes.ts`, `routes-manifest.ts` | 16 new routes; 326 prerendered |
| `root.tsx` | Site header and footer hidden in cinematic mode |
| `home.tsx` | CTA points to `/universe`; links to "Project list" and "3D city" |
| `projects.tsx` | Universe entry and an Emerging Ventures section |
| `about.tsx` | Credits section |
| `nav.ts`, `Header.tsx`, `Footer.tsx`, `lib/search.ts` | New destinations |
| `guide/*` | Oz intents, bubble suppression, ducking events, knowledge pack |
| `lib/analytics.ts` | Two events |
| `components/Screenshots.tsx` | Uses the light crops |
| `project-detail.tsx` | Screenshots moved out of the section-nav list, where they were invalid markup |
| `scripts/screenshot-review.mjs` | Also writes panel crops and dimensions |
| `brand/screenshot-review/*` | Approvals |

The existing tests were updated for the approved entry-point change: J1, J18, J17, the controls crawler and the content counts.

## 4. Asset mapping and gaps

| Destination | In its world | Missing |
|---|---|---|
| CareConnect | 18 real screenshots + brand art + render | — |
| Nexus | 12 real screenshots + brand art + render | — |
| GharGyaan | 7 real screenshots + brand art + render | — |
| Evamastu | render only + placeholder | Product screens (employer permission needed); owner brand art |
| Aaroh | brand art + render + placeholder | Prototype screens |
| PhonePe Smart Spend Coach | brand art + render + placeholder | Capstone Figma exports |
| RupeeRadar | brand art + render + placeholder | App screenshots |
| 90 case studies / The Teardown | brand art (+ render) | — (text products) |
| Interview Radar / Repass | text-only concept boards labelled "CONCEPT VISUAL" | Logos, wireframes, if any exist |

**3D models and textures**
- No GLB models. All architecture is procedural code.
- Earth textures (Solar System Scope, CC BY 4.0; credit in the Universe footer and on `/about`):

| Map | High | Laptop | Mobile |
|---|---|---|---|
| Day | 4K, 432 KB | 2K, 146 KB | 1K, 40 KB |
| Night | 2K, 53 KB | 2K, 53 KB | 1K, 12 KB |
| Bump / roughness / clouds | 2K, 234 KB | 1K, 72 KB | 1K, 72 KB |

**Audio:** no files. Everything is synthesised in the browser.

## 5. Performance

Lighthouse, local, simulated slow 4G on mobile.

| Route | Before (mobile / desktop) | After (mobile / desktop) |
|---|---|---|
| `/` | 86 / 99 | 86 / 99 |
| `/recruiter` | 91 / 100 | 91 / 100 |
| `/projects/careconnect` | 91 / 100 | 89 / 100 (now carries 18 approved screenshots, served as 16:10 crops) |
| `/about` | 93 / 100 | 89 / 100 (run-to-run variance about ±3) |
| `/universe` | — | 88 / 100 |
| `/universe/careconnect` | — | 89 / 100 (CLS 0) |
| `/universe/repass` | — | 90 / 100 |
| `/ventures` | — | 94 / 100 |

- Accessibility, best practices and SEO: 100 on every run.
- Lighthouse runs WebGL in software with no GPU, so the numbers above measure the list-view path that GPU-less devices get.
- Forcing the 3D scene on that same software renderer scores 32 / 60, with long main-thread tasks from software rendering. **The real 3D cost on a phone or laptop GPU has not been measured here.** It needs testing on real hardware (§8).

## 6. Test results

- `tsc`: clean.
- Vitest: **83/83**, including 11 new tests: destinations match the content modules, concepts are never shown as built, screenshots are labelled and approved, placeholders are never stand-ins, every route is prerendered, and Oz's universe intents work.
- Playwright: **82 passed**, 2 skipped by design (desktop and mobile).
- The 11 universe tests cover:
  - the intro and Skip;
  - no sound or AudioContext before a click;
  - no Oz bubble;
  - the full intro;
  - flying into CareConnect, then the case panel, gallery and lightbox (real image, Escape), Back to Earth and browser Back;
  - concept labelling;
  - the no-WebGL fallback;
  - the no-GPU fallback with "Start 3D";
  - sound preferences being remembered;
  - reduced motion with the keyboard list;
  - Exit cinematic mode and the home CTA;
  - Oz taking a visitor to Repass and back to Earth;
  - the mobile bottom sheet with no overflow.
- Accessibility crawler: 326 routes × 2 viewports, **0 problems**.

## 7. Screenshots

`audit/screens/universe/`: intro, Earth with hover preview, CareConnect world, a concept world, lightbox, mobile, list view, and a contact sheet of all 11 worlds.

## 8. Known limitations

- The buildings are **stylised procedural architecture**, not photoreal architectural visualisation. Photoreal buildings would need modelled GLB assets.
- 3D frame rate and memory have not been measured on real phones or GPUs. Only software rendering was available here.
- Lip-sync and Oz are unchanged. The ambient ducking was not tested with real speech.
- Real-device checks are still needed: iOS Safari, Android Chrome and a mid-range laptop.
- The Evamastu, Aaroh, PhonePe and RupeeRadar worlds show placeholders until real screens are supplied.
- The world camera shifts the picture left on wide screens to make room for the panel. Very wide or very short windows were not checked.

## 9. Run locally

```bash
cd app && npm ci
```

```bash
npm run build && npm run preview   # http://127.0.0.1:4173/universe
```

Useful URL parameters:
- `?tier=high|laptop|mobile` forces 3D on a given tier.
- `?view=2d` shows the list view.
- `?intro=1` replays the intro.

```bash
npm run typecheck && npm test && npx playwright test --trace off && npm run audit
```

## 10. Deployment

There are no new secrets and no server. Everything is static and works with the existing GitHub Pages workflow.

Deploying needs your approval, plus a check on a real phone first.

## 11. Status

| Area | State |
|---|---|
| Earth, markers, previews, flights, return | **Completed** (software-rendered checks only) |
| 11 project worlds, real-image galleries, floor directory | **Completed** |
| Cinematic intro, skip, replay, exit | **Completed** |
| Sound system and controls | **Implemented and tested for behaviour**; the sounds themselves were not listened to here (headless browser) |
| Emerging Ventures pages and worlds | **Completed** |
| Oz universe intents and ducking | **Completed**; ducking implemented but untested with real speech |
| Fallbacks: no WebGL, no GPU, reduced motion, mobile | **Completed** |
| Real-device performance | **Not measured** — needs hardware |
| Screens for Evamastu, Aaroh, PhonePe, RupeeRadar; concept logos | **Requires assets** |
| Photoreal GLB architecture | **Not implemented** (needs modelled assets) |
| Deployment | **Requires approval** |
