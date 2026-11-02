# Phases 2–9 — Build, QA and deployment preparation

Date: 2 November 2026 · Branch: `claude/beautiful-goldberg-radrlu` · **Not deployed.**
`main`, `site/`, `docs/` and the Lovable production site are unchanged.

---

## 1. What was built

A new, independent app in `app/` (React 19 · TypeScript · Vite 7 · React Router 7 with static
prerendering · Tailwind 4 · three.js/R3F · GSAP). **303 routes** are prerendered to HTML.

| Area | Delivered | Notes |
|---|---|---|
| Content system | `app/src/content/*` — typed, every claim carries a status and source | Healthcare CV is the factual reference; MCA = CCSU Meerut; no phone number anywhere |
| Design system | Tokens in `app.css` (`#0B1110`, `#4DFF4D`, `#35D6D0`…), Space Grotesk / Inter / IBM Plex Mono self-hosted, `ui.tsx` components, line icons from the brand library | |
| Navigation | 10 primary destinations, global search (⌘K or `/`), Explore, Recruiter, CV; full nav ≥1440px, accessible drawer below | |
| Home | Hero (name, positioning, capability tags, 4 defined + sourced highlights), district strip, featured projects, capability, experience, research, CTA | Portrait slot not used — no original photograph supplied |
| About / Experience | About with education, certifications, writing, tools, evidence-label legend; timeline + one detail page per role | Employment only; projects are never shown as jobs |
| Projects & case studies | Library with URL-shareable filters + search; 7 case studies on the 28-part template showing only evidenced parts; sticky section nav; previous/next | Evamastu, Aaroh, CareConnect, GharGyaan, PhonePe (academic), Nexus, 90-day corpus |
| PM capability library | 174 capabilities across 10 categories; status *derived* from evidence: 129 demonstrated in work, 11 applied in case studies, 34 not yet evidenced | No percentages or self-ratings |
| Product Thinking | Operating loop, **Product Orbit** (ported), 3 challenges (reasoning after you commit), 7 principles | |
| PM tools (7) | RICE (CSV), MoSCoW (add/edit/move/reorder/drag/delete/reset, Markdown), North Star (Markdown), Funnel (sample vs capstone case data, never mixed; CSV), Experiment (status-gated export), PRD (Markdown), Decision log (seeded from Aaroh's real log; CSV) | Session storage only; CSV export neutralises formula injection |
| Research & Atlas | 90 studies, search + 3 filters + paging, one page per study linking to GitHub; constellation, evolution charts, operating model, evidence formula — all from generated data | 15-section teardowns are **not** reconstructed (see §5) |
| AI Lab | GharGyaan safety architecture + evaluation incl. the 4 held-out misses, principles, Aaroh/Nexus boundaries, experiments, live Ask Gaurav | No fake AI |
| Ask Gaurav | Local KB, refusal before matching, retrieval trace, sources, related-page fallback, clear, error/loading states | Labelled "no live AI model" |
| Recruiter Mode | 30-second view + detailed view, role lenses that only reorder, CV/email/LinkedIn | No 3D, no intro |
| Explore Mode | 6 districts in 3D (on-demand rendering, GSAP camera, orbit controls, reset, Esc), DOM-button twin for keyboard/screen readers, 2D map fallback (mobile, reduced motion, no WebGL, or by choice) | Abstract architecture, labelled as such |
| Intro film | Preserved: first desktop visit, skip, sound toggle, Esc, focus trap, reduced-motion poster | Never in Recruiter Mode |
| CV | `/cv` route + phone-free PDF printed from it | |
| SEO | Per-route title/description/OG, canonical + sitemap when `VITE_SITE_URL` is set, robots, 404 | |

## 2. Existing features — preserved

Intro film ✓ · Product Orbit ✓ · Constellation ✓ (Atlas) · Product Atlas ✓ · Evolution ✓ (Atlas) ·
Ask Gaurav ✓ · Challenge ✓ · Lab Notes ✓ · Recruiter Mode ✓ · Search ✓ · Evidence labels ✓ ·
Work / case studies ✓ · About ✓ · corpus pipeline ✓ (consumed unchanged).

**Not ported — needs your decision:** Lovable's **RoboGuide** component. It is not essential to any
journey and Explore Mode now covers guided discovery. Say if you want it back.

## 3. Tests — executed and results

| Suite | Result |
|---|---|
| TypeScript (`tsc`) | 0 errors |
| Unit + content validation + component (Vitest) | **42 / 42 pass** |
| End-to-end journeys J1–J11 × desktop (1440) and mobile (Pixel 7) | **22 / 22 pass**; J1–J10 also passed 3× repeated under parallel load (60/60) |
| Zero-dead-control crawler, all 303 routes | **0 failures** across 13,714 control instances (3,729 unique: 3,475 links, 169 buttons, 85 fields) |
| Sub-path build (`BASE_PATH=/portfolio/`) | Pages, navigation, CV download and sitemap verified |
| Old suite (`site/scripts/verify.py`) | Unchanged code; 156/156 at Phase 0 |

Content validation fails the build or tests if: the old MCA institution, a phone number, "validated
the MVP" or "SHIPPED" for GharGyaan appears; a skill, source, route, district destination, cover or
manifest file doesn't resolve; or a capability status disagrees with its evidence.

Interaction inventory: `app/reports/interaction-inventory.md`.

## 4. Lighthouse — actual results (Lighthouse 12.8.2)

| Route | Mobile perf | Desktop perf | A11y | Best practices | SEO | Mobile LCP | CLS |
|---|---|---|---|---|---|---|---|
| `/` | 91 | 100 | 100 | 100 | 100 | 2.9 s | 0 |
| `/recruiter` | 93 | 100 | 100 | 100 | 100 | 2.6 s | 0 |
| `/projects/careconnect` | 93 | 100 | 100 | 100 | 100 | 2.6 s | 0 |
| `/product-thinking/rice` | 93 | 100 | 100 | 100 | 100 | 2.6 s | 0 |
| `/research` | 94 | 100 | 100 | 100 | 100 | 2.4 s | 0 |
| `/explore` | 94 | 89 | 100 | 100 | 100 | 2.6 s | 0 |

Accessibility, Best Practices and SEO are 100 on every measured route in both form factors.
Full table: `app/reports/lighthouse/summary.md`.

**Caveats, stated plainly.** Measured on a local static server with gzip, not a CDN. This environment's
Chromium has no H.264 codec, so **the intro film's real cost is not in these numbers**: in Chrome, a
first desktop visit streams the 11.4 MB film. The first run scored mobile 65–68; the fixes were
splitting content data out of the shared bundle, lazy-loading search, compression, and reserving
Explore's layout (CLS 0.42 → 0).

## 5. Outstanding issues and limitations

1. **Real screenshots** (37 in your repos) are not used — awaiting approval.
2. **Portrait** — no original photograph supplied; the hero works without one.
3. **Teardown structure** — the 90 studies show their generated record (summary, metrics, evidence)
   and link to the full text on GitHub. They are not re-cut into the 15-section teardown format,
   because that would mean parsing and restructuring the studies; inventing sections is not allowed.
4. **Research bookmarking** — not implemented; filters and pages have shareable URLs instead.
5. **Theme control** — no light theme, so no control is shown.
6. **Intro film playback** — verified previously on `main`; in this sandbox only the poster path can run.
7. **Physical devices** — mobile is emulated (Pixel 7); 3D was rendered with software WebGL.
8. **CareConnect counts** — CV figures (65 / 30) shown; the repository now reports larger suites.
9. **`main` is still stale** (`docs/` not rebuilt) — untouched, by rule.

## 6. Decisions requiring your approval

1. **Deploy target and URL** — GitHub Pages at `gaurav-product.github.io/portfolio` (replaces the current
   `/docs` site), or Cloudflare/Netlify, or move the `gaurav-os.lovable.app` audience to a custom domain.
2. **Screenshots** — approve any of the 37 real screenshots (captioned "Demo data").
3. **Portrait** — supply an original photograph, or keep the hero without one.
4. **RoboGuide** — drop (current) or port.
5. **Aaroh prototype stack** — still unconfirmed (CV: React + FastAPI; repo: self-contained HTML); omitted.
6. **Merge** — open a pull request from this branch when you are ready to review.

## 7. Rollback

Additive work only, on one branch. Delete or revert the branch to roll back. After any Pages cut-over,
set Settings → Pages back to `main` / `docs`. See `app/README.md`.
