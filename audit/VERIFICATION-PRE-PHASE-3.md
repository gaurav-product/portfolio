# Verification before Phase 3

Status: 7 Nov 2026. Branch `claude/beautiful-goldberg-radrlu` at `4bf200f`. Report only: **nothing was changed.**

## 1. CI for `4bf200f`: one failed, one passed

| Run | Result |
|---|---|
| `app-ci` pull-request run [42360832087](https://github.com/gaurav-product/portfolio/actions/runs/42360832087) | **success** |
| `app-ci` push run [42360827930](https://github.com/gaurav-product/portfolio/actions/runs/42360827930) | **failure**: 1 failed, 99 passed, 2 skipped |

**The failing test:** "Phase 2 — page transitions › entering the Universe uses the circular reveal". It expected the page marker `data-vt="reveal"` but read `undefined` for the full 5 seconds.

**Root cause (reproduced and isolated)**
- `Transitions.tsx` marks the reveal with `html[data-vt="reveal"]` and removes the mark **on a fixed 1.2 s timer**. The test checks the live attribute.
- On a slow CI runner, Playwright's click returned more than 1.2 s after the click, by which time the mark was already removed. Same commit, the other run passed, so this is timing-dependent.
- Under 6× CPU throttling locally, the reveal is applied every time (8/8), including clicks before the page finished starting up. Navigation is never a full reload.
- **Product side effect of the same timer:** on a slow device, if the Universe chunk takes longer than 1.2 s to render, the mark is gone before the animation starts, and the visitor sees the default fade instead of the circular reveal. Nothing breaks.

**Proposed fix** (small; not applied yet)
1. `Transitions.tsx`: remove the mark when the transition's own animation ends (`animationend` on the view-transition pseudo-element), with a 5 s safety timeout, instead of a fixed 1.2 s.
2. Test: record that the reveal mark was applied (a flag set when it appears) rather than polling the live attribute.
3. Verify with 20 repeats under 6× CPU throttling, then let CI run.

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

**Unresolved Phase 2 issues:** one. The flaky reveal test, and the slow-device fallback behind it, described in §1. The fix awaits your approval.

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
