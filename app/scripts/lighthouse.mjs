#!/usr/bin/env node
/** Runs Lighthouse on representative routes (mobile + desktop) against the
 *  built site and writes reports/lighthouse/summary.{json,md}. */
import fs from "node:fs";
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import { start } from "./serve.mjs";

const ROUTES = process.env.LH_ROUTES ? process.env.LH_ROUTES.split(",") : ["/", "/?nointro", "/recruiter", "/projects/careconnect", "/product-thinking/rice", "/research", "/research/90", "/ai-lab", "/explore", "/about", "/districts/ai-safety-lab"];
const server = await start(4410);
const chrome = await chromeLauncher.launch({ chromePath: process.env.CHROME_PATH || (fs.existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined), chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu"] });
fs.mkdirSync("reports/lighthouse", { recursive: true });
const rows = [];
const FORMS = process.env.LH_FORMS ? process.env.LH_FORMS.split(",") : ["mobile", "desktop"];
for (const formFactor of FORMS) {
  for (const route of ROUTES) {
    const config = formFactor === "desktop"
      ? { extends: "lighthouse:default", settings: { formFactor: "desktop", screenEmulation: { mobile: false, width: 1440, height: 900, deviceScaleFactor: 1, disabled: false }, throttling: { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1, requestLatencyMs: 0, downloadThroughputKbps: 0, uploadThroughputKbps: 0 } } }
      : { extends: "lighthouse:default" };
    const r = await lighthouse(`http://127.0.0.1:4410${route}`, { port: chrome.port, output: "html", logLevel: "error" }, config);
    const c = r.lhr.categories, a = r.lhr.audits;
    const row = { formFactor, route, performance: Math.round(c.performance.score * 100), accessibility: Math.round(c.accessibility.score * 100), bestPractices: Math.round(c["best-practices"].score * 100), seo: Math.round(c.seo.score * 100),
      lcp: a["largest-contentful-paint"].displayValue, cls: a["cumulative-layout-shift"].displayValue, tbt: a["total-blocking-time"].displayValue, weight: a["total-byte-weight"].displayValue,
      failing: Object.values(a).filter((x) => x.score !== null && x.score < 0.9 && ["accessibility", "seo", "best-practices"].some((k) => r.lhr.categories[k].auditRefs.some((ref) => ref.id === x.id && ref.weight > 0))).map((x) => x.id) };
    rows.push(row);
    fs.writeFileSync(`reports/lighthouse/${formFactor}-${route.replace(/[/?]/g, "_") || "home"}.html`, r.report);
    console.log(formFactor, route, row.performance, row.accessibility, row.bestPractices, row.seo, row.lcp, row.cls, row.tbt, row.weight, row.failing.join(","));
  }
}
const partial = !!(process.env.LH_ROUTES || process.env.LH_FORMS); // spot checks never overwrite the full summary
if (!partial) fs.writeFileSync("reports/lighthouse/summary.json", JSON.stringify(rows, null, 1));
const md = `# Lighthouse — actual results\n\nLighthouse ${(await import("lighthouse/package.json", { with: { type: "json" } })).default.version}, run ${new Date().toISOString()} against the production build served locally with gzip (as static hosts serve it), no CDN, no HTTP/2. Mobile uses Lighthouse's default throttling (slow 4G, 4× CPU).\n\n| Form factor | Route | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT | Page weight | Audits below 90 |\n|---|---|---|---|---|---|---|---|---|---|---|\n` +
  rows.map((r) => `| ${r.formFactor} | \`${r.route}\` | ${r.performance} | ${r.accessibility} | ${r.bestPractices} | ${r.seo} | ${r.lcp} | ${r.cls} | ${r.tbt} | ${r.weight} | ${r.failing.join(", ") || "—"} |`).join("\n") + "\n";
if (!partial) fs.writeFileSync("reports/lighthouse/summary.md", md);
await chrome.kill(); server.close();
