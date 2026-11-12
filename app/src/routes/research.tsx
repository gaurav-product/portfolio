import { useMemo } from "react";
import { CinematicImage } from "~/components/CinematicImage";
import { Link } from "react-router";
import { useHydratedSearchParams } from "~/lib/useHydratedSearchParams";
import { corpus } from "~/content/corpus";
import { PageHero, Container, Pill, Empty, evidenceTone, ButtonLink, cx } from "~/components/ui";
import { CAT_COLOR } from "~/content/studyMap";
import { seo } from "~/lib/meta";
import { norm } from "~/lib/text";

export const meta = () => seo("Research", `${corpus.counts.written} product case studies with search, filters and evidence levels, read from the public repository.`, "/research");
const LEVELS = ["VERIFIED", "DOCUMENTED", "SOURCED", "NARRATIVE"];
const RANGES: [string, number, number][] = [["All days", 1, 90], ["Days 1–30", 1, 30], ["Days 31–60", 31, 60], ["Days 61–90", 61, 90]];
const PAGE = 24;

export default function Research() {
  const [p, setP] = useHydratedSearchParams();
  const cat = p.get("category") ?? "All", lvl = p.get("evidence") ?? "All", q = p.get("q") ?? "", range = Number(p.get("range") ?? 0), shownCount = Number(p.get("show") ?? PAGE);
  const set = (k: string, v: string) => { const n = new URLSearchParams(p); v && v !== "All" && v !== "0" ? n.set(k, v) : n.delete(k); n.delete("show"); setP(n, { replace: true, preventScrollReset: true }); };
  const cats = Object.keys(corpus.categories);
  const [, from, to] = RANGES[range] ?? RANGES[0];
  const list = useMemo(() => corpus.studies.filter((s) => (cat === "All" || s.category === cat) && (lvl === "All" || s.evidence_level === lvl) && s.day >= from && s.day <= to &&
    (!q || norm(`${s.company} ${s.title} ${s.summary}`).includes(norm(q)))), [cat, lvl, q, from, to]);
  return (
    <>
      <PageHero backdrop={<CinematicImage id="research-analytics" decorative sizes="52vw" className="h-full" />} eyebrow="Research library" title={`${corpus.counts.written} product case studies`}
        intro={<>Read from <a href={corpus.repo} target="_blank" rel="noopener noreferrer" className="text-green underline underline-offset-4">the public repository</a> by a build step — never retyped. Audited {corpus.audited}. Category is derived by rule; the evidence level counts what a study carries, not its quality.</>}>
        <div className="mt-6 flex flex-wrap gap-3"><ButtonLink to="/universe?at=earth" icon="explore">See all 90 on the 3D Earth</ButtonLink><ButtonLink to="/atlas" icon="arrow">Product Atlas (2D)</ButtonLink></div>
      </PageHero>
      <Container wide className="py-10">
        {/* categories as colour-coded chips (the colours of the 3D Earth and the Atlas), with counts */}
        <div role="group" aria-label="Category" className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0" data-testid="research-categories">
          {["All", ...cats].map((c) => (
            <button key={c} type="button" aria-pressed={cat === c} onClick={() => set("category", c)}
              className={cx("inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm transition-colors", cat === c ? "border-green bg-green/10 text-ink" : "border-line text-muted hover:border-green/50 hover:text-ink")}>
              {c !== "All" && <span aria-hidden className="size-2 rounded-full" style={{ background: CAT_COLOR[c] ?? "#A1ADA7" }} />}
              {c === "All" ? "All categories" : c}<span className="text-xs text-dim">{c === "All" ? corpus.counts.written : corpus.categories[c]}</span>
            </button>
          ))}
        </div>
        <div className="mb-6 grid gap-3 md:grid-cols-3 xl:grid-cols-[1.4fr_1fr_1fr]">
          <label><span className="sr-only">Search studies</span><input type="search" value={q} onChange={(e) => set("q", e.target.value)} placeholder="Search company, title or summary" className="field" /></label>
          <label><span className="sr-only">Evidence level</span><select value={lvl} onChange={(e) => set("evidence", e.target.value)} className="field">{["All", ...LEVELS].map((c) => <option key={c} value={c}>{c === "All" ? "All evidence levels" : c}</option>)}</select></label>
          <label><span className="sr-only">Date range</span><select value={range} onChange={(e) => set("range", e.target.value)} className="field">{RANGES.map(([l], i) => <option key={l} value={i}>{l}</option>)}</select></label>
        </div>
        <p className="mb-4 flex flex-wrap items-center gap-3"><span role="status" className="label">{list.length} of {corpus.counts.written} studies{cat !== "All" ? ` · ${cat}` : ""}</span>
          {[...p.keys()].some((k) => k !== "show") && <button type="button" onClick={() => setP(new URLSearchParams(), { replace: true, preventScrollReset: true })} className="text-sm text-muted underline underline-offset-4 hover:text-ink">Clear filters</button>}</p>
        {!list.length ? <Empty title="No studies match"><button type="button" className="mt-2 underline" onClick={() => setP(new URLSearchParams(), { replace: true })}>Clear filters</button></Empty> : (
          <>
            <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {list.slice(0, shownCount).map((s) => (
                <li key={s.day}><Link to={`/research/${s.day}`} data-cursor="open" data-tilt className="card card-link flex h-full flex-col p-5">
                  <span className="flex items-center justify-between gap-2"><span className="font-mono text-sm text-green">DAY {String(s.day).padStart(2, "0")}</span><Pill tone={evidenceTone(s.evidence_level)}>{s.evidence_level}</Pill></span>
                  <span className="mt-2 font-display text-lg font-bold">{s.company}</span>
                  <span className="mt-1 line-clamp-2 text-sm text-muted">{s.title}</span>
                  <span className="mt-3 flex flex-wrap gap-1.5 text-xs text-dim"><span>{s.category} (derived)</span>·<span>{s.words.toLocaleString("en-IN")} words</span>·<span>{s.sources} refs</span></span>
                </Link></li>
              ))}
            </ul>
            {shownCount < list.length && (
              <div className="mt-8 flex justify-center">
                <button type="button" onClick={() => { const n = new URLSearchParams(p); n.set("show", String(shownCount + PAGE)); setP(n, { replace: true, preventScrollReset: true }); }}
                  className={cx("min-h-11 rounded-xl border border-line px-5 hover:border-green/60")}>Show more ({list.length - shownCount} remaining)</button>
              </div>
            )}
          </>
        )}
      </Container>
    </>
  );
}
