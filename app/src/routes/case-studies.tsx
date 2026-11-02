import { Link } from "react-router";
import { projects } from "~/content/projects";
import type { CaseSectionKey } from "~/content/types";
import { PageHero, Container, Pill, statusTone } from "~/components/ui";
import { Icon } from "~/components/Icon";
import { seo } from "~/lib/meta";

export const meta = () => seo("Case Studies", "In-depth case studies with a consistent template — showing only the sections each project has evidence for.", "/case-studies");

const TEMPLATE: [CaseSectionKey, string][] = [
  ["summary", "Executive summary"], ["metadata", "Metadata"], ["problem", "Problem"], ["why", "Why it matters"], ["segments", "User segments"],
  ["methodology", "Research methodology"], ["insights", "Insights"], ["jtbd", "Jobs to Be Done"], ["opportunity", "Opportunity"], ["competition", "Competition"],
  ["vision", "Vision"], ["strategy", "Strategy"], ["mvp", "MVP scope"], ["prioritization", "Prioritization"], ["journey", "User journey"], ["ia", "Information architecture"],
  ["flows", "Product flows"], ["prototype", "Prototype"], ["prd", "PRD"], ["execution", "Execution"], ["experimentation", "Experimentation"], ["analytics", "Analytics"],
  ["results", "Results"], ["tradeoffs", "Trade-offs"], ["risks", "Risks"], ["learnings", "Learnings"], ["next", "Next steps"], ["evidence", "Evidence"],
];

export default function CaseStudies() {
  const list = projects.filter((p) => p.sections.length >= 5);
  return (
    <>
      <PageHero eyebrow="Case studies" title="One template. Only the evidence-backed parts."
        intro="Every case study follows the same 28-part structure. The grid below shows which parts each one actually has — gaps are left as gaps rather than filled with narrative." />
      <Container wide className="grid gap-6 py-12">
        {list.map((p) => {
          const have = new Set<string>(p.sections.map((s) => s.key));
          return (
            <article key={p.slug} className="card grid gap-6 p-6 lg:grid-cols-[320px_1fr]">
              <div>
                <div className="flex flex-wrap gap-2"><Pill tone={statusTone(p.status)}>{p.status}</Pill></div>
                <h2 className="mt-3 text-2xl font-bold"><Link to={`/projects/${p.slug}`} className="hover:text-green">{p.name}</Link></h2>
                <p className="text-sm text-muted">{p.kindLabel} · {p.period}</p>
                <p className="mt-3 text-[15px] text-[#C9D2CD]">{p.oneLine}</p>
                <Link to={`/projects/${p.slug}`} className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-green">Read the case study <Icon name="arrow" size={16} /></Link>
              </div>
              <div>
                <p className="label mb-3">{have.size} of {TEMPLATE.length} template parts evidenced</p>
                <ul className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 xl:grid-cols-7" aria-label={`Template coverage for ${p.name}`}>
                  {TEMPLATE.map(([k, label]) => {
                    const ok = have.has(k);
                    return <li key={k} className={ok ? "rounded-md border border-green/40 bg-green/10 px-2 py-1 text-xs text-green" : "rounded-md border border-line-soft px-2 py-1 text-xs text-dim"}>
                      {ok ? <Link to={`/projects/${p.slug}#${k}`} className="hover:underline">{label}</Link> : <span><span className="sr-only">Not evidenced: </span>{label}</span>}
                    </li>;
                  })}
                </ul>
              </div>
            </article>
          );
        })}
      </Container>
    </>
  );
}
