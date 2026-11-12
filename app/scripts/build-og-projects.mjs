#!/usr/bin/env node
// Social preview cards (1200×630 PNG) for the 7 project worlds and project pages, built only from
// existing approved art (brand artwork or the original 3D render) and the projects' own text in
// src/content (name, status, subtitle). Output: public/og/<slug>.png. Run: node scripts/build-og-projects.mjs
import { createServer } from "vite";
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const vite = await createServer({ root: APP, configFile: false, logLevel: "error", resolve: { alias: { "~": path.join(APP, "src") } }, server: { middlewareMode: true, hmr: false }, appType: "custom", optimizeDeps: { noDiscovery: true } });
const { worlds } = await vite.ssrLoadModule("/src/content/universe.ts");
const { profile } = await vite.ssrLoadModule("/src/content/profile.ts");
const { THIRD_PARTY_MARK } = await vite.ssrLoadModule("/src/content/cinematic.ts");
await vite.close();

const MIME = { ".woff2": "font/woff2", ".webp": "image/webp" };
const url = (p) => `data:${MIME[path.extname(p)]};base64,${fs.readFileSync(path.join(APP, p)).toString("base64")}`;
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
// a third party's mark never goes on a share card: such projects use the original 3D render
const artFor = (slug) => {
  const brand = `public/cinematic/brand-${slug}-1200.webp`, render = `public/cinematic/render-project-${slug}-1200.webp`;
  if (!THIRD_PARTY_MARK[slug] && fs.existsSync(path.join(APP, brand))) return brand;
  return fs.existsSync(path.join(APP, render)) ? render : null;
};
const fonts = `@font-face{font-family:Inter;src:url(${url("node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2")})}
@font-face{font-family:SG;font-weight:700;src:url(${url("node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-700-normal.woff2")})}
@font-face{font-family:Mono;src:url(${url("node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2")})}`;

fs.mkdirSync(path.join(APP, "public/og"), { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const w of worlds) {
  const art = artFor(w.slug);
  const note = THIRD_PARTY_MARK[w.slug] ? `<div class="n">${esc(THIRD_PARTY_MARK[w.slug])}</div>` : "";
  await page.setContent(`<!doctype html><meta charset="utf-8"><style>${fonts}
*{margin:0;box-sizing:border-box}body{width:1200px;height:630px;background:#0B1110;position:relative;overflow:hidden;font-family:Inter;color:#F3F6F4}
img{position:absolute;right:28px;top:50%;transform:translateY(-50%);width:560px;height:400px;object-fit:cover;border-radius:26px;box-shadow:0 30px 80px rgba(0,0,0,.6)}
.t{position:absolute;left:64px;top:0;bottom:0;width:520px;display:flex;flex-direction:column;justify-content:center}
.s{display:inline-block;align-self:flex-start;font:500 15px Mono;letter-spacing:.14em;color:#6BE39A;border:1px solid rgba(107,227,154,.5);border-radius:999px;padding:6px 14px;text-transform:uppercase}
h1{margin-top:22px;font:700 66px/1.02 SG;letter-spacing:-1.2px}
p{margin-top:18px;font-size:26px;line-height:1.35;color:#C9D2CD}
.f{margin-top:30px;font:500 15px Mono;letter-spacing:.24em;color:#8FA39B;text-transform:uppercase}
.n{margin-top:14px;font-size:15px;line-height:1.4;color:#F2C14E}
</style>${art ? `<img src="${url(art)}">` : ""}
<div class="t"><div class="s">${esc(w.statusLabel)}</div><h1>${esc(w.name)}</h1><p>${esc(w.category)}</p>${note}<div class="f">${esc(profile.name)} · Gaurav.OS</div></div>`, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  const out = path.join(APP, `public/og/${w.slug}.png`);
  await page.screenshot({ path: out });
  console.log(`og: ${w.slug} (${art ? path.basename(art) : "no art"}) -> ${fs.statSync(out).size} bytes`);
}
await browser.close();
