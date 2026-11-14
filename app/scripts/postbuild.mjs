#!/usr/bin/env node
/** After `react-router build`: robots.txt, sitemap.xml (when SITE_URL is set),
 *  a static 404.html, and .nojekyll for GitHub Pages. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(APP, "build/client");
const SITE = (process.env.VITE_SITE_URL || "").replace(/\/$/, "");

// With a basename, React Router nests prerendered HTML under build/client/<base>/.
// Hosts serve build/client AT the base path, so hoist those files to the root.
const BASE = (process.env.BASE_PATH || "/").replace(/^\/|\/$/g, "");
if (BASE && fs.existsSync(path.join(OUT, BASE))) {
  const nested = path.join(OUT, BASE);
  for (const f of fs.readdirSync(nested)) fs.cpSync(path.join(nested, f), path.join(OUT, f), { recursive: true, force: true });
  fs.rmSync(nested, { recursive: true, force: true });
  console.log(`postbuild: hoisted prerendered pages from /${BASE}/ to the build root`);
}

const pages = [];
(function walk(dir) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) walk(p);
    else if (f.name === "index.html") pages.push("/" + path.relative(OUT, path.dirname(p)).split(path.sep).join("/"));
  }
})(OUT);
const routes = pages.map((p) => (p === "/" ? "/" : p.replace(/\/$/, ""))).sort();

// The stylesheet is the only render-blocking request, but React emits ~15 modulepreload hints
// ahead of it in <head>, so on slow links it queues behind the scripts. A preload hint at the very
// top of <head> starts it first. React 19 skips unknown tags in <head> during hydration.
// The display face (Space Grotesk 500/700: every h1 and the hero line) is preloaded too. Found from
// the font CSS, it arrives late on slow links and the swap re-wraps the heading, pushing the page
// down (measured: 0.01–0.08 CLS on the phone homepage). Latin subset only; ~2 × 20 KB.
const FONTS = fs.readdirSync(path.join(OUT, "assets")).filter((f) => /^space-grotesk-latin-(500|700)-normal-.*\.woff2$/.test(f));
let hinted = 0;
for (const p of pages) {
  const file = path.join(OUT, p, "index.html");
  const html = fs.readFileSync(file, "utf8");
  if (html.includes('data-css-hint')) continue;
  const css = [...html.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map((m) => m[1]);
  if (!css.length) continue;
  const assets = css[0].slice(0, css[0].lastIndexOf("assets/") + "assets/".length); // keeps BASE_PATH
  const hint = css.map((h) => `<link rel="preload" as="style" href="${h}" data-css-hint=""/>`).join("")
    + FONTS.map((f) => `<link rel="preload" as="font" type="font/woff2" href="${assets}${f}" crossorigin=""/>`).join("");
  fs.writeFileSync(file, html.replace(/<head>/, `<head>${hint}`)); hinted++;
}
console.log(`postbuild: stylesheet preload hint added to ${hinted} pages`);

fs.writeFileSync(path.join(OUT, "robots.txt"), `User-agent: *\nAllow: /\n${SITE ? `Sitemap: ${SITE}/sitemap.xml\n` : ""}`);
// the sitemap lists only pages meant to be indexed: old /universe/<slug> redirect pages carry robots "noindex"
const indexable = routes.filter((r) => !/<meta name="robots" content="noindex"/.test(fs.readFileSync(path.join(OUT, r === "/" ? "" : r, "index.html"), "utf8")));
if (SITE) {
  fs.writeFileSync(path.join(OUT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexable.map((r) => `  <url><loc>${SITE}${r === "/" ? "/" : r}</loc></url>`).join("\n")}\n</urlset>\n`);
} else console.warn("postbuild: VITE_SITE_URL not set — sitemap.xml and canonical URLs skipped (set it for production).");
// Static hosts serve 404.html for unknown paths; the SPA shell renders the 404 route.
if (fs.existsSync(path.join(OUT, "__spa-fallback.html"))) fs.copyFileSync(path.join(OUT, "__spa-fallback.html"), path.join(OUT, "404.html"));
else fs.copyFileSync(path.join(OUT, "index.html"), path.join(OUT, "404.html"));
fs.writeFileSync(path.join(OUT, ".nojekyll"), "");
fs.writeFileSync(path.join(APP, "build/routes.json"), JSON.stringify(routes, null, 1));
console.log(`postbuild: ${routes.length} prerendered routes`);
