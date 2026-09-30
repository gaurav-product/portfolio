import asyncio, pathlib, json
from playwright.async_api import async_playwright

SRC = pathlib.Path(__file__).resolve().parent.parent   # repo root (scripts/ lives under it)
if not (SRC / "index.html").exists():                   # dev checkout layout
    SRC = pathlib.Path(__file__).resolve().parent
OUT = SRC / "_preview"
OUT.mkdir(exist_ok=True)

frag = (SRC / "index.html").read_text()
html = ("<!doctype html><html><head><meta charset='utf-8'>"
        "<meta name='viewport' content='width=device-width,initial-scale=1,viewport-fit=cover'>"
        "<style>:root{color-scheme:light}body{margin:0;font:14px system-ui}"
        "img{max-width:100%}[hidden]{display:none!important}</style>" + frag + "</body></html>")
(OUT / "index.html").write_text(html)
for f in ("content.js", "app.js", "corpus.js", "corpus-ui.js"):
    (OUT / f).write_text((SRC / f).read_text())
import shutil
MEDIA = SRC / "media"
if not (MEDIA / "gaurav-os-intro.mp4").exists():      # binaries live in the build output
    MEDIA = SRC.parent / "docs" / "media"
shutil.copytree(MEDIA, OUT / "media", dirs_exist_ok=True)
# the harness server has no favicon; the artifact platform serves its own.
(OUT / "favicon.ico").write_bytes(b"\x00\x00\x01\x00\x00\x00")

# A short decodable clip. This container's Chrome is Chrome-for-Testing and
# ships without H.264/AAC, so the *player path* is exercised with VP9 while the
# shipped MP4 is verified statically (codec, size, dimensions, faststart).
def _make_fixture():
    f = OUT / "test-clip.webm"
    if f.exists():
        return
    import subprocess
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
                    "-f", "lavfi", "-i", "color=c=black:s=640x360:d=5,format=yuv420p",
                    "-f", "lavfi", "-i", "sine=frequency=440:duration=5",
                    "-c:v", "libvpx-vp9", "-b:v", "120k", "-deadline", "realtime",
                    "-cpu-used", "8", "-c:a", "libopus", "-b:a", "24k",
                    "-shortest", str(f)], check=True)
_make_fixture()

# serve over HTTP: Chrome will not range-request media from a file:// URL,
# and HTTP is how the artifact is actually served.
import http.server, threading
class _Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=str(OUT), **k)
    def log_message(self, *a):
        pass
    def handle_one_request(self):
        try:
            super().handle_one_request()
        except (ConnectionResetError, BrokenPipeError):
            self.close_connection = True
    def copyfile(self, src, dst):
        try:
            super().copyfile(src, dst)
        except (ConnectionResetError, BrokenPipeError):
            pass
class _Server(http.server.ThreadingHTTPServer):
    allow_reuse_address = True
    daemon_threads = True
_httpd = _Server(("127.0.0.1", 0), _Handler)
_PORT = _httpd.server_address[1]
threading.Thread(target=_httpd.serve_forever, daemon=True).start()
URL = "http://127.0.0.1:%d/index.html" % _PORT
PROBE = """() => {
  const bad = [];
  document.querySelectorAll('*').forEach(e => {
    const r = e.getBoundingClientRect();
    if (r.width > 0 && r.right > window.innerWidth + 1)
      bad.push((e.tagName + '.' + ((typeof e.className==='string'?e.className:'')||'').split(' ')[0]));
  });
  return [document.documentElement.scrollWidth, window.innerWidth, [...new Set(bad)].slice(0,6)];
}"""

RESULTS = {}
def check(name, ok, detail=""):
    RESULTS[name] = ok
    print(("  PASS  " if ok else "  FAIL  ") + name + ((" — " + str(detail)) if detail else ""))

async def main():
    async with async_playwright() as p:
        # real Chrome: the bundled Chromium has no H.264/AAC, so the film
        # could not be exercised on it. Fall back if Chrome is absent.
        try:
            b = await p.chromium.launch(channel="chrome", args=["--autoplay-policy=no-user-gesture-required"])
            print("browser: Google Chrome channel")
        except Exception:
            b = await p.chromium.launch()
            print("browser: bundled Chromium (no H.264 — film checks will not be meaningful)")
        errs = []

        async def page(w, h, skip_intro=True, reduced=False, film=None, quiet=False):
            ctx = await b.new_context(viewport={"width": w, "height": h},
                                      reduced_motion="reduce" if reduced else "no-preference")
            pg = await ctx.new_page()
            if film:
                # patch the content layer as it is assigned, so the override
                # survives reloads (this Chrome cannot decode H.264)
                await ctx.add_init_script("""(() => { let _c;
                    Object.defineProperty(window, 'GOS_CONTENT', {configurable: true,
                      get: () => _c,
                      set: (v) => { if (v && v.intro) { v.intro.video = '%s'; v.intro.duration = 3; } _c = v; }});
                })();""" % film)
            if not quiet:   # the failure-path page aborts a request on purpose
                pg.on("pageerror", lambda e: errs.append(f"{w}px pageerror: {e}"))
                pg.on("console", lambda m: errs.append(f"{w}px console.error: {m.text}") if m.type == "error" else None)
                pg.on("response", lambda r: errs.append(f"{w}px HTTP {r.status}: {r.url}") if r.status >= 400 else None)
            await pg.goto(URL)
            # file:// shares one localStorage across contexts in Chrome, so the
            # first-visit flag must be set or cleared explicitly per test.
            if skip_intro:
                await pg.evaluate("()=>{try{localStorage.setItem('gos-intro-seen','1')}catch(e){}}")
            else:
                await pg.evaluate("()=>{try{localStorage.removeItem('gos-intro-seen')}catch(e){}}")
            await pg.reload()
            await pg.wait_for_timeout(2500)
            return pg

        print("\n=== DESKTOP 1280 ===")
        d = await page(1280, 1000)
        await d.screenshot(path=str(OUT / "d-home.png"))

        # corpus counts rendered from the repo
        counts = await d.evaluate("() => window.GOS_CORPUS.counts")
        check("corpus loaded: 90 dirs / 89 written", counts["directories"] == 90 and counts["written"] == 89, counts)
        check("Day 90 present", await d.evaluate("() => window.GOS_CORPUS.studies.some(s=>s.day===90)"))
        check("Day 74 flagged empty", await d.evaluate("() => window.GOS_CORPUS.studies.find(s=>s.day===74).empty === true"))

        ov = await d.evaluate(PROBE)
        check("1280 no horizontal overflow", ov[0] <= ov[1], ov)

        # constellation drew
        await d.evaluate("document.getElementById('constellation').scrollIntoView()")
        await d.wait_for_timeout(1200)
        painted = await d.evaluate("""() => { const c=document.getElementById('const-canvas');
            const x=c.getContext('2d').getImageData(0,0,c.width,c.height).data;
            let n=0; for(let i=3;i<x.length;i+=4) if(x[i]>0) n++; return n; }""")
        check("constellation rendered pixels", painted > 4000, painted)
        await d.screenshot(path=str(OUT / "d-constellation.png"))

        # constellation click opens a study with both links
        box = await d.evaluate("""() => { const p=document.getElementById('const-stage').getBoundingClientRect();
            return {x:p.left+p.width/2, y:p.top+p.height/2}; }""")
        # click a known node via the atlas instead (deterministic)
        await d.evaluate("document.getElementById('atlas').scrollIntoView()")
        await d.wait_for_timeout(600)
        await d.evaluate("document.querySelector('.cs-row').click()")
        await d.wait_for_timeout(500)
        links = await d.evaluate("""() => [...document.querySelectorAll('.cs-links a')].map(a=>a.getAttribute('href'))""")
        check("study panel links all resolve to GitHub", len(links) >= 2 and all(l.startswith("https://github.com/") for l in links), len(links))
        await d.screenshot(path=str(OUT / "d-study.png"))
        await d.keyboard.press("Escape")

        # atlas search + filters
        await d.fill("#atlas-q", "PRD")
        await d.wait_for_timeout(400)
        n_prd = await d.evaluate("() => document.querySelectorAll('.cs-row').length")
        cnt = await d.inner_text("#atlas-count")
        check("atlas search returns rows", n_prd > 0, cnt)
        await d.fill("#atlas-q", "")
        await d.evaluate("""() => [...document.querySelectorAll('#f-cat button')].find(b=>b.textContent.startsWith('HEALTHCARE')).click()""")
        await d.wait_for_timeout(400)
        check("sector filter works", "24 OF 90" in await d.inner_text("#atlas-count"), await d.inner_text("#atlas-count"))
        await d.evaluate("""() => [...document.querySelectorAll('#f-cat button')].find(b=>b.textContent==='ALL').click()""")
        await d.evaluate("""() => [...document.querySelectorAll('#f-day button')].find(b=>b.textContent.includes('61')).click()""")
        await d.wait_for_timeout(350)
        check("day-range filter works", "30 OF 90" in await d.inner_text("#atlas-count"), await d.inner_text("#atlas-count"))
        await d.evaluate("""() => [...document.querySelectorAll('#f-day button')].find(b=>b.textContent==='ALL').click()""")
        await d.evaluate("""() => [...document.querySelectorAll('#f-comp button')].find(b=>b.textContent.includes('MISSING')).click()""")
        await d.wait_for_timeout(350)
        check("completeness filter isolates the empty study", "1 OF 90" in await d.inner_text("#atlas-count"), await d.inner_text("#atlas-count"))
        await d.evaluate("""() => [...document.querySelectorAll('#f-comp button')].find(b=>b.textContent==='ALL').click()""")
        await d.screenshot(path=str(OUT / "d-atlas.png"))
        await d.evaluate("""() => [...document.querySelectorAll('#f-cat button')].find(b=>b.textContent==='ALL').click()""")

        # evolution
        await d.evaluate("document.getElementById('evolution').scrollIntoView()")
        await d.wait_for_timeout(600)
        check("evolution charts rendered", await d.evaluate("() => document.querySelectorAll('.viz .brow').length") >= 36)
        await d.screenshot(path=str(OUT / "d-evolution.png"))

        # capability graph
        await d.evaluate("document.getElementById('thinking').scrollIntoView()")
        await d.wait_for_timeout(600)
        check("capability graph rendered", await d.evaluate("() => document.querySelectorAll('.cap').length") == 13)
        check("operating model has 8 stages", await d.evaluate("() => document.querySelectorAll('.mstep').length") == 8)
        check("stage exemplars are distinct",
              await d.evaluate("""() => { const s=window.GOS_CORPUS.stages.map(x=>x.studies.map(y=>y.day).join());
                return new Set(s).size === s.length; }"""))
        check("validation flags computed", await d.evaluate("() => Object.keys(window.GOS_CORPUS.validation_summary).length") >= 5)
        check("completeness status present", await d.evaluate("() => window.GOS_CORPUS.completeness_counts.MISSING === 1"))
        await d.screenshot(path=str(OUT / "d-method.png"))

        # copilot: must refuse, must not topic-match into a company answer
        await d.evaluate("document.getElementById('ask').scrollIntoView()")
        await d.fill("#ask-input", "what is Stripe's revenue")
        await d.click(".ask-send")
        await d.wait_for_timeout(1900)
        t = await d.inner_text("#thread")
        check("copilot refuses revenue question", "don't have enough portfolio evidence" in t)
        check("copilot did not answer with a company figure", "billion" not in t.lower() and "$" not in t)
        await d.fill("#ask-input", "tell me about the 90 day challenge")
        await d.click(".ask-send")
        await d.wait_for_timeout(1900)
        t2 = await d.inner_text("#thread")
        check("copilot answers corpus question with sources", "89" in t2 and "SOURCE:" in t2)
        await d.screenshot(path=str(OUT / "d-ask.png"))

        # day-by-day navigation inside a study
        await d.evaluate("document.querySelector('.cs-row').click()")
        await d.wait_for_timeout(400)
        d1 = await d.inner_text(".cs-inner h3")
        await d.evaluate("document.getElementById('cs-next').click()")
        await d.wait_for_timeout(400)
        d2 = await d.inner_text(".cs-inner h3")
        check("day-by-day navigation moves between studies", d1 != d2, d1 + " -> " + d2)
        await d.keyboard.press("ArrowRight")
        await d.wait_for_timeout(350)
        d3 = await d.inner_text(".cs-inner h3")
        check("arrow keys drive day navigation", d3 != d2, d2 + " -> " + d3)
        await d.keyboard.press("Escape")
        await d.wait_for_timeout(300)

        # completeness filter isolates the missing study
        await d.evaluate("""() => [...document.querySelectorAll('#f-comp button')].find(b=>b.textContent.indexOf('MISSING')>-1).click()""")
        await d.wait_for_timeout(400)
        check("completeness filter finds exactly the empty study",
              "1 OF 90" in await d.inner_text("#atlas-count"), await d.inner_text("#atlas-count"))
        await d.evaluate("""() => [...document.querySelectorAll('#f-comp button')].find(b=>b.textContent==='ALL').click()""")

        # day band filter
        await d.evaluate("""() => [...document.querySelectorAll('#f-day button')].find(b=>b.textContent.includes('61')).click()""")
        await d.wait_for_timeout(400)
        check("day-range filter works", "30 OF 90" in await d.inner_text("#atlas-count"), await d.inner_text("#atlas-count"))
        await d.evaluate("""() => [...document.querySelectorAll('#f-day button')].find(b=>b.textContent==='ALL').click()""")

        # operating model
        await d.evaluate("document.getElementById('thinking').scrollIntoView()")
        await d.wait_for_timeout(500)
        check("operating model has 8 stages", await d.evaluate("() => document.querySelectorAll('#model button').length") == 8)
        await d.evaluate("() => document.querySelectorAll('#model button')[5].click()")
        await d.wait_for_timeout(300)
        check("stage reveals linked case studies",
              await d.evaluate("() => document.querySelectorAll('.md-s').length") == 3)
        check("per-study check chart rendered",
              await d.evaluate("() => document.querySelectorAll('.spark .sb').length") >= 30)
        await d.screenshot(path=str(OUT / "d-model.png"))

        # keyboard: tab reaches interactive controls and focus is visible
        await d.evaluate("document.getElementById('atlas').scrollIntoView()")
        await d.evaluate("() => document.getElementById('atlas-q').focus()")
        await d.keyboard.press("Tab")
        focused = await d.evaluate("""() => { const a=document.activeElement;
            return a ? a.tagName + '.' + (a.className||'').split(' ')[0] : 'none'; }""")
        check("keyboard reaches the next control", focused != "none" and focused != "BODY.", focused)

        # recruiter mode
        await d.evaluate("document.getElementById('rail-recruiter').click()")
        await d.wait_for_timeout(900)
        ov2 = await d.evaluate(PROBE)
        check("recruiter mode no overflow", ov2[0] <= ov2[1], ov2)
        await d.screenshot(path=str(OUT / "d-recruiter.png"))

        print("\n=== INTRO FILM: the shipped asset (static) ===")
        import subprocess, json as _json
        mp4 = "/home/claude/media/gaurav-os-intro.mp4"
        pr = subprocess.run(["ffprobe", "-v", "error", "-print_format", "json",
                             "-show_streams", "-show_format", mp4], capture_output=True, text=True)
        meta = _json.loads(pr.stdout)
        vs = [x for x in meta["streams"] if x["codec_type"] == "video"][0]
        aus = [x for x in meta["streams"] if x["codec_type"] == "audio"]
        head = open(mp4, "rb").read(500000)
        size_mb = int(meta["format"]["size"]) / 1048576
        check("shipped file is H.264/AAC MP4", vs["codec_name"] == "h264" and aus and aus[0]["codec_name"] == "aac")
        check("1920x1080 preserved, no re-framing", vs["width"] == 1920 and vs["height"] == 1080)
        check("duration intact (65s)", abs(float(meta["format"]["duration"]) - 65.2) < 0.5)
        check("faststart: moov before mdat", 0 < head.find(b"moov") < head.find(b"mdat"))
        check("under the 15 MB per-file limit", size_mb < 15, "%.2f MiB" % size_mb)

        print("\n=== INTRO FILM: player behaviour ===")
        # This container's Chrome is Chrome-for-Testing: no H.264/AAC at all.
        # The player path is therefore exercised with a decodable VP9 clip; the
        # shipped MP4 is verified statically above.
        i = await page(1280, 1000, skip_intro=False, film="test-clip.webm")
        await i.wait_for_timeout(1800)
        check("film autoplays on first visit", await i.evaluate("() => !!document.querySelector('.intro video.film')"))
        st = await i.evaluate("""() => { const v = document.querySelector('.intro video.film');
            return v ? {muted: v.muted, inline: v.playsInline, controls: v.controls,
                        t: v.currentTime, poster: !!v.getAttribute('poster'),
                        fit: getComputedStyle(v).objectFit} : null; }""")
        check("muted + playsinline for autoplay policy", st and st["muted"] and st["inline"], st)
        check("no browser video chrome", st and not st["controls"])
        check("poster attribute set", st and st["poster"])
        check("object-fit cover on a wide viewport", st and st["fit"] == "cover", st and st["fit"])
        check("playback advances", st and st["t"] > 0.1, st and st["t"])
        check("progress line advances",
              await i.evaluate("() => parseFloat((document.querySelector('.film-bar i').style.width||'0')) > 0"))
        check("homepage already rendered beneath the film",
              await i.evaluate("() => !!document.querySelector('#home-mount .hero-mark')"))
        ov = await i.evaluate("""() => ({tl: !!document.querySelector('.ov.tl'), bl: !!document.querySelector('.ov.bl'),
             skip: !!document.querySelector('.ov-skip'), sound: !!document.querySelector('.ov.sound')})""")
        check("overlays: top-left, bottom-left, skip, sound", all(ov.values()), ov)
        io = await i.evaluate(PROBE)
        check("film stage: no horizontal overflow", io[0] <= io[1], io)
        await i.screenshot(path=str(OUT / "film.png"))

        # sound toggle
        await i.evaluate("() => document.querySelector('.ov.sound').click()")
        check("sound can be turned on", await i.evaluate("() => !document.querySelector('.intro video.film').muted"))

        # runs to completion -> holds the final frame -> hands over
        await i.wait_for_timeout(4200)
        check("film ends and hands over to the interface",
              await i.evaluate("() => !document.querySelector('.intro')"))
        check("interface usable after the film",
              await i.evaluate("() => getComputedStyle(document.body).overflow !== 'hidden'"))

        # narrow viewport must not crop the face
        n = await page(390, 844, skip_intro=False, film="test-clip.webm")
        await n.wait_for_timeout(1500)
        nfit = await n.evaluate("""() => { const v=document.querySelector('.intro video.film');
            return v ? getComputedStyle(v).objectFit : null; }""")
        check("narrow viewport uses contain (never crops the face)", nfit == "contain", nfit)
        no = await n.evaluate(PROBE)
        check("390 film: no horizontal overflow", no[0] <= no[1], no)
        await n.screenshot(path=str(OUT / "film-mobile.png"))
        await n.close()

        print("\n=== INTRO FILM: the real MP4 in the player ===")
        # no content override: this is the production asset, loaded by the page.
        rm = await page(1280, 1000, skip_intro=False, quiet=True)
        probe = await rm.evaluate("""() => { const t = document.createElement('video');
            return {avc: t.canPlayType('video/mp4; codecs="avc1.640028"'),
                    aac: t.canPlayType('audio/mp4; codecs="mp4a.40.2"'),
                    src: (window.GOS_CONTENT && GOS_CONTENT.intro) ? GOS_CONTENT.intro.video : null,
                    ev: (window.dataLayer || []).map(function (x) { return x.event; })
                          .filter(function (e) { return /intro/.test(e); })}; }""")
        check("player is pointed at the production MP4",
              probe["src"] == "media/gaurav-os-intro.mp4", probe["src"])
        decodes = probe["avc"] != "" and probe["aac"] != ""
        print("  NOTE  H.264/AAC decode in this container: %s" %
              ("available" if decodes else "NOT available — see the static asset checks above"))
        if decodes:
            await rm.wait_for_timeout(2500)
            st = await rm.evaluate("""() => { const v = document.querySelector('.intro video.film');
                return v ? {ready: v.readyState, t: v.currentTime, w: v.videoWidth, h: v.videoHeight} : null; }""")
            check("real film plays at 1920x1080", bool(st) and st["ready"] >= 2 and st["t"] > 0.1
                  and st["w"] == 1920 and st["h"] == 1080, st)
        else:
            check("undecodable film degrades to the homepage, not a dead screen",
                  "intro_failed" in probe["ev"] and
                  await rm.evaluate("() => !!document.querySelector('#home-mount .hero-mark')"), probe["ev"])
        await rm.close()

        print("\n=== INTRO: skip, replay, return visit ===")
        r2 = await page(1280, 1000, skip_intro=False, film="test-clip.webm")
        await r2.wait_for_timeout(1200)
        await r2.evaluate("document.querySelector('.ov-skip').click()")
        await r2.wait_for_timeout(900)
        check("skip dismisses the film", await r2.evaluate("() => !document.querySelector('.intro')"))
        await r2.reload(); await r2.wait_for_timeout(1800)
        check("returning visitor goes straight to the homepage",
              await r2.evaluate("() => !document.querySelector('.intro')"))
        check("replay control is present and labelled",
              "WATCH INTRO" in await r2.inner_text("#hero-intro"))
        await r2.evaluate("() => document.getElementById('hero-intro').click()")
        await r2.wait_for_timeout(1200)
        check("replay replays the film", await r2.evaluate("() => !!document.querySelector('.intro video.film')"))
        await r2.keyboard.press("Escape")
        await r2.wait_for_timeout(800)
        check("Escape closes the film", await r2.evaluate("() => !document.querySelector('.intro')"))
        await r2.close()

        print("\n=== INTRO: failure path ===")
        e2 = await page(1280, 1000, skip_intro=False, quiet=True)
        await e2.route("**/gaurav-os-intro.mp4", lambda route: route.abort())
        await e2.evaluate("""() => { try{localStorage.removeItem('gos-intro-seen')}catch(e){} }""")
        await e2.reload()
        await e2.wait_for_timeout(3000)
        check("a film that cannot play never leaves a dead element",
              await e2.evaluate("() => !document.querySelector('.intro video.film[data-stuck]')"))
        check("homepage stays usable when the film fails",
              await e2.evaluate("""() => !!document.querySelector('#home-mount .hero-mark')"""))
        await e2.close()

        print("\n=== REDUCED MOTION ===")
        r = await page(1280, 1000, skip_intro=False, reduced=True)
        await r.wait_for_timeout(1500)
        check("reduced motion never autoplays the film",
              await r.evaluate("() => !document.querySelector('.intro video')"))
        check("reduced motion shows the still with a way in",
              await r.evaluate("""() => { const s=document.querySelector('.intro.still');
                  return !!(s && s.querySelector('img.film') && /ENTER/.test(s.textContent)); }"""))
        check("constellation still drawn (static)", await r.evaluate("""() => { const c=document.getElementById('const-canvas'); return c && c.width>0; }"""))

        print("\n=== KEYBOARD ===")
        k = await page(1280, 1000)
        await k.evaluate("document.getElementById('atlas').scrollIntoView()")
        await k.wait_for_timeout(400)
        await k.evaluate("document.querySelector('.cs-row').focus()")
        await k.keyboard.press("Enter")
        await k.wait_for_timeout(500)
        check("Enter opens a case study", await k.evaluate("() => !!document.querySelector('.cs-panel')"))
        await k.keyboard.press("Escape")
        await k.wait_for_timeout(300)
        check("Escape closes it", await k.evaluate("() => !document.querySelector('.cs-panel')"))
        focusable = await k.evaluate("""() => document.querySelectorAll(
            'a[href],button:not([disabled]),input,textarea,[tabindex]:not([tabindex="-1"])').length""")
        check("focusable controls present", focusable > 150, focusable)
        await k.evaluate("document.getElementById('thinking').scrollIntoView()")
        await k.wait_for_timeout(400)
        await k.evaluate("document.querySelector('.mstep').focus()")
        await k.keyboard.press("Enter")
        await k.wait_for_timeout(300)
        check("operating model reachable by keyboard",
              await k.evaluate("() => document.querySelector('.mstep').getAttribute('aria-pressed')==='true'"))

        print("\n=== TABLET / MOBILE ===")
        for w, h, name in ((1440, 900, "xl"), (1024, 900, "l"), (768, 1024, "t"), (390, 844, "m")):
            pg = await page(w, h)
            o = await pg.evaluate(PROBE)
            check(f"{w} no horizontal overflow", o[0] <= o[1], o)
            await pg.screenshot(path=str(OUT / f"{name}-home.png"))
            await pg.evaluate("document.getElementById('constellation').scrollIntoView()")
            await pg.wait_for_timeout(900)
            await pg.screenshot(path=str(OUT / f"{name}-const.png"))
            await pg.evaluate("document.getElementById('atlas').scrollIntoView()")
            await pg.wait_for_timeout(600)
            o2 = await pg.evaluate(PROBE)
            check(f"{w} atlas no overflow", o2[0] <= o2[1], o2)
            await pg.screenshot(path=str(OUT / f"{name}-atlas.png"))

        check("no console/page errors", not errs, errs[:4])
        print("\n" + "=" * 46)
        print("PASSED %d / %d" % (sum(RESULTS.values()), len(RESULTS)))
        bad = [k for k, v in RESULTS.items() if not v]
        if bad:
            print("FAILING:", bad)
        await b.close()
        _httpd.shutdown()

asyncio.run(main())
