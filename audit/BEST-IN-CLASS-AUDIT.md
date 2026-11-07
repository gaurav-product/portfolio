# Best-in-class audit: research, findings, fixes, 3D renders

Date: 6 November 2026 · Branch `claude/beautiful-goldberg-radrlu` · Draft PR gaurav-product/portfolio#1
**Not merged and not deployed.** Nothing in this pass changes a fact, figure or claim on the site. The fixes are rendering, accessibility, metadata and visuals only.

## 1. What "best in class" means here (research)

The guidance comes from practitioner and career sources, not controlled studies, so it is treated as heuristics.

**What hiring managers want**
- Proof of impact and clear judgement, more than visual polish.
- Case studies framed as problem → approach → result, with the person's role and scope stated.
- Pages that are fast and easy to scan. One 2026 guide calls speed a hiring signal; over-designed sites that hide content count against you.
- A few strong case studies rather than many weak ones.
- For AI product roles, concrete evidence of evaluation design. Vague "AI-augmented" claims read as filler.

**How long recruiters look**
- Estimates range from about 30 seconds to 3 minutes. Most of that time goes on the first case study and the About page.

**3D on a portfolio**
- Use still renders for content pages.
- Keep real-time 3D as an optional layer with a fallback, because load time and the main thread suffer otherwise.

Sources:
- [Underdog: PM portfolio examples 2026](https://underdog.io/blog/product-manager-portfolio-examples)
- [Leland: PM portfolio guide](https://www.joinleland.com/library/a/product-manager-portfolio)
- [ProdPad: product manager portfolio](https://www.prodpad.com/blog/product-manager-portfolio/)
- [Provn: PM builder portfolio (2026)](https://provn.co/blog/2026/06/product-manager-builder-portfolio)
- [Institute of AI PM: best AI PM portfolios](https://www.institutepm.com/knowledge-hub/best-ai-pm-portfolios)
- [Cursa: case studies recruiters can scan](https://cursa.app/en/article/ux-portfolio-case-studies-a-clear-structure-that-recruiters-can-scan-in-minutes)
- [uxfol.io: case study structure](https://blog.uxfol.io/ux-case-study-structure/)
- [DesignRush: 3D web design and UX performance](https://www.designrush.com/best-designs/websites/trends/how-3d-web-design-drives-real-ux-performance)
- [WebGL best practices](https://svilenkovic.com/3d/webgl-best-practices)

**How the site already meets this**
- A 30-second Recruiter Mode, with role-tailored ordering.
- Every figure carries an evidence label.
- Case studies follow a fixed template whose gaps are shown, not filled with narrative.
- GharGyaan's 214-case evaluation suite covers the AI-evaluation signal.
- Live 3D appears only in Explore Mode, with a 2D fallback.

This pass therefore focused on where the site measurably fell short.

## 2. Where it was failing (measured)

A new audit, `npm run audit` (`app/scripts/a11y-audit.cjs`), runs axe-core plus structural checks on **all 309 routes**, at desktop 1440 px and on a Pixel 7.

| Finding | Before | After |
|---|---|---|
| axe: **colour contrast** (serious) | 43 pages (research diagrams, Skills cards) | 0 |
| axe: **scrollable region not keyboard-reachable** (serious) | 11 desktop / 73 mobile | 0 |
| axe: **label not in accessible name** (serious) | 1 (Explore sound button) | 0 |
| axe: **heading order** (moderate) | 43 pages | 0 |
| axe: **empty table header** (minor) | 47 pages | 0 |
| axe: duplicate landmark labels | appeared during the fix | 0 |
| Pages with more than one `<h1>` | 89 research pages (up to 67 on one page) | 0 |
| Duplicate element ids | 44 pages (`/about` and research pages with diagrams) | 0 |
| Broken relative images | `/research/7` and `/research/9` (inline-HTML images resolved against this site) | 0 |
| Meta descriptions outside 50–160 characters | 7 | 0 |
| Titles over 65 characters | 2 | 0 |
| Research contents lists showing `&amp;` / `&#39;` | many entries | 0 |
| Tap targets under 24 px (non-inline) | back links, source links, footer links, quiz radios | enlarged |

## 3. Fixes

### Research reading pages (90 pages)

**Headings.**
- Study headings render one level down, so the page owns the single `<h1>`.
- Heading levels never skip.
- The original level is kept in `data-l` for styling. The text is unchanged.

**Images.**
- Inline-HTML images now resolve to the source repository at the pinned commit.
- An image that is genuinely absent from the repository shows a visible "Image not in the repository" note.

**Keyboard access.** Wide tables, code blocks and diagrams can be focused with the keyboard and scroll sideways.

**Table headers.** Empty header cells get a screen-reader-only label.

**Diagrams.**
- Each diagram's internal ids are namespaced, and repeated ids are suffixed.
- Diagram labels use light text on a solid background, which meets contrast.

**Contents lists.** HTML entities are decoded.

### Other fixes

**Explore Mode.** The sound toggle has one stable name, "Ambient sound", and its state is announced through `aria-pressed`.

**About.** The duplicate `how-i-think` id was removed.

**Lab Notes.** Section labels become `<h2>` elements with the same visual style.

**Tools.**
- RICE and Funnel action columns are labelled for screen readers.
- A side effect that let a hidden label widen the phone layout was caught by the crawler and fixed.

**Skills.** "Not yet evidenced" cards use a dashed border instead of reduced opacity, which had failed contrast.

**Metadata.**
- `fitDescription()` keeps every search snippet between 50 and 160 characters without inventing content. It is covered by a unit test.
- Long titles drop the brand suffix.

**Mobile speed.**
- A stylesheet preload is placed ahead of React's 15 script preloads.
- The phone hero image is preloaded (AVIF only, phones only).
- The small portraits no longer load at high priority.
- Inlining the CSS was tried and measured worse (86–88), so it was not shipped.

## 4. Original 3D renders for every section header

Ten scenes are written as procedural three.js code (`brand/renders/scenes.js`). They are rendered offline in headless Chromium (`brand/tools/render_3d.mjs`, software WebGL with bloom). They then run through the existing AVIF + WebP pipeline at five widths, each 4–40 KB.

They are labelled in the manifest as **"ORIGINAL 3D RENDER — procedural three.js scene"**. They contain no text, logos or data, and a unit test enforces this.

| Page | Visual metaphor |
|---|---|
| About | Eight stages orbiting a glass core: the operating loop |
| Projects | Layered platforms carrying abstract interface blocks |
| Case studies | A decision tree with one evidenced path lit |
| Product Thinking | A funnel of rings narrowing to one decision |
| Skills | A field of columns; the evidenced ones stand tall and lit |
| Product Atlas | A globe of points with arcs between them |
| Contact | A beacon sending signal outward |
| Lab Notes | Translucent ruled pages in the air |
| Ask Gaurav | An index of cards orbiting a core; one card connects |
| Search | A lens sharpening the points beneath it |

Placement:
- **Desktop:** each render sits beside the page title.
- **Phones:** a slim banner shows above the title. At 480 px wide it is about 4 KB.

The pages that already had owner-supplied illustrations keep them: Home, Experience, Research, AI Lab, the six districts and Explore.

The renders are reproducible:

```bash
node brand/tools/render_3d.mjs
```

```bash
python3 brand/tools/build_cinematic.py
```

## 5. Verification (final build)

| Check | Result |
|---|---|
| TypeScript | 0 errors |
| Vitest | **52 / 52** (one new test for search snippets; the image test now also checks that renders carry no baked text) |
| Playwright, desktop 1440 + Pixel 7 | **56 passed, 0 failed, 0 flaky**, 2 skipped by design |
| All-route crawler (part of the above) | 12 / 12 shards, 309 routes × 2 viewports: 0 dead controls, 0 overflow |
| New full-site audit (`npm run audit`) | **309 routes × 2 viewports: 0 problems**. That means 0 axe violations, 1 `<h1>` per page, no skipped headings, no duplicate ids, no images without alt, no overflow. |

**Lighthouse 12.8.2, mobile**

| Route | Score |
|---|---|
| `/` | 88 |
| `/?nointro` | 88 |
| `/recruiter` | 93 |
| `/projects/careconnect` | 94 |
| `/product-thinking/rice` | 94 |
| `/research` | 94 |
| `/research/90` | 88 |
| `/ai-lab` | 89 |
| `/explore` | 95 |
| `/about` | 93 |
| `/districts/ai-safety-lab` | 94 |

**Lighthouse 12.8.2, desktop**
- 99–100 on every route except `/explore`, which scores 91.
- **Accessibility, best practices and SEO: 100 on all 22 runs.**

Test changes in this pass: two tests were updated because the intended markup changed. Neither check was weakened.
- **J15** now finds the study title at its new heading level, and also asserts that the page has exactly one `<h1>`.
- **J22** checks the sound toggle by its stable name and its `aria-pressed` state.

## 6. Known limitations

1. **External images on two study pages.** `/research/1` uses a GitHub attachment and `/research/7` uses Wikimedia Commons. This sandbox cannot reach those hosts, so they could not be verified here. They are public URLs written in the source study and load for normal visitors.
2. **Mobile speed on `/` and `/research/90` (88).** Both are bound by first paint on Lighthouse's simulated slow 4G, where script and font bandwidth is the limit, not the images. The levers left are bigger, riskier changes, such as server rendering fewer scripts. Measuring on the real CDN is the right next step.
3. **Software WebGL.** The 3D renders and Explore Mode screenshots were produced with SwiftShader, so on a real GPU the live scene is identical but faster.
