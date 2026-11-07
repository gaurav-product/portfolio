import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Oz } from "./Oz";
import { useGuide, type ChatTurn } from "./GuideRoot";
import { STATE_LABEL } from "./machine";
import { replyLang, SPEECH_TAG, LISTEN_TAG, type LangPref } from "./lang";
import { localBrain, GREETING } from "./brain/local";
import { remoteBrain, GUIDE_API_URL } from "./brain/remote";
import type { GuideReply } from "./brain/types";
import { browserTTS } from "./voice/tts";
import { browserSTT } from "./voice/stt";
import { Icon } from "~/components/Icon";
import { cx } from "~/components/ui";
import { track } from "~/lib/analytics";

const PROMPTS = ["Explore Gaurav's projects", "Tell me about his product experience", "Show me his AI work", "I'm a recruiter"];
const RATES = [{ v: 0.85, label: "Slow" }, { v: 1, label: "Normal" }, { v: 1.15, label: "Fast" }];
const MAX = 500;
const voiceCount = () => (typeof window !== "undefined" && "speechSynthesis" in window ? window.speechSynthesis.getVoices().length : 0);

/** The conversation panel. Lazy-loaded the first time Oz is opened. */
export default function GuidePanel({ anchorLeft }: { anchorLeft: boolean }) {
  const { state, send, setOpen, turns, setTurns, lang, setLang } = useGuide();
  const navigate = useNavigate();
  const tts = useMemo(() => browserTTS(), []);
  const stt = useMemo(() => browserSTT(), []);
  const brain = useMemo(() => (GUIDE_API_URL ? remoteBrain() : localBrain), []);
  const [draft, setDraft] = useState("");
  const [sound, setSound] = useState(() => { try { return localStorage.getItem("oz-sound") === "on"; } catch { return false; } }); // off until the visitor turns it on
  const [rate, setRate] = useState(1);
  const [error, setError] = useState("");
  const [speakingId, setSpeakingId] = useState<number | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inflight = useRef<AbortController | null>(null);

  const settleSoon = useCallback((ms = 2200) => {
    if (settleTimer.current) clearTimeout(settleTimer.current);
    settleTimer.current = setTimeout(() => send({ type: "SETTLE" }), ms);
  }, [send]);

  /* lip-sync: word boundaries pop the mouth open; without boundary events a CSS loop runs while audio plays */
  const mouthSvg = () => panel.current?.querySelector<SVGSVGElement>("svg.oz") ?? null;
  const mouthDecay = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pulseMouth = () => {
    const svg = mouthSvg(); if (!svg) return;
    svg.dataset.lipsync = "boundary";
    svg.style.setProperty("--mouth", (0.75 + Math.random() * 0.25).toFixed(2));
    if (mouthDecay.current) clearTimeout(mouthDecay.current);
    mouthDecay.current = setTimeout(() => svg.style.setProperty("--mouth", "0.2"), 140);
  };

  /** tells the Universe audio to duck its ambient bed while Oz talks */
  const ozSpeaking = (on: boolean) => window.dispatchEvent(new CustomEvent("oz:speaking", { detail: on }));
  const stopSpeech = useCallback(() => { tts.stop(); setSpeakingId(null); ozSpeaking(false); send({ type: "STOP" }); }, [tts, send]);

  const speak = useCallback((id: number, r: GuideReply) => {
    if (!tts.supported) { setError("This browser can't speak replies aloud. The text is shown here instead."); return; }
    const svg = mouthSvg(); if (svg) { svg.dataset.lipsync = "loop"; svg.style.setProperty("--mouth", "0.35"); }
    setSpeakingId(id);
    tts.speak(r.speech, SPEECH_TAG[r.lang], rate, {
      onStart: () => { ozSpeaking(true); send({ type: "SPEECH_START" }); },
      onBoundary: pulseMouth,
      onEnd: () => { ozSpeaking(false); setSpeakingId(null); send({ type: "SPEECH_END" }); settleSoon(1800); },
      onError: (why) => {
        ozSpeaking(false); setSpeakingId(null); send({ type: "FAIL" }); settleSoon(3000);
        if (/synthesis|voice|unavailable|not-allowed/.test(why) && !voiceCount()) {
          // no speech voice installed on this device: say so once and stop trying for this visit
          setSound(false);
          setError("This device has no speech voice installed, so Oz can't talk aloud here. Every answer is shown as text.");
        } else setError(`Speech couldn't play (${why}). The answer is in the text above.`);
      },
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tts, rate, send, settleSoon]);

  const askOz = useCallback(async (raw: string, via: "text" | "voice" | "prompt") => {
    const text = raw.trim();
    if (!text) { setError("Type or say a question first."); input.current?.focus(); return; }
    if (text.length > MAX) { setError(`Please keep questions under ${MAX} characters.`); return; }
    setError(""); setDraft("");
    tts.stop(); stt.abort(); inflight.current?.abort();
    send({ type: "ASK" });
    track(via === "voice" ? "guide_voice" : via === "prompt" ? "guide_prompt" : "guide_text");
    const r = replyLang(text, lang);
    const history = turns.map((t) => ({ role: t.role, text: t.text }));
    const visitor: ChatTurn = { id: Date.now(), role: "visitor", text };
    setTurns((t) => [...t, visitor]);
    const ctl = new AbortController(); inflight.current = ctl;
    try {
      const [reply] = await Promise.all([brain.answer({ text, reply: r, history }, ctl.signal), new Promise((res) => setTimeout(res, 450))]);
      if (ctl.signal.aborted) return;
      const turn: ChatTurn = { id: visitor.id + 1, role: "guide", text: reply.text, reply };
      setTurns((t) => [...t, turn]);
      send({ type: "ANSWER", kind: reply.kind });
      if (reply.navigate) { track("guide_navigate"); setTimeout(() => navigate(reply.navigate!), 600); }
      if (sound || via === "voice") speak(turn.id, reply); else settleSoon(); // a spoken question gets a spoken answer
    } catch {
      if (ctl.signal.aborted) return;
      send({ type: "FAIL" }); setError("I couldn't get an answer just now. Please try again."); settleSoon(3000);
    }
  }, [lang, turns, setTurns, brain, send, sound, speak, settleSoon, navigate, tts, stt]);

  /* microphone: one utterance per press, only after the visitor asks for it */
  const [listening, setListening] = useState(false);
  const mic = () => {
    setError("");
    if (!stt.supported) { setError("Voice input isn't supported in this browser (Chrome, Edge and Safari support it). Please type instead."); return; }
    if (listening) { stt.stop(); return; }
    if (state === "speaking") stopSpeech();
    tts.stop();
    send({ type: "LISTEN" }); setListening(true); setDraft("");
    stt.start(LISTEN_TAG[lang === "hi" ? "hi" : "en"], {
      onInterim: (t) => setDraft(t),
      onFinal: (t) => { setListening(false); send({ type: "HEARD" }); void askOz(t, "voice"); },
      onNoSpeech: () => { setListening(false); send({ type: "LISTEN_END" }); setError("I didn't catch that. Try again, a little closer to the mic?"); settleSoon(); },
      onError: (why) => {
        setListening(false);
        if (why === "aborted") return;
        send({ type: "FAIL" }); settleSoon(3500);
        setError({
          denied: "Microphone access was blocked. Allow it in your browser's site settings, or type your question instead.",
          "no-mic": "No microphone was found. You can type your question instead.",
          network: "The browser's speech service couldn't be reached. Please type instead, or try again.",
          unsupported: "Voice input isn't supported in this browser. Please type instead.",
          other: "Voice input stopped unexpectedly. Please try again or type instead.",
        }[why]);
      },
      onEnd: () => setListening(false),
    });
  };

  /* lifecycle: greet, focus, Escape to minimise, stop all audio when hidden or closed */
  useEffect(() => { input.current?.focus(); const t = setTimeout(() => send({ type: "GREETED" }), 1600); return () => clearTimeout(t); }, [send]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { e.stopPropagation(); setOpen(false); (document.querySelector(".oz-launch") as HTMLElement | null)?.focus(); } };
    const onHide = () => { if (document.hidden) { tts.stop(); ozSpeaking(false); stt.abort(); setSpeakingId(null); send({ type: "STOP" }); } };
    panel.current?.addEventListener("keydown", onKey);
    document.addEventListener("visibilitychange", onHide);
    const p = panel.current;
    return () => { p?.removeEventListener("keydown", onKey); document.removeEventListener("visibilitychange", onHide); tts.stop(); ozSpeaking(false); stt.abort(); inflight.current?.abort(); if (settleTimer.current) clearTimeout(settleTimer.current); };
  }, [tts, stt, send, setOpen]);
  useEffect(() => { list.current?.scrollTo?.({ top: list.current.scrollHeight, behavior: "smooth" }); }, [turns, error]);

  const toggleSound = () => { const v = !sound; setSound(v); try { localStorage.setItem("oz-sound", v ? "on" : "off"); } catch { /* ignore */ } if (!v) stopSpeech(); };
  const greeting = GREETING[lang === "hi" ? "hi" : "en"];

  return (
    <div ref={panel} id="oz-panel" role="dialog" aria-modal="false" aria-label="Oz, the Gaurav.OS AI Guide"
      className={cx("fixed z-[46] flex flex-col overflow-hidden rounded-3xl border border-line bg-surface/95 shadow-[0_24px_80px_-20px_rgb(0_0_0/.9)] backdrop-blur-xl",
        "inset-x-2 bottom-2 max-h-[min(82dvh,640px)] sm:inset-x-auto sm:bottom-[104px] sm:w-[380px]", anchorLeft ? "sm:left-4" : "sm:right-4")}
      data-testid="oz-panel">
      {/* header */}
      <div className="flex items-center gap-3 border-b border-line-soft px-4 py-3">
        <Oz state={state} size={54} />
        <div className="min-w-0 flex-1">
          <p className="font-display text-lg font-bold leading-tight">Oz</p>
          <p className="truncate text-[11px] text-muted">Gaurav.OS AI Guide</p>
          <p className="flex items-center gap-1.5 text-xs text-dim" role="status" aria-live="polite" data-testid="oz-status">
            <span aria-hidden className={cx("size-1.5 rounded-full", state === "listening" ? "bg-red" : state === "speaking" ? "bg-cyan" : state === "error" ? "bg-amber" : "bg-green")} />
            {listening ? "Listening… speak now" : STATE_LABEL[state]}
          </p>
        </div>
        <label className="sr-only" htmlFor="oz-lang">Reply language</label>
        <select id="oz-lang" value={lang} onChange={(e) => setLang(e.target.value as LangPref)} className="h-9 w-[84px] rounded-full border border-line bg-bg px-2 text-xs text-ink">
          <option value="auto">Auto</option><option value="en">English</option><option value="hi">हिंदी</option>
        </select>
        <button type="button" onClick={toggleSound} aria-pressed={sound} aria-label="Speak replies aloud" title={sound ? "Voice on" : "Voice off"}
          className="inline-flex size-9 items-center justify-center rounded-full border border-line text-ink hover:bg-raise"><Icon name={sound ? "sound" : "mute"} size={16} /></button>
        <button type="button" onClick={() => setOpen(false)} aria-label="Minimise Oz" className="inline-flex size-9 items-center justify-center rounded-full border border-line text-ink hover:bg-raise"><Icon name="close" size={16} /></button>
      </div>

      {/* conversation */}
      <div ref={list} className="min-h-[180px] flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite" data-testid="oz-log">
        <Bubble who="guide">{greeting}</Bubble>
        {turns.map((t) => t.role === "visitor"
          ? <Bubble key={t.id} who="visitor">{t.text}</Bubble>
          : <Bubble key={t.id} who="guide">
              <Text text={t.text} />
              {!!t.reply?.links.length && (
                <span className="mt-2 flex flex-wrap gap-1.5">
                  {t.reply.links.map((l) => /^https?:/.test(l.to)
                    ? <a key={l.to} href={l.to} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-8 items-center gap-1 rounded-full border border-green/40 px-3 text-xs text-green hover:bg-green/10">{l.label}<Icon name="external" size={12} /></a>
                    : <Link key={l.to} to={l.to} onClick={() => track("guide_navigate")} className="inline-flex min-h-8 items-center gap-1 rounded-full border border-green/40 px-3 text-xs text-green hover:bg-green/10">{l.label}<Icon name="arrow" size={12} /></Link>)}
                </span>
              )}
              <span className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-dim">
                {tts.supported && (speakingId === t.id
                  ? <button type="button" onClick={stopSpeech} className="inline-flex min-h-7 items-center gap-1 rounded-full border border-line px-2.5 text-ink hover:bg-raise"><Icon name="mute" size={12} />Stop</button>
                  : <button type="button" onClick={() => t.reply && speak(t.id, t.reply)} aria-label="Replay this answer aloud" className="inline-flex min-h-7 items-center gap-1 rounded-full border border-line px-2.5 text-ink hover:bg-raise"><Icon name="sound" size={12} />Replay</button>)}
                <span>{t.reply?.source === "remote" ? "Live AI · grounded" : t.reply?.fellBack ? "Verified local answer (AI service unavailable)" : "Verified local answer"}</span>
              </span>
            </Bubble>)}
        {state === "thinking" && <p className="text-sm text-dim" role="status">Oz is thinking…</p>}
        {turns.length < 2 && (
          <div>
            <p className="label mb-2">Try asking</p>
            <ul className="flex flex-wrap gap-1.5">
              {PROMPTS.map((p) => <li key={p}><button type="button" onClick={() => void askOz(p, "prompt")} className="min-h-8 rounded-full border border-line px-3 text-left text-xs text-muted hover:border-green/60 hover:text-ink">{p}</button></li>)}
            </ul>
          </div>
        )}
        {error && <p role="alert" className="rounded-xl border border-amber/40 bg-amber/10 px-3 py-2 text-sm text-[#F5DCA0]">{error}</p>}
      </div>

      {/* composer */}
      <form className="border-t border-line-soft p-3" onSubmit={(e) => { e.preventDefault(); void askOz(draft, "text"); }}>
        <div className="flex items-end gap-2">
          <button type="button" onClick={mic} aria-pressed={listening} aria-label={listening ? "Stop listening" : "Ask with your voice"}
            title={stt.supported ? (listening ? "Stop listening" : "Ask with your voice") : "Voice input isn't supported in this browser"}
            className={cx("inline-flex size-11 shrink-0 items-center justify-center rounded-full border transition-colors",
              listening ? "border-red bg-red/15 text-red" : "border-line text-ink hover:bg-raise", !stt.supported && "opacity-60")}>
            <MicIcon on={listening} />
          </button>
          <label htmlFor="oz-input" className="sr-only">Ask Oz a question</label>
          <textarea id="oz-input" ref={input} rows={1} value={draft} maxLength={MAX} onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void askOz(draft, "text"); } }}
            placeholder={listening ? "Listening…" : "Ask in English or Hindi…"} className="field max-h-28 min-h-11 flex-1 resize-none py-2.5" />
          {state === "speaking"
            ? <button type="button" onClick={stopSpeech} aria-label="Stop speaking" className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-ink text-bg"><span aria-hidden className="size-3.5 rounded-[3px] bg-bg" /></button>
            : <button type="submit" aria-label="Send" className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-green text-green-ink hover:bg-[#8cebb2]"><Icon name="arrow" /></button>}
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-dim">
          <span>{stt.supported ? "Mic only listens while it's red. Your browser turns speech into text; nothing is recorded or stored here." : "Voice input isn't available in this browser. Typing works everywhere."}</span>
          <label className="inline-flex items-center gap-1">Voice speed
            <select value={rate} onChange={(e) => setRate(Number(e.target.value))} className="rounded-full border border-line bg-bg px-1.5 py-0.5 text-[11px] text-ink">
              {RATES.map((r) => <option key={r.v} value={r.v}>{r.label}</option>)}
            </select>
          </label>
        </div>
      </form>
    </div>
  );
}

function Bubble({ who, children }: { who: "guide" | "visitor"; children: React.ReactNode }) {
  return (
    <div className={cx("flex", who === "visitor" && "justify-end")}>
      <div className={cx("max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[14.5px] leading-relaxed",
        who === "guide" ? "rounded-tl-sm bg-raise text-[#DDE5E1]" : "rounded-tr-sm bg-green/15 text-ink")}>
        <span className="sr-only">{who === "guide" ? "Oz said: " : "You said: "}</span>{children}
      </div>
    </div>
  );
}
function Text({ text }: { text: string }) {
  const lines = text.split("\n");
  return <>{lines.map((l, i) => l.startsWith("• ")
    ? <span key={i} className="mt-1 flex gap-2"><span aria-hidden className="text-green">•</span><span>{l.slice(2)}</span></span>
    : <span key={i} className={cx("block", i > 0 && "mt-1.5")}>{l}</span>)}</>;
}
function MicIcon({ on }: { on: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="3" width="6" height="11" rx="3" fill={on ? "currentColor" : "none"} /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    </svg>
  );
}
