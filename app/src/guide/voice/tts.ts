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

/**
 * How natural a voice is likely to sound. Browsers expose very different voices: Edge's "Natural" neural voices
 * (including Indian English Neerja and Prabhat), Chrome's Google voices and Apple's Enhanced / Premium voices sound
 * human; the legacy Windows "Desktop" (SAPI) voices and eSpeak sound robotic. Higher is better. Free browser voices
 * only — no paid speech service is called by this site.
 */
export function voiceQuality(v: Pick<SpeechSynthesisVoice, "name">): number {
  const n = v.name;
  let q = 0;
  if (/natural|neural/i.test(n)) q += 50;
  else if (/premium|enhanced|siri/i.test(n)) q += 40;
  else if (/google/i.test(n)) q += 30;
  if (/online/i.test(n)) q += 5;
  if (/desktop/i.test(n)) q -= 30;
  if (/espeak|compact|robot/i.test(n)) q -= 40;
  return q;
}

/** Best voice for a language: same language only (exact tag first, then the base language), ranked by quality.
 *  An Indian voice wins ties for English. Never crosses languages: no Hindi voice → null (the text is shown instead). */
export function pickVoice(voices: SpeechSynthesisVoice[], lang: string): SpeechSynthesisVoice | null {
  const want = lang.toLowerCase(), base = want.split("-")[0];
  const norm = (v: SpeechSynthesisVoice) => v.lang.replace("_", "-").toLowerCase();
  const score = (v: SpeechSynthesisVoice) => {
    const l = norm(v);
    if (l !== want && l.split("-")[0] !== base) return -Infinity;
    return (l === want ? 40 : 20) + (base === "en" && /-in$|india|heera|ravi|rishi|veena|neerja|prabhat/i.test(`${l} ${v.name}`) ? 8 : 0) + voiceQuality(v);
  };
  let best: SpeechSynthesisVoice | null = null, top = -Infinity;
  for (const v of voices) { const s = score(v); if (s > top) { top = s; best = v; } }
  return top === -Infinity ? null : best;
}

/** Spoken forms for names and abbreviations a speech engine reads badly (applied only to what is spoken). */
const SAY: [RegExp, string][] = [
  [/Gaurav\.OS/g, "Gaurav O S"], [/\bGharGyaan\b/g, "Ghar Gyaan"], [/\bRupeeRadar\b/g, "Rupee Radar"], [/\bCareConnect\b/g, "Care Connect"],
  [/\bPRDs\b/g, "P R Ds"], [/\bPRD\b/g, "P R D"], [/\bAPM\b/g, "A P M"], [/\bMVP\b/g, "M V P"], [/\bMoSCoW\b/g, "Moscow"], [/\bA\/B\b/g, "A B"],
  [/\bMCA\b/g, "M C A"], [/\bM\.Sc\.?/g, "M Sc"], [/\bB\.Sc\.?/g, "B Sc"], [/\be\.g\./gi, "for example"], [/\bi\.e\./gi, "that is"],
  [/ & /g, " and "], [/\s[–—]\s/g, ", "], [/(\d)\s?[–-]\s?(\d)/g, "$1 to $2"],
];
export const pronounce = (text: string) => SAY.reduce((t, [re, to]) => t.replace(re, to), text);

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
      const parts = chunk(pronounce(text));
      if (!parts.length) { h.onEnd?.(); return; }
      const voice = pickVoice(voices.length ? voices : synth.getVoices(), lang);
      let started = false;
      parts.forEach((part, i) => {
        const u = new SpeechSynthesisUtterance(part);
        u.lang = voice?.lang ?? lang; if (voice) u.voice = voice;
        // natural voices get a very slight lift (friendly, a little playful); legacy voices stay at their own pitch,
        // because pitch-shifting them is what made Oz sound most robotic
        u.rate = rate; u.pitch = voice && voiceQuality(voice) >= 30 ? 1.06 : 1;
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
