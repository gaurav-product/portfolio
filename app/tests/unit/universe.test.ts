import { describe, it, expect } from "vitest";
import { destinations, destinationBySlug, CLUSTERS, EARTH_CREDIT } from "~/content/universe";
import { projects } from "~/content/projects";
import { ventures, VENTURES_NOTE } from "~/content/ventures";
import { answerLocally } from "~/guide/brain/local";
import { buildKnowledgePack } from "~/guide/knowledge";
import { staticPaths } from "~/content/routes-manifest";
import shots from "~/data/screenshots.json";

describe("product universe destinations", () => {
  it("every project, the newsletter and both concepts have exactly one marker", () => {
    const slugs = destinations.map((d) => d.slug);
    for (const p of projects) expect(slugs).toContain(p.slug);
    for (const v of ventures) expect(slugs).toContain(v.slug);
    expect(slugs).toContain("the-teardown");
    expect(new Set(slugs).size).toBe(slugs.length);
  });
  it("statuses come from the content modules, unchanged", () => {
    for (const p of projects) expect(destinationBySlug(p.slug)!.status).toBe(p.status);
    for (const d of destinations.filter((x) => x.concept)) expect(d.statusLabel).toBe("Concept in development");
  });
  it("concepts are never shown as built: amber, no screenshots, labelled concept visuals", () => {
    for (const d of destinations.filter((x) => x.concept)) {
      expect(d.cluster).toBe("Emerging Ventures");
      expect(d.oneLine).toContain(VENTURES_NOTE);
      expect(d.gallery.every((g) => g.kind === "concept" && /concept visual/i.test(g.label))).toBe(true);
    }
  });
  it("screenshots appear only for their own project, always labelled as demo data", () => {
    for (const d of destinations) for (const g of d.gallery.filter((x) => x.kind === "screenshot")) {
      expect(g.src).toContain(`/screenshots/${d.slug}--`);
      expect(g.label).toMatch(/actual product screenshot · demo data/i);
    }
    expect((shots as unknown[]).length).toBe(37);
  });
  it("projects without screens get a labelled placeholder — never a stand-in image", () => {
    for (const slug of ["aaroh", "evamastu", "phonepe-smart-spend-coach", "rupee-radar"])
      expect(destinationBySlug(slug)!.gallery.some((g) => g.kind === "missing" && !g.src)).toBe(true);
  });
  it("markers sit on valid coordinates, every cluster is used, and the texture credit is present", () => {
    for (const d of destinations) { expect(Math.abs(d.lat)).toBeLessThanOrEqual(90); expect(Math.abs(d.lon)).toBeLessThanOrEqual(180); }
    for (const c of CLUSTERS) expect(destinations.some((d) => d.cluster === c)).toBe(true);
    expect(EARTH_CREDIT.text).toMatch(/CC BY 4\.0/);
  });
  it("every world and venture is prerendered", () => {
    const paths = staticPaths();
    for (const d of destinations) expect(paths).toContain(`/universe/${d.slug}`);
    for (const p of ["/universe", "/ventures", "/ventures/interview-radar", "/ventures/repass", "/explore/city"]) expect(paths).toContain(p);
  });
});

describe("ventures copy guards", () => {
  it("Repass keeps the legal limits and labels its example as illustrative", () => {
    const r = ventures.find((v) => v.slug === "repass")!;
    expect(r.example!.label).toMatch(/illustrative/i);
    expect(r.trust!.join(" ")).toMatch(/Indian Railways/);
  });
});

describe("Oz in the universe", () => {
  it("lists healthcare work by cluster with 3D links", () => {
    const r = answerLocally("Oz, show me Gaurav's healthcare projects", "en");
    expect(r.text).toMatch(/CareConnect/); expect(r.text).toMatch(/GharGyaan/);
    expect(r.links.every((l) => l.to.startsWith("/universe/"))).toBe(true);
  });
  it("takes visitors to a concept world, and back to Earth", () => {
    expect(answerLocally("Take me to Interview Radar", "en").navigate).toBe("/universe/interview-radar");
    expect(answerLocally("Show me Repass", "en").navigate).toBe("/universe/repass");
    expect(answerLocally("Take me back to Earth", "en").navigate).toBe("/universe");
  });
  it("describes a concept as not built, and refuses its revenue", () => {
    const r = answerLocally("What is Repass?", "en");
    expect(r.text).toMatch(/not built|concept/i); expect(r.text).not.toMatch(/\b\d+ users\b/);
    expect(answerLocally("How much revenue does Repass make?", "en").kind).toBe("refused");
  });
  it("the AI endpoint's knowledge pack carries the concepts and their status", () => {
    const k = buildKnowledgePack();
    expect(k).toContain("Interview Radar"); expect(k).toContain("never describe them as built");
  });
});
