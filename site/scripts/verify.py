import asyncio, pathlib, json
from playwright.async_api import async_playwright

SRC = pathlib.Path(__file__).resolve().parent.parent   # repo root (scripts/ lives under it)
if not (SRC / "index.html").exists():                   # dev checkout layout
    SRC = pathlib.Path(__file__).resolve().parent
OUT = SRC / "_preview"
OUT.mkdir(exist_ok=True)

frag = (SRC / "index.html").read_text().replace("<!--BODY-->", "</head><body>")
html = ("<!doctype html><html lang='en'><head><meta charset='utf-8'>"
        "<meta name='viewport' content='width=device-width,initial-scale=1,viewport-fit=cover'>"
        "<style>:root{color-scheme:light}body{margin:0;font:14px system-ui}"
        "img{max-width:100%}[hidden]{display:none!important}</style>" + frag + "</body></html>")
(OUT / "index.html").write_text(html)
for f in ("content.js", "app.js", "corpus.js", "corpus-ui.js", "cv.html"):
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
            # PW_CHROMIUM points at a preinstalled Chromium when Playwright's
            # own browser download is not available
            import os
            exe = os.environ.get("PW_CHROMIUM") or ("/opt/pw-browsers/chromium"
                  if pathlib.Path("/opt/pw-browsers/chromium").exists() else None)
            b = await p.chromium.launch(executable_path=exe,
                                        args=["--autoplay-policy=no-user-gesture-required"])
            print("browser: bundled Chromium (no H.264 — film checks will not be meaningful)")
        errs = []

        async def page(w, h, skip_intro=True, reduced=False, film=None, quiet=False, explore=True):
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
            await pg.wait_for_timeout(2000)
            # Explore the Lab is collapsed by default; most corpus checks need it
            # open. The first-screen and IA checks build their own pages instead.
            if explore:
                await pg.evaluate("() => { const d = document.getElementById('explore-details'); if (d && !d.open) d.open = true; }")
                await pg.wait_for_timeout(400)
            # The film never autoplays; skip_intro=False opens it the way a
            # visitor does, from its button in Research & Experiments.
            if not skip_intro:
                await pg.evaluate("() => document.getElementById('film-btn').click()")
                await pg.wait_for_timeout(500)
            return pg

        print("\n=== DESKTOP 1280 ===")
        d = await page(1280, 1000)
        await d.screenshot(path=str(OUT / "d-home.png"))

        # corpus counts rendered from the repo
        counts = await d.evaluate("() => window.GOS_CORPUS.counts")
        check("corpus counts are internally consistent",
              counts["directories"] == 90 and counts["written"] + counts["empty"] == counts["directories"], counts)
        check("Day 90 present", await d.evaluate("() => window.GOS_CORPUS.studies.some(s=>s.day===90)"))
        empty_days = await d.evaluate("() => window.GOS_CORPUS.studies.filter(s=>s.empty).map(s=>s.day)")
        check("empty studies in the data match the empty count",
              len(empty_days) == counts["empty"], empty_days)
        check("Day 74 (Cipla) is written, not hollow",
              await d.evaluate("() => { const s = window.GOS_CORPUS.studies.find(x=>x.day===74);\n                  return !!s && s.empty === false && s.words > 1000; }"))
        check("the Day 74 / Day 75 numbering anomaly is still surfaced",
              await d.evaluate("() => (window.GOS_CORPUS.anomalies.day_mismatch||[]).some(m=>m.day===74 && m.internal===75)"))

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
        has_missing = await d.evaluate("""() => !![...document.querySelectorAll('#f-comp button')].find(b=>b.textContent.includes('MISSING'))""")
        if has_missing:
            await d.evaluate("""() => [...document.querySelectorAll('#f-comp button')].find(b=>b.textContent.includes('MISSING')).click()""")
            await d.wait_for_timeout(350)
            check("completeness filter matches the empty count",
                  ("%d OF 90" % counts["empty"]) in await d.inner_text("#atlas-count"), await d.inner_text("#atlas-count"))
        else:
            check("no MISSING filter offered because no study is empty", counts["empty"] == 0, counts["empty"])
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
        check("completeness counts cover every study",
              await d.evaluate("""() => Object.values(window.GOS_CORPUS.completeness_counts)
                  .reduce((a,b)=>a+b,0) === window.GOS_CORPUS.counts.directories"""),
              await d.evaluate("() => window.GOS_CORPUS.completeness_counts"))
        await d.screenshot(path=str(OUT / "d-method.png"))

        # copilot: must refuse, must not topic-match into a company answer
        await d.evaluate("document.getElementById('ask').scrollIntoView()")
        await d.fill("#ask-input", "what is Stripe's revenue")
        await d.click(".ask-send")
        await d.wait_for_timeout(1900)
        t = await d.inner_text("#thread")
        check("copilot refuses revenue question", "isn't documented" in t)
        check("copilot did not answer with a company figure", "billion" not in t.lower() and "$" not in t)
        await d.fill("#ask-input", "tell me about the 90 day challenge")
        await d.click(".ask-send")
        await d.wait_for_timeout(1900)
        t2 = await d.inner_text("#thread")
        check("copilot answers corpus question with sources", "SOURCE:" in t2)
        # The figures inside copilot answers are {{tokens}} resolved from the generated
        # corpus at render time. These assertions read the live corpus, so they cannot
        # be satisfied by a hand-typed number that happens to match today.
        live = await d.evaluate("() => window.GOS_CORPUS.counts")
        fmt = lambda v: "{:,}".format(v)
        check("the corpus answer quotes the generated written count",
              fmt(live["written"]) in t2, {"written": fmt(live["written"])})
        check("the corpus answer quotes the generated source count",
              fmt(live["sources"]) in t2, {"sources": fmt(live["sources"])})
        check("the corpus answer quotes the generated empty count",
              fmt(live["empty"]) in t2, {"empty": fmt(live["empty"])})
        check("no copilot answer leaks an unresolved {{token}}",
              "{{" not in t2 and "}}" not in t2)
        check("no knowledge-base answer contains a hand-typed corpus figure",
              await d.evaluate("""() => {
                  const stale = ['89 written','1 empty','1,099,524','1,382'];
                  return GOS_CONTENT.copilot_kb.every(e =>
                      !stale.some(x => JSON.stringify(e).includes(x)));
              }"""))
        check("every {{token}} used in the knowledge base resolves",
              await d.evaluate("""() => {
                  const K = window.GOS_CORPUS.counts, ok = ['written','directories','empty',
                      'sources','assumption_files','verified','words_m'];
                  return GOS_CONTENT.copilot_kb.every(e =>
                      (JSON.stringify(e).match(/\\{\\{(\\w+)\\}\\}/g) || []).every(m =>
                          ok.includes(m.slice(2,-2))));
              }"""))
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
        if await d.evaluate("""() => !![...document.querySelectorAll('#f-comp button')].find(b=>b.textContent.indexOf('MISSING')>-1)"""):
            await d.evaluate("""() => [...document.querySelectorAll('#f-comp button')].find(b=>b.textContent.indexOf('MISSING')>-1).click()""")
            await d.wait_for_timeout(400)
            check("completeness filter matches the empty count",
                  ("%d OF 90" % counts["empty"]) in await d.inner_text("#atlas-count"), await d.inner_text("#atlas-count"))
        else:
            check("completeness filter offers no MISSING bucket when nothing is empty", counts["empty"] == 0)
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
        mp4 = str(MEDIA / "gaurav-os-intro.mp4")
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
        check("film opens from the Research & Experiments button", await i.evaluate("() => !!document.querySelector('.intro video.film')"))
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
              await i.evaluate("() => !!document.querySelector('#home-mount .hero-name')"))
        ov = await i.evaluate("""() => ({tl: !!document.querySelector('.ov.tl'), bl: !!document.querySelector('.ov.bl'),
             skip: !!document.querySelector('.ov-skip'), sound: !!document.querySelector('.ov-sound')})""")
        check("overlays: top-left, bottom-left, skip, sound", all(ov.values()), ov)
        io = await i.evaluate(PROBE)
        check("film stage: no horizontal overflow", io[0] <= io[1], io)
        await i.screenshot(path=str(OUT / "film.png"))

        # sound control: muted start, accessible toggle, honest state
        s0 = await i.evaluate("""() => { const b=document.querySelector('.ov-sound'),
            v=document.querySelector('.intro video.film');
            return {muted: v.muted, pressed: b.getAttribute('aria-pressed'),
                    name: b.getAttribute('aria-label'), label: b.querySelector('.slab').textContent,
                    tag: b.tagName, type: b.type, dot: !!b.querySelector('.sdot')}; }""")
        check("intro starts muted (never blasts audio)", s0["muted"] is True, s0)
        check("sound control is a real button", s0["tag"] == "BUTTON" and s0["type"] == "button", s0)
        check("sound control has an accessible name", bool(s0["name"]), s0)
        check("sound control reports state OFF before use",
              s0["pressed"] == "false" and s0["label"] == "SOUND OFF" and s0["dot"], s0)
        check("sound control sits beside skip in one cluster",
              await i.evaluate("() => !!document.querySelector('.ov-actions .ov-sound') && "
                               "!!document.querySelector('.ov-actions .ov-skip')"))

        await i.evaluate("() => document.querySelector('.ov-sound').click()")
        s1 = await i.evaluate("""() => { const b=document.querySelector('.ov-sound'),
            v=document.querySelector('.intro video.film');
            return {muted: v.muted, pressed: b.getAttribute('aria-pressed'),
                    label: b.querySelector('.slab').textContent,
                    pref: localStorage.getItem('gos-intro-sound')}; }""")
        check("sound can be turned on", s1["muted"] is False, s1)
        check("aria-pressed and label follow the real state",
              s1["pressed"] == "true" and s1["label"] == "SOUND ON", s1)
        check("sound choice is remembered", s1["pref"] == "1", s1)

        await i.evaluate("() => document.querySelector('.ov-sound').click()")
        s2 = await i.evaluate("""() => { const b=document.querySelector('.ov-sound'),
            v=document.querySelector('.intro video.film');
            return {muted: v.muted, pressed: b.getAttribute('aria-pressed'),
                    label: b.querySelector('.slab').textContent,
                    pref: localStorage.getItem('gos-intro-sound')}; }""")
        check("sound can be turned off again",
              s2["muted"] is True and s2["pressed"] == "false" and s2["label"] == "SOUND OFF", s2)
        check("sound-off choice is remembered", s2["pref"] == "0", s2)
        check("sound control is keyboard reachable",
              await i.evaluate("() => document.querySelector('.ov-sound').tabIndex >= 0"))

        # the film is aria-modal: focus must start inside it and stay inside it
        f0 = await i.evaluate("""() => { const a=document.activeElement;
            return {inDialog: !!(a && a.closest && a.closest('.intro')),
                    tag: a && a.tagName, text: a ? (a.textContent||'').trim().slice(0,22) : null}; }""")
        check("focus starts inside the film overlay", f0["inDialog"], f0)
        seen = []
        for _ in range(4):
            await i.keyboard.press("Tab")
            seen.append(await i.evaluate("""() => { const a=document.activeElement;
                return (a && a.closest && a.closest('.intro')) ? (a.className||'') : 'ESCAPED'; }"""))
        check("Tab stays on the film's own controls", "ESCAPED" not in seen, seen)
        check("Tab cycles between the sound and skip controls",
              all(("ov-sound" in c) or ("ov-skip" in c) for c in seen), seen)
        ring = await i.evaluate("""() => { const a=document.activeElement, c=getComputedStyle(a);
            return {w: c.outlineWidth, style: c.outlineStyle, color: c.outlineColor,
                    fv: a.matches(':focus-visible')}; }""")
        check("the focused film control shows a real visible focus ring",
              ring["fv"] and ring["style"] != "none" and ring["w"] not in ("0px", ""), ring)

        # runs to completion -> holds the final frame -> hands over. Wait for the
        # hand-over itself (clip + 0.9s hold + 0.62s fade), not a fixed sleep,
        # which raced the clip's real length on a slow run.
        try:
            await i.wait_for_function("() => !document.querySelector('.intro')", timeout=12000)
        except Exception:
            pass
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
                  await rm.evaluate("() => !!document.querySelector('#home-mount .hero-name')"), probe["ev"])
        await rm.close()

        print("\n=== INTRO: skip, replay, return visit ===")
        r2 = await page(1280, 1000, skip_intro=False, film="test-clip.webm")
        await r2.wait_for_timeout(1200)
        await r2.evaluate("document.querySelector('.ov-skip').click()")
        await r2.wait_for_timeout(900)
        check("skip dismisses the film", await r2.evaluate("() => !document.querySelector('.intro')"))
        await r2.reload(); await r2.wait_for_timeout(1800)
        check("a reload never autoplays the film",
              await r2.evaluate("() => !document.querySelector('.intro')"))
        check("film control is present and labelled",
              "WATCH INTRO" in await r2.evaluate("() => document.getElementById('film-btn').textContent"))
        await r2.evaluate("() => document.getElementById('film-btn').click()")
        await r2.wait_for_timeout(1200)
        check("replay replays the film", await r2.evaluate("() => !!document.querySelector('.intro video.film')"))
        await r2.keyboard.press("Escape")
        await r2.wait_for_timeout(800)
        check("Escape closes the film", await r2.evaluate("() => !document.querySelector('.intro')"))

        # return visit with sound previously enabled: one unmuted attempt, honest
        # fallback, no error, no retry loop
        await r2.evaluate("() => { try{localStorage.setItem('gos-intro-sound','1')}catch(e){} }")
        await r2.evaluate("() => document.getElementById('film-btn').click()")
        await r2.wait_for_timeout(1500)
        rv = await r2.evaluate("""() => { const b=document.querySelector('.ov-sound'),
            v=document.querySelector('.intro video.film');
            return {has: !!b, muted: v ? v.muted : null, pressed: b ? b.getAttribute('aria-pressed') : null,
                    label: b ? b.querySelector('.slab').textContent : null,
                    err: v ? !!v.error : null, playing: v ? v.currentTime > 0.05 : null}; }""")
        check("return visit with sound enabled still plays the film",
              rv["has"] and rv["playing"] and not rv["err"], rv)
        check("return visit: control state matches the element, whatever policy allowed",
              (rv["pressed"] == "true") == (rv["muted"] is False)
              and rv["label"] == ("SOUND ON" if rv["muted"] is False else "SOUND OFF"), rv)
        await r2.evaluate("() => { try{localStorage.setItem('gos-intro-sound','0')}catch(e){} }")
        await r2.keyboard.press("Escape")
        await r2.wait_for_timeout(600)

        # the sound control must stay usable and clear of skip on small screens
        for w in (390, 360):
            sp = await page(w, 844, skip_intro=False, film="test-clip.webm")
            await sp.wait_for_timeout(1400)
            g = await sp.evaluate("""(vw) => { const b=document.querySelector('.ov-sound'),
                k=document.querySelector('.ov-skip'), n=document.querySelector('.ov.bl');
                if(!b||!k) return null;
                const B=b.getBoundingClientRect(), K=k.getBoundingClientRect(),
                      N=n?n.getBoundingClientRect():null;
                const hit=(a,c)=>!(a.right<=c.left||c.right<=a.left||a.bottom<=c.top||c.bottom<=a.top);
                return {inside: B.left>=0 && B.right<=vw, tall: B.height>=32, wide: B.width>=60,
                        clearOfSkip: !hit(B,K), clearOfName: N?!hit(B,N):true,
                        vis: getComputedStyle(b).opacity}; }""", w)
            check(str(w) + ": sound control is within the viewport", g and g["inside"], g)
            check(str(w) + ": sound control keeps a usable hit area", g and g["tall"] and g["wide"], g)
            check(str(w) + ": sound control overlaps nothing",
                  g and g["clearOfSkip"] and g["clearOfName"], g)
            check(str(w) + ": sound control is visible from the first frame",
                  g and float(g["vis"]) > 0.9, g)
            op = await sp.evaluate(PROBE)
            check(str(w) + ": film overlays cause no horizontal overflow", op[0] <= op[1], op)
            await sp.close()
        await r2.close()

        print("\n=== OPEN TO HEALTHCARE PRODUCT ROLES ===")
        o = await page(1280, 1000)
        rec = await o.evaluate("() => window.GOS_CONTENT.site_config.opportunity")
        check("positioning lives in the content layer, not in the UI file",
              bool(rec and rec.get("label") and rec.get("roles")), rec and rec.get("label"))
        check("the roles are the five target roles, in order",
              rec["roles"] == ["AI Product Manager", "Healthcare Product Manager", "Associate Product Manager",
                               "Product Analyst", "HealthTech Product"], rec["roles"])
        hero = await o.evaluate("""() => { const b=document.querySelector('#home-mount .seek');
            return b ? {k: b.querySelector('.seek-k').textContent.trim(),
                        roles: [...b.querySelectorAll('.role')].map(x=>x.textContent)} : null; }""")
        check("hero carries the open-to-roles signal from content",
              hero and hero["k"] == rec["label"], hero and hero["k"])
        check("hero lists the roles from content, in order",
              hero and hero["roles"] == rec["roles"], hero and hero["roles"])
        con = await o.evaluate("""() => { const b=document.querySelector('#contact-mount .open');
            return b ? {k: b.querySelector('.open-k').textContent.trim(),
                        body: b.querySelector('.open-b').textContent.trim()} : null; }""")
        check("contact channel states the signal once, with the detail",
              con and con["k"] == rec["label"] and rec["line"] in con["body"] and rec["detail"] in con["body"], con)
        check("the full statement appears in the lab experience exactly once",
              await o.evaluate("() => document.querySelectorAll('.lab-only .open').length") == 1)
        check("no broad 'across industries' positioning survives anywhere on the page",
              await o.evaluate("""() => !/consumer, SaaS and emerging|across industries|(^|[^I] )Product Professional/i
                                    .test(document.body.innerText)"""))
        check("no invented contact destination",
              await o.evaluate("""() => [...document.querySelectorAll('#contact-mount a[href]')]
                 .every(a => /^(#|mailto:|media\\/|cv\\.html$|https:\\/\\/(www\\.)?(linkedin|github)\\.com)/.test(a.getAttribute('href')))"""))
        # recruiter mode, opened from the hero
        await o.evaluate("() => document.getElementById('hero-recruiter').click()")
        await o.wait_for_timeout(500)
        rm2 = await o.evaluate("""() => { const b=document.querySelector('#recruiter .rec-open');
            if(!b) return null;
            const a=b.querySelector('.open-cta a');
            return {k: b.querySelector('.open-k').textContent.trim(),
                    roles: [...b.querySelectorAll('.open-r span')].map(x=>x.textContent),
                    cta: a ? a.getAttribute('href') : null,
                    target: a ? !!document.querySelector(a.getAttribute('href')) : false,
                    vis: b.getBoundingClientRect().height > 0}; }""")
        check("Recruiter Mode opens from the hero",
              await o.evaluate("() => document.documentElement.getAttribute('data-mode')") == "recruiter")
        check("Recruiter Mode states the opportunity prominently",
              rm2 and rm2["k"] == rec["label"] and rm2["vis"], rm2)
        check("Recruiter Mode lists the roles", rm2 and rm2["roles"] == rec["roles"], rm2 and rm2["roles"])
        check("Recruiter Mode CTA resolves inside Recruiter Mode",
              rm2 and rm2["cta"] == rec["cta_href_recruiter"] and rm2["target"], rm2 and rm2["cta"])
        check("Recruiter Mode leads with the three proof points",
              await o.evaluate("""() => { const t = document.querySelector('#recruiter .rec-sum').textContent;
                  return GOS_CONTENT.site_config.proof_points.every(p => t.includes(p.claim)); }"""))
        check("Recruiter View seeking line names the AI and healthcare roles",
              "AI PM · HEALTHCARE PM" in await o.evaluate(
                  "() => [...document.querySelectorAll('#recruiter .chip.gold')].map(x=>x.textContent).join(' ').toUpperCase()"))
        await o.evaluate("() => document.getElementById('rail-recruiter').click()")
        await o.wait_for_timeout(500)
        check("leaving Recruiter Mode restores the lab experience exactly",
              await o.evaluate("""() => document.documentElement.getAttribute('data-mode') === 'lab'
                  && document.querySelector('#work').getBoundingClientRect().height > 0
                  && document.querySelectorAll('.lab-only .open').length === 1"""))
        await o.close()
        rq = await b.new_context(viewport={"width": 1280, "height": 900})
        rqp = await rq.new_page()
        await rqp.goto(URL + "?view=recruiter"); await rqp.wait_for_timeout(1200)
        check("?view=recruiter is a shareable link into Recruiter Mode",
              await rqp.evaluate("() => document.documentElement.getAttribute('data-mode')") == "recruiter")
        await rq.close()

        print("\n=== INTRO: failure path ===")
        e2 = await page(1280, 1000, skip_intro=False, quiet=True)
        await e2.route("**/gaurav-os-intro.mp4", lambda route: route.abort())
        await e2.reload()
        await e2.wait_for_timeout(1500)
        await e2.evaluate("() => document.getElementById('film-btn').click()")
        await e2.wait_for_timeout(3000)
        check("a film that cannot play never leaves a dead element",
              await e2.evaluate("() => !document.querySelector('.intro video.film[data-stuck]')"))
        check("homepage stays usable when the film fails",
              await e2.evaluate("""() => !!document.querySelector('#home-mount .hero-name')"""))
        await e2.close()

        print("\n=== REDUCED MOTION ===")
        r = await page(1280, 1000, skip_intro=False, reduced=True)
        await r.wait_for_timeout(1500)
        check("reduced motion never autoplays the film",
              await r.evaluate("() => !document.querySelector('.intro video')"))
        check("reduced motion shows the still with a way in",
              await r.evaluate("""() => { const s=document.querySelector('.intro.still');
                  return !!(s && s.querySelector('img.film') && /CLOSE/.test(s.textContent)); }"""))
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

        print("\n=== PRODUCT ORBIT ===")
        ob = await page(1280, 1000)
        o1 = await ob.evaluate("""() => {
            const ns = [...document.querySelectorAll('#orbit .onode')];
            return {count: ns.length, tags: [...new Set(ns.map(n => n.tagName))],
                    labelled: ns.every(n => (n.getAttribute('aria-label')||'').includes('\u2014')),
                    labels: ns.map(n => n.textContent.trim())}; }""")
        check("orbit renders every domain the content layer carries",
              o1["count"] == await ob.evaluate("() => GOS_CONTENT.site_config.orbit.inner.length"), o1["labels"])
        lp = await ob.evaluate("""() => { const b = [...document.querySelectorAll('#orbit-loop .loopchip')];
            return {n: b.length, labels: b.map(x => x.textContent.trim()),
                    explained: b.every(x => (x.getAttribute('aria-label')||'').includes('\u2014'))}; }""")
        check("operating loop renders beneath the diagram, each stage explained",
              lp["n"] == 3 and lp["explained"], lp["labels"])
        check("orbit nodes are real buttons, each explained", o1["tags"] == ["BUTTON"] and o1["labelled"], o1["tags"])
        rest = await ob.evaluate("() => document.getElementById('orbit-cap').textContent")
        await ob.evaluate("() => document.querySelector('#orbit .onode').dispatchEvent(new MouseEvent('mouseenter'))")
        hov = await ob.evaluate("() => document.getElementById('orbit-cap').textContent")
        # The caption must be that node's own blurb from the content layer — compared
        # against the record, not against a length, so copy can change freely.
        want = await ob.evaluate("""() => { const l = document.querySelector('#orbit .onode').textContent.trim();
            const r = GOS_CONTENT.site_config.orbit.inner.find(x => x.label === l); return r && r.blurb; }""")
        check("hovering a node reveals that node's explanation from content",
              hov != rest and want and want in hov, {"shown": hov[:70], "record": want})
        await ob.evaluate("() => document.querySelector('#orbit .onode').dispatchEvent(new MouseEvent('mouseleave'))")
        back = await ob.evaluate("() => document.getElementById('orbit-cap').textContent")
        check("leaving restores the caption", back == rest, back)
        check("desktop keeps the rotating orbit, not the simplified one",
              await ob.evaluate("() => !document.getElementById('orbit').classList.contains('compact')"), rest)
        geo = await ob.evaluate("""() => {
            const core = document.querySelector('.orbit-core').getBoundingClientRect();
            const box = document.getElementById('orbit').getBoundingClientRect();
            const r = [...document.querySelectorAll('#ring-inner .onode span')]
                        .map(n => n.getBoundingClientRect()).filter(b => b.width > 0);
            return {onCore: r.filter(b => !(b.right < core.left || core.right < b.left ||
                                            b.bottom < core.top || core.bottom < b.top)).length,
                    outside: r.filter(b => b.left < box.left - 1 || b.right > box.right + 1).length}; }""")
        check("desktop: no label sits on the core", geo["onCore"] == 0, geo)
        check("desktop: no label escapes the orbit box", geo["outside"] == 0, geo)
        cw = await ob.evaluate("""() => { const c = document.querySelector('.orbit-core'),
              om = c.querySelector('.om'), cb = c.getBoundingClientRect(), ob2 = om.getBoundingClientRect();
            return {lines: Math.round(ob2.height / parseFloat(getComputedStyle(om).fontSize) / 1.2),
                    fits: ob2.width <= cb.width - 2 && ob2.height <= cb.height - 2}; }""")
        check("core wordmark stays on one line inside the circle",
              cw["lines"] <= 1 and cw["fits"], cw)
        # The orbit is content-driven: the rendered nodes must BE the content records,
        # so a domain cannot be added, renamed or dropped in the UI layer.
        check("orbit nodes are exactly the five content records, in order",
              await ob.evaluate("""() => {
                  const want = GOS_CONTENT.site_config.orbit.inner.map(x => x.label);
                  const got = [...document.querySelectorAll('#orbit .onode')].map(x => x.textContent.trim());
                  return want.length === 5 && JSON.stringify(want) === JSON.stringify(got); }"""),
              await ob.evaluate("() => [...document.querySelectorAll('#orbit .onode')].map(x => x.textContent.trim())"))
        check("every orbit node carries its own explanation from content",
              await ob.evaluate("""() => GOS_CONTENT.site_config.orbit.inner.every(x =>
                  x.id && x.label && typeof x.blurb === 'string' && x.blurb.length > 10)"""))
        await ob.close()

        oc = await page(390, 844)
        comp = await oc.evaluate("""() => {
            const o = document.getElementById('orbit'), ns = [...o.querySelectorAll('#ring-inner .onode')];
            const box = o.getBoundingClientRect();
            const r = ns.map(n => n.querySelector('span').getBoundingClientRect());
            let overlap = 0;
            for (let i = 0; i < r.length; i++) for (let j = i + 1; j < r.length; j++)
                if (!(r[i].right < r[j].left || r[j].right < r[i].left ||
                      r[i].bottom < r[j].top || r[j].bottom < r[i].top)) overlap++;
            const core = document.querySelector('.orbit-core').getBoundingClientRect();
            let hitsCore = r.filter(b => !(b.right < core.left || core.right < b.left ||
                                           b.bottom < core.top || core.bottom < b.top)).length;
            return {compact: o.classList.contains('compact'), overlap: overlap, hitsCore: hitsCore,
                    inside: r.every(b => b.left >= box.left - 1 && b.right <= box.right + 1),
                    cap: document.getElementById('orbit-cap').textContent}; }""")
        check("390: orbit simplifies instead of shrinking", comp["compact"], comp)
        check("390: no label collides with another", comp["overlap"] == 0, comp["overlap"])
        check("390: no label sits on the core", comp["hitsCore"] == 0, comp["hitsCore"])
        check("390: labels stay inside the orbit box", comp["inside"], comp)
        cw390 = await oc.evaluate("""() => { const c = document.querySelector('.orbit-core'),
              om = c.querySelector('.om'), cb = c.getBoundingClientRect(), b = om.getBoundingClientRect();
            return {fits: b.width <= cb.width - 2 && b.height <= cb.height - 2,
                    lines: Math.round(b.height / parseFloat(getComputedStyle(om).fontSize) / 1.15)}; }""")
        check("390: core wordmark stays on one line inside the circle",
              cw390["fits"] and cw390["lines"] <= 1, cw390)
        check("390: caption is the content caption, not a rewritten one",
              "ORBIT" in comp["cap"], comp["cap"])
        check("390: operating loop still present beneath the orbit",
              await oc.evaluate("() => document.querySelectorAll('#orbit-loop .loopchip').length") == 3)
        await oc.screenshot(path=str(OUT / "orbit-390.png"))
        await oc.close()

        ot = await page(768, 1024)
        t768 = await ot.evaluate("""() => {
            const r = [...document.querySelectorAll('#orbit .onode span')].map(n => n.getBoundingClientRect()).filter(b => b.width > 0 && b.height > 0);
            let overlap = 0;
            for (let i = 0; i < r.length; i++) for (let j = i + 1; j < r.length; j++)
                if (!(r[i].right < r[j].left || r[j].right < r[i].left ||
                      r[i].bottom < r[j].top || r[j].bottom < r[i].top)) overlap++;
            return {compact: document.getElementById('orbit').classList.contains('compact'), overlap}; }""")
        check("768: orbit is the simplified one and does not collide",
              t768["compact"] and t768["overlap"] == 0, t768)
        await ot.close()

        ol = await page(1024, 900)
        t1024 = await ol.evaluate("""() => {
            const r = [...document.querySelectorAll('#orbit .onode span')].map(n => n.getBoundingClientRect()).filter(b => b.width > 0 && b.height > 0);
            let overlap = 0;
            for (let i = 0; i < r.length; i++) for (let j = i + 1; j < r.length; j++)
                if (!(r[i].right < r[j].left || r[j].right < r[i].left ||
                      r[i].bottom < r[j].top || r[j].bottom < r[i].top)) overlap++;
            return {compact: document.getElementById('orbit').classList.contains('compact'), overlap}; }""")
        check("1024: orbit does not collide", t1024["overlap"] == 0, t1024)
        await ol.close()

        # the rotating orbit, sampled through a full revolution
        od = await page(1440, 900)
        await od.evaluate("() => document.getElementById('orbit').scrollIntoView({block: 'center'})")
        worst = 0
        for _ in range(12):
            await od.wait_for_timeout(450)
            n = await od.evaluate("""() => {
                const r = [...document.querySelectorAll('#orbit .onode span')].map(n => n.getBoundingClientRect()).filter(b => b.width > 0 && b.height > 0);
                let o = 0;
                for (let i = 0; i < r.length; i++) for (let j = i + 1; j < r.length; j++)
                    if (!(r[i].right < r[j].left || r[j].right < r[i].left ||
                          r[i].bottom < r[j].top || r[j].bottom < r[i].top)) o++;
                return o; }""")
            worst = max(worst, n)
        check("1440: rotating labels never collide, sampled through a revolution",
              worst == 0, "worst overlap: %d" % worst)
        await od.close()

        print("\n=== CV, SEO, READER ===")
        rs = await page(1280, 1000)
        seo = await rs.evaluate("""() => ({title: document.title,
            og: (document.querySelector('meta[property=\"og:title\"]')||{}).content,
            desc: (document.querySelector('meta[name=\"description\"]')||{}).content,
            ogimg: (document.querySelector('meta[property=\"og:image\"]')||{}).content,
            ogurl: (document.querySelector('meta[property=\"og:url\"]')||{}).content,
            canon: (document.querySelector('link[rel=\"canonical\"]')||{}).href || null,
            html: document.documentElement.outerHTML,
            icon: !!document.querySelector('link[rel=\"icon\"]'),
            ld: (() => { try { return JSON.parse(document.querySelector('script[type=\"application/ld+json\"]').textContent); }
                         catch (e) { return null; } })(),
            h1: [...document.querySelectorAll('h1')].filter(h => h.getClientRects().length).map(h => h.textContent.trim())})""")
        check("title leads with the name and the AI product identity",
              seo["title"].startswith("Gaurav Kumar Singh — AI Product Professional"), seo["title"])
        check("Open Graph title matches", seo["og"] == seo["title"], seo["og"])
        check("description names the target roles and a verified proof point",
              "AI PM" in seo["desc"] and "Product Analyst" in seo["desc"] and "Evamastu" in seo["desc"] and len(seo["desc"]) <= 300, len(seo["desc"]))
        check("OG image is the poster", seo["ogimg"] == "media/gaurav-os-poster.jpg", seo["ogimg"])
        # The source carries no site URL; the build writes it from the one SITE
        # setting. Check the built docs/ against that setting.
        check("source hard-codes no site URL (it comes from the build)",
              not seo["canon"] and not seo["ogurl"] and "github.io" not in seo["html"], [seo["canon"], seo["ogurl"]])
        import importlib.util, re as _re
        _spec = importlib.util.spec_from_file_location("build_site", str(pathlib.Path(__file__).resolve().parent / "build_site.py"))
        _bs = importlib.util.module_from_spec(_spec); _spec.loader.exec_module(_bs)
        SITE = _bs.SITE
        DOCS = pathlib.Path(__file__).resolve().parents[2] / "docs"   # the committed build output
        check("production URL is the confirmed Lovable address", SITE == "https://gaurav-os.lovable.app/", SITE)
        built = (DOCS / "index.html").read_text()
        ld = json.loads(built.split('application/ld+json">')[1].split("</script>")[0])
        check("built page: canonical and og:url are the production URL",
              '<link rel="canonical" href="%s">' % SITE in built and '<meta property="og:url" content="%s">' % SITE in built)
        check("built page: structured-data url is the production URL", ld.get("url") == SITE, ld.get("url"))
        check("built page: OG and Twitter images are absolute on the production URL",
              '<meta property="og:image" content="%smedia/gaurav-os-poster.jpg">' % SITE in built
              and '<meta name="twitter:image" content="%smedia/gaurav-os-poster.jpg">' % SITE in built)
        check("built page: no other site URL leaks in",
              "github.io" not in built and not _re.search(r"id-preview--", built))
        sm = (DOCS / "sitemap.xml").read_text()
        check("sitemap lists the home page and CV on the production URL",
              _re.findall(r"<loc>([^<]+)</loc>", sm) == [SITE, SITE + "cv.html"], sm)
        check("robots.txt points at the sitemap",
              ("Sitemap: %ssitemap.xml" % SITE) in (DOCS / "robots.txt").read_text())
        check("built CV page: canonical on the production URL",
              '<link rel="canonical" href="%scv.html">' % SITE in (DOCS / "cv.html").read_text())
        check("favicon declared inline (no 404)", seo["icon"])
        check("JSON-LD Person parses and carries the verified MCA institution",
              bool(seo["ld"]) and any("Chaudhary Charan Singh" in a["name"]
                                      for a in seo["ld"]["mainEntity"]["alumniOf"]), seo["ld"] and seo["ld"]["@type"])
        check("JSON-LD claims no job title", bool(seo["ld"]) and "jobTitle" not in seo["ld"]["mainEntity"])
        check("exactly one visible h1, and it is the name", seo["h1"] == ["Gaurav Kumar Singh"], seo["h1"])

        res = await rs.evaluate("""() => {
            const r = (window.GOS_CONTENT||{}).site_config.contact.resume || {};
            const links = [...document.querySelectorAll('[data-ev=\"resume_clicked\"]')];
            return {file: r.file, shown: links.length,
                    hrefs: links.map(a => a.getAttribute('href')),
                    dl: links.every(a => a.hasAttribute('download')),
                    hero: !!document.querySelector('#home-mount .cta-row [data-ev=\"resume_clicked\"]'),
                    contact: !!document.querySelector('#contact-mount [data-ev=\"resume_clicked\"]'),
                    rail: !!document.querySelector('#rail-cv'),
                    rec: !!document.querySelector('#recruiter [data-ev=\"resume_clicked\"]')}; }""")
        check("CV download renders and points at the shipped file",
              res["file"] and res["shown"] >= 4 and res["dl"] and all(h == res["file"] for h in res["hrefs"]), res)
        check("CV download is offered in the hero, contact, rail and Recruiter Mode",
              res["hero"] and res["contact"] and res["rail"] and res["rec"], res)
        pdf = await rs.evaluate("""async (f) => { const r = await fetch(f);
            const b = new Uint8Array(await r.arrayBuffer());
            return {status: r.status, magic: String.fromCharCode(...b.slice(0, 5)), size: b.length}; }""", res["file"])
        check("the CV PDF is a real PDF", pdf["status"] == 200 and pdf["magic"] == "%PDF-" and pdf["size"] > 20000, pdf)
        import re as _re2
        _pdf = (pathlib.Path(__file__).resolve().parents[2] / "docs" / "media" / "gaurav-kumar-singh-cv.pdf").read_bytes()
        _pages = len(_re2.findall(rb"/Type\s*/Page[^s]", _pdf))
        check("the CV PDF is two pages", _pages == 2, _pages)
        cvp = await b.new_context(viewport={"width": 390, "height": 844})
        cvg = await cvp.new_page()
        await cvg.goto(URL.replace("index.html", "cv.html")); await cvg.wait_for_timeout(600)
        cvt = await cvg.evaluate("() => document.body.innerText")
        check("cv.html renders from the content layer",
              "Gaurav Kumar Singh" in cvt and "Associate Product Manager" in cvt, len(cvt))
        check("cv.html carries the MCA entry exactly",
              "MCA — Chaudhary Charan Singh University, Meerut" in cvt and "2022–2024" in cvt)
        check("cv.html leaves the phone number out", "81275" not in cvt)
        check("cv.html: no horizontal overflow at 390", (await cvg.evaluate(PROBE))[0] <= 390)
        await cvp.close()

        # lab note reader: navigation, copy link, no invented sections
        await rs.evaluate("() => document.getElementById('lab').scrollIntoView()")
        await rs.wait_for_timeout(400)
        await rs.evaluate("() => document.querySelector('.note-card').click()")
        await rs.wait_for_timeout(400)
        rd = await rs.evaluate("""() => { const r = document.querySelector('.reader');
            if (!r) return null;
            const b = [...r.querySelectorAll('.cs-nav button')].map(x => x.textContent.trim());
            return {open: true, nav: b, body: !!r.querySelector('.reader-body'),
                    srcShown: !!r.querySelector('.rd-src'),
                    related: !!r.querySelector('.chip.gold')}; }""")
        check("note reader opens with previous / copy / next", bool(rd) and len(rd["nav"]) == 3, rd and rd["nav"])
        check("no empty SOURCES block when the note has none", bool(rd) and not rd["srcShown"], rd)
        copied = await rs.evaluate("""() => { const b = [...document.querySelectorAll('.reader .cs-nav button')]
                .find(x => /COPY/.test(x.textContent)); b.click(); return true; }""")
        await rs.wait_for_timeout(300)
        check("copy link sets a shareable hash", "#note-" in await rs.evaluate("() => location.hash || ''"),
              await rs.evaluate("() => location.hash"))
        await rs.keyboard.press("ArrowRight")
        await rs.wait_for_timeout(400)
        check("arrow keys move between notes",
              await rs.evaluate("() => !!document.querySelector('.reader')"))
        await rs.keyboard.press("Escape")
        await rs.wait_for_timeout(300)
        check("Escape closes the note reader",
              await rs.evaluate("() => !document.querySelector('.reader')"))
        await rs.close()

        print("\n=== PRODUCTION QUALITY BAR ===")
        qb = await page(1280, 1000)
        await qb.evaluate("() => { document.querySelectorAll('section.mod').forEach(s => s.scrollIntoView()); window.scrollTo(0,0); }")
        await qb.wait_for_timeout(900)
        q = await qb.evaluate("""() => {
            const bad = {};
            // href/src that resolved to a literal null or undefined
            bad.nullAttrs = [...document.querySelectorAll('[href],[src]')]
                .map(e => e.getAttribute('href') || e.getAttribute('src'))
                .filter(v => v === 'null' || v === 'undefined' || v === '');
            // internal anchors must point at an element that exists
            bad.deadAnchors = [...document.querySelectorAll('a[href^=\"#\"]')]
                .map(a => a.getAttribute('href')).filter(h => h.length > 1)
                .filter(h => { try { return !document.querySelector(h); } catch (e) { return true; } });
            // every GitHub link is absolute and points at one of the two repos
            bad.badGithub = [...document.querySelectorAll('a[href*=\"github\"]')]
                .map(a => a.getAttribute('href'))
                .filter(h => !/^https:\\/\\/github\\.com\\/gaurav-product(\\/|$)/.test(h));
            // media referenced by the content layer
            const C = window.GOS_CONTENT || {};
            bad.media = (C.media || []).map(m => m.path).filter(Boolean);
            bad.resume = (C.site_config.contact.resume || {}).file || null;
            // interactive elements that are real buttons/links, not divs
            bad.fakeButtons = [...document.querySelectorAll('[onclick],[role=\"button\"]')]
                .filter(e => !['BUTTON','A'].includes(e.tagName)).length;
            return bad; }""")
        check("no href/src resolves to null, undefined or empty", len(q["nullAttrs"]) == 0, q["nullAttrs"][:5])
        check("every internal anchor points at a real section", len(q["deadAnchors"]) == 0, q["deadAnchors"][:5])
        check("every GitHub link is absolute and in the owner's namespace", len(q["badGithub"]) == 0, q["badGithub"][:3])
        check("no div pretending to be a button", q["fakeButtons"] == 0, q["fakeButtons"])

        # every media path the content layer names is actually fetchable
        missing = []
        for m in q["media"] + ([q["resume"]] if q["resume"] else []):
            st = await qb.evaluate("""async (p) => { try { const r = await fetch(p, {method: 'GET'});
                return r.status; } catch (e) { return 0; } }""", m)
            if st != 200:
                missing.append((m, st))
        check("every media path in the content layer resolves", not missing, missing)

        # buttons that do nothing: no listener, no form, no handler attribute
        dead = await qb.evaluate("""() => [...document.querySelectorAll('button')]
            .filter(b => !b.disabled && !b.onclick && !b.getAttribute('data-ev') &&
                         !b.form && !b.closest('form'))
            .filter(b => !(window.__gosHasListener && window.__gosHasListener(b)))
            .length""")
        print("  NOTE  buttons without an inline handler (listeners are not observable): %d" % dead)
        await qb.close()

        print("\n=== RECRUITER-FIRST: the first screen and the proof ===")
        PROOF = {
            "evamastu": "Owned discovery through release and wrote the full PRD; cohort analysis across 50+ participant cohorts supported a 20–25% lift in consistency over six weeks.",
            "live-your-best-life": "30+ structured user interviews and engagement tracked for 500+ users; the research influenced three major feature iterations.",
            "careconnect": "Reframed a caregiver marketplace into a post-discharge care accountability layer, then built an MVP with 65 unit/integration tests and 30 end-to-end journeys.",
        }
        HEADLINE = "AI product professional building evidence-led, safety-conscious products from discovery to delivery."
        BUTTONS = ["VIEW WORK", "ASK GAURAV", "DOWNLOAD CV", "EMAIL", "RECRUITER VIEW"]
        for w, h in ((1440, 900), (1280, 800), (1024, 768), (768, 1024), (390, 844), (360, 800)):
            fs = await b.new_context(viewport={"width": w, "height": h})
            fp = await fs.new_page()
            mp4hits = []
            fp.on("request", lambda r: mp4hits.append(r.url) if r.url.endswith(".mp4") else None)
            await fp.goto(URL); await fp.wait_for_timeout(1500)
            g = await fp.evaluate("""(vh) => {
                const vis = (sel) => { const e = document.querySelector(sel); if (!e) return null;
                    const r = e.getBoundingClientRect(); return {top: r.top, bottom: r.bottom}; };
                return {name: vis('#hero-name'), pos: vis('#home-mount .hero-pos'), seek: vis('#home-mount .seek'),
                        cta: vis('#home-mount .cta-row'),
                        cards: [...document.querySelectorAll('#home-mount .proof-card')].map(c => {
                            const r = c.getBoundingClientRect(); return {top: r.top, bottom: r.bottom}; }),
                        intro: !!document.querySelector('.intro'),
                        explore: document.getElementById('explore-details').open}; }""", h)
            check(f"{w}: no intro film over the first screen", not g["intro"])
            check(f"{w}: the film file is never fetched on a first visit", not mp4hits, mp4hits[:1])
            check(f"{w}: Explore the Lab starts collapsed", g["explore"] is False)
            check(f"{w}: name, positioning and target roles are in the first screen",
                  all(g[k] and g[k]["bottom"] <= h for k in ("name", "pos", "seek")), g)
            if w >= 1000:
                check(f"{w}: the five actions and all three proof cards are in the first screen",
                      g["cta"]["bottom"] <= h and len(g["cards"]) == 3 and all(c["bottom"] <= h for c in g["cards"]),
                      {"cta": g["cta"], "cards": g["cards"]})
            else:
                check(f"{w}: the actions are in the first screen and the proof cards follow directly",
                      g["cta"]["bottom"] <= h and len(g["cards"]) == 3 and g["cards"][0]["top"] < h + 120,
                      {"cta": g["cta"], "first": g["cards"][:1]})
            await fs.close()

        rf = await page(1280, 1000, explore=False)
        hero = await rf.evaluate("""() => ({
            h1: [...document.querySelectorAll('h1')].filter(e => e.getClientRects().length).map(e => e.textContent.trim()),
            pos: document.querySelector('#home-mount .hero-pos').textContent.trim(),
            buttons: [...document.querySelectorAll('#home-mount .cta-row > *')].map(b => b.textContent.replace(/[\\u2193\\u2192]/g, '').trim()),
            roles: [...document.querySelectorAll('#home-mount .role')].map(r => r.textContent),
            ask: document.querySelector('#home-mount .cta-row a[href="#ask"]') !== null})""")
        check("the name is the only visible h1", hero["h1"] == ["Gaurav Kumar Singh"], hero["h1"])
        check("the hero states the AI-product positioning", hero["pos"] == HEADLINE, hero["pos"])
        check("the hero offers View Work, Ask Gaurav, Download CV, Email and Recruiter View, in order",
              hero["buttons"] == BUTTONS, hero["buttons"])
        check("the hero role chips lead with AI Product Manager", hero["roles"][:1] == ["AI Product Manager"], hero["roles"])
        pc = await rf.evaluate("""() => [...document.querySelectorAll('#home-mount .proof-card')].map(a => ({
            href: a.getAttribute('href'), claim: a.querySelector('.pc').textContent,
            ev: a.querySelector('.ev-label').textContent}))""")
        check("hero proof cards are the three verified proof points, worded as verified",
              [c["claim"] for c in pc] == list(PROOF.values()), [c["claim"][:30] for c in pc])
        check("each proof card links to its case study",
              [c["href"] for c in pc] == ["#case-" + k for k in PROOF], [c["href"] for c in pc])
        check("CareConnect's proof card is labelled exactly 'MVP · NOT IN PRODUCTION'",
              pc[2]["ev"] == "MVP · NOT IN PRODUCTION", pc[2]["ev"])
        prim = await rf.evaluate("""() => [...document.querySelectorAll('#work-mount > .case.primary')].map(c => c.id)""")
        check("Selected Work is Evamastu, Live Your Best Life and CareConnect, in order",
              prim == ["case-" + k for k in PROOF], prim)
        cc = await rf.evaluate("""() => { const c = document.getElementById('case-careconnect');
            return {flag: !!c.querySelector('.prod-flag'), text: c.textContent}; }""")
        check("CareConnect case states plainly that it is not in production",
              cc["flag"] and "CareConnect is not in production" in cc["text"])

        print("\n=== INFORMATION ARCHITECTURE ===")
        ia = await rf.evaluate("""() => {
            const ids = ['home','work','product-lab','ask','experience','education','certifications','contact','explore-details'];
            const pos = ids.map(i => document.getElementById(i));
            const ex = document.getElementById('explore-details');
            const inLab = ['constellation','atlas','evolution','thinking','challenge','lab','film']
                .every(i => ex.contains(document.getElementById(i)));
            return {missing: ids.filter((i, k) => !pos[k]),
                    ordered: pos.every((e, i) => i === 0 || (pos[i-1].compareDocumentPosition(e) & 4)),
                    inLab, labOrder: [...ex.querySelectorAll('section.mod')].map(s => s.id),
                    open: ex.open,
                    lab: [...document.querySelectorAll('#product-lab-mount .lab-card h3')].map(h => h.textContent)}; }""")
        check("sections exist and follow the brief's order (Hero → … → Contact → Explore the Lab)",
              not ia["missing"] and ia["ordered"], ia)
        check("corpus, Atlas, Evolution, How I Think, challenges, Lab Notes and the film are inside Explore the Lab",
              ia["inLab"], ia["labOrder"])
        check("the intro film is the last item in Explore the Lab", ia["labOrder"][-1:] == ["film"], ia["labOrder"])
        check("Explore the Lab is collapsed by default", ia["open"] is False)
        check("AI & Product Lab lists Aaroh, GharGyaan, Nexus, PhonePe and the 90-day corpus",
              ia["lab"] == ["Aaroh", "GharGyaan", "Nexus", "PhonePe Smart Spend Coach", "90-day product case-study corpus"], ia["lab"])
        await rf.evaluate("() => document.querySelector('a.navlink[href=\"#atlas\"]').click()")
        await rf.wait_for_timeout(500)
        check("a nav link into the lab opens Explore the Lab and lands on the section",
              await rf.evaluate("""() => document.getElementById('explore-details').open &&
                  Math.abs(document.getElementById('atlas').getBoundingClientRect().top) < 120"""))
        check("the constellation sizes itself once the lab is open",
              await rf.evaluate("() => { const c = document.getElementById('const-canvas'); return !!c && c.width > 0; }"))
        await rf.evaluate("() => { location.hash = '#case-aaroh'; }")
        await rf.wait_for_timeout(300)
        check("a link to a collapsed lab record opens it",
              await rf.evaluate("() => document.getElementById('more-aaroh').open"))

        print("\n=== STATUS LANGUAGE ===")
        st = await rf.evaluate("""() => {
            const P = GOS_CONTENT.projects, out = {};
            P.forEach(p => out[p.id] = p.status);
            const unfinished = P.filter(p => !['evamastu', 'live-your-best-life'].includes(p.id));
            const bad = [];
            const claim = /\\b(shipped|completed?|launched|went live|is live|now live|in production)\\b/i;
            const allowed = /\\b(not in production|not live|no live users|zero live users|not shipped)\\b/gi;
            unfinished.forEach(p => {
                const status = p.status.replace(allowed, '');
                if (/SHIPPED|COMPLETE|\\bLIVE\\b|IN PRODUCTION/.test(status)) bad.push(p.id + ' status: ' + p.status);
                const nodes = [document.getElementById('case-' + p.id), document.getElementById('lab-t-' + p.id)]
                    .filter(Boolean).map(n => n.closest('article') || n);
                nodes.forEach(n => { const t = n.textContent.replace(allowed, '');
                    const m = t.match(claim); if (m) bad.push(p.id + ': "' + m[0] + '"'); });
            });
            const kb = JSON.stringify(GOS_CONTENT.copilot_kb) + JSON.stringify(GOS_CONTENT.challenges) + JSON.stringify(GOS_CONTENT.lab_notes);
            return {statuses: out, bad, abRan: /A\\/B (test )?ran|ran \\d+ days/i.test(kb)}; }""")
        check("CareConnect's status is exactly 'MVP · NOT IN PRODUCTION'",
              st["statuses"]["careconnect"] == "MVP · NOT IN PRODUCTION", st["statuses"]["careconnect"])
        check("no unfinished project is called shipped, live, completed or in production",
              not st["bad"], st["bad"])
        check("Aaroh: in progress, strategy reset, zero live users, non-diagnostic",
              st["statuses"]["aaroh"] == "IN PROGRESS · STRATEGY RESET" and await rf.evaluate(
                  """() => { const t = document.getElementById('product-lab').textContent;
                      return /Eight consented practitioners/.test(t) && /zero live users/.test(t) && /non-diagnostic/.test(t); }"""),
              st["statuses"]["aaroh"])
        check("GharGyaan: concept, not live, 21 emergency categories, 214-case suite",
              st["statuses"]["ghargyaan"] == "CONCEPT · NOT LIVE" and await rf.evaluate(
                  """() => { const t = document.getElementById('product-lab').textContent;
                      return /21 emergency categories/.test(t) && /214-case evaluation suite/.test(t); }"""),
              st["statuses"]["ghargyaan"])
        check("PhonePe: A/B test designed, not run, and no text says it ran",
              st["statuses"]["phonepe"] == "CASE STUDY · A/B DESIGNED, NOT RUN" and not st["abRan"],
              [st["statuses"]["phonepe"], st["abRan"]])

        print("\n=== EDUCATION & CERTIFICATIONS ===")
        edu = await rf.evaluate("() => document.getElementById('education').innerText")
        for line in ("MCA — Chaudhary Charan Singh University, Meerut", "M.Sc. — S-VYASA University, Bengaluru",
                     "B.Sc. — University of Patanjali, Haridwar",
                     "AI-Enabled Product Management Program — Masai School with IIT Roorkee faculty"):
            check("education lists '" + line + "'", line in edu)
        for period in ("2022–2024", "2020–2022", "2017–2020", "Dec 2025–Aug 2026"):
            check("education carries the period " + period, period in edu)
        check("the superseded MCA institution appears nowhere",
              await rf.evaluate("() => !/Maharaja Agrasen/.test(document.body.innerHTML + JSON.stringify(GOS_CONTENT))"))
        check("every experience bullet from the CV is rendered verbatim",
              await rf.evaluate("""() => { const t = document.getElementById('experience').textContent;
                  return GOS_CONTENT.experience.every(e => e.bullets.every(b => t.includes(b))); }"""))
        certs = await rf.evaluate("() => document.getElementById('certifications').innerText")
        check("certifications keep the documented credential wording",
              all(x in certs for x in ("Claude Developer Platform", "Claude Agent Development",
                                       "Model Context Protocol (MCP)", "Claude Code Learning Path")), certs[:120])
        check("the learning path is not upgraded to a certification",
              await rf.evaluate("""() => { const g = [...document.querySelectorAll('#certifications .card')]
                  .find(c => /COURSES/.test(c.textContent)); return !!g && /Claude Code Learning Path/.test(g.textContent); }"""))

        pub = await rf.evaluate("""() => { const txt = (sel) => document.querySelector(sel).textContent;
            const all = document.documentElement.outerHTML + JSON.stringify(GOS_CONTENT);
            const ct = GOS_CONTENT.site_config.contact;
            const has = (t) => t.includes(ct.email) && t.includes(ct.linkedin) && t.includes(ct.github)
                               && t.includes('New Delhi');
            return {noTel: !document.querySelector('a[href^="tel:"]'),
                    noNumber: !/81275|12340|\\+91/.test(all), noField: !('phone' in ct),
                    contact: has(txt('#contact-mount')), rec: has(txt('#rec-contact'))}; }""")
        check("no phone number anywhere: no tel: link, not in the page, not in content.js",
              pub["noTel"] and pub["noNumber"] and pub["noField"], pub)
        check("Contact keeps email, LinkedIn, GitHub and New Delhi", pub["contact"], pub)
        check("Recruiter View contact keeps email, LinkedIn, GitHub and New Delhi", pub["rec"], pub)

        print("\n=== ASK GAURAV ===")
        SUGGESTED = ["What AI products has Gaurav built?", "How does Gaurav approach AI safety?",
                     "What makes him different from a generic PM?",
                     "Tell me about his IIT Roorkee product-management program.",
                     "What can Gaurav own end to end?", "Which projects are live, in progress, or not in production?"]
        ag = await page(1280, 1000, explore=False)
        got = await ag.evaluate("() => [...document.querySelectorAll('#prompts button')].map(b => b.textContent.trim())")
        check("Ask Gaurav offers the six suggested questions, in order", got == SUGGESTED, got)
        check("every knowledge-base answer has role, work, evidence and status",
              await ag.evaluate("() => GOS_CONTENT.copilot_kb.every(k => k.role && k.work && k.evidence && k.status)"))
        check("Ask Gaurav is reachable from the hero", await ag.evaluate("() => !!document.querySelector('#home-mount a[href=\"#ask\"]')"))
        for i, q in enumerate(SUGGESTED):
            await ag.evaluate("(i) => document.querySelectorAll('#prompts button')[i].click()", i)
            await ag.wait_for_function("() => !document.querySelector('#thread .typing')", timeout=5000)
            last = await ag.evaluate("""() => { const m = [...document.querySelectorAll('#thread .msg:not(.user)')].pop();
                return {dt: [...m.querySelectorAll('dl.answer dt')].map(d => d.textContent),
                        src: m.querySelectorAll('.src-row a').length,
                        dead: [...m.querySelectorAll('.src-row a')].filter(a => !document.querySelector(a.getAttribute('href'))).length}; }""")
            check("answer " + str(i + 1) + " gives ROLE, WORK, EVIDENCE, STATUS with live source links",
                  last["dt"] == ["ROLE", "WORK", "EVIDENCE", "STATUS"] and last["src"] > 0 and last["dead"] == 0, last)
        st_ans = await ag.evaluate("() => [...document.querySelectorAll('#thread .msg:not(.user)')].pop().textContent")
        check("the status answer gives CareConnect's exact label and says only Evamastu shipped",
              "MVP · NOT IN PRODUCTION" in st_ans and "Only Evamastu shipped" in st_ans)
        for q in ("What is Gaurav's favourite programming language?", "Where did Gaurav go to school as a child?",
                  "How much revenue does Aaroh make?"):
            await ag.fill("#ask-input", q)
            await ag.press("#ask-input", "Enter")
            await ag.wait_for_function("() => !document.querySelector('#thread .typing')", timeout=5000)
            t = await ag.evaluate("() => [...document.querySelectorAll('#thread .msg:not(.user)')].pop().textContent")
            check("undocumented question refused, not inferred: " + q[:38], "isn't documented" in t and "ROLE" not in t, t[:80])
        kb = await ag.evaluate("""() => ['who built Aaroh and is it live', 'tell me about evamastu', 'how does he deliver work',
                                        'what was his live your best life research'].map(q => (GOS.askMatch(q) || {}).id || null)""")
        check("free-typed questions reach the right documented answer", kb == ["kb-ai-products", "kb-end-to-end", "kb-end-to-end", "kb-different"], kb)
        # keyboard: Tab to a suggested question and press Enter
        await ag.evaluate("() => document.querySelector('#prompts button').focus()")
        n_before = await ag.evaluate("() => document.querySelectorAll('#thread .msg').length")
        await ag.keyboard.press("Enter")
        await ag.wait_for_function("() => !document.querySelector('#thread .typing')", timeout=5000)
        check("a suggested question answers from the keyboard",
              await ag.evaluate("() => document.querySelectorAll('#thread .msg').length") == n_before + 2)
        await ag.evaluate("() => document.getElementById('hero-recruiter').click()")
        await ag.wait_for_timeout(400)
        await ag.evaluate("() => document.getElementById('rec-ask').click()")
        await ag.wait_for_timeout(900)
        check("Recruiter View has an Ask Gaurav button that lands on the copilot",
              await ag.evaluate("""() => document.documentElement.getAttribute('data-mode') === 'lab' &&
                  document.activeElement && document.activeElement.id === 'ask-input'"""))
        await ag.screenshot(path=str(OUT / "ask.png"))
        await ag.close()

        print("\n=== MARGIN ART, FOCUS, REDUCED MOTION ===")
        for w, h in ((1440, 900), (1280, 800)):
            mc = await b.new_context(viewport={"width": w, "height": h})
            mp = await mc.new_page()
            await mp.goto(URL); await mp.wait_for_timeout(1200)
            ma = await mp.evaluate("""() => { const a = document.querySelector('.margin-art');
                const shown = getComputedStyle(a).display !== 'none';
                const r = a.getBoundingClientRect();
                const text = [...document.querySelectorAll('main .wrap')].map(e => e.getBoundingClientRect())
                    .filter(b => b.width > 0);
                const right = Math.max(...text.map(b => b.right));
                return {shown, left: r.left, right, aria: a.getAttribute('aria-hidden'),
                        clear: !shown || r.left >= right}; }""")
            check(f"{w}: the GAURAV.OS watermark sits only in the margin, never behind text",
                  ma["clear"] and ma["aria"] == "true", ma)
            if w == 1440:
                check("1440: the watermark and motif are shown where the margin can hold them", ma["shown"], ma)
            else:
                check("1280: the watermark is hidden where the margin is too narrow", not ma["shown"], ma)
            await mc.close()
        fk = await page(1280, 1000, explore=False)
        await fk.keyboard.press("Tab"); await fk.keyboard.press("Tab")
        ring = await fk.evaluate("""() => { const a = document.activeElement, c = getComputedStyle(a);
            return {tag: a.tagName, fv: a.matches(':focus-visible'), style: c.outlineStyle, w: c.outlineWidth}; }""")
        check("keyboard focus is visible", ring["fv"] and ring["style"] != "none" and ring["w"] not in ("0px", ""), ring)
        await fk.close()
        rm2 = await page(1280, 1000, reduced=True, explore=False)
        mot = await rm2.evaluate("""() => ({
            btn: getComputedStyle(document.querySelector('.btn')).transitionDuration,
            intro: !!document.querySelector('.intro video'),
            smooth: getComputedStyle(document.documentElement).scrollBehavior,
            pulse: getComputedStyle(document.querySelector('.pulse')).animationIterationCount})""")
        check("reduced motion: transitions effectively off, no smooth scroll, no repeating animation, no film",
              all(float(x.rstrip("s")) < 0.01 for x in mot["btn"].split(",")) and mot["smooth"] == "auto"
              and mot["pulse"] == "1" and not mot["intro"], mot)
        await rm2.close()

        print("\n=== ACCESSIBILITY ===")
        a11y = await rf.evaluate("""() => {
            const L = (c) => { const m = c.match(/\\d+(\\.\\d+)?/g).slice(0, 3).map(Number).map(v => v / 255)
                .map(v => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
                return 0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2]; };
            const cr = (a, b) => { const x = L(a), y = L(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
            const probe = (v) => { const d = document.createElement('i'); d.style.color = 'var(' + v + ')';
                document.body.appendChild(d); const c = getComputedStyle(d).color; d.remove(); return c; };
            const out = {};
            for (const mode of ['lab', 'recruiter']) {
                document.documentElement.setAttribute('data-mode', mode);
                const bg = probe('--panel-2');
                out[mode] = ['--dim', '--muted', '--gold', '--jade', '--text'].map(v => [v, +cr(probe(v), bg).toFixed(2)]);
            }
            document.documentElement.setAttribute('data-mode', 'lab');
            const small = [...document.querySelectorAll('.lab-only *')].filter(e =>
                e.childNodes.length && [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()) &&
                e.getClientRects().length && parseFloat(getComputedStyle(e).fontSize) < 10)
                .map(e => e.className + ':' + getComputedStyle(e).fontSize);
            const skip = document.querySelector('a.skip');
            return {contrast: out, small: small.slice(0, 5), nSmall: small.length,
                    skip: !!skip && skip.getAttribute('href') === '#main' && !!document.querySelector('main#main'),
                    unlabeled: [...document.querySelectorAll('button')].filter(b =>
                        b.getClientRects().length && !(b.textContent.trim() || b.getAttribute('aria-label'))).length,
                    imgs: [...document.querySelectorAll('img')].filter(i => !i.hasAttribute('alt')).length,
                    lang: document.documentElement.lang}; }""")
        worst = min(v for m in a11y["contrast"].values() for _, v in m)
        check("every text colour token meets WCAG AA (4.5:1) on the darkest panel, both themes",
              worst >= 4.5, a11y["contrast"])
        check("no visible text smaller than 10px", a11y["nSmall"] == 0, a11y["small"])
        check("skip link targets the main landmark", a11y["skip"])
        check("every visible button has an accessible name", a11y["unlabeled"] == 0, a11y["unlabeled"])
        check("every image declares alt text", a11y["imgs"] == 0, a11y["imgs"])
        tb = await page(1280, 1000)
        await tb.keyboard.press("Tab")
        check("the first Tab lands on the skip link",
              await tb.evaluate("() => document.activeElement && document.activeElement.classList.contains('skip')"))
        await tb.keyboard.press("Enter")
        await tb.wait_for_timeout(300)
        check("the skip link moves focus into main",
              await tb.evaluate("() => !!document.activeElement.closest('main')"))
        await tb.close()
        acc = await rf.evaluate("""() => [...document.querySelectorAll('.acc-btn')].every(b =>
            b.getAttribute('aria-controls') && document.getElementById(b.getAttribute('aria-controls')))""")
        check("every accordion button names the panel it controls", acc)
        await rf.close()

        print("\n=== TABLET / MOBILE ===")
        for w, h, name in ((1440, 900, "xl"), (1280, 800, "d"), (1024, 900, "l"), (768, 1024, "t"), (390, 844, "m"), (360, 800, "xs")):
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

            # accessibility at this width: the same criteria the 1280 audit applies,
            # re-measured here because type, layout and visibility change by breakpoint
            await pg.evaluate("() => { document.querySelectorAll('section.mod').forEach(s => s.scrollIntoView()); window.scrollTo(0, 0); }")
            await pg.wait_for_timeout(500)
            aw = await pg.evaluate("""() => {
                const shown = (e) => e.getClientRects().length > 0 && getComputedStyle(e).visibility !== 'hidden';
                const small = [...document.querySelectorAll('body *')].filter(e => shown(e) &&
                    [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()) &&
                    parseFloat(getComputedStyle(e).fontSize) < 10).map(e => e.className + ':' + getComputedStyle(e).fontSize);
                const nameless = [...document.querySelectorAll('button, a[href]')].filter(e => shown(e) &&
                    !(e.textContent.trim() || e.getAttribute('aria-label'))).map(e => e.outerHTML.slice(0, 60));
                return {small: small.slice(0, 4), nSmall: small.length, nameless: nameless.slice(0, 3),
                        noAlt: document.querySelectorAll('img:not([alt])').length,
                        h1: [...document.querySelectorAll('h1')].filter(shown).map(x => x.textContent.trim()),
                        skip: !!document.querySelector('a.skip[href="#main"]') && !!document.querySelector('main#main')}; }""")
            check(f"{w} a11y: no visible text under 10px", aw["nSmall"] == 0, aw["small"])
            check(f"{w} a11y: every visible button and link has an accessible name", not aw["nameless"], aw["nameless"])
            check(f"{w} a11y: every image declares alt text", aw["noAlt"] == 0, aw["noAlt"])
            check(f"{w} a11y: one visible h1, the name", aw["h1"] == ["Gaurav Kumar Singh"], aw["h1"])
            check(f"{w} a11y: skip link and main landmark present", aw["skip"])
            await pg.evaluate("() => document.getElementById('top-recruiter').offsetParent ? document.getElementById('top-recruiter').click() : document.getElementById('rail-recruiter').click()")
            await pg.wait_for_timeout(500)
            orc = await pg.evaluate(PROBE)
            rh1 = await pg.evaluate("() => [...document.querySelectorAll('h1')].filter(e => e.getClientRects().length).map(x => x.textContent.trim())")
            check(f"{w} Recruiter Mode: no horizontal overflow", orc[0] <= orc[1], orc)
            check(f"{w} Recruiter Mode: one visible h1, the name", rh1 == ["Gaurav Kumar Singh"], rh1)
            await pg.screenshot(path=str(OUT / f"{name}-recruiter.png"))
            await pg.close()

        check("no console/page errors", not errs, errs[:4])
        print("\n" + "=" * 46)
        print("PASSED %d / %d" % (sum(RESULTS.values()), len(RESULTS)))
        bad = [k for k, v in RESULTS.items() if not v]
        if bad:
            print("FAILING:", bad)
        await b.close()
        _httpd.shutdown()

asyncio.run(main())
