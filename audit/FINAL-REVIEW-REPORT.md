# Gaurav.OS — Final independent review (Windows, 10 Nov 2026)

**No commit, push, merge, deployment or publication has occurred.** v4 was not re-applied. All earlier uncommitted work is preserved: the 60 entries in `git status` at the start are all still present, and this pass added 12 more (11 modified source files and 1 new test file).

This pass ran **directly on `C:\path\to\portfolio-1`** (Windows 11, PowerShell and Git Bash, Node 22.23.4, Playwright Chromium 1243).

## 1. Had the earlier validation completed?

**No.**
- The build had finished (9 Nov, 23:01, 338 routes).
- The browser suite had **not** run. All 176 tests failed in 53 seconds with `browserType.launch: Executable doesn't exist … chrome-headless-shell.exe`, because Playwright's browser had never been installed on this machine. **Zero tests executed.**
- The accessibility audit had not run either.

What this pass did:
- Installed the browser (`npx playwright install chromium`) and ran everything.
- Added that install step to `audit/final-local-checks.ps1`, so the script can't silently fail the same way again.
- Made the script serve the site during the accessibility crawl, which needs a running server.

## 2. Defects found by reviewing the actual site, and fixed

| # | Page | Problem (seen in screenshots or measured) | Fix | File |
|---|---|---|---|---|
| 1 | Every page (phones) | **Oz floated on top of the open menu drawer.** The drawer sat inside the sticky, backdrop-blurred header, so the header's stacking context (`z-40`) trapped it below Oz (`z-45`) | Drawer portalled to `<body>` (`z-55`); focus trap, Escape and focus return unchanged | `components/Header.tsx` |
| 2 | Every page | Footer "Site" list showed **3 links twice**: Project worlds, 90 case studies in 3D and Emerging Ventures | Only the 4 links `NAV` lacks are appended | `components/Footer.tsx` |
| 3 | Every page (phones) | Footer links were 17 px tall at a 23 px pitch, under the WCAG 2.5.8 spacing minimum | 32 px link targets | `components/Footer.tsx` |
| 4 | `/contact` at 320 px | **Page scrolled sideways by 42 px.** The email address can't wrap | Address wraps anywhere; icon doesn't shrink | `routes/contact.tsx` |
| 5 | Unknown URLs (`404.html`) | Shell had an **empty `<body>` and no `<title>`** until JavaScript ran (blank for no-JS visitors and crawlers), and React Router logged its "Hey developer… HydrateFallback" hint in visitors' consoles | Root `HydrateFallback` with title, text and a home link | `root.tsx` |
| 6 | 404 page | Copy read "It may have moved in the rebuild" (internal language) | "The link may be out of date or mistyped." | `routes/not-found.tsx` |
| 7 | `/research/1` | **Broken image icon.** The study's cover image has been deleted on GitHub (HTTP 404, verified) | A failed study image becomes a plain note ("Image unavailable at its source: …"). The study text stays unedited | `routes/research-detail.tsx` |
| 8 | `/worlds` | Card grid in the narrow prose container stopped about 200 px short of the right edge; status pills stretched the full card width; grid flush against the hero | Wide container, pills sized to their text, top spacing | `routes/worlds.tsx` |
| 9 | `/ventures` | Cards flush against the hero's bottom border | Top spacing | `routes/ventures.tsx` |
| 10 | `/about` | Evidence section labelled **itself** (`aria-labelledby="evidence"` pointed at its own id) | Points to its heading `evidence-h` | `routes/about.tsx` |
| 11 | `/about` | The Teardown appeared twice in a row (feature card, then again in the list) | List shows the other writing only | `routes/about.tsx` |
| 12 | `/case-studies` | Template chips looked like buttons, but only the 15 px text was clickable | Whole chip is the link, full height | `routes/case-studies.tsx` |
| 13 | `/atlas`, `/skills/*` | Stacked study and related-skill links: 17 px at a 21 px pitch | 32 px targets | `routes/atlas.tsx`, `routes/skill-detail.tsx` |
| 14 | Project pages (phones) | About 65 px of dead space between the cover art and "All projects" | Less top padding only when art is shown | `routes/project-detail.tsx` |
| 15 | Home (phones) | **Layout shift.** The heading font arrived late on slow links and the swap re-wrapped the hero, pushing the page down. Lighthouse mobile CLS 0.08; traced to a 30 px jump at 1.8 s | Space Grotesk 500/700 (latin, 2 × ~20 KB) preloaded on every page. **CLS 0.08 → 0**; mobile performance 82 → 83; LCP unchanged | `scripts/postbuild.mjs` |

Regression tests for all of the above are in `app/tests/e2e/polish.spec.ts` (8 tests). No existing test was changed, weakened, skipped or removed.

## 3. Reviewed and deliberately not changed

- **`/explore` and `/explore/city` share a title.** It's one page under two addresses, and the canonical already points to `/explore`. That's an alias, not a defect.
- **"TBD" and "Null" text** on `/projects/aaroh` and `/research/90` is real prose (a quoted "TBD", and headings like "The Regulatory Null").
- **The 966 KB three.js chunk** is lazy-loaded on 3D routes only (as reported in v4).
- **The 11 study links with no unique heading** come from the source READMEs (as reported in v4).
- **Oz overlapping a card corner** on wide screens is the floating guide, which can be dragged. That's by design.
- **`VITE_SITE_URL`** is still needed for the sitemap, canonical URLs and share images. It needs your production domain.

## 4. Test results (all run on this Windows machine)

| Check | Result |
|---|---|
| Typecheck | Pass (final code) |
| Unit tests | **107 / 107** (final code) |
| Production build | Pass, **338 routes** (final code) |
| Full browser suite, run A: first fix batch, before fixes 4, 13 and 15 and the full-height chip link in 12 | **174 passed, 0 failed, 0 flaky, 2 skipped** (8.8 min) |
| Affected specs, run B: polish, worlds, journeys, refinements, experience, controls | **111 passed, 0 failed, 2 skipped** |
| Full browser suite, run C: **final build**, 184 tests | **Stopped at 161 / 184** when Claude Code ended background jobs because the system ran critically low on memory. 159 passed, 1 skipped, **1 failed** (see below). **23 tests did not run:** mobile `controls` ×6, `journeys` ×11, `refinements` ×6 |
| The one failure | `universe.spec.ts:83` (Earth filters in the URL): **an intermittent failure that couldn't be reproduced.** It failed once in run C, after 1.3 s, during the memory shortage. Normal passes take 3.6–5.0 s, so it ended early, which fits an aborted run rather than a wrong result; the cause isn't proven. **Every later run on the unchanged final build (01:29) passed:** 3/3 alone; 18/18 with its whole file on 2 workers; and a closing check of **3/3 on 1 worker** (3.9 s, 3.6 s, 5.0 s; no rebuild). It also passed in run A. **The test is unchanged** (its body isn't in the diff), and no code was changed for it. Worth watching if it ever recurs without memory pressure |
| Run D: the 23 tests run C never reached, **final build** (session resumed; 1 worker; 2.7 GB free) | **22 passed, 0 failed, 1 skipped** (J12, desktop-only film). With run C, **all 184 tests have now run on the final build: 181 passed, 2 deliberate skips, and 1 intermittent failure that couldn't be reproduced** |
| **Full suite, final build (runs C + D)** | **184 tests: 181 passed · 2 deliberate skips · 1 intermittent, unreproduced failure (`universe.spec.ts:83`, passed all 7 later runs)** |
| Accessibility (axe, every route) | **0 problems on 338/338, desktop and mobile, on the final build** (also 0/338 on the earlier build) |
| Every route at **320 px** and **360 px** (overflow, page errors) | **0 / 338 problems** (final build). Before fix 4: `/contact` overflowed by 42 px |
| Content sweep, every route (undefined, NaN, TODO, `{{`, missing or odd meta) | 0 real issues; 0 missing descriptions; all titles ≤ 70 characters |
| Lighthouse (spot check, final build) | Accessibility, Best Practices and SEO **100** on every page tested. Mobile performance: home 83, `/about` 88, `/contact` 93, `/research/1` 89, `/projects/careconnect` 88. Desktop: 98–100 |
| `git diff --check` | **Clean** |
| The 2 skips | Deliberate viewport conditions: J12 (film, desktop only) and J17 (drawer, below 1440 px) |

### To repeat the whole check later

`powershell -ExecutionPolicy Bypass -File audit\final-local-checks.ps1`. On this machine, close other heavy apps first: the full suite on 2 workers ran out of memory once.

## 5. Not covered

- **Physical devices.** `audit/DEVICE-QA-RESULTS.md` row D1 is still PENDING. Everything here used emulated viewports.
- **3D scene visuals** were checked by the existing GPU, worlds and universe tests and by page load. They weren't judged by eye frame by frame.
