import { Link } from "react-router";
import { CinematicImage } from "~/components/CinematicImage";
import { legacy } from "~/content/data";
import { projectBySlug } from "~/content/projects";
import { PageHero, Container, SectionHeader, Pill, Blocks, ButtonLink } from "~/components/ui";
import { AskGaurav } from "~/components/AskGaurav";
import { RoboGuide } from "~/components/RoboGuide";
import { seo } from "~/lib/meta";

export const meta = () => seo("AI Lab", "Responsible AI product work: GharGyaan's safety-first architecture and evaluation, Aaroh's non-diagnostic boundary, Nexus's grounding, and live experiments.", "/ai-lab");

const PRINCIPLES: [string, string][] = [
  ["Guardrails before models", "GharGyaan's deterministic safety screen runs before retrieval and before any AI."],
  ["The model never writes the advice", "In GharGyaan, steps and warnings come from a reviewed knowledge base; the model only frames and maps."],
  ["Refuse before you match", "Ask Gaurav checks for unsupported questions first — the same pattern as a safety screen."],
  ["Humans stay in charge", "Aaroh keeps practitioners in authority; Nexus shows evidence and lets the user decide."],
  ["Disclose the misses", "GharGyaan's held-out rounds found four safety misses before fixes. They are published, not hidden."],
  ["No fake AI", "Where no model is connected — Nexus demo, Ask Gaurav — the interface says so."],
];

export default function AiLab() {
  const g = projectBySlug("ghargyaan")!;
  const flows = g.sections.find((s) => s.key === "flows")!;
  const evals = g.sections.find((s) => s.key === "experimentation")!;
  return (
    <>
      <PageHero backdrop={<CinematicImage id="ai-safety-lab" decorative sizes="52vw" className="h-full" />} eyebrow="AI Lab" title="Responsible AI, demonstrated in builds" intro="Only what the repositories support. None of these systems is in production with users." />
      <Container wide className="grid gap-20 py-12">
        <section aria-labelledby="gg">
          <SectionHeader id="gg" eyebrow="GharGyaan · prototype in demo mode" title="Safety-first architecture" action={<ButtonLink to="/projects/ghargyaan" icon="arrow">Full case study</ButtonLink>} />
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="card p-6"><Blocks blocks={flows.blocks} /></div>
            <div className="card p-6"><h3 className="label mb-4">Evaluation</h3><Blocks blocks={evals.blocks} /></div>
          </div>
        </section>

        <section aria-labelledby="pr">
          <SectionHeader id="pr" eyebrow="Principles" title="Six rules the builds follow" />
          <ol className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{PRINCIPLES.map(([t, d], i) => <li key={t} className="card p-5"><span className="font-mono text-sm text-green">{String(i + 1).padStart(2, "0")}</span><h3 className="mt-1 text-lg font-bold">{t}</h3><p className="mt-1 text-[#C9D2CD]">{d}</p></li>)}</ol>
        </section>

        <section aria-labelledby="other">
          <SectionHeader id="other" eyebrow="Other AI work" title="Boundaries and grounding" />
          <div className="grid gap-4 md:grid-cols-2">
            {(["aaroh", "nexus"] as const).map((s) => { const p = projectBySlug(s)!; return (
              <Link key={s} to={`/projects/${s}`} className="card card-link p-6"><Pill tone={s === "aaroh" ? "amber" : "cyan"}>{p.status}</Pill><h3 className="mt-3 text-xl font-bold">{p.name}</h3><p className="mt-2 text-[#C9D2CD]">{p.oneLine}</p></Link>
            ); })}
          </div>
        </section>

        <section aria-labelledby="exp">
          <SectionHeader id="exp" eyebrow="Experiments" title="AI product experiments" intro="Statuses are as recorded. Concepts have no results." />
          <ul className="grid gap-3 md:grid-cols-2">
            {legacy.experiments.map((e) => (
              <li key={e.id} className="card p-5">
                <div className="flex items-center justify-between gap-2"><span className="font-mono text-sm text-dim">EXP {e.num}</span><Pill tone={e.status === "RUNNING" ? "green" : e.status === "IN PROGRESS" ? "amber" : "dim"}>{e.status}</Pill></div>
                <h3 className="mt-2 text-lg font-bold">{e.name}</h3>
                <p className="mt-1 text-[#C9D2CD]">{e.question}</p>
                <dl className="mt-3 grid gap-2 text-sm"><div><dt className="label">Evidence</dt><dd className="text-muted">{e.evidence}</dd></div><div><dt className="label">Next</dt><dd className="text-muted">{e.next}</dd></div></dl>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="try">
          <SectionHeader id="try" eyebrow="Experiment 001 · running" title="Try Ask Gaurav" intro="A local, deterministic index — the interface of a retrieval pipeline without a model behind it." />
          <div className="grid items-start gap-6 lg:grid-cols-[1fr_200px]"><AskGaurav compact /><RoboGuide className="max-lg:hidden" /></div>
        </section>
      </Container>
    </>
  );
}
