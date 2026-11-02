/**
 * Zero-dead-control crawler. Visits every prerendered route and inventories every
 * visible link, button and form control:
 *  - internal links must resolve to a prerendered route (and #hash targets must exist)
 *  - no href="#" / javascript: placeholders; external links open safely
 *  - download links must return a file
 *  - every button needs an accessible name AND a real handler (React onClick,
 *    or type=submit inside a form) — decorative buttons fail
 *  - form controls need a label
 * Results are written to reports/ and summarised by scripts/inventory-report.mjs.
 */
import { test, expect } from "@playwright/test";
import fs from "node:fs";

const routes: string[] = JSON.parse(fs.readFileSync("build/routes.json", "utf8"));
const SHARDS = 6;
fs.mkdirSync("reports", { recursive: true });

for (let shard = 0; shard < SHARDS; shard++) {
  test(`every control works — shard ${shard + 1}/${SHARDS}`, async ({ page, request }) => {
    test.setTimeout(240_000);
    const mine = routes.filter((_, i) => i % SHARDS === shard);
    const records: unknown[] = [];
    const failures: string[] = [];
    const checkedDownloads = new Set<string>();
    for (const route of mine) {
      const errs: string[] = [];
      page.removeAllListeners("pageerror");
      page.on("pageerror", (e) => errs.push(e.message));
      await page.goto(route === "/" ? "/?nointro" : route, { waitUntil: "domcontentloaded" });
      await page.waitForLoadState("networkidle").catch(() => {});
      const items = await page.evaluate(() => {
        const vis = (e: Element) => { const r = (e as HTMLElement).getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none"; };
        const name = (e: Element) => ((e.getAttribute("aria-label") || (e as HTMLElement).innerText || e.getAttribute("title") || (e.querySelector("img[alt]")?.getAttribute("alt")) || "").trim().replace(/\s+/g, " ").slice(0, 80));
        const region = (e: Element) => e.closest("header") ? "header" : e.closest("footer") ? "footer" : e.closest("[role=dialog]") ? "dialog" : "main";
        const props = (e: Element) => { const k = Object.keys(e).find((x) => x.startsWith("__reactProps")); return k ? (e as unknown as Record<string, Record<string, unknown>>)[k] : null; };
        const out: Record<string, unknown>[] = [];
        document.querySelectorAll("a").forEach((a) => { if (!vis(a)) return; out.push({ kind: "link", name: name(a), href: a.getAttribute("href"), target: a.getAttribute("target"), rel: a.getAttribute("rel"), download: a.hasAttribute("download"), region: region(a) }); });
        document.querySelectorAll("button").forEach((b) => {
          if (!vis(b)) return;
          const p = props(b);
          const submit = (b.getAttribute("type") || "submit") === "submit" && !!b.closest("form");
          out.push({ kind: "button", name: name(b), handler: !!(p && (p.onClick || p.onPointerDown)) || submit, submit, disabled: (b as HTMLButtonElement).disabled, title: b.getAttribute("title"), region: region(b) });
        });
        document.querySelectorAll("input, select, textarea").forEach((f) => {
          if (!vis(f)) return;
          const el = f as HTMLInputElement;
          const labelled = !!(el.labels && el.labels.length) || !!el.getAttribute("aria-label") || !!el.getAttribute("aria-labelledby");
          out.push({ kind: "field", name: (el.labels?.[0]?.innerText || el.getAttribute("aria-label") || el.placeholder || "").trim().slice(0, 60), type: el.type || f.tagName.toLowerCase(), labelled, region: region(f) });
        });
        const ids = Array.from(document.querySelectorAll("[id]")).map((e) => e.id);
        return { out, ids, overflow: document.documentElement.scrollWidth - innerWidth };
      });
      if (items.overflow > 1) failures.push(`${route}: horizontal overflow ${items.overflow}px`);
      for (const it of items.out as Record<string, string & boolean>[]) {
        let result = "PASS", expected = "";
        if (it.kind === "link") {
          const href = String(it.href ?? "");
          expected = `navigate → ${href}`;
          if (!href || href === "#" || href.startsWith("javascript:")) result = "FAIL: placeholder href";
          else if (/^https?:\/\//.test(href)) { if (it.target !== "_blank" || !String(it.rel).includes("noopener")) result = "FAIL: external link without target=_blank rel=noopener"; }
          else if (href.startsWith("mailto:")) { if (!/^mailto:[^@]+@[^@]+$/.test(href.split("?")[0])) result = "FAIL: bad mailto"; }
          else if (it.download || /\.(pdf|mp4|csv)$/.test(href)) {
            if (!checkedDownloads.has(href)) { checkedDownloads.add(href); const r = await request.get(href); if (r.status() !== 200) result = `FAIL: download ${r.status()}`; }
            expected = `download ${href}`;
          } else if (href.startsWith("#")) { if (!items.ids.includes(href.slice(1))) result = `FAIL: missing anchor ${href}`; }
          else {
            const [p, hash] = href.split("#");
            const pathOnly = p.split("?")[0].replace(/\/$/, "") || "/";
            if (!routes.includes(pathOnly)) result = `FAIL: unknown route ${pathOnly}`;
            else if (hash && pathOnly === (route.replace(/\/$/, "") || "/") && !items.ids.includes(hash)) result = `FAIL: missing anchor #${hash}`;
          }
        } else if (it.kind === "button") {
          expected = it.submit ? "submit form" : "run handler";
          if (!it.name) result = "FAIL: no accessible name";
          else if (!it.handler) result = "FAIL: no handler (decorative button)";
          else if (it.disabled) result = it.title || /Move|previous|next|Remove/.test(it.name) ? "PASS (disabled, explained)" : "PASS (disabled at load)";
        } else {
          expected = `input (${it.type})`;
          if (!it.labelled) result = "FAIL: unlabelled field";
        }
        records.push({ page: route, region: it.region, kind: it.kind, name: it.name, expected, result });
        if (result.startsWith("FAIL")) failures.push(`${route} [${it.kind}] "${it.name}": ${result}`);
      }
      if (errs.length) failures.push(`${route}: page errors ${errs.join(" | ")}`);
    }
    fs.writeFileSync(`reports/inventory-shard-${shard + 1}.json`, JSON.stringify(records));
    expect(failures, failures.slice(0, 40).join("\n")).toEqual([]);
  });
}
