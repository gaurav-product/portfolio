/**
 * Text-to-speech behind a small adapter, so a neural TTS provider can replace
 * the browser engine later without touching the UI. The browser adapter uses
 * speechSynthesis: it prefers an en-IN / hi-IN voice when the device has one
 * and never promises a specific voice.
 */
export interface SpeakHandlers {
  onStart?: () => void;
  /** Fired per word where the engine reports boundaries (drives the mouth). */
  onBoundary?: () => void;
  onEnd?: () => void;
  onError?: (reason: string) => void;
}
export interface TTS {
  readonly supported: boolean;
  speak(text: string, lang: string, rate: number, h: SpeakHandlers): void;
  stop(): void;
  /** Which voice would be used, for display ("Microsoft Heera (en-IN)"), or null. */
  voiceFor(lang: string): string | null;
}

/** Split into sentence-sized chunks: some engines (Chrome) stop long utterances mid-way. */
export function chunk(text: string, max = 180): string[] {
  const parts = text.match(/[^.!?।]+[.!?।]*\s*/g) ?? [text];
  const out: string[] = [];
  let cur = "";
  for (const p of parts) {
    if ((cur + p).length > max && cur) { out.push(cur.trim()); cur = ""; }
    if (p.length > max) { for (let i = 0; i < p.length; i += max) out.push(p.slice(i, i + max).trim()); continue; }
    cur += p;
  }
  if (cur.trim()) out.push(cur.trim());
  return out.filter(Boolean);
}

export function pickVoice(voices: SpeechSynthesisVoice[], lang: string): SpeechSynthesisVoice | null {
  const base = lang.split("-")[0];
  const norm = (v: SpeechSynthesisVoice) => v.lang.replace("_", "-").toLowerCase();
  return voices.find((v) => norm(v) === lang.toLowerCase())
    ?? (base === "en" ? voices.find((v) => /india|indian|heera|ravi|rishi|veena/i.test(v.name) && norm(v).startsWith("en")) : null)
    ?? voices.find((v) => norm(v).startsWith(base + "-"))
    ?? null;
}

export function browserTTS(): TTS {
  const synth = typeof window !== "undefined" && "speechSynthesis" in window ? window.speechSynthesis : null;
  let voices: SpeechSynthesisVoice[] = synth?.getVoices() ?? [];
  synth?.addEventListener?.("voiceschanged", () => { voices = synth.getVoices(); });
  let token = 0; // each speak() call owns a token; stale callbacks from cancelled speech are ignored
  return {
    supported: !!synth,
    voiceFor(lang) { const v = pickVoice(voices.length ? voices : synth?.getVoices() ?? [], lang); return v ? `${v.name} (${v.lang})` : null; },
    stop() { token++; synth?.cancel(); },
    speak(text, lang, rate, h) {
      if (!synth) { h.onError?.("unsupported"); return; }
      const mine = ++token;
      synth.cancel();
      const parts = chunk(text);
      if (!parts.length) { h.onEnd?.(); return; }
      const voice = pickVoice(voices.length ? voices : synth.getVoices(), lang);
      let started = false;
      parts.forEach((part, i) => {
        const u = new SpeechSynthesisUtterance(part);
        u.lang = voice?.lang ?? lang; if (voice) u.voice = voice;
        u.rate = rate; u.pitch = 1.15; // a touch brighter: Oz is small
        u.onstart = () => { if (mine !== token) return; if (!started) { started = true; h.onStart?.(); } };
        u.onboundary = (e) => { if (mine === token && (e.name === "word" || !e.name)) h.onBoundary?.(); };
        u.onend = () => { if (mine === token && i === parts.length - 1) h.onEnd?.(); };
        u.onerror = (e) => { if (mine !== token) return; if (e.error === "interrupted" || e.error === "canceled") return; token++; h.onError?.(e.error || "speech failed"); };
        synth.speak(u);
      });
      // Chrome pauses speech in background tabs and some engines never fire onstart; resume politely.
      if (synth.paused) synth.resume();
    },
  };
}
