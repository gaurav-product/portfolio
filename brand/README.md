# brand/ — Gaurav.OS asset library (PROPOSED)

Original, code-drawn assets for the rebuild. **Nothing here is wired into the site yet.**

```bash
pip install fonttools brotli
python3 brand/tools/generate_assets.py   # -> brand/assets/**, brand/asset-manifest.json
python3 brand/tools/build_preview.py     # -> brand/preview/index.html
```

- `assets/` — 48 SVGs: brand, hero, og, spatial, districts, covers, sections, ui, icons.
- `asset-manifest.json` — filename, purpose, where it's used, dimensions, format, bytes, provenance, alt text, status.
- `asset-requirements.json` — what is needed but not supplied, and real screenshot candidates from the project repos.
- `fonts/` — Space Grotesk and IBM Plex Mono (SIL OFL 1.1), used only to outline text in the SVGs.
- `preview/` — review page and rendered contact sheets.

Rules: no AI-generated imagery, no person depicted, no product screens, no data encoded in motifs.
Project covers carry an "ILLUSTRATION · NOT A PRODUCT SCREENSHOT" tag.
