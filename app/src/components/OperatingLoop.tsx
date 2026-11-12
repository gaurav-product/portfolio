import { useState, type ReactNode } from "react";
import { legacy } from "~/content/data";
import { cx } from "~/components/ui";
import { Icon } from "~/components/Icon";

/**
 * The eight-stage operating loop (OBSERVE → … → ITERATE).
 *
 * The ring itself is the control: eight stage nodes (accessible tabs, arrow keys move around the ring),
 * the selected node and the arc travelled so far light up, and the centre names the stage. Each stage has
 * its own visual motif in the panel, beside its description and its evidence from the portfolio — so the
 * stages look different, and the diagram changes when a stage is chosen. `figure` (optional) sits under the ring.
 */
const LABEL = (k: string) => k.charAt(0) + k.slice(1).toLowerCase();

export function OperatingLoop({ figure, idPrefix = "loop" }: { figure?: ReactNode; idPrefix?: string }) {
  const [stage, setStage] = useState(0);
  const loop = legacy.loop;
  const n = loop.length;
  const s = loop[stage];
  const go = (i: number, focus = false) => {
    const next = (i + n) % n;
    setStage(next);
    if (focus) document.getElementById(`${idPrefix}-tab-${loop[next].id}`)?.focus();
  };
  const onKey = (e: React.KeyboardEvent) => {
    const k = e.key;
    const to = k === "ArrowRight" || k === "ArrowDown" ? stage + 1 : k === "ArrowLeft" || k === "ArrowUp" ? stage - 1 : k === "Home" ? 0 : k === "End" ? n - 1 : null;
    if (to === null) return;
    e.preventDefault(); go(to, true);
  };
  // node positions on the ring (percent of the square), starting at the top, clockwise
  const pos = (i: number) => { const a = -Math.PI / 2 + (i / n) * Math.PI * 2; return { x: 50 + Math.cos(a) * 40, y: 50 + Math.sin(a) * 40 }; };
  const R = 40, C = 2 * Math.PI * R;
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,440px)_1fr] lg:items-start">
      <div>
        <div className="relative mx-auto aspect-square w-full max-w-[420px]" data-testid="loop-ring" data-stage={s.id}>
          <svg viewBox="0 0 100 100" aria-hidden className="absolute inset-0 h-full w-full overflow-visible">
            <defs>
              <radialGradient id={`${idPrefix}-glow`}><stop offset="0%" stopColor="#4DFF4D" stopOpacity=".16" /><stop offset="100%" stopColor="#4DFF4D" stopOpacity="0" /></radialGradient>
            </defs>
            <circle cx="50" cy="50" r="30" fill={`url(#${idPrefix}-glow)`} />
            <circle cx="50" cy="50" r={R} fill="none" stroke="currentColor" className="text-line" strokeWidth=".5" />
            {/* the arc travelled so far: from Observe to the selected stage */}
            <circle cx="50" cy="50" r={R} fill="none" stroke="#4DFF4D" strokeWidth=".9" strokeLinecap="round"
              strokeDasharray={`${(C * stage) / n + 0.01} ${C}`} transform="rotate(-90 50 50)" className="transition-[stroke-dasharray] duration-500 motion-reduce:transition-none" />
            {/* direction of travel */}
            {loop.map((_, i) => { const a = -90 + ((i + 0.5) / n) * 360; return <path key={i} d="M -1 -1.1 L 0.9 0 L -1 1.1" fill="none" stroke="currentColor" strokeWidth=".45" className={i < stage ? "text-green" : "text-dim"} transform={`rotate(${a} 50 50) translate(${50 + R} 50) rotate(90)`} />; })}
          </svg>
          {/* centre: the selected stage */}
          <div className="pointer-events-none absolute inset-[24%] grid place-items-center rounded-full text-center" aria-hidden>
            <div>
              <p className="font-mono text-[11px] tracking-[.2em] text-dim">{String(stage + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}</p>
              <p className="mt-1 font-display text-2xl font-bold sm:text-3xl">{LABEL(s.k)}</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[.2em] text-green">Operating loop</p>
            </div>
          </div>
          <div role="tablist" aria-label="Loop stages" onKeyDown={onKey}>
            {loop.map((l, i) => {
              const p = pos(i), on = i === stage, done = i < stage;
              return (
                <button key={l.id} role="tab" type="button" id={`${idPrefix}-tab-${l.id}`} aria-selected={on} aria-controls={`${idPrefix}-panel`} tabIndex={on ? 0 : -1}
                  aria-label={LABEL(l.k)} onClick={() => go(i)} style={{ left: `${p.x}%`, top: `${p.y}%` }}
                  className="group absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 outline-none">
                  <span className={cx("grid size-11 place-items-center rounded-full border transition-[background-color,border-color,box-shadow] duration-300 group-focus-visible:ring-2 group-focus-visible:ring-green sm:size-12",
                    on ? "border-green bg-green text-green-ink shadow-[0_0_24px_rgba(77,255,77,.45)]" : done ? "border-green/60 bg-raise text-green" : "border-line bg-surface text-muted group-hover:border-green/60 group-hover:text-ink")}>
                    <StageGlyph id={l.id} />
                  </span>
                  <span className={cx("whitespace-nowrap rounded-full px-1.5 font-mono text-[10px] uppercase tracking-[.12em] sm:text-[10.5px]", on ? "text-green" : "text-dim group-hover:text-ink")}>{LABEL(l.k)}</span>
                </button>
              );
            })}
          </div>
        </div>
        {figure && <div className="mx-auto mt-6 max-w-[420px]">{figure}</div>}
      </div>

      <div id={`${idPrefix}-panel`} role="tabpanel" aria-labelledby={`${idPrefix}-tab-${s.id}`} className="card overflow-hidden" data-testid="loop-panel">
        <div className="flex items-center gap-5 border-b border-line-soft bg-raise/40 p-6">
          <StageMotif id={s.id} key={s.id} />
          <div>
            <p className="label">Stage {stage + 1} of {n}</p>
            <h3 className="mt-1 text-3xl font-bold">{s.k}</h3>
          </div>
        </div>
        <div className="p-6">
          <p className="text-lg text-[#C9D2CD]">{s.d}</p>
          <h4 className="label mb-3 mt-6">Evidence</h4>
          <ul className="grid gap-2.5">{s.e.map(([num, l]) => (
            <li key={l} className="grid grid-cols-[minmax(5.5rem,auto)_1fr] gap-3 border-t border-line-soft pt-2.5 first:border-0 first:pt-0">
              <span className="font-mono text-green">{num}</span><span className="text-[#C9D2CD]">{l}</span>
            </li>
          ))}</ul>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => go(stage - 1)} className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-line px-3 text-sm hover:border-green/60"><Icon name="left" size={16} />Previous</button>
            <button type="button" onClick={() => go(stage + 1)} className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-line px-3 text-sm hover:border-green/60">Next<Icon name="right" size={16} /></button>
            <span className="ml-1 text-sm text-dim">{stage === n - 1 ? "Then the loop starts again at Observe." : `Next: ${LABEL(loop[stage + 1].k)}`}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- one glyph per stage (original line icons) */
function StageGlyph({ id }: { id: string }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const g: Record<string, ReactNode> = {
    lp1: <><path {...p} d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6S2 12 2 12Z" /><circle {...p} cx="12" cy="12" r="2.8" /></>,
    lp2: <path {...p} d="M4 9V5h4M20 9V5h-4M4 15v4h4M20 15v4h-4M8.5 12h7" />,
    lp3: <><circle {...p} cx="10.5" cy="10.5" r="5.5" /><path {...p} d="m15 15 5 5M8 10.5h5" /></>,
    lp4: <path {...p} d="M5 5h6M8 5v6l-4 7a1.2 1.2 0 0 0 1 2h6M16 4l4 4M20 4l-4 4M15 15l2 2 4-4" />,
    lp5: <><rect {...p} x="4" y="13" width="7" height="7" rx="1" /><rect {...p} x="13" y="13" width="7" height="7" rx="1" /><rect {...p} x="8.5" y="4" width="7" height="7" rx="1" /></>,
    lp6: <path {...p} d="M4 20h16M7 16v-4M12 16V7M17 16v-6" />,
    lp7: <path {...p} d="M3 4h18l-7 8v6l-4 2v-8L3 4Z" />,
    lp8: <path {...p} d="M20 11a8 8 0 0 0-14-5l-2 2M4 13a8 8 0 0 0 14 5l2-2M4 4v4h4M20 20v-4h-4" />,
  };
  return <svg viewBox="0 0 24 24" aria-hidden className="size-5">{g[id]}</svg>;
}

/* ---------------------------------------------------------------- one motif per stage: what the stage does, drawn */
function StageMotif({ id }: { id: string }) {
  const line = { fill: "none", stroke: "#4DFF4D", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const dim = { ...line, stroke: "#5E6B66" };
  const m: Record<string, ReactNode> = {
    // observe: an eye with what it has seen (dots) before any opinion
    lp1: <><path {...line} d="M8 40s11-17 32-17 32 17 32 17-11 17-32 17S8 40 8 40Z" /><circle {...line} cx="40" cy="40" r="8" />{[[16, 18], [64, 18], [70, 62], [12, 60]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="2" fill="#35D6D0" />)}</>,
    // frame: brackets around one arguable statement
    lp2: <><path {...line} d="M14 24v-8h10M66 24v-8H56M14 56v8h10M66 56v8H56" /><path {...dim} d="M24 34h32M24 46h20" /><path {...line} d="M24 40h32" /></>,
    // research: a lens over the weakest layer
    lp3: <><path {...dim} d="M10 24h60M10 36h60M10 48h60M10 60h60" /><circle {...line} cx="44" cy="42" r="13" fill="#0B1110" /><path {...line} d="m53 51 11 11M38 42h12" /></>,
    // hypothesize: if → then, with a way to fail
    lp4: <><circle {...line} cx="14" cy="40" r="5" /><path {...line} d="M19 40h14l12-14h18M45 40h18" /><path {...dim} d="M33 40l12 14h18" /><path {...line} d="M60 50l6 6M66 50l-6 6" /></>,
    // build: the smallest judgeable thing, block by block
    lp5: <><rect {...dim} x="12" y="46" width="18" height="18" rx="2" /><rect {...dim} x="32" y="46" width="18" height="18" rx="2" /><rect {...line} x="22" y="26" width="18" height="18" rx="2" /><rect {...dim} x="52" y="46" width="16" height="18" rx="2" strokeDasharray="3 3" /></>,
    // measure: segments before averages
    lp6: <><path {...dim} d="M10 64h60" />{[[16, 24], [28, 40], [40, 18], [52, 32], [64, 46]].map(([x, h], i) => <rect key={x} x={x - 4} y={64 - h} width="8" height={h} rx="1.5" fill={i === 1 ? "#4DFF4D" : "#2A3632"} />)}<path {...line} strokeDasharray="2 3" d="M10 38h60" /></>,
    // learn: where value stops transferring (the step, not the biggest number)
    lp7: <><path {...dim} d="M10 18h60l-12 14H22L10 18Z" /><path {...line} d="M22 36h36l-10 12H32L22 36Z" /><path {...dim} d="M32 52h16l-5 10h-6l-5-10Z" /><circle cx="60" cy="42" r="3" fill="#F2C14E" /></>,
    // iterate: change one thing, keep the guardrails, go round again
    lp8: <><path {...line} d="M58 28a20 20 0 1 0 4 20" /><path {...line} d="M56 18l3 10-10 2" /><path {...dim} d="M12 70h56M12 12h56" strokeDasharray="2 4" /><circle cx="40" cy="40" r="3" fill="#4DFF4D" /></>,
  };
  return <svg viewBox="0 0 80 80" aria-hidden className="size-20 shrink-0 motion-safe:animate-[fadein_.4s_ease]" data-testid="loop-motif">{m[id]}</svg>;
}
