/**
 * The Product Universe: every destination on the Earth, derived from the
 * existing content modules (projects.ts, newsletter.ts, ventures.ts) so names,
 * statuses and descriptions have one source of truth. Marker coordinates are
 * a visual layout for navigation — NOT where anything was built.
 */
import { projects } from "./projects";
import { newsletter } from "./newsletter";
import { ventures, VENTURES_NOTE } from "./ventures";
import { hasCinematic, cinematic } from "./cinematic";
import shots from "../data/screenshots.json";
import type { CaseSectionKey } from "./types";

export type Cluster = "Healthcare" | "AI" | "Fintech" | "Research & writing" | "Emerging Ventures";
export type Archetype = "pavilion" | "retreat" | "campus" | "house" | "tower" | "facility" | "station" | "archive" | "workshop" | "command" | "hall";

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
  lat: number; lon: number;
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

/** Visual layout only: clusters sit on different sides of the globe so a slow spin reveals them in turn. */
const PLACE: Record<string, { cluster: Cluster; lat: number; lon: number; building: BuildingSpec }> = {
  "evamastu": { cluster: "Healthcare", lat: 24, lon: 72, building: { archetype: "pavilion", floors: 3, palette: { body: "#2B2A24", glass: "#9FE8C4", light: "#F2C14E", accent: "#6BE39A" }, idea: "A calm mindfulness pavilion: timber-toned fins around a still water court, lit like early morning." } },
  "aaroh": { cluster: "Healthcare", lat: 6, lon: 94, building: { archetype: "retreat", floors: 2, palette: { body: "#20302A", glass: "#B9F3D6", light: "#FFB36B", accent: "#6BE39A" }, idea: "A low healing retreat: curved terraces with green roofs and a warm interior glow." } },
  "careconnect": { cluster: "Healthcare", lat: 38, lon: 104, building: { archetype: "campus", floors: 5, palette: { body: "#1B2A27", glass: "#7FE0D8", light: "#35D6D0", accent: "#4DFF4D" }, idea: "A glass care campus: two linked wings — family and attendant — joined by a handover bridge." } },
  "ghargyaan": { cluster: "Healthcare", lat: 16, lon: 120, building: { archetype: "house", floors: 3, palette: { body: "#2C2620", glass: "#FFD9A0", light: "#FFB36B", accent: "#6BE39A" }, idea: "A home-scale knowledge house: stacked library volumes with lantern windows." } },
  "nexus": { cluster: "AI", lat: 30, lon: -18, building: { archetype: "facility", floors: 4, palette: { body: "#141C22", glass: "#8FD8FF", light: "#35D6D0", accent: "#A98BFF" }, idea: "A research facility: a lit core inside orbiting decision rings, with data-wall screens." } },
  "phonepe-smart-spend-coach": { cluster: "Fintech", lat: 46, lon: -96, building: { archetype: "tower", floors: 9, palette: { body: "#1A1B26", glass: "#B7A6FF", light: "#A98BFF", accent: "#35D6D0" }, idea: "A faceted fintech tower in metal and glass. Its chart façade is decorative — no data." } },
  "rupee-radar": { cluster: "Fintech", lat: 22, lon: -74, building: { archetype: "station", floors: 2, palette: { body: "#18211E", glass: "#9CF0C8", light: "#4DFF4D", accent: "#35D6D0" }, idea: "A low radar station: a dish array beside statement-ledger screens." } },
  "90-day-case-studies": { cluster: "Research & writing", lat: -14, lon: 18, building: { archetype: "archive", floors: 6, palette: { body: "#1C1F1D", glass: "#D7F5E6", light: "#6BE39A", accent: "#F2C14E" }, idea: "An archive tower holding 90 lit volumes — one for each published study." } },
  "the-teardown": { cluster: "Research & writing", lat: -32, lon: 40, building: { archetype: "workshop", floors: 2, palette: { body: "#221E1A", glass: "#FFD9A0", light: "#F2C14E", accent: "#6BE39A" }, idea: "A teardown workshop: product panels pulled apart and laid out for inspection." } },
  "interview-radar": { cluster: "Emerging Ventures", lat: -18, lon: 156, building: { archetype: "command", floors: 4, palette: { body: "#161D24", glass: "#8FE7FF", light: "#35D6D0", accent: "#4DFF4D" }, idea: "Concept: a glass recruitment command centre with live opportunity boards and interview pods." } },
  "repass": { cluster: "Emerging Ventures", lat: -40, lon: -150, building: { archetype: "hall", floors: 3, palette: { body: "#1E1826", glass: "#E2B8FF", light: "#FF7AC8", accent: "#35D6D0" }, idea: "Concept: a digital ticket hall with floating ticket displays and a verification desk." } },
};

type Shot = { id: string; project: string; src: string; panel: string; width: number; height: number; caption: string; data_note: string; source: string };
const art = (slug: string) => (hasCinematic(`brand-${slug}`) ? `brand-${slug}` : hasCinematic(`render-project-${slug}`) ? `render-project-${slug}` : null);
const cine = (id: string) => `/cinematic/${id}-1200.webp`;

/** Text products (the research corpus, the newsletter) have no product screens to miss. */
const NO_SCREENS_EXPECTED = new Set(["90-day-case-studies", "the-teardown"]);
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

const projectDest: Destination[] = projects.map((p) => {
  const place = PLACE[p.slug];
  return {
    slug: p.slug, name: p.name, cluster: place.cluster, category: p.subtitle, status: p.status,
    statusLabel: STATUS_LABEL[p.status] ?? p.status, tone: p.statusTone, oneLine: p.oneLine, art: art(p.slug),
    href: `/projects/${p.slug}`, concept: false, lat: place.lat, lon: place.lon, building: place.building,
    gallery: galleryFor(p.slug, p.name), sectionOrder: SECTION_ORDER,
  };
});

const teardown: Destination = {
  slug: "the-teardown", name: newsletter.name, cluster: "Research & writing", category: `${newsletter.cadence} ${newsletter.platform} newsletter — ${newsletter.tagline.toLowerCase()}`,
  status: "PUBLISHED", statusLabel: "Product teardowns · newsletter", tone: "green",
  oneLine: `A ${newsletter.cadence.toLowerCase()} newsletter on ${newsletter.platform} that takes products apart. ${newsletter.subscribers} subscribers (${newsletter.subscribersNote}).`,
  art: art("the-teardown"), href: newsletter.url ?? newsletter.profileUrl, external: true, concept: false,
  lat: PLACE["the-teardown"].lat, lon: PLACE["the-teardown"].lon, building: PLACE["the-teardown"].building,
  gallery: galleryFor("the-teardown", newsletter.name), sectionOrder: [],
};

const ventureDest: Destination[] = ventures.map((v) => ({
  slug: v.slug, name: v.name, cluster: "Emerging Ventures", category: v.category, status: v.status, statusLabel: v.status, tone: "amber",
  oneLine: `${v.vision} ${VENTURES_NOTE}`, art: null, href: `/ventures/${v.slug}`, concept: true,
  lat: PLACE[v.slug].lat, lon: PLACE[v.slug].lon, building: PLACE[v.slug].building, sectionOrder: [],
  gallery: [
    { kind: "concept", title: `${v.name} — vision`, label: "Concept visual · not a product screen", lines: [v.name.toUpperCase(), "", `“${v.vision}”`, "", v.category, "Concept in development"] },
    { kind: "concept", title: `${v.name} — proposed features`, label: "Concept visual · not a product screen", lines: ["PROPOSED FEATURES", "", ...v.features.slice(0, 6).map((f) => `• ${f.name}`)] },
    { kind: "concept", title: `${v.name} — business model hypotheses`, label: "Concept visual · not a product screen", lines: ["BUSINESS MODEL — HYPOTHESES", "", ...v.model.map((m) => `• ${m}`), "", "Not validated"] },
    ...(v.example ? [{ kind: "concept" as const, title: `${v.name} — illustrative example`, label: "Concept visual · illustrative numbers, not transaction data", lines: ["ILLUSTRATIVE EXAMPLE", "", ...v.example.rows.map(([k, val]) => `${k}: ${val}`), "", "Not transaction data"] }] : []),
  ],
}));

export const destinations: Destination[] = [...projectDest, teardown, ...ventureDest];
export const destinationBySlug = (s: string) => destinations.find((d) => d.slug === s);
export const CLUSTERS: Cluster[] = ["Healthcare", "AI", "Fintech", "Research & writing", "Emerging Ventures"];

/** Credit required by the Earth textures' licence (CC BY 4.0). */
export const EARTH_CREDIT = {
  text: "Earth textures © Solar System Scope, CC BY 4.0, based on NASA imagery; as distributed with three.js. Resized.",
  href: "https://www.solarsystemscope.com/textures/",
  license: "https://creativecommons.org/licenses/by/4.0/",
};
