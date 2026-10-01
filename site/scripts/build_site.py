#!/usr/bin/env python3
"""Wrap the artifact fragment into a standalone document for GitHub Pages.

Output goes to docs/ because Pages can only serve a branch root or /docs —
not an arbitrary folder.

`index.html` is authored as an Artifact fragment: the host supplies the
<html>/<head> wrapper. Pages does not, so this writes a complete document to
dist/ and copies the runtime files beside it.

    python3 scripts/build_site.py               # -> docs/
    python3 scripts/build_site.py --out ../docs  # deployed from a subfolder
"""
import pathlib, shutil, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
DIST = pathlib.Path(sys.argv[sys.argv.index("--out") + 1]).resolve() if "--out" in sys.argv else ROOT / "docs"
RUNTIME = ["app.js", "content.js", "corpus.js", "corpus-ui.js"]

HEAD = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<style>
  :root{color-scheme:dark;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}
  body{margin:0;font:14px system-ui,-apple-system,sans-serif;background:#080A0C}
  img{max-width:100%}
  [hidden]{display:none!important}
</style>
"""
TAIL = "\n</body>\n</html>\n"


def main():
    src = ROOT / "index.html"
    if not src.exists():
        sys.exit("index.html not found — run from the repository root")

    DIST.mkdir(exist_ok=True)
    fragment = src.read_text(encoding="utf-8")

    # the fragment opens with <title>/<meta>/<link>/<style>; everything from the
    # first <canvas>/<div> onward is body content.
    marker = fragment.find("<canvas")
    if marker == -1:
        marker = fragment.find("<div class=\"shell\"")
    head_part, body_part = fragment[:marker], fragment[marker:]

    (DIST / "index.html").write_text(HEAD + head_part + "</head>\n<body>\n" + body_part + TAIL,
                                     encoding="utf-8")

    for f in RUNTIME:
        p = ROOT / f
        if p.exists():
            shutil.copy2(p, DIST / f)

    # The binaries live in the build output, committed once: docs/media is both
    # the deployed copy and the only copy in the repository. Anything present in
    # site/media (a replacement dropped in by hand) wins and is copied over;
    # what is already in docs/media is never removed.
    media = ROOT / "media"
    if media.exists():
        (DIST / "media").mkdir(parents=True, exist_ok=True)
        for f in sorted(media.iterdir()):
            if f.is_file() and f.suffix.lower() != ".md":   # docs stay in the source tree
                shutil.copy2(f, DIST / "media" / f.name)

    # Pages serves paths beginning with an underscore oddly; .nojekyll disables Jekyll.
    (DIST / ".nojekyll").write_text("")

    # every media path the content layer names must actually ship
    content = "\n".join(l for l in (ROOT / "content.js").read_text(encoding="utf-8").splitlines()
                        if "intended_file" not in l)
    import re as _re
    missing = [m for m in sorted(set(_re.findall(r'"(media/[^"]+)"', content)))
               if not (DIST / m).exists()]
    for m in missing:
        print("  MISSING: content.js references %s, which is not in the build" % m)

    total = sum(f.stat().st_size for f in DIST.rglob("*") if f.is_file())
    print("built docs/ — %d files, %.1f KB" %
          (len(list(DIST.rglob("*"))), total / 1024))
    print("serve from GitHub Pages: Settings -> Pages -> deploy from branch -> /docs")


if __name__ == "__main__":
    main()
