# Gaurav.OS — implementation report

Updated: 2 November 2026 (final review and refinement) · Branch: `claude/beautiful-goldberg-radrlu`
**Not deployed and not merged.** `main`, `site/`, `docs/` and the Lovable production site are unchanged.

---

## 1. What exists

A new, independent app in `app/` — React 19 · TypeScript · Vite 7 · React Router 7 (static
prerendering) · Tailwind 4 · three.js/R3F · GSAP. **303 routes** prerender to static HTML; nothing
depends on Lovable.

| Area | State |
|---|---|
| Content | Typed modules in `app/src/content/`; every claim carries an evidence status and a source. Healthcare CV is the factual reference. MCA = Chaudhary Charan Singh University, Meerut. No phone number in any public file. |
| Home | Positioning, capability tags, four defined and sourced highlights, **provisional portrait** (replaceable), district strip, featured work, capability, experience, research, CTA, intro film |
| Recruiter Mode | 30-second and detailed views, role lenses that only reorder, CV/email/LinkedIn. Loads no film, 3D or diagram code (tested). |
| Case studies | Five featured projects rewritten from their own evidence documents — discovery, framing, strategy, prioritization, execution, metrics, trade-offs, learnings where supported; each section cites its document. Evamastu (employer work) states what is not documented instead of filling it. |
| Research | **Full reading pages for all 90 studies** — original text and citations rendered from the case-study repository at a pinned commit, ASSUMPTIONS files where they exist, contents, evidence header, previous/next. Text is never in a JavaScript bundle. |
| Product Thinking | Operating loop, Product Orbit, three challenges, principles, **seven working tools** (RICE, MoSCoW, North Star, funnel, experiment, PRD, decision log) |
| AI Lab / Ask Gaurav | GharGyaan safety architecture and evaluation incl. the four held-out misses; local Q&A that refuses before matching; **RoboGuide** ported |
| Explore Mode | Six 3D districts (on-demand rendering), keyboard/screen-reader twin, 2D fallback |
| Screenshots | Review sheet and approval gate for the 37 real screenshots; **none published** until approved |
| Intro film | **11.4 MB → 3.9 MB AV1 1080p / 3.8 MB H.264 720p**; behaviour preserved |

## 2. This round — requested refinements

| Request | Done | Detail |
|---|---|---|
| Hosting | Prepared, not deployed | Manual-only Pages workflow; CI uploads a downloadable **site-preview** artifact on the PR |
| Screenshots | Review sheet, no publishing | `brand/screenshot-review/` — contact sheets, `inventory.json`, `approvals.json` (all `false`). Approved ones render on case studies labelled “Demo data”. |
| Portrait | Provisional, replaceable | The circular avatar was pasted in chat and never reached disk; the homepage mock you sent is on disk, so the portrait is cropped from it (370 px WebP, 29 KB). Swap by changing `profile.portrait` in `app/src/content/profile.ts`. |
| RoboGuide | Ported | Inspected the Lovable original. It is a decorative, aria-hidden robot head: damped pointer tracking, static under reduced motion and on touch, paused off-screen, and one behaviour-linked state — it “attends” while the visitor types into Ask Gaurav. Ported faithfully beside Ask Gaurav (where that state means something). No AI, no network. |
| Aaroh stack | Unconfirmed | Not stated anywhere; the repo describes a self-contained HTML prototype and the CV says React/FastAPI |
| A · Research pages | Done | 90 studies, 1.03 M rendered words (corpus: 1.11 M incl. diagram source). 377 Mermaid diagrams render on demand — 374 render, 3 show their source (measured). |
| B · Case studies | Done | Sources: CareConnect `docs/09-portfolio/case-study.md`, decision log, metrics; GharGyaan `docs/01–16`; PhonePe `task-5-prd-lite.md`, `part-c-full.md`, README; Aaroh `ROADMAP.md`, `north-star-metric.md`; Evamastu CV only |
| C · Functional audit | Done | §3 |
| D · Film | Done | §4 |
| E · Screenshots | Done | Desktop + mobile set delivered with the PR |

**Found and fixed during this round**
- **Phone number in published research text** — Days 6 and 7 of the case-study repo end with “Phone: +91 …”. Redacted at build (“[phone number removed — available on request]”), logged, and guarded by a test. *The number is still public in that GitHub repository — consider removing it there.*
- 179 in-document links in the studies point at headings that do not exist in the source; they render as plain text instead of dead links. Anchors otherwise follow GitHub's algorithm so the studies' own contents lists work.
- Missing images referenced by studies render as “Image not in the repository: …” instead of broken icons; shields.io badges render as their label and value (no third-party requests).
- Mobile drawer stayed open when tapping the current page's link.
- AI Lab overflowed by 198 px on 390 px phones (grid blowout from a wide table) — fixed globally; the crawler's overflow check had been masked by mobile emulation and now measures against the device width.
- The H.264 fallback was first encoded at level 5.0; re-encoded at 3.1 for older phones.

## 3. Tests — actual results (final build)

| Suite | Result |
|---|---|
| TypeScript | 0 errors |
| Vitest — unit, content validation, components | **46 / 46** |
| Playwright — journeys J1–J17, desktop 1440 and mobile Pixel 7 | **32 / 32 pass**, 2 skipped by design (film autoplay is desktop-only; the drawer exists below 1440 px) |
| Zero-dead-control crawler, every route at both viewports | **0 failures** — 303 routes × 2, **47,760** control instances (30,936 unique) |
| Visual check, 12 key pages at 1440 and 390 | 0 horizontal overflow, 0 console errors |

Journeys cover: explore → case study → home; recruiter → CV download (real PDF); search (keyboard, clear,
no-results); RICE add/calculate/export; MoSCoW add/move/reorder/edit/delete; PRD export; research
filter → reading page → back; Ask grounded answer, refusal, validation, clear; Explore select/reset/Esc;
mobile menu → project → back → contact form validation; Product Orbit keys; intro film first-visit
play, sound toggle, skip, no replay, replay, Esc; reduced-motion poster; recruiter loads no heavy code;
reading page contents, assumptions tab, redaction; portrait and RoboGuide attention; every drawer link.

Interaction inventory: `app/reports/interaction-inventory.md`.

## 4. Performance — actual results

**Lighthouse 12.8.2**, local static server with gzip (as Pages serves it), no CDN:

| Route | Mobile perf | Desktop perf | A11y | Best practices | SEO | Mobile LCP | CLS |
|---|---|---|---|---|---|---|---|
| `/` | 89 | 100 | 100 | 100 | 100 | 3.1 s | 0 |
| `/recruiter` | 93 | 100 | 100 | 100 | 100 | 2.6 s | 0 |
| `/projects/careconnect` | 93 | 100 | 100 | 100 | 100 | 2.6 s | 0 |
| `/product-thinking/rice` | 93 | 100 | 100 | 100 | 100 | 2.6 s | 0 |
| `/research` | 94 | 100 | 100 | 100 | 100 | 2.5 s | 0 |
| `/research/90` (full study) | 88 | 100 | 100 | 100 | 100 | 3.1 s | 0 |
| `/ai-lab` | 88 | 100 | 100 | 100 | 100 | 3.1 s | 0 |
| `/explore` | 94 | 89 | 100 | 100 | 100 | 2.6 s | 0 |

Accessibility, Best Practices and SEO: **100 on all 18 runs.** Mobile home dropped 91 → 89 with the
portrait image (it is the LCP element on phones).

**Intro film — measured directly** (Lighthouse stops before the film streams):

| | Before | After |
|---|---|---|
| File | 11.4 MB H.264 1080p | 3.9 MB AV1 1080p (preferred) · 3.8 MB H.264 720p level 3.1 (fallback) |
| Quality vs original (SSIM at 720p) | — | 0.980 AV1 · 0.975 H.264 |
| First desktop visit, 20 s of playback | ≥ 11.4 MB film | 3.67 MB film · 4.51 MB total |
| First mobile visit | no film | no film · 0.70 MB total |
| Recruiter Mode | no film | no film (tested) |

## 5. Known limitations

1. **Portrait is provisional** — cropped from the homepage mock (AI-styled artwork, 370 px). Replace with an original photograph.
2. **No screenshots are published** — 37 await your review.
3. **Evamastu** is employer work: its case study is limited to CV facts and lists what is not documented.
4. **Aaroh's prototype stack** remains unconfirmed and unstated.
5. **CareConnect and GharGyaan** ran no primary user research — stated on both case studies.
6. **Research text** is the pinned commit `60c3c9b`; newer edits in that repository need the lock updated. 179 internal links in the source point at missing headings. 374 of 377 Mermaid diagrams render; 3 (Day 3: 1, Day 10: 2) fail to parse and show their source text instead (`app/scripts/mermaid-audit.mjs`).
7. **Search** indexes study summaries, not full study text (to keep the search bundle small).
8. **Physical devices** — mobile is emulated (Pixel 7, 390 px); 3D is tested with software WebGL.
9. Lighthouse runs locally; a CDN with HTTP/2 or 3 would typically do better, not worse.
10. **`main` is still stale** (`docs/` not rebuilt) — untouched by rule.

## 6. Preview (no deployment)

- **Pull request CI artifact:** open the PR → Checks → *app-ci* → Artifacts → **site-preview**. Unzip and serve the folder (e.g. `npx serve` inside it).
- **Locally:**
  ```bash
  cd app && npm ci && npm run build && npm run preview
  ```
  then open http://127.0.0.1:4173.
- Screenshots of the key pages at desktop and mobile accompany the PR.

## 7. Deployment (after your approval only)

1. Merge the PR into `main` when you approve it.
2. Repository Settings → Pages → Source → **GitHub Actions**. (Today Pages deploys `main` → `/docs`; this switch replaces that site at the same URL.)
3. Actions → **app-deploy-pages** → *Run workflow*. Defaults: `site_url = https://gaurav-product.github.io/portfolio`, `base_path = /portfolio/`.
4. Verify the live URL, CV download and a few routes.
5. Optional later: point a custom domain (or the audience of `gaurav-os.lovable.app`) at Pages; rebuild with that `site_url` and `base_path = /`.

## 8. Rollback

- **Before merge:** close the PR or delete the branch. Nothing else changed.
- **After merge, before Pages switch:** `git revert` the merge commit. The `/docs` site keeps serving.
- **After the Pages switch:** Settings → Pages → Source → *Deploy from a branch* → `main` → `/docs`. The previous site returns immediately.
- **Custom domain moves:** point DNS back to the previous host (Lovable).
- Lovable's project is untouched throughout.

## 9. Decisions still needed

1. Approve the PR for merge (no deploy happens on merge).
2. Approve deployment and the target URL.
3. Approve any of the 37 screenshots (`brand/screenshot-review/approvals.json`).
4. Supply an original portrait photograph when ready (or keep the provisional one).
5. Confirm Aaroh's prototype stack when verified.
6. Optionally remove your phone number from Days 6 and 7 in `product-management-case-studies`.
