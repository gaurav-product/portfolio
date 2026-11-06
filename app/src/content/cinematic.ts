import manifest from "../data/generated/cinematic.json";

/** Owner-supplied cinematic illustrations (AI-generated). Atmosphere only —
 *  never evidence of a product, dashboard or facility. */
export interface Cinematic {
  id: string; width: number; height: number; alt: string; caution: string;
  sizes: Record<string, { file: string; bytes: number }>;
  avif?: Record<string, { file: string; bytes: number }>;
}
const list = (manifest as unknown as { assets: Cinematic[] }).assets;
export const cinematic = (id: string): Cinematic => {
  const c = list.find((x) => x.id === id);
  if (!c) throw new Error(`Unknown cinematic image "${id}"`);
  return c;
};
export const cinematicIds = list.map((x) => x.id);
export const hasCinematic = (id: string) => list.some((x) => x.id === id);
/** The original 3D render for a project, when one exists. */
export const projectArt = (slug: string) => (hasCinematic(`render-project-${slug}`) ? `render-project-${slug}` : null);
