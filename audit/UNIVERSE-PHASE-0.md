# Gaurav.OS — Cinematic Product Universe: Phase 0 audit and plan

Status date: 7 Nov 2026. Branch `claude/beautiful-goldberg-radrlu` at `3834572`.

This is an **audit and proposal only**. No code changed. The brief asks for approval before major existing experiences are replaced, so the decisions in §11 come before Phase 1.

Machine-readable inventory: `audit/universe-asset-inventory.json` (454 files grouped into 139 logical assets).

---

## 1. Architecture report

| Layer | Today | Reuse for the Universe |
|---|---|---|
| App | React 19, React Router 7 static prerender (310 routes), Vite 7, Tailwind 4, GitHub Pages (no server) | Kept. The Universe becomes extra routes, not a new site. |
| 3D | `three` 0.180 and `@react-three/fiber` 9.3, used **only** in Explore Mode (`components/explore/Scene.tsx`, lazy chunk, 269 KB gzip). No Drei. OrbitControls, UnrealBloom and Output pass from three/examples. GSAP 3.13 drives the camera. | Kept. The Earth and building scenes share the same three/R3F chunk. Drei stays optional: OrbitControls is already there, so Drei is added only if a specific helper earns its weight. |
| 3D tiers | WebGL check → 2D map fallback. Automatic `full` / `lite` tier (software renderers get lite). Reduced motion turns off the intro and movement. `?tier=` override for tests. | Kept and extended to `high` / `laptop` / `mobile` / `2D`. |
| Audio | `lib/ambient.ts`: a Web Audio synthesised drone. No audio files. Muted until a click. | Grows into `AudioManager` (§5). Still no autoplay. |
| Intro | `IntroFilm.tsx`: 65 s MP4 on the home page, skippable, `?nointro`. | Kept as the home intro. The Universe gets its own short real-time 3D opening. |
| Projects | `content/projects.ts`: the single source of truth for 8 projects (name, status, role, sections, covers). `/projects` = "Explore my work" film chapters. `/projects/:slug` = case-study pages. | Earth markers and building panels read from this file only. Two concepts are added as a new `kind: "concept"`. |
| Screenshots | `components/Screenshots.tsx` and `brand/screenshot-review/`: 37 real screenshots behind an owner-approval gate (`approvals.json`, all `approved: false`). | Galleries reuse this gate. Unapproved screenshots never ship. |
| Oz | `src/guide/*`: site-wide, lazy panel, grounded local brain, adapters for speech in and out, intents plus navigation. | Gains Universe intents and audio ducking (§8). The state machine, adapters, privacy rules and grounding stay as they are. |
| Tests and QA | Vitest 71, Playwright 71 (desktop and Pixel 7), a11y crawler over 310 routes × 2, Lighthouse script, CI `app-ci` | Extended for every phase. |

## 2. Project inventory (`content/projects.ts`)

| # | Project | Kind | Status (verbatim) | Universe label |
|---|---|---|---|---|
| 1 | Evamastu | professional | SHIPPED | Shipped (employer product) |
| 2 | Aaroh | independent | PRE-LAUNCH · PROTOTYPE | Pre-launch |
| 3 | CareConnect | independent | MVP · NO USERS | MVP |
| 4 | GharGyaan | independent | PROTOTYPE · DEMO MODE | Prototype |
| 5 | PhonePe Smart Spend Coach | academic | ACADEMIC CASE | Academic case study |
| 6 | Nexus | independent | PROTOTYPE · DEMO MODE | Prototype |
| 7 | RupeeRadar | independent | PROTOTYPE · NOT DEPLOYED | Prototype |
| 8 | 90-Day Product Case Studies | research | PUBLISHED | Research |
| + | The Teardown (newsletter, `content/newsletter.ts`) | writing | Weekly, 800 subscribers (self-reported) | Product teardowns |
| new | Interview Radar | **concept** | — | **Concept in development** |
| new | Repass | **concept** | — | **Concept in development** |

- **Excluded as instructed:** RO, KPIOs and Play Pickle are not personal projects anywhere in the code, and they will not be added.
- **Kept:** nothing is removed. The 90 research studies, lab notes, product-thinking tools and districts all stay reachable.

## 3. Asset inventory (summary)

| Group | Logical assets | Notes |
|---|---|---|
| **Actual product UI screenshots** | **37** | CareConnect 18, Nexus 12, GharGyaan 7. From the owner's public repos. **All pending owner approval.** Demo data only. |
| Owner-supplied brand art | 9 (+9 web variants) | Aaroh, CareConnect, GharGyaan, Nexus, PhonePe, RupeeRadar, 90 case studies, The Teardown, Gaurav.OS logo |
| Existing 3D renders (project) | 8 | Procedural three.js stills, labelled ORIGINAL 3D RENDER |
| Cinematic section art | 18 | Districts, section headers, hero |
| Case-study covers | 8 | Illustrations tagged "not a product screenshot" |
| Profile | 1 | Owner-supplied avatar portrait |
| Video | 2 films + 2 posters | Intro film (AV1 1080p, H.264 720p) |
| Gaurav.OS brand | 8 | Wordmarks, icon, favicon, OG |
| UI icons / site graphics | 36 | |
| **Audio files** | **0** | Only the synthesised Explore drone |
| **3D models (GLB/GLTF)** | **0** | All 3D is procedural code |
| Earth textures | **0 in repo** | See §6 for the source |

## 4. Missing asset report

Real screenshots exist only for CareConnect, Nexus and GharGyaan, and none can be used until you approve them. For everything else below, the building will show **labelled** placeholder or concept panels. No generated image will ever be presented as product UI.

| Project | Real product images | Missing (needed for the brief's galleries) |
|---|---|---|
| Evamastu | none (no owner brand art either) | Parent Dashboard and assessment screens. **Employer product: needs employer permission.** |
| Aaroh | brand art only | Screens from the 37-screen prototype (not in any repo) |
| CareConnect | 18 screenshots, pending | **Your approval** in `brand/screenshot-review/approvals.json` |
| GharGyaan | 7 screenshots, pending | **Your approval** |
| Nexus | 12 screenshots, pending | **Your approval** |
| PhonePe Smart Spend Coach | brand art only | The 5-screen Figma capstone prototype (PNG exports) |
| RupeeRadar | brand art only | App screenshots, if the prototype runs |
| 90 case studies / The Teardown | brand art | none needed (text products) |
| **Interview Radar** | **none** | Logo or wordmark, any wireframes. Otherwise concept visuals labelled "CONCEPT VISUAL". |
| **Repass** | **none** | Same as Interview Radar |
| Audio | none | None needed if synthesised sound is approved (§5) |

## 5. Feature preservation plan

Every item below stays, and each gets a regression test before its phase is accepted:

- All 310 routes, normal header navigation, Recruiter Mode, CV, search, Ask Gaurav and the product-thinking tools.
- `/projects` film chapters and `/projects/:slug` case-study pages. These stay as the readable, recruiter-friendly versions, and every 3D building links to its page.
- The current district city in Explore Mode moves to `/explore/city`. District pages stay.
- The home intro film, `?nointro`, the 2D fallback, reduced-motion behaviour and the screenshot approval gate.
- Oz: the 9 states, cursor-following eyes, drag, voice off by default, mic only on press, grounded answers and the refusal line.
- The a11y crawler (0 problems), the e2e suite, Lighthouse budgets and CI.

## 6. Proposed Earth architecture

**Route:** `/universe` (prerendered shell). It is lazy-loaded and shares the three/R3F chunk with Explore.

**Components**

| Component | Role |
|---|---|
| `EarthScene` | Canvas, tier selection, render loop that pauses when the tab is hidden or the canvas is off-screen (`frameloop="demand"` when idle) |
| `Earth` | Day and night shader blend on the sun direction, ocean specular from the roughness map, cloud shell, Fresnel atmosphere glow, star field (instanced points) |
| `EarthController` | Drag to rotate, wheel or pinch to zoom within limits, slow automatic spin that pauses on interaction, keyboard (arrows rotate, +/- zoom, Tab cycles markers) |
| `ProjectMarker` | Instanced light pins, hover and focus state, `aria` mirror in the DOM |
| `ProjectPreview` | DOM card: name, category, status chip, image, one line |
| `CameraDirector` | GSAP timelines: fly to marker, enter world, return to Earth. Shortened or removed under reduced motion. |

**Markers**
- Every project, both concepts and The Teardown sit on a **visual layout**: a golden-angle spiral clustered by category (Healthcare, AI, Fintech, Research and writing, Concepts).
- A caption states that marker positions are navigation points, not where anything was built.

**Accessibility**
- A DOM list of all markers mirrors the scene. It is keyboard- and screen-reader-operable, and it is also the 2D fallback.

**Textures**
- Source: the Earth set shipped in the three.js repository (`examples/textures/planets/`: `earth_day_4096`, `earth_night_4096`, `earth_bump_roughness_clouds_4096`). three.js credits these to **Solar System Scope**, which publishes them under **CC BY 4.0** (derived from NASA imagery).
- That licence requires a visible credit, which I'd put in the Universe footer and on `/about`. **You need to approve this** (decision 2).
- NASA's own servers are blocked from this sandbox, so they can't be used here.

**Budgets**

| Tier | Texture size | Transfer |
|---|---|---|
| `high` | 4K | ≤ 1.6 MB |
| `laptop` | 2K | ≤ 700 KB |
| `mobile` | 1K, no night, no clouds | ≤ 250 KB |

- KTX2/Basis is used if the build pipeline supports it; otherwise WebP.
- Textures load after first paint, and the page is usable before they arrive.

## 7. Proposed cinematic sequence ("Explore my work")

The intro is about 9 s, and **Skip** is visible from frame one.

| Time | Shot | Sound (only if enabled) |
|---|---|---|
| 0.0 s | The page UI fades to letterbox. Deep space with a slow drift of particles. | Low swell |
| 1.0 s | "Gaurav.OS" type, then "Product × AI × Building" | Soft tone |
| 3.0 s | The camera pulls back. The Earth rises from behind, terminator first, with the atmosphere rim lighting up. | Wide pad opens |
| 5.5 s | The Earth rotates into a three-quarter view. Markers ignite one by one by category. | Tiny chime per category |
| 7.5 s | "Explore the Product Universe", then controls fade in | — |

**Controls**
- **Skip intro**, **Replay intro**, **Enter exploration**, **Exit cinematic mode**.
- Exit returns to the page you came from, and Back works as normal.

**Rules**
- Reduced motion: no camera flight. A cross-fade straight to the Earth.
- Second visits skip automatically (remembered).

**Entry point and effects**
- The "Explore my work" CTA opens `/universe`. A secondary link keeps the classic `/projects` list (decision 1).
- Depth of field and bloom are used on the `high` tier only. Motion blur is skipped: on the web it costs a lot and often makes motion feel worse.

## 8. Proposed building architecture

**Approach**
- **Procedural three.js architecture** with physically based materials and environment lighting, built in code. It needs no downloaded models and has no licence risk.
- It will look premium and coherent, but it is **stylised, not photoreal architectural visualisation**. Photoreal buildings would need professionally modelled GLB assets that don't exist; if you can supply or commission them, `BuildingEnvironment` can load GLB instead.

**Shared kit (one per project)**
- `ProjectWorld` holds the scene, camera paths and Back to Earth.
- `BuildingEnvironment` builds the structure from a typed spec: massing, materials, light colour, display slots.
- `ProductImageGallery` puts real images on in-scene glass or screen panels, texture-mapped at the correct aspect ratio. Clicking opens a DOM lightbox with full-resolution, readable images.
- `CaseStudyExperience` is a DOM side panel with the case-study sections from `projects.ts`, in the brief's order, showing only sections that exist.
- Floors and areas map to sections: Overview, Problem, Research, Strategy, Journeys, UI, Decisions, Outcomes (verified only), Learnings.

| Project | Architectural idea (each distinct) |
|---|---|
| Evamastu | Calm pavilion: timber-toned fins, water courtyard, soft dawn light |
| Aaroh | Low healing retreat: curved terraces, green roofs, warm interior glow |
| CareConnect | Glass care campus: two linked wings (family / attendant), emerald and cyan light, handover bridge |
| GharGyaan | Home-scale knowledge house: stacked library volumes, lantern windows |
| PhonePe Smart Spend Coach | Faceted fintech tower: metal and glass, live-chart façade (**illustrative, no data**), "Academic case" plaque |
| Nexus | Research facility: core with orbiting decision rings, data-wall screens |
| RupeeRadar | Low radar station: dish array, statement-ledger screens |
| 90 case studies / The Teardown | Archive tower with 90 lit "volumes"; a teardown workshop with exploded product panels |
| Interview Radar | Glass recruitment command centre: live opportunity boards, interview pods, Delhi NCR map wall (concept) |
| Repass | Ticket hall: floating ticket displays, event zones, trust and verification desk (concept) |

**Mobile**
- One fixed, slowly orbiting hero shot per building with tappable hotspots.
- The case-study panel is full-screen.

## 9. Emerging Ventures (content plan)

- New content entries with `kind: "concept"` and status "Concept in development". They appear in a separate **Emerging Ventures** section on `/projects` and as their own cluster on Earth. They never appear in counts of built projects.
- Copy comes **only** from your brief. Business models are labelled "Hypotheses, not validated".
- Repass's ₹2,000 → ₹1,000 example is labelled "Illustrative example, not transaction data".
- Repass carries a trust note: resale only where the provider's terms and the law permit it. Indian Railways and other restricted bookings are explicitly excluded.
- Oz learns both, with the same grounding rules.

## 10. Audio plan

- **`AudioManager`** is a Web Audio graph with separate buses: master, ambient, interface (UI cues) and Oz-duck. Settings are remembered in localStorage.
- **Sounds** are synthesised in the browser: original, with no files, no downloads and no licence risk. Each cue is a short designed sound (filtered noise swells, FM chimes, low pads) tuned to the brand.
- **Autoplay:** never before a click. Silent mode is the default.
- **`SoundController` (UI):** sound on/off, a volume slider, ambient on/off with UI cues kept.
- **Oz:** speaking ducks ambient by about 12 dB. The intro never triggers Oz speech.
- **Recorded audio:** if you'd rather have recorded cues, they would have to be owner-licensed or CC0 files that you supply. None exist in the repo, and none will be downloaded without a licence.

## 11. Performance plan

**Baseline (last run, `3834572`)**
- Mobile: 86–93. Desktop: 97–100.
- Accessibility, best practices and SEO: 100.
- Explore chunk: 269 KB gzip.

**Budgets for acceptance**
- No page outside the Universe may lose more than 2 points, because nothing 3D loads there.
- `/universe` mobile Lighthouse ≥ 80. Its first paint is the DOM marker list.
- No new dependency above 60 KB gzip without review.
- GPU resources are disposed on route exit. The render loop pauses when the tab is hidden.
- Testing covers the high, laptop and mobile tiers plus the forced 2D fallback.

## 12. Phase-by-phase execution plan

Each phase ends with tests, the crawler, Lighthouse, screenshots, a commit and a push, and your review.

| Phase | Deliverable | Depends on |
|---|---|---|
| 1 | `/universe` shell; cinematic intro with skip, replay and exit; `AudioManager` and `SoundController`; tier detection; DOM fallback | Decisions 1, 2, 4 |
| 2 | Realistic Earth, markers, previews, camera flights, return to Earth, keyboard access | Decision 2 (textures) |
| 3 | `ProjectWorld` kit and buildings for the 7 built projects + research/teardown; real-image galleries where approved | Decision 3 (screenshots) |
| 4 | Emerging Ventures: Interview Radar and Repass content, section and buildings | Decision 5 |
| 5 | Oz: "show healthcare projects", "take me to Repass", "back to Earth"; audio ducking | — |
| 6 | Full QA on desktop, tablet and mobile, WebGL-off, reduced motion, audio on and off, back button; final handover | — |

**Owner decisions needed before Phase 1**
1. Should "Explore my work" open the new Earth (`/universe`), with the current city moving to `/explore/city` and `/projects` kept as the classic list?
2. Use the Solar System Scope Earth textures (CC BY 4.0, with a visible credit line)?
3. Which of the 37 pending screenshots (CareConnect, GharGyaan, Nexus) may appear in the 3D galleries?
4. Synthesised original sound, or owner-supplied licensed audio files?
5. For Interview Radar and Repass: concept visuals labelled "CONCEPT VISUAL", unless you send logos or wireframes?
