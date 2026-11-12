# Gaurav.OS — Final Master Execution (v3): implementation and test handover

**Status: local and uncommitted.** Nothing has been committed, pushed, merged, deployed or published. PR #1 has not been modified.

- **Base:** the exact R1+R2 working tree (`gaurav-os-r1-r2.patch`) on branch `claude/beautiful-goldberg-radrlu`, HEAD `310332fa0c11498e4f3c3023305db7c78ab8696a` (unchanged).
- **Delivery:** `gaurav-os-final-master-v3.patch`, which applies on top of R1+R2 and contains only this execution's changes. It supersedes v1 and v2.

**Testing levels.** Every result below is **automated** (headless Chromium in a Linux cloud container, software GL) or uses **emulated viewports and devices**. **No Android or iPhone testing has been performed.** Real-device QA remains outstanding (section G).

---

## A. Executive summary

| Area | Delivered |
|---|---|
| Homepage hero | Focused one-screen hero: name, approved typewriter tagline, "Explore my work" (opens the guided tour) and "Browse all projects". Every entry point the previous hero offered is kept: 3D Earth, project worlds, 3D city, Recruiter Mode, CV, intro film. |
| Typewriter | Approved effect kept. The full sentence stays the accessible text and is server-rendered. It plays once per session and is static under reduced motion. **No layout shift while typing** at any width from 320 to 1440 px. On phones the typed phrase starts on its own line. |
| Hero video | Approved 0:53–0:58.5 excerpt, forward then backward, silent (no audio stream). Desktop only, loaded after the page is idle, paused off screen. Reduced motion, phones and data saver never request it. Text contrast ≥ 6.63:1 at every point in the loop. |
| Guided tour `/tour` | 8 chapters in Auto mode (progress bar, Pause/Resume, holds while reading, pauses on a hidden tab, stops at the end, no sound) and Manual mode (the default under reduced motion). Previous/Next/chapter buttons/Skip/Exit and keyboard ← → Space Esc. Every chapter can be deep-linked. |
| Case-study feature | The owner-supplied "Product Management Case Studies" artwork (pixel-verified), with the disclaimer "not products I launched". |
| Skills / Research | Search, category chips with counts, evidence links. Horizontal chip rows on phones. |
| About | Education / Certifications / Professional learning. **"Date not stated"** on exactly the 3 certificates with no documented date; no dates inferred. |
| Product Thinking | Sticky section navigation, now sitting fully below the site header. |
| Factual wording | Homepage heading changed to **"Products, Prototypes & Research"**. Tour projects chapter: "7 projects, each with its real status". CareConnect summary: "What was built" (was "What shipped"; the project has no users). |
| Oz on phones | Oz never covers the homepage introduction at 320–412 px. At its default spot it steps aside (inert) while it would overlap, and returns once the introduction scrolls clear. A position the visitor dragged it to is respected. Unchanged on desktop and on other pages. |
| Tests | GPU leak test and reduced-motion test fixed: baseline taken only after textures settle, assertions unchanged, and leak or motion detection proven with injected faults. Windows path handling fixed in the unit test. |

**Verdict: ready for real-device QA; not launch-ready.** See H.

## B. Files (29 in the patch)

New (7):

| File | Purpose |
|---|---|
| `app/src/routes/tour.tsx` | Guided tour |
| `app/src/components/Typewriter.tsx` | Accessible, shift-free typing tagline |
| `app/src/components/HeroBackdrop.tsx` | Desktop hero background and silent loop with fallbacks |
| `app/public/media/hero-loop-720p.mp4` | 11 s silent loop (1,318,769 bytes) |
| `app/public/media/hero-loop-poster.jpg` | Loop poster (60,091 bytes) |
| `app/tests/e2e/experience.spec.ts` | 31 tests for this execution |
| `audit/FINAL-MASTER-HANDOVER.md` | This report |

Changed (22):

| File | Change |
|---|---|
| `app/src/routes/home.tsx` | Hero, CTA → `/tour`, previous entry points kept, case-study feature, heading "Products, Prototypes & Research", `data-oz-avoid` on the introduction |
| `app/src/routes/skills.tsx`, `research.tsx`, `about.tsx`, `product-thinking.tsx` | Library redesigns; "Date not stated"; sticky nav at 72 px |
| `app/src/content/case-studies.ts` | CareConnect "What was built" (was "What shipped") |
| `app/src/guide/GuideRoot.tsx` | Oz steps aside on narrow screens at its default spot while it would cover `[data-oz-avoid]` content |
| `app/src/app.css` | Keyframes (caret border, drift, tour progress, stage entry); tour styles in `@layer components`; Oz pre-check rule |
| `app/src/routes.ts`, `content/routes-manifest.ts`, `lib/immersive.ts`, `interaction/Cursor.tsx`, `lib/analytics.ts`, `components/Icon.tsx` | `/tour` route, full-screen mode, cursor label, `tour_opened` event, `pause` icon |
| `app/tests/e2e/gpu.spec.ts` | **Test-defect fix:** baseline after textures settle; frame forced before reading; assertions unchanged |
| `app/tests/e2e/worlds.spec.ts` | **Test-defect fix:** the same settle rule for the reduced-motion test; assertion unchanged |
| `app/tests/e2e/guide.spec.ts` | Mobile panel test scrolls past the introduction first (Oz is intentionally stepped aside there) and now also asserts that behaviour |
| `app/tests/e2e/universe.spec.ts`, `journeys.spec.ts`, `interaction.spec.ts`, `cinematic.spec.ts` | Intended behaviour changes only (CTA → `/tour`, category chips, kinetic tagline). No assertion removed or loosened. |
| `app/tests/unit/content.test.ts` | Route count (+`/tour`); **Windows path fix** |

Not in the patch: `audit/CINEMATIC-WORLDS-BLUEPRINT.md` (earlier planning doc, untouched) and `audit/R1-R2-IMPLEMENTATION.md` (already in R1+R2).

## C. The eight approved corrections

1. **GPU test.**
   - **Defect:** the test took its "before" sample 2.5 s after load, while the world's staggered textures were still arriving (38–48 → 56 over about 4–6 s). Probing showed the real count is flat at 56 through the interactions, so there was no leak.
   - **Fix:** settled = no image request in flight AND count unchanged for 3 s; the test fails loudly if it never settles. A frame is drawn deliberately before "after" is read (rendering is on demand). The **≤ 2 textures / ≤ 2 geometries assertions are unchanged**.
   - **Results:** clean build 5/5 pass (was 0/5).
   - **Leak detection proven:** an injected leak, with panel labels rebuilt on resize and never disposed, fails the test **5/5** (+53 textures).
   - **Coverage note:** the first mutant tried, a `GlassBox` per-render clone, does not fire under this test's interactions (no `GlassBox` re-render). That gap predates this work.
   - **Same defect, same fix, in the reduced-motion world test:** 30/30 pass (was intermittent on both builds). An injected "ignore reduced motion" fault fails it in **10/10 worlds** (10–13 frames while still).
2. **Windows unit test.** `fs.readdirSync(…, { recursive: true })` returns `content\profile.ts` on Windows, but the test compared against `content/profile.ts`.
   - **Fix:** normalise separators to `/` before comparing. The `data` exclusion was tightened from the string prefix `data` to the directory `data/`, which scans more files, never fewer.
   - **Verified on Linux:** passes. Adding the legal name to `routes/contact.tsx` makes it **fail** (restored byte-identical). A simulated Windows listing reproduces the reported failure with the old logic and yields `["content/profile.ts"]` with the new logic.
   - **Not verified: Windows itself.** No Windows machine is available here. Please run `npm test` on `C:\path\to\portfolio-1` after applying the patch.
3. **Typewriter.** The approved effect, sentence and phrases are kept.
   - **Found:** CLS on phones was 0.31 at 320 px (0.19 at 360–390, 0.04 at 412). Half-typed words hopped between lines, and the caret was a separate moving element.
   - **Fixed:** on phones the typed phrase starts on its own line (in both the animation and the layout reserve), and the caret is the typed text's own border.
   - **Now:** zero layout-shift entries during typing at 320, 360, 390, 412, 640, 768, 1024 and 1440 px. The only entry (≤ 0.0009) occurs at about 90 ms during page load, before typing starts. A regression test guards 320, 412 and 1440.
4. **Hero video.** Unchanged and re-verified on the final build: plays muted, pauses off screen and resumes, poster first. No request under reduced motion, on phones or with data saver. Contrast is unchanged (lowest: links row 6.63:1).
5. **Certifications.** "Date not stated" on exactly 3 certificates (Product School "AI in Product Management and Product Strategy", Pendo "Product Analytics", "Generative AI Mastermind"). No dates inferred; a test asserts all 3 by name.
6. **Heading and factual wording.** "Products, Prototypes & Research". I searched all content for "shipped / launched / in production / live users". Every remaining "shipped" refers to Evamastu (SHIPPED, from the CV and the employer). Two other over-broad phrases were corrected: the tour projects chapter title, and the CareConnect summary label "What shipped" → "What was built".
7. **Oz overlap.**
   - **At 320, 360, 390 and 412 px:** Oz is never visibly over the introduction, sampled on every frame from first paint (about 240 frames each) and at every 40–60 px scroll step. It steps aside (inert) at the top, returns after the introduction, and its panel opens.
   - **Unchanged elsewhere:** desktop, other pages, and positions the visitor dragged it to.
   - **Pre-hydration flash fixed:** Oz is in the prerendered HTML, so CSS now keeps it hidden on narrow screens until its first check.
8. **Mobile review** at 320/360/390/412 px. Tour walkthrough 42/42. Homepage, case-study feature, chip rows (scroll horizontally on their own, 40 px chips, taps work) and Product Thinking nav: no horizontal overflow anywhere. **Found and fixed:** the Product Thinking sticky nav sat 9 px under the 73 px site header; it now uses `top-[72px]`, like the Projects bar, and a test guards it.

## D. Asset report

| Asset | Source | Verification |
|---|---|---|
| Hero loop | Owner's intro film `public/media/gaurav-os-intro-h264-720p.mp4`, 0:53–0:58.5, forward then reversed. H.264 1280×720, 24 fps, 264 frames, 11.0 s, **no audio stream** | Turn seam: one near-duplicate frame (difference 0.03/255). Wrap seam: 1.34, below the clip's median motion (2.80) |
| Hero poster | Frame at 0:53 of the same film | Visual |
| Case-study artwork | Owner-supplied `brand/owner-art/source/brand-90-day-case-studies.webp`, 1536×1024, SHA-256 `01786a7d7715465be2f10cc66c81aefbc98779c41a6ff95bb8588723f069992b` (commit `86593ee`, unmodified) | All 10 served variants match the source at PSNR 35.4–42.8 dB (control images: 9.2–10.8 dB) |

No missing asset, no substitute, no generated imagery.

## E. Technical validation (final build)

| Check | Command | Result |
|---|---|---|
| Typecheck | `npm run typecheck` | **Pass** (exit 0) |
| Lint | — | **Not configured** (no lint script, no ESLint dependency, no config); not run |
| Unit | `npm test` | **106 / 106 pass** (Linux) |
| Production build | `npm run build` | **Pass: 338 prerendered routes** |
| Accessibility | `npm run audit` | **0 problems, 338/338 routes, desktop and mobile** |
| Full e2e | `npx playwright test --workers=2` (desktop 1440×900 + Pixel 7) | **173 tests: 171 passed, 0 failed, 2 skipped** (9.7 min), on the exact patch state |
| GPU tests | `gpu.spec.ts` | Leak test 5/5; whole file 4/4 |
| Reduced motion | worlds 3 × 10; intro-film poster; Oz | 30/30; 2/2; 1/1 |
| This execution's e2e | `experience.spec.ts` | **31 / 31 pass** |

### E.1 Failure classification

The final run had **0 failures**. Every failure seen during this round is classified below, so none is hidden.

| Failure seen | Classification | Resolution |
|---|---|---|
| `gpu.spec.ts` "GPU objects stay level while a world is used" (v2: 0/5 on both builds) | **Pre-existing test defect** (R1+R2), not a leak | Fixed (C.1). Clean 5/5; injected leak caught 5/5 |
| `worlds.spec.ts` "reduced motion in every world" (intermittent on both builds) | **Pre-existing test defect** (same timing flaw) | Fixed (C.1). 30/30; injected fault caught 10/10 |
| `content.test.ts` "public identity" (Windows only) | **Pre-existing cross-platform test defect** | Fixed (C.2). Linux verified; Windows not verifiable here |
| `guide.spec.ts` "mobile › panel fits the screen" (1 run) | **Intended behaviour change** from correction 7: Oz is deliberately inert at the top of the homepage on phones | Test now scrolls past the introduction first and **adds** an assertion for the stepped-aside behaviour; panel-fit checks unchanged. 11/11 and 5/5 repeats |
| `experience.spec.ts` "user navigation moves focus to the new chapter heading" (1 run of the full suite) | **Intermittent, unreproduced; root cause not identified.** This execution's own test; the code path was reviewed and nothing else moves focus | Not changed. Passed 31 isolated, 12 targeted, 186 stress runs (4 workers) and the final full run. Recorded here rather than hidden; covered by real-device screen-reader QA (G.11) |
| Typewriter layout shift on phones (CLS up to 0.31), found by measurement | **Real regression in this execution** (v1/v2) | Fixed (C.3). Zero shift while typing |
| Product Thinking nav 9 px under the header, found in mobile review | **Real bug in this execution** (v1/v2) | Fixed (C.8). Test added |
| Oz flash over the introduction before hydration, found by test | **Real bug in the first Oz fix**, caught before delivery | Fixed (C.7) |
| Oz stepping away from a position the visitor dragged it to, found in diff review | **Real bug in the first Oz fix**, caught before delivery | Fixed; test added |

Two skips are deliberate viewport-conditional skips already in the baseline tests: J12 intro-film autoplay runs on desktop only, and J17 drawer menu only below 1440 px.

### E.2 Verified behaviour (scripted, emulated)

- **Tour walkthrough (42/42).**
  - **Auto:** advances at exactly 7.0 s, Pause holds over the dwell, hovering holds and freezes the progress bar, a hidden tab pauses it, and it stops at the end without looping.
  - **Controls:** all 8 chapter buttons work, Previous and Next disable correctly, and keyboard ← → work. User navigation focuses the chapter heading.
  - **Manual:** never advances on its own.
  - **Exits:** Skip, Exit and Esc work, and the home CTA opens the tour full-screen.
  - **Phones:** Pixel 7, iPhone 13 and iPhone SE (320 px): controls on screen, at least 40 px, Oz clear, no overflow.
- **Typewriter:** no layout shift while typing (8 widths); the accessible sentence is intact at every width.
- **Hero video:** decodes and plays muted, pauses off screen and resumes; fallbacks request nothing; contrast lowest 6.63:1.
- **Oz:** never over the homepage introduction at 320–412 px from first paint; returns and opens after the hero; unaffected on desktop and other pages; dragged position respected.
- **Artwork:** pixel-verified (D).

### E.3 Lighthouse (emulated; measured in v2, hero unchanged since apart from the typewriter fix)

Desktop: 99–100 performance, 100 accessibility, 100 best practices, 100 SEO on `/`, `/tour`, `/skills`, `/research`, `/about`, `/product-thinking`, `/worlds/careconnect`. Mobile performance is 84–91 (emulated) with 100 in the other three categories.

## F. Remaining issues

1. **Real-device QA not performed** (G).
2. **Windows verification of the unit-test fix not performed** (no Windows machine available). Please run `npm test` on your PC.
3. **GPU test coverage gap (pre-existing):** its interactions never re-render `GlassBox`, so a `GlassBox`-only leak would not be caught. A further test could add a re-render trigger; not done, as it's outside the approved scope.
4. **Oz on phones at the top of the homepage** is intentionally not tappable until the introduction scrolls clear. On a phone, Oz is reachable after one short scroll, or from any other page.
5. **Owner confirmations** were all given in this round. Nothing is pending.
6. **Out of scope and unchanged:** R3 worlds, CV PDF, legal-name byline.

## G. Requires actual Android and iPhone testing (none performed)

| # | Check |
|---|---|
| 1 | Tour on Android Chrome and iPhone Safari: Previous/Next/chapters, Auto/Manual, Skip, Exit by touch |
| 2 | Tour footer against Oz and the iPhone home indicator, portrait and landscape |
| 3 | Tour auto-advance pauses when the phone locks or another app is opened |
| 4 | Oz stepping aside on the homepage and returning after the introduction, including after rotation and on iOS dynamic toolbars |
| 5 | Typewriter on phones: no jump, comfortable speed, line layout on real fonts |
| 6 | Phones never download the hero loop (remote DevTools network panel) |
| 7 | Hero loop smoothness on desktop Safari (macOS) and a low-power laptop |
| 8 | Mobile performance on a mid-range Android (emulated 84–91) |
| 9 | Skills/Research chip rows: horizontal swipe without trapping vertical scroll |
| 10 | Product Thinking sticky nav under the real phone toolbars |
| 11 | VoiceOver (iPhone) and TalkBack (Android) through the tour: chapter announcements, focus on chapter headings, icon-only Exit/Previous announced by name |
| 12 | The earlier R1+R2 device checklist D1–D12 (worlds, Earth, lightbox swipe, GPU) |

## H. Git safety and final verdict

- Branch `claude/beautiful-goldberg-radrlu`, HEAD `310332fa0c11498e4f3c3023305db7c78ab8696a`, unchanged.
- No commit, push, merge, rebase, reset, clean, stash, force checkout, deploy, publish or PR edit.
- Applying the patch:
  1. Run `git apply --reverse --check gaurav-os-final-master-v3.patch`. If it succeeds, the patch is already applied; stop.
  2. Otherwise run `git apply --check gaurav-os-final-master-v3.patch`.
  3. If that's clean, run `git apply gaurav-os-final-master-v3.patch`.
  4. Apply v3 to the R1+R2 tree **instead of** v1 or v2, not on top of them. If v2 is already applied, reverse it first with `git apply --reverse gaurav-os-final-master-v2.patch`.

**Final verdict: automated validation complete; ready for real-device QA; not launch-ready.** Launch needs:

- the Android and iPhone checks in G;
- the Windows `npm test` confirmation (F.2);
- your explicit authorisation to commit and push.
