import { useMemo } from "react";
import { CinematicImage } from "~/components/CinematicImage";
import { Link, useSearchParams } from "react-router";
import { corpus } from "~/content/corpus";
import { PageHero, Container, Pill, Empty, evidenceTone, cx } from "~/components/ui";
import { seo } from "~/lib/meta";
import { norm } from "~/lib/text";

export const meta = () => seo("Research", `${corpus.counts.written} product case studies with search, filters and evidence levels, read from the public repository.`, "/research");
const LEVELS = ["VERIFIED", "DOCUMENTED", "SOURCED", "NARRATIVE"];
const RANGES: [string, number, number][] = [["All days", 1, 90], ["Days 1–30", 1, 30], ["Days 31–60", 31, 60], ["Days 61–90", 61, 90]];
const PAGE = 24;

export default function Research() {
  const [p, setP] = useSearchParams();
  const cat = p.get("category") ?? "All", lvl = p.get("evidence") ?? "All", q = p.get("q") ?? "", range = Number(p.get("range") ?? 0), shownCount = Number(p.get("show") ?? PAGE);
  const set = (k: string, v: string) => { const n = new URLSearchParams(p); v && v !== "All" && v !== "0" ? n.set(k, v) : n.delete(k); n.delete("show"); setP(n, { replace: true, preventScrollReset: true }); };
  const cats = Object.keys(corpus.categories);
  const [, from, to] = RANGES[range] ?? RANGES[0];
  const list = useMemo(() => corpus.studies.filter((s) => (cat === "All" || s.category === cat) && (lvl === "All" || s.evidence_level === lvl) && s.day >= from && s.day <= to &&
    (!q || norm(`${s.company} ${s.title} ${s.summary}`).includes(norm(q)))), [cat, lvl, q, from, to]);
  return (
    <>
      <PageHero backdrop={<CinematicImage id="research-analytics" decorative sizes="52vw" className="h-full" />} eyebrow="Research library" title={`${corpus.counts.written} product case studies`}
        intro={<>Read from <a href={corpus.repo} target="_blank" rel="noopener noreferrer" className="text-green underline underline-offset-4">the public repository</a> by a build step — never retyped. Audited {corpus.audited}. Category is derived by rule; the evidence level counts what a study carries, not its quality.</>} />
      <Container wide className="py-10">
        <div className="mb-6 grid gap-3 md:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <label><span className="sr-only">Search studies</span><input type="search" value={q} onChange={(e) => set("q", e.target.value)} placeholder="Search company, title or summary" className="field" /></label>
          <label><span className="sr-only">Category</span><select value={cat} onChange={(e) => set("category", e.target.value)} className="field">{["All", ...cats].map((c) => <option key={c} value={c}>{c === "All" ? "All categories (derived)" : c}</option>)}</select></label>
          <label><span className="sr-only">Evidence level</span><select value={lvl} onChange={(e) => set("evidence", e.target.value)} className="field">{["All", ...LEVELS].map((c) => <option key={c} value={c}>{c === "All" ? "All evidence levels" : c}</option>)}</select></label>
          <label><span className="sr-only">Date range</span><select value={range} onChange={(e) => set("range", e.target.value)} className="field">{RANGES.map(([l], i) => <option key={l} value={i}>{l}</option>)}</select></label>
        </div>
        <p role="status" className="label mb-4">{list.length} of {corpus.counts.written} studies</p>
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
