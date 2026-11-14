import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";

/**
 * On-demand rendering for the 3D scenes (the Canvas runs with frameloop="demand").
 *
 * Each scene part declares what it needs each frame:
 *  - "fast":    something is actually moving (camera flight, damping, a tween) → render every display frame
 *  - "ambient": decorative motion only (slow spin, auto-rotate, drifting stars) → render at AMBIENT_FPS,
 *               at full rate for a moment after input, and not at all once the visitor has been idle IDLE_STOP_MS
 *  - null:      nothing to animate → no frames at all (a still scene costs no GPU time)
 * Pointer, touch, wheel and key input always triggers a frame.
 */
export type Need = "fast" | "ambient" | null;
export const IDLE_STOP_MS = 60_000;
export const AMBIENT_FPS = 30;
export const ACTIVE_MS = 3_000;

const needs = new Set<() => Need>();
export const motionState = { lastInput: 0, frames: 0 };

/** Register a per-frame need. `fn` is read fresh every tick, so it can close over refs and props. */
export function useMotionNeed(fn: () => Need) {
  const r = useRef(fn); r.current = fn;
  useEffect(() => { const f = () => r.current(); needs.add(f); return () => { needs.delete(f); }; }, []);
}

/** Decide whether to schedule a frame — pure, so it is unit-tested. */
export function wantFrame(list: Need[], now: number, lastInput: number, lastAmbient: number): "fast" | "ambient" | null {
  if (list.includes("fast")) return "fast";
  if (!list.includes("ambient")) return null;
  const since = now - lastInput;
  if (since > IDLE_STOP_MS) return null;
  if (since < ACTIVE_MS) return "fast";
  return now - lastAmbient >= 1000 / AMBIENT_FPS - 1 ? "ambient" : null;
}

/** Long gaps between frames (idle, background tab) must not make motion jump. */
export const clampDt = (dt: number) => Math.min(dt, 0.1);

/** Mount once inside each Canvas. */
export function MotionDriver({ paused }: { paused: boolean }) {
  const { invalidate } = useThree();
  useEffect(() => {
    let raf = 0, lastAmbient = 0;
    const input = () => { motionState.lastInput = performance.now(); invalidate(); };
    const evs = ["pointerdown", "pointermove", "wheel", "keydown", "touchstart"] as const;
    evs.forEach((e) => addEventListener(e, input, { passive: true }));
    motionState.lastInput = performance.now();
    invalidate();
    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      if (paused) return;
      const w = wantFrame([...needs].map((f) => f()), t, motionState.lastInput, lastAmbient);
      if (w) { if (w === "ambient") lastAmbient = t; motionState.frames++; invalidate(); }
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); evs.forEach((e) => removeEventListener(e, input)); };
  }, [invalidate, paused]);
  return null;
}
