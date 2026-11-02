import { Link, useParams } from "react-router";
import { experience } from "~/content/experience";
import { projects } from "~/content/projects";
import { Container, Pill, SourceLinks, ButtonLink } from "~/components/ui";
import { ProjectCard } from "~/components/cards";
import { Icon } from "~/components/Icon";
import { seo } from "~/lib/meta";
import type { Route } from "./+types/experience-detail";

export const meta = ({ params }: Route.MetaArgs) => {
  const r = experience.find((x) => x.id === params.id);
  return r ? seo(`${r.role} — ${r.employer}`, r.scope, `/experience/${r.id}`) : seo("Not found", "Role not found", "/experience");
};

export default function RoleDetail() {
  const { id } = useParams();
  const i = experience.findIndex((x) => x.id === id);
  const r = experience[i];
  if (!r) throw new Response("Not found", { status: 404 });
  const prev = experience[i - 1], next = experience[i + 1];
  return (
    <Container className="py-12">
      <Link to="/experience" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink"><Icon name="back" size={16} />All experience</Link>
      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-2"><span className="label">{r.period}</span><Pill tone="green">{r.type}</Pill><Pill>Employment</Pill></div>
        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">{r.role}</h1>
        <p className="mt-2 text-xl text-muted">{r.employer} · {r.location}</p>
      </header>
      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
        <div className="grid gap-10">
          <section aria-labelledby="scope"><h2 id="scope" className="label mb-3">Scope</h2><p className="text-lg text-[#C9D2CD]">{r.scope}</p></section>
          <section aria-labelledby="work"><h2 id="work" className="label mb-3">Key work</h2>
            <div className="prose-os"><ul>{r.work.map((w) => <li key={w}>{w}</li>)}</ul></div></section>
          <section aria-labelledby="outcomes"><h2 id="outcomes" className="label mb-3">Evidence-supported outcomes</h2>
            <ul className="grid gap-3 sm:grid-cols-2">{r.outcomes.map((o) => <li key={o.label} className="card p-4"><p className="font-display text-2xl font-bold">{o.value}</p><p className="text-sm text-muted">{o.label}</p></li>)}</ul>
            <SourceLinks ids={r.sources} className="mt-4" />
          </section>
        </div>
        <aside className="grid content-start gap-6">
          <div className="card p-5"><h2 className="label mb-3">Tools and methods</h2><ul className="flex flex-wrap gap-1.5">{r.tools.map((t) => <li key={t} className="rounded-md bg-raise px-2 py-0.5 text-sm">{t}</li>)}</ul></div>
          {r.related.length > 0 && <div><h2 className="label mb-3">Related project</h2>{r.related.map((s) => { const p = projects.find((x) => x.slug === s); return p ? <ProjectCard key={s} p={p} compact /> : null; })}</div>}
        </aside>
      </div>
      <nav aria-label="Other roles" className="mt-14 flex flex-wrap justify-between gap-3 border-t border-line pt-6">
        {prev ? <ButtonLink to={`/experience/${prev.id}`} icon="left">{prev.role}</ButtonLink> : <span />}
        {next && <ButtonLink to={`/experience/${next.id}`}>{next.role} <Icon name="right" /></ButtonLink>}
      </nav>
    </Container>
  );
}
