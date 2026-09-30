# GAURAV.OS

**An AI Product Intelligence System.** A personal product system for Gaurav Kumar Singh —
AI Product Manager, building at the intersection of AI, healthcare, research and human behaviour.

Not a portfolio template. The 90-day case-study corpus is **read from a repository**,
normalized, validated, and rendered as a constellation, an atlas, an evolution view and
a grounded copilot. Nothing on the page is typed in by hand twice.

---

## Architecture

Seven layers, deliberately separated.

| Layer | File | Rule |
|---|---|---|
| **UI shell** | `index.html` | Styles, tokens and empty mount points. No content. |
| **Interaction** | `app.js` | Renders the portfolio: hero, featured work, copilot, challenges, lab notes, recruiter mode. |
| **Content** | `content.js` | Every word a visitor reads that is *not* from the corpus. Hand-maintained. |
| **Corpus (data)** | `corpus.js` | **Generated.** The 90-day case-study corpus. Never hand-edit. |
| **Corpus (UI)** | `corpus-ui.js` | Constellation, atlas, evolution, operating model, capability graph. |
| **Media** | `media/` | Binary assets, referenced by id from `content.js`. |
| **Build & validation** | `scripts/` | Ingestion, normalization and the test suite. |

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

The homepage latest note, the featured list, the archive, the category filters, the
counts and the search index all re-derive from that record. **No UI file is edited.**

---

## Validation

```bash
python3 scripts/verify.py
```

Runs headless Chromium at **1440 / 1280 / 1024 / 768 / 390** and asserts: corpus counts match
the tree, Day 90 present, Day 74 flagged missing, every GitHub link resolves against the
tree, constellation renders, atlas search and every filter work, day-by-day navigation
works, the copilot refuses unsupported questions without topic-matching, recruiter mode
works, intro autoplay / skip / no-replay, reduced motion, keyboard navigation, no console
errors and no horizontal overflow at any width.

---

## Deploying to GitHub Pages

`index.html` is an artifact fragment (no `<html>`/`<head>` wrapper — the host supplies it).
For Pages, build the standalone document:

```bash
python3 scripts/build_site.py      # writes docs/index.html + copies assets
```

Then serve from Pages: Settings → Pages → deploy from branch → **`/docs`**.
Pages can only serve a branch root or `/docs`, so `docs/` is a committed build
output, not a git-ignored one.

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
