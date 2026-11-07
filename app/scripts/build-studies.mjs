#!/usr/bin/env node
/**
 * Renders the full text of all 90 case studies for the research reading pages.
 *
 *  - Source: gaurav-product/product-management-case-studies at the commit pinned
 *    in case-studies.lock.json (cloned into .cache/, never edited).
 *  - Each README and ASSUMPTIONS file is rendered from markdown to HTML and
 *    sanitised. Text is not rewritten. Relative links/images point at the same
 *    commit on GitHub. Shields.io badges become their own alt text (no third-
 *    party requests). Mermaid blocks keep their source; the page renders them.
 *  - Output: src/data/generated/studies/<day>.json, read by the route loader at
 *    prerender time, so study text never enters a JavaScript bundle.
 *  - A word-count check against the generated corpus fails the build if text
 *    is lost in rendering.
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { Marked } from "marked";
import sanitizeHtml from "sanitize-html";

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const REPO = path.resolve(APP, "..");
const lock = JSON.parse(fs.readFileSync(path.join(APP, "case-studies.lock.json"), "utf8"));
const CACHE = path.join(APP, ".cache/case-studies");
const OUT = path.join(APP, "src/data/generated/studies");

function git(args, cwd) { return execFileSync("git", args, { cwd, stdio: ["ignore", "pipe", "pipe"] }).toString().trim(); }
function ensureCheckout() {
  if (fs.existsSync(path.join(CACHE, ".git"))) {
    try { if (git(["rev-parse", "HEAD"], CACHE) === lock.commit) return; git(["fetch", "-q", "origin"], CACHE); }
    catch { /* fall through to checkout */ }
  } else {
    fs.mkdirSync(path.dirname(CACHE), { recursive: true });
    const local = process.env.CASE_STUDIES_DIR; // optional pre-existing clone
    git(["clone", "-q", local || lock.repo + ".git", CACHE]);
  }
  git(["-c", "advice.detachedHead=false", "checkout", "-q", lock.commit], CACHE);
}
ensureCheckout();

const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(REPO, "site/corpus.js"), "utf8"), ctx);
const studies = ctx.window.GOS_CORPUS.studies;

const enc = (p) => p.split("/").map(encodeURIComponent).join("/");
/** Decodes the HTML entities marked emits, so plain-text uses (the contents list) show "&", not "&amp;". */
const unescape = (t) => t.replace(/&(amp|lt|gt|quot|#39|#x27|nbsp);/g, (_, e) => ({ amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'", "#x27": "'", nbsp: " " })[e]);
const BLOB = (p) => `${lock.repo}/blob/${lock.commit}/${enc(p)}`;
const RAW = (p) => `${lock.repo.replace("github.com", "raw.githubusercontent.com")}/${lock.commit}/${enc(p)}`;
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const words = (s) => (s.match(/[A-Za-z0-9][A-Za-z0-9'’.%-]*/g) || []).length;

/** img.shields.io/badge/<label>-<message>-<color> → "label: message" (shields escaping: -- → -, __ → _, _ → space). */
function badgeText(href, alt) {
  const m = /\/badge\/([^?#]+)/.exec(href || "");
  if (!m) return alt || "";
  const parts = decodeURIComponent(m[1]).replace(/--/g, "\u0000").replace(/__/g, "\u0001").split("-").map((x) => x.replace(/\u0000/g, "-").replace(/_/g, " ").replace(/\u0001/g, "_"));
  if (parts.length >= 3) return `${parts[0]}: ${parts.slice(1, -1).join("-")}`;
  return parts[0] || alt || "";
}

function render(md, dir) {
  const toc = [];
  const used = new Map();
  // GitHub's heading-anchor algorithm (as github-slugger): decode entities, lowercase,
  // drop punctuation/emoji, spaces → hyphens (no collapsing), de-duplicate with -1, -2…
  const decode = (t) => t.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
  const slug = (t) => {
    let s = decode(t).toLowerCase().replace(/[^\p{L}\p{N}\p{M}\s_-]/gu, "").replace(/ /g, "-") || "section";
    const base = s; let n = used.get(base) || 0;
    if (n) { while (used.has(`${base}-${n}`)) n++; s = `${base}-${n}`; }
    used.set(base, n + 1); used.set(s, used.get(s) || 1);
    return s;
  };
  const resolve = (href) => {
    if (!href || /^(https?:|mailto:|#)/i.test(href)) return href;
    return path.posix.normalize(path.posix.join(dir, decodeURIComponent(href)));
  };
  const lastOpen = [];
  const m = new Marked({ gfm: true });
  m.use({
    renderer: {
      heading({ tokens, depth }) {
        const text = this.parser.parseInline(tokens);
        const id = slug(text);
        if (depth <= 3) toc.push({ id, text: unescape(text.replace(/<[^>]+>/g, "")), level: depth }); // React escapes it again on render
        return `<h${depth} id="${id}">${text}</h${depth}>\n`;
      },
      code({ text, lang }) {
        if ((lang || "").trim().toLowerCase() === "mermaid")
          return `<figure class="mermaid-block"><pre class="mermaid-src"><code>${esc(text)}</code></pre></figure>\n`;
        return `<pre><code class="language-${esc((lang || "text").split(/\s/)[0])}">${esc(text)}</code></pre>\n`;
      },
      image({ href, title, text }) {
        if (/img\.shields\.io|badgen\.net/.test(href || "")) return `<span class="md-badge">${esc(badgeText(href, text))}</span>`;
        const r = resolve(href);
        if (!/^https?:/i.test(r) && !fs.existsSync(path.join(CACHE, r))) return `<span class="md-missing">Image not in the repository: ${esc(text || r)}</span>`;
        const src = /^https?:/i.test(r) ? r : RAW(r);
        return `<img src="${esc(src)}" alt="${esc(text || "")}"${title ? ` title="${esc(title)}"` : ""} loading="lazy">`;
      },
      link({ href, title, tokens }) {
        const text = this.parser.parseInline(tokens);
        const r = resolve(href);
        const url = !r || r.startsWith("#") || /^(https?:|mailto:)/i.test(r) ? r : BLOB(r);
        return `<a href="${esc(url || "#")}"${title ? ` title="${esc(title)}"` : ""}>${text}</a>`;
      },
    },
  });
  // Inline HTML in the source is kept but sanitised; badge <img> tags inside it become text too.
  const raw = m.parse(md.replace(/<img[^>]+src="(https:\/\/img\.shields\.io[^"]*)"[^>]*?(?:alt="([^"]*)")?[^>]*>/g, (_, src, alt) => `<span class="md-badge">${esc(badgeText(src, alt))}</span>`));
  let html = sanitizeHtml(raw, {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, "h1", "h2", "img", "details", "summary", "figure", "figcaption", "span", "del", "sup", "sub", "input"],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"], img: ["src", "alt", "title", "loading", "width", "height"],
      "*": ["id", "class", "align"], th: ["colspan", "rowspan", "align"], td: ["colspan", "rowspan", "align"],
      input: ["type", "checked", "disabled"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: (tag, attribs) => /^https?:/i.test(attribs.href || "") ? { tagName: "a", attribs: { ...attribs, target: "_blank", rel: "noopener noreferrer" } } : { tagName: "a", attribs },
      input: (tag, attribs) => ({ tagName: "input", attribs: { ...attribs, disabled: "disabled" } }),
    },
  });
  // In-page links whose target heading does not exist in the source become plain text.
  // Markdown task-list checkboxes become text marks: a static document has no form controls.
  html = html.replace(/<input[^>]*type="checkbox"[^>]*>/g, (tag) => /checked/.test(tag) ? '<span class="md-check" aria-label="Done">☑</span>' : '<span class="md-check" aria-label="Not done">☐</span>');
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  let dead = 0;
  const fixed = html.replace(/<a href="#([^"]*)"[^>]*>([\s\S]*?)<\/a>/g, (all, id, text) => {
    if (ids.has(id)) return all; dead++; return `<span class="md-deadlink" title="Link target not present in the source document">${text}</span>`;
  });
  deadLinks += dead;
  // Images written as inline HTML in the source bypass the Markdown image renderer: resolve their
  // relative paths the same way (raw file at the pinned commit, or a visible "not in repository" note).
  let out = fixed.replace(/<img\b([^>]*?)\bsrc="([^"]+)"([^>]*)>/g, (all, pre, src, post) => {
    if (/^(https?:|data:)/i.test(src)) return all;
    const r = resolve(src.replace(/&amp;/g, "&"));
    if (!fs.existsSync(path.join(CACHE, r))) { const alt = (all.match(/alt="([^"]*)"/) || [])[1]; return `<span class="md-missing">Image not in the repository: ${alt || esc(r)}</span>`; }
    return `<img${pre}src="${esc(RAW(r))}"${post}>`;
  });
  // The page owns the single <h1>, so study headings render one level down, and levels never skip
  // (h2 → h4 becomes h2 → h3). The original level is kept in data-l for styling. Text is unchanged.
  let prev = 1;
  out = out.replace(/<(\/?)h([1-6])\b([^>]*)>/g, (all, close, n, attrs) => {
    if (close) return `</h${close === "/" ? lastOpen.pop() : n}>`;
    const level = Math.min(Number(n) + 1, prev + 1, 6); prev = level; lastOpen.push(level);
    return `<h${level} data-l="${n}"${attrs}>`;
  });
  // Wide tables and code blocks scroll sideways; make them reachable by keyboard.
  out = out.replace(/<table>/g, '<table tabindex="0">').replace(/<pre>/g, '<pre tabindex="0">').replace(/<pre class="mermaid-src">/g, '<pre class="mermaid-src" tabindex="0">');
  // Empty header cells in the source get a screen-reader label so every column has a name.
  out = out.replace(/<th([^>]*)><\/th>/g, '<th$1><span class="sr-only">Unlabelled column</span></th>');
  return { html: out, toc };
}
let deadLinks = 0;

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
const problems = [];
let totalWords = 0;
/** The owner's private phone number appears in some study footers. It is
 *  removed from the published text (and every removal is logged). */
const PHONE = /(?:\+?91[\s-]*)?8127[\s-]*5[\s-]*1[\s-]*2340/g;
const redactions = [];
const redact = (md, day, file) => md.replace(PHONE, () => { redactions.push(`Day ${day} ${file}`); return "[phone number removed — available on request]"; });
for (const s of studies) {
  const readmeFile = path.join(CACHE, s.readme_path);
  if (!fs.existsSync(readmeFile)) { problems.push(`Day ${s.day}: ${s.readme_path} missing at ${lock.commit}`); continue; }
  const md = redact(fs.readFileSync(readmeFile, "utf8"), s.day, "README");
  const readme = render(md, s.dir_path);
  let assumptions = null;
  if (s.assumptions_path && fs.existsSync(path.join(CACHE, s.assumptions_path))) {
    const a = render(redact(fs.readFileSync(path.join(CACHE, s.assumptions_path), "utf8"), s.day, "ASSUMPTIONS"), s.dir_path);
    assumptions = { html: a.html, toc: a.toc, url: BLOB(s.assumptions_path) };
  }
  const rendered = words(readme.html.replace(/<[^>]+>/g, " ").replace(/&[a-z]+;/g, " "));
  const source = words(md.replace(/```mermaid[\s\S]*?```/g, ""));
  totalWords += rendered;
  if (rendered < source * 0.9) problems.push(`Day ${s.day}: rendered ${rendered} words vs ${source} in source`);
  fs.writeFileSync(path.join(OUT, `${s.day}.json`), JSON.stringify({
    day: s.day, html: readme.html, toc: readme.toc, assumptions, words: rendered,
    mermaid: (md.match(/```mermaid/g) || []).length,
    source: { repo: lock.repo, commit: lock.commit, readme_url: BLOB(s.readme_path), path: s.readme_path },
  }));
}
if (problems.length) { console.error("build-studies:\n - " + problems.join("\n - ")); process.exit(1); }
if (redactions.length) console.log(`build-studies: redacted the owner's phone number in ${redactions.join(", ")}`);
if (deadLinks) console.log(`build-studies: ${deadLinks} in-page links point at headings missing from the source; rendered as plain text`);
console.log(`build-studies: ${studies.length} studies rendered from ${lock.commit.slice(0, 7)} (${(totalWords / 1e6).toFixed(2)}M words)`);
