#!/usr/bin/env python3
"""GAURAV.OS asset library generator.

Every asset in brand/assets/ is drawn here, from one set of tokens, so the
whole library shares a single visual language. Nothing is AI-generated and
nothing depicts a product screen, a person or a data set:

  * all assets are original, abstract, code-drawn vectors;
  * text is converted to outlines with the vendored OFL fonts, so an SVG
    looks the same everywhere and never depends on an installed font;
  * no chart, number or measurement is drawn — motifs are decorative;
  * illustrations that sit next to a project carry an "ILLUSTRATION" tag
    so they cannot be mistaken for a screenshot when shared out of context.

    python3 brand/tools/generate_assets.py        # -> brand/assets + brand/asset-manifest.json

Requires: fonttools, brotli (pip install fonttools brotli).
"""
import json, math, pathlib, random, re
from xml.dom import minidom
from xml.sax.saxutils import escape

from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "assets"
FONTS = ROOT / "fonts"

# --------------------------------------------------------------------- tokens
T = {
    "bg": "#0B1110", "surface": "#121C19", "raise": "#1B2924",
    "green": "#4DFF4D", "cyan": "#35D6D0",
    "text": "#F3F6F4", "muted": "#A1ADA7", "ink": "#0B1110",
}
G, C, TX, MU, BG = T["green"], T["cyan"], T["text"], T["muted"], T["bg"]


def r1(v):
    return ("%.1f" % v).rstrip("0").rstrip(".")


def tidy(d):
    return re.sub(r"-?\d+\.\d+", lambda m: r1(float(m.group())), d)


# ---------------------------------------------------------------------- type
class Face:
    def __init__(self, file):
        self.f = TTFont(str(FONTS / file))
        self.gs = self.f.getGlyphSet()
        self.cmap = self.f.getBestCmap()
        self.upm = self.f["head"].unitsPerEm
        self.hmtx = self.f["hmtx"]
        self.cap = getattr(self.f["OS/2"], "sCapHeight", 0) or int(self.upm * .7)

    def _glyph(self, ch):
        return self.cmap.get(ord(ch)) or ".notdef"

    def width(self, text, size, track=0.0):
        s = size / self.upm
        w = sum(self.hmtx[self._glyph(c)][0] * s for c in text)
        return w + track * size * max(len(text) - 1, 0)

    def path(self, text, x, y, size, track=0.0, anchor="start"):
        if anchor != "start":
            w = self.width(text, size, track)
            x -= w if anchor == "end" else w / 2
        s, out = size / self.upm, []
        for c in text:
            g = self._glyph(c)
            pen = SVGPathPen(self.gs)
            self.gs[g].draw(TransformPen(pen, (s, 0, 0, -s, x, y)))
            cmd = pen.getCommands()
            if cmd:
                out.append(cmd)
            x += self.hmtx[g][0] * s + track * size
        return tidy(" ".join(out))


DISPLAY = Face("space-grotesk-latin-700-normal.woff2")
DISPLAY_M = Face("space-grotesk-latin-500-normal.woff2")
MONO = Face("ibm-plex-mono-latin-500-normal.woff2")


def text(face, s, x, y, size, fill, track=0.0, anchor="start", op=1):
    o = '' if op == 1 else ' fill-opacity="%s"' % op
    return '<path fill="%s"%s d="%s"/>' % (fill, o, face.path(s, x, y, size, track, anchor))


def label(s, x, y, size=13, fill=MU, anchor="start", op=1):
    return text(MONO, s, x, y, size, fill, .16, anchor, op)


# ---------------------------------------------------------------- primitives
def svg(w, h, body, title, desc, defs=""):
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d" width="%d" height="%d" '
            'role="img" aria-labelledby="t d"><title id="t">%s</title><desc id="d">%s</desc>'
            '<defs>%s</defs>%s</svg>\n') % (w, h, w, h, escape(title), escape(desc), defs, body)


def glow(fid, sd=6):
    return ('<filter id="%s" x="-50%%" y="-50%%" width="200%%" height="200%%">'
            '<feGaussianBlur stdDeviation="%s" result="b"/><feMerge><feMergeNode in="b"/>'
            '<feMergeNode in="SourceGraphic"/></feMerge></filter>') % (fid, sd)


def ground(w, h, cx, cy, rad, accent=G, grid=80, aid="a"):
    """Background shared by every full-bleed asset: ink, a restrained accent
    bloom, a faint grid and an edge vignette."""
    defs = ('<radialGradient id="%s-bloom" cx="%s" cy="%s" r="%s" gradientUnits="userSpaceOnUse">'
            '<stop offset="0" stop-color="%s" stop-opacity=".16"/>'
            '<stop offset=".55" stop-color="%s" stop-opacity=".04"/>'
            '<stop offset="1" stop-color="%s" stop-opacity="0"/></radialGradient>'
            '<radialGradient id="%s-vig" cx="50%%" cy="50%%" r="75%%">'
            '<stop offset=".6" stop-color="%s" stop-opacity="0"/>'
            '<stop offset="1" stop-color="%s" stop-opacity=".85"/></radialGradient>'
            ) % (aid, cx, cy, rad, accent, accent, accent, aid, BG, BG)
    lines = []
    if grid:
        for x in range(grid, w, grid):
            lines.append("M%d 0V%d" % (x, h))
        for y in range(grid, h, grid):
            lines.append("M0 %dH%d" % (y, w))
    body = ('<rect width="%d" height="%d" fill="%s"/>' % (w, h, BG) +
            ('<path d="%s" stroke="%s" stroke-opacity=".035" stroke-width="1"/>' % ("".join(lines), TX) if grid else "") +
            '<rect width="%d" height="%d" fill="url(#%s-bloom)"/>' % (w, h, aid))
    vig = '<rect width="%d" height="%d" fill="url(#%s-vig)"/>' % (w, h, aid)
    return defs, body, vig


def dots(x, y, cols, rows, gap, r=1.6, fill=TX, op=.28):
    return '<g fill="%s" fill-opacity="%s">%s</g>' % (fill, op, "".join(
        '<circle cx="%s" cy="%s" r="%s"/>' % (r1(x + i * gap), r1(y + j * gap), r)
        for j in range(rows) for i in range(cols)))


def ell_pt(cx, cy, rx, ry, rot, t):
    a, ct, st = math.radians(rot), math.cos(t), math.sin(t)
    return (cx + rx * ct * math.cos(a) - ry * st * math.sin(a),
            cy + rx * ct * math.sin(a) + ry * st * math.cos(a))


def orbit(cx, cy, rx, ry, rot, color, sw=1.6, op=.7, nodes=(), nr=6, fid=None):
    f = ' filter="url(#%s)"' % fid if fid else ""
    s = ('<ellipse cx="%s" cy="%s" rx="%s" ry="%s" transform="rotate(%s %s %s)" fill="none" '
         'stroke="%s" stroke-width="%s" stroke-opacity="%s"%s/>') % (cx, cy, rx, ry, rot, cx, cy, color, sw, op, f)
    for t in nodes:
        px, py = ell_pt(cx, cy, rx, ry, rot, math.radians(t))
        s += '<circle cx="%s" cy="%s" r="%s" fill="%s"%s/>' % (r1(px), r1(py), nr, color, f)
    return s


def ring(cx, cy, r, color, sw=2, op=1, fid=None, dash=None):
    f = ' filter="url(#%s)"' % fid if fid else ""
    d = ' stroke-dasharray="%s"' % dash if dash else ""
    return ('<circle cx="%s" cy="%s" r="%s" fill="none" stroke="%s" stroke-width="%s" '
            'stroke-opacity="%s"%s%s/>') % (cx, cy, r, color, sw, op, d, f)


def stem(x, y1, y2, color=TX, op=.22, node=True):
    s = '<path d="M%s %sV%s" stroke="%s" stroke-opacity="%s" stroke-width="1"/>' % (x, y1, y2, color, op)
    if node:
        s += '<circle cx="%s" cy="%s" r="3.5" fill="%s"/>' % (x, y2, color)
    return s


def arc_path(cx, cy, r, a0, a1):
    """Clockwise arc from a0 to a1 (degrees, SVG orientation)."""
    x0, y0 = cx + r * math.cos(math.radians(a0)), cy + r * math.sin(math.radians(a0))
    x1, y1 = cx + r * math.cos(math.radians(a1)), cy + r * math.sin(math.radians(a1))
    large = 1 if (a1 - a0) % 360 > 180 else 0
    return "M%s %sA%s %s 0 %d 1 %s %s" % (r1(x0), r1(y0), r1(r), r1(r), large, r1(x1), r1(y1))


def corners(w, h, m=40, l=26, color=TX, op=.35):
    d = ("M{m} {a}V{m}H{a} M{b} {m}H{c}V{a} M{c} {e}V{f}H{b} M{a} {f}H{m}V{e}").format(
        m=m, a=m + l, b=w - m - l, c=w - m, e=h - m - l, f=h - m)
    return '<path d="%s" fill="none" stroke="%s" stroke-opacity="%s" stroke-width="1.5"/>' % (d, color, op)


def illus_tag(w, h):
    return label("ILLUSTRATION · NOT A PRODUCT SCREENSHOT", w - 40, h - 36, 11, MU, "end", .7)


# ------------------------------------------------------------------ registry
MANIFEST = []


def emit(cat, name, w, h, content, purpose, used_by, alt, has_text=False, notes=""):
    p = OUT / cat / name
    p.parent.mkdir(parents=True, exist_ok=True)
    minidom.parseString(content)  # fail the build on malformed XML
    p.write_text(content, encoding="utf-8")
    MANIFEST.append({
        "id": "%s/%s" % (cat, p.stem), "file": "brand/assets/%s/%s" % (cat, name),
        "category": cat, "purpose": purpose, "used_by": used_by,
        "width": w, "height": h, "format": "SVG", "bytes": p.stat().st_size,
        "provenance": "ORIGINAL — code-drawn vector (brand/tools/generate_assets.py)",
        "depicts": "Abstract motif only. No person, no product screen, no data.",
        "contains_text": has_text, "alt": alt,
        "status": "PROPOSED — awaiting approval", "notes": notes})


# ===================================================================== BRAND
def wordmark(fill_main=TX, fill_accent=G, size=200, tagline=True):
    """'Gaurav' + green '.OS'. The O is a broken ring — an original take on the
    brand board's power-ring O, drawn as geometry rather than a glyph."""
    pad = 24
    x = pad
    base = size * 1.0
    parts = [text(DISPLAY, "Gaurav", x, base, size, fill_main, -.01)]
    x += DISPLAY.width("Gaurav", size, -.01)
    parts.append(text(DISPLAY, ".", x, base, size, fill_accent))
    x += DISPLAY.width(".", size) + size * .03
    ch = DISPLAY.cap * size / DISPLAY.upm
    sw = ch * .19
    rr = ch / 2 - sw / 2
    ocx, ocy = x + ch / 2, base - ch / 2
    # gap of ~34 degrees at one o'clock: reads as an O first, a power ring second
    parts.append('<path d="%s" fill="none" stroke="%s" stroke-width="%s"/>' % (
        arc_path(ocx, ocy, rr, -46, 280), fill_accent, r1(sw)))
    x += ch + size * .045
    parts.append(text(DISPLAY, "S", x, base, size, fill_accent))
    x += DISPLAY.width("S", size)
    w = int(x + pad)
    h = int(base + size * .26)
    if tagline:
        ty = base + size * .42
        parts.append(text(MONO, "PRODUCT × AI × BUILDING", w / 2, ty, size * .15, fill_main, .32, "middle", .92))
        h = int(ty + size * .14)
    return w, h, "".join(parts)


def brand():
    w, h, body = wordmark()
    emit("brand", "gauravos-wordmark-on-dark.svg", w, h,
         svg(w, h, body, "Gaurav.OS", "Gaurav.OS wordmark with the line Product, AI, Building."),
         "Primary wordmark for dark surfaces.", ["Home hero", "Header", "Footer", "OG image"],
         "Gaurav.OS — Product × AI × Building", True)
    w, h, body = wordmark(T["ink"], "#138A1E")
    emit("brand", "gauravos-wordmark-on-light.svg", w, h,
         svg(w, h, body, "Gaurav.OS", "Gaurav.OS wordmark for light backgrounds."),
         "Wordmark for light surfaces (printed CV, Recruiter light theme).", ["CV", "Recruiter Mode (light)"],
         "Gaurav.OS — Product × AI × Building", True,
         "Accent darkened to #138A1E so it holds 4.5:1 on white; #4DFF4D does not.")
    w, h, body = wordmark(tagline=False, size=120)
    emit("brand", "gauravos-wordmark-compact.svg", w, h,
         svg(w, h, body, "Gaurav.OS", "Compact Gaurav.OS wordmark."),
         "Compact wordmark for the navigation bar.", ["Header", "Mobile nav"], "Gaurav.OS", True)

    # app icon: broken ring + core, on a raised tile
    def icon(n, inner=True):
        c, r = n / 2, n * .30
        sw = n * .085
        body = ('<rect width="%d" height="%d" rx="%s" fill="%s"/>' % (n, n, r1(n * .22), BG) +
                '<rect x="1" y="1" width="%d" height="%d" rx="%s" fill="none" stroke="%s" stroke-opacity=".12"/>' % (n - 2, n - 2, r1(n * .22), TX) +
                '<path d="%s" fill="none" stroke="%s" stroke-width="%s" stroke-linecap="butt" filter="url(#ig)"/>' % (arc_path(c, c, r, -28, 252), G, r1(sw)) +
                '<circle cx="%s" cy="%s" r="%s" fill="%s"/>' % (r1(c + r * math.cos(math.radians(-50))), r1(c + r * math.sin(math.radians(-50))), r1(sw * .55), G))
        if inner:
            body += '<circle cx="%s" cy="%s" r="%s" fill="%s"/>' % (c, c, r1(n * .07), TX)
        return body
    emit("brand", "gauravos-app-icon-512.svg", 512, 512,
         svg(512, 512, icon(512), "Gaurav.OS icon", "Broken green ring with a white core on a dark tile.", glow("ig", 7)),
         "App icon, PWA icon, social avatar fallback.", ["manifest.webmanifest", "apple-touch-icon"],
         "Gaurav.OS icon")
    emit("brand", "gauravos-favicon.svg", 32, 32,
         svg(32, 32, icon(32, inner=False), "Gaurav.OS", "Favicon.", glow("ig", .6)),
         "Browser favicon.", ["<head>"], "Gaurav.OS")


# ====================================================================== HERO
def hero(w, h, name, cx, cy, R):
    defs, base, vig = ground(w, h, cx, cy, R * 1.9, G, 80, "h")
    defs += glow("hg", 7) + glow("hs", 3)
    b = [base]
    b.append(dots(cx - R * 1.55, cy - R * .62, 6, 5, 22))
    b.append(dots(cx + R * 1.28, cy + R * .18, 6, 5, 22))
    b.append(ring(cx, cy, R * .66, G, 1, .10))
    b.append(ring(cx, cy, R * .43, G, 26, .05))
    b.append(orbit(cx, cy, R * 1.36, R * .30, -4, G, 2, .65, (198, 342), 6, "hs"))
    b.append(orbit(cx, cy, R * 1.12, R * .80, 24, C, 1.2, .45, (300,), 5, "hs"))
    b.append(orbit(cx, cy, R * .98, R * .98, 0, TX, 1, .08, ()))
    b.append(ring(cx, cy, R, G, 3.2, .95, "hg"))
    b.append(ring(cx, cy, R + 9, G, 1, .25))
    for k, dx in enumerate((-.62, -.48, .55, .70)):
        x = cx + R * dx
        b.append(stem(r1(x), r1(cy - R * (.9 if k % 2 else .78)), r1(cy - R * (.2 if k % 2 else .35)), TX, .18, k in (1, 2)))
    b.append(vig)
    return svg(w, h, "".join(b), "Gaurav.OS hero field",
               "A glowing green ring with tilted orbits, nodes and dot grids on near-black. The centre is left empty for the wordmark or an owner-supplied portrait.", defs)


def heroes():
    emit("hero", "hero-orbit-field-desktop.svg", 1920, 1080, hero(1920, 1080, "d", 1180, 520, 330),
         "Homepage hero background. Ring centre is a slot for the owner-supplied portrait or the wordmark.",
         ["Home / hero (≥1024px)"], "", False,
         "Decorative: render with alt=\"\". Portrait slot stays empty until an original photograph is supplied.")
    emit("hero", "hero-orbit-field-mobile.svg", 1080, 1600, hero(1080, 1600, "m", 540, 560, 300),
         "Homepage hero background, portrait orientation.", ["Home / hero (<1024px)"], "", False,
         "Decorative: render with alt=\"\".")
    # OG image: hero field + wordmark + positioning
    w, h = 1200, 630
    defs, base, vig = ground(w, h, 860, 300, 520, G, 60, "o")
    defs += glow("og", 6)
    ww, wh, wb = wordmark(size=96)
    body = (base + ring(860, 300, 210, G, 2.6, .9, "og") +
            orbit(860, 300, 300, 66, -4, G, 1.6, .55, (200, 340), 5) +
            orbit(860, 300, 250, 175, 24, C, 1, .4, (300,), 4) + vig +
            '<g transform="translate(56 168)">%s</g>' % wb +
            text(DISPLAY_M, "Healthcare product, research and analytics.", 80, 470, 30, TX) +
            label("GAURAV SINGH · PRODUCT × AI × BUILDING", 80, 520, 15, MU))
    emit("og", "og-default-1200x630.svg", w, h,
         svg(w, h, body, "Gaurav.OS", "Gaurav.OS wordmark, positioning line and orbit motif.", defs),
         "Open Graph / Twitter card image (rasterised to PNG at build).", ["<meta og:image>"],
         "Gaurav.OS — Healthcare product, research and analytics.", True,
         "Positioning line taken from the healthcare CV headline. PNG export in brand/preview/.")


# =================================================================== SPATIAL
def spatial():
    n = 1024
    minor = "".join("M%d 0V%dM0 %dH%d" % (i, n, i, n) for i in range(0, n, 64))
    major = "".join("M%d 0V%dM0 %dH%d" % (i, n, i, n) for i in range(0, n, 256))
    nodes = "".join('<circle cx="%d" cy="%d" r="2.4"/>' % (x, y) for x in range(0, n + 1, 256) for y in range(0, n + 1, 256))
    body = ('<rect width="%d" height="%d" fill="%s"/>' % (n, n, BG) +
            '<path d="%s" stroke="%s" stroke-opacity=".06"/>' % (minor, TX) +
            '<path d="%s" stroke="%s" stroke-opacity=".22" stroke-width="1.5"/>' % (major, G) +
            '<g fill="%s">%s</g>' % (G, nodes))
    emit("spatial", "ground-grid-tile-1024.svg", n, n,
         svg(n, n, body, "Ground grid tile", "Seamless dark grid with green major lines and node points."),
         "Repeating ground texture for the 3D environment (rasterised to a 1024² KTX2/WebP texture at build).",
         ["Explore Mode / ground plane"], "", False, "Seamless: major lines fall on tile edges.")

    # skyline: abstract architecture in six clusters
    W, H = 3840, 1080
    rnd = random.Random(7)
    defs, base, vig = ground(W, H, W / 2, H * .9, 1500, G, 0, "s")
    defs += ('<linearGradient id="tw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="%s"/>'
             '<stop offset="1" stop-color="%s"/></linearGradient>') % (T["raise"], BG)
    b = [base, '<path d="M0 %dH%d" stroke="%s" stroke-opacity=".35"/>' % (H - 140, W, G)]
    clusters = [(380, 1.0), (1000, 1.25), (1620, .9), (2220, 1.5), (2840, 1.1), (3460, .95)]
    for ci, (cx, k) in enumerate(clusters):
        for j in range(7):
            tw = rnd.choice((54, 70, 90, 120))
            th = int(rnd.uniform(140, 420) * k * (1.35 if j == 3 else 1))
            x = cx - 270 + j * 78 + rnd.uniform(-10, 10)
            y = H - 140 - th
            b.append('<rect x="%s" y="%d" width="%d" height="%d" fill="url(#tw)" stroke="%s" stroke-opacity=".14"/>' % (r1(x), y, tw, th, TX))
            rows = "".join("M%s %dH%s" % (r1(x + 10), yy, r1(x + tw - 10)) for yy in range(y + 24, H - 150, 22))
            b.append('<path d="%s" stroke="%s" stroke-opacity="%s"/>' % (rows, C if ci % 2 else G, .10 if j != 3 else .22))
            if j == 3:
                b.append('<circle cx="%s" cy="%d" r="5" fill="%s"/>' % (r1(x + tw / 2), y - 16, G))
                b.append('<path d="M%s %dV%d" stroke="%s" stroke-opacity=".5"/>' % (r1(x + tw / 2), y - 12, y, G))
    b.append(vig)
    emit("spatial", "skyline-panorama-3840.svg", W, H,
         svg(W, H, "".join(b), "Abstract skyline",
             "Six clusters of abstract dark towers with faint light rows and beacons, one per district.", defs),
         "Distant backdrop / cyclorama for the 3D scene, and the static still under reduced motion.",
         ["Explore Mode / backdrop", "Reduced-motion still"], "", False,
         "Six clusters map left-to-right to the six districts. Architecture is abstract — no real buildings.")


DISTRICTS = [
    ("01", "product-leadership", "Product Leadership", G),
    ("02", "healthtech-innovation", "HealthTech Innovation", G),
    ("03", "ai-safety-lab", "AI & Safety Lab", C),
    ("04", "research-analytics", "Research & Analytics", C),
    ("05", "professional-experience", "Professional Experience", G),
    ("06", "knowledge-hq", "Knowledge & Headquarters", G),
]


def district_map():
    W, H = 1600, 1000
    defs, base, vig = ground(W, H, 800, 500, 700, G, 50, "m")
    defs += glow("mg", 5)
    cx, cy = 800, 500
    pos = [(800 + 430 * math.cos(math.radians(a)), 500 + 330 * math.sin(math.radians(a)))
           for a in (-90, -30, 30, 90, 150, 210)]
    order = [0, 1, 2, 3, 4]  # HQ is the centre
    b = [base, ring(cx, cy, 120, G, 2.4, .9, "mg"), ring(cx, cy, 150, G, 1, .2)]
    b.append(orbit(cx, cy, 430, 330, 0, TX, 1, .12, ()))
    for i, (idx, slug, name, col) in enumerate(DISTRICTS[:5]):
        px, py = pos[i]
        b.append('<path d="M%s %sL%s %s" stroke="%s" stroke-opacity=".35" stroke-dasharray="4 6"/>' % (cx, cy, r1(px), r1(py), col))
        b.append('<rect x="%s" y="%s" width="220" height="92" rx="14" fill="%s" stroke="%s" stroke-opacity=".55"/>' % (r1(px - 110), r1(py - 46), T["surface"], col))
        b.append(label(idx, px - 92, py - 14, 13, col))
        b.append(text(DISPLAY_M, name, px - 92, py + 20, 19 if len(name) < 20 else 16, TX))
    b.append(label("06", cx, cy - 18, 13, G, "middle"))
    b.append(text(DISPLAY_M, "Knowledge & HQ", cx, cy + 14, 19, TX, 0, "middle"))
    b.append(vig)
    emit("spatial", "district-map-2d.svg", W, H,
         svg(W, H, "".join(b), "Gaurav.OS district map",
             "Six districts: Product Leadership, HealthTech Innovation, AI and Safety Lab, Research and Analytics, Professional Experience, and Knowledge and Headquarters at the centre.", defs),
         "2D map: mobile / no-WebGL / reduced-motion fallback for Explore Mode, and the Explore Mode legend.",
         ["Explore Mode fallback", "Explore Mode legend"],
         "Map of the six Gaurav.OS districts around the Knowledge and Headquarters core.", True,
         "Each district label is overlaid by a real link in the DOM; the image itself is never the only route.")


# ================================================================= DISTRICTS
def district_bg(i, idx, slug, name, col):
    W, H = 1920, 1080
    cx, cy = 1340, 540
    defs, base, vig = ground(W, H, cx, cy, 900, col, 80, "d%d" % i)
    defs += glow("dg", 5)
    rnd = random.Random(100 + i)
    b = [base]
    if slug == "product-leadership":            # roadmap lanes + stacked planes
        for k in range(4):
            y = 330 + k * 120
            b.append('<path d="M900 %dH1820" stroke="%s" stroke-opacity=".12"/>' % (y, TX))
            x = 940 + k * 40
            for seg in range(3 - (k == 3)):
                L = rnd.choice((150, 210, 260))
                b.append('<rect x="%d" y="%d" width="%d" height="34" rx="17" fill="%s" fill-opacity="%s" stroke="%s" stroke-opacity=".6"/>' % (x, y - 17, L, col, .10 + .06 * (2 - seg), col))
                x += L + 46
        for k in range(3):
            b.append('<path d="M%d %dl140 -70l140 70l-140 70z" fill="none" stroke="%s" stroke-opacity="%s"/>' % (1180, 820 - k * 26, col, .5 - k * .14))
    elif slug == "healthtech-innovation":      # pulse line + care rings
        b.append(ring(cx, cy, 260, col, 1, .14))
        b.append(ring(cx, cy, 190, col, 2.4, .8, "dg"))
        b.append(ring(cx, cy, 120, col, 1, .2, dash="3 9"))
        d = "M820 540H1150l26 -60l34 150l40 -230l34 200l22 -60H1860"
        b.append('<path d="%s" fill="none" stroke="%s" stroke-width="2.6" stroke-linejoin="round" filter="url(#dg)"/>' % (d, col))
        for (x, y) in ((1000, 330), (1660, 760), (1720, 360)):
            b.append('<path d="M%d %dh28M%d %dv28" stroke="%s" stroke-opacity=".55" stroke-width="2"/>' % (x - 14, y, x, y - 14, TX))
    elif slug == "ai-safety-lab":              # node lattice inside a guardrail
        layers = [3, 5, 5, 3]
        pts = []
        for L, n in enumerate(layers):
            x = 1100 + L * 170
            pts.append([(x, cy + (j - (n - 1) / 2) * 92) for j in range(n)])
        lines = "".join("M%d %sL%d %s" % (a[0], r1(a[1]), c[0], r1(c[1]))
                        for L in range(3) for a in pts[L] for c in pts[L + 1])
        b.append('<path d="%s" stroke="%s" stroke-opacity=".16"/>' % (lines, col))
        for L in pts:
            for (x, y) in L:
                b.append('<circle cx="%d" cy="%s" r="9" fill="%s" stroke="%s" stroke-width="2"/>' % (x, r1(y), BG, col))
        b.append('<rect x="1010" y="230" width="690" height="620" rx="80" fill="none" stroke="%s" stroke-width="2.4" stroke-dasharray="14 10" filter="url(#dg)"/>' % G)
    elif slug == "research-analytics":         # 90-point spiral constellation (decorative, no axes)
        for k in range(90):
            a = k * 2.399963
            rr = 14 * math.sqrt(k + 1) * 2.3
            x, y = cx + rr * math.cos(a), cy + rr * math.sin(a)
            hot = k == 89
            b.append('<circle cx="%s" cy="%s" r="%s" fill="%s" fill-opacity="%s"%s/>' % (
                r1(x), r1(y), 7 if hot else 3.4, G if hot else col, 1 if hot else .55, ' filter="url(#dg)"' if hot else ""))
        b.append(ring(cx, cy, 320, col, 1, .12))
    elif slug == "professional-experience":    # timeline track with milestones
        b.append('<path d="M860 600H1840" stroke="%s" stroke-opacity=".5" stroke-width="2"/>' % col)
        for k, x in enumerate((940, 1180, 1420, 1640)):
            hgt = 120 + 70 * k
            b.append('<path d="M%d 600V%d" stroke="%s" stroke-opacity=".3"/>' % (x, 600 - hgt, TX))
            b.append('<rect x="%d" y="%d" width="150" height="54" rx="10" fill="%s" stroke="%s" stroke-opacity=".5"/>' % (x - 10, 600 - hgt - 54, T["surface"], col))
            b.append('<path d="M%d %dH%d" stroke="%s" stroke-opacity=".4" stroke-width="5" stroke-linecap="round"/>' % (x + 8, 600 - hgt - 30, x + 90 - 10 * k, TX))
            b.append('<circle cx="%d" cy="600" r="9" fill="%s"%s/>' % (x, col, ' filter="url(#dg)"' if k == 3 else ""))
        b.append(dots(880, 700, 40, 3, 24, 1.4, TX, .14))
    else:                                       # knowledge & HQ: core + five domains
        b.append(ring(cx, cy, 90, col, 3, .95, "dg"))
        b.append(ring(cx, cy, 330, TX, 1, .1))
        for k in range(5):
            a = math.radians(-90 + k * 72)
            x, y = cx + 330 * math.cos(a), cy + 330 * math.sin(a)
            b.append('<path d="M%s %sL%s %s" stroke="%s" stroke-opacity=".28"/>' % (r1(cx + 100 * math.cos(a)), r1(cy + 100 * math.sin(a)), r1(x), r1(y), col))
            b.append('<circle cx="%s" cy="%s" r="16" fill="%s" stroke="%s" stroke-width="2"/>' % (r1(x), r1(y), BG, col))
        b.append(orbit(cx, cy, 440, 120, -8, C, 1.2, .4, (30,), 5))
    b.append(corners(W, H))
    b.append(vig)
    return svg(W, H, "".join(b), "%s district background" % name,
               "Abstract motif for the %s district on the right; the left side is left clear for content." % name, defs)


def districts():
    motifs = {
        "product-leadership": "Roadmap lanes and stacked planes.",
        "healthtech-innovation": "A pulse line through concentric care rings.",
        "ai-safety-lab": "A node lattice enclosed by a dashed guardrail.",
        "research-analytics": "A 90-point spiral — one point per case-study day, decorative, no axes or values.",
        "professional-experience": "A timeline with four rising milestones.",
        "knowledge-hq": "A core ring connected to five domain nodes (the Product Orbit).",
    }
    for i, (idx, slug, name, col) in enumerate(DISTRICTS):
        emit("districts", "district-%s-%s.svg" % (idx, slug), 1920, 1080, district_bg(i, idx, slug, name, col),
             "Background for the %s district panel and its 3D billboard. Motif: %s" % (name, motifs[slug]),
             ["Explore Mode / %s" % name, "District panel header"], "", False,
             "Text-free so the UI overlays real headings. Left 45% kept clear for content.")


# ==================================================================== COVERS
def cover(slug, motif_fn, title, note):
    W, H = 1200, 750
    defs, base, vig = ground(W, H, 600, 360, 620, G, 60, "c")
    defs += glow("cg", 4)
    body = (base + '<g transform="translate(600 360) scale(1.3) translate(-820 -370)">' + motif_fn(W, H) + '</g>' +
            corners(W, H, 28, 20) + vig + illus_tag(W, H))
    emit("covers", "cover-%s.svg" % slug, W, H,
         svg(W, H, body, "%s cover illustration" % title, note, defs),
         "Card and case-study header image for %s." % title,
         ["Projects grid", "Case study / %s" % title, "Explore Mode building"],
         "Abstract illustration for %s. Not a product screenshot." % title, True,
         "Words drawn on the cover are taken from the project record. " + note)


def covers():
    def aaroh(W, H):
        cx, cy, r = 800, 360, 190
        steps = ["UNDERSTAND", "EXPLAIN", "RECOMMEND", "SUPPORT"]
        s = ring(cx, cy, r, TX, 1, .12)
        for k, w in enumerate(steps):
            a0 = -90 + k * 90 + 8
            s += '<path d="%s" fill="none" stroke="%s" stroke-width="3" stroke-opacity="%s"/>' % (arc_path(cx, cy, r, a0, a0 + 74), G, .9 - k * .12)
            a = math.radians(-90 + k * 90)
            x, y = cx + r * math.cos(a), cy + r * math.sin(a)
            s += '<circle cx="%s" cy="%s" r="8" fill="%s" filter="url(#cg)"/>' % (r1(x), r1(y), G)
            lx, ly = cx + (r + 34) * math.cos(a), cy + (r + 34) * math.sin(a) + 5
            s += label(w, lx, ly, 13, TX, "middle" if k % 2 == 0 else ("start" if k == 1 else "end"))
        s += ring(cx, cy, 46, C, 1.4, .7) + '<circle cx="%d" cy="%d" r="6" fill="%s"/>' % (cx, cy, C)
        return s

    def careconnect(W, H):
        s = ""
        for k in range(30):
            x, y = 560 + (k % 10) * 56, 210 + (k // 10) * 70
            first = k == 0
            s += '<rect x="%d" y="%d" width="42" height="52" rx="8" fill="%s" fill-opacity="%s" stroke="%s" stroke-opacity="%s"/>' % (
                x, y, G if first else T["surface"], .9 if first else 1, G, .9 if first else .3)
        s += label("DAY 1", 581, 300, 11, BG, "middle")
        s += label("THE FIRST 30 DAYS AFTER DISCHARGE", 560, 470, 13, MU)
        s += '<path d="M560 520H1100" stroke="%s" stroke-opacity=".25"/>' % TX
        for x, w in ((560, "FAMILY"), (1100, "CARE RECORD")):
            s += '<circle cx="%d" cy="520" r="7" fill="%s"/>' % (x, C) + label(w, x, 556, 12, TX, "start" if x == 560 else "end")
        return s

    def phonepe(W, H):
        s = '<circle cx="640" cy="360" r="70" fill="none" stroke="%s" stroke-width="3" filter="url(#cg)"/>' % G
        s += '<circle cx="1000" cy="360" r="70" fill="none" stroke="%s" stroke-width="3" stroke-dasharray="6 8"/>' % C
        s += '<path d="M710 360H800M840 360H930" stroke="%s" stroke-width="3" stroke-opacity=".7"/>' % TX
        s += '<path d="M806 346l28 28M834 346l-28 28" stroke="%s" stroke-width="2.4" stroke-opacity=".6"/>' % TX
        s += label("INSIGHT", 640, 366, 14, TX, "middle") + label("ACTION", 1000, 366, 14, TX, "middle")
        s += label("WHERE VALUE STOPS TRANSFERRING", 820, 500, 13, MU, "middle")
        s += label("COURSE CASE · MASAI SCHOOL × IIT ROORKEE FACULTY", 820, 530, 11, MU, "middle", .7)
        return s

    def ghargyaan(W, H):
        s = '<path d="M700 470V330l120 -96l120 96V470z" fill="none" stroke="%s" stroke-width="3" stroke-linejoin="round" filter="url(#cg)"/>' % G
        s += ring(820, 360, 210, C, 1.6, .55, dash="10 10")
        s += label("SAFETY CHECK RUNS FIRST", 820, 610, 13, MU, "middle")
        for k, op in enumerate((1, .6, .3)):
            s += '<rect x="%d" y="%d" width="60" height="10" rx="5" fill="%s" fill-opacity="%s"/>' % (790, 380 + k * 24, G, op)
        return s

    def nexus(W, H):
        kinds = ["CONFLICT", "CHANGE", "COMMITMENT", "MISSING INFORMATION"]
        s = ""
        for k, w in enumerate(kinds):
            y = 170 + k * 100
            s += '<rect x="560" y="%d" width="520" height="72" rx="12" fill="%s" stroke="%s" stroke-opacity="%s"/>' % (y, T["surface"], G if k == 0 else TX, .7 if k == 0 else .16)
            s += '<circle cx="596" cy="%d" r="7" fill="%s"/>' % (y + 36, G if k == 0 else C)
            s += label(w, 620, y + 42, 14, TX)
            s += '<path d="M%d %dH1050" stroke="%s" stroke-opacity=".14" stroke-width="6" stroke-linecap="round"/>' % (620 + len(w) * 11 + 40, y + 37, TX)
        return s

    def corpus(W, H):
        s = ""
        for k in range(90):
            x, y = 580 + (k % 15) * 34, 190 + (k // 15) * 52
            last = k == 89
            s += '<circle cx="%d" cy="%d" r="%s" fill="%s" fill-opacity="%s"%s/>' % (
                x, y, 8 if last else 5, G, 1 if last else .5, ' filter="url(#cg)"' if last else "")
        s += label("90 DAYS · 90 CASE STUDIES", 580, 540, 13, MU)
        return s

    def evamastu(W, H):
        s = ""
        for k, rr in enumerate((150, 112, 74)):
            s += ring(820, 330, rr, G, 2.6 if k == 2 else 1.4, (.9, .5, .3)[k], "cg" if k == 2 else None)
        s += '<circle cx="820" cy="330" r="10" fill="%s"/>' % G
        items = ["PARENT DASHBOARD", "WELLNESS ASSESSMENT", "4 ADAPTIVE GAMES"]
        for k, w in enumerate(items):
            x = 560 + k * 182
            s += '<rect x="%d" y="520" width="168" height="54" rx="10" fill="%s" stroke="%s" stroke-opacity=".45"/>' % (x, T["surface"], C if k == 2 else G)
            s += label(w, x + 84, 552, 10.5, TX, "middle")
        return s

    covers_ = [
        ("evamastu", evamastu, "Evamastu", "Mindfulness rings above the three shipped surfaces named in the CV."),
        ("aaroh", aaroh, "Aaroh", "The four-step non-diagnostic invariant: understand, explain, recommend, support."),
        ("careconnect", careconnect, "CareConnect", "The first 30 days after discharge — the product's beachhead window."),
        ("phonepe-smart-spend-coach", phonepe, "PhonePe Smart Spend Coach", "The insight-to-action gap the case prioritised; labelled as a course case."),
        ("ghargyaan", ghargyaan, "GharGyaan", "Household knowledge inside a safety boundary that is checked first."),
        ("nexus", nexus, "Nexus", "The four situation types Nexus surfaces."),
        ("90-day-corpus", corpus, "90-Day Case Study Corpus", "Ninety uniform points, one per study; no evidence levels are encoded."),
    ]
    for slug, fn, title, note in covers_:
        cover(slug, fn, title, note)


# ================================================================== SECTIONS
def section(slug, title, desc, used_by, fn, purpose):
    W, H = 1600, 900
    defs, base, vig = ground(W, H, 800, 450, 760, G, 64, "x")
    defs += glow("xg", 4)
    body = base + fn(W, H) + vig
    emit("sections", "section-%s.svg" % slug, W, H, svg(W, H, body, title, desc, defs),
         purpose, used_by, desc, True, "Stage names are taken verbatim from content records.")


def sections():
    def loop(W, H):
        st = ["OBSERVE", "FRAME", "RESEARCH", "HYPOTHESIZE", "BUILD", "MEASURE", "LEARN", "ITERATE"]
        cx, cy, r = 800, 450, 280
        s = ring(cx, cy, r, G, 2, .6, "xg") + ring(cx, cy, r - 40, TX, 1, .08)
        for k, w in enumerate(st):
            a = math.radians(-90 + k * 45)
            x, y = cx + r * math.cos(a), cy + r * math.sin(a)
            s += '<circle cx="%s" cy="%s" r="10" fill="%s" stroke="%s" stroke-width="2.4"/>' % (r1(x), r1(y), BG, G)
            lx, ly = cx + (r + 46) * math.cos(a), cy + (r + 46) * math.sin(a) + 5
            anc = "middle" if abs(math.cos(a)) < .3 else ("start" if math.cos(a) > 0 else "end")
            s += label(w, lx, ly, 15, TX, anc)
        s += text(DISPLAY_M, "Operating loop", cx, cy + 10, 30, TX, 0, "middle")
        return s

    def ask(W, H):
        st = ["QUESTION", "INTENT", "EVIDENCE", "GROUNDED ANSWER", "SOURCES"]
        s = ""
        for k, w in enumerate(st):
            x = 140 + k * 290
            s += '<rect x="%d" y="380" width="240" height="80" rx="14" fill="%s" stroke="%s" stroke-opacity=".6"/>' % (x, T["surface"], G)
            s += label(w, x + 120, 426, 14, TX, "middle")
            if k < 4:
                s += '<path d="M%d 420H%d" stroke="%s" stroke-opacity=".5" stroke-width="2"/>' % (x + 240, x + 290, G)
        s += '<path d="M260 460V600H700" fill="none" stroke="%s" stroke-opacity=".6" stroke-width="2" stroke-dasharray="6 6"/>' % C
        s += '<rect x="700" y="560" width="320" height="80" rx="14" fill="%s" stroke="%s" stroke-opacity=".7"/>' % (T["surface"], C)
        s += label("NO EVIDENCE → REFUSE", 860, 606, 14, C, "middle")
        s += label("CHECKED BEFORE ANY TOPIC MATCH", 860, 680, 12, MU, "middle")
        return s

    def evidence(W, H):
        lv = [("VERIFIED", G, 1), ("DOCUMENTED", G, .7), ("SOURCED", C, .7), ("NARRATIVE", TX, .35)]
        s = ""
        for k, (w, col, op) in enumerate(lv):
            y = 220 + k * 130
            s += '<rect x="%d" y="%d" width="%d" height="90" rx="14" fill="%s" fill-opacity=".06" stroke="%s" stroke-opacity="%s"/>' % (400 + k * 60, y, 800 - k * 120, col, col, op)
            s += label(w, 440 + k * 60, y + 52, 16, col, "start", max(op, .7))
        s += label("EVIDENCE LEVELS USED ACROSS THE CORPUS", 800, 790, 13, MU, "middle")
        return s

    def challenge(W, H):
        s = '<circle cx="300" cy="450" r="14" fill="%s" filter="url(#xg)"/>' % G
        ys = (240, 380, 520, 660)
        for k, y in enumerate(ys):
            hot = k == 1
            s += '<path d="M314 450C520 450 560 %d 760 %d" fill="none" stroke="%s" stroke-opacity="%s" stroke-width="%s"/>' % (y, y, G if hot else TX, .9 if hot else .2, 2.6 if hot else 1.4)
            s += '<rect x="760" y="%d" width="300" height="64" rx="12" fill="%s" stroke="%s" stroke-opacity="%s"/>' % (y - 32, T["surface"], G if hot else TX, .7 if hot else .15)
            s += label("OPTION " + "ABCD"[k], 790, y + 6, 14, TX if hot else MU)
        s += '<path d="M1060 380H1300" stroke="%s" stroke-width="2.6" stroke-opacity=".9"/>' % G
        s += '<rect x="1300" y="340" width="200" height="80" rx="14" fill="none" stroke="%s" stroke-width="2"/>' % G
        s += label("REASONING", 1400, 386, 14, G, "middle")
        return s

    def lab(W, H):
        s = ""
        for k in range(5):
            x, y = 480 + k * 36, 220 + k * 30
            s += '<rect x="%d" y="%d" width="520" height="420" rx="16" fill="%s" stroke="%s" stroke-opacity="%s"/>' % (x, y, T["surface"], G if k == 4 else TX, .6 if k == 4 else .12)
        x, y = 480 + 4 * 36, 220 + 4 * 30
        s += label("DRAFT", x + 36, y + 50, 13, G)
        for j in range(7):
            s += '<path d="M%d %dH%d" stroke="%s" stroke-opacity=".18" stroke-width="6" stroke-linecap="round"/>' % (x + 36, y + 100 + j * 38, x + 470 - (j % 3) * 70, TX)
        return s

    section("operating-loop", "How I Think — operating loop",
            "Eight stages on a loop: observe, frame, research, hypothesize, build, measure, learn, iterate.",
            ["How I Think"], loop, "Header illustration for How I Think.")
    section("ask-gaurav-pipeline", "Ask Gaurav — grounded answer path",
            "Question to intent to evidence to grounded answer to sources, with a refusal branch when no evidence exists.",
            ["Ask Gaurav"], ask, "Explains how Ask Gaurav answers and when it refuses.")
    section("evidence-levels", "Evidence levels",
            "Four evidence levels as a ladder: verified, documented, sourced, narrative.",
            ["Research & Knowledge", "Product Atlas legend"], evidence, "Header illustration for the research corpus.")
    section("challenge-branches", "Challenge Gaurav",
            "A decision point branching into four options, one path continuing to the reasoning.",
            ["Challenge"], challenge, "Header illustration for Challenge Gaurav.")
    section("lab-notes", "Lab Notes",
            "A stack of note pages, the top one marked draft.",
            ["Lab Notes"], lab, "Header illustration for Lab Notes.")


# ===================================================================== ICONS
ICONS = {
    # product × ai × building — original line icons, 24px grid, 1.5 stroke
    "product-cube": '<path d="M12 2.8 20 7.2v9.6L12 21.2 4 16.8V7.2z"/><path d="M4 7.2 12 11.6 20 7.2M12 11.6v9.6"/>',
    "ai-network": '<circle cx="12" cy="5" r="2"/><circle cx="5" cy="17" r="2"/><circle cx="19" cy="17" r="2"/><circle cx="12" cy="12" r="1.6"/><path d="M12 7v3.4M10.7 13 6.6 15.9M13.3 13l4.1 2.9M7 17h10"/>',
    "build-code": '<rect x="3" y="4.5" width="18" height="12.5" rx="1.8"/><path d="M2 20h20M10 8.5 7.6 10.8 10 13M14 8.5l2.4 2.3L14 13"/>',
    # districts
    "district-product-leadership": '<path d="M4 6h9M4 12h13M4 18h7"/><circle cx="16" cy="6" r="2"/><circle cx="20" cy="12" r="2"/><circle cx="14" cy="18" r="2"/>',
    "district-healthtech": '<path d="M2.5 12h4.2l2-4.5 3 9 2.4-6.5 1.4 2H21.5"/>',
    "district-ai-safety": '<path d="M12 2.8 19.5 5.6v6c0 4.4-3.2 8-7.5 9.6-4.3-1.6-7.5-5.2-7.5-9.6v-6z"/><circle cx="12" cy="11.5" r="2.4"/>',
    "district-research": '<circle cx="6" cy="17" r="1.5"/><circle cx="10" cy="11" r="1.5"/><circle cx="15" cy="14" r="1.5"/><circle cx="18.5" cy="6.5" r="1.5"/><path d="M3 21h18"/>',
    "district-experience": '<path d="M3 15h18"/><circle cx="6" cy="15" r="1.6"/><circle cx="12" cy="15" r="1.6"/><circle cx="18" cy="15" r="1.6"/><path d="M12 13.4V8h6v-3"/>',
    "district-knowledge-hq": '<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="3.5" r="1.4"/><circle cx="20.1" cy="9.4" r="1.4"/><circle cx="7" cy="18.9" r="1.4"/>',
    # modes and actions
    "mode-explore": '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
    "mode-recruiter": '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="11" r="2"/><path d="M5.5 16c.6-1.6 1.7-2.4 3-2.4s2.4.8 3 2.4M14 10h4M14 13.5h3"/>',
    "action-download-cv": '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M12.5 10.5v6M10 14l2.5 2.5L15 14"/>',
    "action-search": '<circle cx="10.5" cy="10.5" r="6"/><path d="m15 15 5 5"/>',
    "action-ask": '<path d="M4 5h16v11H9.5L5 19.5V16H4z"/><path d="M9.5 9.2a2.5 2.5 0 1 1 3.4 2.3c-.6.3-.9.7-.9 1.3M12 14.6v.1"/>',
    "action-skip": '<path d="M5 6v12l9-6zM18 6v12"/>',
    "action-close": '<path d="M6 6l12 12M18 6 6 18"/>',
    "action-arrow": '<path d="M4 12h15M14 7l5 5-5 5"/>',
    "status-evidence": '<path d="M12 3 4.5 6v5.5c0 4.3 3.1 7.9 7.5 9.5 4.4-1.6 7.5-5.2 7.5-9.5V6z"/><path d="m8.8 12.2 2.2 2.2 4.4-4.6"/>',
}


def icons():
    for name, body in ICONS.items():
        content = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" '
                   'stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" '
                   'aria-hidden="true">%s</svg>\n') % body
        emit("icons", "icon-%s.svg" % name, 24, 24, content,
             "UI icon (%s). Inherits colour from CSS via currentColor." % name.replace("-", " "),
             ["UI"], "", False, "Decorative by default; pair with a visible text label.")


# ======================================================================== UI
def ui():
    W, H = 1200, 24
    body = ('<path d="M0 12H520M680 12H1200" stroke="%s" stroke-opacity=".18"/>' % TX +
            orbit(600, 12, 80, 8, 0, G, 1.4, .8, (0, 180), 3) + '<circle cx="600" cy="12" r="3" fill="%s"/>' % TX)
    emit("ui", "divider-orbit.svg", W, H, svg(W, H, body, "Divider", "Hairline divider with a small orbit at its centre."),
         "Section divider.", ["Between major sections"], "", False, "Decorative: alt=\"\".")
    W = H = 96
    body = ('<path d="M2 30V2H30M66 2H94V30M94 66V94H66M30 94H2V66" fill="none" stroke="%s" stroke-width="2"/>' % G)
    emit("ui", "focus-frame.svg", W, H, svg(W, H, body, "Selection frame", "Four corner brackets."),
         "Selection / hover frame for interactive buildings and cards (9-slice).", ["Explore Mode hover", "Cards :focus-visible"],
         "", False, "Used as a border-image; the CSS focus ring remains the accessible indicator.")


# ===================================================================== main
def main():
    if OUT.exists():
        for f in OUT.rglob("*.svg"):
            f.unlink()
    brand(); heroes(); spatial(); district_map(); districts(); covers(); sections(); icons(); ui()
    manifest = {
        "generated_by": "brand/tools/generate_assets.py",
        "tokens": T,
        "fonts": {"display": "Space Grotesk 500/700 (OFL)", "mono": "IBM Plex Mono 400/500 (OFL)", "body": "Inter (OFL) — web font, not used in assets"},
        "rules": [
            "Every asset here is original and code-drawn; none is AI-generated.",
            "No asset depicts a person, a product screen or a measured value.",
            "Project covers carry an ILLUSTRATION tag.",
            "Status is PROPOSED until the owner approves; nothing is wired into the site yet.",
        ],
        "assets": MANIFEST,
    }
    extra = ROOT / "asset-requirements.json"
    if extra.exists():
        manifest.update(json.loads(extra.read_text(encoding="utf-8")))
    (ROOT / "asset-manifest.json").write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    total = sum(a["bytes"] for a in MANIFEST)
    print("generated %d assets, %.1f KB total" % (len(MANIFEST), total / 1024))


if __name__ == "__main__":
    main()
