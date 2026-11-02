import { useCallback, useEffect, useRef, useState } from "react";
import { legacy } from "~/content/data";
import { asset } from "~/lib/meta";
import { track } from "~/lib/analytics";
import { Icon } from "./Icon";

const SEEN = "gos-intro-seen";
const SOUND = "gos-intro-sound";
const get = (k: string) => { try { return localStorage.getItem(k); } catch { return null; } };
const set = (k: string, v: string) => { try { localStorage.setItem(k, v); } catch {} };

/** The existing 65-second intro film, preserved: first visit only on wide
 *  screens without reduced motion, skippable at once, muted by default, a real
 *  sound toggle, Esc to close, focus kept inside, poster on failure. */
export function useIntro() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!get(SEEN) && !reduce && innerWidth >= 1024 && !new URLSearchParams(location.search).has("nointro")) setOpen(true);
    set(SEEN, "1");
  }, []);
  return { open, play: () => { track("intro_started"); setOpen(true); }, close: () => setOpen(false) };
}

export function IntroFilm({ onClose }: { onClose: (how: "skip" | "end") => void }) {
  const box = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [failed, setFailed] = useState(false);
  const [progress, setProgress] = useState(0);
  const reduce = typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

  const close = useCallback((how: "skip" | "end") => { track(how === "end" ? "intro_completed" : "intro_skipped"); onClose(how); }, [onClose]);

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    box.current?.querySelector<HTMLElement>("button")?.focus();
    document.body.style.overflow = "hidden";
    const v = video.current;
    if (v && !reduce) {
      v.muted = true;
      v.play().catch(() => setFailed(true));
      if (get(SOUND) === "1") { v.muted = false; v.play().then(() => setMuted(false)).catch(() => { v.muted = true; setMuted(true); }); }
    }
    return () => { document.body.style.overflow = ""; prev?.focus?.(); };
  }, [reduce]);

  const toggleSound = () => {
    const v = video.current; if (!v) return;
    v.muted = !v.muted; setMuted(v.muted); set(SOUND, v.muted ? "0" : "1");
    if (!v.muted) v.play().catch(() => { v.muted = true; setMuted(true); });
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") close("skip");
    if (e.key === "Tab") {
      const f = box.current?.querySelectorAll<HTMLElement>("button"); if (!f?.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  };

  return (
    <div ref={box} role="dialog" aria-modal="true" aria-label="Gaurav.OS introduction film" onKeyDown={onKey} className="fixed inset-0 z-[70] bg-black">
      {reduce || failed ? (
        <img src={asset(legacy.intro.poster)} alt="Final frame of the Gaurav.OS introduction film" className="h-full w-full object-contain" />
      ) : (
        <video ref={video} className="h-full w-full object-cover max-lg:object-contain" src={asset(legacy.intro.video)} poster={asset(legacy.intro.poster)}
          playsInline muted preload="auto" onEnded={() => close("end")} onError={() => setFailed(true)}
          onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime / (e.currentTarget.duration || legacy.intro.duration))} />
      )}
      <div className="absolute bottom-0 left-0 h-0.5 bg-green" style={{ width: `${progress * 100}%` }} aria-hidden />
      <div className="absolute right-4 top-4 flex gap-2 sm:right-6 sm:top-6">
        {!reduce && !failed && (
          <button type="button" onClick={toggleSound} aria-pressed={!muted} aria-label={muted ? "Turn sound on" : "Turn sound off"}
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/30 bg-black/50 px-4 text-sm text-white hover:border-green">
            <Icon name={muted ? "mute" : "sound"} />{muted ? "Sound off" : "Sound on"}
          </button>
        )}
        <button type="button" onClick={() => close("skip")} className="inline-flex h-11 items-center gap-2 rounded-xl bg-green px-4 text-sm font-semibold text-green-ink">
          <Icon name="skip" />{reduce || failed ? "Enter Gaurav.OS" : "Skip intro"}
        </button>
      </div>
    </div>
  );
}
