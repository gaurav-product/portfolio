# Physical-device QA checklist: final production release (Nov 2026)

**Status: every row is PENDING.** No physical device was available to Claude Code. All automated checks used Playwright emulation (Chromium, SwiftShader WebGL). Emulation does not replace these checks.

**How to test**
- Use a fresh private/incognito tab for each "fresh visit" row. The introduction shows once per browser session.
- Production URL: https://gaurav-product.github.io/portfolio/. Run these after the approved deploy. To check a branch build first, use a LAN preview.
- Record what you see. Write "not measured" for anything you did not measure.
- Status values: PENDING · PASS · FAIL · BLOCKED · PARTIAL

## Android: Chrome

| ID | Check | Expected | Actual | Status |
|---|---|---|---|---|
| A1 | Fresh visit to `/portfolio/` | The full-screen introduction appears first, with the poster (name card) whole and uncropped, plus "Play introduction · 0:45" and "Skip intro · Enter portfolio" | | PENDING |
| A2 | Tap Play introduction | The film plays **with sound**, inline (not forced fullscreen), with native controls | | PENDING |
| A3 | Pause, resume, seek with the native controls | All work; nothing jumps or reloads | | PENDING |
| A4 | Native fullscreen button, then exit | Fullscreen works; on exit, you're back at the introduction | | PENDING |
| A5 | Let the film finish | The portfolio fades in by itself; the homepage scrolls and works | | PENDING |
| A6 | Refresh the page, then open another page | The introduction does not come back in the same session | | PENDING |
| A7 | New incognito tab → `/portfolio/worlds/careconnect/` → Skip | Lands on the CareConnect world, not the homepage | | PENDING |
| A8 | Portrait ↔ landscape while the introduction shows | The film stays 9:16 and uncropped; in landscape the buttons sit beside it; no sideways scroll | | PENDING |
| A9 | Safe areas and browser bars (notch, gesture bar, address bar showing/hidden) | Buttons are never under a bar or the notch | | PENDING |
| A10 | Homepage inline player ("Gaurav.OS in 45 seconds") | Same poster; plays with sound on tap; pause, seek and fullscreen work | | PENDING |
| A11 | `/portfolio/universe/` → "Start the 3D solar system anyway" | The 3D view runs smoothly; the planet strip shows a right-edge fade/arrow and swipes; Oz does not cover chips | | PENDING |
| A12 | `/portfolio/explore/` (3D city) | The district signs can be read; a tap opens the panel; labels never show over the panel | | PENDING |
| A13 | Browser Back/Forward across 3–4 pages | Each returns to the right page and scroll position | | PENDING |
| A14 | Touch: drawer menu, filters, Oz open/close, panels scroll | All respond; nothing is hidden behind Oz | | PENDING |

## iPhone: Safari

| ID | Check | Expected | Actual | Status |
|---|---|---|---|---|
| I1 | Fresh visit (Private tab) to `/portfolio/` | The introduction with the poster appears before the portfolio; no white flash | | PENDING |
| I2 | Tap Play introduction | Sound plays (check the ringer/silent switch and volume); the film plays **inline** (`playsInline`), not forced into fullscreen | | PENDING |
| I3 | Native controls: pause, resume, scrub, AirPlay/fullscreen | All work; exiting fullscreen returns to the introduction | | PENDING |
| I4 | Film ends | The portfolio appears by itself; the page scrolls | | PENDING |
| I5 | Skip, then pull-to-refresh | The introduction does not return in that tab | | PENDING |
| I6 | Deep link `/portfolio/about/#certifications` (new private tab) → Skip | Lands on About at Certifications | | PENDING |
| I7 | Rotate during the introduction | 9:16 kept, nothing cropped, no sideways scroll | | PENDING |
| I8 | Safe areas: Dynamic Island/notch, home indicator, collapsing toolbar | Nothing hidden; buttons reachable | | PENDING |
| I9 | Low Power Mode on, then Play | The film still plays when tapped (iOS may block autoplay; we never autoplay) | | PENDING |
| I10 | Airplane mode after load, then Play (media failure) | "The film couldn't play here…" message; Skip still enters the portfolio | | PENDING |
| I11 | Inline player on the homepage | Same poster; plays with sound; fullscreen works | | PENDING |
| I12 | 3D views (universe, explore, a world) | They load; touch orbit/zoom works; text is readable | | PENDING |
| I13 | Safari Back/Forward and swipe-back gesture | Correct pages; the introduction never re-appears | | PENDING |

## Laptop with a real GPU (Chrome/Edge, then Safari or Firefox)

| ID | Check | Expected | Actual | Status |
|---|---|---|---|---|
| L1 | Fresh visit, Play with sound, let the film end | As above; smooth fade into the homepage | | PENDING |
| L2 | Keyboard only: Tab, Enter, Esc on the introduction | Focus starts on Play, stays inside the introduction, and the ring is visible; Esc skips | | PENDING |
| L3 | 3D solar system, Earth, a world, 3D city | Frame rate feels smooth (measure if possible); no stalls | | PENDING |
| L4 | Screen reader (VoiceOver/NVDA) on the introduction | Announced as a dialog; buttons have clear names | | PENDING |
