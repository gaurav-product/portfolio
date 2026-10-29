#!/usr/bin/env python3
"""Print cv.html to the PDF the site offers as DOWNLOAD CV.

cv.html renders the content layer (content.js), so the PDF says exactly
what the portfolio says and nothing more. It carries email, LinkedIn,
GitHub and city — no phone number, no street address.

The PDF is written into the build output beside the other binaries
(docs/media), which is the only copy committed — see media/README.md.

    python3 site/scripts/build_cv.py            # -> docs/media/gaurav-kumar-singh-cv.pdf
    python3 site/scripts/build_cv.py --out DIR  # -> DIR/media/gaurav-kumar-singh-cv.pdf

Needs Python Playwright. Set PW_CHROMIUM to a Chromium binary if the
Playwright-managed browser is not installed.
"""
import asyncio, os, pathlib, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
DIST = pathlib.Path(sys.argv[sys.argv.index("--out") + 1]).resolve() if "--out" in sys.argv else ROOT.parent / "docs"
NAME = "gaurav-kumar-singh-cv.pdf"


async def main():
    from playwright.async_api import async_playwright
    out = DIST / "media" / NAME
    out.parent.mkdir(parents=True, exist_ok=True)
    async with async_playwright() as p:
        exe = os.environ.get("PW_CHROMIUM")
        b = await p.chromium.launch(executable_path=exe) if exe else await p.chromium.launch()
        pg = await b.new_page()
        await pg.goto((ROOT / "cv.html").as_uri())
        await pg.wait_for_selector("#cv h1")
        await pg.emulate_media(media="print")
        await pg.pdf(path=str(out), format="A4", print_background=True, prefer_css_page_size=True)
        pages = await pg.evaluate("() => Math.ceil(document.body.scrollHeight / 1050)")
        await b.close()
    print("wrote %s (%.0f KB, ~%d page%s)" % (out, out.stat().st_size / 1024, pages, "" if pages == 1 else "s"))


if __name__ == "__main__":
    asyncio.run(main())
