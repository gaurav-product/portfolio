import { Link } from "react-router";
import { ventures, VENTURES_NOTE } from "~/content/ventures";
import { PageHero, Container, Pill, ButtonLink } from "~/components/ui";
import { seo } from "~/lib/meta";

export const meta = () => seo("Emerging Ventures", "Two early-stage product concepts in development: Interview Radar (HRTech) and Repass (recommerce). Not built, launched or validated.", "/ventures");

/** Concepts in development — kept apart from built projects and case studies. */
export default function Ventures() {
  return (
    <>
      <PageHero eyebrow="Emerging Ventures · concepts in development" title="The next chapter"
        intro={<>Two startup concepts I am developing. {VENTURES_NOTE}</>} />
      <Container>
        <ul className="grid gap-6 pb-20 pt-12 md:grid-cols-2">
          {ventures.map((v) => (
            <li key={v.slug} className="card flex flex-col p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2"><Pill tone="amber">{v.status}</Pill><span className="text-sm text-dim">{v.category}</span></div>
              <h2 className="mt-4 text-3xl font-bold"><Link to={`/ventures/${v.slug}`} className="hover:text-green">{v.name}</Link></h2>
              <p className="mt-3 text-lg text-[#D7DEDA]">“{v.vision}”</p>
              <p className="mt-3 text-muted">{v.solution}</p>
              <div className="mt-auto flex flex-wrap gap-3 pt-6">
                <ButtonLink to={`/ventures/${v.slug}`} variant="primary" icon="arrow" aria-label={`Read the concept: ${v.name}`}>Read the concept</ButtonLink>
                <ButtonLink to={`/ventures/${v.slug}/world`} icon="explore" aria-label={`Visit in 3D: ${v.name}`}>Visit in 3D</ButtonLink>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
