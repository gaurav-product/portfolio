# Portfolio source — GAURAV.OS // AI PRODUCT SYSTEM

A multi-page site built from one template. The homepage is short; case studies, the AI
Product Lab, About, the research archive, Ask Gaurav and Contact each have their own
route (see the repository README). The 90-day corpus is **read from a repository**,
normalized, validated and rendered on `/research/` — nothing is typed in twice.

---

## Architecture

Seven layers, deliberately separated.

| Layer | File | Rule |
|---|---|---|
| **Template** | `template.html` | The document every route is built from. No content. |
| **Styles** | `styles.css` | Design tokens and all component styles. |
| **Interaction** | `app.js` | Header, footer and one renderer per page, picked by `<body data-page>`. |
| **CV** | `cv.html` | Printable CV rendered from `content.js`; `scripts/build_cv.py` prints it to the PDF. |
| **Content** | `content.js` | Every word a visitor reads that is *not* from the corpus. Hand-maintained. |
| **Corpus (data)** | `corpus.js` | **Generated.** Loaded on `/research/` only. Never hand-edit. |
| **Corpus (UI)** | `corpus-ui.js` | Constellation, atlas, evolution, operating model. `/research/` only. |
| **Media** | `media/` | Binary assets, referenced by id from `content.js`. |
| **Build & validation** | `scripts/` | Site build, CV, ingestion and the test suite. |

Adding a Lab Note, a project, a credential or a job means editing **`content.js` only**.
`app.js` is never touched for a content change.

---

## Regenerating the corpus

`corpus.js` is generated from the case-study repository. **Do not hand-edit it.**

```bash
# 1. clone the source of truth
git clone https://github.com/gaurav-product/product-management-case-studies.git repo

# 2. ingest + normalize -> corpus.json
python3 scripts/extract.py

# 3. aggregate + validate -> corpus.js
python3 scripts/build_corpus.py
```

The pipeline is:

```
GitHub repository
  → ingestion      (scripts/extract.py    — walks the tree, parses each study)
  → normalization  (one record per directory, fixed schema)
  → validation     (completeness, flags, anomalies, link paths)
  → corpus.js      (data + derived aggregates)
  → visualizations (constellation, evolution, capability graph)
  → search         (atlas + global search)
  → copilot        (grounded retrieval over the same corpus)
```

### Rules the pipeline enforces

- **The tree is canonical.** Directory order wins when a document numbers itself differently.
- **A missing README stays missing.** An empty study is never rendered as a completed one.
- **Nothing is invented.** Absent fields are recorded as `NOT DOCUMENTED`.
- **Derived is labelled.** Category is derived by rule (industry is stated as a field in
  only 1 of 90 documents) and is labelled `DERIVED` everywhere it appears.
- **Contradictions surface.** Where the repository's own index disagrees with its tree,
  both readings are shown rather than silently reconciled.

### Case-study schema

`day · title · company · summary · category (derived) · industry · evidence_level ·
evidence_score · references · assumptions · checks · completeness · flags · words ·
assets · extra_docs · readme_path · assumptions_path · github_url · readme_url ·
assumptions_url · internal_day`

### Evidence score (0–8)

| Signal | Points |
|---|---|
| 5+ references | +1 |
| 15+ references | +1 |
| an `ASSUMPTIONS` file exists | +1 |
| that file is 400+ words | +1 |
| documents programmatic verification | +2 |
| evidence labelled `FACT` / `ASSUMPTION` / `DERIVED` inline | +1 |
| 6,000+ words | +1 |

`VERIFIED` ≥ 6 · `DOCUMENTED` ≥ 4 · `SOURCED` ≥ 2 · `NARRATIVE` below that.
It counts what a study *carries*. It is not a judgement of quality.

---

## Publishing a Lab Note

Append one record to `content.js → lab_notes[]`:

```js
{
  id: "ln-006", slug: "…", week: "WEEK 06",
  title: "…", date: "Oct 2026", category: "AI Product",
  tags: ["…"], reading_time: "4 min",
  status: "DRAFT",          // DRAFT | SCHEDULED | PUBLISHED | ARCHIVED
  featured: false, published: false, cover_image: null,
  excerpt: "…", content: "<p>…</p>"
}
```

The Lab Notes on `/research/`, the featured list, the archive, the category filters, the
counts and the search index all re-derive from that record. **No UI file is edited.**

---

## Validation

```bash
python3 scripts/verify.py
```

Builds `docs/`, serves it and checks every route at 360, 768 and 1280 px: routes and
metadata, overflow, headings, text size, accessible names, links, the homepage contract,
the system visual and reduced motion, keyboard and mobile menu, case-study structure and
statuses, the lab, the MCA entry on `/about/`, the research archive and film, Ask Gaurav
without an API key, the CV, privacy and contrast.

---

## Building for GitHub Pages

```bash
python3 scripts/build_site.py --out ../docs
```

It writes `index.html` for each route from `template.html`, a static `404.html`,
`robots.txt`, `sitemap.xml`, and copies the runtime files, `cv.html` and media. Serve
from Pages: Settings → Pages → deploy from branch → **`/docs`**.

---

## Content integrity

This system is built to make unsupported claims hard to state.

- Anything unvalidated carries a status: `CONCEPT` · `HYPOTHESIS` · `DRAFT` ·
  `IN PROGRESS` · `NOT VALIDATED` · `NOT DOCUMENTED` · `MISSING`.
- The copilot answers only from a fixed index and refuses **before** topic-matching, so a
  question about revenue is refused rather than answered with a nearby company's study.
- No users, revenue, experiments, A/B results, interviews, metrics, adoption or customers
  are ever manufactured.

## Licence

Content and case studies © Gaurav Kumar Singh. Code MIT.
