# Cinematic world: implementation report

Date: 2 November 2026 · Branch `claude/beautiful-goldberg-radrlu` · Draft PR gaurav-product/portfolio#1
**Not deployed and not merged.** Rollback point: commit `0059879` (the state before this brief).
The audit and plan are in `audit/CINEMATIC-PHASE-0.md`.

## What was implemented

| Brief section | Delivered |
|---|---|
| Cinematic images | 5 supplied images kept as originals in `brand/cinematic/source/`. `brand/tools/build_cinematic.py` makes 1600/960/640 px WebP copies (35–187 KB each) in `app/public/cinematic/` and writes `brand/cinematic/manifest.json`. That manifest is separate from the SVG library and records each image's provenance ("AI-generated illustration"), any baked-in text, cautions and where it is used. |
| Hero | The world illustration is a right-anchored backdrop. The tagline is *"Building products with evidence, intelligence and execution."* The name, text and CTAs are real HTML over a solid-to-transparent overlay, so the image's baked-in wordmark and labels never sit behind text. On phones the image shows at its natural aspect above the text. CTAs: Enter Explore Mode, Recruiter Mode, Explore my work, CV, Contact. |
| Six districts | Product Leadership · HealthTech Innovation · AI & Safety Lab · Research & Analytics · **Professional Experience** (renamed from "Experience & Growth") · Knowledge & Headquarters. |
| District pages | A new `/districts/:id` page for each district: illustration, what it represents, destinations, the projects and roles in it, Explore and Recruiter links, and previous/next. |
| Explore Mode | **2D:** the world illustration is the map, with a real button over each district. Positions are tested to within 1.5 % of the image. **3D:** the existing scene, re-laid out to match the illustration. **Both:** guided tour (6 stops; Previous/Next/End; announced to screen readers; the 3D camera flies to each stop). The panel shows the district image and links to its page. There is also reset camera, map/3D switch, Esc to close, and a clear **Exit to Recruiter Mode**. |
| Sound | An ambient drone generated in the browser with Web Audio, so no audio file is downloaded. It is **off by default**, starts only on a click, has `aria-pressed` and fades in and out. |
| How I Think | A section on About with the loop illustration (labelled "Illustration") and the interactive OBSERVE → … → ITERATE loop. Each stage shows its evidence. Arrow keys move between stages. The same component now powers Product Thinking. |
| Section headers | AI Lab, Research and Experience use their district illustration as a hero backdrop, with the overlay keeping text contrast. |
| SEO | The description is *"Gaurav Kumar Singh — Product Management, AI and Digital Product Building."* followed by the tagline. |

## What changed (files)

New:
- `app/src/content/cinematic.ts`
- `app/src/components/CinematicImage.tsx`
- `app/src/components/OperatingLoop.tsx`
- `app/src/lib/ambient.ts`
- `app/src/routes/district.tsx`
- `app/tests/e2e/cinematic.spec.ts`
- `brand/cinematic/`
- `brand/tools/build_cinematic.py`

Changed:
- `districts.ts` and `types.ts`: rename, images, map positions.
- `home.tsx`, `explore.tsx`, `about.tsx` and `product-thinking.tsx`.
- `ai-lab.tsx`, `research.tsx` and `experience.tsx`: hero backdrop.
- `ui.tsx`: optional `PageHero` backdrop.
- `Scene.tsx`: layout, the HQ halo now floats over the centre district, and camera framing.
- `routes.ts` and `routes-manifest.ts`.
- `profile.ts`: tagline and SEO.
- `prepare-data.mjs`: copies the manifest.
- Tests and the Playwright config.

## Preserved

Every existing feature is preserved:
- Intro film and skip
- Recruiter Mode (still loads no 3D, film or diagram code)
- Search
- All case studies
- 90 research reading pages
- Seven PM tools
- AI Lab, Ask Gaurav and RoboGuide
- Product Orbit
- Atlas
- Evidence labels
- Portrait
- CV
- Contact
- 3D scene with keyboard twin
- 2D fallback, chosen automatically on phones, under reduced motion or without WebGL

The routes went from 303 to **309**, adding six district pages; none were removed.

## Tested (actual results)

| Suite | Result |
|---|---|
| TypeScript | 0 errors |
| Vitest | **48 / 48**. New checks: every cinematic file exists and is labelled as an illustration, each district image resolves or falls back to an SVG, and the route count includes the district pages. |
| Playwright, full suite | **56 / 56 pass**, 2 skipped by design (film autoplay is desktop-only; the drawer exists below 1440 px), desktop 1440 + Pixel 7. Includes the zero-dead-control crawler on all 309 routes at both viewports (0 failures) and new journeys J18 hero, J19 all six district pages, J20 map hotspot alignment (±1.5 %) and clicks, J21 guided tour, J22 sound off by default and toggle, J23 How I Think loop. Journeys re-run on the final build: 44 / 44. |
| Lighthouse 12.8.2 (local, gzip) | A11y, Best Practices, SEO **100 on all 22 runs**. Mobile perf: `/` 85 (was 89 — the hero illustration is now the phone LCP image, 3.6 s), `/recruiter` 93, `/research` 94, `/ai-lab` 89, `/explore` 93, `/about` 93, `/districts/ai-safety-lab` 91, `/research/90` 88. Desktop 99–100, `/explore` 88 (3D). Page-hero backdrops are desktop-only and lazy so they cost phones nothing. |
| Visual check | Home, Explore (map, panel, 3D, tour), district pages, About and AI Lab at 1440 and 390: no console errors and no horizontal overflow |

## Incomplete / limitations

1. **Two images were not received.** Brief image 2 (Product Leadership) and image 7 (Knowledge & Headquarters) are missing; five arrived. Those districts use the original vector illustrations, and their pages say so. To add them, drop each file into `brand/cinematic/source/` and register it in `build_cinematic.py`. Then set `image` on the district in `app/src/content/districts.ts`.
2. All five images contain **baked-in text**, such as the Gaurav.OS wordmark and district labels. Layouts keep that text away from real copy. The research image shows **decorative charts**; its manifest entry says they are not data, and it is never captioned as evidence.
3. The 3D buildings are abstract. The illustrated buildings cannot be reproduced faithfully in real-time 3D without modelled assets. The map view uses the illustration itself.
4. **Home mobile performance 89 → 85** — the price of the illustrated hero on phones. If you prefer speed, the phone image can be dropped (desktop keeps it).
5. Ambient sound was tested for state only (on/off, `aria-pressed`, no file). How it sounds is a matter of taste: listen and decide.

## Decisions needed

1. Supply images 2 and 7, or keep the vector stand-ins.
2. The SEO name: the brief said "Gaurav Singh"; the site uses **"Gaurav Kumar Singh"** to match the CV and every other page. Say if you want the shorter form.
3. Approve PR #1 for merge and deployment when ready. Nothing deploys automatically.

---

## Addendum: release readiness (2 Nov 2026)

- **All eight brief images are integrated.** Image 2 (Product Leadership, `8.webp`) and image 7 (Knowledge & Headquarters, `7.webp`) replace the SVG stand-ins, and the manifest has `missing: []`. Limitation 1 above is closed.
- Every illustration is now AVIF plus a WebP fallback at 1600/1200/960/768/480 px. The mobile home LCP image is 36 KB (was 89 KB), and mobile home Lighthouse moved from 84 to 87.
- The public name is now "Gaurav Singh". The decision-needed item 2 above is resolved by the owner.
- Full results, the remaining issues and the acceptance gate are in `audit/FINAL-RELEASE-READINESS.md`.
