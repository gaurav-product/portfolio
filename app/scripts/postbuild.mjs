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

fs.writeFileSync(path.join(OUT, "robots.txt"), `User-agent: *\nAllow: /\n${SITE ? `Sitemap: ${SITE}/sitemap.xml\n` : ""}`);
if (SITE) {
  fs.writeFileSync(path.join(OUT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((r) => `  <url><loc>${SITE}${r === "/" ? "/" : r}</loc></url>`).join("\n")}\n</urlset>\n`);
} else console.warn("postbuild: VITE_SITE_URL not set — sitemap.xml and canonical URLs skipped (set it for production).");
// Static hosts serve 404.html for unknown paths; the SPA shell renders the 404 route.
if (fs.existsSync(path.join(OUT, "__spa-fallback.html"))) fs.copyFileSync(path.join(OUT, "__spa-fallback.html"), path.join(OUT, "404.html"));
else fs.copyFileSync(path.join(OUT, "index.html"), path.join(OUT, "404.html"));
fs.writeFileSync(path.join(OUT, ".nojekyll"), "");
fs.writeFileSync(path.join(APP, "build/routes.json"), JSON.stringify(routes, null, 1));
console.log(`postbuild: ${routes.length} prerendered routes`);
