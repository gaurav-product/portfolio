/**
 * The 3D worlds: one per actual project (the /worlds hub), plus The Teardown
 * (/writing/the-teardown) and the two concepts in development
 * (/ventures/<slug>/world). Derived from the existing content modules
 * (projects.ts, newsletter.ts, ventures.ts) so names, statuses and descriptions
 * have one source of truth. The Earth at /universe shows the 90 case studies
 * (see studyMap.ts) — none of these worlds sit on it.
 */
import { CORPUS_SLUG } from "../lib/immersive";
import { projects } from "./projects";
import { newsletter } from "./newsletter";
import { ventures, VENTURES_NOTE } from "./ventures";
import { hasCinematic, cinematic } from "./cinematic";
import shots from "../data/screenshots.json";
import type { CaseSectionKey } from "./types";

export type Cluster = "Healthcare" | "AI" | "Fintech" | "Research & writing" | "Emerging Ventures";
export type Archetype = "pavilion" | "retreat" | "campus" | "house" | "tower" | "facility" | "station" | "workshop" | "command" | "hall";

export interface GalleryItem {
  kind: "screenshot" | "brand" | "render" | "concept" | "missing";
  /** full-size image for the lightbox (public path); concept/missing panels are drawn in-scene */
  src?: string;
  /** in-scene panel texture (16:10 crop for screenshots) */
  panel?: string;
  width?: number; height?: number;
  title: string;
  label: string;   // the provenance tag shown on the panel and in the lightbox
  note?: string;
  source?: string;
  lines?: string[]; // concept / missing panels: the text drawn on them
}

export interface BuildingSpec {
  archetype: Archetype;
  /** body, glass tint and light colour */
  palette: { body: string; glass: string; light: string; accent: string };
  floors: number;
  /** one line describing the design idea (shown in the panel's credits) */
  idea: string;
}

export interface Destination {
  slug: string;
  name: string;
  cluster: Cluster;
  category: string;
  status: string;      // as written in the content module
  statusLabel: string; // short label for chips: MVP, Prototype, Pre-launch, Academic case study, Research, Product teardowns, Concept in development
  tone: "green" | "cyan" | "amber" | "violet";
  oneLine: string;
  art: string | null;  // cinematic image id for the preview card
  href: string;        // the readable page (recruiter-friendly)
  external?: boolean;
  concept: boolean;
  /** where the 3D world lives, and where its back button leads */
  worldPath: string;
  back: { to: string; label: string };
  building: BuildingSpec;
  gallery: GalleryItem[];
  /** case-study section keys to show, in the brief's order, if the project has them */
  sectionOrder: CaseSectionKey[];
}

export const SECTION_ORDER: CaseSectionKey[] = [
  "summary", "problem", "why", "segments", "methodology", "insights", "jtbd", "opportunity", "strategy", "vision", "competition",
  "journey", "flows", "ia", "prototype", "mvp", "prd", "prioritization", "tradeoffs", "execution", "experimentation", "analytics",
  "results", "risks", "learnings", "next", "evidence",
];

const STATUS_LABEL: Record<string, string> = {
  "SHIPPED": "Shipped (employer product)",
  "PRE-LAUNCH · PROTOTYPE": "Pre-launch prototype",
  "MVP · NO USERS": "MVP · no users",
  "PROTOTYPE · DEMO MODE": "Prototype · demo mode",
  "PROTOTYPE · NOT DEPLOYED": "Prototype · not deployed",
  "ACADEMIC CASE": "Academic case study",
  "PUBLISHED": "Research · published",
};

/** Each world's building (procedural, original) and its group in the hub. */
const PLACE: Record<string, { cluster: Cluster; building: BuildingSpec }> = {
  "evamastu": { cluster: "Healthcare", building: { archetype: "pavilion", floors: 3, palette: { body: "#2B2A24", glass: "#9FE8C4", light: "#F2C14E", accent: "#6BE39A" }, idea: "A calm mindfulness pavilion: timber-toned fins around a still water court, lit like early morning." } },
  "aaroh": { cluster: "Healthcare", building: { archetype: "retreat", floors: 2, palette: { body: "#20302A", glass: "#B9F3D6", light: "#FFB36B", accent: "#6BE39A" }, idea: "A low healing retreat: curved terraces with green roofs and a warm interior glow." } },
  "careconnect": { cluster: "Healthcare", building: { archetype: "campus", floors: 5, palette: { body: "#1B2A27", glass: "#7FE0D8", light: "#35D6D0", accent: "#4DFF4D" }, idea: "A glass care campus: two linked wings — family and attendant — joined by a handover bridge." } },
  "ghargyaan": { cluster: "Healthcare", building: { archetype: "house", floors: 3, palette: { body: "#2C2620", glass: "#FFD9A0", light: "#FFB36B", accent: "#6BE39A" }, idea: "A home-scale knowledge house: stacked library volumes with lantern windows." } },
  "nexus": { cluster: "AI", building: { archetype: "facility", floors: 4, palette: { body: "#141C22", glass: "#8FD8FF", light: "#35D6D0", accent: "#A98BFF" }, idea: "A research facility: a lit core inside orbiting decision rings, with data-wall screens." } },
  "phonepe-smart-spend-coach": { cluster: "Fintech", building: { archetype: "tower", floors: 9, palette: { body: "#1A1B26", glass: "#B7A6FF", light: "#A98BFF", accent: "#35D6D0" }, idea: "A faceted fintech tower in metal and glass. Its chart façade is decorative — no data." } },
  "rupee-radar": { cluster: "Fintech", building: { archetype: "station", floors: 2, palette: { body: "#18211E", glass: "#9CF0C8", light: "#4DFF4D", accent: "#35D6D0" }, idea: "A low radar station: a dish array beside statement-ledger screens." } },
  "the-teardown": { cluster: "Research & writing", building: { archetype: "workshop", floors: 2, palette: { body: "#221E1A", glass: "#FFD9A0", light: "#F2C14E", accent: "#6BE39A" }, idea: "A teardown workshop: product panels pulled apart and laid out for inspection." } },
  "interview-radar": { cluster: "Emerging Ventures", building: { archetype: "command", floors: 4, palette: { body: "#161D24", glass: "#8FE7FF", light: "#35D6D0", accent: "#4DFF4D" }, idea: "Concept: a glass recruitment command centre with live opportunity boards and interview pods." } },
  "repass": { cluster: "Emerging Ventures", building: { archetype: "hall", floors: 3, palette: { body: "#1E1826", glass: "#E2B8FF", light: "#FF7AC8", accent: "#35D6D0" }, idea: "Concept: a digital ticket hall with floating ticket displays and a verification desk." } },
};

type Shot = { id: string; project: string; src: string; panel: string; width: number; height: number; caption: string; data_note: string; source: string };
const art = (slug: string) => (hasCinematic(`brand-${slug}`) ? `brand-${slug}` : hasCinematic(`render-project-${slug}`) ? `render-project-${slug}` : null);
const cine = (id: string) => `/cinematic/${id}-1200.webp`;

/** Text products (the research corpus, the newsletter) have no product screens to miss. */
const NO_SCREENS_EXPECTED = new Set(["the-teardown"]);
/** The research corpus is not a world: its 90 studies are the markers on the Earth. */
const CORPUS = CORPUS_SLUG;
const dims = (id: string) => ({ width: cinematic(id).width, height: cinematic(id).height });

function galleryFor(slug: string, name: string): GalleryItem[] {
  const g: GalleryItem[] = (shots as Shot[]).filter((s) => s.project === slug).map((s) => ({
    kind: "screenshot", src: s.src, panel: s.panel, width: s.width, height: s.height,
    title: s.caption.replace(/^./, (c) => c.toUpperCase()), label: "Actual product screenshot · demo data", note: s.data_note, source: s.source,
  }));
  if (hasCinematic(`brand-${slug}`)) g.push({ kind: "brand", src: cine(`brand-${slug}`), panel: cine(`brand-${slug}`), ...dims(`brand-${slug}`), title: `${name} brand artwork`, label: "Brand artwork · illustration, not a screenshot" });
  if (hasCinematic(`render-project-${slug}`)) g.push({ kind: "render", src: cine(`render-project-${slug}`), panel: cine(`render-project-${slug}`), ...dims(`render-project-${slug}`), title: `${name} — original 3D render`, label: "Original 3D render · not a screenshot" });
  if (!NO_SCREENS_EXPECTED.has(slug) && !g.some((x) => x.kind === "screenshot")) g.push({ kind: "missing", title: "Product screens not supplied", label: "Placeholder", lines: ["Product screens", "not supplied yet", "", "Nothing is shown in their place."] });
  return g;
}

const projectDest: Destination[] = projects.filter((p) => p.slug !== CORPUS).map((p) => {
  const place = PLACE[p.slug];
  return {
    slug: p.slug, name: p.name, cluster: place.cluster, category: p.subtitle, status: p.status,
    statusLabel: STATUS_LABEL[p.status] ?? p.status, tone: p.statusTone, oneLine: p.oneLine, art: art(p.slug),
    href: `/projects/${p.slug}`, concept: false, worldPath: `/worlds/${p.slug}`, back: { to: "/worlds", label: "All worlds" }, building: place.building,
    gallery: galleryFor(p.slug, p.name), sectionOrder: SECTION_ORDER,
  };
});

const teardown: Destination = {
  slug: "the-teardown", name: newsletter.name, cluster: "Research & writing", category: `${newsletter.cadence} ${newsletter.platform} newsletter — ${newsletter.tagline.toLowerCase()}`,
  status: "PUBLISHED", statusLabel: "Product teardowns · newsletter", tone: "green",
  oneLine: `A ${newsletter.cadence.toLowerCase()} newsletter on ${newsletter.platform} that takes products apart. ${newsletter.subscribers} subscribers (${newsletter.subscribersNote}).`,
  art: art("the-teardown"), href: newsletter.url ?? newsletter.profileUrl, external: true, concept: false,
  worldPath: "/writing/the-teardown", back: { to: "/about#writing-h", label: "Writing" }, building: PLACE["the-teardown"].building,
  gallery: galleryFor("the-teardown", newsletter.name), sectionOrder: [],
};

const ventureDest: Destination[] = ventures.map((v) => ({
  slug: v.slug, name: v.name, cluster: "Emerging Ventures", category: v.category, status: v.status, statusLabel: v.status, tone: "amber",
  oneLine: `${v.vision} ${VENTURES_NOTE}`, art: null, href: `/ventures/${v.slug}`, concept: true,
  worldPath: `/ventures/${v.slug}/world`, back: { to: `/ventures/${v.slug}`, label: v.name }, building: PLACE[v.slug].building, sectionOrder: [],
  gallery: [
    { kind: "concept", title: `${v.name} — vision`, label: "Concept visual · not a product screen", lines: [v.name.toUpperCase(), "", `“${v.vision}”`, "", v.category, "Concept in development"] },
    { kind: "concept", title: `${v.name} — proposed features`, label: "Concept visual · not a product screen", lines: ["PROPOSED FEATURES", "", ...v.features.slice(0, 6).map((f) => `• ${f.name}`)] },
    { kind: "concept", title: `${v.name} — business model hypotheses`, label: "Concept visual · not a product screen", lines: ["BUSINESS MODEL — HYPOTHESES", "", ...v.model.map((m) => `• ${m}`), "", "Not validated"] },
    ...(v.example ? [{ kind: "concept" as const, title: `${v.name} — illustrative example`, label: "Concept visual · illustrative numbers, not transaction data", lines: ["ILLUSTRATIVE EXAMPLE", "", ...v.example.rows.map(([k, val]) => `${k}: ${val}`), "", "Not transaction data"] }] : []),
  ],
}));

/** The /worlds hub: the actual projects only (never the concepts or the newsletter). */
export const worlds: Destination[] = projectDest;
export const teardownWorld = teardown;
export const ventureWorlds: Destination[] = ventureDest;
/** Every 3D world, wherever it lives. */
export const destinations: Destination[] = [...projectDest, teardown, ...ventureDest];
export const destinationBySlug = (s: string) => destinations.find((d) => d.slug === s);
export const worldBySlug = (s: string) => worlds.find((d) => d.slug === s);
export const CLUSTERS: Cluster[] = ["Healthcare", "AI", "Fintech", "Research & writing", "Emerging Ventures"];
export const WORLD_CLUSTERS = CLUSTERS.filter((c) => worlds.some((w) => w.cluster === c));

/** Old /universe/<slug> addresses and where they now live (prerendered redirect pages). */
export const UNIVERSE_REDIRECTS: Record<string, string> = {
  ...Object.fromEntries(destinations.map((d) => [d.slug, d.worldPath])),
  [CORPUS]: "/universe",
};

/** Credit required by the Earth textures' licence (CC BY 4.0). */
export const EARTH_CREDIT = {
  text: "Earth textures © Solar System Scope, CC BY 4.0, based on NASA imagery; as distributed with three.js. Resized.",
  href: "https://www.solarsystemscope.com/textures/",
  license: "https://creativecommons.org/licenses/by/4.0/",
};
