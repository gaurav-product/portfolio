# Premium interaction upgrade — progress report

Plan and owner decisions: `audit/UX-UPGRADE-PHASE-0.md` (approved 7 Nov 2026).
Each phase is committed separately. **Nothing is merged or deployed.**

## Phase 1 — signature cursor, context labels, magnetic actions, spotlight

### What was built

- **Dot and ring cursor (desktop).**
  - A 6 px neon-green dot follows the pointer exactly.
  - A thin 34 px ring trails it smoothly, with an eased follow.
  - It has a soft glow in the brand green.
  - On links and buttons the ring grows. When pressed it squeezes.
- **Context labels**, read from one central `data-cursor` attribute:

| Label | Where it appears |
|---|---|
| VIEW | Project cards and project chapter art; Universe markers while hovered in 3D |
| EXPLORE | Any link to `/universe` or `/explore` (detected automatically) |
| OPEN | Study cards, Atlas points, case-study screenshots, Universe gallery thumbnails; gallery panels in 3D |
| DRAG | The Universe canvas and the 3D city scene |
| PLAY | The intro-film button and video |
| BACK | Universe "Earth" and "Back to Earth"; the district "All districts" link |

  Big targets (≥ 120 px tall: cards, art, 3D, media) show the label inside a filled disc. Small targets (buttons, links) keep the ring and show the label as a tag beside the pointer, so the button's own text is never covered.
- **Magnetic actions.**
  - These are pulled towards the pointer:
    - every primary button, through the shared `ButtonLink` / `Button`;
    - the header's **Recruiter Mode** and **CV**.
  - The pull is at most 6 px horizontally and 3.6 px vertically, and it springs back on leave.
  - It uses the independent CSS `translate` property, so existing transforms, focus rings, clicks and keyboard activation are untouched.
- **Spotlight.** A soft green-to-cyan radial glow follows the pointer with a slower lag.
  - It is a single fixed layer with a pre-drawn gradient that is only moved, so there's no full-page repaint and no blur.
  - It uses screen blending, so text stays readable and it's invisible on light surfaces such as the CV sheet.
- **Coverage.** The whole desktop site, including the full-screen Universe and the 3D city. It is mounted once in `root.tsx`.

### Safety rules (all tested)

- **When it runs.** Only with a fine, hovering pointer and motion allowed.
  - **Touch screens, pens and reduced motion:** the native cursor stays and nothing extra runs.
  - **Hybrid devices:** it switches on and off live.
- **Fallback.** The native arrow is hidden only after the cursor has started successfully (`html.gos-cursor`). If the script fails, the normal cursor remains.
- **Native cursor kept for:** text inputs, text areas, selects, editable content, and while dragging to select text (the I-beam returns).
- **Decorative layers** are `aria-hidden` and `pointer-events: none`, so they never block clicks.
- **No new listeners per component.** One set of document-level listeners covers the whole site.
- **Frame loop.** It runs only while the ring or spotlight is still catching up, then stops. It hides when the pointer leaves the window or the window loses focus.
- **Keyboard and focus rings** are unchanged.

### Files

**New**
- `src/interaction/Cursor.tsx`
- `src/interaction/interaction.css`
- `tests/e2e/interaction.spec.ts`

**Modified (markup attributes only)**
- `root.tsx` (mount)
- `components/ui.tsx` (primary buttons are magnetic)
- `Header.tsx`, `cards.tsx`, `IntroFilm.tsx`, `Screenshots.tsx`
- `routes/projects.tsx`, `research.tsx`, `atlas.tsx`, `home.tsx`, `district.tsx`, `explore.tsx`, `universe.tsx`
- `universe/Panels.tsx`

### Weight

About **1.8 KB JS + 1.0 KB CSS gzipped**. No new dependency.

### Tests

- `tsc`: clean.
- Vitest: 85/85.
- Playwright: **90 passed** (82 existing + 8 new), 2 skipped by design.
- The new tests cover:
  - start-up, following and pointer-events;
  - EXPLORE / VIEW / OPEN / PLAY / DRAG / BACK labels;
  - magnetic pull, its limit and reset, and that the button still clicks;
  - the native cursor in text fields and during text selection;
  - keyboard activation;
  - touch (no custom cursor, tap works);
  - reduced motion.
- Accessibility crawler and Lighthouse: see below.

### Screenshots

`audit/screens/ux-phase1/` holds `before-*` and `after-*` for the home CTA, a project card, About, the Universe and mobile home, plus side-by-side `compare-*` images. Mobile is unchanged by design.

### Accessibility and performance

The accessibility crawler found **0 problems** on 326 routes × desktop and mobile.

Lighthouse, mobile / desktop. "Before" is the Phase 0 baseline; "after" is Phase 1.

| Page | Before | After |
|---|---|---|
| `/` | 86 / 99 | 85 / 99 |
| `/recruiter` | 91 / 100 | 91 / 100 |
| `/projects/careconnect` | 87–89 / 100 | 90 / 100 |
| `/research` | 93 / 100 | 93 / 100 |
| `/research/90` | 88 / 100 | 88 / 100 |
| `/about` | 89 / 100 | 89 / 100 |
| `/universe` | 88 / 100 | 88 / 100 |
| `/universe/careconnect` | 89 / 100 | 90 / 100 |

- No page moved by more than 1 point; the budget was 2. Run-to-run variance is about ±2.
- Layout shift: 0 or 0.001 to 0.006 everywhere, as before.
- Accessibility, best practices and SEO: 100.

### Not verified here

- How the cursor feels on a real mouse and monitor. Headless browsers can't judge smoothness or perceived lag.
- Safari and Firefox on real machines. The logic uses only standard pointer events and CSS `translate`.
- Behaviour with a Windows touch-and-mouse hybrid switching live. The `matchMedia` change listener is in place but was not exercised on hardware.

## Phase 2 — 3D tilt cards and cinematic page transitions

### What was built

**Tilt cards**
- **Where:**
  - project cards (home and experience pages);
  - project chapter art on `/projects`;
  - the 90 case-study cards on `/research`;
  - the approved-screenshot cards on project pages.
- **Not tilted:** the large text rows on `/case-studies` and interface controls. Tilting those would be excessive.
- **Movement.** The card leans towards the pointer by at most 5° on each axis, with a 1000 px perspective. A soft light follows the pointer across the card (white-to-green radial, soft-light blend). On leave it springs back with a light overshoot (0.7 s).
- **Shared engine.** It runs on the Phase 1 cursor engine, with the same single listener and the same rules: never on touch screens, pens or reduced motion.
- **No conflicts.** One `transform` holds both the tilt and the existing 2 px hover lift. The project-chapter scroll reveal was moved from `transform` to the separate `scale` property, so they can't clash.
- **Layout stays fixed.** Transforms never affect layout, and a test confirms neighbouring cards don't move.

**Page transitions** (`src/interaction/Transitions.tsx`)
- **How it works.** React Router's built-in `viewTransition` navigation, which uses the browser's View Transitions API. There's no new library and the app doesn't remount.
- **Default effect.** The old page settles back and fades over 0.24 s; the new page rises in over 0.46 s.
- **Into the Product Universe:** a circular reveal from the point you clicked, over 0.8 s.
- **Stays fixed during transitions:** the site header, Oz and the cursor layers. They don't cross-fade.
- **One capture-phase listener** upgrades ordinary internal link clicks. Everything else behaves as before:
  - **Browsers without the API** (Firefox, older browsers) and **reduced motion** get normal instant navigation.
  - **Ctrl/⌘/Shift/Alt and middle clicks**, `target` and download links, external links, files, same-page `#anchors` and `data-no-transition` are left alone.
  - **Back/Forward and direct URLs** are never intercepted. Browser history is unchanged.
  - **Interrupted navigation.** A new click during a transition starts a new navigation; the browser skips the unfinished one. A test checks that the last click wins and nothing stays on screen.
- **Inside the Universe.** Entering and leaving buildings keeps the Universe's existing camera flight and fade, so it isn't animated twice.

### Files

**New**
- `src/interaction/Transitions.tsx`
- `src/interaction/transitions.css`

**Modified**

| File | Change |
|---|---|
| `src/interaction/Cursor.tsx` | Tilt |
| `src/interaction/interaction.css` | Tilt and light |
| `src/root.tsx` | Mounts `Transitions` |
| `src/app.css` | Chapter reveal uses `scale` |
| `components/cards.tsx`, `components/Screenshots.tsx`, `routes/projects.tsx`, `routes/research.tsx` | `data-tilt` |
| `tests/e2e/interaction.spec.ts` | 10 new tests |

### Weight

About 1.6 KB gzipped in total:

| Part | JS | CSS |
|---|---|---|
| Transitions | ~0.7 KB | 0.5 KB |
| Tilt | ~0.2 KB | 0.2 KB |

### Tests

| Check | Result |
|---|---|
| `tsc` | Clean |
| Vitest | 85/85 |
| Playwright | **100 passed** (90 + 10 new), 2 skipped by design |
| Accessibility crawler | 326 × 2: **0 problems** |

The 10 new tests cover:
- tilt direction and the 5° limit, the light, spring-back, and that the card still clicks;
- neighbouring cards not moving;
- no tilt on touch or with reduced motion;
- the transition running on internal links;
- Back, Forward and direct URLs;
- the circular reveal into the Universe;
- new-tab, hash and download links left alone;
- rapid clicks never getting stuck;
- a browser without View Transitions navigating normally;
- no transition with reduced motion.

The transition tests passed 30/30 across 5 repeats. An early version read its counter too soon: the router updates the URL just before it starts the transition. That was a test-timing issue, fixed by waiting.

### Lighthouse (mobile / desktop)

| Page | Baseline | Phase 2 |
|---|---|---|
| `/` | 86 / 99 | 84–86 / 99 (4 runs, median 85) |
| `/recruiter` | 91 / 100 | 91 / 100 |
| `/projects` | 93 / 100 | 93 / 100 |
| `/projects/careconnect` | 87–90 / 100 | 88 / 100 |
| `/research` | 93 / 100 | 93 / 100 |
| `/research/90` | 88 / 100 | 88 / 100 |
| `/about` | 89 / 100 | 90 / 100 |
| `/universe` | 88 / 100 | 88 / 100 |
| `/universe/careconnect` | 89 / 100 | 90 / 100 |

- No page lost more than the 2-point budget.
- Layout shift: 0 or 0.001.
- Accessibility, best practices and SEO: 100.

### Screenshots

`audit/screens/ux-phase2/` holds `before-*`, `after-*` and `compare-*` images for a home project card, project chapter art and a research card, plus mid-transition frames (`transition-page-midframe.png`, `transition-universe-reveal-midframe.png`).

### Not verified here

- **Safari's View Transitions on real hardware.** Same API as Chromium; tested only in Chromium.
- **Real Firefox.** Its behaviour was simulated by removing the API.
- **How the tilt and spring feel with a real mouse.**
