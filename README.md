# GAURAV.OS

**An AI product intelligence system.** The personal portfolio of Gaurav Kumar Singh —
AI Product Manager, building at the intersection of AI, healthcare, research and human
behaviour.

Not a portfolio template. The site is a product interface over a corpus: 90 product
case studies are read from a repository, normalized, validated and rendered as a
constellation, an atlas, an evolution view and a grounded copilot. Nothing a visitor
reads is typed in twice.

**Live:** https://gaurav-product.github.io/portfolio/

---

## What it contains

| Layer | What it is |
|---|---|
| **Cinematic intro** | A 65-second film that plays once, skippable at any moment, replayable from the hero. |
| **Identity + Product Orbit** | The positioning, and the domains and operating loop it runs on. |
| **90-day corpus** | 90 case studies as Constellation, Atlas and Evolution, with an evidence model and an operating model. |
| **Featured work** | Aaroh, CareConnect, PhonePe Smart Spend Coach, GharGyaan, Nexus. |
| **How I Think** | The operating loop, with the corpus as its evidence. |
| **Ask Gaurav** | A grounded copilot that answers only from a fixed index — and refuses before topic-matching. |
| **Challenge Gaurav** | Product scenarios with the reasoning revealed after you commit to an answer. |
| **Lab Notes** | The live thinking layer, published from the content file. |
| **Recruiter Mode** | Profile, experience, education, projects, skills, credentials and contact, fast. |

The 90-day case studies are **not** duplicated here. They live in their own archive —
[gaurav-product/product-management-case-studies](https://github.com/gaurav-product/product-management-case-studies)
— and every study on this site links back to it. This repository is the product layer
over that corpus.

---

## Architecture

```
site/                 source
├── index.html        shell: styles, tokens, empty mount points. No content.
├── app.js            renders hero, featured work, copilot, challenges, lab notes, recruiter mode
├── content.js        every word not from the corpus. Hand-maintained.
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

It autoplays once over an already-rendered homepage, never as a blocking loader.
`SKIP INTRO` is available immediately; a full watch ends on a final-frame hold. A
returning visitor gets the homepage directly plus a `WATCH INTRO` control. Under
reduced-motion the poster is shown with an `ENTER GAURAV.OS` control instead.

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

Generated files are never hand-edited after a build.

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

Runs headless Chromium at **1440 / 1280 / 1024 / 768 / 390** and asserts: corpus counts
match the tree, every GitHub link resolves, constellation renders, atlas search and
every filter work, day-by-day navigation works, the copilot refuses unsupported
questions, recruiter mode works, intro autoplay / skip / replay / no-forced-replay,
reduced motion, keyboard navigation, no console errors and no horizontal overflow at
any width. Current state: **71/71**.

## GitHub Pages

Settings → Pages → deploy from branch → `main` → **`/docs`**. Pages can only serve a
branch root or `/docs`, which is why `docs/` is a committed build output rather than a
git-ignored one.

---

## Licence

Content and case studies © Gaurav Kumar Singh. Code MIT.
