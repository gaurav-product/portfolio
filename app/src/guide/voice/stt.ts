/**
 * Speech recognition behind a small adapter. Uses the Web Speech API
 * (SpeechRecognition / webkitSpeechRecognition) where the browser provides it:
 * Chrome, Edge and Safari do; Firefox does not. One utterance per click, never
 * continuous, and only ever started from an explicit visitor action.
 */
export interface Listen {
  onInterim?: (text: string) => void;
  onFinal: (text: string) => void;
  /** Ended with nothing recognised (silence). */
  onNoSpeech?: () => void;
  onError: (reason: "denied" | "no-mic" | "network" | "unsupported" | "aborted" | "other") => void;
  onEnd?: () => void;
}
export interface STT {
  readonly supported: boolean;
  start(lang: string, h: Listen): void;
  stop(): void;   // finish and return what was heard
  abort(): void;  // discard
}

type Rec = {
  lang: string; interimResults: boolean; continuous: boolean; maxAlternatives: number;
  onresult: ((e: { resultIndex: number; results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null; onend: (() => void) | null;
  start(): void; stop(): void; abort(): void;
};

export function recognitionCtor(): (new () => Rec) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: new () => Rec; webkitSpeechRecognition?: new () => Rec };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function browserSTT(): STT {
  const Ctor = recognitionCtor();
  let rec: Rec | null = null;
  return {
    supported: !!Ctor,
    start(lang, h) {
      if (!Ctor) { h.onError("unsupported"); return; }
      rec?.abort();
      const r = new Ctor();
      rec = r;
      r.lang = lang; r.interimResults = true; r.continuous = false; r.maxAlternatives = 1;
      let finalText = "", failed = false;
      r.onresult = (e) => {
        let interim = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const res = e.results[i];
          if (res.isFinal) finalText += res[0].transcript; else interim += res[0].transcript;
        }
        if (interim) h.onInterim?.((finalText + interim).trim());
      };
      r.onerror = (e) => {
        failed = true;
        const map: Record<string, Parameters<Listen["onError"]>[0]> = { "not-allowed": "denied", "service-not-allowed": "denied", "audio-capture": "no-mic", network: "network", aborted: "aborted" };
        if (e.error === "no-speech") { failed = false; return; }
        h.onError(map[e.error] ?? "other");
      };
      r.onend = () => {
        if (rec === r) rec = null;
        if (!failed) { const t = finalText.trim(); if (t) h.onFinal(t); else h.onNoSpeech?.(); }
        h.onEnd?.();
      };
      try { r.start(); } catch { h.onError("other"); }
    },
    stop() { rec?.stop(); },
    abort() { const r = rec; rec = null; r?.abort(); },
  };
}
