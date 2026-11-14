# Cinematic world — Phase 0 audit and plan

Date: 2 November 2026 · Branch `claude/beautiful-goldberg-radrlu` · Draft PR gaurav-product/portfolio#1

## Authoritative implementation

| Candidate | Status |
|---|---|
| **`app/` on this branch** (React 19 · TS · Vite 7 · React Router 7 prerender · Tailwind 4 · R3F · GSAP) | **Authoritative.** 303 prerendered routes, 46 unit + 32 journey tests + full-site crawler passing. Open as draft PR #1. |
| `site/` + `docs/` on `main` | Previous vanilla site; still what GitHub Pages serves. Untouched. |
| Lovable "Gaurav OS" (TanStack Start) | Live at gaurav-os.lovable.app; read-only source of the RoboGuide port. Untouched. |
| `claude/bold-ptolemy-tc1khf`, `claude/ai-product-portfolio-redesign`, `claude/gaurav-os-ai-product-system` | Earlier unmerged experiments; superseded. |

The brief mentions TanStack Start; that is the Lovable project. The GitHub-hosted working
implementation is React Router 7 — no framework migration is needed or planned.

## Features — status

All working and tested: intro film + skip (now AV1/H.264, 3.9 MB), Product Orbit, Constellation,
Atlas, Evolution, Ask Gaurav, Challenge, Lab Notes, Recruiter Mode, Search, evidence labels, case
studies, About, AI Lab, Explore Mode (3D + 2D), RoboGuide, seven PM tools, 90 research reading pages.
Partially meeting this brief: Explore has no guided tour and no sound; districts have no dedicated
pages; district 5 is named "Experience & Growth"; the homepage hero uses the SVG orbit field, not
cinematic imagery.

## Supplied images

| Received file | Content | Role in the brief |
|---|---|---|
| `6.webp` | Campus with six labelled districts | 1 · world hero — also 3 · campus overview |
| `5.webp` | Shield-and-brain lab | 4 · AI & Safety Lab |
| `4.webp` | Book, globe, research panels | 5 · Research & Analytics |
| `3.webp` | Illuminated stairway with four markers | 6 · Professional Experience |
| `2.webp` | Operating loop around a brain cube | 8 · How I Think |
| — | *not received* | 2 · Product Leadership |
| — | *not received* | 7 · Knowledge & Headquarters |

All images are 1670–1672 × 941 WebP, AI-generated, with baked-in text (the Gaurav.OS wordmark and
labels). Image 5 shows decorative charts — it must never read as real data.
**Substitution for the two missing images:** the existing original district SVGs
(`brand/assets/districts/`). Safe, on-brand, replaceable when the images arrive.

## Plan

1. Asset pipeline: originals kept in `brand/cinematic/source/`; optimised WebP at 1600/960/640 px
   (aspect preserved) in `app/public/cinematic/`; separate manifest from the SVG library.
2. Hero: world image as the cinematic backdrop with the tagline; HTML text over a contrast overlay.
3. Districts: rename district 5 to *Professional Experience*; align destinations with the brief;
   a dedicated page per district (`/districts/:id`).
4. Explore: the world image becomes the interactive 2D map (real buttons over each district);
   guided tour; ambient sound toggle (muted by default, generated in-browser — no audio file);
   clear exit to Recruiter Mode.
5. About: "How I Think" with image 8 and the interactive operating loop.
6. SEO: brief's description and tagline.
7. QA: unit, journeys, crawler at both viewports, Lighthouse, screenshots; update PR #1.

Rollback point: commit `0059879` (tagged `checkpoint/pre-cinematic-world` locally; the remote
rejected tag pushes from this session, so the commit SHA is the reference).
