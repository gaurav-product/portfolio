import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { projects } from "~/content/projects";
import { capabilities, capabilityById } from "~/content/capabilities";
import { experience, education } from "~/content/experience";
import { profile, highlights } from "~/content/profile";
import { SOURCES } from "~/content/sources";
import { kb } from "~/content/kb";
import { districts } from "~/content/districts";
import { staticPaths, NAV, TOOLS } from "~/content/routes-manifest";
import { legacy } from "~/content/data";
import { corpus } from "~/content/corpus";

const ROOT = path.resolve(__dirname, "../..");
const SRC = path.join(ROOT, "src");
const allSource = () => {
  const out: string[] = [];
  (function walk(d: string) { for (const f of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, f.name); f.isDirectory() ? walk(p) : out.push(fs.readFileSync(p, "utf8")); } })(SRC);
  return out.join("\n");
};
const paths = new Set(staticPaths());
const routeOf = (to: string) => to.split(/[?#]/)[0].replace(/\/$/, "") || "/";

describe("factual guardrails", () => {
  const src = allSource();
  it("never names the superseded MCA institution", () => expect(src).not.toMatch(/Maharaja Agrasen/i));
  it("states the MCA from the healthcare CV", () => expect(education.find((e) => e.id === "mca")?.org).toBe("Chaudhary Charan Singh University, Meerut"));
  it("contains no phone number anywhere in public source", () => { expect(src).not.toMatch(/\+91[\s\d]{6,}/); expect(src).not.toMatch(/81275/); });
  it("never calls GharGyaan shipped or deployed", () => {
    const g = projects.find((p) => p.slug === "ghargyaan")!;
    expect(g.status).toBe("PROTOTYPE · DEMO MODE");
    expect(JSON.stringify(g)).toMatch(/not deployed/i);
    expect(JSON.stringify(g)).toMatch(/4 safety misses|four held-out misses|four safety misses/i);
  });
  it("labels PhonePe as academic case data with an unrun A/B test", () => {
    const p = projects.find((x) => x.slug === "phonepe-smart-spend-coach")!;
    expect(p.kind).toBe("academic");
    expect(p.highlights.some((h) => h.status === "CASE DATA")).toBe(true);
    expect(p.highlights.some((h) => h.status === "DESIGNED, NOT RUN")).toBe(true);
  });
  it("describes Aaroh as a pre-launch prototype with no live users", () => {
    const a = projects.find((x) => x.slug === "aaroh")!;
    expect(a.status).toBe("PRE-LAUNCH · PROTOTYPE");
    expect(a.role).toBe("Founder and product lead");
    expect(JSON.stringify(a)).not.toMatch(/FastAPI/);
  });
  it("keeps employment separate from projects", () => {
    expect(experience.map((r) => r.employer)).toEqual(["Adhyatm Sadhna Kendra", "Adhyatm Sadhna Kendra", "Live Your Best Life (USA)"]);
    expect(projects.filter((p) => p.kind === "professional").map((p) => p.slug)).toEqual(["evamastu"]);
  });
  it("every highlight has a defined source", () => highlights.forEach((h) => expect(SOURCES[h.source]).toBeTruthy()));
  it("public email is the only contact detail besides profiles", () => expect(Object.keys(profile.contact).sort()).toEqual(["email", "github", "githubLabel", "linkedin", "linkedinLabel"]));
});

describe("referential integrity", () => {
  it("every project skill exists in the capability library", () => projects.forEach((p) => p.skills.forEach((s) => expect(capabilityById(s), `${p.slug} → ${s}`).toBeTruthy())));
  it("every cited source exists", () => projects.forEach((p) => { p.highlights.forEach((h) => h.sources.forEach((s) => expect(SOURCES[s], s).toBeTruthy())); p.sections.forEach((x) => x.sources?.forEach((s) => expect(SOURCES[s], s).toBeTruthy())); }));
  it("capability evidence points at real projects, roles or corpus stages", () => {
    const stageIds = new Set([...corpus.stages.map((s) => s.id), ...corpus.capabilities.map((s) => s.id)]);
    capabilities.forEach((c) => c.evidence.forEach((e) => {
      const [k, id] = e.ref.split(":");
      if (k === "project") expect(projects.some((p) => p.slug === id), e.ref).toBe(true);
      else if (k === "role") expect(experience.some((r) => r.id === id), e.ref).toBe(true);
      else expect(stageIds.has(id), e.ref).toBe(true);
    }));
  });
  it("capability status is derived from evidence, never asserted", () => capabilities.forEach((c) => {
    const work = c.evidence.some((e) => /^(project|role):/.test(e.ref));
    expect(c.status).toBe(work ? "Demonstrated in work" : c.evidence.length ? "Applied in case studies" : "Not yet evidenced");
  }));
  it("capability ids are unique", () => expect(new Set(capabilities.map((c) => c.id)).size).toBe(capabilities.length));
  it("nav, KB links and district destinations resolve to prerendered routes", () => {
    NAV.forEach((n) => expect(paths.has(n.to), n.to).toBe(true));
    kb.forEach((e) => e.links.forEach((l) => expect(paths.has(routeOf(l.to)), l.to).toBe(true)));
    districts.forEach((d) => d.destinations.forEach((x) => expect(paths.has(routeOf(x.to)), x.to).toBe(true)));
  });
  it("every project cover and district background exists in the brand library", () => {
    const pub = path.join(ROOT, "../brand/assets");
    [...projects.map((p) => p.cover), ...districts.map((d) => d.background)].forEach((f) => expect(fs.existsSync(path.join(pub, f.replace("/brand/", ""))), f).toBe(true));
  });
  it("corpus counts are internally consistent", () => {
    expect(corpus.studies.length).toBe(corpus.counts.directories);
    expect(corpus.studies.filter((s) => !s.summary).length).toBe(corpus.counts.empty);
    expect(new Set(corpus.studies.map((s) => s.day)).size).toBe(90);
  });
  it("prerenders one route per project, role, skill, tool, study and note", () => {
    expect(paths.size).toBe(17 + projects.length + experience.length + capabilities.length + TOOLS.length + corpus.studies.length + legacy.lab_notes.length);
  });
});

describe("media and screenshots", () => {
  it("ships only the optimised film encodes, each under 5 MB", () => {
    for (const f of ["gaurav-os-intro-av1-1080p.mp4", "gaurav-os-intro-h264-720p.mp4"]) {
      const p = path.join(ROOT, "public/media", f);
      expect(fs.existsSync(p), f).toBe(true);
      expect(fs.statSync(p).size).toBeLessThan(5 * 1024 * 1024);
    }
    expect(fs.existsSync(path.join(ROOT, "public/media/gaurav-os-intro.mp4"))).toBe(false);
  });
  it("the portrait is replaceable and present", () => {
    expect(profile.portrait.src).toBeTruthy();
    expect(fs.existsSync(path.join(ROOT, "public", profile.portrait.src!))).toBe(true);
    expect(profile.portrait.provenance).toMatch(/Provisional/);
  });
  it("publishes only screenshots approved in the review file", () => {
    const approvals = JSON.parse(fs.readFileSync(path.join(ROOT, "../brand/screenshot-review/approvals.json"), "utf8"));
    const published = JSON.parse(fs.readFileSync(path.join(ROOT, "src/data/screenshots.json"), "utf8"));
    expect(Object.keys(approvals)).toHaveLength(37);
    for (const s of published) { expect(approvals[s.id]?.approved, s.id).toBe(true); expect(s.data_note).toBeTruthy(); }
  });
  it("study text never contains the owner's phone number", () => {
    const dir = path.join(SRC, "data/generated/studies");
    for (const f of fs.readdirSync(dir)) expect(fs.readFileSync(path.join(dir, f), "utf8"), f).not.toMatch(/8127\s?5\s?1\s?2340/);
  });
});

describe("asset manifest", () => {
  const m = JSON.parse(fs.readFileSync(path.join(ROOT, "../brand/asset-manifest.json"), "utf8"));
  it("every manifest entry exists with its declared provenance and status", () => {
    for (const a of m.assets) {
      expect(fs.existsSync(path.join(ROOT, "..", a.file)), a.file).toBe(true);
      expect(a.provenance).toMatch(/ORIGINAL/);
      expect(a.status).toBeTruthy();
    }
  });
  it("no real screenshot is used before approval", () => expect(allSource()).not.toMatch(/docs\/10-evidence\/screenshots|docs\/assets\/screenshots|docs\/images\/0/));
});
