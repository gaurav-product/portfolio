/** QA helper: screenshots of key routes at 1440 and 390, reporting overflow and console errors.
 *  node scripts/screens.mjs <outdir> */
import { chromium } from "@playwright/test";
import { start } from "./serve.mjs";
const out = process.argv[2];
const server = await start(4300);
const b = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
const pages = ["/?nointro", "/recruiter", "/projects", "/projects/ghargyaan", "/product-thinking/rice", "/explore", "/atlas", "/ask", "/skills", "/research"];
for (const [w, h, tag] of [[1440, 900, "d"], [390, 844, "m"]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h } });
  const p = await ctx.newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push(e.message)); p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  for (const u of pages) {
    await p.goto("http://127.0.0.1:4300" + u, { waitUntil: "networkidle" });
    await p.waitForTimeout(u.startsWith("/explore") ? 2500 : 400);
    const ov = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    await p.screenshot({ path: `${out}/${tag}-${u.replace(/[/?]/g, "_") || "home"}.png`, fullPage: false });
    console.log(tag, u, "overflow", ov, errs.splice(0).join(" | ").slice(0, 300));
  }
  await ctx.close();
}
await b.close(); server.close();
