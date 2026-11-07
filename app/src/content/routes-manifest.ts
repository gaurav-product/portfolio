import { projects } from "./projects";
import { capabilities } from "./capabilities";
import { experience } from "./experience";
import { districts } from "./districts";
import { ventures } from "./ventures";
import { worlds, ventureWorlds, UNIVERSE_REDIRECTS } from "./universe";
import corpus from "../data/generated/corpus.json";
import legacy from "../data/generated/legacy.json";

import { TOOLS } from "./nav";
export { NAV, TOOLS } from "./nav";

export const STATIC_PAGES = [
  "/", "/about", "/experience", "/projects", "/case-studies", "/product-thinking", "/skills",
  "/research", "/atlas", "/ai-lab", "/ask", "/lab-notes", "/contact", "/recruiter", "/explore", "/explore/city", "/universe", "/worlds", "/writing/the-teardown", "/ventures", "/cv", "/search",
];

export function staticPaths(): string[] {
  return [
    ...STATIC_PAGES,
    ...projects.map((p) => `/projects/${p.slug}`),
    ...ventures.map((v) => `/ventures/${v.slug}`),
    ...worlds.map((d) => `/worlds/${d.slug}`),
    ...ventureWorlds.map((d) => `/ventures/${d.slug}/world`),
    // old addresses: prerendered redirect pages
    ...Object.keys(UNIVERSE_REDIRECTS).map((s) => `/universe/${s}`),
    ...experience.map((r) => `/experience/${r.id}`),
    ...districts.map((d) => `/districts/${d.id}`),
    ...capabilities.map((c) => `/skills/${c.id}`),
    ...TOOLS.map((t) => `/product-thinking/${t.slug}`),
    ...(corpus as { studies: { day: number }[] }).studies.map((s) => `/research/${s.day}`),
    ...(legacy as { lab_notes: { slug: string }[] }).lab_notes.map((n) => `/lab-notes/${n.slug}`),
  ];
}
