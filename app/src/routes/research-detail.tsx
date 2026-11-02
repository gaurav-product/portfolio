import { Link, useParams } from "react-router";
import { corpus, studyByDay } from "~/content/corpus";
import { projects } from "~/content/projects";
import { Container, Pill, evidenceTone, ButtonLink } from "~/components/ui";
import { Icon } from "~/components/Icon";
import { seo } from "~/lib/meta";
import type { Route } from "./+types/research-detail";

export const meta = ({ params }: Route.MetaArgs) => {
  const s = studyByDay(Number(params.day));
  return s ? seo(`Day ${s.day} — ${s.company}`, s.summary.slice(0, 155), `/research/${s.day}`) : seo("Not found", "Study not found", "/research");
};

export default function Study() {
  const { day } = useParams();
  const s = studyByDay(Number(day));
  if (!s) throw new Response("Not found", { status: 404 });
  const i = corpus.studies.indexOf(s);
  const prev = corpus.studies[i - 1], next = corpus.studies[i + 1];
  const facts: [string, string][] = [
    ["Category", `${s.category} (derived by rule)`], ["Industry", s.industry ?? "NOT DOCUMENTED"], ["Words", s.words.toLocaleString("en-IN")],
    ["References", String(s.sources)], ["Evidence score", `${s.evidence_score} / 8`], ["ASSUMPTIONS file", s.has_assumptions ? "Yes" : "No"],
    ["PRD-style spec", s.has_prd ? "Yes" : "No"], ["Experiment design", s.has_experiment ? "Yes" : "No"], ["Programmatic checks", s.checks != null ? String(s.checks) : "None stated"],
  ];
  const related = projects.filter((p) => p.categories.some((c) => c.toLowerCase() === s.category.toLowerCase())).slice(0, 3);
  return (
    <Container className="py-12">
      <Link to="/research" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink"><Icon name="back" size={16} />Research library</Link>
      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-2"><span className="font-mono text-green">DAY {String(s.day).padStart(2, "0")}</span><Pill tone={evidenceTone(s.evidence_level)}>{s.evidence_level}</Pill>{s.flags.map((f) => <Pill key={f}>{f}</Pill>)}</div>
        <h1 className="mt-3 text-4xl font-bold">{s.company}</h1>
        <p className="mt-2 text-xl text-muted">{s.title}</p>
      </header>
      <section aria-labelledby="sum" className="mt-8 max-w-3xl">
        <h2 id="sum" className="label mb-2">Summary — from the study</h2>
        <p className="text-lg text-[#D7DEDA]">{s.summary}</p>
        {s.internal_day && s.internal_day !== s.day && <p className="mt-3 text-sm text-amber">This study numbers itself Day {s.internal_day}. Directory order is canonical, so it is listed as Day {s.day}.</p>}
      </section>
      <dl className="mt-8 grid gap-3 sm:grid-cols-3">{facts.map(([k, v]) => <div key={k} className="card p-4"><dt className="label">{k}</dt><dd className="mt-1">{v}</dd></div>)}</dl>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink to={s.readme_url} external variant="primary" icon="research">Read the full study on GitHub</ButtonLink>
        {s.assumptions_url && <ButtonLink to={s.assumptions_url} external>ASSUMPTIONS file</ButtonLink>}
        <ButtonLink to={s.github_url} external variant="ghost">Directory</ButtonLink>
      </div>
      <p className="mt-3 text-sm text-dim">The full text and its citations live in the repository; this page shows the generated record so counts never drift.</p>
      {related.length > 0 && <section className="mt-10"><h2 className="label mb-3">Related projects</h2><ul className="flex flex-wrap gap-2">{related.map((p) => <li key={p.slug}><Link to={`/projects/${p.slug}`} className="inline-block rounded-lg border border-line px-3 py-1.5 text-sm hover:border-green/60">{p.name}</Link></li>)}</ul></section>}
      <nav aria-label="Adjacent studies" className="mt-12 flex flex-wrap justify-between gap-3 border-t border-line pt-6">
        {prev ? <ButtonLink to={`/research/${prev.day}`} icon="left">Day {prev.day} · {prev.company}</ButtonLink> : <span />}
        {next && <ButtonLink to={`/research/${next.day}`}>Day {next.day} · {next.company} <Icon name="right" /></ButtonLink>}
      </nav>
    </Container>
  );
}
