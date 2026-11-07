import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { search, type Hit } from "~/lib/search";
import { track } from "~/lib/analytics";
import { Icon } from "./Icon";
import { cx } from "./ui";
import { Highlighted, SUGGESTIONS } from "./Search";

/** Loaded on demand: the search index covers every page's content. */
export default function SearchDialog({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const hits = useMemo(() => search(q, 24), [q]);
  const prevFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    prevFocus.current = document.activeElement as HTMLElement;
    input.current?.focus();
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; prevFocus.current?.focus?.(); };
  }, []);
  useEffect(() => setActive(0), [q]);

  const go = (h: Hit) => { track("search_used", { type: h.type }); onClose(); navigate(h.to); };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { e.preventDefault(); onClose(); }
    else if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, hits.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === "Enter" && hits[active]) { e.preventDefault(); go(hits[active]); }
    else if (e.key === "Tab") { e.preventDefault(); /* focus stays in the dialog */ (document.activeElement === input.current ? document.getElementById("search-close") : input.current)?.focus(); }
  };
  useEffect(() => { document.getElementById(`sr-${active}`)?.scrollIntoView?.({ block: "nearest" }); }, [active]);

  return (
    <div className="fixed inset-0 z-[60] print:hidden" onKeyDown={onKey}>
      <button type="button" tabIndex={-1} aria-label="Close search" className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-label="Search the portfolio"
        className="relative mx-auto mt-[8vh] flex max-h-[80vh] w-[min(720px,calc(100vw-24px))] flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl">
        <div className="flex items-center gap-2 border-b border-line px-4">
          <Icon name="search" className="text-dim" />
          <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} type="search" placeholder="Search projects, skills, research, notes…"
            aria-label="Search query" role="combobox" aria-expanded={hits.length > 0} aria-controls="search-results" aria-autocomplete="list"
            aria-activedescendant={hits.length ? `sr-${active}` : undefined}
            className="h-14 w-full bg-transparent text-[17px] outline-none placeholder:text-dim [&::-webkit-search-cancel-button]:hidden" />
          {q && <button type="button" onClick={() => { setQ(""); input.current?.focus(); }} className="label hover:text-ink">Clear</button>}
          <button id="search-close" type="button" onClick={onClose} aria-label="Close search" className="inline-flex size-9 items-center justify-center rounded-lg text-muted hover:text-ink"><Icon name="close" /></button>
        </div>
        <div className="overflow-y-auto p-2" aria-live="polite">
          {!q && (
            <div className="p-4">
              <p className="label mb-3">Try</p>
              <div className="flex flex-wrap gap-2">{SUGGESTIONS.map((s) => <button key={s} type="button" onClick={() => setQ(s)} className="rounded-full border border-line px-3 py-1 text-sm text-muted hover:text-ink hover:border-green/60">{s}</button>)}</div>
            </div>
          )}
          {q && !hits.length && <p role="status" className="p-6 text-center text-muted">No results for “{q}”. Try a project name, a skill, or a company from the case studies.</p>}
          {hits.length > 0 && (
            <ul id="search-results" role="listbox" aria-label="Results">
              {hits.map((h, i) => (
                <li key={h.id} id={`sr-${i}`} role="option" aria-selected={i === active}>
                  <button type="button" onClick={() => go(h)} onMouseEnter={() => setActive(i)}
                    className={cx("flex w-full gap-3 rounded-xl px-3 py-2.5 text-left", i === active && "bg-raise")}>
                    <span className="label mt-0.5 w-24 shrink-0 !text-green">{h.type}</span>
                    <span className="min-w-0">
                      <span className="block font-medium text-ink"><Highlighted text={h.title} query={q} /></span>
                      <span className="block truncate text-sm text-dim"><Highlighted text={h.snippet} query={q} /></span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex items-center justify-between border-t border-line px-4 py-2 text-xs text-dim">
          <span>↑↓ to move · Enter to open · Esc to close</span>
          {q && <button type="button" onClick={() => { onClose(); navigate(`/search?q=${encodeURIComponent(q)}`); }} className="underline underline-offset-4 hover:text-ink">All results</button>}
        </div>
      </div>
    </div>
  );
}
