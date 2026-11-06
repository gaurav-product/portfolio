# Elegance redesign and Explore Mode upgrade

Date: 6 November 2026 · Branch `claude/beautiful-goldberg-radrlu` · Draft PR gaurav-product/portfolio#1
**Not merged and not deployed.** Rollback point: `de94a3b` (the approved release-readiness state).

This covers option 1 from the design review: a calmer, more elegant site, plus the best ideas from the cinematic-portfolio guide applied inside Explore Mode. The car, character and AI video were deliberately left out. No content, facts or claims changed: this is design and engineering only.

## What changed

### Design system (applies to all 309 pages)

**Colour.** The neon accent `#4DFF4D` is now a soft emerald, `#6BE39A`. The change covers the UI tokens, every hard-coded value, the 3D scene, the Atlas and the RICE tool. Contrast on the background is about 11:1.

**Type.**
- Labels and status tags use the sans face instead of the typewriter mono. Mono is kept only for small index numbers.
- Headings are tighter and larger.
- Metric tags are sentence case with the figure in bold, replacing the all-caps pills.

**Shape and motion.**
- Buttons are rounded.
- Card hover is a gentle 2 px lift with a faint border.
- The portrait has a thin ring instead of a neon glow.

**Layout.**
- Every page now starts from the same left margin as the header.
- Narrow pages cap their line length on the right instead of centring.
- Spacing is more generous throughout.

### Header

- Six primary links: About, Experience, Projects, Product Thinking, Research and Contact.
- A search icon, a quiet "Recruiter Mode" link and a white CV button.
- The full menu drawer is available at every width, so Case Studies, Atlas, AI Lab, Skills, Ask Gaurav and Explore remain one click away.

### Home

**Hero.** The name, tagline, one sentence and two buttons (Explore my work, Download CV). Three quiet links follow: Enter Explore Mode, Recruiter Mode and the intro film. The coloured role line and the 7 skill tags were removed.

**Illustration.** It is framed from its right edge, so no baked-in label is cut off or sits behind text.

**"At a glance" band.** Portrait, location and availability sit beside the four verified highlights, shown as a clean row without boxes and with their definitions kept. The six districts follow as a numbered list.

### Page templates

**Page heroes.** Larger titles and a soft glow replace the grid pattern. Backdrop images are cropped so the baked-in "Gaurav.OS" wordmark no longer shows.

**District pages.** The "District 01" label is in the new style, and the "represents" items read as a calm dotted line instead of pills.

**Project pages.** The cover diagram sits to the right of the text on desktop only, so its lettering never runs behind the copy.

**Other pages.**
- Recruiter Mode has a larger header.
- The CV toolbar is aligned with the CV sheet.
- The footer and table headers use the new label style.

### Explore Mode (3D)

**Distinct architecture.** Each district has its own silhouette, labelled in code as abstract and not a depiction of real facilities:

| District | Silhouette |
|---|---|
| Product Leadership | Stepped ascent to a summit spire |
| HealthTech Innovation | Care dome |
| AI & Safety Lab | Geodesic core inside a guard ring |
| Research & Analytics | Towers rising like a bar chart |
| Professional Experience | Skyline |
| Knowledge & Headquarters | Tiered rotunda under the halo |

**Typography in the world.**
- Each plaza has a lit sign with the district number and name, angled to read from above the city.
- District buttons are compact icon pins whose name opens on hover, on focus or when selected.
- The accessible name is always present.

**Roads.** Lit roads link the headquarters to every district.

**Camera.** It glides along an arc that rises over the city between stops instead of cutting straight. The selected district is framed to the left of the side panel.

**The city assembles itself.** Districts appear one by one, from the headquarters outward. This also splits the first GPU upload into small tasks: desktop `/explore` total blocking time fell from about 340 ms to about 240 ms.

**Rendering.**
- Cheaper Lambert materials and leaner geometry.
- The synchronous shader-status check is skipped in production builds.

**Unchanged.**
- The 2D map, the guided tour, sound (off by default), reduced motion, the WebGL fallback and phones using the map by default.
- The 3D scene still renders only on demand.

## Verification (final build of this commit)

| Check | Result |
|---|---|
| TypeScript | 0 errors |
| Vitest | 51 / 51 |
| Playwright (desktop 1440 + Pixel 7) | **56 passed, 0 failed, 0 flaky**, 2 skipped by design |
| All-route crawler (part of the above) | 12 / 12 shards, 309 routes × 2 viewports, 0 dead controls |
| Console errors / horizontal overflow | 0 on every page reviewed (14 desktop, 6 mobile) |

### Lighthouse 12.8.2, mobile

| Route | Score |
|---|---|
| `/` | 87 |
| `/?nointro` | 87 |
| `/recruiter` | 93 |
| `/projects/careconnect` | 94 |
| `/product-thinking/rice` | 93 |
| `/research` | 94 |
| `/research/90` | 88 |
| `/ai-lab` | 90 |
| `/explore` | 95 |
| `/about` | 94 |
| `/districts/ai-safety-lab` | 93 |

### Lighthouse 12.8.2, desktop

- 99–100 on every route except `/explore`, which scores **93** (it was 89 before this work).
- Accessibility, best practices and SEO are **100 on all 22 runs**.
- Run-to-run variance is about ±2. Full table: `app/reports/lighthouse/summary.md`.

## Screenshots

These are in `audit/screenshots/elegance-mockup/`.

**Before/after comparisons:**
- `compare-home-desktop.jpg`
- `compare-home-mobile.jpg`
- `compare-district-desktop.jpg`
- `compare-recruiter-desktop.jpg`

**After only:**
- `after-explore-3d-desktop.jpg`
- `after-explore-3d-district.jpg`
- `after-experience-desktop.jpg`
- `after-project-desktop.jpg`

## Known limitations

1. Mobile `/` (87) and `/research/90` (88) remain just under 90, as before. Both are first-paint bound on throttled 4G.
2. The 3D screenshots were rendered with software WebGL, so on a real GPU the scene renders the same but faster.
3. The research reading pages keep the source repository's own badge styling, because the text is rendered unedited.

## Decisions still with the owner

These are unchanged from the release-readiness report:
- Merge.
- Deployment target.
- The research bylines.
- The portrait.
