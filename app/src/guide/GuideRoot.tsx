import { createContext, lazy, Suspense, useCallback, useContext, useEffect, useReducer, useRef, useState } from "react";
import { useLocation } from "react-router";
import { Oz } from "./Oz";
import { next, type GuideEvent, type GuideState } from "./machine";
import type { Turn } from "./brain/types";
import type { GuideReply } from "./brain/types";
import type { LangPref } from "./lang";
import { track } from "~/lib/analytics";
import "./guide.css";

/* ---------------------------------------------------------------------------
   Site-wide host for Oz, the Gaurav.OS AI guide. Mounted once in root.tsx, so
   Oz (and the conversation) survive navigation between pages. This file stays
   small: the conversation panel, brain and voice engine are a separate chunk
   that loads the first time a visitor opens Oz.
--------------------------------------------------------------------------- */
const GuidePanel = lazy(() => import("./GuidePanel"));

export interface ChatTurn extends Turn { id: number; reply?: GuideReply }
interface Ctx {
  state: GuideState; send: (e: GuideEvent) => void;
  open: boolean; setOpen: (v: boolean) => void;
  turns: ChatTurn[]; setTurns: React.Dispatch<React.SetStateAction<ChatTurn[]>>;
  lang: LangPref; setLang: (l: LangPref) => void;
  mouth: React.MutableRefObject<HTMLDivElement | null>;
}
const GuideCtx = createContext<Ctx | null>(null);
export const useGuide = () => useContext(GuideCtx)!;

const KEY = { pos: "oz-pos", seen: "oz-seen", lang: "oz-lang", nudged: "oz-nudged" };
const store = {
  get(k: string) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k: string, v: string) { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
  sget(k: string) { try { return sessionStorage.getItem(k); } catch { return null; } },
  sset(k: string, v: string) { try { sessionStorage.setItem(k, v); } catch { /* private mode */ } },
};

/** Cheeky one-liners. At most one per visit, never with sound, never while busy. */
export const NUDGES = [
  "Hey! Don't ignore me 😂",
  "Need help exploring Gaurav's work?",
  "Psst… I've got some cool projects to show you!",
  "Recruiter? I can do the 30-second version 😉",
  "Ask me in Hindi too — main samajh jaata hoon!",
];

export function GuideRoot() {
  const [state, dispatch] = useReducer(next, "sleeping" as GuideState);
  const [open, setOpenRaw] = useState(false);
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [lang, setLangRaw] = useState<LangPref>("auto");
  const [bubble, setBubble] = useState<string | null>(null);
  const [mood, setMood] = useState<"dance" | "poke" | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null); // offset from bottom-right, px
  const host = useRef<HTMLDivElement | null>(null);
  const mouth = useRef<HTMLDivElement | null>(null);
  const loc = useLocation();
  const send = useCallback((e: GuideEvent) => dispatch(e), []);

  useEffect(() => {
    const l = store.get(KEY.lang); if (l === "en" || l === "hi" || l === "auto") setLangRaw(l);
    try { const p = JSON.parse(store.get(KEY.pos) ?? "null"); if (p && typeof p.x === "number" && typeof p.y === "number") setPos(clamp(p)); } catch { /* ignore */ }
  }, []);
  const setLang = (l: LangPref) => { setLangRaw(l); store.set(KEY.lang, l); };

  const setOpen = useCallback((v: boolean) => {
    setOpenRaw(v); setBubble(null);
    if (v) { dispatch({ type: "OPEN" }); track("guide_opened"); store.set(KEY.seen, "1"); }
    else dispatch({ type: "CLOSE" });
  }, []);

  // Oz never follows you into the intro film or print; hide on the CV page where the paper sheet is the content
  const hidden = loc.pathname === "/cv";

  /* first-visit hello and one rare nudge — text only, never sound */
  useEffect(() => {
    if (open || hidden) return;
    const firstVisit = !store.get(KEY.seen);
    const nudged = store.sget(KEY.nudged);
    if (nudged) return;
    const t = setTimeout(() => {
      if (document.hidden) return;
      setBubble(firstVisit ? "Hi! I'm Oz 👋 Ask me about Gaurav's work — in English or Hindi!" : NUDGES[Math.floor(Math.random() * NUDGES.length)]);
      store.sset(KEY.nudged, "1");
    }, firstVisit ? 5000 : 45000);
    return () => clearTimeout(t);
  }, [open, hidden]);
  useEffect(() => { if (!bubble) return; const t = setTimeout(() => setBubble(null), 9000); return () => clearTimeout(t); }, [bubble]);

  /* sleepy after a minute without any activity on the page; any movement wakes Oz */
  const [drowsy, setDrowsy] = useState(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wake = useCallback(() => {
    setDrowsy(false);
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setDrowsy(true), 60000);
  }, []);
  useEffect(() => {
    wake();
    const evs = ["pointermove", "keydown", "scroll", "touchstart"] as const;
    let last = 0;
    const on = () => { const n = Date.now(); if (n - last > 1000) { last = n; wake(); } };
    evs.forEach((e) => addEventListener(e, on, { passive: true }));
    return () => { evs.forEach((e) => removeEventListener(e, on)); if (idleTimer.current) clearTimeout(idleTimer.current); };
  }, [wake]);

  /* idle personality: an occasional little dance while closed (motion allowed, tab visible) */
  useEffect(() => {
    if (open || hidden || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      if (document.hidden || Math.random() > 0.5) return;
      setMood("dance"); setTimeout(() => setMood(null), 1700);
    }, 22000);
    return () => clearInterval(id);
  }, [open, hidden]);

  /* eyes follow the cursor on desktop, written to CSS variables (no re-render) */
  useEffect(() => {
    const coarse = matchMedia("(hover: none), (pointer: coarse)").matches;
    if (coarse) return;
    let frame = 0, lx = 0, ly = 0;
    const onMove = (e: PointerEvent) => {
      lx = e.clientX; ly = e.clientY;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        document.querySelectorAll<SVGSVGElement>("svg.oz").forEach((svg) => {
          const r = svg.getBoundingClientRect(); if (!r.width) return;
          const dx = lx - (r.left + r.width / 2), dy = ly - (r.top + r.height * 0.55);
          const d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 260);
          svg.style.setProperty("--ex", ((dx / d) * k).toFixed(2));
          svg.style.setProperty("--ey", ((dy / d) * k).toFixed(2));
        });
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => { window.removeEventListener("pointermove", onMove); if (frame) cancelAnimationFrame(frame); };
  }, []);

  /* drag to reposition; a press without movement is a click */
  const drag = useRef<{ sx: number; sy: number; ox: number; oy: number; moved: boolean } | null>(null);
  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    const cur = pos ?? { x: 0, y: 0 };
    drag.current = { sx: e.clientX, sy: e.clientY, ox: cur.x, oy: cur.y, moved: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const d = drag.current; if (!d) return;
    const dx = e.clientX - d.sx, dy = e.clientY - d.sy;
    if (!d.moved && Math.hypot(dx, dy) < 6) return;
    d.moved = true;
    setPos(clamp({ x: d.ox - dx, y: d.oy - dy }));
  };
  const suppressClick = useRef(false);
  const onPointerUp = () => {
    const d = drag.current; drag.current = null;
    if (d?.moved) { suppressClick.current = true; setPos((p) => { if (p) store.set(KEY.pos, JSON.stringify(p)); return p; }); poke(); }
  };
  const poke = () => { setMood("poke"); setTimeout(() => setMood(null), 500); };
  const onClick = () => {
    if (suppressClick.current) { suppressClick.current = false; return; } // that was a drag, not a click
    poke(); wake();
    setOpen(!open);
  };
  // arrow keys move Oz for keyboard users (Shift = bigger steps)
  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 64 : 16, cur = pos ?? { x: 0, y: 0 };
    const m: Record<string, [number, number]> = { ArrowLeft: [step, 0], ArrowRight: [-step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] };
    if (!m[e.key]) return;
    e.preventDefault(); const p = clamp({ x: cur.x + m[e.key][0], y: cur.y + m[e.key][1] }); setPos(p); store.set(KEY.pos, JSON.stringify(p));
  };
  useEffect(() => { const onResize = () => setPos((p) => (p ? clamp(p) : p)); addEventListener("resize", onResize); return () => removeEventListener("resize", onResize); }, []);

  const off = pos ?? { x: 0, y: 0 };
  const onLeft = typeof window !== "undefined" && off.x > window.innerWidth / 2 - 60;
  if (hidden) return null;
  return (
    <GuideCtx.Provider value={{ state, send, open, setOpen, turns, setTurns, lang, setLang, mouth }}>
      <div ref={host} className="oz-root fixed z-[45] print:hidden" style={{ right: `calc(16px + ${off.x}px)`, bottom: `calc(16px + ${off.y}px + env(safe-area-inset-bottom, 0px))` }} data-testid="oz">
        {bubble && !open && (
          <div role="status" className={`oz-bubble absolute bottom-[86px] w-max max-w-[240px] rounded-2xl rounded-br-sm border border-green/40 bg-surface px-3.5 py-2.5 text-sm text-ink shadow-[0_12px_40px_-10px_rgb(0_0_0/.8)] ${onLeft ? "left-0 rounded-bl-sm rounded-br-2xl" : "right-0"}`}>
            {bubble}
            <button type="button" onClick={() => setBubble(null)} aria-label="Dismiss message" className="ml-2 inline-flex size-6 items-center justify-center rounded-full align-middle text-dim hover:text-ink">×</button>
          </div>
        )}
        <button type="button" aria-label={open ? "Minimise Oz, the Gaurav.OS AI Guide" : "Open Oz, the Gaurav.OS AI Guide"} aria-expanded={open} aria-controls="oz-panel"
          title="Drag me anywhere · click to chat" aria-keyshortcuts="ArrowLeft ArrowRight ArrowUp ArrowDown"
          onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onClick={onClick} onKeyDown={onKeyDown}
          className={`oz-launch relative block touch-none select-none rounded-full p-1 outline-offset-4 [-webkit-tap-highlight-color:transparent] ${open ? "max-sm:hidden" : ""}`}>
          <Oz state={open ? state : drowsy && !bubble ? "sleeping" : "idle"} mood={mood} size={68} />
        </button>
        {open && (
          <Suspense fallback={<div role="status" className="absolute bottom-[90px] right-0 w-max rounded-2xl border border-line bg-surface px-4 py-3 text-sm text-muted">Waking Oz up…</div>}>
            <GuidePanel anchorLeft={onLeft} />
          </Suspense>
        )}
      </div>
    </GuideCtx.Provider>
  );
}

/** Keep Oz fully on screen (offsets are measured from the bottom-right corner). */
function clamp(p: { x: number; y: number }) {
  if (typeof window === "undefined") return p;
  return { x: Math.max(0, Math.min(window.innerWidth - 100, p.x)), y: Math.max(0, Math.min(window.innerHeight - 110, p.y)) };
}
