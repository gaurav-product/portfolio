import { Link, useParams } from "react-router";
import { capabilities } from "~/content/capabilities";
import { projects } from "~/content/projects";
import { experience } from "~/content/experience";
import { corpusSummary } from "~/content/data";
import { Container, Pill } from "~/components/ui";
import { Icon } from "~/components/Icon";
import { seo } from "~/lib/meta";
import { statusPillTone } from "./skills";
import type { Route } from "./+types/skill-detail";

export const meta = ({ params }: Route.MetaArgs) => {
  const c = capabilities.find((x) => x.id === params.id);
  return c ? seo(`${c.name} — skill`, `${c.name}: ${c.definition} Evidence: ${c.status}.`, `/skills/${c.id}`) : seo("Not found", "Skill not found", "/skills");
};

function resolve(ref: string) {
  const [kind, id] = ref.split(":");
  if (kind === "project") { const p = projects.find((x) => x.slug === id); return p && { label: p.name, kind: p.kindLabel, to: `/projects/${id}` }; }
  if (kind === "role") { const r = experience.find((x) => x.id === id); return r && { label: `${r.role} — ${r.employer}`, kind: "Employment", to: `/experience/${id}` }; }
  const st = corpusSummary.stages.find((s) => s.id === id) ?? corpusSummary.capabilities.find((s) => s.id === id);
  return { label: `90-day case studies${st ? ` — ${st.count} of ${corpusSummary.counts.directories} studies` : ""}`, kind: "Case-study corpus", to: "/research" };
}

export default function SkillDetail() {
  const { id } = useParams();
  const c = capabilities.find((x) => x.id === id);
  if (!c) throw new Response("Not found", { status: 404 });
  const related = capabilities.filter((x) => x.category === c.category && x.id !== c.id).slice(0, 8);
  const usedBy = projects.filter((p) => p.skills.includes(c.id));
  return (
    <Container className="py-12">
      <Link to="/skills" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink"><Icon name="back" size={16} />Skills library</Link>
      <header className="mt-6"><p className="label">{c.category}</p><h1 className="mt-2 text-4xl font-bold sm:text-5xl">{c.name}</h1><div className="mt-4"><Pill tone={statusPillTone(c.status)}>{c.status}</Pill></div></header>
      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_300px]">
        <div className="grid content-start gap-8">
          <section><h2 className="label mb-2">Definition</h2><p className="text-lg text-[#D7DEDA]">{c.definition}</p></section>
          <section><h2 className="label mb-2">Why it matters</h2><p className="text-[#C9D2CD]">{c.why}</p></section>
          <section aria-labelledby="ev">
            <h2 id="ev" className="label mb-3">Evidence and examples</h2>
            {c.evidence.length ? (
              <ul className="grid gap-3">
                {c.evidence.map((e) => { const r = resolve(e.ref); return r && (
                  <li key={e.ref + e.note} className="card p-4"><p className="text-[#C9D2CD]">{e.note}</p>
                    <Link to={r.to} className="mt-2 inline-flex items-center gap-1.5 text-sm text-green">{r.label} <span className="text-dim">· {r.kind}</span><Icon name="arrow" size={14} /></Link></li>); })}
              </ul>
            ) : <p className="card p-4 text-muted">No evidence in this portfolio yet. It is listed so the library is complete, not as a claim.</p>}
          </section>
          {c.limitation && <section><h2 className="label mb-2 !text-amber">Limitation</h2><p className="text-[#C9D2CD]">{c.limitation}</p></section>}
        </div>
        <aside className="grid content-start gap-6">
          {usedBy.length > 0 && <div className="card p-5"><h2 className="label mb-3">Shown in</h2><ul className="grid gap-2">{usedBy.map((p) => <li key={p.slug}><Link to={`/projects/${p.slug}`} className="text-green underline underline-offset-4">{p.name}</Link></li>)}</ul></div>}
          <div className="card p-5"><h2 className="label mb-3">Related in {c.category}</h2><ul className="grid gap-1.5 text-sm">{related.map((r) => <li key={r.id}><Link to={`/skills/${r.id}`} className="text-muted hover:text-ink">{r.name}</Link></li>)}</ul></div>
        </aside>
      </div>
    </Container>
  );
}
