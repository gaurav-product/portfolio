import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { type Study } from "~/content/data";
import { corpus } from "~/content/corpus";
import { PageHero, Container, SectionHeader, Pill, evidenceTone, cx } from "~/components/ui";
import { seo } from "~/lib/meta";

export const meta = () => seo("Product Atlas", "The 90-day corpus as a constellation, an evolution view and an operating model — all drawn from the generated data.", "/atlas");

const CAT_COLOR: Record<string, string> = { Healthcare: "#6BE39A", AI: "#35D6D0", Consumer: "#F2C14E", Fintech: "#BCA6FF", Marketplace: "#FF9F6E", SaaS: "#7FB2FF", B2B: "#E58BD8", Analytics: "#F3F6F4" };
const LEVEL_R: Record<string, number> = { VERIFIED: 9, DOCUMENTED: 7, SOURCED: 5.5, NARRATIVE: 4 };

export default function Atlas() {
  const [cat, setCat] = useState("All");
  const [hover, setHover] = useState<Study | null>(null);
  const nav = useNavigate();
  const W = 900, H = 560, cx0 = W / 2, cy0 = H / 2;
  const pts = useMemo(() => corpus.studies.map((s, k) => {
    const a = k * 2.399963, r = 22 * Math.sqrt(k + 1) * 1.05;
    return { s, x: cx0 + r * Math.cos(a) * 1.35, y: cy0 + r * Math.sin(a) * 0.95 };
  }), []);
  const metrics: { key: keyof (typeof corpus.blocks)[number]; label: string; fmt: (n: number) => string }[] = [
    { key: "avg_words", label: "Average words per study", fmt: (n) => n.toLocaleString("en-IN") },
    { key: "avg_sources", label: "Average references per study", fmt: (n) => n.toFixed(1) },
    { key: "assumptions", label: "Studies with an ASSUMPTIONS file (of 10)", fmt: (n) => String(n) },
    { key: "verification", label: "Studies describing executed checks (of 10)", fmt: (n) => String(n) },
    { key: "avg_evidence", label: "Average evidence score (0–8)", fmt: (n) => n.toFixed(1) },
  ];

  return (
    <>
      <PageHero eyebrow="Product Atlas" title="The 90-day corpus, mapped"
        intro={`${corpus.counts.written} studies · ${corpus.counts.sources.toLocaleString("en-IN")} references · ${corpus.counts.assumption_files} ASSUMPTIONS files · ${corpus.counts.verified} studies with programmatic checks. Audited ${corpus.audited}.`} />
      <Container wide className="grid gap-20 py-12">
        <section aria-labelledby="const">
          <SectionHeader id="const" eyebrow="Constellation" title="One point per study" intro="Colour is the derived category; size is the evidence level. Select a point to open the study." />
          <div role="group" aria-label="Highlight a category" className="mb-4 flex flex-wrap gap-2">
            {["All", ...Object.keys(corpus.categories)].map((c) => (
              <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)} className={cx("inline-flex min-h-9 items-center gap-2 rounded-full border px-3 text-sm", cat === c ? "border-green text-ink" : "border-line text-muted")}>
                {c !== "All" && <span className="size-2.5 rounded-full" style={{ background: CAT_COLOR[c] }} aria-hidden />}{c}{c !== "All" && <span className="text-dim">{corpus.categories[c]}</span>}
              </button>
            ))}
          </div>
          <div className="card relative overflow-hidden">
            <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label="Constellation of 90 case studies. Use the list below for an accessible version.">
              {pts.map(({ s, x, y }) => {
                const on = cat === "All" || s.category === cat;
                return (
                  <circle key={s.day} cx={x} cy={y} r={LEVEL_R[s.evidence_level]} fill={CAT_COLOR[s.category] ?? "#A1ADA7"} fillOpacity={on ? 0.9 : 0.12}
                    stroke={hover?.day === s.day ? "#fff" : "none"} strokeWidth={2} className="cursor-pointer" data-day={s.day}
                    onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(null)} onClick={() => nav(`/research/${s.day}`)} />
                );
              })}
            </svg>
            <div aria-live="polite" className="pointer-events-none absolute left-4 top-4 max-w-xs rounded-xl border border-line bg-bg/90 p-3 text-sm">
              {hover ? <><span className="font-mono text-green">DAY {hover.day}</span> · {hover.company}<span className="block text-dim">{hover.category} · {hover.evidence_level}</span></> : <span className="text-dim">Hover or tap a point</span>}
            </div>
          </div>
          <details className="mt-4">
            <summary className="cursor-pointer text-sm text-muted underline underline-offset-4">Accessible list of all {corpus.studies.length} studies</summary>
            <ol className="mt-3 grid gap-1 text-sm sm:grid-cols-2 lg:grid-cols-3">
              {corpus.studies.filter((s) => cat === "All" || s.category === cat).map((s) => <li key={s.day}><Link to={`/research/${s.day}`} className="text-muted hover:text-ink">Day {s.day} — {s.company} ({s.evidence_level})</Link></li>)}
            </ol>
          </details>
        </section>

        <section aria-labelledby="evo">
          <SectionHeader id="evo" eyebrow="Evolution" title="How the method changed, in ten-day blocks" intro="Counts are documented in the repository. Reading them as a deliberate arc is interpretation." />
          <div className="grid gap-4 lg:grid-cols-2">
            {metrics.map((m) => {
              const max = Math.max(...corpus.blocks.map((b) => Number(b[m.key])), 1);
              return (
                <figure key={m.key} className="card p-5">
                  <figcaption className="label mb-4">{m.label}</figcaption>
                  <table className="w-full text-sm"><caption className="sr-only">{m.label} by ten-day block</caption>
                    <tbody>{corpus.blocks.map((b) => (
                      <tr key={b.label}><th scope="row" className="w-20 py-1 pr-3 text-left font-mono text-xs font-normal text-dim">{b.label}</th>
                        <td className="py-1"><div className="flex items-center gap-2"><div className="h-4 rounded bg-green/70" style={{ width: `${(Number(b[m.key]) / max) * 100}%`, minWidth: Number(b[m.key]) ? 3 : 0 }} /><span className="font-mono text-xs">{m.fmt(Number(b[m.key]))}</span></div></td></tr>
                    ))}</tbody>
                  </table>
                </figure>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="model">
          <SectionHeader id="model" eyebrow="Operating model" title="Eight stages, counted across the corpus" />
          <ol className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {corpus.stages.map((s, i) => (
              <li key={s.id} className="card p-5">
                <span className="font-mono text-xs text-dim">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-1 font-mono text-sm tracking-widest text-green">{s.label}</h3>
                <p className="mt-2 font-display text-3xl font-bold">{s.count}<span className="text-base font-normal text-dim"> / {corpus.counts.directories}</span></p>
                <p className="mt-2 text-sm text-muted">{s.basis}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="levels">
          <SectionHeader id="levels" eyebrow="Evidence formula" title="How the evidence level is scored" />
          <div className="grid gap-6 lg:grid-cols-2">
            <ul className="card grid gap-2 p-5 text-[#C9D2CD]">{corpus.evidence_formula.map((f) => <li key={f} className="font-mono text-sm">{f}</li>)}</ul>
            <ul className="grid gap-2">{["VERIFIED", "DOCUMENTED", "SOURCED", "NARRATIVE"].map((l) => <li key={l} className="card flex items-center justify-between p-4"><Pill tone={evidenceTone(l)}>{l}</Pill><Link to={`/research?evidence=${l}`} className="text-sm text-green underline underline-offset-4">{corpus.studies.filter((s) => s.evidence_level === l).length} studies</Link></li>)}</ul>
          </div>
        </section>
      </Container>
    </>
  );
}
