#!/usr/bin/env node
/** Measures what a first desktop visit downloads while the intro film plays. */
import { chromium } from "@playwright/test";
import fs from "node:fs";
import { start } from "./serve.mjs";
const s = await start(4530);
const local = process.env.CHROME_PATH || "/opt/pw-browsers/chromium";
const b = await chromium.launch(fs.existsSync(local) ? { executablePath: local } : {});
for (const [label, w] of [["desktop first visit", 1440], ["mobile first visit", 390]]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  const bytes = {}; let total = 0;
  p.on("response", async (r) => { try { const n = (await r.body()).length; total += n; if (/\.mp4/.test(r.url())) bytes[r.url().split("/").pop()] = (bytes[r.url().split("/").pop()] || 0) + n; } catch {} });
  await p.goto("http://127.0.0.1:4530/", { waitUntil: "networkidle" });
  await p.waitForTimeout(20000);
  const src = await p.evaluate(() => document.querySelector("video")?.currentSrc?.split("/").pop() ?? "none");
  console.log(`${label}: playing=${src} film bytes=${JSON.stringify(Object.fromEntries(Object.entries(bytes).map(([k, v]) => [k, (v / 1048576).toFixed(2) + " MB"])))} total=${(total / 1048576).toFixed(2)} MB`);
  await p.close();
}
await b.close(); s.close();
