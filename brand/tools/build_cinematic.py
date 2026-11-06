#!/usr/bin/env python3
"""Optimise the owner-supplied cinematic illustrations for the web.

Originals stay untouched in brand/cinematic/source/. For each, writes WebP at
1600, 960 and 640 px wide (aspect ratio preserved) to app/public/cinematic/,
plus AVIF at each width (Pillow/libavif), and brand/cinematic/manifest.json.
Requires ffmpeg with libwebp and Pillow with AVIF support.
"""
import json, pathlib, subprocess
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC, OUT = ROOT / "cinematic/source", ROOT.parent / "app/public/cinematic"
WIDTHS = (1600, 1200, 960, 768, 480)
META = {
  "product-leadership": dict(n=2, purpose="Product Leadership district", used_by=["/districts/product-leadership", "/explore?d=product-leadership"],
      alt="Illustration of three glass panels labelled Product, AI and Building beside a glowing stone path that winds up a misty mountain towards the sunrise.",
      baked_text=["Gaurav.OS wordmark", "PRODUCT × AI × BUILDING", "Product", "AI", "Building"],
      caution="Panels show decorative layer, network and bar-chart motifs. Not data."),
  "knowledge-headquarters": dict(n=7, purpose="Knowledge & Headquarters district", used_by=["/districts/knowledge-hq", "/explore?d=knowledge-hq"],
      alt="Illustration of a domed glass library at night, flanked by glowing monoliths with education, certificate, knowledge-layer and people icons.",
      baked_text=["Gaurav.OS wordmark", "PRODUCT × AI × BUILDNG (sic — misspelt in the source image)"],
      caution="The tagline baked into this image is misspelt (\"BUILDNG\"); layouts must keep that corner covered or cropped."),
  "gaurav-world-hero": dict(n=1, purpose="Brief images 1 and 3: homepage hero; Explore Mode interactive map; HealthTech district (campus overview)", used_by=["/", "/explore", "/districts/healthtech-innovation"],
      alt="Illustration of the Gaurav.OS campus: six glowing district platforms linked to a central headquarters in a misty mountain landscape at sunset.",
      baked_text=["Gaurav.OS wordmark", "PRODUCT × AI × BUILDING", "six district labels"]),
  "ai-safety-lab": dict(n=4, purpose="AI & Safety Lab district and AI Lab page", used_by=["/districts/ai-safety-lab", "/ai-lab"],
      alt="Illustration of a glass laboratory with a shield around a brain, beside panels reading safety screening, evidence labelling, guardrails and evaluation.",
      baked_text=["Gaurav.OS wordmark", "Safety Screening", "Evidence Labelling", "Guardrails", "Evaluation", "AI"]),
  "research-analytics": dict(n=5, purpose="Research & Analytics district and Research library", used_by=["/districts/research-analytics", "/research"],
      alt="Illustration of an open glowing book on a plinth under a data globe, with research panels and a telescope.",
      baked_text=["Gaurav.OS wordmark", "90 Case Studies", "Research Insights", "Evidence Framework", "From Findings to Decisions"],
      caution="Contains decorative charts. Never present as real data — always captioned as an illustration."),
  "professional-experience": dict(n=6, purpose="Professional Experience district and Experience page", used_by=["/districts/professional-experience", "/experience"],
      alt="Illustration of an illuminated stairway climbing a mountain path past four glass markers.",
      baked_text=["Gaurav.OS wordmark"]),
  "how-i-think": dict(n=8, purpose="About — How I Think; Product Thinking", used_by=["/about", "/product-thinking"],
      alt="Illustration of the operating loop — observe, frame, research, hypothesize, build, measure, learn, iterate — around a glass cube holding a brain.",
      baked_text=["Gaurav.OS wordmark", "Observe", "Frame", "Research", "Hypothesize", "Build", "Measure", "Learn", "Iterate"]),
}
MISSING = []  # all eight brief images are integrated (1 and 3 share the campus illustration)

# Original procedural 3D renders (brand/renders/scenes.js, rendered by brand/tools/render_3d.mjs).
# Abstract metaphors with no text, logos or data — never evidence of a product or result.
RENDERS = ROOT / "renders"
RENDER_META = {
  "render-about": dict(purpose="About page header", used_by=["/about"], alt="3D render: eight glowing nodes orbit a glass cube above a lit plinth — the operating loop."),
  "render-projects": dict(purpose="Projects page header", used_by=["/projects"], alt="3D render: five layered platforms carrying abstract interface blocks, stacked above a lit plinth."),
  "render-case-studies": dict(purpose="Case studies page header", used_by=["/case-studies"], alt="3D render: a branching decision tree of nodes, with one path lit from the root to a single outcome."),
  "render-product-thinking": dict(purpose="Product Thinking page header", used_by=["/product-thinking"], alt="3D render: stacked rings narrowing like a funnel, with particles falling through to one glowing point."),
  "render-skills": dict(purpose="Skills library header", used_by=["/skills"], alt="3D render: a grid of columns of varying height, the tallest lit at their tops."),
  "render-atlas": dict(purpose="Product Atlas header", used_by=["/atlas"], alt="3D render: a globe made of points with glowing arcs between them."),
  "render-contact": dict(purpose="Contact page header", used_by=["/contact"], alt="3D render: a beacon on a mast sending rings of signal outward."),
  "render-lab-notes": dict(purpose="Lab Notes header", used_by=["/lab-notes"], alt="3D render: translucent ruled pages floating above a lit plinth."),
  "render-ask": dict(purpose="Ask Gaurav header", used_by=["/ask"], alt="3D render: a faceted core with a ring of index cards in orbit; a beam links the core to one card."),
  "render-search": dict(purpose="Search page header", used_by=["/search"], alt="3D render: a glowing lens over a field of points, the points under it brighter."),
}
(RENDERS / "source").mkdir(parents=True, exist_ok=True)
for png in sorted((RENDERS / ".cache").glob("render-*.png")):
    dst = RENDERS / "source" / f"{png.stem}.webp"
    if not dst.exists() or png.stat().st_mtime > dst.stat().st_mtime:
        with Image.open(png) as im:
            im.convert("RGB").resize((2400, 1500), Image.LANCZOS).save(dst, "WEBP", quality=92, method=6)

OUT.mkdir(parents=True, exist_ok=True)
assets = []
sources = sorted(SRC.glob("*.webp")) + sorted((RENDERS / "source").glob("render-*.webp"))
for src in sources:
    is_render = src.stem in RENDER_META
    m = RENDER_META[src.stem] if is_render else META[src.stem]
    w, h = map(int, subprocess.check_output(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", str(src)]).decode().strip().split(","))
    files = {}
    for width in WIDTHS:
        out = OUT / f"{src.stem}-{width}.webp"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(src), "-vf", f"scale={width}:-2:flags=lanczos", "-c:v", "libwebp", "-quality", "78", "-compression_level", "6", str(out)], check=True)
        files[width] = {"file": f"/cinematic/{out.name}", "bytes": out.stat().st_size}
    avif = {}
    with Image.open(src) as im:
        im = im.convert("RGB")
        for width in WIDTHS:
            out = OUT / f"{src.stem}-{width}.avif"
            im.resize((width, round(width * h / w)), Image.LANCZOS).save(out, "AVIF", quality=52, speed=4)
            avif[width] = {"file": f"/cinematic/{out.name}", "bytes": out.stat().st_size}
    assets.append({
        "id": src.stem, "brief_image": None if is_render else m["n"], "source": str(src.relative_to(ROOT.parent)), "source_bytes": src.stat().st_size,
        "width": w, "height": h, "aspect": round(w / h, 4), "format": "AVIF + WebP fallback", "sizes": files, "avif": avif,
        "purpose": m["purpose"], "used_by": m["used_by"], "alt": m["alt"],
        "provenance": "ORIGINAL 3D RENDER — procedural three.js scene (brand/renders/scenes.js)" if is_render else "AI-GENERATED ILLUSTRATION — supplied by Gaurav (ChatGPT image generation)",
        "baked_text": [] if is_render else m["baked_text"], "caution": m.get("caution", ""),
        "not_evidence": "Abstract 3D render. No text, logos or data; not a screenshot, facility, dashboard or product." if is_render else "Atmospheric illustration. Not a screenshot, facility, dashboard or product.",
        "status": "INTEGRATED",
    })
manifest = {"generated_by": "brand/tools/build_cinematic.py", "assets": assets, "missing": MISSING,
            "note": "Kept separate from the original SVG library (brand/asset-manifest.json)."}
(ROOT / "cinematic/manifest.json").write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n")
print("\n".join(f"{a['id']}: {a['source_bytes']//1024} KB -> " + ", ".join(f"{k}px {v['bytes']//1024} KB" for k, v in a["sizes"].items()) for a in assets))
