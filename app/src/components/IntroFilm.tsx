import { useCallback, useRef } from "react";
import { asset } from "~/lib/meta";
import { track } from "~/lib/analytics";

/** The 45-second introduction film: the owner's master (Gaurav_OS_Master_45s_FINAL.mp4, received 16 Nov 2026),
 *  served from the site itself. Same streams as the master, remuxed only to put the index first ("faststart") so
 *  playback can begin before the whole file arrives. 1080 × 1920 (9:16), H.264 High + AAC stereo, 30 fps.
 *  One file feeds both players: the full-screen introduction (IntroGate) and the inline player below the hero. */
export const FILM = {
  src: "/media/gaurav-os-intro-45s.mp4",
  type: 'video/mp4; codecs="avc1.640028, mp4a.40.2"',
  poster: "/media/gaurav-os-intro-45s-poster.jpg", // the owner-supplied thumbnail (Gaurav_OS_Thumbnail.jpg), 1080 × 1920
  width: 1080,
  height: 1920,
  duration: "0:45",
};

export const FILM_ID = "intro-film";

/** Back to the poster once the film has ended (a video otherwise keeps showing its last frame). */
export const showPosterAgain = (v: HTMLVideoElement) => { v.removeAttribute("autoplay"); v.load(); };

/** Scrolls to the inline film and starts it. Called from a click, so the browser allows sound. */
export function useIntroFilm() {
  return useCallback(() => {
    track("cta_click", { cta: "intro_film" });
    const section = document.getElementById(FILM_ID);
    const v = section?.querySelector("video");
    if (!section || !v) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    section.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    v.focus({ preventScroll: true });
    v.play().catch(() => {}); // if the browser refuses, the native controls remain
  }, []);
}

/** Inline 9:16 player: native controls, no autoplay, nothing but the poster loaded until play. */
export function IntroFilm() {
  const started = useRef(false);
  return (
    // data-oz-avoid: Oz steps aside (phones) and holds its greeting (all sizes) rather than cover the player's
    // controls; on desktop the right margin keeps the player clear of Oz's resting spot
    <figure data-oz-avoid className="relative mx-auto w-full max-w-[340px] lg:mr-20 lg:max-w-[360px]">
      <div className="hero-glow rounded-[28px] border border-line bg-surface p-2 shadow-[0_0_0_1px_rgb(0_0_0/.4),0_30px_80px_-30px_rgb(0_0_0/.8)]">
        <video
          data-testid="intro-video"
          className="block aspect-[9/16] w-full rounded-[20px] bg-black object-contain"
          width={FILM.width} height={FILM.height}
          controls playsInline preload="none" poster={asset(FILM.poster)}
          aria-label={`Gaurav.OS introduction film, ${FILM.duration}`}
          onPlay={() => { if (!started.current) { started.current = true; track("intro_started"); } }}
          onEnded={(e) => { track("intro_completed"); showPosterAgain(e.currentTarget); }}>
          <source src={asset(FILM.src)} type={FILM.type} />
          <a href={asset(FILM.src)}>Download the introduction film (MP4)</a>
        </video>
      </div>
    </figure>
  );
}
