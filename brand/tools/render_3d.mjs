#!/usr/bin/env node
/** Renders the procedural 3D scenes in brand/renders/scenes.js to PNG stills
 *  (3200×2000) in brand/renders/.cache/; build_cinematic.py downsamples them into brand/renders/source/.
 *  Usage: node brand/tools/render_3d.mjs [id ...]   (run from the repo root)
 *  Needs Playwright's Chromium; WebGL runs on SwiftShader, so no GPU is required. */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const require = createRequire(path.join(ROOT, "app/package.json"));
const { chromium } = require("playwright");
const THREE = path.join(ROOT, "app/node_modules/three");
const OUT = path.join(ROOT, "brand/renders/.cache"); // full-size PNGs; build_cinematic.py turns them into the committed WebP sources
fs.mkdirSync(OUT, { recursive: true });

const page = `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;background:#0b1110}canvas{display:block}</style>
<script type="importmap">{"imports":{"three":"/three/build/three.module.js","three/addons/":"/three/examples/jsm/"}}</script>
<script type="module">import { render, ids } from "/scenes.js"; window.__render = render; window.__ids = ids; window.__ready = true;</script>`;
const server = http.createServer((req, res) => {
  const u = decodeURIComponent(req.url.split("?")[0]);
  let file = null;
  if (u === "/") { res.writeHead(200, { "content-type": "text/html" }); return res.end(page); }
  if (u === "/scenes.js") file = path.join(ROOT, "brand/renders/scenes.js");
  else if (u.startsWith("/three/")) file = path.join(THREE, u.slice(7));
  if (!file || !file.startsWith(ROOT) || !fs.existsSync(file)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "content-type": "text/javascript" }); fs.createReadStream(file).pipe(res);
}).listen(0, "127.0.0.1");
await new Promise((r) => server.once("listening", r));
const port = server.address().port;

const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
const p = await ctx.newPage();
const errors = []; p.on("pageerror", (e) => errors.push(e.message)); p.on("console", (m) => m.type() === "error" && errors.push(m.text()));
await p.goto(`http://127.0.0.1:${port}/`);
await p.waitForFunction(() => window.__ready, null, { timeout: 30000 });
const ids = process.argv.slice(2).length ? process.argv.slice(2) : await p.evaluate(() => window.__ids);
for (const id of ids) {
  const t = Date.now();
  const data = await p.evaluate(async (id) => { document.querySelectorAll("canvas").forEach((c) => c.remove()); return await window.__render(id); }, id);
  const file = path.join(OUT, `render-${id}.png`);
  fs.writeFileSync(file, Buffer.from(data.split(",")[1], "base64"));
  console.log(`${id}: ${Math.round(fs.statSync(file).size / 1024)} KB in ${Date.now() - t} ms`);
}
await browser.close(); server.close();
if (errors.length) { console.error("Render errors:\n" + errors.join("\n")); process.exit(1); }
