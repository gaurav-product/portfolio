# GAURAV.OS // AI PRODUCT SYSTEM

The portfolio of **Gaurav Kumar Singh — AI Product Manager / Product Builder.**
*Building safe, measurable AI products from ambiguous healthcare and consumer problems.*

A static, multi-page site. The homepage is short (hero, proof strip, three case studies,
an AI Product Lab preview, Ask Gaurav, about and contact) and the detail lives on its own
pages. Every word comes from `site/content.js` or the generated corpus.

**Production URL:** https://gaurav-os.lovable.app/ — set once in `site/scripts/build_site.py` (`SITE`).
That address is served by a **separate Lovable project**, not by this repository — see
`LOVABLE_HANDOFF.md`.

---

## Routes

| Route | What it is |
|---|---|
| `/` | Hero with the system visual (Discovery · Evaluation · Safety · Outcomes, labelled *illustrative, not live data*), proof strip, three selected case studies, AI Product Lab preview, Ask Gaurav preview, about preview, contact. |
| `/work/` | The three case studies and links into the lab. |
| `/work/evamastu/` | Evamastu / Parent Dashboard — shipped product work. |
| `/work/lybl/` | LYBL / Research to Product — research-led product work. |
| `/work/careconnect/` | CareConnect — **MVP · NOT IN PRODUCTION**. |
| `/lab/` | Aaroh, GharGyaan, PhonePe Smart Spend Coach and Nexus: evaluation design, failure modes, guardrails, user research, trade-offs, and what was measured versus only proposed. |
| `/about/` | Summary, experience (verbatim CV bullets), education (incl. MCA — Chaudhary Charan Singh University, Meerut, 2022–2024), certifications, skills, CV download. |
| `/research/` | The 90-day case-study archive (Constellation, Product Atlas, Evolution), How I Think, challenges, Lab Notes and the intro film. |
| `/ask/` | Ask Gaurav. Answers from a fixed local index, no API, no key. Every answer gives role, work, evidence and status; anything undocumented is refused. `?q=<id>` opens with an answer. |
| `/contact/` | Email, LinkedIn, GitHub, New Delhi, CV download. No phone, no street address. |

Also served: `/cv.html`, `/media/gaurav-kumar-singh-cv.pdf`, `/media/gaurav-os-poster.jpg`,
`/robots.txt`, `/sitemap.xml`, `/404.html`.

Each case study follows the same ten sections: Context · User / problem · Constraints ·
My role · Key product decisions · AI / system behaviour · Measurement · Failure modes &
trade-offs · Outcome · What I would do next. A forward-looking section is tagged
*Proposal*.

The 90-day case studies themselves live in
[gaurav-product/product-management-case-studies](https://github.com/gaurav-product/product-management-case-studies);
every study on `/research/` links back to it.

---

## Architecture

```
site/                 source
├── template.html     the document every route is built from (head, skip link, mounts)
├── styles.css        design tokens and all styles
├── app.js            header, footer and a renderer per page (chosen by <body data-page>)
├── content.js        every word not from the corpus. Hand-maintained.
├── cv.html           the printable CV, rendered from content.js (the PDF is printed from it)
├── corpus.js         GENERATED from the case-study repository. Loaded on /research only.
├── corpus-ui.js      constellation, atlas, evolution, operating model. /research only.
├── media/            asset documentation (the binaries live in docs/media)
└── scripts/          build, CV, corpus and validation

docs/                 built site — one index.html per route
```

Adding a case study, lab entry, credential or job means editing `site/content.js` only.

## Running it locally

```bash
python3 site/scripts/build_site.py --out docs
```
```bash
python3 -m http.server -d docs 8000
```

Then open http://localhost:8000. Serve the folder rather than opening files directly:
links are relative and the film needs range requests.

### Production URL

The canonical link, `og:url`, absolute Open Graph / Twitter image URLs, the
structured-data `url` and `sitemap.xml` use `SITE` in `build_site.py`
(`https://gaurav-os.lovable.app/`). To build for another address:

```bash
python3 site/scripts/build_site.py --out docs --site https://your-production-domain/
```

## The CV

`docs/media/gaurav-kumar-singh-cv.pdf` is `site/cv.html` printed to PDF (two pages).
Regenerate it after a content change:

```bash
PW_CHROMIUM=/path/to/chromium python3 site/scripts/build_cv.py
```

## Regenerating the corpus

```bash
git clone https://github.com/gaurav-product/product-management-case-studies.git repo
```
```bash
python3 site/scripts/extract.py && python3 site/scripts/build_corpus.py
```

## Validation

```bash
python3 site/scripts/verify.py
```

Builds `docs/`, serves it and drives headless Chromium (set `PW_CHROMIUM` if needed).
It checks:
- **routes & metadata** — every route, file, robots and sitemap returns 200; unique
  titles and descriptions; canonical, `og:url` and absolute images on the production URL;
  the corpus loads on `/research/` only;
- **every route at 360 / 768 / 1280** — no horizontal overflow, one h1, no skipped
  heading levels, no text under 10px, named links and buttons, alt text, skip link;
- **links** — every internal link and `#fragment` resolves;
- **homepage** — nav, hero copy and CTAs, the four proof statements, exactly three work
  cards with Problem / Product decision / Evidence / status / *Read case study*, honest lab
  labels, the three Ask questions, no research archive and no corpus download, no full
  résumé, weight; the system visual's labels, selection and reduced-motion pause;
- **keyboard** — skip link, visible focus, the mobile menu and Escape;
- **case studies, lab, about, contact, research** — the ten sections, statuses, the MCA
  entry, verbatim experience, the archive, study panel and film;
- **Ask Gaurav without an API key** — every suggested answer in four parts with sources,
  refusals, input length limit, `?q=` deep links, and no request leaves the site;
- **CV & privacy** — two-page PDF, MCA, no phone number anywhere; **contrast** — every
  text token meets WCAG AA; **no console errors** anywhere.

## GitHub Pages

Settings → Pages → deploy from branch → **`/docs`**. `docs/` is committed build output.

---

## Licence

Content and case studies © Gaurav Kumar Singh. Code MIT.
