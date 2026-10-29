# Gaurav Kumar Singh — Healthcare Product Manager

The portfolio of Gaurav Kumar Singh, seeking **Healthcare Product Manager, Associate
Product Manager, Product Analyst and HealthTech** roles. It is built recruiter-first:
the first screen says who Gaurav is, which roles he is seeking, and the three verified
proof points behind that — with a CV download, email and Recruiter Mode one click away.

Behind the portfolio sits a secondary **Research & Experiments** area: 90 product case
studies read from a repository and rendered as a constellation, an atlas and an
evolution view, plus a grounded copilot, product challenges, lab notes and an intro
film. Nothing a visitor reads is typed in twice.

**Production URL:** https://gaurav-os.lovable.app/ — set once in `site/scripts/build_site.py` (`SITE`); see *Production URL* below.

---

## What it contains

**Portfolio** — what a hiring manager needs, in this order:

| Section | What it is |
|---|---|
| **Hero** | Name, healthcare identity, the four target roles, three verified proof points, and Download CV · Email · Recruiter Mode. |
| **Selected work** | Three case studies in full — Evamastu, Live Your Best Life, CareConnect (MVP, **not in production**) — then Aaroh, PhonePe Smart Spend Coach, GharGyaan and Nexus, collapsed. |
| **Experience & education** | The CV record verbatim, credentials, toolkit, and the full journey behind one disclosure. |
| **Contact & CV** | Email, CV (PDF and web page), LinkedIn, GitHub, New Delhi. No phone number is published. |
| **Recruiter Mode** | The one-page view, reachable from the hero, the rail, the top bar, or `?view=recruiter`. |

**Research & Experiments** — secondary, for depth:

| Section | What it is |
|---|---|
| **Intro film** | A 65-second film. It plays only when a visitor presses *Watch intro* — never on load. |
| **90-day corpus** | 90 case studies as Constellation, Atlas and Evolution, with an evidence model. |
| **How I Think** | The operating model and product orbit, with the corpus as evidence. |
| **AI copilot** | Answers only from a fixed index — and refuses before topic-matching. |
| **Challenges** | Product scenarios with the reasoning revealed after you commit to an answer. |
| **Lab Notes** | Drafts and AI experiments, each with its status. |

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
is only fetched when a visitor presses `WATCH INTRO` in Research & Experiments.
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

Runs headless Chromium at **1440 / 1280 / 1024 / 768 / 390 / 360** and asserts: the
first screen shows name, target roles, CV and Recruiter Mode (and all three proof cards
on desktop); the proof points are worded as verified and link to the three primary case
studies; CareConnect is labelled not in production; the MCA entry; CV download
everywhere and a real PDF; no phone number published; SEO metadata with no unconfirmed URL; WCAG AA contrast on every text token, no text
under 10px, skip link; corpus counts match the tree; every GitHub link resolves; atlas
search and filters; the copilot refuses unsupported questions; Recruiter Mode; the film
never autoplays and is never fetched on first visit, and skip / sound / focus trap work
when it is opened; reduced motion; keyboard navigation; no console errors and no
horizontal overflow at any width.

## GitHub Pages

Settings → Pages → deploy from branch → `main` → **`/docs`**. Pages can only serve a
branch root or `/docs`, which is why `docs/` is a committed build output rather than a
git-ignored one.

---

## Licence

Content and case studies © Gaurav Kumar Singh. Code MIT.
