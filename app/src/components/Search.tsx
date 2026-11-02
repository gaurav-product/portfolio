import { createContext, lazy, Suspense, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { highlight } from "~/lib/text";

const SearchDialog = lazy(() => import("./SearchDialog"));

const Ctx = createContext<{ openSearch: () => void }>({ openSearch: () => {} });
export const useSearch = () => useContext(Ctx);

export function Highlighted({ text, query }: { text: string; query: string }) {
  return <>{highlight(text, query).map((p, i) => p.m ? <mark key={i} className="rounded bg-green/20 px-0.5 text-ink">{p.t}</mark> : <span key={i}>{p.t}</span>)}</>;
}

export function SearchProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const openSearch = useCallback(() => setOpen(true), []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      const typing = /INPUT|TEXTAREA|SELECT/.test(t.tagName) || t.isContentEditable;
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) { e.preventDefault(); setOpen(true); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return <Ctx.Provider value={{ openSearch }}>{children}{open && <Suspense fallback={null}><SearchDialog onClose={() => setOpen(false)} /></Suspense>}</Ctx.Provider>;
}

export const SUGGESTIONS = ["Evamastu", "funnel analysis", "AI safety", "RICE", "post-discharge", "Day 90"];

