import { useCallback, useEffect, useRef, useState } from "react";
import { asset } from "~/lib/meta";
import { track } from "~/lib/analytics";
import { FILM, showPosterAgain } from "./IntroFilm";
import { Icon } from "./Icon";

/* The full-screen introduction shown before the portfolio on a fresh visit (once per browser session).
 *
 * - It overlays whatever page was requested. The URL, query, hash and history are never touched, so a deep
 *   link lands exactly where it pointed once the film ends or is skipped.
 * - Its markup is in every prerendered page but hidden by CSS. INTRO_HEAD_SCRIPT runs in <head> before first
 *   paint and turns it on (html[data-intro="show"]) only for a fresh session. Crawlers and visitors without
 *   JavaScript get the plain portfolio, and returning visitors never see a flash of it.
 * - Browsers allow autoplay only without sound, so the film starts MUTED where allowed, with "Enable sound"
 *   in view. If autoplay is refused (or reduced motion / Data Saver is on), the poster stays with "Play with
 *   sound". Sound is never claimed: the button and a live status say which state the film is in.
 * - Skipped: Skip / Esc. Bypassed: ?nointro, and browsers under automation (navigator.webdriver), so the
 *   existing test suites and audits see the portfolio; the intro has its own tests.
 * - If storage is unavailable (private modes), it shows once per page load. */

export const INTRO_KEY = "gos-intro-done";
const OPEN_EVENT = "gos:intro-open";
const SKIP_EVENT = "gos:intro-skip"; // Esc: one listener (in <head>, from first paint) hands over to the app once it is live

export const INTRO_HEAD_SCRIPT = `(function(){var d=document.documentElement;try{
if(!document.querySelector('meta[http-equiv="refresh"]')&&!/[?&]nointro(=|&|$)/.test(location.search)&&!navigator.webdriver){
var done=null;try{done=sessionStorage.getItem("${INTRO_KEY}")}catch(e){}
if(!done)d.setAttribute("data-intro","show")}}catch(e){}
function skip(){if(window.__gosIntroReady||!d.hasAttribute("data-intro"))return;d.removeAttribute("data-intro");try{sessionStorage.setItem("${INTRO_KEY}","1")}catch(x){}}
document.addEventListener("click",function(e){if(e.target&&e.target.closest&&e.target.closest("[data-intro-skip]"))skip()});
document.addEventListener("keydown",function(e){if(e.key!=="Escape"||!d.hasAttribute("data-intro"))return;e.preventDefault();
if(window.__gosIntroReady)window.dispatchEvent(new Event("${SKIP_EVENT}"));else skip()});})()`;

/** Opens the full-screen introduction again from inside the portfolio. */
export const replayIntro = () => window.dispatchEvent(new Event(OPEN_EVENT));

type Phase = "prerender" | "closed" | "ready" | "muted" | "playing" | "error";

export function IntroGate() {
  const [phase, setPhase] = useState<Phase>("prerender");
  const video = useRef<HTMLVideoElement>(null);
  const playBtn = useRef<HTMLButtonElement>(null);
  const soundBtn = useRef<HTMLButtonElement>(null);
  const replaying = useRef(false);
  const autoTried = useRef(false);
  const html = () => document.documentElement;

  useEffect(() => {
    (window as unknown as { __gosIntroReady: boolean }).__gosIntroReady = true;
    setPhase(html().getAttribute("data-intro") === "show" ? "ready" : "closed");
    const open = () => { replaying.current = true; autoTried.current = false; html().setAttribute("data-intro", "show"); setPhase("ready"); };
    const skip = () => close("skip");
    addEventListener(OPEN_EVENT, open); addEventListener(SKIP_EVENT, skip);
    return () => { removeEventListener(OPEN_EVENT, open); removeEventListener(SKIP_EVENT, skip); };
  }, []);

  // Opening: try to start the film MUTED (browsers allow that; they block sound until a tap). If the browser
  // refuses, the poster stays with "Play with sound". Not with reduced motion, nor when the visitor has asked
  // their browser to save data: then the poster and an explicit choice.
  useEffect(() => {
    if (phase !== "ready" || autoTried.current) return;
    autoTried.current = true;
    const v = video.current; if (!v) return;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || saveData) return;
    v.muted = true;
    v.play().then(() => { if (v.muted) setPhase("muted"); }).catch(() => { v.muted = false; });
  }, [phase]);

  useEffect(() => {
    if (phase === "ready") playBtn.current?.focus({ preventScroll: true });
    if (phase === "muted") soundBtn.current?.focus({ preventScroll: true });
  }, [phase]);

  const close = useCallback((how: "skip" | "end") => {
    try { sessionStorage.setItem(INTRO_KEY, "1"); } catch { /* private mode: shown again next load */ }
    track(how === "end" ? "intro_completed" : "intro_skipped", { from: "gate" });
    const v = video.current; if (v && !v.paused) v.pause();
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const done = () => {
      html().removeAttribute("data-intro");
      if (v) showPosterAgain(v);
      setPhase("closed");
      // arrive where the visitor asked to go: the requested #fragment, else the page's main content
      const target = location.hash ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null;
      if (target) target.scrollIntoView();
      (document.getElementById("main") as HTMLElement | null)?.focus({ preventScroll: !!target });
    };
    if (reduce || how === "skip") return done();
    html().setAttribute("data-intro", "leaving"); // the portfolio fades in under the film
    setTimeout(done, 650);
  }, []);

  /** "Play with sound" / "Try again" (from the poster) and "Enable sound" (while playing muted): a tap, so sound is allowed. */
  const withSound = (from: "play" | "unmute") => {
    const v = video.current; if (!v) return;
    track("intro_started", { from: from === "play" ? "gate" : "gate-unmute" });
    v.muted = false;
    if (v.volume === 0) v.volume = 1;
    setPhase("playing");
    if (v.paused) v.play().catch(() => setPhase("error")); // refused or failed: say so, and keep the way in open
    v.focus({ preventScroll: true });
  };

  if (phase === "closed") return null;
  const running = phase === "playing" || phase === "muted";
  return (
    <div className="intro-gate" data-testid="intro-gate" data-phase={phase} role="dialog" aria-modal="true" aria-labelledby="intro-gate-title" aria-describedby="intro-gate-desc"
      onKeyDown={(e) => {
        if (e.key !== "Tab") return; // keep Tab inside the introduction (the page behind is out of sight)
        const f = Array.from(e.currentTarget.querySelectorAll<HTMLElement>("button, video[controls]"));
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }}>
      <div className="intro-gate__stage">
        <video ref={video} className="intro-gate__video" data-testid="intro-gate-video"
          width={FILM.width} height={FILM.height} poster={asset(FILM.poster)} preload="none" playsInline controls={running}
          aria-label={`Gaurav.OS introduction film, ${FILM.duration}`}
          onEnded={() => close("end")} onError={() => setPhase("error")}
          onVolumeChange={(e) => { if (phase === "muted" && !e.currentTarget.muted) setPhase("playing"); }}>
          <source src={asset(FILM.src)} type={FILM.type} onError={() => setPhase("error")} />
        </video>
      </div>
      <div className="intro-gate__bar">
        <p className="eyebrow" id="intro-gate-title">Gaurav.OS · Product × AI × Building</p>
        <p id="intro-gate-desc" className="sr-only">A {FILM.duration.replace("0:", "")}-second introduction film. Play it with sound, or skip straight to the portfolio.</p>
        <p className="sr-only" aria-live="polite">{phase === "muted" ? "The film is playing without sound." : phase === "playing" ? "The film is playing with sound." : ""}</p>
        {phase === "error" && (
          <p role="alert" className="intro-gate__error">The film couldn’t play here. Try again, or go straight to the portfolio.</p>
        )}
        <div className="intro-gate__actions">
          {(phase === "ready" || phase === "prerender" || phase === "error") && (
            <button ref={playBtn} type="button" onClick={() => withSound("play")} className="intro-gate__btn intro-gate__btn--primary" data-testid="intro-play">
              <Icon name="play" size={16} />{phase === "error" ? "Try again" : "Play with sound"} <span aria-hidden className="opacity-70">· {FILM.duration}</span>
            </button>
          )}
          {phase === "muted" && (
            <button ref={soundBtn} type="button" onClick={() => withSound("unmute")} className="intro-gate__btn intro-gate__btn--primary" data-testid="intro-sound">
              <Icon name="mute" size={16} />Enable sound
            </button>
          )}
          <button type="button" onClick={() => close("skip")} data-intro-skip className="intro-gate__btn" data-testid="intro-skip">
            {replaying.current ? "Close introduction" : "Skip intro · Enter portfolio"}
          </button>
        </div>
      </div>
    </div>
  );
}
