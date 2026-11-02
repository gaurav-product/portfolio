#!/usr/bin/env node
/**
 * Screenshot review and approval gate.
 *
 *   node scripts/screenshot-review.mjs            # (re)build the review sheet
 *
 * - Reads the real screenshots in the owner's public repositories (CareConnect,
 *   GharGyaan, Nexus), cloned into .cache/repos (or SCREENSHOT_SRC).
 * - Writes brand/screenshot-review/: thumbnails, inventory.json, index.html.
 * - approvals.json lists every screenshot with "approved": false. Flip one to
 *   true and re-run: only approved screenshots are optimised into
 *   app/public/screenshots/ and listed in src/data/screenshots.json, which the
 *   case-study pages render — always captioned "Demo data".
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const REVIEW = path.resolve(APP, "../brand/screenshot-review");
const SRC = process.env.SCREENSHOT_SRC || path.join(APP, ".cache/repos");
const SETS = [
  { project: "careconnect", repo: "careconnect", dir: "docs/10-evidence/screenshots", data: "Demo episode seeded by the repository (fictional patient). No production usage." },
  { project: "ghargyaan", repo: "ghargyaan", dir: "docs/images", data: "Demo-mode prototype. Not clinically reviewed; no users." },
  { project: "nexus", repo: "nexus", dir: "docs/assets/screenshots", data: "Demo mode with fictional data. No real accounts connected." },
];
const sh = (cmd, args) => execFileSync(cmd, args, { stdio: ["ignore", "pipe", "pipe"] }).toString().trim();
const dims = (f) => { const b = fs.readFileSync(f); return [b.readUInt32BE(16), b.readUInt32BE(20)]; };
const describe = (name) => name.replace(/^\d+-/, "").replace(/\.png$/, "").replace(/-/g, " ");

fs.mkdirSync(path.join(REVIEW, "thumbs"), { recursive: true });
const approvalsFile = path.join(REVIEW, "approvals.json");
const approvals = fs.existsSync(approvalsFile) ? JSON.parse(fs.readFileSync(approvalsFile, "utf8")) : {};
const inventory = [];
for (const set of SETS) {
  const repoDir = path.join(SRC, set.repo);
  if (!fs.existsSync(repoDir)) { fs.mkdirSync(SRC, { recursive: true }); sh("git", ["clone", "-q", "--depth", "1", `https://github.com/gaurav-product/${set.repo}.git`, repoDir]); }
  const commit = sh("git", ["-C", repoDir, "rev-parse", "HEAD"]);
  for (const f of fs.readdirSync(path.join(repoDir, set.dir)).filter((x) => x.endsWith(".png")).sort()) {
    const file = path.join(repoDir, set.dir, f);
    const id = `${set.project}/${f.replace(/\.png$/, "")}`;
    const [w, h] = dims(file);
    const thumb = `thumbs/${id.replace("/", "--")}.webp`;
    // top crop for very tall captures so the sheet stays scannable
    sh("ffmpeg", ["-v", "error", "-y", "-i", file, "-vf", `scale=480:-2,crop=480:'min(ih,720)':0:0`, "-c:v", "libwebp", "-quality", "80", path.join(REVIEW, thumb)]);
    approvals[id] ??= { approved: false, caption: "" };
    inventory.push({
      id, project: set.project, file: f, width: w, height: h, shows: describe(f),
      source: `https://github.com/gaurav-product/${set.repo}/blob/${commit}/${set.dir}/${f}`,
      provenance: "ACTUAL PRODUCT SCREENSHOT — owner's public repository", data_note: set.data,
      thumb, status: approvals[id].approved ? "APPROVED" : "PENDING REVIEW",
    });
  }
}
fs.writeFileSync(approvalsFile, JSON.stringify(approvals, null, 2) + "\n");
fs.writeFileSync(path.join(REVIEW, "inventory.json"), JSON.stringify(inventory, null, 2) + "\n");

// approved → optimised full-width WebP in public/, plus the list the site reads
const pubDir = path.join(APP, "public/screenshots");
fs.rmSync(pubDir, { recursive: true, force: true });
const approved = [];
for (const it of inventory.filter((x) => approvals[x.id].approved)) {
  const set = SETS.find((s) => s.project === it.project);
  const out = `/screenshots/${it.id.replace("/", "--")}.webp`;
  fs.mkdirSync(pubDir, { recursive: true });
  sh("ffmpeg", ["-v", "error", "-y", "-i", path.join(SRC, set.repo, set.dir, it.file), "-vf", "scale='min(1280,iw)':-2", "-c:v", "libwebp", "-quality", "82", path.join(APP, "public", out)]);
  approved.push({ id: it.id, project: it.project, src: out, alt: approvals[it.id].caption || it.shows, caption: approvals[it.id].caption || it.shows, data_note: it.data_note, source: it.source });
}
fs.writeFileSync(path.join(APP, "src/data/screenshots.json"), JSON.stringify(approved, null, 2) + "\n");

const card = (it) => `<figure><a href="${it.source}" target="_blank" rel="noopener"><img src="${it.thumb}" alt="" loading="lazy"></a><figcaption><b>${it.id}</b><span>${it.shows} · ${it.width}×${it.height}</span><em class="${it.status === "APPROVED" ? "ok" : "pending"}">${it.status}</em></figcaption></figure>`;
fs.writeFileSync(path.join(REVIEW, "index.html"), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Screenshot review</title><style>
body{margin:0;background:#0B1110;color:#F3F6F4;font:15px/1.5 system-ui,sans-serif;padding:32px 16px}main{max-width:1440px;margin:auto}h1{margin:0 0 6px}h2{color:#4DFF4D;font:600 13px ui-monospace,monospace;letter-spacing:.16em;text-transform:uppercase;margin:36px 0 10px}p{color:#A1ADA7;max-width:90ch}
.g{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px}figure{margin:0;background:#121C19;border:1px solid #263832;border-radius:12px;overflow:hidden}img{display:block;width:100%;height:300px;object-fit:cover;object-position:top;background:#000}
figcaption{padding:10px 12px;display:grid;gap:2px}b{font:600 12px ui-monospace,monospace;word-break:break-all}span{color:#A1ADA7;font-size:13px}em{font:600 11px ui-monospace,monospace;font-style:normal;letter-spacing:.1em}.pending{color:#F2C14E}.ok{color:#4DFF4D}
</style></head><body><main><h1>Screenshot review — ${inventory.length} real screenshots</h1>
<p>None is published until approved. To approve: set <code>"approved": true</code> (and optionally a caption) for its id in <code>brand/screenshot-review/approvals.json</code>, then run <code>node app/scripts/screenshot-review.mjs</code>. Approved screenshots appear on the project's case study, captioned “Demo data”. Thumbnails show the top of very tall captures; click for the full original.</p>
${SETS.map((s) => `<h2>${s.project} · ${inventory.filter((i) => i.project === s.project).length}</h2><p>${s.data}</p><div class="g">${inventory.filter((i) => i.project === s.project).map(card).join("")}</div>`).join("")}
</main></body></html>`);
console.log(`screenshot-review: ${inventory.length} screenshots inventoried, ${approved.length} approved and published`);
