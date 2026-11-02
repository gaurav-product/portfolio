import { Link } from "react-router";
import { experience } from "~/content/experience";
import { projects } from "~/content/projects";
import { PageHero, Container, Pill } from "~/components/ui";
import { Icon } from "~/components/Icon";
import { seo } from "~/lib/meta";

export const meta = () => seo("Experience", "Professional experience: Associate Product Manager and PM Intern at Adhyatm Sadhna Kendra; Research Expert at Live Your Best Life (USA).", "/experience");

export default function Experience() {
  return (
    <>
      <PageHero eyebrow="Experience" title="Professional experience" intro="Employment only. Independent builds and the academic capstone are in Projects and are never presented as jobs." />
      <Container className="py-16">
        <ol className="relative grid gap-6 border-l border-line pl-6 sm:pl-10">
          {experience.map((r) => (
            <li key={r.id} className="relative">
              <span className="absolute -left-[31px] top-7 size-3 rounded-full bg-green ring-4 ring-bg sm:-left-[47px]" aria-hidden />
              <article className="card p-6">
                <div className="flex flex-wrap items-center gap-2"><span className="label">{r.period}</span><Pill tone="green">{r.type}</Pill></div>
                <h2 className="mt-3 text-2xl font-bold"><Link to={`/experience/${r.id}`} className="hover:text-green">{r.role}</Link></h2>
                <p className="text-muted">{r.employer} · {r.location}</p>
                <p className="mt-3 text-[#C9D2CD]">{r.scope}</p>
                <ul className="mt-4 flex flex-wrap gap-2">{r.outcomes.map((o) => <li key={o.label}><Pill tone="cyan">{o.value} · {o.label}</Pill></li>)}</ul>
                <div className="mt-5 flex flex-wrap items-center gap-4">
                  <Link to={`/experience/${r.id}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-green">Role details <Icon name="arrow" size={16} /></Link>
                  {r.related.map((s) => <Link key={s} to={`/projects/${s}`} className="text-sm text-muted underline underline-offset-4 hover:text-ink">{projects.find((p) => p.slug === s)?.name} case study</Link>)}
                </div>
              </article>
            </li>
          ))}
        </ol>
      </Container>
    </>
  );
}
