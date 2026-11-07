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
/** Art for a project's chapter and card: the owner's own brand artwork when supplied, else the 3D render. */
export const projectArt = (slug: string) =>
  hasCinematic(`brand-${slug}`) ? `brand-${slug}` : hasCinematic(`render-project-${slug}`) ? `render-project-${slug}` : null;
/** Text-free art for page headers, where copy sits beside the image: always the 3D render. */
export const projectBackdrop = (slug: string) => (hasCinematic(`render-project-${slug}`) ? `render-project-${slug}` : null);
/** Owner brand artwork that shows another company's mark (e.g. PhonePe) needs a not-affiliated note. */
export const THIRD_PARTY_MARK: Record<string, string> = {
  "phonepe-smart-spend-coach": "Academic capstone concept. Not affiliated with or endorsed by PhonePe; the PhonePe name and logo belong to PhonePe.",
};
