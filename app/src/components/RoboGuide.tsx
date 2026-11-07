import { useEffect, useRef } from "react";

/* ---------------------------------------------------------------------------
   The Gaurav.OS guide — ported from the Lovable implementation (RoboGuide.tsx).
   A robotic unit, deliberately not a likeness. Decorative: aria-hidden and
   pointer-events:none, so it never intercepts input and conveys nothing a
   screen-reader user needs. It calls no AI and makes no network request.

   Behaviour preserved from the original:
   - pointer tracking with damped, hard-bounded lean and iris movement, written
     to CSS custom properties from a rAF loop (no React re-render per frame);
   - the loop stops once settled and pauses off-screen (IntersectionObserver);
   - static, intentional pose under reduced motion and on touch devices;
   - the one state tied to real behaviour: it "attends" (squares up, brighter
     visor) while the visitor is typing into Ask Gaurav (#ask-input).
--------------------------------------------------------------------------- */
const MAX_IRIS = 3.1, MAX_LEAN = 4.2, MAX_SHIFT = 2.0, EASE = 0.085;

export function RoboGuide({ className = "" }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(hover: none), (pointer: coarse)");
    let tx = 0, ty = 0, cx = 0, cy = 0, frame = 0, visible = true;

    const paint = () => {
      el.style.setProperty("--iris-x", (cx * MAX_IRIS).toFixed(3));
      el.style.setProperty("--iris-y", (cy * MAX_IRIS * 0.72).toFixed(3));
      el.style.setProperty("--lean", `${(cx * MAX_LEAN).toFixed(3)}deg`);
      el.style.setProperty("--shift", (cx * MAX_SHIFT).toFixed(3));
      el.style.setProperty("--rise", (-cy * MAX_SHIFT * 0.5).toFixed(3));
    };
    const settle = () => { tx = 0; ty = 0.18; cx = 0; cy = 0.18; paint(); };
    const step = () => {
      cx += (tx - cx) * EASE; cy += (ty - cy) * EASE; paint();
      if (Math.abs(tx - cx) < 0.0015 && Math.abs(ty - cy) < 0.0015) { cx = tx; cy = ty; paint(); frame = 0; return; }
      frame = requestAnimationFrame(step);
    };
    const kick = () => { if (!frame && visible) frame = requestAnimationFrame(step); };
    const onMove = (e: PointerEvent) => {
      if (reduced.matches || coarse.matches || !visible) return;
      const r = el.getBoundingClientRect(); if (!r.width) return;
      const radius = Math.max(innerWidth, innerHeight) * 0.42;
      tx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / radius));
      ty = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / radius));
      kick();
    };
    const attend = () => { el.dataset.attending = "true"; tx = 0; ty = -0.05; kick(); };
    const release = () => { delete el.dataset.attending; };
    // Ask Gaurav may mount after this component; delegate focus events instead of binding once.
    const onFocusIn = (e: FocusEvent) => { if ((e.target as HTMLElement)?.id === "ask-input") attend(); };
    const onFocusOut = (e: FocusEvent) => { if ((e.target as HTMLElement)?.id === "ask-input") release(); };

    const io = new IntersectionObserver(([en]) => {
      visible = !!en?.isIntersecting;
      if (!visible && frame) { cancelAnimationFrame(frame); frame = 0; } else if (visible) kick();
    }, { rootMargin: "120px" });
    io.observe(el);
    const applyMode = () => {
      const still = reduced.matches || coarse.matches;
      el.dataset.mode = still ? "static" : "live";
      if (still) { if (frame) { cancelAnimationFrame(frame); frame = 0; } settle(); }
    };
    applyMode();
    reduced.addEventListener("change", applyMode);
    coarse.addEventListener("change", applyMode);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      io.disconnect();
      reduced.removeEventListener("change", applyMode);
      coarse.removeEventListener("change", applyMode);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  return (
    <div ref={root} aria-hidden data-mode="static" data-testid="robo-guide"
      className={`robo pointer-events-none mx-auto w-full max-w-[210px] select-none ${className}`} style={{ aspectRatio: "1 / 1" }}>
      <svg viewBox="0 0 120 120" className="h-full w-full overflow-visible" role="presentation" focusable="false">
        <g stroke="var(--color-line)" strokeWidth="0.6" fill="none">
          <ellipse cx="60" cy="104" rx="26" ry="5.5" />
          <path d="M44 104v-7h32v7" />
        </g>
        <g className="robo-head">
          <g stroke="var(--color-line)" strokeWidth="0.9" fill="none">
            <path d="M34 38h52v42a8 8 0 0 1-8 8H42a8 8 0 0 1-8-8V38Z" fill="var(--color-surface)" />
            <path d="M34 50H26v16h8M86 50h8v16h-8" />
            <path d="M60 30v-8M56 22h8" />
            <circle cx="60" cy="19" r="2.6" stroke="var(--color-green)" />
          </g>
          <rect x="40" y="46" width="40" height="20" fill="var(--color-bg)" stroke="var(--color-line)" strokeWidth="0.9" />
          <g className="robo-iris" style={{ color: "var(--color-green)" }}>
            <rect x="53" y="52" width="14" height="8" fill="currentColor" className="robo-glow" />
            <rect x="56.5" y="54" width="7" height="4" fill="var(--color-bg)" opacity=".7" />
          </g>
          <rect x="40" y="46" width="40" height="0.8" fill="var(--color-green)" opacity=".4" className="robo-scan" />
          <g stroke="var(--color-line)" strokeWidth="0.7"><path d="M46 74h28M50 79h20" /></g>
        </g>
      </svg>
    </div>
  );
}
