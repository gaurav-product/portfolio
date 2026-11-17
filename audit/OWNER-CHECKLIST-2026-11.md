# Owner checklist before final publication (PR #3)

Only Gaurav can complete these items. None of them has been done or ticked by automation. Playwright emulation is **not** physical-device testing.

| # | Item | What to do | Where | Status |
|---|---|---|---|---|
| 1 | **Android: Chrome** | Fresh incognito tab on the **homepage**: the introduction shows with the poster, starts muted, and **Enable sound** gives sound. Also check Skip, the end → homepage, and portrait/landscape. Open a **project link directly**: no introduction. Then 3D views, touch, Back | `audit/DEVICE-QA-CHECKLIST-2026-11.md`, rows A1–A14 | ☐ PENDING |
| 2 | **iPhone: Safari** | As above, plus: plays inline (not forced fullscreen), sound with the silent switch off, safe areas (notch, home bar), Low Power Mode, airplane mode → error message and Skip still work | Same file, rows I1–I13 | ☐ PENDING |
| 3 | **Laptop with a real GPU** | 3D solar system, Earth, a world and the 3D city run smoothly; keyboard on the introduction (Tab stays inside, Esc skips); screen reader announces a dialog | Same file, rows L1–L4 | ☐ PENDING |
| 4 | **Captions: five uncertain lines** | Listen and correct: 0:10 "IWA Mastu", 0:14 the project list, 0:19 "Each labor…", 0:23 "And a phone pick app", 0:40 "Gaurav.os". Captions stay unpublished until this is done | `audit/captions/REVIEW.md` | ☐ PENDING |
| 5 | **PhonePe prototype screens** (optional) | If they can be shared: real screens or Figma exports of the capstone's 5-screen prototype. Until then the honest "Product screens to be added" placeholder stays; nothing is mocked up | Send the files; they go in the PhonePe world gallery | ☐ PENDING |

**Then:**
1. Approve PR #3.
2. Merge it (with a merge commit).
3. Run `app-deploy-pages` from `main` (`site_url=https://gaurav-product.github.io/portfolio`, `base_path=/portfolio/`).
4. Re-check the live site.
