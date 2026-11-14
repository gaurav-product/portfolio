/**
 * The Gaurav.OS solar system at /universe: the Sun is Gaurav.OS, the Earth holds the 90 published
 * case studies, and each of the seven actual projects is its own planet.
 *
 * Every fact (name, status, one-line description, routes) is DERIVED from the existing content modules
 * (worlds in universe.ts ← projects.ts, and the research corpus). This file only adds the orbital layout
 * and each planet's visual direction, which is decoration, not a claim about the project.
 */
import { worlds } from "./universe";
import { projects } from "./projects";
import { corpusSummary } from "./data";

export type PlanetStyle = "calm" | "veins" | "network" | "terrain" | "grid" | "bands" | "radar" | "earth";

export interface PlanetLook {
  /** surface palette: base, secondary, accent (procedural texture) */
  base: string; second: string; accent: string;
  style: PlanetStyle;
  /** atmosphere / rim glow and orbit-trail colour */
  glow: string;
  ring?: boolean;
  moons?: number;
}

export interface Planet {
  slug: string;            // project slug, or "earth"
  kind: "earth" | "project";
  name: string;
  /** short label under the name: the project's subtitle, or "90 product case studies" */
  subtitle: string;
  statusLabel: string;
  tone: "green" | "cyan" | "amber" | "violet";
  oneLine: string;
  /** role · period for projects (from projects.ts) */
  meta?: string;
  /** the 3D world (projects) — Earth opens its own stage instead */
  worldPath?: string;
  /** the readable page */
  href: string;
  /** orbit radius (scene units), planet radius, start angle (rad), angular speed (rad/s), orbit tilt (rad) */
  orbit: number; size: number; phase: number; speed: number; tilt: number;
  look: PlanetLook;
}

/** Visual direction per project (from each project's own palette and domain). */
const LOOK: Record<string, PlanetLook> = {
  "evamastu": { style: "calm", base: "#123A2A", second: "#2E7A55", accent: "#9FE8C4", glow: "#6BE39A", ring: true },
  "aaroh": { style: "veins", base: "#0F2A1F", second: "#2B6B47", accent: "#F2C14E", glow: "#F2C14E" },
  "careconnect": { style: "network", base: "#1B1F5E", second: "#4B3AA8", accent: "#7FE0FF", glow: "#7A8BFF", moons: 2 },
  "ghargyaan": { style: "terrain", base: "#24412A", second: "#5E7A3A", accent: "#FFB36B", glow: "#9FD86B" },
  "nexus": { style: "grid", base: "#0C1424", second: "#1E2E52", accent: "#35D6D0", glow: "#8FD8FF", ring: true },
  "phonepe-smart-spend-coach": { style: "bands", base: "#2A1758", second: "#6B3FD1", accent: "#C9B6FF", glow: "#A98BFF", ring: true },
  "rupee-radar": { style: "radar", base: "#06301F", second: "#0F6B45", accent: "#4DFF4D", glow: "#4DFF4D" },
};

/** Orbit order from the Sun. The Earth keeps the third orbit (a nod to the real one); the rest follow the
 *  hub's domain order: healthcare first, then AI, then fintech. */
const ORDER = ["evamastu", "aaroh", "earth", "careconnect", "ghargyaan", "nexus", "phonepe-smart-spend-coach", "rupee-radar"] as const;

const SIZES: Record<string, number> = { "earth": 0.86, "evamastu": 0.61, "aaroh": 0.63, "careconnect": 0.68, "ghargyaan": 0.61, "nexus": 0.67, "phonepe-smart-spend-coach": 0.81, "rupee-radar": 0.65 };
/** A planet's visible radius including its atmosphere shell (Solar.tsx draws it at 1.16 × the body). */
export const ATMOSPHERE = 1.16;
/** Orbits are derived, not hand-set: each gap fits both neighbours' bodies and atmospheres plus a margin,
 *  so no two planets can touch or share a hit target, whatever their positions on their orbits. */
const FIRST_ORBIT = 4.4, MARGIN = 0.2;
const RADII = ORDER.reduce<number[]>((r, slug, i) => [...r, i === 0 ? FIRST_ORBIT : r[i - 1] + (SIZES[ORDER[i - 1]] + SIZES[slug]) * ATMOSPHERE + MARGIN], []);

export const EARTH_SLUG = "earth";

export const planets: Planet[] = ORDER.map((slug, i) => {
  const orbit = RADII[i];
  const common = { orbit, size: SIZES[slug], phase: (i * 2.399963) % (Math.PI * 2), speed: 0.11 / Math.sqrt(orbit), tilt: ((i % 3) - 1) * 0.02 };
  if (slug === EARTH_SLUG) {
    return {
      ...common, slug, kind: "earth" as const, name: "Earth", subtitle: `${corpusSummary.counts.written} product case studies`,
      statusLabel: "Research · published", tone: "green" as const,
      oneLine: `${corpusSummary.counts.written} daily product-management case studies of real companies, published in a public repository — each marker on this Earth is one study. Research and analysis, not products I launched.`,
      href: "/research", look: { style: "earth", base: "#0B2A4A", second: "#2F6B45", accent: "#3FB8FF", glow: "#3FB8FF" },
    };
  }
  const w = worlds.find((x) => x.slug === slug)!;
  const p = projects.find((x) => x.slug === slug)!;
  return {
    ...common, slug, kind: "project" as const, name: w.name, subtitle: w.category, statusLabel: w.statusLabel, tone: w.tone,
    oneLine: w.oneLine, meta: `${p.role} · ${p.period}`, worldPath: w.worldPath, href: w.href, look: LOOK[slug],
  };
});

export const planetBySlug = (s: string | null | undefined) => planets.find((p) => p.slug === s) ?? null;
export const projectPlanets = planets.filter((p) => p.kind === "project");
