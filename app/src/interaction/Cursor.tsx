import { useEffect, useRef } from "react";
import "./interaction.css";

/**
 * The Gaurav.OS signature cursor: a neon dot, a trailing ring with context
 * labels, magnetic primary actions and a soft spotlight — one component, one
 * set of document-level listeners (no per-element handlers).
 *
 * Opt-in markup, read with `closest()`:
 *   data-cursor="view|explore|open|drag|play|back|none|native"   context label
 *   data-magnetic                                                 subtle pull towards the pointer
 *   data-tilt                                                     subtle 3D tilt + light towards the pointer (cards)
 * Links to /universe or /explore get EXPLORE automatically.
 *
 * Safety rules:
 *  - Only on a fine, hovering pointer with motion allowed. Touch, pens, reduced
 *    motion and any start-up failure keep the native cursor (the CSS that hides
 *    it only applies once `html.gos-cursor` is set, after a successful start).
 *  - Text fields, selects, editable areas and active text selection keep the
 *    native cursor; the custom one hides there.
 *  - Every decorative layer is aria-hidden and pointer-events: none.
 *  - Animation runs only while something is still moving, then stops.
 */
type Label = "view" | "explore" | "open" | "drag" | "play" | "back";
const LABELS: Record<Label, string> = { view: "View", explore: "Explore", open: "Open", drag: "Drag", play: "Play", back: "Back" };
const NATIVE = 'input:not([type="button"],[type="submit"],[type="reset"],[type="checkbox"],[type="radio"],[type="range"],[type="color"],[type="file"]),textarea,select,[contenteditable]:not([contenteditable="false"]),[data-cursor="native"]';
const INTERACTIVE = 'a[href],button,[role="button"],[role="tab"],[role="link"],summary,label[for],[data-cursor]';
const MAGNET_MAX = 6; // px
const TILT_MAX = 5;   // degrees

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const spot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    const fine = matchMedia("(pointer: fine) and (hover: hover)");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let on = false, raf = 0, visible = false, down = false;
    let tx = -100, ty = -100, rx = -100, ry = -100, sx = -100, sy = -100;
    let magnet: HTMLElement | null = null;
    let tilt: HTMLElement | null = null;
    let state = "";

    const setState = (s: string, text = "") => {
      if (s === state && (!text || label.current?.textContent === text)) return;
      state = s;
      if (ring.current) ring.current.dataset.state = s;
      if (dot.current) dot.current.dataset.state = s;
      if (label.current) label.current.textContent = text;
    };
    const show = (v: boolean) => { if (v === visible) return; visible = v; html.classList.toggle("gos-cursor-visible", v); };

    const releaseMagnet = () => { if (magnet) { magnet.style.translate = ""; magnet = null; } releaseTilt(); };
    /** spring back: drop the angles; the CSS transition does the settling */
    const releaseTilt = () => { if (!tilt) return; tilt.classList.remove("is-tilting"); tilt.style.removeProperty("--rx"); tilt.style.removeProperty("--ry"); tilt = null; };
    const applyTilt = (el: HTMLElement | null) => {
      if (el !== tilt) { releaseTilt(); tilt = el; }
      if (!tilt) return;
      const r = tilt.getBoundingClientRect(); if (!r.width || !r.height) return;
      const px = Math.min(1, Math.max(0, (tx - r.left) / r.width)), py = Math.min(1, Math.max(0, (ty - r.top) / r.height));
      tilt.style.setProperty("--rx", `${((0.5 - py) * 2 * TILT_MAX).toFixed(2)}deg`);
      tilt.style.setProperty("--ry", `${((px - 0.5) * 2 * TILT_MAX).toFixed(2)}deg`);
      tilt.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
      tilt.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
      tilt.classList.add("is-tilting");
    };
    const tick = () => {
      raf = 0;
      rx += (tx - rx) * 0.2; ry += (ty - ry) * 0.2;
      sx += (tx - sx) * 0.1; sy += (ty - sy) * 0.1;
      if (dot.current) dot.current.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      if (spot.current) spot.current.style.transform = `translate3d(${sx}px, ${sy}px, 0)`;
      if (Math.abs(tx - rx) + Math.abs(ty - ry) + Math.abs(tx - sx) + Math.abs(ty - sy) > 0.4) raf = requestAnimationFrame(tick);
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };

    /** what the pointer is over → cursor state; also the magnetic target */
    const resolve = (target: Element | null) => {
      if (!target || !(target instanceof Element)) { setState("idle"); releaseMagnet(); return; }
      if (target.closest(NATIVE) || html.classList.contains("gos-selecting")) { setState("native"); releaseMagnet(); return; }
      const m = target.closest<HTMLElement>("[data-magnetic]");
      if (m !== magnet) { releaseMagnet(); magnet = m; }
      const tagged = target.closest<HTMLElement>("[data-cursor]");
      const kind = tagged?.dataset.cursor as Label | "none" | undefined;
      // big targets (cards, art, 3D, media) get the filled disc; small ones (buttons, links) a tag beside the pointer, so their text stays readable
      const big = (el: HTMLElement) => el.offsetHeight >= 120 || el.tagName === "CANVAS";
      const labelled = (el: HTMLElement, l: Label) => setState(big(el) ? "label" : "tag", LABELS[l]);
      if (tagged && kind && kind !== "none" && LABELS[kind as Label]) {
        // inside a 3D canvas the scene reports hover through the body cursor (markers, panels)
        if (kind === "drag" && target.tagName === "CANVAS") {
          const c = document.body.style.cursor;
          if (c === "pointer") return setState("label", LABELS.view);
          if (c === "zoom-in") return setState("label", LABELS.open);
        }
        return labelled(tagged, kind as Label);
      }
      const link = target.closest<HTMLElement>(INTERACTIVE);
      if (link) {
        const href = link.getAttribute("href") ?? "";
        if (/^\/(universe|explore)(\/|$|\?)/.test(href.replace(/^https?:\/\/[^/]+/, ""))) return labelled(link, "explore");
        return setState(kind === "none" ? "idle" : "hover");
      }
      setState("idle");
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") { show(false); return; }
      tx = e.clientX; ty = e.clientY;
      if (!visible) { rx = sx = tx; ry = sy = ty; show(true); }
      resolve(e.target as Element);
      if (magnet) {
        const r = magnet.getBoundingClientRect();
        const dx = (tx - (r.left + r.width / 2)) / (r.width / 2), dy = (ty - (r.top + r.height / 2)) / (r.height / 2);
        magnet.style.translate = `${(Math.max(-1, Math.min(1, dx)) * MAGNET_MAX).toFixed(1)}px ${(Math.max(-1, Math.min(1, dy)) * MAGNET_MAX * 0.6).toFixed(1)}px`;
      }
      applyTilt(e.target instanceof Element ? e.target.closest<HTMLElement>("[data-tilt]") : null);
      kick();
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      down = true; ring.current?.classList.add("is-pressed");
    };
    const onUp = () => { down = false; ring.current?.classList.remove("is-pressed"); html.classList.remove("gos-selecting"); };
    // dragging across text to select it → native I-beam until the button is released
    const onSelect = () => { if (!down) return; const s = document.getSelection(); const sel = !!s && !s.isCollapsed; html.classList.toggle("gos-selecting", sel); if (sel) setState("native"); };
    const onLeave = (e: MouseEvent) => { if (!e.relatedTarget) { show(false); releaseMagnet(); } };
    const onBlur = () => { show(false); releaseMagnet(); };

    const start = () => {
      if (on) return;
      try {
        on = true;
        document.addEventListener("pointermove", onMove, { passive: true });
        document.addEventListener("pointerdown", onDown, { passive: true });
        document.addEventListener("pointerup", onUp, { passive: true });
        document.addEventListener("selectionchange", onSelect);
        document.addEventListener("mouseout", onLeave);
        window.addEventListener("blur", onBlur);
        html.classList.add("gos-cursor"); // only now is the native arrow hidden
      } catch { stop(); }
    };
    const stop = () => {
      on = false; show(false); releaseMagnet(); cancelAnimationFrame(raf); raf = 0;
      html.classList.remove("gos-cursor", "gos-selecting");
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerup", onUp);
      document.removeEventListener("selectionchange", onSelect);
      document.removeEventListener("mouseout", onLeave);
      window.removeEventListener("blur", onBlur);
    };
    const decide = () => (fine.matches && !reduced.matches ? start() : stop());
    decide();
    fine.addEventListener("change", decide); reduced.addEventListener("change", decide);
    return () => { fine.removeEventListener("change", decide); reduced.removeEventListener("change", decide); stop(); };
  }, []);

  return (
    <>
      <div ref={spot} className="gos-spot" aria-hidden="true" />
      <div ref={ring} className="gos-ring" aria-hidden="true" data-state="idle"><span className="gos-ring-circle" /><span ref={label} className="gos-label" /></div>
      <div ref={dot} className="gos-dot" aria-hidden="true" data-state="idle" />
    </>
  );
}
