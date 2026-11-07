# Verification before Phase 3

Status: 7 Nov 2026. Branch `claude/beautiful-goldberg-radrlu` at `4bf200f`. Report only: **nothing was changed.**

## 1. CI for `4bf200f`: one failed, one passed

| Run | Result |
|---|---|
| `app-ci` pull-request run [42360832087](https://github.com/gaurav-product/portfolio/actions/runs/42360832087) | **success** |
| `app-ci` push run [42360827930](https://github.com/gaurav-product/portfolio/actions/runs/42360827930) | **failure**: 1 failed, 99 passed, 2 skipped |

**The failing test:** "Phase 2 — page transitions › entering the Universe uses the circular reveal". It expected the page marker `data-vt="reveal"` but read `undefined` for the full 5 seconds.

> **Correction (7 Nov, later the same day).** The root cause first written here, "a fixed 1.2 s cleanup timer", was **wrong**. The text below is the corrected account.

**Actual root cause: the test interacted before the app had started**
- On a slow CI runner, the test clicked "Explore my work" before the app had hydrated.
- Before hydration, links are plain HTML links. The click is a normal full-page load to `/universe`: no transition and no reveal flag. This is the intended progressive-enhancement fallback, not a product bug.
- The URL check passed, and the flag check failed because the new document never had the flag.
- The next CI push run (for `f38d093`) recorded every flag value, so it couldn't have checked too late, and it still recorded none. A tilt test failed in the same run for the same reason: the cursor engine hadn't started yet.
- **Reproduced locally** by delaying every JS module by 1.5 s:
  - click before hydration: no flag, new document;
  - click after hydration: `["reveal"]`, same document.
- **What misled the first diagnosis.** 6× CPU throttling alone doesn't delay script loading enough to reproduce it, and an early diagnostic script of mine had a bug.

**Fixes**

| Commit | Kind | Change |
|---|---|---|
| `61eb856` | Test-only, **the actual CI fix** | Desktop interaction tests wait until the app has started (`ready()`); reduced-motion and no-View-Transitions tests wait for `networkidle`; the tilt-light check waits for its fade-in. |
| `f38d093` | Runtime, **transition-lifecycle hardening** | The reveal flag is cleared when the browser's transition finishes (or is skipped), with a 5 s safety net, instead of after a fixed 1.2 s. |

`f38d093` was approved, but it did not fix the CI failure. Its own value is that on a slow device, where the Universe takes more than 1.2 s to render, the circular reveal still plays instead of falling back to a plain fade. It is reviewed in §6.

**CI after the fixes**
- `61eb856`: push run ✅ and pull-request run ✅.
- `c228166`: pull-request run ✅ (docs-only, so by the workflow's `paths` filter there is no push run).

## 2. What the Earth at `/universe` contains today

The markers come from `app/src/content/universe.ts` (`destinations`): **11 markers.**

| Cluster | Marker | Opens |
|---|---|---|
| Healthcare | Evamastu, Aaroh, CareConnect, GharGyaan | Their 3D project worlds (`/universe/<slug>`) |
| Fintech | PhonePe Smart Spend Coach, RupeeRadar | Project worlds |
| AI | Nexus | Project world |
| Research & writing | **90-Day Product Case Studies (one marker for the whole corpus)** | Corpus world |
| Research & writing | The Teardown | Newsletter world |
| Emerging Ventures | Interview Radar, Repass | Concept worlds |

**The 90 case studies are not individual markers on the Earth.** They are one destination. Individually, they live on `/research`, `/research/:day` and the `/atlas` constellation.

## 3. Comparison with the written decisions

### The Product Universe brief (7 Nov)

What it says, verbatim:
- "Every existing verified product or case study should have a distinct location or interactive marker on the Earth."
- Under "Projects to preserve and represent" it lists: "Evamastu. Aaroh. CareConnect. GharGyaan. RupeeRadar. PhonePe Smart Spend Coach. Nexus. Product teardowns. Existing research and other verified case studies."
- On Interview Radar and Repass: "These should appear as two additional destinations in the product universe, but their status must be clearly displayed."
- Example interaction: "They click CareConnect. The camera moves towards the selected marker… A realistic 3D architectural structure appears."

### The Phase 0 universe plan (approved)

`audit/UNIVERSE-PHASE-0.md` §6 says: "Every project, both concepts and The Teardown sit on a visual layout…".

The approval question was "Where should the new revolving-Earth experience live?". The owner answered "New /universe".

### The interaction-upgrade brief, Phase 6 (2D map)

It says: "This map represents the 90 case studies only. Do not add the seven product projects, The Teardown, Interview Radar or Repass to this map." The owner then decided: "Upgrade the existing `/atlas`."

### Finding

- **The current Earth matches the written Product Universe brief and the approved plan.** That brief asked for projects, teardowns, research and the two concepts on the Earth.
- **The rule "90 case studies only, projects and concepts kept separate" appears in the Phase 6 brief, and it is about the 2D map (`/atlas`), not the Earth.** I couldn't find a written decision that the Earth itself should show only the 90 case studies.
- So there is a mismatch with the decision as now stated. It isn't an implementation error, but it is a real difference, and the owner should decide which one is intended.

## 4. Options (nothing changed yet)

| Option | What changes | Size |
|---|---|---|
| **A. Keep as built** | Nothing. The Earth stays the hub for projects and concepts. `/atlas` (Phase 6) becomes the 90-study-only map, as already approved. | None |
| **B. Earth = the 90 case studies only** | **Earth:** 90 markers from the existing `corpus.studies`, grouped by their 8 existing categories, opening the existing `/research/:day` pages. No new data. **Removed from the Earth:** projects, concepts, The Teardown and the corpus marker. **Kept:** their 3D worlds at `/universe/<slug>`, reached from `/projects` ("Visit in 3D"), `/ventures` and Oz. **Files:** `content/universe.ts`, `universe/Earth.tsx` (90 instanced markers), `routes/universe.tsx` (study preview and list), Oz "back to Earth" wording, tests, docs. **Also needs a decision:** what "Explore my work" should open, since the Earth would no longer show projects. | Medium. This is the smallest change that makes the Earth 90-only; it is not a one-line fix. |
| **C. Two layers on one Earth** | A toggle on the Earth: "Projects & concepts" or "90 case studies", with the 90-study layer separate. | Medium. Doesn't make the Earth "only" the 90 case studies. |

Recommendation: **A**, unless the intent really is B. With A, the 90-study map is delivered as approved in Phase 6 at `/atlas`, and nothing is duplicated.

## 5. Phase 2 regressions and PR state

**Local checks on `4bf200f`**
- `tsc`: clean.
- Vitest: 85/85.
- Playwright: **100 passed, 2 skipped by design, 0 failed.**
  - One test-timing issue was fixed during Phase 2. The new transition tests passed 30/30 across 5 repeats.
- Accessibility crawler: 326 × 2, **0 problems**.
- Lighthouse: every representative page within the 2-point budget.
  - Home on mobile scored 84–86 over four runs (median 85, baseline 86).
  - Layout shift is 0 everywhere.

**Unresolved Phase 2 issues:** none. See the corrected §1 and the hardening review in §6.

**PR #1**
- open, **draft**, **not merged**;
- base `main` at `0f453f7`, unchanged.

**Deployment**
- Only `app-ci` (build and test) is registered on the repository.
- `app-deploy-pages.yml` exists only on this branch, is manual-dispatch only, and has never run, so **nothing has been deployed**.

**CI for `4bf200f`:** pull-request run passed, push run failed (§1).

**CI history for the earlier commits:** all succeeded (push and pull-request runs) for:
- `870762c` certifications;
- `72fd7f3` Windows preview fix;
- `250d5ec` Phase 0;
- `1f19ab1` Phase 1.

## 6. Review of the `f38d093` runtime change (transition-lifecycle hardening)

**What it does**
- `Transitions.tsx` wraps `document.startViewTransition` while the app is mounted, and restores it on unmount.
- When React Router starts the transition that a click asked for, the wrapper attaches to that transition's `finished` promise, which settles when the transition finishes or is skipped. It then removes the `data-vt` flag.
- A 5 s safety timer covers the case where no transition ever starts.
- An older transition never clears a newer click's flag (an id check).

**Is the wrapping necessary?** No, not strictly.
- **The hook alternative.** React Router itself awaits each transition's `finished` promise and skips the previous transition when navigation is interrupted. It exposes that lifecycle through a supported public hook, `useViewTransitionState(path)`, which is true while a transition to that path is running. The flag could be cleared when that hook turns false, with no global patch.
- **Why the wrapper was chosen.** It ties each click to its exact browser `ViewTransition` object, without tracking target paths.
- **Its cost.** It patches a global browser method. Any other code that patches the same method stacks with it; our own test instrumentation does exactly that, and it works.
- **Recommendation.** Replace the wrapper with `useViewTransitionState` in a small, separate commit, if you approve. Behaviour stays the same and the tests below remain the acceptance criteria.

**Tests of the hardening**
- All are in `tests/e2e/interaction.spec.ts`, running in Chromium (the View Transitions API).
- Each ran 5× normally, and the lifecycle tests also ran 5× with every JS module delayed 1.5 s.

| Scenario | Test | Result |
|---|---|---|
| Rapid navigation (4 clicks back-to-back) | Every started transition settles; the flag is cleared; the page stays interactive | 5/5 · slow 5/5 |
| Skipped transition | Navigation completes and the flag is cleared | 5/5 · slow 5/5 |
| A transition that never reports finishing | The flag stays until the **5 s safety net** clears it | 5/5 · slow 5/5 |
| Cleanup after the reveal | Started → finished → flag cleared | 20/20 at 6× CPU and slow JS (from `61eb856`) |
| No View Transitions support (Firefox-like) | Nothing wrapped or polyfilled; plain navigation; no flag; no errors | 5/5 |
