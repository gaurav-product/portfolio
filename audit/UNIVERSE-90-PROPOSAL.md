# Correction proposal: `/universe` = the 90 individual case studies

Status: 7 Nov 2026. **Proposal only; nothing is implemented.** Owner requirement:
> `/universe` represents all 90 individual product management case studies, not 11 mixed destinations.

## 0. Summary

| | Today | Proposed |
|---|---|---|
| Earth markers | 11 mixed destinations | **90 markers, one per case study** (`corpus.studies`, the existing source of truth) |
| Selecting a marker | Flies into a project building | Flies to the study and opens a **study panel**; "Read the full study" goes to the unchanged `/research/:day` |
| Project worlds (7) | On the Earth | A separate **Project Worlds** hub at `/worlds`, worlds at `/worlds/<slug>` |
| The Teardown | On the Earth | `/worlds` → "Writing" section |
| Interview Radar, Repass | On the Earth | `/worlds` → "Emerging Ventures — concepts" section; `/ventures` unchanged |
| `/atlas` 2D map (Phase 6) | 90 studies | Unchanged plan. It shares the same layout, palette and filter logic as the Earth (one module, no duplicate data) |

## 1. Representing the 90 studies as distinct markers

**Data**
- Read only from the existing generated corpus (`content/corpus.ts`): day, company, title, category, evidence level, summary, flags (PRD 78, experiment 76, ASSUMPTIONS 63, executed checks 35), and source links.
- No new data file and no copied text.
- The study categories are the corpus's own derived labels: Healthcare 24, Consumer 22, Marketplace 11, AI 11, Fintech 8, SaaS 7, B2B 6, Analytics 1. The UI will call them "derived category", exactly as `/atlas` does.

**Layout** (new pure module `content/studyMap.ts`, unit-tested)
- Each of the 8 categories gets a **region** on the globe, its size proportional to its study count, spread so the regions don't touch.
- Within a region, studies sit in **day order on a golden-angle spiral**, at least about 4° apart. Every one of the 90 is distinct and clickable.
- The layout is deterministic: the same study always sits in the same place, so links, return-to-place and screenshots are stable.
- A caption says: "Positions group studies by category; they are not geography."

**Look**
- One `InstancedMesh` for pins and one for selection rings, about 3 draw calls in total (today's 11 markers use about 44).
- **Colour** is the study category, using the same palette as `/atlas`, moved into a shared module. **Size** is the evidence level (Verified > Documented > Sourced > Narrative), as on `/atlas`.
- The far side of the globe fades out in the shader, so there's no per-frame CPU work per marker.
- **No 90 floating labels**, which would be clutter. Instead:
  - **8 region labels**: category name and count;
  - a **hover or focus preview card**: Day N · company · study title · derived category · evidence level · "Case study (research) — not a launched product".

## 2. Explore, search, filter and select

**Study browser** (DOM drawer, also the accessible equivalent of the markers)
- Search by company, title or summary.
- **Category chips** with counts.
- **Evidence-level** filter.
- **Toggles** for "has PRD", "has experiment", "has ASSUMPTIONS file" and "executed checks", all from existing flags.
- Sort by day.
- A live result count for screen readers ("24 of 90 studies").
- **Filtering dims non-matching markers on the Earth.** "Show results" turns the globe to the matching region.

**Selecting a study** (from a marker or the list)
- The camera turns and moves closer to that study. There's no building and no flight into a world.
- A **study panel** opens with:
  - day, company and title;
  - derived category and evidence level with its definition;
  - the corpus summary;
  - flags, words and sources;
  - **Read the full study** (`/research/:day`), **Original on GitHub**, **Show on Atlas**, **Previous / Next study**.

**URLs, history and links**
- Each selection gets a shareable URL: `/universe?study=12`, and `/universe?category=Healthcare` for filters. These are handled in the browser, so no new prerendered pages are needed.
- Back closes the panel and Forward reopens it.
- Phase 3's command palette and Oz ("show me healthcare case studies on Earth") deep-link to the same URLs.

**Keyboard**
- Arrow keys rotate the Earth; +/- zoom.
- In the drawer: ↑/↓ move through the list, Enter selects, Esc closes.
- `[` and `]` go to the previous and next study.

## 3. Project worlds stay accessible, outside the Earth

**New `/worlds` hub, "Project Worlds"** — a calm 2D page, no 3D on arrival. It has three clearly separate sections:
1. **Built projects:** the 7 project worlds, each card showing art, its real status and "Enter world".
2. **Writing:** The Teardown.
3. **Emerging Ventures — concepts:** Interview Radar and Repass, with the "Concept in development" note.

**The worlds themselves** stay as they are (buildings, real screenshots, floor directory, case panel, sound). They move to `/worlds/<slug>`.

**Old URLs keep working.** `/universe/<slug>` becomes a small prerendered redirect to `/worlds/<slug>`.

Inside a world, "Back to Earth" becomes **"All worlds"** (back to `/worlds`). A secondary link reads "90 case studies on Earth".

**Entry points into the worlds**
- `/projects` chapters: "Visit in 3D".
- Each project page's header.
- `/ventures` (existing "Visit in 3D").
- Oz: "take me to Repass" → `/worlds/repass`.
- The nav drawer and footer: "Project Worlds".

**The 90-day corpus's own building** is no longer needed, since the Earth now *is* the corpus. Its URL would redirect to `/universe`. The corpus stays a project on `/projects`.

## 4. The Teardown, Interview Radar and Repass

- **Not on the Earth.**
- **On `/worlds`**, in their own labelled sections.
- **The Teardown** keeps its world and its LinkedIn subscribe link.
- **Interview Radar and Repass** keep their worlds, `/ventures` pages, concept labels and legal notes. Nothing about their status or copy changes.

## 5. Performance, accessibility, mobile and existing routes

**Performance**
- Instancing and the shader-side fade mean 90 markers cost less than today's 11.
- The Earth textures, quality tiers and software-renderer list-first fallback are unchanged.
- **Data weight.** The Universe page would load the existing corpus chunk (about 22 KB gzipped, already used by `/research`). Trimming it to a slim index (about 46 KB raw) is optional.
- **Budget:** `/universe` within 2 Lighthouse points of today (88 mobile / 100 desktop), and no layout shift.

**Accessibility**
- The study browser lists all 90 studies as real buttons; the 3D markers stay `aria-hidden`.
- Focus moves into the panel on selection and returns on close.
- Reduced motion: no camera moves.
- The crawler covers `/universe`, `/worlds` and the redirect pages.

**Mobile**
- Two-step selection: tap a pin, see the preview sheet, then tap "Open study". This avoids mis-taps among small targets.
- Larger hit areas.
- A "Browse list" button.
- The study panel is a bottom sheet with a fixed height, so there's no layout shift.

**Unchanged routes**
- `/research/:day` (all 90), `/atlas`, `/projects/*`, `/ventures/*`, `/case-studies`, `/recruiter`, `/cv`.
- `/universe` stays as the address but changes content.
- Project-world URLs move to `/worlds/<slug>`, with redirects from the old addresses.

## 6. Interaction flow

```
Home ── "90 case studies in 3D" ─▶ /universe (intro → Earth with 90 pins in 8 category regions)
   │                                   ├─ hover/focus pin → preview card
   │                                   ├─ Studies drawer: search · category · evidence · flags → pins dim/highlight
   │                                   ├─ select → camera turns/zooms → study panel  (/universe?study=N)
   │                                   │      ├─ Read the full study → /research/N   (Back returns to the same study)
   │                                   │      ├─ Previous / Next study · Show on Atlas → /atlas
   │                                   └─ "Project Worlds" link → /worlds
   └─ "Project Worlds" ─▶ /worlds ─▶ /worlds/careconnect … (building, screenshots, floors) ─▶ All worlds
```

## 7. Estimated technical impact

**New**
- `content/studyMap.ts` (layout and shared palette)
- `universe/StudyMarkers.tsx`
- `universe/StudyPanel.tsx`
- `universe/StudyBrowser.tsx`
- `routes/worlds.tsx` (hub)
- `routes/world.tsx` (worlds moved out of `universe.tsx`)
- redirect stubs

**Modified**

| Area | Files |
|---|---|
| Universe | `routes/universe.tsx` (Earth-only), `universe/Earth.tsx` (marker layer swap), `universe/Scene.tsx`, `content/universe.ts` (becomes the worlds list) |
| Routing | `routes.ts`, `routes-manifest.ts` |
| Pages | `routes/projects.tsx`, `routes/project-detail.tsx`, `routes/atlas.tsx` (shared palette) |
| Navigation and search | nav, Header, Footer, search index |
| Oz | intents and knowledge pack |
| Tests | `tests/e2e/universe.spec.ts` (largely rewritten), `tests/e2e/interaction.spec.ts` (paths), new unit tests for the layout |
| Docs | documentation |

**Overall**
- **Size:** about 900–1,300 changed lines, in one commit plus docs.
- **Routes:** about 326 → about 338: `/worlds` plus 11 world pages, with the old URLs as redirect stubs.
- **Bundle:** about +3–5 KB gzipped on the Universe chunk; the corpus chunk is reused.
- **Risk:** medium. It touches the most complex page. It's covered by rewritten e2e tests, the crawler and Lighthouse.

## 8. Decisions needed before implementation

1. **Hero CTA.** "Explore my work" should open:
   - (a) `/projects` (recommended), with a second hero link "90 case studies in 3D" to `/universe`; or
   - (b) `/universe`; or
   - (c) `/worlds`.
2. **World URLs.** Move to `/worlds/<slug>` with redirects (recommended, clean separation), or keep `/universe/<slug>`?
3. **The 90-day corpus building.** Retire it, with a redirect to `/universe` (recommended), or keep it on `/worlds`?
4. **Phase 2 CI fix** (see `audit/VERIFICATION-PRE-PHASE-3.md` §5). Approve the small fix described there?
