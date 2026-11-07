/** The contract between the Universe page (DOM, accessible UI) and the 3D scene.
 *  The page owns state and routing; the scene renders and reports back. */
export type Tier = "high" | "laptop" | "mobile";

export interface SceneEvents {
  /** pointer or keyboard focus over a marker (null = none) */
  onHover(slug: string | null): void;
  /** a marker was clicked */
  onSelect(slug: string): void;
  /** the camera finished flying into a marker: the page switches to the world */
  onArrive(slug: string): void;
  /** intro progress for the DOM titles: 0..1 */
  onIntro(progress: number): void;
  /** a building hotspot (floor) was activated */
  onHotspot(sectionKey: string): void;
  /** a gallery panel in the world was clicked */
  onPanel(index: number): void;
  /** the scene for this key ("earth" or a world slug) is ready */
  onReady(key: string): void;
}

/** Imperative controls the page can call (keyboard and buttons). */
export interface SceneApi {
  rotate(dx: number, dy: number): void;
  zoom(factor: number): void;
  /** turn the globe so a marker faces the camera (keyboard / list focus) */
  face(slug: string): void;
  /** fly into a marker, then call onArrive */
  fly(slug: string): void;
  skipIntro(): void;
  replayIntro(): void;
}
