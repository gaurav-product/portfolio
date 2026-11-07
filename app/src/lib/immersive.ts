/** Full-screen 3D pages with their own top bar (and an Exit): the study Earth and every 3D world. The /worlds hub is an ordinary page. */
export const isImmersive = (pathname: string) => /^\/(universe(\/|$)|worlds\/[^/]+|writing\/the-teardown|ventures\/[^/]+\/world)/.test(pathname.replace(/^\/+/, "/"));

/** The research corpus project: its 3D view is the Earth of the 90 studies, not a world. */
export const CORPUS_SLUG = "90-day-case-studies";
/** Where a project's 3D view lives (kept here, light, so project pages need not load the 3D content). */
export const project3dPath = (slug: string) => (slug === CORPUS_SLUG ? "/universe" : `/worlds/${slug}`);
