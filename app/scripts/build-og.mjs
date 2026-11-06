// Renders the Open Graph / social card (1200×630 PNG) from the owner's Gaurav.OS
// logo plus real text, so the public name and tagline stay in sync with
// src/content/profile.ts. Output: ../brand/preview/og-default-1200x630.png
// (copied to public/og-default.png by prepare-data). Run: node scripts/build-og.mjs
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
// embedded as data URIs: a page set from a string cannot load file:// resources
const MIME = { ".woff2": "font/woff2", ".webp": "image/webp" };
const url = (p) => `data:${MIME[path.extname(p)]};base64,${fs.readFileSync(path.join(APP, p)).toString("base64")}`;
const src = fs.readFileSync(path.join(APP, "src/content/profile.ts"), "utf8");
const pick = (k) => src.match(new RegExp(`\\b${k}: "([^"]+)"`))[1];
const [name, brandLine, tagline] = [pick("name"), pick("brandLine"), pick("tagline")];
const html = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:Inter;src:url(${url("node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2")})}
@font-face{font-family:SG;font-weight:700;src:url(${url("node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-700-normal.woff2")})}
@font-face{font-family:Mono;src:url(${url("node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2")})}
*{margin:0;box-sizing:border-box}body{width:1200px;height:630px;background:#0B1110;position:relative;overflow:hidden;font-family:Inter;color:#F3F6F4}
img{position:absolute;right:24px;top:50%;transform:translateY(-50%);width:600px;height:400px;object-fit:cover;object-position:50% 46%;border-radius:28px;box-shadow:0 0 0 1px rgb(107 227 154/.25),0 30px 80px -20px rgb(0 0 0/.8)}
.fade{display:none}
.t{position:absolute;left:72px;top:0;bottom:0;width:520px;display:flex;flex-direction:column;justify-content:center}
.line{font:500 16px Mono;letter-spacing:.3em;color:#6BE39A}
h1{margin-top:22px;font:700 72px/1 SG;letter-spacing:-1.5px}
p{margin-top:24px;font-size:27px;line-height:1.35;color:#C9D2CD;width:480px}
</style><img src="${url("public/cinematic/brand-gaurav-os-logo-1200.webp")}"><div class="fade"></div>
<div class="t"><div class="line">PORTFOLIO</div><h1>${name}</h1><p>${tagline}</p></div>`;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
const out = path.join(APP, "../brand/preview/og-default-1200x630.png");
await page.screenshot({ path: out });
await browser.close();
console.log(`og: ${name} · ${brandLine} -> ${path.relative(process.cwd(), out)} (${fs.statSync(out).size} bytes)`);
