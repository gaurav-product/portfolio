#!/usr/bin/env node
/** Merges the crawler shards into reports/interaction-inventory.{json,md}. */
import fs from "node:fs";
const rows = fs.readdirSync("reports").filter((f) => f.startsWith("inventory-shard-")).flatMap((f) => JSON.parse(fs.readFileSync("reports/" + f, "utf8")));
const global = new Map(), local = [];
for (const r of rows) {
  if (r.region === "header" || r.region === "footer") { const k = `${r.region}|${r.kind}|${r.name}|${r.expected}`; const g = global.get(k) ?? { ...r, page: "(every page)", count: 0, results: new Set() }; g.count++; g.results.add(r.result); global.set(k, g); }
  else local.push(r);
}
const all = [...[...global.values()].map((g) => ({ ...g, result: [...g.results].join(", "), results: undefined })), ...local];
const fails = all.filter((r) => String(r.result).startsWith("FAIL"));
const pages = new Set(rows.map((r) => r.page));
fs.writeFileSync("reports/interaction-inventory.json", JSON.stringify({ generated: new Date().toISOString(), pages: pages.size, controls_checked: rows.length, unique_controls: all.length, failures: fails.length, items: all }, null, 1));
const kinds = (k) => all.filter((r) => r.kind === k).length;
let md = `# Interaction inventory\n\nGenerated ${new Date().toISOString()} by \`tests/e2e/controls.spec.ts\`.\n\n| Metric | Value |\n|---|---|\n| Prerendered routes crawled | ${pages.size} |\n| Control instances checked | ${rows.length} |\n| Unique controls (header/footer counted once) | ${all.length} |\n| Links / buttons / fields | ${kinds("link")} / ${kinds("button")} / ${kinds("field")} |\n| Failures | **${fails.length}** |\n\n`;
md += `Each control is checked for: a real destination (internal routes and anchors resolve, downloads return 200, external links open safely), an accessible name, a real handler (React onClick or form submit), and labelled form fields. Behaviour of the stateful controls (calculators, boards, exports, search, Ask, Explore) is covered by the journeys in \`tests/e2e/journeys.spec.ts\`.\n\n`;
md += `## Global controls (header and footer)\n\n| Region | Kind | Name | Expected action | Instances | Result |\n|---|---|---|---|---|---|\n` + [...global.values()].map((g) => `| ${g.region} | ${g.kind} | ${g.name.replace(/\|/g, "/")} | ${g.expected.replace(/\|/g, "/")} | ${g.count} | ${[...g.results].join(", ")} |`).join("\n");
const byPage = {};
for (const r of local) (byPage[r.page] ??= []).push(r);
md += `\n\n## Page controls\n\n`;
for (const [p, list] of Object.entries(byPage).sort()) {
  md += `### \`${p}\`\n\n| Kind | Name | Expected action | Result |\n|---|---|---|---|\n` + list.map((r) => `| ${r.kind} | ${(r.name || "—").replace(/\|/g, "/")} | ${r.expected.replace(/\|/g, "/")} | ${r.result} |`).join("\n") + "\n\n";
}
fs.writeFileSync("reports/interaction-inventory.md", md);
console.log(`inventory: ${pages.size} pages, ${rows.length} control instances, ${all.length} unique, ${fails.length} failures`);
