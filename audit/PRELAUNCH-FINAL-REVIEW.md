# Gaurav.OS — Pre-launch final review (Windows, updated 14 Nov 2026)

## 00. Publication, 14 Nov 2026 (current status; everything below §00 is the pre-launch record)

**Published.** The site is live at **https://gaurav-product.github.io/portfolio/**, deployed from `main` at merge commit `e0bc2c423bda1d5d6c8bc9d2c2c131d4ae0d5e1d`.

| Item | Result |
|---|---|
| Release commits | `e9f9598` (production release), `c71d23a` (45-second introduction film), `81253e4` (CI test fix) |
| PR | [#1](https://github.com/gaurav-product/portfolio/pull/1), "Gaurav.OS — Production Release with Introduction Film". Marked ready, then merged into `main` with a merge commit on 14 Nov 2026, 11:23 UTC. Merge commit `e0bc2c4`, parents `0f453f7` (old `main`) and `81253e4` |
| CI on `c71d23a` | Push run 43581931263 passed. PR run [43581935650](https://github.com/gaurav-product/portfolio/actions/runs/43581935650) failed one test: 196 passed, 1 failed, 1 skipped (see note) |
| CI on `81253e4` (final head) | Push run [43588774153](https://github.com/gaurav-product/portfolio/actions/runs/43588774153) and PR run [43588782097](https://github.com/gaurav-product/portfolio/actions/runs/43588782097): both **passed every step**. Typecheck; unit tests 115 / 115; build; Playwright **197 passed, 0 failed, 1 skipped** (2 workers); `reports` and `site-preview` uploaded |
| Pages configuration | Source: GitHub Actions (`build_type: workflow`). No custom domain, no CNAME, HTTPS enforced. Enabled 14 Nov 2026 |
| Deploy workflow | `app-deploy-pages.yml` run [43589948307](https://github.com/gaurav-product/portfolio/actions/runs/43589948307) from `main`, with `site_url=https://gaurav-product.github.io/portfolio` and `base_path=/portfolio/`. `build` succeeded (unit tests, build, Pages artifact), and so did `deploy`: deployment 7786874156 to `github-pages`, state success, environment URL https://gaurav-product.github.io/portfolio/ |
| Earlier deploy attempt | Run 43589819356 failed at `npm run build` and deployed nothing (`deploy` skipped). Git Bash rewrote the `base_path` input sent from the dispatching shell into a Windows path. The run was re-dispatched with path conversion off. There was no code change |
| Local results (final source) | Typecheck clean; unit tests 115 / 115; Playwright 197 passed / 0 failed / 1 skipped (1 worker, 6 shards); accessibility (axe) 338 / 338 routes with 0 problems on desktop and on mobile |

**Note on the CI failure.** In PR run 43581935650, the test "leaves new-tab clicks, same-page anchors and downloads alone" timed out: the Ctrl/Cmd-click completed, but no new tab opened within 60 s.
- **Not a product bug:**
  - The link is a plain link, and `Transitions.tsx` ignores modified clicks.
  - With the CPU slowed 6× and 20×, 25 / 25 Ctrl-clicks reached the link and opened a new tab.
  - The same test passed in the push run of the same commit and in about 30 earlier runs.
- **Fix in `81253e4`:** the test now waits until the link (inside the scroll-driven `.chapter-copy` reveal) is still. It also asserts that the click reached the link with Ctrl/Cmd held. All original assertions are kept.

**Live smoke test, 14 Nov 2026.** Run against https://gaurav-product.github.io/portfolio/ in Playwright Chromium at desktop 1440 × 900 and an emulated Pixel 7: **68 / 68 checks passed, 34 per viewport.**
- **Film section:** present below the hero. The player has native controls, `playsInline`, `preload="none"`, no autoplay, and `object-fit: contain` in a 9:16 frame (342 × 608 on desktop, 322 × 572 on mobile).
- **Film files:**
  - Poster `/portfolio/media/gaurav-os-intro-45s-poster.webp` loads at 720 × 1280.
  - No film bytes are requested before play.
  - The film streams with HTTP 206 range responses. `/portfolio/media/gaurav-os-intro-45s.mp4` is served as `video/mp4`, 22,267,671 B, with its index first.
- **Playback:** the hero button "Watch the intro film · 0:45" scrolls to the player and plays it.
  - The film is 1080 × 1920 and 45 s long, unmuted at volume 1, with audio decoded.
  - Pause holds, and a seek to 0:40 works.
  - Focus lands on the player.
- **Routes:** 17 routes load directly with HTTP 200 and a `main` region. A direct load is the same as a refresh on nested routes.
  - `/`, `/universe`, `/universe?at=earth`, `/worlds`, `/worlds/careconnect`, `/worlds/nexus`, `/worlds/phonepe-smart-spend-coach`
  - `/research/1`, `/research/7`, `/about`, `/skills`, `/projects`, `/projects/careconnect`, `/recruiter`, `/tour`, `/explore/city`, `/contact`
- **Navigation:** reloading `/research/7` keeps the page. Back and forward work.
- **404 page:** an unknown URL returns HTTP 404, and the rendered page is `noindex`.
- **Console and network:** no console errors other than the one expected on the deliberate 404 test. No failed requests, and no horizontal overflow on the homepage.
- **External hosts:** only `raw.githubusercontent.com`, for case-study images at the pinned source commit.
- **Sitemap and robots:** all 327 sitemap URLs return 200 with canonicals on the production URL. `robots.txt` points to the production sitemap.

**Not done:** testing on a real phone (Android or iPhone / Safari) or on a real laptop GPU. Captions for the introduction film are not present.

---

**Pre-launch record (12 Nov 2026), kept for history.** At that time, nothing was committed, pushed, merged, deployed or published. HEAD is still `310332f` on `claude/beautiful-goldberg-radrlu`. Nothing is staged and there are no stashes. All uncommitted work is preserved: **93 `git status` entries (63 modified, 30 untracked)**. The 12 Nov passes added one untracked folder, `app/public/studies/`. No file was reverted, stashed or deleted.

Everything ran on `C:\path\to\portfolio-1` (Windows 11, Node 22.23.4, Playwright 1.63 Chromium; WebGL via SwiftShader in headless runs). Heavy work ran in the foreground, one step at a time, because the machine is short of memory.

## 0. Final results, 12 Nov 2026 (supersede §1)

Production configuration: `VITE_SITE_URL=https://gaurav-product.github.io/portfolio/`, `BASE_PATH=/portfolio/` (the defaults of the manual `app-deploy-pages.yml` workflow). The test suite and the audits ran on a root (`/`) build of the same final source. The production checks ran on the `/portfolio/` build.

| Check | Result |
|---|---|
| Typecheck | **Pass** |
| Unit tests (Vitest) | **114 / 114 passed** (7 files) |
| Full Playwright suite: 1 worker, 6 shards run one after another | **198 tests: 196 passed, 0 failed, 2 skipped**. By shard: 33 / 33 / 33 / 32 + 1 skipped / 33 / 32 + 1 skipped |
| The 2 skips | Unchanged viewport conditions: J17 (`refinements.spec.ts:83`, desktop) and J12 (`refinements.spec.ts:4`, mobile) |
| Previously failing `[mobile] controls.spec.ts:20` "every control works — shard 4/6" | **Passed**: 38.0 s alone, and again inside shard 6. Before the fix it timed out at 240 s twice |
| `gpu.spec.ts:94` (Earth textures while studies are selected), `--repeat-each=5` | **5 / 5 passed** |
| Whole `gpu.spec.ts`, `--repeat-each=2` | **10 / 10 passed**, including the system ⇄ Earth round trips that check disposal |
| Earth texture trace (64 study selections) | 12 at open, 12 at every step, 12 after settling |
| Accessibility, desktop (every route) | **338 / 338 audited, 0 problems.** `/research/7`: HTTP 200, 0 axe violations, 1 h1, no errors |
| Accessibility, mobile (every route) | **338 / 338 audited, 0 problems.** `/research/7`: same as desktop |
| `/portfolio/` production build | **Pass**: 90 studies, 338 prerendered routes, 0 missing HTML |
| PhonePe logo checks (`/research/7`, desktop and mobile, load and refresh), root and `/portfolio/` | **20 / 20 passed on each build**: both logos load from the local copy, alt and width are kept, no request to Wikimedia, no console errors |
| Earlier base-path fix checks (Practo note, 404 canonical, cursor "Explore") | **22 / 22 passed** |
| Smoke checks: 13 routes (now including `/research/7`) × desktop and mobile, direct load and refresh, plus client-side navigation | **No real issues.** The 4 entries logged are the browser's "404" console message on the not-found page itself (expected) |
| 3D checks: solar system, Earth, CareConnect, PhonePe, Teardown (load and refresh) | **0 issues.** Textures 14 / 12 / 56 / 16 / 6; every texture request is local, under `/portfolio/`, none failed. The cursor shows "Explore" |
| Static checks of the `/portfolio/` build | Canonicals: 327 indexable pages, none missing, none off the production URL. Sitemap: 327 URLs, none outside, no duplicates, all resolve. `robots.txt` points at the sitemap. **21,837 internal `href`/`src` checked: 0 broken, 0 outside `/portfolio/`.** `404.html` and `.nojekyll` are present |
| `git diff --check` | **Clean** (exit 0; only Git's CRLF notices) |

### 0.1 Changes made on 12 Nov (all uncommitted)

| File | Change |
|---|---|
| `app/scripts/build-studies.mjs` | (a) The dead Day 01 Practo cover (HTTP 404, no copy in the source repo) becomes, at build time, the same "Image unavailable at its source" note the page already showed at runtime. The browser no longer makes the doomed request. (b) The Day 07 PhonePe logo (2 `<img>` tags) now points to a local copy, with the deploy base path. Alt, width and position are unchanged. The case-study source is not edited |
| `app/public/studies/phonepe-logo.svg` (new) | The original Wikimedia Commons file, byte for byte (SHA-1 `bd5e6743…0385`, 7,499 bytes) |
| `app/public/studies/SOURCES.txt` (new) | Where the logo came from, its licence and when that was checked (see below) |
| `app/src/interaction/Cursor.tsx` | Route checks strip the deploy base, so 3D-world links show "Explore" under `/portfolio/` too |
| `app/src/routes/not-found.tsx` | No canonical and no `og:url` on the not-found page; `noindex` kept |
| `app/src/universe/Earth.tsx` | The 8 region-label textures are uploaded once, when the Earth opens (`gl.initTexture`), instead of the first time each turns into view. The same textures are reused, and disposal on unmount is unchanged. Uploading them costs 0.7–2.4 ms (software GL), and the Earth opens in about 1.3–1.4 s, so there is no noticeable delay |

**PhonePe logo licence.** Checked on 12 Nov 2026 through the Wikimedia Commons API for `File:PhonePe_Logo.svg`:
- Licence: Public domain ("PD-textlogo"). Attribution is not required.
- Restriction: "trademarked". The logo is used only to identify the company in the study.
- The study already credits the Commons page, in its header and in reference [22]; that text is unchanged.

## 1. Results of the 11 Nov pass (historical; see §0 for current results)

| Check | Result |
|---|---|
| Typecheck (`react-router typegen && tsc`) | **Pass** |
| Unit tests (Vitest) | **114 / 114 passed** (112 before this pass + 2 new) |
| Production build | **Pass, 338 prerendered routes** |
| Full Playwright suite, run in 3 batches on 2 workers | **198 tests: 196 passed, 0 failed, 0 flaky, 2 skipped** (3.4 + 5.0 + 1.4 min) |
| The 2 skips | Deliberate viewport conditions, unchanged: J12 (film, desktop only) and J17 (drawer, below 1440 px) |
| Accessibility (axe-core + heading, duplicate-id, image and overflow checks, every route) | **0 problems on 338/338 desktop and 338/338 mobile** |
| Every route: direct load **and** browser refresh, at 320 px and at 360 px with reduced motion | **0 problems in 676 checks** (1,352 page loads): all HTTP 200, no horizontal overflow, no page or console errors, same `<h1>` after refresh |
| No-WebGL fallback (`/universe`, `/worlds/phonepe-smart-spend-coach`, `/explore`) | No canvas, full content shown, no overflow, no errors |
| `git diff --check` | **Clean** (exit 0; only Git's CRLF notices) |

Every test that failed during this pass was diagnosed and either fixed in the product or corrected in the test for a stated reason (§3). No assertion was loosened, no test was skipped or deleted, and no interrupted run is counted as a pass. The numbers above come from a complete rerun after the last code change.

## 2. Requirements, one by one

### 2.1 Solar-system memory and leak checks — done, one leak found and fixed

Probe: `/universe?gldebug=1`. Each round selects all 8 planets, closes the panel, enters the Earth, then returns to the system. Six rounds were run on the laptop tier, and again on the high tier (with Bloom) with reduced motion. Listener counts come from Chrome DevTools Protocol (`DOMDebugger.getEventListeners`).

| | Round 1 → round 6, **before** the fix | Round 1 → round 6, **after** the fix |
|---|---|---|
| GPU geometries | 48 → 48 | 48 → 48 |
| GPU textures | 17 → 17 (14 → 17 happens once, in round 1, when the Earth first loads) | 17 → 17 |
| Shader programs | 12 → 12 | 12 → 12 |
| Listeners on the canvas | **13 → 18 (+1 per return to the system)** | **12 → 12** |
| Window / document listeners | 35 / 147, level | 35 / 147, level |
| JS heap | 11–23 MB, goes up and down without a trend | 11–16 MB, no trend |
| Frames drawn while idle (high tier, reduced motion) | — | **0** with nothing selected, **0** with a planet selected (no orphaned animation loops) |
| Frames drawn while idle (laptop, motion on) | — | 21 / 15 per 2 s (ambient drift, below the 30 fps cap) |

**Cause:** `Solar.tsx` and `World.tsx` add a `{ once: true }` `pointerdown` listener so a click ends the arrival flight. It's removed only if the visitor actually presses on the canvas. The `<Canvas>` stays mounted while the system, Earth and world views swap, so each re-entry added another listener.
**Fix:** each view now removes its listener on unmount. Solar also resets a `pointer` cursor left over from a hover.
**Regression test:** `gpu.spec.ts` › "solar system: planet selection and system ⇄ Earth round trips hold GPU objects and canvas listeners level". It runs 4 full rounds and asserts that geometries, textures and canvas listeners are exactly level.

### 2.2 Solar system, inspected visually — done

Screenshots were taken at 1440 × 900 and on a Pixel 7, for the system view, each planet selected, the Earth stage and the return to the system.

- **Sun:** visible at the centre, with its "Gaurav.OS" label below it.
- **Orbits:** 8 orbits, all readable.
- **Labels and spacing:** no overlapping labels on desktop or phone. Planets are spaced so no two can touch or share a hit target (derived spacing in `solar.ts`).
- **Camera:** each planet frames left of its panel, sunlit side forward. The Earth stage and the way back both work.
- **Planet links (all 7 correct):** every project planet's panel links to `/worlds/<slug>` and `/projects/<slug>`. Earth links to `/research` and has an "Enter" button for the Earth stage.
- **Panel order:** Previous/Next show "n of 8".

**Fixed:**
- **Phone:** Oz's resting spot covered the 4th planet chip in the bottom strip. The strip's scroller now ends before Oz on phones; wide screens are unchanged. Measured afterwards: strip right edge 316 px, Oz starts at 320 px.
- **Desktop Earth stage:** Oz covered the end of the licence credit line ("…three.js"). The footer now has right padding, and the credit reads in full.

### 2.3 Project navigation boundaries — done, one inconsistency fixed

- **No dead ends.** Previous/Next wrap at both ends (RupeeRadar → Evamastu, Evamastu ← RupeeRadar). Each button's label names its destination ("Next world: Evamastu"), and a counter shows the position.
- **Fixed:** the tour walked the worlds in `projects.ts` order (…GharGyaan, **PhonePe, Nexus**…). The solar system and the `/worlds` hub both use cluster order (Healthcare → AI → Fintech: …GharGyaan, **Nexus, PhonePe**…). So Nexus was "planet 06" but "6/7" meant PhonePe in the tour. The tour now uses a `worldTour` list built from the hub's clusters, so a project has the same position everywhere.
- **Tests:**
  - Unit test: the tour order equals the solar planet order.
  - E2E boundary test in `prelaunch.spec.ts`: first and last worlds, wrap-around, labels, counter, and Nexus → PhonePe.

### 2.4 PhonePe tower — inspected at desktop and phone sizes

The architectural redesign is really built, not just testable. The tower stacks seven different forms: a glass-drum base, a screens floor, rings around a detection disc, stepped bar volumes, a cantilevered slab and a spire with a beacon. A floor directory names Floor 01 Executive summary through Floor 07 Experiment design. The seven-floor narrative and the content are unchanged, and the 7-floor click test passes. On the phone the tower frames above the bottom sheet, and the sheet's GharGyaan/Nexus buttons clear Oz. The honesty notes are intact: "Not affiliated with or endorsed by PhonePe", "designed, not run" and the "CASE DATA" pill.

### 2.5 3D city and its six districts — done, one content gap fixed

Checked on desktop in 3D with SwiftShader WebGL, and on the phone, which opens the lightweight map by default and offers a "3D view" button.

- **District panels:** each of the six districts opens its panel with real links (listed in the probe log). Reset camera works, and Escape, × and Tab move between districts.
- **Guided tour:** three full runs. After the first run adds its panel DOM, JS event listeners stay at 273 and DOM nodes at 533–539. The tour bar closes cleanly, and there were no console errors.
- **Fallback:** without WebGL, the map is shown instead.
- **Fixed:** RupeeRadar is assigned to the Research & Analytics district in `projects.ts`, but it was the only project its district didn't link to. It's now linked, with its existing status text "Prototype · not deployed" (no new claim). A unit test now checks that every project assigned to a district is linked from it.

### 2.6 About, certifications, newsletter, Skills, Product Thinking, Oz voice — done

- **Newsletter:** 806 subscribers, +7 in 7 days, 10 editions. It's always shown as a self-reported snapshot from **10 Nov 2026**, with its source, and is never presented as live (covered by tests). Oz's knowledge base states it the same way.
  - Fixed a drift risk: the About "Writing" line repeated the figures as a literal string. It's now derived from the snapshot, so a future update changes it too. The rendered text is unchanged.
- **Certifications:** 17, owner-supplied. The 3 without dates say "Date not stated".
- **Operating loop, Skills Library, Product Thinking:** prelaunch and experience tests pass, and both sizes were checked by eye. No overflow.
- **Accessibility fixes found by the crawl:**
  - The newsletter's "Read the editions" link had an accessible name that didn't contain its visible text (WCAG 2.5.3). Its visible text is now "Read the 10 editions".
  - On `/skills`, the domain filter was a `<ul role="group">`, which left its 7 `<li>` children outside any list. The role was removed and the "Domain" label kept.
- **Oz voice:** a voice is only picked in the same language (Indian English wins ties). If none is available, the text is shown instead. Stale callbacks after a cancel are ignored. Guide unit and E2E tests pass.
- **Not fabricated:** nothing in the product (counts, dates, statuses, certifications) was invented or changed in meaning this pass.

### 2.7–2.9 Suites, routes, console, links, overflow, reduced motion, keyboard, mobile, WebGL fallback

Covered by §1:
- **Links and controls:** the dead-control crawler visits all 338 routes on desktop and mobile. It checks every internal link and hash target, every download, and every button's name and handler.
- **Keyboard:** keyboard and focus specs cover the site, plus the solar `[` `]` / Escape keys and the operating-loop tabs.
- **Reduced motion:** a reduced-motion test exists for every world, and the route sweep at 360 px also runs with reduced motion.
- **No-WebGL:** E2E tests plus the screenshots in §1.

### 2.10 Diff review

`git diff --check` is clean. Every edit in this pass was checked to land exactly once, where intended. There are no duplicate implementations and no unrelated changes.

## 3. Test changes made this pass (and why none of them weakens a test)

| Test | What failed | Change |
|---|---|---|
| `universe.spec.ts` › home CTA; `journeys.spec.ts` › J1; 5 tests in `interaction.spec.ts` | Strict-mode violation: the footer now also has a "Solar system in 3D" link (added in the earlier session) | The locator is scoped to `#main`, which is the home CTA these tests are about. Same assertions |
| `universe.spec.ts` › old `/universe/<slug>` redirects | Expected `/universe`; the corpus redirect was deliberately changed to `/universe?at=earth` (the 90 studies live on the Earth) | Now expects the exact new address (more specific than before) |
| `universe.spec.ts:83` › URL filters (the intermittent failure from the previous report) | Read the list with `.count()`, which doesn't retry, right after the URL changed, sometimes before React committed the filtered list (read 90) | Waits for the list to narrow, then reads it. `n > 0` and `n < 90` are unchanged. 8/8 repeats pass |
| `interaction.spec.ts:79` › native cursor | Read the cursor ring's opacity mid-fade (0.057) | Polls until it is exactly `"0"` (same value). The touch case, which has no fade, is unchanged |
| `controls.spec.ts` shard 4/6 (desktop and mobile) | Ran past its 240 s budget: `/research/7` took 21 s to reach network idle because a third-party image host (Wikimedia, linked from the study's source README) was slow | **Not changed.** Passed on rerun (0.5 s for that page). **12 Nov:** it failed again (240 s timeout, twice) while Wikimedia took 20–60 s+ per request. Fixed in the product, not the test: the logo is now served locally (§0.1). The test is unchanged and passes (38 s) |

**New tests:**
- `gpu.spec.ts`: solar round-trip leak test.
- `prelaunch.spec.ts`: tour-boundary test.
- `universe.test.ts`: tour order equals planet order.
- `content.test.ts`: every project is linked from its district.

## 4. Files changed in this pass

| File | Change |
|---|---|
| `app/src/universe/Solar.tsx` | Removes the arrival `pointerdown` listener and any hover cursor on unmount (leak fix) |
| `app/src/universe/World.tsx` | Same listener cleanup for the worlds |
| `app/src/universe/WorldPage.tsx` | Previous/Next use `worldTour` (cluster / planet order) |
| `app/src/content/universe.ts` | Adds the `worldTour` export |
| `app/src/routes/universe.tsx` | Phone planet strip ends before Oz; Earth footer credit clears Oz |
| `app/src/content/districts.ts` | Research & Analytics links RupeeRadar (its assigned district) |
| `app/src/content/experience.ts` | Newsletter "Writing" line derived from the dated snapshot (same text) |
| `app/src/components/Newsletter.tsx` | Accessible names contain the visible text (WCAG 2.5.3) |
| `app/src/routes/skills.tsx` | Domain list keeps list semantics (axe `listitem`) |
| `app/tests/e2e/gpu.spec.ts`, `prelaunch.spec.ts` | New tests (§3) |
| `app/tests/e2e/universe.spec.ts`, `journeys.spec.ts`, `interaction.spec.ts` | Corrections listed in §3 |
| `app/tests/unit/universe.test.ts`, `content.test.ts` | New unit tests |
| `audit/PRELAUNCH-FINAL-REVIEW.md` | This report |

Generated outputs that were refreshed: `app/build/`, `app/reports/a11y-*.json`, `app/reports/e2e-results.json` and `app/test-results/`.

## 5. Outstanding issues

**P0 (blocks launch): none.** *(Re-checked after publication, 14 Nov 2026: still none.)*

*Updated 14 Nov 2026.*

**Status on 14 Nov 2026:**
- **P1-1 (physical-device QA):** still open. It now includes playing the introduction film with sound on a real Android phone and an iPhone.
- **P1-2:** resolved. Everything was committed in `e9f9598` and merged.
- **New P2 items found during publication:**
  - **P2-9:** the introduction film has speech but no captions. No transcript was supplied, and none was made up. Captions need an accurate transcript from the owner, or a machine transcript the owner has checked.
  - **P2-10:** canonical and sitemap URLs have no trailing slash (for example `/portfolio/research/7`). GitHub Pages answers them with a single 301 redirect to `/portfolio/research/7/`. Pages load correctly; search engines would ideally get the final URL.
  - **P2-11:** on a first desktop visit, Oz's one-time greeting bubble can overlap the film player's bottom-right controls until it's dismissed or disappears.
  - **P2-12:** the two old 65-second film files (`gaurav-os-intro-av1-1080p.mp4`, `gaurav-os-intro-h264-720p.mp4`, about 7.6 MB together) are no longer used but are still deployed. An existing unit test requires them.

*Below: the 12 Nov list as it stood then.*

**P1 (fix before or right at launch):**
1. **Physical-device QA is still pending** (`audit/DEVICE-QA-RESULTS.md` row D1). All testing here used emulated viewports and SwiftShader WebGL. Real-GPU performance and frame rate on mid-range phones haven't been measured.
2. **The deploy builds only what is committed.** 30 of the 93 entries are untracked files the build needs, for example `app/public/studies/`, `app/public/og/`, `app/src/universe/Solar.tsx` and new tests. They must all be committed before the Pages workflow is run.

*Resolved since 11 Nov:*
- `VITE_SITE_URL` is now chosen (`https://gaurav-product.github.io/portfolio/`, the workflow default) and verified in a production build.
- The Wikimedia dependency is gone (§0.1). Across all 90 studies, the only image still loaded from another host is the Day 07 market-share chart, from `raw.githubusercontent.com` at the pinned source commit.

**P2 (known limitations, not blocking):**
1. The Day 07 study's own text (line 548 of its source README) still says the logo is "hotlinked directly from Wikimedia Commons". That is no longer how this site serves it. The case-study content was deliberately left unedited; changing it is the author's call.
2. `/explore/city` has a canonical pointing to `/explore` but is still listed in the sitemap. That's a mixed signal to search engines, though it causes no visible defect.
3. The PhonePe world shows an honest "Product screens — not supplied yet" placeholder panel until real screens are supplied.
4. On phones, nothing visually shows that the planet strip scrolls past the third chip. Every planet can also be tapped in the scene through its label.
5. In the 3D city, the district labels drawn inside the scene are small. The district buttons carry the same names and are full-size.
6. On wide screens, Oz can sit over the last lines of a long scrolling panel (e.g. the PhonePe highlights). Oz can be dragged, and the content scrolls.
7. In the 3D city, when a district is focused, neighbouring district labels follow their buildings behind the panel. Escape, × and Tab reach every district.
8. The ~966 KB three.js chunk loads only on 3D routes (unchanged from the previous review).

## 6. Verdict

**14 Nov 2026: published.** The site is live at https://gaurav-product.github.io/portfolio/ from `main` @ `e0bc2c4`. CI is green on the final head, the deploy succeeded, and the live smoke test passed 68 / 68 on emulated desktop and mobile. There are no P0 issues. Still open:
- **P1-1:** real-device QA.
- **P2-9 to P2-12** and the earlier P2 list.

### Verdict as of 12 Nov 2026

**Ready to deploy from a code and quality standpoint.** There are no P0 issues. On the final source the complete suite passes with no failures (196 passed, 2 deliberate skips), as do 114/114 unit tests, the typecheck and both accessibility crawls (338/338 routes each, including `/research/7`). The `/portfolio/` production build passes every smoke, 3D, link, sitemap and canonical check. Before going public: commit all 93 entries, including the untracked ones (P1-2), and do a short check on one real phone and one real laptop GPU (P1-1).

## 7. To review locally

The `/portfolio/` production build is being served at **http://127.0.0.1:4173/portfolio/**. If that server has stopped, run `cd app` then `BASE_PATH=/portfolio/ node scripts/serve.mjs` (from Git Bash, prefix `MSYS_NO_PATHCONV=1`). For the root build: `npm run build` then `npm run preview`. To repeat every check: `powershell -ExecutionPolicy Bypass -File audit\final-local-checks.ps1` (close heavy apps first).
