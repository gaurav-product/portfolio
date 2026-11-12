import { heroArt } from "~/components/CinematicImage";
import { Link } from "react-router";
import { useHydratedSearchParams } from "~/lib/useHydratedSearchParams";
import { useMemo } from "react";
import { search } from "~/lib/search";
import { PageHero, Container, Empty } from "~/components/ui";
import { Highlighted, SUGGESTIONS } from "~/components/Search";
import { seo } from "~/lib/meta";

export const meta = () => seo("Search", "Search projects, case studies, experience, skills, research and lab notes.", "/search");

export default function SearchPage() {
  const [params, setParams] = useHydratedSearchParams();
  const q = params.get("q") ?? "";
  const hits = useMemo(() => search(q, 200), [q]);
  const set = (v: string) => setParams(v ? { q: v } : {}, { replace: true });
  return (
    <>
      <PageHero {...heroArt("render-search")} eyebrow="Search" title="Search everything">
        <form role="search" onSubmit={(e) => e.preventDefault()} className="flex max-w-2xl gap-2">
          <label htmlFor="sq" className="sr-only">Search query</label>
          <input id="sq" type="search" value={q} onChange={(e) => set(e.target.value)} placeholder="Projects, skills, companies, notes…" className="field h-12 text-[17px]" autoFocus />
          {q && <button type="button" onClick={() => set("")} className="rounded-xl border border-line px-4 text-muted hover:text-ink">Clear</button>}
        </form>
      </PageHero>
      <Container className="py-10">
        {!q && <div className="flex flex-wrap gap-2"><span className="label mr-2 self-center">Try</span>{SUGGESTIONS.map((s) => <button key={s} type="button" onClick={() => set(s)} className="rounded-full border border-line px-3 py-1 text-sm text-muted hover:text-ink">{s}</button>)}</div>}
        {q && <p role="status" className="label mb-4">{hits.length} result{hits.length === 1 ? "" : "s"} for “{q}”</p>}
        {q && !hits.length && <Empty title="No results">Try a project name, a capability such as “RICE”, or a company from the case studies.</Empty>}
        <ul className="grid gap-2">
          {hits.map((h) => (
            <li key={h.id}><Link to={h.to} className="card card-link flex gap-4 p-4">
              <span className="label w-24 shrink-0 pt-0.5 !text-green">{h.type}</span>
              <span className="min-w-0"><span className="block font-medium"><Highlighted text={h.title} query={q} /></span><span className="block text-sm text-dim"><Highlighted text={h.snippet} query={q} /></span></span>
            </Link></li>
          ))}
        </ul>
      </Container>
    </>
  );
}
