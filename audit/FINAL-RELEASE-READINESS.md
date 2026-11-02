# Gaurav.OS — final release readiness

Started: 2 November 2026 · Branch `claude/beautiful-goldberg-radrlu` · Draft PR gaurav-product/portfolio#1
**Not merged. Not deployed.** Sections 1–4 are the Phase 0 audit, written before any change. Sections 5 onwards record the results.

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

---

## 5. Status: release candidate (P0 = 0, P1 = 0)

There are no open P0 or P1 issues. Mobile performance on three routes is below the 90 target (P2, §8). Merge and deployment wait for the owner's approval.

## 6. What changed

| Phase | Change |
|---|---|
| 1 · Images | Brief images 2 and 7 were imported and mapped by content: 8.webp is Product Leadership, 7.webp is Knowledge & Headquarters. `brand/cinematic/manifest.json` now lists 7 files covering all 8 brief images (1 and 3 share the campus image), with `missing: []`. Every image is AVIF plus WebP at 1600/1200/960/768/480 px, delivered with `<picture>`, explicit width and height, and `srcset`/`sizes`. Original SVGs are kept as a separate library. |
| 2 · Identity | The public name is **Gaurav Singh** in the hero, titles, meta description, Open Graph, JSON-LD, Recruiter Mode, footer and portrait alt. `profile.legalName` ("Gaurav Kumar Singh") is used only on the formal CV (`/cv` and its PDF and filename). Unit and e2e tests enforce this. |
| 3 · Performance | AVIF is about 40 % smaller than WebP. The phone hero went from 89 KB to 36 KB. Hidden desktop copies are never fetched on phones (verified). |
| 5 · Visual | District headers now have the illustration right-anchored with a solid fade under the text, and a uniform scrim on phones. The Explore panel crops the baked wordmark and the misspelt baked tagline. |
| 7 · Ask Gaurav | Two grounded entries were added: clinical/diagnostic status and PhonePe (not employment). Before, "Is Aaroh a diagnostic tool?" returned the *tools used* entry and "Is GharGyaan clinically validated?" returned nothing. |
| 8 · SEO | JSON-LD `Person` + `WebSite` (public facts only, no phone number, no legal name). A new share card is rendered from the world illustration and real text by `scripts/build-og.mjs`. |
| Tooling | `scripts/serve.mjs` cached gzipped files forever, so a rebuild under a running server served stale pages. The cache is now keyed on file mtime. |

## 7. Tests (final build)

| Suite | Result |
|---|---|
| TypeScript | 0 errors |
| Lint | Not configured (see §1) |
| Vitest | **51 / 51** (baseline 48; added: all eight images, AVIF files, public identity, two Ask Gaurav grounding tests) |
| Playwright full suite (desktop 1440 + Pixel 7) | **56 passed, 0 failed, 2 skipped by design**: J12 film autoplay is desktop-only, and one journey needs the drawer that exists only below 1440 px. This includes the zero-dead-control crawler on all **309 routes × 2 viewports**. |
| Re-run after the final metadata change | Unit 51/51; journeys J1–J23 44/44 (2 skipped by design); crawler: see §9 |

Test edits and why:
- Name assertions moved from "Gaurav Kumar Singh" to "Gaurav Singh". The owner changed the public name; the CV download filename assertion is unchanged.
- J19 no longer expects the "image not supplied" note; it now requires every district's illustration to decode.

No test was removed or weakened.

## 8. Lighthouse 12.8.2 (local static server, gzip, simulated slow 4G on mobile)

| Route | Mobile | Desktop | Mobile LCP |
|---|---|---|---|
| `/` | **87** (baseline 84) | 99 | 3.3 s (3.7) |
| `/recruiter` | 93 | 100 | 2.6 s |
| `/projects/careconnect` | 93 | 100 | 2.6 s |
| `/product-thinking/rice` | 93 | 100 | 2.6 s |
| `/research` | 94 | 100 | 2.5 s |
| `/research/90` | 88 | 100 | 3.1 s |
| `/ai-lab` | 89 | 100 | 2.9 s |
| `/explore` | 94 | **89** | 2.5 s |
| `/about` | 94 | 100 | 2.5 s |
| `/districts/ai-safety-lab` | 92 | 100 | 2.7 s |

Accessibility, Best Practices and SEO are **100 on all 22 runs**.

**Targets not met, with root cause:**
- Mobile `/` 87, `/research/90` 88 and `/ai-lab` 89. Image render delay is now 117 ms. These pages are bound by first paint (2.8–3.1 s): a 450 ms render-blocking stylesheet plus the route's JS module preloads share the simulated 1.6 Mbps link.
- Desktop `/explore` 89 is the 3D scene's script cost (270 ms TBT). It is loaded only on that route and only on capable desktops.
- The next lever is inlining critical CSS. It changes the `<head>` React hydrates, which risks hydration errors across 309 pages for about 3 points. It is recommended as a measured follow-up on the real host (HTTP/2 or HTTP/3 CDN), not forced here.

## 9. Accessibility and visual QA

- **Automated checks:**
  - Lighthouse a11y 100 on every audited route.
  - The crawler asserts on every route at both viewports: accessible names, link targets, no dead controls and no horizontal overflow.
- **Manual checks:**
  - **Sound:** muted by default, `aria-pressed`, toggled only by click.
  - **Tour:** status announced with `aria-live`.
  - **District panels:** take focus when opened; Esc closes them.
  - **Loop tabs:** arrow-key roving.
  - **Decorative illustrations:** `alt=""` and `aria-hidden`.
  - **Informative illustrations:** carry an "(Illustration)" alt suffix and a visible tag.
  - **Reduced motion:** gives the 2D map and a static film poster.
- **Screenshots** (`audit/screenshots/release-readiness/`, 22 files, desktop 1440 and mobile 390):
  - Views: home, Explore 3D, Explore map with panel, Recruiter, all six districts, About / How I Think.
  - Each was reviewed by eye.
  - Automated checks on each: 0 overflow, 0 broken images, 0 console errors.
  - Three defects found and fixed before the final set: baked labels behind header text, the double scrim darkening desktop headers, and the panel crop showing the misspelt baked tagline.

## 10. Content audit

| Project | Public status | Matches brief |
|---|---|---|
| Evamastu | Professional · shipped · 20–25 % consistency lift (CV) | Yes |
| Aaroh | Pre-launch · prototype · non-diagnostic · 0 live users | Yes |
| CareConnect | MVP · no users | Yes |
| GharGyaan | Prototype in demo mode · not deployed · **not clinically reviewed** · 4 held-out safety misses disclosed | Yes |
| PhonePe Smart Spend Coach | Academic capstone · "not employment at, or work for, PhonePe" · case data · A/B designed, not run | Yes |

No contradictions requiring a decision. The evidence labels already in use (VERIFIED, CV, CASE DATA, DESIGNED NOT RUN, SELF-REPORTED, NOT DOCUMENTED) are stricter than the brief's suggested set and were kept.

## 11. Remaining issues

| # | Severity | Issue | Recommendation |
|---|---|---|---|
| 1 | P2 | Mobile Lighthouse 87–89 on `/`, `/research/90`, `/ai-lab` (target 90) | Measure on the real CDN. Then trial critical-CSS inlining behind a hydration test. |
| 2 | P2 | Desktop `/explore` 89 (3D) | Acceptable trade-off; the map view scores 94 on mobile |
| 3 | P2 | Canonical URLs, `og:url` and sitemap need `VITE_SITE_URL` at build | Already set by the deploy workflow (verified with a production-config build: 309-URL sitemap, absolute canonical and OG) |
| 4 | P3 | 7 of 90 research pages show the byline "Gaurav Kumar Singh" verbatim from the source repository | Owner decision: keep verbatim, or normalise bylines at build |
| 5 | P3 | Image 7 has a misspelt baked tagline ("BUILDNG"); every layout crops or covers it | Regenerate the image if it should ever show uncropped |
| 6 | P3 | Portrait is provisional artwork | Replace with an original photograph |
| 7 | P3 | No linter configured | Add ESLint in a separate change if wanted |

## 12. Git, PR and deployment

- Commits on `claude/beautiful-goldberg-radrlu`: `b0ec91c` (release-readiness work) and the final commit recorded in the PR description.
- PR gaurav-product/portfolio#1 is **open, draft, not merged**.
- **Nothing deployed.** GitHub Pages still serves `main` → `/docs`. Lovable is untouched.
