import { useEffect, useRef, useState } from "react";
import { CinematicImage } from "./CinematicImage";
import { asset } from "~/lib/meta";

/**
 * The hero's cinematic background (desktop): the Gaurav.OS world illustration with a very slow drift,
 * and over it, faintly, a short silent loop cut from the owner's intro film (the network sphere,
 * 0:53–0:58, played forward then back so it repeats without a seam). The loop is a mood layer, not
 * content: it is decorative, muted, never autoplays sound, and loads only after the page is idle on a
 * wide screen with motion allowed and no data saver. It pauses when the hero is off screen.
 */
export function HeroBackdrop() {
  const [video, setVideo] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const nav = navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } };
    const ok = matchMedia("(min-width: 1024px)").matches && !matchMedia("(prefers-reduced-motion: reduce)").matches
      && !nav.connection?.saveData && !/(^|-)2g$/.test(nav.connection?.effectiveType ?? "");
    if (!ok) return;
    const idle = (cb: () => void) => ("requestIdleCallback" in window ? (window as unknown as { requestIdleCallback: (f: () => void, o?: object) => number }).requestIdleCallback(cb, { timeout: 2500 }) : setTimeout(cb, 1200));
    idle(() => setVideo(true));
  }, []);
  // pause while the hero is out of view (no decoding for nothing)
  useEffect(() => {
    if (!video || !box.current) return;
    const io = new IntersectionObserver(([e]) => { const v = ref.current; if (!v) return; if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); }, { threshold: 0.05 });
    io.observe(box.current);
    return () => io.disconnect();
  }, [video]);
  return (
    <div ref={box} aria-hidden data-testid="hero-backdrop" className="pointer-events-none absolute inset-0 max-lg:hidden">
      <div className="absolute inset-y-0 right-0 w-[72%] overflow-hidden">
        <CinematicImage id="gaurav-world-hero" decorative sizes="72vw" className="h-full motion-safe:animate-[drift_40s_ease-in-out_infinite_alternate]" imgClassName="h-full object-cover object-[100%_58%]" />
        {video && (
          <video ref={ref} data-testid="hero-video" className="absolute inset-0 h-full w-full object-cover opacity-[.32] mix-blend-screen"
            src={asset("/media/hero-loop-720p.mp4")} poster={asset("/media/hero-loop-poster.jpg")} muted loop playsInline autoPlay preload="none" disablePictureInPicture
            onCanPlay={(e) => { (e.currentTarget as HTMLVideoElement).muted = true; }} />
        )}
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#0B1110_0%,#0B1110_38%,rgb(11_17_16/.9)_49%,rgb(11_17_16/.42)_66%,rgb(11_17_16/.05)_88%)]" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-bg to-transparent" />
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-bg via-bg/70 to-transparent" />
    </div>
  );
}
