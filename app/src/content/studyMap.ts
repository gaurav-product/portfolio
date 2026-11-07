/**
 * The 90 product-management case studies as a map — shared by the 3D Earth
 * (/universe) and the 2D constellation (/atlas). Data comes only from the
 * generated corpus (`corpus.studies`, the single source of truth); nothing is
 * copied or rewritten here. Categories are the corpus's own derived labels.
 */
import type { Study } from "./data";

/** Category colours and evidence-level sizes — the vocabulary /atlas already used. */
export const CAT_COLOR: Record<string, string> = { Healthcare: "#6BE39A", AI: "#35D6D0", Consumer: "#F2C14E", Fintech: "#BCA6FF", Marketplace: "#FF9F6E", SaaS: "#7FB2FF", B2B: "#E58BD8", Analytics: "#F3F6F4" };
export const LEVEL_R: Record<string, number> = { VERIFIED: 9, DOCUMENTED: 7, SOURCED: 5.5, NARRATIVE: 4 };
export const LEVELS = ["VERIFIED", "DOCUMENTED", "SOURCED", "NARRATIVE"] as const;
export const LEVEL_NOTE: Record<string, string> = {
  VERIFIED: "Executed checks recorded in the study (programmatic verification).",
  DOCUMENTED: "Assumptions and method written down; no executed checks.",
  SOURCED: "References cited; method not separately documented.",
  NARRATIVE: "Written analysis with few or no references.",
};
export const HAS = { prd: "has PRD", experiment: "has experiment", assumptions: "has ASSUMPTIONS file", checks: "executed checks" } as const;
export type HasKey = keyof typeof HAS;
export const hasFlag = (s: Study, k: HasKey) => (k === "prd" ? s.has_prd : k === "experiment" ? s.has_experiment : k === "assumptions" ? s.has_assumptions : !!s.verification);

/** Categories in descending size (ties by name) — derived from the data, not hard-coded. */
export function categoriesOf(studies: Study[]) {
  const n = new Map<string, number>();
  for (const s of studies) n.set(s.category, (n.get(s.category) ?? 0) + 1);
  return [...n.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([name, count]) => ({ name, count }));
}

export interface StudyPin { day: number; lat: number; lon: number; category: string; color: string; size: number }
export interface Region { name: string; count: number; lat: number; lon: number }

const GOLDEN = Math.PI * (3 - Math.sqrt(5));
const deg = (r: number) => (r * 180) / Math.PI, rad = (d: number) => (d * Math.PI) / 180;

/** Region centres: points spread over the globe (a Fibonacci sphere, kept within ±55° latitude). */
function regionCentres(k: number) {
  const out: { lat: number; lon: number }[] = [];
  for (let i = 0; i < k; i++) {
    const y = 1 - (i + 0.5) * (2 / k);
    out.push({ lat: Math.max(-55, Math.min(55, deg(Math.asin(y)) * 0.75)), lon: ((deg(i * GOLDEN * 1.0) % 360) + 540) % 360 - 180 });
  }
  return out;
}
/** Move `dist` degrees from a point along a bearing (great-circle). */
function offset(lat: number, lon: number, dist: number, bearing: number) {
  const φ1 = rad(lat), λ1 = rad(lon), δ = rad(dist), θ = bearing;
  const φ2 = Math.asin(Math.sin(φ1) * Math.cos(δ) + Math.cos(φ1) * Math.sin(δ) * Math.cos(θ));
  const λ2 = λ1 + Math.atan2(Math.sin(θ) * Math.sin(δ) * Math.cos(φ1), Math.cos(δ) - Math.sin(φ1) * Math.sin(φ2));
  return { lat: deg(φ2), lon: ((deg(λ2) + 540) % 360) - 180 };
}
/** Great-circle angle between two points, in degrees. */
export function angleBetween(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
  const φ1 = rad(a.lat), φ2 = rad(b.lat), dλ = rad(b.lon - a.lon);
  return deg(Math.acos(Math.min(1, Math.max(-1, Math.sin(φ1) * Math.sin(φ2) + Math.cos(φ1) * Math.cos(φ2) * Math.cos(dλ)))));
}

/**
 * Deterministic layout: one region per derived category (largest first), and inside a region the
 * studies sit in day order on a golden-angle spiral, ~4.6° apart. Same input → same positions.
 */
export const SPACING = 4.6;
export function studyLayout(studies: Study[]): { pins: StudyPin[]; regions: Region[] } {
  const cats = categoriesOf(studies);
  const centres = regionCentres(cats.length);
  const pins: StudyPin[] = [], regions: Region[] = [];
  cats.forEach((c, i) => {
    const centre = centres[i];
    regions.push({ name: c.name, count: c.count, ...centre });
    const inCat = studies.filter((s) => s.category === c.name).sort((a, b) => a.day - b.day);
    inCat.forEach((s, k) => {
      const p = k === 0 ? centre : offset(centre.lat, centre.lon, SPACING * Math.sqrt(k + 0.25) * 0.98, k * GOLDEN);
      pins.push({ day: s.day, lat: p.lat, lon: p.lon, category: s.category, color: CAT_COLOR[s.category] ?? "#A1ADA7", size: LEVEL_R[s.evidence_level] ?? 5 });
    });
  });
  return { pins: pins.sort((a, b) => a.day - b.day), regions };
}

/** Filters shared by the study browser and the Earth (URL: ?q, ?cat, ?ev, ?has). */
export interface StudyFilter { q: string; cats: string[]; levels: string[]; has: HasKey[] }
export const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, " ").trim();
export function matches(s: Study, f: StudyFilter) {
  if (f.cats.length && !f.cats.includes(s.category)) return false;
  if (f.levels.length && !f.levels.includes(s.evidence_level)) return false;
  if (f.has.some((h) => !hasFlag(s, h))) return false;
  const exact = /^\s*day\s*(\d+)\s*$/i.exec(f.q);
  if (exact) return s.day === Number(exact[1]);
  if (f.q) { const hay = norm(`${s.company} ${s.title} ${s.summary} day ${s.day}`); if (!norm(f.q).split(" ").every((w) => hay.includes(w))) return false; }
  return true;
}
export function filterFromParams(p: URLSearchParams): StudyFilter {
  const list = (k: string) => (p.get(k) ?? "").split(",").map((x) => x.trim()).filter(Boolean);
  return { q: p.get("q") ?? "", cats: list("cat"), levels: list("ev").map((x) => x.toUpperCase()).filter((x) => (LEVELS as readonly string[]).includes(x)), has: list("has").filter((x): x is HasKey => x in HAS) };
}
export const isFiltered = (f: StudyFilter) => !!(f.q || f.cats.length || f.levels.length || f.has.length);
