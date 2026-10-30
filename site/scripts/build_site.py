#!/usr/bin/env python3
"""Build the static multi-page site into docs/ (what GitHub Pages serves).

Every route is a folder with its own index.html, written from template.html.
Pages share one stylesheet (styles.css), one content file (content.js) and
one application file (app.js). The 90-day corpus data (corpus.js, ~170 KB)
and its UI load only on /research.

    python3 site/scripts/build_site.py --out docs
    python3 site/scripts/build_site.py --out docs --site https://example.com/

Generated files are never hand-edited after a build.
"""
import html, json, pathlib, shutil, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
DIST = pathlib.Path(sys.argv[sys.argv.index("--out") + 1]).resolve() if "--out" in sys.argv else ROOT.parent / "docs"
RUNTIME = ["styles.css", "app.js", "content.js", "corpus.js", "corpus-ui.js"]
# complete documents, copied as they are (with the canonical link filled in)
PAGES = ["cv.html"]

# The public production URL — the one place it is set. Confirmed by Gaurav as
# the published Lovable site. When set, every page gets its canonical link,
# og:url, absolute og/twitter image URLs and (home) the JSON-LD url, and the
# build writes sitemap.xml and its robots.txt line. "" emits none of them.
SITE = "https://gaurav-os.lovable.app/"
if "--site" in sys.argv:
    SITE = sys.argv[sys.argv.index("--site") + 1]
if SITE and not SITE.endswith("/"):
    SITE += "/"

NAME = "Gaurav Kumar Singh"
CORE = ["content.js", "app.js"]
RESEARCH = ["corpus.js", "content.js", "app.js", "corpus-ui.js"]

# path · page id · title · description · scripts · extra <body> attributes
ROUTES = [
    ("", "home", NAME + " — AI Product Manager / Product Builder | GAURAV.OS",
     "Gaurav Kumar Singh, AI Product Manager and product builder in New Delhi. Building safe, measurable AI products from ambiguous healthcare and consumer problems — discovery through delivery.", CORE, ""),
    ("work/", "work", "Work — " + NAME + " | GAURAV.OS",
     "Three case studies: Evamastu (shipped), Live Your Best Life research to product, and CareConnect (MVP, not in production).", CORE, ""),
    ("work/evamastu/", "case", "Evamastu / Parent Dashboard — case study | " + NAME,
     "Discovery through release on a digital mindfulness platform: Parent Dashboard, adaptive cognitive games, cohort analytics and a 20–25% lift in consistency over six weeks.", CORE, ' data-case="evamastu"'),
    ("work/lybl/", "case", "LYBL / Research to Product — case study | " + NAME,
     "30+ structured interviews and engagement tracked for 500+ users at a US wellness company; research adopted across three major feature iterations.", CORE, ' data-case="lybl"'),
    ("work/careconnect/", "case", "CareConnect — case study | " + NAME,
     "A post-discharge care accountability layer. MVP with 65 unit/integration tests and 30 end-to-end journeys. MVP · not in production.", CORE, ' data-case="careconnect"'),
    ("lab/", "lab", "AI Product Lab — " + NAME + " | GAURAV.OS",
     "Aaroh, GharGyaan, PhonePe Smart Spend Coach and Nexus: evaluation design, failure modes, guardrails, and what was measured versus only proposed.", CORE, ""),
    ("about/", "about", "About — " + NAME + " | GAURAV.OS",
     "Experience, education (MCA — Chaudhary Charan Singh University, Meerut), certifications and skills of Gaurav Kumar Singh.", CORE, ""),
    ("research/", "research", "Research — 90-day product case-study corpus | " + NAME,
     "The 90-day product case-study corpus — constellation, Product Atlas and Evolution — with the operating model, product challenges, lab notes and the intro film.", RESEARCH, ""),
    ("ask/", "ask", "Ask Gaurav — " + NAME + " | GAURAV.OS",
     "Ask about Gaurav's product work. Answers come from a curated local index of his CV and product records — no live model, no API key.", CORE, ""),
    ("contact/", "contact", "Contact — " + NAME + " | GAURAV.OS",
     "Email, LinkedIn, GitHub and CV for Gaurav Kumar Singh, New Delhi, India.", CORE, ""),
]

LDJSON = {
    "@context": "https://schema.org", "@type": "ProfilePage",
    "mainEntity": {
        "@type": "Person", "name": NAME,
        "description": "AI Product Manager / Product Builder. Building safe, measurable AI products from ambiguous healthcare and consumer problems.",
        "email": "mailto:gauravkumarsingh773@gmail.com",
        "address": {"@type": "PostalAddress", "addressLocality": "New Delhi", "addressCountry": "IN"},
        "alumniOf": [{"@type": "CollegeOrUniversity", "name": "Chaudhary Charan Singh University, Meerut"},
                     {"@type": "CollegeOrUniversity", "name": "S-VYASA University, Bengaluru"},
                     {"@type": "CollegeOrUniversity", "name": "University of Patanjali, Haridwar"}],
        "knowsAbout": ["AI product management", "Healthcare product management", "Product discovery",
                       "AI safety and evaluation", "Product analytics", "Experimentation", "User research"],
        "sameAs": ["https://linkedin.com/in/gaurav-singh-product", "https://github.com/gaurav-product"]}}


def site_tags(path):
    """Head tags that need the absolute production URL; empty when unset."""
    if not SITE:
        return ""
    url = SITE + path
    return '<link rel="canonical" href="%s">\n<meta property="og:url" content="%s">\n' % (url, url)


def absolutize(doc, path):
    """Fill in the production-URL tags; without SITE, drop the marker and
    point the image tags at the right relative path instead."""
    if not SITE:
        rel = "../" * path.count("/")
        doc = doc.replace("<!--SITE-URL-->\n", "").replace("<!--SITE-URL-->", "")
        return doc.replace('content="media/gaurav-os-poster.jpg"', 'content="%smedia/gaurav-os-poster.jpg"' % rel)
    doc = doc.replace("<!--SITE-URL-->\n", site_tags(path)).replace("<!--SITE-URL-->", site_tags(path))
    doc = doc.replace('content="media/gaurav-os-poster.jpg"', 'content="%smedia/gaurav-os-poster.jpg"' % SITE)
    return doc.replace('{"@context": "https://schema.org", "@type": "ProfilePage",',
                       '{"@context": "https://schema.org", "@type": "ProfilePage", "url": "%s",' % SITE)


def render(template, path, page, title, desc, scripts, attrs, robots="index, follow", root=None):
    rel = ("../" * path.count("/")) if root is None else root
    ld = ('<script type="application/ld+json">%s</script>' % json.dumps(LDJSON, ensure_ascii=False)) if page == "home" else ""
    doc = (template.replace("{{TITLE}}", html.escape(title)).replace("{{DESC}}", html.escape(desc))
           .replace("{{ROBOTS}}", robots).replace("{{OGTYPE}}", "profile" if page in ("home", "about") else "website")
           .replace("{{LDJSON}}", ld).replace("{{PAGE}}", page).replace("{{BODY_ATTRS}}", attrs)
           .replace("{{SCRIPTS}}", "\n".join('<script defer src="%s%s"></script>' % (rel, s) for s in scripts))
           .replace("{{ROOT}}", rel))
    return absolutize(doc, path)


def main():
    template = (ROOT / "template.html").read_text(encoding="utf-8")
    DIST.mkdir(exist_ok=True)
    for path, page, title, desc, scripts, attrs in ROUTES:
        out = DIST / path / "index.html"
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(render(template, path, page, title, desc, scripts, attrs), encoding="utf-8")

    # GitHub Pages serves 404.html for an unknown path at any depth, where
    # relative script paths cannot be trusted: it is self-contained.
    home = SITE or "./"
    (DIST / "404.html").write_text(
        '<!doctype html><html lang="en"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">'
        '<title>Page not found | GAURAV.OS</title><style>body{margin:0;font:16px/1.6 system-ui,sans-serif;'
        'background:#F4F1EA;color:#15171C;display:grid;place-items:center;min-height:100vh;padding:24px}'
        'a{color:#3B2FD9}code{font:14px ui-monospace,monospace}</style></head><body><main>'
        '<p><code>GAURAV.OS // 404</code></p><h1>This page does not exist.</h1>'
        '<p><a href="%s">Go to the homepage</a></p></main></body></html>\n' % home, encoding="utf-8")

    for f in RUNTIME:
        shutil.copy2(ROOT / f, DIST / f)
    for f in PAGES:
        p = ROOT / f
        if p.exists():
            doc = p.read_text(encoding="utf-8")
            doc = doc.replace("<!--SITE-URL-->\n", ('<link rel="canonical" href="%s%s">\n' % (SITE, f)) if SITE else "")
            (DIST / f).write_text(doc, encoding="utf-8")

    # A sitemap needs absolute URLs, so it exists only once SITE is set.
    robots = "User-agent: *\nAllow: /\n"
    if SITE:
        robots += "Sitemap: %ssitemap.xml\n" % SITE
        (DIST / "sitemap.xml").write_text(
            '<?xml version="1.0" encoding="UTF-8"?>\n'
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
            "".join("  <url><loc>%s%s</loc></url>\n" % (SITE, r[0]) for r in ROUTES) +
            "  <url><loc>%scv.html</loc></url>\n" % SITE +
            "</urlset>\n")
    elif (DIST / "sitemap.xml").exists():
        (DIST / "sitemap.xml").unlink()
    (DIST / "robots.txt").write_text(robots)

    # The binaries live in the build output, committed once: docs/media is both
    # the deployed copy and the only copy in the repository. Anything present in
    # site/media (a replacement dropped in by hand) wins and is copied over.
    media = ROOT / "media"
    if media.exists():
        (DIST / "media").mkdir(parents=True, exist_ok=True)
        for f in sorted(media.iterdir()):
            if f.is_file() and f.suffix.lower() != ".md":
                shutil.copy2(f, DIST / "media" / f.name)

    # Pages serves paths beginning with an underscore oddly; .nojekyll disables Jekyll.
    (DIST / ".nojekyll").write_text("")

    # every media path the content layer names must actually ship
    import re as _re
    content = (ROOT / "content.js").read_text(encoding="utf-8")
    for m in sorted(set(_re.findall(r'"(media/[^"]+)"', content))):
        if not (DIST / m).exists():
            print("  MISSING: content.js references %s, which is not in the build" % m)
    if not SITE:
        print("  NOTE: no production URL set (SITE / --site) — canonical, og:url and sitemap omitted")

    n = sum(1 for f in DIST.rglob("*") if f.is_file())
    total = sum(f.stat().st_size for f in DIST.rglob("*") if f.is_file())
    print("built docs/ — %d routes, %d files, %.1f KB" % (len(ROUTES), n, total / 1024))


if __name__ == "__main__":
    main()
