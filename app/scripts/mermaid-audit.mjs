#!/usr/bin/env node
/** Renders every study page that contains Mermaid diagrams and counts which render. */
import { chromium } from "@playwright/test";
import fs from "node:fs";
import { start } from "./serve.mjs";
const s = await start(4550);
const local = process.env.CHROME_PATH || "/opt/pw-browsers/chromium";
const b = await chromium.launch(fs.existsSync(local) ? { executablePath: local } : {});
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
let total = 0, ok = 0; const failed = [];
for (let d = 1; d <= 90; d++) {
  const j = JSON.parse(fs.readFileSync(`src/data/generated/studies/${d}.json`, "utf8"));
  if (!j.mermaid) continue;
  await p.goto(`http://127.0.0.1:4550/research/${d}`, { waitUntil: "networkidle" });
  await p.waitForFunction(() => [...document.querySelectorAll("figure.mermaid-block")].every((f) => f.getAttribute("data-done")), null, { timeout: 30000 }).catch(() => {});
  const r = await p.evaluate(() => ({ n: document.querySelectorAll("figure.mermaid-block").length, ok: document.querySelectorAll('figure.mermaid-block[data-done="1"]').length }));
  total += r.n; ok += r.ok; if (r.ok < r.n) failed.push(`Day ${d}: ${r.n - r.ok}/${r.n}`);
}
console.log(`mermaid: ${ok}/${total} diagrams rendered; source shown for the rest — ${failed.join(", ") || "none"}`);
await b.close(); s.close();
