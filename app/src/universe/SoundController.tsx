import { useEffect, useId, useRef, useState } from "react";
import { audio, type AudioPrefs } from "./audio";
import { Icon } from "~/components/Icon";

/** Visible audio control: sound on/off, volume, ambient on/off (cues stay). */
export function SoundController({ className = "" }: { className?: string }) {
  const [p, setP] = useState<AudioPrefs>(audio.prefs);
  const [open, setOpen] = useState(false);
  const id = useId();
  const box = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false); // the server cannot know whether Web Audio exists
  useEffect(() => { setMounted(true); setP(audio.prefs); return audio.subscribe(setP); }, []);
  useEffect(() => {
    if (!open) return;
    const off = (e: PointerEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    addEventListener("pointerdown", off); addEventListener("keydown", esc);
    return () => { removeEventListener("pointerdown", off); removeEventListener("keydown", esc); };
  }, [open]);
  // reserve the control's space before mount, so nothing in the top bar shifts
  if (!mounted) return <div aria-hidden className={`h-11 w-[96px] sm:w-[150px] ${className}`} />;
  if (!audio.supported) return null;
  return (
    <div ref={box} className={`relative ${className}`}>
      <div className="flex overflow-hidden rounded-full border border-white/15 bg-black/40 backdrop-blur-md">
        <button type="button" aria-pressed={p.enabled} onClick={() => audio.setEnabled(!p.enabled)}
          className="inline-flex min-h-11 items-center gap-2 px-4 text-sm text-white hover:bg-white/10">
          <Icon name={p.enabled ? "sound" : "mute"} /><span className="max-sm:sr-only">{p.enabled ? "Sound on" : "Sound off"}</span>
        </button>
        <button type="button" aria-expanded={open} aria-controls={id} aria-label="Sound settings" onClick={() => setOpen(!open)}
          className="inline-flex min-h-11 items-center border-l border-white/15 px-3 text-white hover:bg-white/10"><Icon name={open ? "up" : "down"} size={16} /></button>
      </div>
      {open && (
        <div id={id} role="group" aria-label="Sound settings" className="absolute right-0 top-[calc(100%+8px)] z-20 w-64 rounded-2xl border border-white/15 bg-[#0B1110]/95 p-4 text-sm text-white shadow-2xl backdrop-blur-xl">
          <label className="flex items-center justify-between gap-3">
            <span>Volume</span>
            <input type="range" min={0} max={100} value={Math.round(p.volume * 100)} onChange={(e) => audio.setVolume(Number(e.target.value) / 100)}
              aria-valuetext={`${Math.round(p.volume * 100)} percent`} className="w-32 accent-[#4DFF4D]" />
          </label>
          <label className="mt-3 flex items-center justify-between gap-3">
            <span>Ambient soundtrack</span>
            <input type="checkbox" checked={p.ambient} onChange={(e) => audio.setAmbient(e.target.checked)} className="size-5 accent-[#4DFF4D]" />
          </label>
          <p className="mt-3 text-xs text-white/60">Interface sounds stay on when ambient is off. Everything is silent until you turn sound on; your choice is remembered on this device.</p>
        </div>
      )}
    </div>
  );
}
