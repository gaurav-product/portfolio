# Gaurav Kumar Singh — AI Product Professional

The portfolio of Gaurav Kumar Singh: *an AI product professional building evidence-led,
safety-conscious products from discovery to delivery.* He is seeking **AI Product
Manager, Healthcare Product Manager, Associate Product Manager, Product Analyst and
HealthTech** roles. The first screen says who he is, what product work he does, which
roles he is seeking and the three proof points behind it, with View Work · Ask Gaurav ·
Download CV · Email · Recruiter View one click away. Nothing a visitor reads is typed in
twice: every word comes from `site/content.js` or the generated corpus.

**Production URL:** https://gaurav-os.lovable.app/ — set once in `site/scripts/build_site.py` (`SITE`); see *Production URL* below.
That address is served by a **separate Lovable project**, not by this repository — see
`LOVABLE_HANDOFF.md`.

---

## What it contains

In page order:

| Section | What it is |
|---|---|
| **Hero** | Name (the only h1), positioning line, five target-role chips, three proof cards, and View Work · Ask Gaurav · Download CV · Email · Recruiter View. |
| **Selected Work** | Evamastu (shipped), Live Your Best Life research, and CareConnect — **MVP · NOT IN PRODUCTION** — in full. |
| **AI & Product Lab** | Aaroh (in progress, strategy reset, zero live users), GharGyaan (concept, not live), Nexus (MVP, demo mode, not live), PhonePe Smart Spend Coach (A/B test designed, not run), and the 90-day corpus. Full records behind disclosures. |
| **Ask Gaurav** | Answers from a fixed index of documented facts — never a live model. Every answer gives **role, work, evidence and status**; anything undocumented is refused in plain words. |
| **Experience · Education · Certifications** | The CV record verbatim. Learning paths are not upgraded to certifications. |
| **Contact & CV** | Email, CV (PDF and web page), LinkedIn, GitHub, New Delhi. No phone number and no street address. |
| **Explore the Lab** | Collapsed by default: 90-day corpus (Constellation), Product Atlas, Evolution, How I Think, product challenges, Lab Notes and the intro film. Any link into it opens it. |
| **Recruiter View** | The one-page résumé, from the hero, the rail, the top bar, or `?view=recruiter`, with its own Ask Gaurav entry. |

The intro film never autoplays and is never fetched until a visitor presses *Watch*.

The 90-day case studies are **not** duplicated here. They live in their own archive —
[gaurav-product/product-management-case-studies](https://github.com/gaurav-product/product-management-case-studies)
— and every study on this site links back to it. This repository is the product layer
over that corpus.

---

## Architecture

```
site/                 source
├── index.html        shell: styles, tokens, empty mount points. No content.
├── app.js            renders hero, work, record, contact, copilot, challenges, lab notes, recruiter mode
├── content.js        every word not from the corpus. Hand-maintained.
├── cv.html           the printable CV, rendered from content.js (the PDF is printed from it)
├── corpus.js         GENERATED from the case-study repository. Never hand-edited.
├── corpus-ui.js      constellation, atlas, evolution, operating model
├── media/            asset documentation (the binaries live in docs/media)
└── scripts/          build + validation

docs/                 built site — what GitHub Pages serves
```

Four layers, deliberately separated: **content → data model → application → UI.**
Adding a Lab Note, a project, a credential or a job means editing `site/content.js`
only. No UI file is touched for a content change.

### Content integrity

The system is built to make unsupported claims hard to state. Anything unvalidated
carries a status — `CONCEPT`, `HYPOTHESIS`, `DRAFT`, `IN PROGRESS`, `NOT VALIDATED`,
`NOT DOCUMENTED`, `MISSING`. The copilot refuses **before** topic-matching, so a
question about revenue is refused rather than answered with a nearby company's study.
No users, revenue, experiments, A/B results, interviews, metrics, adoption or customers
are ever manufactured.

---

## The introduction film

`docs/media/gaurav-os-intro.mp4` — 1920×1080, H.264 High + AAC, 65s, faststart,
11.43 MiB. Produced externally and used unmodified.

It never autoplays: a recruiter's first screen is the portfolio, and the 12 MB file
is only fetched when a visitor presses `WATCH INTRO` in Explore the Lab.
`SKIP INTRO` is available immediately; a full watch ends on a final-frame hold. Under
reduced motion the poster is shown with a `CLOSE` control instead.

The film is named in exactly one place — `content.js → intro.video`. To replace it,
drop the new file into `site/media/` and rebuild.

---

## Running it locally

```bash
python3 -m http.server -d docs 8000   # then open http://localhost:8000
```

Chrome will not range-request media from a `file://` URL, so serve the folder rather
than opening the file directly.

## Rebuilding docs/

`site/index.html` has no `<html>`/`<head>` wrapper — the host supplies it. The build
writes the standalone document Pages needs and copies the runtime files beside it.

```bash
python3 site/scripts/build_site.py --out docs
```

It also copies `cv.html` and writes `robots.txt`.

### Production URL

The canonical link, `og:url`, absolute Open Graph / Twitter image URLs, the
structured-data `url` and `sitemap.xml` all need the real public address. It is set in
exactly one place — `SITE` in `build_site.py`, currently `https://gaurav-os.lovable.app/`.
To build for a different address:

```bash
python3 site/scripts/build_site.py --out docs --site https://your-production-domain/
```

Set `SITE` to `""` and those tags and the sitemap are omitted entirely. Generated files
are never hand-edited after a build.

## The CV

`docs/media/gaurav-kumar-singh-cv.pdf` is `site/cv.html` printed to PDF, so it says
exactly what the site says. It carries email, LinkedIn, GitHub and city — no phone
number and no street address. Regenerate it after a content change:

```bash
pip install playwright        # PW_CHROMIUM=/path/to/chromium if no managed browser
python3 site/scripts/build_cv.py
```

To ship a hand-made CV instead, drop the PDF into `site/media/` under the same name
(or point `content.js → site_config.contact.resume.file` at it) and rebuild.

## Regenerating the corpus

`corpus.js` is generated from the case-study repository. **Do not hand-edit it.**

```bash
git clone https://github.com/gaurav-product/product-management-case-studies.git repo
python3 site/scripts/extract.py        # walk the tree, parse each study
python3 site/scripts/build_corpus.py   # aggregate + validate -> corpus.js
```

The pipeline enforces four rules: the directory tree is canonical when a document
numbers itself differently; a missing README stays missing; absent fields are recorded
as `NOT DOCUMENTED` rather than invented; and where the repository's own index
disagrees with its tree, both readings are surfaced rather than silently reconciled.

## Validation

```bash
python3 site/scripts/verify.py
```

Runs headless Chromium at **1440 / 1280 / 1024 / 768 / 390 / 360** and asserts:
- **first screen** — name, positioning and target roles at every width; the five actions
  and all three proof cards at 1024 and up; no film over it, and the film never fetched;
- **structure** — the brief's section order, Explore the Lab collapsed by default, links
  into it opening it, the constellation sizing once open;
- **claims** — proof cards worded as verified; CareConnect exactly `MVP · NOT IN
  PRODUCTION`; no unfinished project called shipped, live, completed or in production;
  Aaroh, GharGyaan and PhonePe statuses; no text saying the A/B test ran; education and
  credential wording; no phone number anywhere;
- **Ask Gaurav** — the six suggested questions, every answer in role / work / evidence /
  status with live source links, undocumented questions refused, keyboard use, and the
  Recruiter View entry point;
- **quality** — one h1, skip link to `main`, accessible names, alt text, WCAG AA contrast
  on every text token, no text under 10px, visible focus, reduced motion, the watermark
  only in the margin, no horizontal overflow, no console errors — plus the corpus,
  Atlas, film player, CV, SEO and production-URL checks.

## GitHub Pages

Settings → Pages → deploy from branch → `main` → **`/docs`**. Pages can only serve a
branch root or `/docs`, which is why `docs/` is a committed build output rather than a
git-ignored one.

---

## Licence

Content and case studies © Gaurav Kumar Singh. Code MIT.
