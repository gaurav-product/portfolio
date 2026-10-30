#!/usr/bin/env python3
"""End-to-end checks for the multi-page site, run against the real build.

    python3 site/scripts/verify.py

Builds docs/, serves a copy over HTTP and drives headless Chromium through
every route at 360, 768 and 1280 px. Set PW_CHROMIUM to a Chromium binary if
Playwright's own browser is not installed.
"""
import asyncio, gzip, json, os, pathlib, re, shutil, subprocess, sys, http.server, threading, functools

HERE = pathlib.Path(__file__).resolve().parent
SITE_DIR = HERE.parent
REPO = SITE_DIR.parent
DOCS = REPO / "docs"
OUT = SITE_DIR / "_preview"

# --- build, then serve a disposable copy (the film tests add a test clip) ----
subprocess.run([sys.executable, str(HERE / "build_site.py"), "--out", str(DOCS)], check=True, stdout=subprocess.DEVNULL)
sys.path.insert(0, str(HERE))
import build_site  # noqa: E402  — the route table and production URL
ROUTES = [r[0] for r in build_site.ROUTES]
SITE = build_site.SITE
if OUT.exists():
    shutil.rmtree(OUT)
shutil.copytree(DOCS, OUT)
# This container's Chromium has no H.264, so the player path runs on a VP9
# clip while the shipped MP4 is checked statically with ffprobe.
subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-f", "lavfi", "-i", "color=c=black:s=640x360:d=5,format=yuv420p",
                "-f", "lavfi", "-i", "sine=frequency=440:duration=5", "-c:v", "libvpx-vp9", "-b:v", "120k", "-deadline", "realtime",
                "-cpu-used", "8", "-c:a", "libopus", "-b:a", "24k", "-shortest", str(OUT / "test-clip.webm")], check=True)


class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass

    def copyfile(self, src, dst):
        try:
            super().copyfile(src, dst)
        except (ConnectionResetError, BrokenPipeError):
            pass


httpd = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(Handler, directory=str(OUT)))
httpd.daemon_threads = True
threading.Thread(target=httpd.serve_forever, daemon=True).start()
BASE = "http://127.0.0.1:%d/" % httpd.server_address[1]

RESULTS = {}


def check(name, ok, detail=""):
    while name in RESULTS:
        name += " ·"
    RESULTS[name] = bool(ok)
    print(("  PASS  " if ok else "  FAIL  ") + name + ((" — " + str(detail)[:240]) if detail and not ok else ""))


OVERFLOW = """() => { const bad = [];
  document.querySelectorAll('body *').forEach(e => { const r = e.getBoundingClientRect();
    if (r.width > 0 && r.right > innerWidth + 1 && getComputedStyle(e).position !== 'fixed' && !e.closest('.sr, .skip'))
      bad.push(e.tagName + '.' + String(e.getAttribute('class') || '').split(' ')[0]); });
  return {sw: document.documentElement.scrollWidth, w: innerWidth, bad: [...new Set(bad)].slice(0, 5)}; }"""

A11Y = """() => {
  const shown = e => e.getClientRects().length > 0 && getComputedStyle(e).visibility !== 'hidden' && !e.closest('.sr');
  const textNodes = [...document.querySelectorAll('body *')].filter(e => shown(e) && !e.closest('svg') &&
      [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()));
  const small = textNodes.filter(e => parseFloat(getComputedStyle(e).fontSize) < 10).map(e => e.tagName + '.' + e.getAttribute('class') + ':' + getComputedStyle(e).fontSize);
  const named = e => (e.textContent.trim() || e.getAttribute('aria-label') || e.getAttribute('aria-labelledby') || e.title);
  const nameless = [...document.querySelectorAll('a[href], button')].filter(e => shown(e) && !named(e)).map(e => e.outerHTML.slice(0, 70));
  const inTree = e => e.getClientRects().length > 0 && getComputedStyle(e).visibility !== 'hidden';  // .sr headings count: screen readers use them
  const heads = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(inTree).map(h => +h.tagName[1]);
  let jump = null; for (let i = 1; i < heads.length; i++) if (heads[i] > heads[i-1] + 1) { jump = heads.slice(Math.max(0,i-2), i+1); break; }
  return {small: small.slice(0, 4), nSmall: small.length, nameless: nameless.slice(0, 3),
          noAlt: document.querySelectorAll('img:not([alt])').length,
          h1: [...document.querySelectorAll('h1')].filter(shown).map(h => h.textContent.trim()),
          firstHeading: heads[0], jump,
          skip: !!document.querySelector('a.skip[href="#main"]') && !!document.querySelector('main#main'),
          lang: document.documentElement.lang}; }"""

LAST_ANSWER = "() => [...document.querySelectorAll('#thread .msg:not(.user)')].pop()"


async def main():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        exe = os.environ.get("PW_CHROMIUM") or ("/opt/pw-browsers/chromium" if pathlib.Path("/opt/pw-browsers/chromium").exists() else None)
        b = await p.chromium.launch(executable_path=exe, args=["--autoplay-policy=no-user-gesture-required"])
        errs = []

        async def page(route, w=1280, h=900, reduced=False, film=None):
            ctx = await b.new_context(viewport={"width": w, "height": h}, reduced_motion="reduce" if reduced else "no-preference")
            pg = await ctx.new_page()
            if film:
                await ctx.add_init_script("""(() => { let _c; Object.defineProperty(window, 'GOS_CONTENT', {configurable: true,
                    get: () => _c, set: (v) => { if (v && v.intro) { v.intro.video = '%s'; } _c = v; }}); })();""" % film)
            pg.errs, pg.reqs = [], []
            pg.on("pageerror", lambda e: pg.errs.append("%s pageerror: %s" % (route, e)))
            pg.on("console", lambda m: pg.errs.append("%s console: %s" % (route, m.text)) if m.type == "error" else None)
            pg.on("response", lambda r: pg.errs.append("HTTP %d %s" % (r.status, r.url)) if r.status >= 400 else None)
            pg.on("request", lambda r: pg.reqs.append(r.url))
            await pg.goto(BASE + route)
            await pg.wait_for_timeout(900)
            return pg

        async def done(pg):
            errs.extend(pg.errs)
            await pg.context.close()

        async def status(pg, path):
            return await pg.evaluate("async (u) => (await fetch(u)).status", BASE + path)

        # ------------------------------------------------------------------
        print("\n=== ROUTES, FILES, METADATA ===")
        rp = await page("")
        for r in ROUTES + ["cv.html", "media/gaurav-kumar-singh-cv.pdf", "media/gaurav-os-poster.jpg", "robots.txt", "sitemap.xml", "404.html"]:
            st = await status(rp, r)
            check("/%s returns 200" % r, st == 200, st)
        check("an unknown path returns 404", await status(rp, "nope/") == 404)
        rp.errs.clear()  # that 404 was asked for
        sm = (DOCS / "sitemap.xml").read_text()
        check("sitemap lists every route and the CV on the production URL",
              re.findall(r"<loc>([^<]+)</loc>", sm) == [SITE + r for r in ROUTES] + [SITE + "cv.html"], sm[:200])
        check("robots.txt points at the sitemap", ("Sitemap: %ssitemap.xml" % SITE) in (DOCS / "robots.txt").read_text())
        check("production URL is https://gaurav-os.lovable.app/", SITE == "https://gaurav-os.lovable.app/", SITE)
        titles, descs = set(), set()
        for r in ROUTES:
            html = (DOCS / r / "index.html").read_text()
            titles.add(re.search(r"<title>(.*?)</title>", html).group(1))
            descs.add(re.search(r'<meta name="description" content="(.*?)">', html).group(1))
            ok = ('<link rel="canonical" href="%s%s">' % (SITE, r) in html and '<meta property="og:url" content="%s%s">' % (SITE, r) in html
                  and '<meta property="og:image" content="%smedia/gaurav-os-poster.jpg">' % SITE in html
                  and '<meta name="twitter:image" content="%smedia/gaurav-os-poster.jpg">' % SITE in html and "github.io" not in html)
            check("/%s: canonical, og:url and absolute preview images on the production URL" % r, ok)
            check("/%s: loads the corpus data only if it is /research" % r, ("corpus.js" in html) == (r == "research/"))
        check("every route has its own title and description", len(titles) == len(ROUTES) and len(descs) == len(ROUTES))
        home = (DOCS / "index.html").read_text()
        ld = json.loads(re.search(r'<script type="application/ld\+json">(.*?)</script>', home, re.S).group(1))
        check("home JSON-LD: production URL, MCA institution, no job title",
              ld.get("url") == SITE and any("Chaudhary Charan Singh" in a["name"] for a in ld["mainEntity"]["alumniOf"])
              and "jobTitle" not in ld["mainEntity"], ld.get("url"))
        check("CV page canonical on the production URL", '<link rel="canonical" href="%scv.html">' % SITE in (DOCS / "cv.html").read_text())
        await done(rp)

        # ------------------------------------------------------------------
        print("\n=== EVERY ROUTE AT 360 / 768 / 1280 ===")
        for w, h in ((360, 800), (768, 1024), (1280, 900)):
            for r in ROUTES:
                pg = await page(r, w, h)
                ov = await pg.evaluate(OVERFLOW)
                a = await pg.evaluate(A11Y)
                tag = "%d /%s" % (w, r)
                check(tag + ": no horizontal overflow", ov["sw"] <= ov["w"] and not ov["bad"], ov)
                check(tag + ": one h1, and it is the first heading", len(a["h1"]) == 1 and a["firstHeading"] == 1, a["h1"])
                check(tag + ": headings never skip a level", a["jump"] is None, a["jump"])
                check(tag + ": no visible text under 10px", a["nSmall"] == 0, a["small"])
                check(tag + ": every visible link and button has a name", not a["nameless"], a["nameless"])
                check(tag + ": alt text, skip link to main, lang=en", a["noAlt"] == 0 and a["skip"] and a["lang"] == "en", a)
                await done(pg)

        # ------------------------------------------------------------------
        print("\n=== LINKS ===")
        lk = await page("")
        seen, bad, ids = set(), [], {}
        for r in ROUTES:
            await lk.goto(BASE + r); await lk.wait_for_timeout(700)
            ids[r] = set(await lk.evaluate("() => [...document.querySelectorAll('[id]')].map(e => e.id)"))
        for r in ROUTES:
            await lk.goto(BASE + r); await lk.wait_for_timeout(600)
            for x in await lk.evaluate("() => [...document.querySelectorAll('a[href]')].map(a => ({h: a.href, raw: a.getAttribute('href')}))"):
                h = x["h"]
                if h.startswith(BASE):
                    path, _, frag = h[len(BASE):].partition("#")
                    path = path.split("?")[0]
                    if (path, frag) in seen:
                        continue
                    seen.add((path, frag))
                    st = await status(lk, path)
                    if st != 200:
                        bad.append((r, x["raw"], st))
                    elif frag and path in ids and frag not in ids[path]:
                        bad.append((r, x["raw"], "missing #" + frag))
                elif not re.match(r"^(mailto:|https://(www\.)?(linkedin\.com|github\.com)/)", h):
                    bad.append((r, x["raw"], "unexpected external link"))
        check("every internal link and #fragment resolves; external links only to LinkedIn and GitHub", not bad, bad[:6])
        check("the link check covered every route", {p for p, _ in seen} >= set(ROUTES), len(seen))
        await done(lk)

        # ------------------------------------------------------------------
        print("\n=== HOMEPAGE ===")
        hp = await page("", 1280, 900)
        H = await hp.evaluate("""() => {
            const t = s => (document.querySelector(s) || {}).textContent;
            return {
              nav: [...document.querySelectorAll('#site-nav a')].map(a => a.textContent.trim()),
              brand: t('.site-head .brand-mark'), mark: t('.hero .os-mark'), h1: t('#hero-name'), title: t('.hero-title'), pos: t('.hero-pos'),
              cta: [...document.querySelectorAll('.hero .cta-row a')].map(a => [a.textContent.trim(), a.getAttribute('href'), a.className]),
              proof: [...document.querySelectorAll('.proof-strip li')].map(l => l.textContent.trim()),
              cards: [...document.querySelectorAll('#selected-work .card2')].map(c => ({h: c.querySelector('h3').textContent,
                  badge: c.querySelector('.badge').textContent, dt: [...c.querySelectorAll('dt')].map(d => d.textContent),
                  link: c.querySelector('a.read').getAttribute('href'), linkText: c.querySelector('a.read').childNodes[0].textContent.trim(),
                  text: c.textContent})),
              lab: [...document.querySelectorAll('#lab-preview .card2')].map(c => ({h: c.querySelector('h3').textContent,
                  badges: [...c.querySelectorAll('.badge')].map(x => x.textContent), dt: [...c.querySelectorAll('dt')].map(d => d.textContent)})),
              labLink: !!document.querySelector('#lab-preview a[href="lab/"]'),
              askQs: [...document.querySelectorAll('.ask-qs a')].map(a => a.textContent.replace(/[\\u201c\\u201d\\u2192]/g, '').trim()),
              askHrefs: [...document.querySelectorAll('.ask-qs a')].map(a => a.getAttribute('href')),
              askOpen: [...document.querySelectorAll('#ask-preview a')].some(a => a.textContent.trim().startsWith('Open Ask Gaurav') && a.getAttribute('href') === 'ask/'),
              aboutLink: !!document.querySelector('#about-preview a[href="about/"]'),
              contact: t('#contact'), cv: !!document.querySelector('#contact a[download][href="media/gaurav-kumar-singh-cv.pdf"]'),
              body: document.body.innerText,
              archive: ['constellation','atlas','evolution','const-canvas','atlas-list','orbit','film-btn'].filter(i => document.getElementById(i)).length +
                       document.querySelectorAll('.cs-row, .const-stage').length}; }""")
        check("navigation: Work, About, Research, Ask Gaurav, Contact", H["nav"] == ["Work", "About", "Research", "Ask Gaurav", "Contact"], H["nav"])
        check("compact GAURAV.OS wordmark in the header", H["brand"] == "GAURAV.OS", H["brand"])
        check("hero: GAURAV.OS, 'Gaurav Kumar Singh', 'AI Product Manager / Product Builder'",
              "GAURAV.OS" in H["mark"] and H["h1"] == "Gaurav Kumar Singh" and H["title"] == "AI Product Manager / Product Builder", [H["mark"], H["title"]])
        check("hero positioning line is exact",
              H["pos"] == "Building safe, measurable AI products from ambiguous healthcare and consumer problems.", H["pos"])
        check("primary CTA 'Explore selected work', secondary 'Ask Gaurav'",
              [c[0] for c in H["cta"]] == ["Explore selected work", "Ask Gaurav"] and "btn-primary" in H["cta"][0][2]
              and H["cta"][0][1] == "#selected-work" and H["cta"][1][1] == "ask/", H["cta"])
        check("proof strip: exactly four truthful statements", H["proof"] == [
            "Healthcare and consumer product experience", "Discovery through delivery",
            "AI product management training with Masai School and IIT Roorkee faculty",
            "Research, analytics, experimentation and safety-focused product thinking"], H["proof"])
        check("selected work: exactly Evamastu, LYBL, CareConnect",
              [c["h"] for c in H["cards"]] == ["Evamastu / Parent Dashboard", "LYBL / Research to Product", "CareConnect"], [c["h"] for c in H["cards"]])
        check("each card: Problem, Product decision, Evidence, and 'Read case study' to its route",
              all(c["dt"] == ["Problem", "Product decision", "Evidence"] and c["linkText"] == "Read case study" for c in H["cards"])
              and [c["link"] for c in H["cards"]] == ["work/evamastu/", "work/lybl/", "work/careconnect/"], [c["link"] for c in H["cards"]])
        check("status badges: shipped / research-led / MVP · NOT IN PRODUCTION",
              [c["badge"] for c in H["cards"]] == ["Shipped product work", "Research-led product work", "MVP · NOT IN PRODUCTION"], [c["badge"] for c in H["cards"]])
        ly = H["cards"][1]["text"]
        check("LYBL card: 30+ interviews and engagement for 500+ users — never '500+ engagement events'",
              "30+" in ly and "500+ users" in ly and "engagement events" not in H["body"], ly[:300])
        check("CareConnect card: 65 tests and 30 journeys", "65" in H["cards"][2]["text"] and "30 end-to-end" in H["cards"][2]["text"], H["cards"][2]["text"][:300])
        check("lab preview: Aaroh, GharGyaan, PhonePe with honest labels",
              [l["h"] for l in H["lab"]] == ["Aaroh", "GharGyaan", "PhonePe Smart Spend Coach"]
              and "MVP" in H["lab"][0]["badges"] and "Safety-focused prototype" in H["lab"][1]["badges"]
              and "Concept" in H["lab"][2]["badges"] and "A/B not run" in H["lab"][2]["badges"], [l["badges"] for l in H["lab"]])
        check("lab preview: evaluation, failure modes, guardrails, measured vs only proposed; links to /lab",
              all(l["dt"] == ["Evaluation", "Failure modes", "Guardrails", "Measured", "Only proposed"] for l in H["lab"]) and H["labLink"])
        check("Ask preview: the three questions and 'Open Ask Gaurav'",
              H["askQs"] == ["How does Gaurav approach AI product discovery?", "Show me a healthcare product case study.",
                             "What does Gaurav know about AI safety and evaluation?"] and H["askOpen"], H["askQs"])
        check("each Ask preview question deep-links into /ask", all(h.startswith("ask/?q=") for h in H["askHrefs"]), H["askHrefs"])
        check("About preview links to /about", H["aboutLink"])
        check("contact: email, LinkedIn, GitHub, New Delhi, CV download",
              all(x in H["contact"] for x in ("gauravkumarsingh773@gmail.com", "linkedin.com/in/gaurav-singh-product", "github.com/gaurav-product", "New Delhi, India")) and H["cv"])
        check("homepage does not contain the research archive", H["archive"] == 0, H["archive"])
        check("homepage does not load the corpus data", not any("corpus" in x for x in hp.reqs), [x for x in hp.reqs if "corpus" in x])
        bullets = await hp.evaluate("() => GOS_CONTENT.experience.flatMap(e => e.bullets)")
        check("homepage does not carry the full résumé", not any(x in H["body"] for x in bullets))
        own = {x[len(BASE):].split("?")[0] or "index.html" for x in hp.reqs if x.startswith(BASE)}
        weight = sum(len(gzip.compress((OUT / f).read_bytes())) for f in own if (OUT / f).is_file())
        check("homepage's own files are under 120 KB gzipped", weight < 120 * 1024, "%d KB: %s" % (weight // 1024, sorted(own)))
        check("homepage never fetches the film", not any(x.endswith(".mp4") for x in hp.reqs))
        sv = await hp.evaluate("""() => { const f = document.querySelector('.sysviz'), svg = f.querySelector('svg');
            return {role: svg.getAttribute('role'), title: !!svg.querySelector('title'), desc: !!svg.querySelector('desc'),
                    labels: [...f.querySelectorAll('.sv-label')].map(b => b.textContent.trim()), note: /not live data/i.test(f.textContent),
                    paused: svg.animationsPaused()}; }""")
        check("system visual: labelled image, says 'not live data', Discovery/Evaluation/Safety/Outcomes",
              sv["role"] == "img" and sv["title"] and sv["desc"] and sv["note"] and sv["labels"] == ["Discovery", "Evaluation", "Safety", "Outcomes"], sv)
        check("system visual animates when motion is allowed", sv["paused"] is False)
        await hp.evaluate("() => document.querySelector('.sv-label[data-node=\"safety\"]').click()")
        st = await hp.evaluate("""() => ({p: document.querySelector('.sv-label[data-node="safety"]').getAttribute('aria-pressed'),
            cap: document.getElementById('sv-caption').textContent, on: document.getElementById('svn-safety').classList.contains('on')})""")
        check("selecting a node explains and highlights it", st["p"] == "true" and st["cap"].startswith("Safety") and st["on"], st)
        await done(hp)
        rm = await page("", 1280, 900, reduced=True)
        r1 = await rm.evaluate("""() => ({paused: document.querySelector('.sysviz svg').animationsPaused(),
            on: [...document.querySelectorAll('.sysviz .sv-state.on')].map(s => s.id),
            tr: getComputedStyle(document.querySelector('.btn')).transitionDuration, sb: getComputedStyle(document.documentElement).scrollBehavior})""")
        await rm.wait_for_timeout(2700)
        on2 = await rm.evaluate("() => [...document.querySelectorAll('.sysviz .sv-state.on')].map(s => s.id)")
        check("reduced motion: visual paused, states still, no transitions, no smooth scroll",
              r1["paused"] and r1["on"] == on2 and r1["sb"] != "smooth" and all(float(x.rstrip("s")) < 0.01 for x in r1["tr"].split(",")), r1)
        await done(rm)
        for w, h in ((1280, 800), (768, 1024), (360, 800)):
            fs = await page("", w, h)
            g = await fs.evaluate("() => ['#hero-name', '.hero-pos', '.hero .cta-row'].map(s => document.querySelector(s).getBoundingClientRect().bottom)")
            check("%d: name, positioning and both CTAs in the first screen" % w, all(v <= h for v in g), g)
            await done(fs)

        # ------------------------------------------------------------------
        print("\n=== KEYBOARD & MOBILE NAV ===")
        kb = await page("", 1280, 900)
        await kb.keyboard.press("Tab")
        check("first Tab lands on the skip link", await kb.evaluate("() => document.activeElement.classList.contains('skip')"))
        await kb.keyboard.press("Enter"); await kb.wait_for_timeout(200)
        check("skip link moves focus to main", await kb.evaluate("() => document.activeElement.id === 'main'"))
        await kb.keyboard.press("Tab")
        ring = await kb.evaluate("""() => { const a = document.activeElement, c = getComputedStyle(a);
            return {fv: a.matches(':focus-visible'), style: c.outlineStyle, w: c.outlineWidth, tag: a.tagName, txt: a.textContent.slice(0, 30)}; }""")
        check("keyboard focus is visible", ring["fv"] and ring["style"] != "none" and ring["w"] not in ("0px", ""), ring)
        await done(kb)
        mb = await page("", 360, 800)
        nav = "() => ({exp: document.getElementById('menu-btn').getAttribute('aria-expanded'), shown: getComputedStyle(document.getElementById('site-nav')).display, focus: document.activeElement.id})"
        m0 = await mb.evaluate(nav)
        await mb.focus("#menu-btn"); await mb.keyboard.press("Enter"); await mb.wait_for_timeout(150)
        m1 = await mb.evaluate(nav)
        await mb.keyboard.press("Escape"); await mb.wait_for_timeout(150)
        m2 = await mb.evaluate(nav)
        check("360: menu starts closed, opens from the keyboard, Escape closes it and returns focus",
              m0["exp"] == "false" and m0["shown"] == "none" and m1["exp"] == "true" and m1["shown"] != "none"
              and m2["exp"] == "false" and m2["shown"] == "none" and m2["focus"] == "menu-btn", [m0, m1, m2])
        m3 = await page("", 1280, 900)
        check("1280: nav shown with no menu button", await m3.evaluate("() => getComputedStyle(document.getElementById('menu-btn')).display === 'none' && getComputedStyle(document.getElementById('site-nav')).display !== 'none'"))
        await done(m3); await done(mb)

        # ------------------------------------------------------------------
        print("\n=== CASE STUDIES ===")
        SECS = ["Context", "User / problem", "Constraints", "My role", "Key product decisions", "AI / system behaviour",
                "Measurement", "Failure modes & trade-offs", "Outcome", "What I would do next"]
        for route, stat in (("evamastu", "Shipped product work"), ("lybl", "Research-led product work"), ("careconnect", "MVP · NOT IN PRODUCTION")):
            cp = await page("work/%s/" % route)
            c = await cp.evaluate("""() => ({secs: [...document.querySelectorAll('.cs-sec h2')].map(h => h.childNodes[1].textContent.trim()),
                toc: [...document.querySelectorAll('.toc a')].every(a => document.querySelector(a.getAttribute('href'))),
                kicker: document.querySelector('.page-kicker').textContent, text: document.querySelector('article').innerText,
                props: [...document.querySelectorAll('.cs-sec h2 .tag.prop')].map(t => t.closest('h2').childNodes[1].textContent.trim()),
                cur: (document.querySelector('#site-nav a[aria-current="page"]') || {}).textContent})""")
            check("%s: the ten sections, in order" % route, c["secs"] == SECS, c["secs"])
            check("%s: contents links resolve; Work marked current" % route, c["toc"] and c["cur"] == "Work", c["cur"])
            check("%s: status '%s'" % (route, stat), stat in c["kicker"], c["kicker"])
            check("%s: only a forward-looking section is tagged Proposal" % route, set(c["props"]) <= {"What I would do next"}, c["props"])
            if route == "careconnect":
                check("CareConnect never called shipped, live or in production",
                      not re.search(r"(?i)\b(shipped|is live|went live|launched|in production)\b", c["text"].replace("NOT IN PRODUCTION", "").replace("not in production", "")), "")
            if route == "lybl":
                check("LYBL case: engagement for 500+ users, not 500+ events", "500+ users" in c["text"] and "engagement events" not in c["text"])
            await done(cp)

        # ------------------------------------------------------------------
        print("\n=== AI PRODUCT LAB ===")
        lb = await page("lab/")
        L = await lb.evaluate("""() => [...document.querySelectorAll('.lab-entry[id]')].filter(s => s.id !== 'corpus').map(s => ({id: s.id,
            badges: [...s.querySelectorAll('.lab-entry-head .badge')].map(b => b.textContent), dims: [...s.querySelectorAll('.lab-dim h3')].map(h => h.textContent),
            mvp: [...s.querySelectorAll('.mvp-box h3')].map(h => h.textContent), text: s.innerText}))""")
        check("lab: Aaroh, GharGyaan, PhonePe, Nexus", [x["id"] for x in L] == ["aaroh", "ghargyaan", "phonepe", "nexus"], [x["id"] for x in L])
        check("every entry: evaluation design, failure modes, guardrails, user research, trade-offs, measured vs proposed",
              all(x["dims"] == ["Evaluation design", "Failure modes", "Guardrails", "User research", "Trade-offs"]
                  and x["mvp"] == ["Measured", "Only proposed / not measured"] for x in L))
        E = {x["id"]: x for x in L}
        check("Aaroh: MVP · Strategy reset · Zero live users", E["aaroh"]["badges"] == ["MVP", "Strategy reset", "Zero live users"], E["aaroh"]["badges"])
        check("GharGyaan: Safety-focused prototype · Not live; 21 categories; 214-case suite",
              E["ghargyaan"]["badges"] == ["Safety-focused prototype", "Not live"] and "21 emergency categories" in E["ghargyaan"]["text"]
              and "214-case" in E["ghargyaan"]["text"], E["ghargyaan"]["badges"])
        check("PhonePe: Concept · A/B not run; the test is described as designed",
              E["phonepe"]["badges"] == ["Concept", "A/B not run"] and "A/B test designed" in E["phonepe"]["text"], E["phonepe"]["badges"])
        check("Nexus: MVP · Demo mode · Not live", E["nexus"]["badges"] == ["MVP", "Demo mode", "Not live"], E["nexus"]["badges"])
        content = json.dumps(await lb.evaluate("() => GOS_CONTENT"))
        check("nowhere says the PhonePe A/B test ran", not re.search(r"A/B (test )?ran|test ran for", content))
        unf = [x["id"] for x in L if re.search(r"(?i)\b(shipped|completed?|launched|is live|went live|in production)\b",
                                                re.sub(r"(?i)not live|zero live users|not in production", "", x["text"]))]
        check("no lab entry called shipped, completed, live or in production", not unf, unf)
        await lb.evaluate("() => document.querySelector('#more-aaroh summary').click()"); await lb.wait_for_timeout(200)
        check("a lab entry's full record opens", await lb.evaluate("() => document.getElementById('more-aaroh').open && !!document.querySelector('#more-aaroh .case')"))
        await lb.goto(BASE + "lab/#phonepe"); await lb.wait_for_timeout(900)
        check("lab/#phonepe lands on the PhonePe entry", await lb.evaluate("() => Math.abs(document.getElementById('phonepe').getBoundingClientRect().top) < 160"))
        await done(lb)

        # ------------------------------------------------------------------
        print("\n=== ABOUT ===")
        ab = await page("about/")
        A = await ab.evaluate("""() => ({edu: document.getElementById('education').innerText, exp: document.getElementById('experience').textContent,
            cert: document.getElementById('certifications').innerText, all: document.body.innerText,
            cv: !!document.querySelector('a[download][href="../media/gaurav-kumar-singh-cv.pdf"]')})""")
        check("/about shows 'MCA — Chaudhary Charan Singh University, Meerut' and 2022–2024",
              "MCA — Chaudhary Charan Singh University, Meerut" in A["edu"] and "2022–2024" in A["edu"], A["edu"][:300])
        check("/about shows 'AI-Enabled Product Management Program — Masai School and IIT Roorkee faculty'",
              "AI-Enabled Product Management Program — Masai School and IIT Roorkee faculty" in A["edu"])
        check("/about keeps the M.Sc. and B.Sc.", "M.Sc. — S-VYASA University, Bengaluru" in A["edu"] and "B.Sc. — University of Patanjali, Haridwar" in A["edu"])
        check("every experience bullet is on /about verbatim", all(x in A["exp"] for x in bullets))
        check("credentials keep their documented wording",
              all(x in A["cert"] for x in ("Claude Developer Platform", "Model Context Protocol", "Claude Code")), A["cert"][:200])
        check("/about offers the CV download", A["cv"])
        await done(ab)

        # ------------------------------------------------------------------
        print("\n=== CONTACT ===")
        ct = await page("contact/")
        T = await ct.evaluate("() => ({t: document.querySelector('main').textContent, cv: !!document.querySelector('main a[download]')})")
        check("/contact: email, LinkedIn, GitHub, New Delhi, CV download",
              all(x in T["t"] for x in ("gauravkumarsingh773@gmail.com", "LinkedIn", "GitHub", "New Delhi")) and T["cv"])
        await done(ct)

        # ------------------------------------------------------------------
        print("\n=== RESEARCH ARCHIVE ===")
        rs = await page("research/", 1280, 1000)
        await rs.wait_for_timeout(800)
        K = await rs.evaluate("() => window.GOS_CORPUS.counts")
        check("corpus counts are consistent", K["directories"] == 90 and K["written"] + K["empty"] == K["directories"], K)
        painted = await rs.evaluate("""() => { const c = document.getElementById('const-canvas'); if (!c) return 0;
            const x = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 3; i < x.length; i += 4) if (x[i] > 0) n++; return n; }""")
        check("constellation renders", painted > 4000, painted)
        await rs.fill("#atlas-q", "prd"); await rs.wait_for_timeout(300)
        check("Product Atlas search returns studies", await rs.evaluate("() => document.querySelectorAll('#atlas-list .cs-row').length") > 0)
        await rs.fill("#atlas-q", ""); await rs.wait_for_timeout(200)
        check("How I Think, challenges, lab notes and the film all live on /research",
              await rs.evaluate("() => ['thinking','challenge','lab','film','orbit','film-btn'].every(i => document.getElementById(i))"))
        await rs.evaluate("() => document.querySelector('#atlas-list .cs-row').focus()")
        await rs.keyboard.press("Enter"); await rs.wait_for_timeout(400)
        links = await rs.evaluate("() => [...document.querySelectorAll('.cs-panel a')].map(a => a.href)")
        check("a study opens from the keyboard and links to its GitHub source",
              len(links) >= 1 and all(l.startswith("https://github.com/gaurav-product/") for l in links), links[:3])
        await rs.keyboard.press("Escape"); await rs.wait_for_timeout(300)
        check("Escape closes the study", await rs.evaluate("() => !document.querySelector('.cs-panel')"))
        check("the film is not fetched until asked for", not any(x.endswith(".mp4") for x in rs.reqs))
        await done(rs)
        fp = await page("research/", 1280, 900, film="../test-clip.webm")
        await fp.focus("#film-btn"); await fp.keyboard.press("Enter"); await fp.wait_for_timeout(1500)
        f = await fp.evaluate("""() => { const v = document.querySelector('.intro video');
            return v ? {muted: v.muted, t: v.currentTime, inDialog: !!document.activeElement.closest('.intro')} : null; }""")
        check("the film opens on request, muted, with focus inside it", f and f["muted"] and f["t"] > 0 and f["inDialog"], f)
        await fp.keyboard.press("Escape"); await fp.wait_for_timeout(900)
        check("Escape closes the film and returns focus to its button",
              await fp.evaluate("() => !document.querySelector('.intro') && document.activeElement.id === 'film-btn'"))
        await done(fp)
        mp4 = DOCS / "media" / "gaurav-os-intro.mp4"
        meta = json.loads(subprocess.run(["ffprobe", "-v", "error", "-print_format", "json", "-show_streams", "-show_format", str(mp4)],
                                         capture_output=True, text=True).stdout)
        vs = [x for x in meta["streams"] if x["codec_type"] == "video"][0]
        check("shipped film: H.264 1920×1080, under 15 MB", vs["codec_name"] == "h264" and vs["width"] == 1920 and mp4.stat().st_size < 15 * 2**20)

        # ------------------------------------------------------------------
        print("\n=== ASK GAURAV (no API key) ===")
        ag = await page("ask/", 1280, 900)
        sugg = await ag.evaluate("() => [...document.querySelectorAll('#prompts button')].map(b => b.textContent.trim())")
        check("the homepage's three questions lead the suggestions", sugg[:3] == H["askQs"], sugg[:3])
        off_site = []
        ag.on("request", lambda r: off_site.append(r.url) if not r.url.startswith(BASE) and "fonts.g" not in r.url else None)
        for i in range(len(sugg)):
            await ag.evaluate("(i) => document.querySelectorAll('#prompts button')[i].click()", i)
            await ag.wait_for_function("() => !document.querySelector('#thread .typing')", timeout=6000)
            last = await ag.evaluate("() => { const m = (%s)(); return {dt: [...m.querySelectorAll('dl.answer dt')].map(d => d.textContent.trim()), src: [...m.querySelectorAll('.src-row a')].map(a => a.getAttribute('href'))}; }" % LAST_ANSWER)
            check("'%s' → ROLE, WORK, EVIDENCE, STATUS with sources" % sugg[i][:44],
                  [d.upper() for d in last["dt"]] == ["ROLE", "WORK", "EVIDENCE", "STATUS"] and last["src"], last)
        for q in ("What is Gaurav's favourite programming language?", "How much revenue does Aaroh make?"):
            await ag.fill("#ask-input", q); await ag.press("#ask-input", "Enter")
            await ag.wait_for_function("() => !document.querySelector('#thread .typing')", timeout=6000)
            t = await ag.evaluate("() => (%s)().textContent" % LAST_ANSWER)
            check("undocumented question refused, not inferred: " + q[:42], "isn't documented" in t and not await ag.evaluate("() => !!(%s)().querySelector('dl.answer')" % LAST_ANSWER), t[:100])
        await ag.fill("#ask-input", "x" * 1000)
        check("question input is length-limited", len(await ag.input_value("#ask-input")) <= 300)
        await ag.fill("#ask-input", "tell me about the 90 day challenge"); await ag.press("#ask-input", "Enter")
        await ag.wait_for_function("() => !document.querySelector('#thread .typing')", timeout=6000)
        t = await ag.evaluate("() => (%s)().textContent" % LAST_ANSWER)
        check("answers resolve corpus figures, never {{tokens}}", "{{" not in t and "90" in t, t[:100])
        check("answering made no request off the site (no API, no key)", not off_site, off_site[:3])
        await done(ag)
        dq = await page("ask/?q=kb-healthcare-case")
        await dq.wait_for_function("() => !document.querySelector('#thread .typing') && document.querySelectorAll('#thread .msg:not(.user)').length >= 1", timeout=6000)
        check("a homepage question opens /ask with its answer", "Evamastu" in await dq.evaluate("() => (%s)().textContent" % LAST_ANSWER))
        await done(dq)
        shipped = "".join((DOCS / f).read_text() for f in ("app.js", "content.js"))
        check("no API key, API endpoint or model provider in the shipped code",
              not re.search(r"(sk-[A-Za-z0-9]{10,}|api[_-]?key|anthropic\.com|openai\.com|/v1/messages)", shipped, re.I))

        # ------------------------------------------------------------------
        print("\n=== CV & PRIVACY ===")
        pdf = DOCS / "media" / "gaurav-kumar-singh-cv.pdf"
        info = subprocess.run(["pdfinfo", str(pdf)], capture_output=True, text=True).stdout
        txt = subprocess.run(["pdftotext", str(pdf), "-"], capture_output=True, text=True).stdout
        check("CV PDF is two pages", re.search(r"Pages:\s+2\b", info), info)
        check("CV PDF carries the MCA entry, no phone", "Chaudhary Charan Singh University, Meerut" in txt and "81275" not in txt)
        cvp = await page("cv.html", 390, 844)
        cvt = await cvp.evaluate("() => document.body.innerText")
        check("cv.html: MCA entry, no phone", "MCA — Chaudhary Charan Singh University, Meerut" in cvt and "2022–2024" in cvt and "81275" not in cvt)
        await done(cvp)
        leaked = [str(f.relative_to(DOCS)) for f in DOCS.rglob("*") if f.is_file() and f.suffix in (".html", ".js", ".css", ".xml", ".txt")
                  and re.search(r"81275|12340", f.read_text(errors="ignore"))]
        check("no phone number anywhere in the build", not leaked, leaked)

        # ------------------------------------------------------------------
        print("\n=== CONTRAST ===")
        cpg = await page("")
        con = await cpg.evaluate("""() => {
            const L = c => { const m = c.match(/[\\d.]+/g).slice(0, 3).map(Number).map(v => v / 255).map(v => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
                return 0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2]; };
            const cr = (a, b) => { const x = L(a), y = L(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
            const v = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
            const rgb = h => { const d = document.createElement('i'); d.style.color = h; document.body.appendChild(d); const c = getComputedStyle(d).color; d.remove(); return c; };
            const out = [];
            for (const fg of ['--fg','--fg-2','--fg-muted','--fg-dim','--accent','--accent-2','--ok','--warn'])
              for (const bg of ['--bg','--surface','--surface-2','--raise']) out.push([fg, bg, +cr(rgb(v(fg)), rgb(v(bg))).toFixed(2)]);
            for (const fg of ['--on-graphite','--on-graphite-muted','--on-graphite-accent']) out.push([fg, '--graphite', +cr(rgb(v(fg)), rgb(v('--graphite'))).toFixed(2)]);
            out.push(['#fff', '--accent', +cr('rgb(255, 255, 255)', rgb(v('--accent'))).toFixed(2)]);
            return out; }""")
        low = [c for c in con if c[2] < 4.5]
        check("every text colour token meets WCAG AA 4.5:1 on its surfaces", not low, low)
        await done(cpg)

        check("no console errors, page errors or failed requests on any page", not errs, errs[:5])
        await b.close()
    httpd.shutdown()
    shutil.rmtree(OUT, ignore_errors=True)
    print("\n" + "=" * 46)
    failed = [k for k, v in RESULTS.items() if not v]
    print("PASSED %d / %d" % (len(RESULTS) - len(failed), len(RESULTS)))
    if failed:
        print("FAILING:\n  " + "\n  ".join(failed))
    sys.exit(1 if failed else 0)


asyncio.run(main())
