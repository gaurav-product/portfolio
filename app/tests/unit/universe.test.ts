import { describe, it, expect } from "vitest";
import { destinations, destinationBySlug, worlds, ventureWorlds, teardownWorld, UNIVERSE_REDIRECTS, CLUSTERS, EARTH_CREDIT } from "~/content/universe";
import { studyLayout, angleBetween, categoriesOf, matches, filterFromParams, isFiltered, SPACING, CAT_COLOR, LEVEL_R } from "~/content/studyMap";
import { corpus } from "~/content/corpus";
import { projects } from "~/content/projects";
import { ventures, VENTURES_NOTE } from "~/content/ventures";
import { answerLocally } from "~/guide/brain/local";
import { buildKnowledgePack } from "~/guide/knowledge";
import { staticPaths } from "~/content/routes-manifest";
import { isImmersive, project3dPath } from "~/lib/immersive";
import { withQuery } from "~/routes/universe-redirect";
import shots from "~/data/screenshots.json";

const studies = corpus.studies;

describe("the Earth: one marker per case study", () => {
  const { pins, regions } = studyLayout(studies);
  it("has exactly 90 markers, one per study, from the corpus", () => {
    expect(studies.length).toBe(90);
    expect(pins.length).toBe(studies.length);
    expect(new Set(pins.map((p) => p.day)).size).toBe(90);
    expect(pins.map((p) => p.day).sort((a, b) => a - b)).toEqual(studies.map((s) => s.day).sort((a, b) => a - b));
  });
  it("no project, newsletter, concept or corpus marker is on the Earth", () => {
    expect(pins.every((p) => typeof p.day === "number")).toBe(true);
    for (const d of destinations) expect(pins.some((p) => String(p.day) === d.slug)).toBe(false);
  });
  it("colour is the study's category and size its evidence level (the Atlas vocabulary)", () => {
    for (const p of pins) {
      const s = studies.find((x) => x.day === p.day)!;
      expect(p.category).toBe(s.category);
      expect(p.color).toBe(CAT_COLOR[s.category]);
      expect(p.size).toBe(LEVEL_R[s.evidence_level]);
    }
  });
  it("markers never overlap and every category has its own region", () => {
    let min = Infinity;
    for (let i = 0; i < pins.length; i++) for (let j = i + 1; j < pins.length; j++) min = Math.min(min, angleBetween(pins[i], pins[j]));
    expect(min).toBeGreaterThan(SPACING * 0.9);
    expect(regions.map((r) => r.name).sort()).toEqual(categoriesOf(studies).map((c) => c.name).sort());
    expect(regions.reduce((n, r) => n + r.count, 0)).toBe(90);
    for (const p of pins) { expect(Math.abs(p.lat)).toBeLessThanOrEqual(90); expect(Math.abs(p.lon)).toBeLessThanOrEqual(180); }
  });
  it("the layout is deterministic", () => {
    expect(studyLayout(studies)).toEqual(studyLayout([...studies].reverse()));
  });
  it("filters read from the URL and match search, category, evidence and contents", () => {
    const f = filterFromParams(new URLSearchParams("q=netflix&cat=Consumer&ev=sourced&has=prd"));
    expect(f).toEqual({ q: "netflix", cats: ["Consumer"], levels: ["SOURCED"], has: ["prd"] });
    expect(isFiltered(f)).toBe(true);
    expect(studies.filter((s) => matches(s, f)).map((s) => s.company)).toContain("Netflix");
    expect(filterFromParams(new URLSearchParams("ev=bogus&has=nope"))).toEqual({ q: "", cats: [], levels: [], has: [] });
    expect(studies.filter((s) => matches(s, filterFromParams(new URLSearchParams("q=day 12")))).map((s) => s.day)).toEqual([12]);
  });
  it("the texture credit is present", () => { expect(EARTH_CREDIT.text).toMatch(/CC BY 4\.0/); });
});

describe("3D worlds", () => {
  it("the /worlds hub holds exactly the 7 actual projects — no concepts, newsletter or corpus", () => {
    expect(worlds.length).toBe(7);
    expect(worlds.map((w) => w.slug).sort()).toEqual(projects.filter((p) => p.slug !== "90-day-case-studies").map((p) => p.slug).sort());
    expect(worlds.some((w) => w.concept || w.slug === "the-teardown")).toBe(false);
    for (const w of worlds) { expect(w.worldPath).toBe(`/worlds/${w.slug}`); expect(w.back.to).toBe("/worlds"); }
  });
  it("The Teardown and both concepts keep their 3D worlds at their own routes", () => {
    expect(teardownWorld.worldPath).toBe("/writing/the-teardown");
    expect(teardownWorld.back.to).toBe("/about#writing-h");
    expect(ventureWorlds.map((v) => v.worldPath).sort()).toEqual(["/ventures/interview-radar/world", "/ventures/repass/world"]);
    for (const v of ventureWorlds) expect(v.back.to).toBe(`/ventures/${v.slug}`);
    expect(destinations.length).toBe(10);
  });
  it("statuses come from the content modules, unchanged", () => {
    for (const w of worlds) expect(w.status).toBe(projects.find((p) => p.slug === w.slug)!.status);
    for (const d of ventureWorlds) expect(d.statusLabel).toBe("Concept in development");
  });
  it("concepts are never shown as built: amber, no screenshots, labelled concept visuals", () => {
    for (const d of ventureWorlds) {
      expect(d.concept).toBe(true); expect(d.cluster).toBe("Emerging Ventures");
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
  it("every cluster is still used", () => { for (const c of CLUSTERS) expect(destinations.some((d) => d.cluster === c)).toBe(true); });
});

describe("routes and redirects", () => {
  const paths = staticPaths();
  it("prerenders the Earth, the hub, every world and every concept", () => {
    for (const p of ["/universe", "/worlds", "/writing/the-teardown", "/ventures", "/atlas", "/explore/city"]) expect(paths).toContain(p);
    for (const d of destinations) expect(paths).toContain(d.worldPath);
    for (const v of ventures) expect(paths).toContain(`/ventures/${v.slug}`);
  });
  it("every old /universe/<slug> address is prerendered and points at its new home", () => {
    expect(Object.keys(UNIVERSE_REDIRECTS).sort()).toEqual([...destinations.map((d) => d.slug), "90-day-case-studies"].sort());
    for (const [slug, to] of Object.entries(UNIVERSE_REDIRECTS)) { expect(paths).toContain(`/universe/${slug}`); expect(paths.includes(to.split(/[#?]/)[0])).toBe(true); }
    expect(UNIVERSE_REDIRECTS["careconnect"]).toBe("/worlds/careconnect");
    expect(UNIVERSE_REDIRECTS["the-teardown"]).toBe("/writing/the-teardown");
    expect(UNIVERSE_REDIRECTS["repass"]).toBe("/ventures/repass/world");
    expect(UNIVERSE_REDIRECTS["90-day-case-studies"]).toBe("/universe?at=earth");
  });
  it("redirects carry the query string and hash", () => {
    expect(withQuery("/worlds/nexus", "?tier=laptop", "#x")).toBe("/worlds/nexus?tier=laptop#x");
    expect(withQuery("/universe", "?study=4", "")).toBe("/universe?study=4");
    // a target with its own query keeps it and the old address's query is appended (no second "?")
    expect(withQuery("/universe?at=earth", "?study=4&cat=SaaS", "")).toBe("/universe?at=earth&study=4&cat=SaaS");
    expect(withQuery("/universe?at=earth", "", "")).toBe("/universe?at=earth");
    expect(withQuery("/about#writing-h", "?a=1", "")).toBe("/about?a=1#writing-h");
    expect(withQuery("/about#writing-h", "", "#other")).toBe("/about#other");
  });
  it("no world uses a building archetype that does not exist", () => {
    for (const d of destinations) expect(["pavilion", "retreat", "campus", "house", "tower", "facility", "station", "workshop", "command", "hall"]).toContain(d.building.archetype);
  });
  it("full-screen mode covers the Earth and the worlds, not the hub or concept pages", () => {
    for (const p of ["/universe", "/universe/repass", "/worlds/nexus", "/writing/the-teardown", "/ventures/repass/world"]) expect(isImmersive(p)).toBe(true);
    for (const p of ["/worlds", "/ventures", "/ventures/repass", "/projects", "/", "/about"]) expect(isImmersive(p)).toBe(false);
    expect(project3dPath("careconnect")).toBe("/worlds/careconnect");
    expect(project3dPath("90-day-case-studies")).toBe("/universe?at=earth");
  });
});

describe("ventures copy guards", () => {
  it("Repass keeps the legal limits and labels its example as illustrative", () => {
    const r = ventures.find((v) => v.slug === "repass")!;
    expect(r.example!.label).toMatch(/illustrative/i);
    expect(r.trust!.join(" ")).toMatch(/Indian Railways/);
  });
});

describe("Oz and the 3D pages", () => {
  it("lists healthcare work by cluster with links to its project worlds", () => {
    const r = answerLocally("Oz, show me Gaurav's healthcare projects", "en");
    expect(r.text).toMatch(/CareConnect/); expect(r.text).toMatch(/GharGyaan/);
    expect(r.links.length).toBeGreaterThan(0);
    expect(r.links.every((l) => l.to.startsWith("/worlds/"))).toBe(true);
  });
  it("opens a concept's page and offers its 3D world", () => {
    const ir = answerLocally("Take me to Interview Radar", "en");
    expect(ir.navigate).toBe("/ventures/interview-radar");
    expect(ir.links.map((l) => l.to)).toContain("/ventures/interview-radar/world");
    expect(answerLocally("Show me Repass", "en").navigate).toBe("/ventures/repass");
    expect(answerLocally("Take me back to Earth", "en").navigate).toBe("/universe?at=earth");
    expect(answerLocally("Show me the solar system", "en").navigate).toBe("/universe");
    expect(answerLocally("Take me to the project worlds", "en").navigate).toBe("/worlds");
  });
  it("describes a concept as not built, and refuses its revenue", () => {
    const r = answerLocally("What is Repass?", "en");
    expect(r.text).toMatch(/not built|concept/i); expect(r.text).not.toMatch(/\b\d+ users\b/);
    expect(answerLocally("How much revenue does Repass make?", "en").kind).toBe("refused");
  });
  it("the AI endpoint's knowledge pack carries the concepts, their status and the new 3D addresses", () => {
    const k = buildKnowledgePack();
    expect(k).toContain("Interview Radar"); expect(k).toContain("never describe them as built");
    expect(k).toContain("/ventures/repass/world"); expect(k).not.toContain("/universe/repass");
  });
});

import { planets, projectPlanets, planetBySlug, EARTH_SLUG } from "~/content/solar";
describe("the Gaurav.OS solar system", () => {
  it("is the Earth plus exactly the seven actual projects — nothing else", () => {
    expect(planets).toHaveLength(8);
    expect(planets.filter((p) => p.kind === "earth").map((p) => p.slug)).toEqual([EARTH_SLUG]);
    expect(projectPlanets.map((p) => p.slug).sort()).toEqual(worlds.map((w) => w.slug).sort());
    for (const bad of ["repass", "interview-radar", "the-teardown", "90-day-case-studies"]) expect(planetBySlug(bad)).toBeNull();
  });
  it("takes every fact from the world and project content, and links to the real routes", () => {
    for (const p of projectPlanets) {
      const w = worlds.find((x) => x.slug === p.slug)!;
      expect(p).toMatchObject({ name: w.name, statusLabel: w.statusLabel, oneLine: w.oneLine, worldPath: `/worlds/${p.slug}`, href: `/projects/${p.slug}` });
      expect(p.meta).toMatch(/ · /);
    }
    const earth = planetBySlug(EARTH_SLUG)!;
    expect(earth.oneLine).toMatch(/not products I launched/);
  });
  it("lays the orbits out from the inside out: neighbouring planets (with their atmospheres) can never touch", async () => {
    const { ATMOSPHERE } = await import("~/content/solar");
    planets.forEach((p, i) => { if (i) expect(p.orbit - planets[i - 1].orbit).toBeGreaterThan((planets[i - 1].size + p.size) * ATMOSPHERE); });
  });
});

describe("project-world tour order", () => {
  it("Previous / Next walk the worlds in the solar system's planet order, so numbering agrees everywhere", async () => {
    const { worldTour } = await import("~/content/universe");
    const { projectPlanets } = await import("~/content/solar");
    expect(worldTour.map((w) => w.slug)).toEqual(projectPlanets.map((p) => p.slug));
    expect(new Set(worldTour.map((w) => w.slug)).size).toBe(worlds.length);
  });
});
