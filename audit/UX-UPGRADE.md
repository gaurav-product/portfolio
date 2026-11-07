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
