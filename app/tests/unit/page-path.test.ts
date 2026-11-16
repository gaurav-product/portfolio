import { describe, it, expect } from "vitest";
import { pagePath } from "~/lib/meta";

// Canonical, og:url and sitemap URLs must name the address GitHub Pages actually serves (<route>/index.html),
// so they carry a trailing slash and never point at a 301.
describe("pagePath", () => {
  it("adds the trailing slash to page routes", () => {
    expect(pagePath("/research/7")).toBe("/research/7/");
    expect(pagePath("/worlds/careconnect")).toBe("/worlds/careconnect/");
    expect(pagePath("/explore")).toBe("/explore/");
  });
  it("leaves the root and already-final paths alone", () => {
    expect(pagePath("/")).toBe("/");
    expect(pagePath("/research/7/")).toBe("/research/7/");
  });
  it("keeps the query string and hash after the slash", () => {
    expect(pagePath("/universe?at=earth")).toBe("/universe/?at=earth");
    expect(pagePath("/about#certifications")).toBe("/about/#certifications");
  });
  it("does not add a slash to files", () => {
    expect(pagePath("/sitemap.xml")).toBe("/sitemap.xml");
    expect(pagePath("/og/careconnect.png")).toBe("/og/careconnect.png");
  });
});
