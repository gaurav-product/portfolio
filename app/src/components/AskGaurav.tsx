import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { ask, type AskResult } from "~/lib/ask";
import { suggested } from "~/content/kb";
import { Blocks, Pill, cx } from "./ui";
import { Icon } from "./Icon";
import { track } from "~/lib/analytics";

interface Turn { id: number; q: string; r: AskResult }
const TRACE = ["QUESTION", "UNSUPPORTED-ASK CHECK", "MATCH STORED ANSWER", "SOURCES"];

/** Local, deterministic Q&A. No model, no network — answers are selected from
 *  pre-written, verified entries, and the UI says so. */
export function AskGaurav({ compact = false }: { compact?: boolean }) {
  const [q, setQ] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const end = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => { if (turns.length) end.current?.scrollIntoView?.({ block: "nearest", behavior: "smooth" }); }, [turns]);

  const submit = (question: string) => {
    const text = question.trim();
    if (!text) { setError("Type a question first."); input.current?.focus(); return; }
    if (text.length > 300) { setError("Please keep questions under 300 characters."); return; }
    setError(""); setBusy(true);
    // Synchronous lookup; the brief state change lets screen readers announce progress.
    requestAnimationFrame(() => {
      try {
        const r = ask(text);
        setTurns((t) => [...t, { id: Date.now(), q: text, r }]);
        track(r.kind === "refused" ? "ask_refused" : "ask_question", { kind: r.kind });
      } catch { setError("Something went wrong looking that up. Please try again."); }
      setBusy(false); setQ("");
    });
  };

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-3">
        <p className="flex items-center gap-2 font-medium"><Icon name="ask" />Ask Gaurav</p>
        <Pill tone="amber">Local knowledge base · no live AI model</Pill>
      </div>
      <div className={cx("overflow-y-auto px-5 py-4", compact ? "max-h-[420px]" : "max-h-[60vh] min-h-[260px]")} aria-live="polite" aria-busy={busy}>
        {!turns.length && (
          <div>
            <p className="text-[#C9D2CD]">Answers come only from a fixed index of verified portfolio facts. Questions about figures the portfolio does not contain — revenue, user counts, test results, private details — are refused before anything else is matched.</p>
            <p className="label mb-2 mt-5">Suggested questions</p>
            <ul className="flex flex-wrap gap-2">{suggested.map((s) => <li key={s}><button type="button" onClick={() => submit(s)} className="rounded-full border border-line px-3 py-1.5 text-left text-sm text-muted hover:border-green/60 hover:text-ink">{s}</button></li>)}</ul>
          </div>
        )}
        <ol className="grid gap-5">
          {turns.map((t) => (
            <li key={t.id} className="grid gap-3">
              <p className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-raise px-4 py-2.5"><span className="sr-only">You asked: </span>{t.q}</p>
              <div className="max-w-[95%]">
                <ol aria-label="Retrieval path" className="mb-2 flex flex-wrap gap-1 font-mono text-[10.5px] tracking-wider">
                  {TRACE.map((s, i) => {
                    const reached = t.r.kind === "refused" ? i <= 1 : t.r.kind === "answer" ? true : i <= 2;
                    return <li key={s} className={cx("rounded border px-1.5 py-0.5", reached ? "border-green/40 text-green" : "border-line-soft text-dim")}>{s}</li>;
                  })}
                </ol>
                {t.r.kind === "refused" && <div data-testid="ask-refused"><Pill tone="red">Refused — no evidence</Pill><div className="mt-2"><Blocks blocks={t.r.blocks} /></div></div>}
                {t.r.kind === "answer" && (
                  <div data-testid="ask-answer">
                    <Pill tone="green">Grounded answer · {t.r.entry.q}</Pill>
                    <div className="mt-2"><Blocks blocks={t.r.entry.answer} /></div>
                    <p className="mt-3 flex flex-wrap items-center gap-2 text-sm"><span className="label">Sources</span>{t.r.entry.links.map((l) => <Link key={l.to} to={l.to} className="text-green underline underline-offset-4">{l.label}</Link>)}</p>
                  </div>
                )}
                {t.r.kind === "related" && (
                  <div data-testid="ask-related">
                    <Pill tone="cyan">No stored answer — related pages</Pill>
                    <p className="mt-2 text-[#C9D2CD]">There is no pre-written answer to that. These pages mention it:</p>
                    <ul className="mt-2 grid gap-1">{t.r.hits.map((h) => <li key={h.id}><Link to={h.to} className="text-green underline underline-offset-4">{h.title}</Link> <span className="text-xs text-dim">· {h.type}</span></li>)}</ul>
                  </div>
                )}
                {t.r.kind === "none" && <div data-testid="ask-none"><Pill>Not documented</Pill><p className="mt-2 text-[#C9D2CD]">I don't have portfolio evidence to answer that, and I won't guess. Try a suggested question, or <Link to="/contact" className="text-green underline">ask Gaurav directly</Link>.</p></div>}
              </div>
            </li>
          ))}
        </ol>
        {busy && <p role="status" className="mt-3 text-sm text-dim">Looking it up…</p>}
        <div ref={end} />
      </div>
      <form onSubmit={(e) => { e.preventDefault(); submit(q); }} className="flex flex-wrap gap-2 border-t border-line p-3">
        <label htmlFor="ask-input" className="sr-only">Your question</label>
        <input ref={input} id="ask-input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask about projects, experience, skills…" className="field min-w-0 flex-1" maxLength={300} aria-invalid={!!error} aria-describedby={error ? "ask-err" : undefined} autoComplete="off" />
        <button type="submit" disabled={busy} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-green px-4 font-semibold text-green-ink disabled:opacity-60"><Icon name="arrow" />Send</button>
        <button type="button" onClick={() => { setTurns([]); setError(""); input.current?.focus(); }} disabled={!turns.length} className="min-h-11 rounded-xl border border-line px-3 text-sm text-muted hover:text-ink disabled:opacity-40">Clear conversation</button>
        {error && <p id="ask-err" role="alert" className="w-full text-sm text-red">{error}</p>}
      </form>
    </div>
  );
}
