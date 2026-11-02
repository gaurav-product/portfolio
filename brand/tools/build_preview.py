#!/usr/bin/env python3
"""Build brand/preview/index.html — a review sheet for the proposed asset library."""
import json, pathlib, html
ROOT = pathlib.Path(__file__).resolve().parent.parent
m = json.loads((ROOT / "asset-manifest.json").read_text(encoding="utf-8"))
order = ["brand", "hero", "og", "spatial", "districts", "covers", "sections", "ui", "icons"]
titles = {"brand": "Brand", "hero": "Homepage hero", "og": "Social card", "spatial": "Spatial environment",
          "districts": "District backgrounds", "covers": "Project covers", "sections": "Section illustrations",
          "ui": "UI elements", "icons": "Icons"}
cards = []
for cat in order:
    items = [a for a in m["assets"] if a["category"] == cat]
    if not items: continue
    cls = "icons" if cat == "icons" else ("wide" if cat in ("spatial",) else "")
    cells = []
    for a in items:
        src = "../" + a["file"].split("brand/", 1)[1]
        img = ('<img src="%s" alt="" loading="lazy">' % src)
        cells.append('<figure class="c %s"><div class="f">%s</div><figcaption><b>%s</b><span>%d×%d · %s · %.1f KB</span><em>%s</em></figcaption></figure>'
                     % (cat, img, html.escape(a["file"].rsplit("/", 1)[1]), a["width"], a["height"], a["format"], a["bytes"] / 1024, html.escape(a["purpose"])))
    cards.append('<section><h2>%s <small>%d</small></h2><div class="g %s">%s</div></section>' % (titles[cat], len(items), cls, "".join(cells)))
need = "".join('<tr><td>%s</td><td>%s</td><td>%s</td></tr>' % (html.escape(r["id"]), html.escape(r["purpose"]), html.escape(r["status"])) for r in m.get("required_not_supplied", []))
shots = {}
for s in m.get("screenshot_candidates", []): shots[s["project"]] = shots.get(s["project"], 0) + 1
shot_rows = "".join('<tr><td>%s</td><td>%d real screenshots</td><td>Candidate · needs approval · captioned "Demo data"</td></tr>' % (p, n) for p, n in shots.items())
page = """<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Gaurav.OS asset library</title>
<style>
:root{--bg:#0B1110;--s:#121C19;--r:#1B2924;--g:#4DFF4D;--c:#35D6D0;--t:#F3F6F4;--m:#A1ADA7}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--t);font:15px/1.5 system-ui,sans-serif;padding:40px 16px}
main{max-width:1440px;margin:auto}h1{font-size:30px;margin:0}h1 span{color:var(--g)}
.lead{color:var(--m);max-width:80ch}.rules{display:flex;flex-wrap:wrap;gap:8px;margin:18px 0 8px}
.rules span{font:12px ui-monospace,monospace;letter-spacing:.06em;border:1px solid var(--r);padding:6px 10px;border-radius:6px;color:var(--m)}
section{margin-top:44px}h2{font-size:14px;letter-spacing:.18em;text-transform:uppercase;color:var(--g);font-family:ui-monospace,monospace}
h2 small{color:var(--m);margin-left:8px}.g{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:16px}
.g.wide{grid-template-columns:1fr}.g.icons{grid-template-columns:repeat(auto-fill,minmax(150px,1fr))}
figure{margin:0;background:var(--s);border:1px solid var(--r);border-radius:12px;overflow:hidden}
.f{background:#070b0a;display:grid;place-items:center;min-height:120px}.f img{width:100%;height:auto;display:block}
.brand .f{padding:24px}.brand .f img{max-height:200px;width:auto;max-width:100%}
.c.brand:nth-child(2) .f{background:#F3F6F4}
.icons .f{color:var(--g);padding:22px}.icons .f img{width:48px;height:48px;filter:invert(74%) sepia(64%) saturate(800%) hue-rotate(60deg)}
figcaption{padding:12px 14px;display:grid;gap:3px}figcaption b{font:600 12.5px ui-monospace,monospace;word-break:break-all}
figcaption span{font:12px ui-monospace,monospace;color:var(--m)}figcaption em{font-style:normal;color:var(--m);font-size:13px}
table{border-collapse:collapse;width:100%;font-size:14px}td{border-top:1px solid var(--r);padding:9px 8px;vertical-align:top}td:first-child{font-family:ui-monospace,monospace;color:var(--c);white-space:nowrap}
</style></head><body><main>
<h1>Gaurav<span>.OS</span> asset library — proposed</h1>
<p class="lead">Original, code-drawn vectors from one token set. Nothing here is AI-generated, nothing depicts a person or a product screen, and no motif encodes a measured value. Status of every asset: <b>PROPOSED — not wired into the site</b>.</p>
<div class="rules"><span>BG #0B1110</span><span>SURFACE #121C19</span><span>ACCENT #4DFF4D</span><span>SECONDARY #35D6D0</span><span>TEXT #F3F6F4</span><span>SPACE GROTESK · IBM PLEX MONO</span></div>
@@CARDS@@
<section><h2>Needed — not supplied</h2><table>@@NEED@@</table></section>
<section><h2>Real screenshots already in your repositories</h2><table>@@SHOTS@@</table></section>
</main></body></html>""".replace("@@CARDS@@", "".join(cards)).replace("@@NEED@@", need).replace("@@SHOTS@@", shot_rows)
(ROOT / "preview" / "index.html").write_text(page, encoding="utf-8")
print("wrote brand/preview/index.html")
