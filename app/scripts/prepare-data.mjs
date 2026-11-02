#!/usr/bin/env node
/**
 * Bridges the existing portfolio into the new app without retyping anything.
 *
 *  - site/content.js  -> src/data/generated/legacy.json   (lab notes, loop, challenges, experiments…)
 *  - site/corpus.js   -> src/data/generated/corpus.json   (the generated 90-day corpus, slimmed)
 *  - docs/media       -> public/media                     (intro film + poster, not committed twice)
 *  - brand/assets     -> public/brand                     (the approved SVG library)
 *
 * Every correction applied to legacy wording is listed in CORRECTIONS with the
 * reason. A banned-claim check fails the build if a superseded fact survives.
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const REPO = path.resolve(APP, "..");
const OUT = path.join(APP, "src/data/generated");
fs.mkdirSync(OUT, { recursive: true });

function load(file, key) {
  const ctx = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(REPO, file), "utf8"), ctx);
  return ctx.window[key];
}

/** Wording superseded by the healthcare CV (Nov 2026) or by project evidence. */
export const CORRECTIONS = [
  ["Building Aaroh's MVP with the Claude API, Lovable and Cursor", "Building Aaroh's interactive prototype with the Claude API, Lovable and Cursor", "CV: Aaroh is a 37-screen interactive prototype, pre-launch"],
  ["Aaroh, built with Claude API, Lovable and Cursor", "Aaroh's interactive prototype, built with Claude API, Lovable and Cursor", "CV: prototype, not an MVP in use"],
  ["Founder and Product Manager", "Founder and product lead", "CV role title"],
  ["Founder & Product Manager", "Founder and product lead", "CV role title"],
  ["Live Your Best Life", "Live Your Best Life (USA)", "CV employer name"],
  ["Live Your Best Life (USA) (USA)", "Live Your Best Life (USA)", "idempotence of the line above"],
];

const BANNED = [
  [/Maharaja Agrasen/i, "Superseded MCA institution — CV: Chaudhary Charan Singh University, Meerut"],
  [/\+91[\s\d]{6,}/, "Private phone number must not be public"],
  [/validated the MVP/i, "Aaroh is a prototype; nothing is validated with live users"],
  [/SHIPPED — BUILD & EVALUATION COMPLETE/, "GharGyaan is a working prototype in demo mode, not shipped"],
];

function correct(value) {
  if (typeof value === "string") {
    let s = value;
    for (const [from, to] of CORRECTIONS) s = s.split(from).join(to);
    return s;
  }
  if (Array.isArray(value)) return value.map(correct);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, correct(v)]));
  return value;
}

const C = load("site/content.js", "GOS_CONTENT");
const legacy = correct({
  lab_notes: C.lab_notes,
  lab_config: C.lab_config,
  experiments: C.experiments,
  loop: C.loop,
  principles: C.principles,
  challenges: C.challenges,
  stage_practice: C.stage_practice,
  orbit: C.site_config.orbit,
  product_question: C.site_config.product_question,
  research: C.research,
  aaroh_decision_log: C.projects.find((p) => p.id === "aaroh").decision_log,
  intro: C.intro,
});
// Evidence chips label Aaroh's build "MVP"; the CV calls it a prototype.
for (const list of [legacy.loop.flatMap((l) => l.e), ...Object.values(legacy.stage_practice)])
  for (const chip of list) if (chip[0] === "MVP" && chip[1].startsWith("Aaroh")) chip[0] = "Prototype";

const K = load("site/corpus.js", "GOS_CORPUS");
const corpus = {
  repo: K.repo,
  audited: K.audited,
  counts: K.counts,
  categories: K.categories,
  evidence_levels: K.evidence_levels,
  evidence_formula: K.evidence_formula,
  blocks: K.blocks,
  stages: K.stages.map(({ id, label, basis, count }) => ({ id, label, basis, count })),
  capabilities: K.capabilities.map(({ id, label, basis, count, days }) => ({ id, label, basis, count, days })),
  anomalies: K.anomalies,
  studies: K.studies.map((s) => ({
    day: s.day, company: s.company, title: s.title, slug: s.slug, category: s.category,
    industry: s.industry, summary: s.summary, words: s.words, sources: s.sources,
    evidence_level: s.evidence_level, evidence_score: s.evidence_score,
    has_prd: s.has_prd, has_experiment: s.has_experiment, has_metrics: s.has_metrics,
    has_assumptions: s.has_assumptions, verification: s.verification, checks: s.checks ?? null,
    github_url: s.github_url, readme_url: s.readme_url, assumptions_url: s.assumptions_url,
    flags: s.flags, internal_day: s.internal_day,
  })),
};

const problems = [];
const blob = JSON.stringify(legacy);
for (const [re, why] of BANNED) if (re.test(blob)) problems.push(why);
if (problems.length) {
  console.error("prepare-data: banned claims found in legacy content:\n - " + problems.join("\n - "));
  process.exit(1);
}

fs.writeFileSync(path.join(OUT, "legacy.json"), JSON.stringify(legacy));
fs.writeFileSync(path.join(OUT, "corpus.json"), JSON.stringify(corpus));
const { studies: _omit, ...summary } = corpus;
fs.writeFileSync(path.join(OUT, "corpus-summary.json"), JSON.stringify(summary));

// media: the film and poster live once, in docs/media
const media = path.join(APP, "public/media");
fs.mkdirSync(media, { recursive: true });
// The 11.4 MB original film is no longer shipped: the app uses the AV1/H.264 encodes committed in public/media.
for (const f of ["gaurav-os-poster.jpg"]) {
  const src = path.join(REPO, "docs/media", f);
  if (fs.existsSync(src) && !fs.existsSync(path.join(media, f))) fs.copyFileSync(src, path.join(media, f));
}
// cinematic illustrations: the manifest is read by the app; images live in public/cinematic
fs.copyFileSync(path.join(REPO, "brand/cinematic/manifest.json"), path.join(OUT, "cinematic.json"));
// brand library
const brandSrc = path.join(REPO, "brand/assets");
const brandOut = path.join(APP, "public/brand");
fs.cpSync(brandSrc, brandOut, { recursive: true });
fs.copyFileSync(path.join(REPO, "brand/preview/og-default-1200x630.png"), path.join(APP, "public/og-default.png"));
fs.copyFileSync(path.join(REPO, "brand/assets/brand/gauravos-favicon.svg"), path.join(APP, "public/favicon.svg"));

console.log(`prepare-data: ${corpus.studies.length} studies, ${legacy.lab_notes.length} lab notes, ${CORRECTIONS.length} corrections applied`);
