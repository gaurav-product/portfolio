# Gaurav.OS — final release readiness

Started: 2 November 2026 · Branch `claude/beautiful-goldberg-radrlu` · Draft PR gaurav-product/portfolio#1
**Not merged. Not deployed.** Sections 1–3 are the Phase 0 audit, written before any change; later sections are filled in as work completes.

## 1. Repository state (verified, Phase 0)

| Check | Result |
|---|---|
| Working tree | Clean |
| Branch | `claude/beautiful-goldberg-radrlu`, local = remote = `e79c495` |
| History | `0059879` (pre-cinematic checkpoint), `efedc90`, `e79c495` all present |
| Rollback point | `e79c495` — local tag `checkpoint/pre-release-readiness` (remote tag pushes are rejected for this session; use the SHA) |
| PR #1 | Open, **draft**, not merged, mergeable (`clean`), 6 commits. Its description predates the cinematic work and needs updating. |
| Production | GitHub Pages still serves `main` → `/docs`; Lovable site untouched; deploy workflow is manual-only |
| Authoritative app | `app/` — React 19 · React Router 7 static prerender · Vite 7 · Tailwind 4 · R3F · GSAP · 309 routes |
| Lint | **No linter is configured** in `app/` (TypeScript strict is the static check). Recorded, not added: a new lint toolchain is out of scope for a release-readiness pass. |

## 2. Assets

| Brief image | Content (inspected) | Repo state at Phase 0 |
|---|---|---|
| 1 · World / homepage | Campus with six districts (`6.webp`) | Integrated as `gaurav-world-hero` |
| 2 · Product Leadership | Product / AI / Building panels beside a roadmap path climbing to a summit (`8.webp`, **new**) | **Missing** — SVG stand-in |
| 3 · HealthTech / world overview | Same campus image as 1 | Integrated (shared) |
| 4 · AI & Safety Lab | Shield-and-brain lab (`5.webp`) | Integrated |
| 5 · Research & Analytics | Book, globe, research panels (`4.webp`) | Integrated |
| 6 · Professional Experience | Illuminated stairway (`3.webp`) | Integrated |
| 7 · Knowledge & Headquarters | Domed library with education, certification, knowledge and people monoliths (`7.webp`, **new**) | **Missing** — SVG stand-in |
| 8 · How I Think | Operating loop around a brain cube (`2.webp`) | Integrated |

`1.webp` in the upload folder is the earlier **homepage UI mock** (fake stats, cards, nav) — a design reference, not an illustration; it is not used as an image anywhere except the provisional portrait crop. All 49 original SVGs remain in `brand/assets/` with their own manifest.

## 3. Baseline (measured on `e79c495`, before changes)

| Check | Result |
|---|---|
| TypeScript | 0 errors |
| Vitest | 48 / 48 |
| Playwright full suite (last run on this branch) | 56 passed, 2 skipped by design |
| Lighthouse mobile | `/` **84**, `/?nointro` 85, `/recruiter` 93, `/projects/careconnect` 95, `/product-thinking/rice` 93, `/research` 94, `/research/90` 87, `/ai-lab` 89, `/explore` 93, `/about` 93, `/districts/ai-safety-lab` 91 |
| Lighthouse desktop | 99–100 everywhere except `/explore` **91** |
| A11y / Best practices / SEO | 100 on all 22 runs |

**Mobile home root cause (measured):** the LCP element is the hero illustration (`gaurav-world-hero-960.webp`, 89 KB). Lighthouse's breakdown shows 1.18 s "element render delay" under simulated slow 4G — the image competes with ~86 KB of fonts and ~160 KB of JS for bandwidth; a 450 ms render-blocking stylesheet precedes first paint.

## 4. Outstanding work and plan

1. **Images 2 and 7** — import, optimise, add to manifest, wire to Product Leadership and Knowledge & HQ, keep SVGs as separate assets.
2. **Public name** — "Gaurav Singh" across titles, meta, OG, hero, Recruiter Mode, footer, structured data; full legal name kept only on the formal CV.
3. **Mobile performance** — AVIF + a phone-sized variant, `<picture>` delivery, verify hidden desktop images never load on phones.
4. **SEO** — OG image with the public name, JSON-LD `Person` + `WebSite`.
5. **Regression** — full Playwright suite incl. crawler; new assertions for the two images and the name.
6. **Visual QA** — 12 required screenshots, reviewed.
7. **Content audit** — check every project's status label against the brief's distinctions.
8. **Report, commit, push, update PR description.** No merge, no deploy.

### Risks known at Phase 0

- Mobile home performance below the 90 target (P2).
- Canonical URLs, `og:url` and `sitemap.xml` need `VITE_SITE_URL`, which depends on the deployment target — not yet chosen (P2, deployment decision).
- Portrait is provisional artwork (P3, owner to replace).
