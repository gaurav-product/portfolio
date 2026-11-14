#!/usr/bin/env node
/** Full-site audit of the built site (serve it first: npm run preview).
 *  For every prerendered route: axe-core WCAG violations, console errors, one <h1>, no skipped
 *  heading levels, duplicate ids, images without alt or failing to load, horizontal overflow.
 *  Usage: node scripts/a11y-audit.cjs <out.json> <desktop|mobile> [concurrency]
 *  Exits 1 if any axe violation, duplicate id, heading problem or overflow is found. */
const { chromium, devices } = require('playwright');
const fs = require('fs');
const axe = fs.readFileSync(require('path').join(__dirname, '../node_modules/axe-core/axe.min.js'), 'utf8');
const routes = JSON.parse(fs.readFileSync(require('path').join(__dirname, '../build/routes.json'), 'utf8'));
const [,, out, vp, conc] = process.argv;
(async () => {
  const b = await chromium.launch();
  const ctxOpts = vp === 'mobile' ? { ...devices['Pixel 7'], deviceScaleFactor: 1 } : { viewport: { width: 1440, height: 900 } };
  const results = []; let i = 0;
  async function worker() {
    const c = await b.newContext(ctxOpts);
    while (i < routes.length) {
      const r = routes[i++]; const p = await c.newPage(); const errs = [];
      p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
      try {
        const resp = await p.goto('http://127.0.0.1:4173' + r + (r === '/' ? '?nointro' : ''), { waitUntil: 'networkidle', timeout: 30000 });
        await p.addScriptTag({ content: axe });
        const a = await p.evaluate(async () => {
          const res = await axe.run(document, { resultTypes: ['violations'] });
          const v = res.violations.map(x => ({ id: x.id, impact: x.impact, n: x.nodes.length, sample: x.nodes[0]?.target?.join(' ') }));
          const hs = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(h => h.offsetParent !== null || getComputedStyle(h).position==='fixed');
          const levels = hs.map(h => +h.tagName[1]); let skip = 0; for (let k = 1; k < levels.length; k++) if (levels[k] - levels[k-1] > 1) skip++;
          const imgs = [...document.images].filter(im => !im.hasAttribute('alt')).length;
          const broken = [...document.images].filter(im => im.complete && im.naturalWidth === 0 && im.loading !== 'lazy' && im.offsetParent).map(im => im.currentSrc || im.src).slice(0,3);
          const ids = {}; document.querySelectorAll('[id]').forEach(e => ids[e.id] = (ids[e.id]||0)+1);
          const dupIds = Object.entries(ids).filter(([,n]) => n>1).map(([k])=>k);
          const internal = [...document.querySelectorAll('a[href^="/"], a[href^="#"]')].map(a => a.getAttribute('href'));
          const hashMissing = internal.filter(h => h.startsWith('#') && h.length>1 && !document.getElementById(decodeURIComponent(h.slice(1))));
          const smallTargets = [...document.querySelectorAll('a,button,input,select,textarea')].filter(e => { const r = e.getBoundingClientRect(); return r.width>0 && r.height>0 && (r.height<24 || r.width<24) && getComputedStyle(e).display!=='inline'; }).length;
          return { v, title: document.title, desc: document.querySelector('meta[name=description]')?.content || '', h1: document.querySelectorAll('h1').length, skip, imgs, broken, dupIds, hashMissing, overflow: document.documentElement.scrollWidth > Math.min(innerWidth, screen.width) + 1, smallTargets, internal: [...new Set(internal.filter(h=>h.startsWith('/')).map(h=>h.split('#')[0].split('?')[0]))] };
        });
        results.push({ r, status: resp.status(), errs, ...a });
      } catch (e) { results.push({ r, fail: String(e).slice(0, 200) }); }
      await p.close();
    }
    await c.close();
  }
  await Promise.all(Array.from({ length: +conc || 4 }, worker));
  await b.close();
  fs.writeFileSync(out, JSON.stringify(results));
  const ok = results.filter((x) => !x.fail);
  const problems = ok.flatMap((x) => [
    ...x.v.map((v) => `${x.r}: axe ${v.id} (${v.impact}) ×${v.n} — ${v.sample}`),
    ...(x.h1 !== 1 ? [`${x.r}: ${x.h1} h1 elements`] : []), ...(x.skip ? [`${x.r}: ${x.skip} skipped heading level(s)`] : []),
    ...x.dupIds.map((d) => `${x.r}: duplicate id "${d}"`), ...(x.overflow ? [`${x.r}: horizontal overflow`] : []),
    ...(x.imgs ? [`${x.r}: ${x.imgs} image(s) without alt`] : []),
  ]).concat(results.filter((x) => x.fail).map((x) => `${x.r}: failed to load — ${x.fail}`));
  console.log(`${vp}: ${results.length} routes audited, ${problems.length} problem(s)`);
  problems.slice(0, 40).forEach((p) => console.log(' - ' + p));
  process.exit(problems.length ? 1 : 0);
})();
