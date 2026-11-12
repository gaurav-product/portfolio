/* Layout of the full-screen 3D pages, shared by the DOM panels and the 3D cameras. Kept free of React imports. */
/** Layout of the 3D pages' panels: side panel vs bottom sheet (keep in sync with the `side` variant in app.css). */
export const SIDE_QUERY = "(min-width: 900px), (orientation: landscape) and (max-height: 520px)";
export const sideLayout = (w: number, h: number) => w >= 900 || (w > h && h <= 520);
/** Height of the bottom sheet as a fraction of the viewport (matches h-[56svh]). */
export const SHEET = 0.56;
/** Height reserved for the full-screen top bar, in CSS px. */
export const TOP_BAR_PX = 72;
