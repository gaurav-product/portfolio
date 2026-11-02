import { useState, type ReactNode } from "react";
import { legacy } from "~/content/data";
import { cx } from "~/components/ui";
import { Icon } from "~/components/Icon";

/** The eight-stage operating loop (OBSERVE → … → ITERATE) as accessible tabs.
 *  Each stage shows its evidence from the portfolio. `figure` sits above the tabs. */
export function OperatingLoop({ figure, idPrefix = "loop" }: { figure?: ReactNode; idPrefix?: string }) {
  const [stage, setStage] = useState(0);
  const loop = legacy.loop;
  const s = loop[stage];
  const onKey = (e: React.KeyboardEvent) => {
    const n = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!n) return;
    e.preventDefault();
    const next = (stage + n + loop.length) % loop.length;
    setStage(next);
    document.getElementById(`${idPrefix}-tab-${loop[next].id}`)?.focus();
  };
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,460px)_1fr]">
      <div>
        {figure}
        <div role="tablist" aria-label="Loop stages" onKeyDown={onKey} className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {loop.map((l, i) => (
            <button key={l.id} role="tab" type="button" id={`${idPrefix}-tab-${l.id}`} aria-selected={i === stage} aria-controls={`${idPrefix}-panel`} tabIndex={i === stage ? 0 : -1} onClick={() => setStage(i)}
              className={cx("min-h-10 rounded-lg border px-2 font-mono text-xs tracking-wider", i === stage ? "border-green bg-green/10 text-green" : "border-line text-muted hover:text-ink")}>{l.k}</button>
          ))}
        </div>
      </div>
      <div id={`${idPrefix}-panel`} role="tabpanel" aria-labelledby={`${idPrefix}-tab-${s.id}`} className="card p-6" data-testid="loop-panel">
        <p className="label">Stage {stage + 1} of {loop.length}</p>
        <h3 className="mt-2 text-3xl font-bold">{s.k}</h3>
        <p className="mt-3 text-lg text-[#C9D2CD]">{s.d}</p>
        <h4 className="label mb-3 mt-6">Evidence</h4>
        <ul className="grid gap-2">{s.e.map(([n, l]) => <li key={l} className="flex gap-3"><span className="min-w-20 font-mono text-green">{n}</span><span className="text-[#C9D2CD]">{l}</span></li>)}</ul>
        <div className="mt-6 flex gap-2">
          <button type="button" onClick={() => setStage((stage - 1 + loop.length) % loop.length)} className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-line px-3 text-sm"><Icon name="left" size={16} />Previous</button>
          <button type="button" onClick={() => setStage((stage + 1) % loop.length)} className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-line px-3 text-sm">Next<Icon name="right" size={16} /></button>
        </div>
      </div>
    </div>
  );
}
