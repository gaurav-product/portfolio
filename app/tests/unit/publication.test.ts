import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { projects } from "~/content/projects";
import { worlds } from "~/content/universe";
import { THIRD_PARTY_MARK } from "~/content/cinematic";
import { seo } from "~/lib/meta";

const ALLOWED = new Set(["VERIFIED", "CV", "CASE DATA", "DESIGNED, NOT RUN", "DOCUMENTED", "SOURCED", "NARRATIVE", "SELF-REPORTED"]);

describe("publication readiness: content", () => {
  it("every project highlight keeps a known evidence label", () => {
    for (const p of projects) for (const h of p.highlights) expect(ALLOWED.has(h.status), `${p.slug}: ${h.status}`).toBe(true);
  });
  it("no project still says its screenshots await approval (all 37 were approved on 7 Nov 2026)", () => {
    expect(JSON.stringify(projects)).not.toMatch(/await(s|ing)? approval/i);
  });
});

describe("publication readiness: social cards", () => {
  it("every project world has its own share card, built from approved art", () => {
    for (const w of worlds) expect(fs.existsSync(path.join(__dirname, "../../public/og", `${w.slug}.png`)), w.slug).toBe(true);
  });
  it("a project with a third-party mark is still listed with its disclaimer source", () => {
    expect(THIRD_PARTY_MARK["phonepe-smart-spend-coach"]).toMatch(/not affiliated/i);
  });
  it("seo() uses the page's own card when given, the site card otherwise", () => {
    const tags = (img?: string) => JSON.stringify(seo("T", "D", "/x", img));
    // without VITE_SITE_URL no absolute URLs are emitted; the parameter must at least be accepted
    expect(tags("/og/nexus.png")).toContain("T");
    expect(tags()).toContain("T");
  });
});
