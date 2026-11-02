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

OUT.mkdir(parents=True, exist_ok=True)
assets = []
for src in sorted(SRC.glob("*.webp")):
    m = META[src.stem]
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
        "id": src.stem, "brief_image": m["n"], "source": f"brand/cinematic/source/{src.name}", "source_bytes": src.stat().st_size,
        "width": w, "height": h, "aspect": round(w / h, 4), "format": "AVIF + WebP fallback", "sizes": files, "avif": avif,
        "purpose": m["purpose"], "used_by": m["used_by"], "alt": m["alt"],
        "provenance": "AI-GENERATED ILLUSTRATION — supplied by Gaurav (ChatGPT image generation)",
        "baked_text": m["baked_text"], "caution": m.get("caution", ""),
        "not_evidence": "Atmospheric illustration. Not a screenshot, facility, dashboard or product.",
        "status": "INTEGRATED",
    })
manifest = {"generated_by": "brand/tools/build_cinematic.py", "assets": assets, "missing": MISSING,
            "note": "Kept separate from the original SVG library (brand/asset-manifest.json)."}
(ROOT / "cinematic/manifest.json").write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n")
print("\n".join(f"{a['id']}: {a['source_bytes']//1024} KB -> " + ", ".join(f"{k}px {v['bytes']//1024} KB" for k, v in a["sizes"].items()) for a in assets))
