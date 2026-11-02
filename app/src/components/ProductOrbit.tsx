import { useState } from "react";
import { legacy } from "~/content/data";
import { cx } from "./ui";

/** The Product Orbit from the original site: five domains around the core,
 *  with the build → measure → learn loop beneath. Data: site/content.js. */
export function ProductOrbit() {
  const { inner, outer } = legacy.orbit;
  const [sel, setSel] = useState(0);
  const R = 150, C = 190;
  return (
    <div className="grid items-center gap-8 lg:grid-cols-[400px_1fr]">
      <div className="relative mx-auto aspect-square w-full max-w-[380px]">
        <svg viewBox="0 0 380 380" className="absolute inset-0 h-full w-full" aria-hidden>
          <circle cx={C} cy={C} r={R} fill="none" stroke="#4DFF4D" strokeOpacity=".35" strokeWidth="1.5" />
          <ellipse cx={C} cy={C} rx={R + 26} ry={46} fill="none" stroke="#35D6D0" strokeOpacity=".3" transform={`rotate(-12 ${C} ${C})`} />
          <circle cx={C} cy={C} r="54" fill="#121C19" stroke="#4DFF4D" strokeWidth="2" />
        </svg>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="font-display text-sm font-bold">Gaurav<span className="text-green">.OS</span></p>
          <p className="font-mono text-[9px] tracking-[.2em] text-dim">PRODUCT SYSTEM</p>
        </div>
        <ul role="tablist" aria-label="Product Orbit domains">
          {inner.map((d, i) => {
            const a = (-90 + (i * 360) / inner.length) * (Math.PI / 180);
            return (
              <li key={d.id} role="presentation" className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${((C + R * Math.cos(a)) / 380) * 100}%`, top: `${((C + R * Math.sin(a)) / 380) * 100}%` }}>
                <button type="button" role="tab" id={`orbit-${d.id}`} aria-selected={sel === i} aria-controls="orbit-panel" onClick={() => setSel(i)}
                  onKeyDown={(e) => { if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); setSel((sel + 1) % inner.length); } if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); setSel((sel - 1 + inner.length) % inner.length); } }}
                  tabIndex={sel === i ? 0 : -1}
                  className={cx("rounded-full border px-3 py-1.5 font-mono text-[11px] tracking-[.14em]", sel === i ? "border-green bg-green text-green-ink" : "border-line bg-bg text-muted hover:text-ink")}>{d.label}</button>
              </li>
            );
          })}
        </ul>
      </div>
      <div>
        <div id="orbit-panel" role="tabpanel" aria-labelledby={`orbit-${inner[sel].id}`} aria-live="polite" className="card p-6">
          <p className="label">Domain {sel + 1} of {inner.length}</p>
          <h3 className="mt-2 font-mono text-xl tracking-[.14em] text-green">{inner[sel].label}</h3>
          <p className="mt-2 text-xl text-ink">{inner[sel].blurb}</p>
        </div>
        <ol className="mt-4 grid gap-3 sm:grid-cols-3" aria-label="Operating loop">
          {outer.map((o, i) => <li key={o.label} className="card p-4"><span className="font-mono text-xs text-dim">{String(i + 1).padStart(2, "0")}</span><p className="mt-1 font-mono text-sm tracking-[.14em] text-cyan">{o.label}</p><p className="mt-1 text-sm text-muted">{o.blurb}</p></li>)}
        </ol>
      </div>
    </div>
  );
}
