# Handoff: moving this branch's files and metadata into the Lovable site

**This repository does not deploy to https://gaurav-os.lovable.app/.** The live site is a
separate Lovable project ("Gaurav OS", TanStack Start, project id
`7e8dfe68-69d6-4086-a70c-4baa81efc07e`) with its own code and its own content file
(`src/data/content.ts`). Nothing on branch `claude/ai-product-portfolio-redesign` reaches it
unless it is moved by hand as described here.

The Lovable state below was read from Lovable commit `65a178d` (29 Oct 2026). The live
site was **not** inspected; this environment cannot reach `*.lovable.app`. Re-check the
Lovable project before acting if it has changed since.

---

## 1. What this branch provides (verified)

All files are committed under `docs/` and served with HTTP 200 by a static server.

| Route | File in branch | Size | sha256 (first 12) |
|---|---|---|---|
| `/cv.html` | `docs/cv.html` (source `site/cv.html`) | 6,304 B | `21163c4adcfc` |
| `/media/gaurav-kumar-singh-cv.pdf` | `docs/media/gaurav-kumar-singh-cv.pdf` | 107,219 B · 2 pages | `1e92b5f224f0` |
| `/media/gaurav-os-poster.jpg` | `docs/media/gaurav-os-poster.jpg` | 21,020 B · 1600×900 | `7d79c02645d6` |
| `/robots.txt` | `docs/robots.txt` | 74 B | `69b13d4d8a8c` |
| `/sitemap.xml` | `docs/sitemap.xml` | 227 B | `ff580157949a` |

Every URL-bound value in the build uses `https://gaurav-os.lovable.app/`:

| Where | Value |
|---|---|
| `<link rel="canonical">` (home) | `https://gaurav-os.lovable.app/` |
| `<link rel="canonical">` (CV page) | `https://gaurav-os.lovable.app/cv.html` |
| `og:url` | `https://gaurav-os.lovable.app/` |
| `og:image`, `twitter:image` | `https://gaurav-os.lovable.app/media/gaurav-os-poster.jpg` |
| JSON-LD `ProfilePage.url` | `https://gaurav-os.lovable.app/` |
| `sitemap.xml` | `https://gaurav-os.lovable.app/` and `https://gaurav-os.lovable.app/cv.html` |
| `robots.txt` | `Sitemap: https://gaurav-os.lovable.app/sitemap.xml` |

The value is set once, in `SITE` in `site/scripts/build_site.py`.

## 2. What the Lovable project already has

All five routes already exist in Lovable, but as **server routes that generate their
own output**, not as copies of these files:

| Route | Lovable implementation | Same as this branch? |
|---|---|---|
| `/cv.html` | `src/routes/cv[.]html.tsx`: a React page built from Lovable's `content.ts` | **No.** Different layout, and its data comes from Lovable's content, not this branch's |
| `/media/gaurav-kumar-singh-cv.pdf` | `src/routes/media.gaurav-kumar-singh-cv[.]pdf.ts` → `src/lib/cv-pdf.ts`: generated with `pdf-lib` on every request | **No.** A different PDF, built from Lovable's content |
| `/media/gaurav-os-poster.jpg` | `src/routes/media.gaurav-os-poster[.]jpg.ts`: proxies the asset `gaurav-os-poster-v2.jpg` (49,413 B) | **No.** A different image; this branch ships the original poster (21,020 B) |
| `/robots.txt` | `public/robots.txt`, already ending `Sitemap: https://gaurav-os.lovable.app/sitemap.xml` | Equivalent, no change needed |
| `/sitemap.xml` | `src/routes/sitemap[.]xml.ts`: lists routes marked `staticData: { sitemap: true }` (`/` and `/cv.html`) | Equivalent output, no change needed |

The URL metadata also already matches: `src/lib/public-profile.ts` sets
`SITE_URL = "https://gaurav-os.lovable.app/"`, and `src/routes/index.tsx` and
`cv[.]html.tsx` use it for the canonical link, `og:url`, absolute `og:image` /
`twitter:image` and the JSON-LD `url`.

**Net:** the routes and URLs are in place on Lovable. What differs is the *content* those
routes serve.

## 3. Steps, in Lovable

Do these in the Lovable editor (or a repo connected to the Lovable project), then publish.

### 3a. Poster (choose one; this is your decision)
- **Keep `poster-v2`:** no change. Link previews show the v2 image.
- **Use this branch's poster:** upload `docs/media/gaurav-os-poster.jpg` as a Lovable
  asset and point `media.gaurav-os-poster[.]jpg.ts` at that asset's `.asset.json`
  instead of `gaurav-os-poster-v2.jpg.asset.json`.

### 3b. CV PDF (choose one)
- **Ship this branch's PDF as-is:** upload `docs/media/gaurav-kumar-singh-cv.pdf` as a
  Lovable asset, rewrite the PDF route to proxy it (the same pattern as the poster route),
  and delete `src/lib/cv-pdf.ts`. The download is then byte-identical to the reviewed
  two-page CV.
- **Keep generating it in Lovable:** keep the route, and fix the data first (3d). The
  generator prints whatever `content.ts` says, so today it prints "Product Professional"
  and "Open to product roles across industries".

### 3c. CV page (`/cv.html`)
Do **not** copy `docs/cv.html` into Lovable. It loads `content.js` from this repo, which
the Lovable site does not serve, so it would render empty. Keep Lovable's route and fix
the data it reads (3d).

### 3d. Content corrections to `src/data/content.ts`
Port these by hand, field by field:

| Field (Lovable `content.ts`) | Lovable now | This branch |
|---|---|---|
| `site_config.role` | `Product Professional` | `AI Product Professional`, plus a new `headline`: "AI product professional building evidence-led, safety-conscious products from discovery to delivery." |
| `site_config.seeking` | `product roles across industries` | `AI PM · Healthcare PM · APM · Product Analyst · HealthTech` |
| `site_config.opportunity` (label, line, detail, roles) | `OPEN TO PRODUCT OPPORTUNITIES`, cross-industry | `OPEN TO AI & HEALTHCARE PRODUCT ROLES` and five roles, AI Product Manager first; copy from `site/content.js` |
| `site_config.proof_points` | — | New: the three hero proof cards (Evamastu, Live Your Best Life, CareConnect), worded as verified |
| `site_config.contact.phone` | `+91 81275 12340` | **Removed.** Delete the field. No Lovable section renders it, but `content.ts` is imported by client components, so the number almost certainly ships in the public JavaScript. |
| CareConnect `status` | `COMPLETED` | `MVP · NOT IN PRODUCTION`, plus the `production_note` text |
| Aaroh `status` | `IN PROGRESS` | `IN PROGRESS · STRATEGY RESET`, plus a `status_note`: eight consented practitioners, zero live users, no validated live-user outcomes, non-diagnostic |
| GharGyaan `status` | `SHIPPED — BUILD & EVALUATION COMPLETE` | `CONCEPT · NOT LIVE`. Keep only the verified facts: safety engine with 21 emergency categories; 214-case evaluation suite. Remove `SHIPPED` / `COMPLETE` tags. |
| Nexus `status` | `IN PROGRESS` | `MVP · DEMO MODE · NOT LIVE` |
| PhonePe `status` | `COMPLETED` | `CASE STUDY · A/B DESIGNED, NOT RUN`. Also fix the challenge text "The PhonePe A/B **ran** 21 days" → "was designed for 21 days … designed, not run". |
| Education | `2022 – 2024`; "Masai School and IIT Roorkee Faculty" | `2022–2024`, `2020–2022`, `2017–2020`, `Dec 2025–Aug 2026`; "Masai School with IIT Roorkee faculty" |
| `copilot_kb` | free-text answers | Every answer split into `role`, `work`, `evidence`, `status`; six `suggested` questions. Copy the array from `site/content.js`. |

Do **not** overwrite `content.ts` with `site/content.js` wholesale. The two have diverged
in both directions. For example, Lovable lists GharGyaan as "SHIPPED — BUILD &
EVALUATION COMPLETE" while this branch has "IN PROGRESS", and Lovable has fields this
branch lacks (`ownerFacts`, `resume_note`). Confirm each fact before porting it.

### 3e. Optional metadata this branch adds that Lovable lacks
Add these to the `head()` of `src/routes/index.tsx` if wanted. Values are in `site/index.html`.
- A `description` naming the target roles and the Evamastu proof point. Lovable's current
  description is cross-industry.
- `og:image:width` = `1600`, `og:image:height` = `900`, `og:image:alt`. These match this
  branch's poster; change them if you keep `poster-v2`.
- JSON-LD `alumniOf` (including Chaudhary Charan Singh University, Meerut), `knowsAbout`,
  `address` (New Delhi). These go in `profileSchema()` in `src/lib/public-profile.ts`.
  This branch deliberately sets no `jobTitle`.

## 4. What cannot be synced automatically

- **Everything.** This repo is not connected to the Lovable project, so there is no
  git sync, build hook or shared deploy between them.
- **Binaries** (the CV PDF, the poster). Lovable stores these as uploaded assets
  (`*.asset.json` pointing at Lovable's storage). They must be uploaded through Lovable;
  editing text files cannot create them.
- **`cv.html`.** It depends on this repo's `content.js` (see 3c).
- **Build scripts.** `build_site.py`, `build_cv.py` and `verify.py` are Python and
  Playwright and run here only. Lovable will not regenerate the PDF or run these tests.
- **The redesign.** The new hero, Selected Work (including the Evamastu and Live Your
  Best Life records), the AI & Product Lab, the four-part Ask Gaurav answers, the
  separate Experience / Education / Certifications sections, the collapsed Explore the
  Lab, the margin watermark and motif, the film never autoplaying, the contrast and
  text-size fixes, and Recruiter View are all in `site/app.js`, `site/index.html` and
  `site/content.js` (plain JS and CSS). Lovable's site is React components
  (`src/components/**`). These have to be rebuilt in Lovable; they cannot be copied
  across. The robot guide (`RoboGuide.tsx`) and the autoplaying intro in Lovable's
  `src/routes/index.tsx` should be removed to match this design.

## 5. Check after publishing on Lovable

```bash
curl -sI https://gaurav-os.lovable.app/cv.html
curl -sI https://gaurav-os.lovable.app/media/gaurav-kumar-singh-cv.pdf
curl -sI https://gaurav-os.lovable.app/media/gaurav-os-poster.jpg
curl -s  https://gaurav-os.lovable.app/robots.txt
curl -s  https://gaurav-os.lovable.app/sitemap.xml
```
```bash
curl -s https://gaurav-os.lovable.app/ | grep -E 'canonical|og:url|og:image|ld\+json'
```
```bash
curl -s https://gaurav-os.lovable.app/ | grep -c '81275'
```

The first five should each return 200 with the right content type. In the second, every
URL should start with `https://gaurav-os.lovable.app/`. The third should print `0`; also
check the JavaScript bundles listed in the page source. Then paste the home URL into
LinkedIn's Post Inspector to confirm the preview image and title.
