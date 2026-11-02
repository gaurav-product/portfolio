import { Link } from "react-router";
import { profile } from "~/content/profile";
import { education, certifications, writing, tools } from "~/content/experience";
import { legacy } from "~/content/data";
import { PageHero, Container, SectionHeader, Pill, ButtonLink } from "~/components/ui";
import { seo, asset } from "~/lib/meta";

export const meta = () => seo("About", `About ${profile.name}: background, education, certifications and how evidence is labelled on this site.`, "/about");

const LEVELS: [string, string, string][] = [
  ["VERIFIED", "green", "Checked against a primary artefact — a public repository or the corpus."],
  ["CV", "cyan", "Stated in the CV; the underlying artefact (e.g. employer data) is not public."],
  ["CASE DATA", "violet", "Supplied by a course. Not production data."],
  ["DESIGNED, NOT RUN", "violet", "An experiment with a design and no result."],
  ["SELF-REPORTED", "amber", "Owner-stated with no public artefact."],
  ["NOT DOCUMENTED", "dim", "No evidence exists. Said plainly rather than filled in."],
];

export default function About() {
  return (
    <>
      <PageHero eyebrow="About" title="Behavioural research first. Product second. AI where it earns its place."
        intro={profile.summary}>
        <div className="flex flex-wrap gap-3">
          <ButtonLink to="/experience" variant="primary" icon="experience">Experience</ButtonLink>
          <ButtonLink to={asset(profile.cvFile)} download="Gaurav-Kumar-Singh-CV.pdf" icon="download">Download CV</ButtonLink>
          <ButtonLink to="/contact" variant="ghost" icon="mail">Contact</ButtonLink>
        </div>
      </PageHero>
      <Container className="grid gap-16 py-16">
        <section aria-labelledby="question">
          <SectionHeader id="question" eyebrow="The question behind the work" title={legacy.product_question.text} intro={legacy.product_question.note} />
        </section>

        <section aria-labelledby="roles">
          <SectionHeader id="roles" eyebrow="Open to" title="Roles" intro="Positioning, not a claim of seniority. Role fit follows the evidence on this site." />
          <ul className="flex flex-wrap gap-2">{profile.roles.map((r) => <li key={r}><Pill tone="green">{r}</Pill></li>)}</ul>
        </section>

        <section aria-labelledby="education" id="education">
          <SectionHeader id="education-h" eyebrow="Education" title="Education" />
          <ol className="grid gap-3">
            {education.map((e) => (
              <li key={e.id} className="card grid gap-1 p-5 sm:grid-cols-[180px_1fr]">
                <span className="label pt-1">{e.period}</span>
                <span><span className="font-medium">{e.what}</span> — <span className="text-muted">{e.org}</span>{"note" in e && e.note && <span className="mt-1 block text-sm text-dim">{e.note}</span>}</span>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="certifications" id="certifications">
          <SectionHeader id="certifications-h" eyebrow="Certifications" title="Certifications and learning" />
          <div className="grid gap-4 md:grid-cols-2">
            {certifications.map((c) => (
              <div key={c.issuer} className="card p-5"><p className="label mb-3">{c.issuer}</p><ul className="grid gap-1.5">{c.items.map((i) => <li key={i} className="text-[#C9D2CD]">{i}</li>)}</ul></div>
            ))}
          </div>
        </section>

        <section aria-labelledby="writing-h">
          <SectionHeader id="writing-h" eyebrow="Writing" title="Writing and research" />
          <ul className="grid gap-3 md:grid-cols-2">
            {writing.map((w) => (
              <li key={w.title} className="card p-5">
                <div className="flex flex-wrap items-center justify-between gap-2"><span className="font-medium">{w.title}</span><Pill tone={w.status === "VERIFIED" ? "green" : "amber"}>{w.status}</Pill></div>
                <p className="mt-1 text-sm text-muted">{w.detail}</p>
                {w.href.startsWith("http") ? <a href={w.href} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm text-green underline underline-offset-4">Open on LinkedIn</a>
                  : <Link to={w.href} className="mt-3 inline-block text-sm text-green underline underline-offset-4">Open the library</Link>}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="tools-h">
          <SectionHeader id="tools-h" eyebrow="Skills & tools" title="From the CV" action={<ButtonLink to="/skills" icon="arrow">Skills library with evidence</ButtonLink>} />
          <div className="grid gap-4 md:grid-cols-2">
            {Object.entries(tools).map(([g, items]) => (
              <div key={g} className="card p-5"><p className="label mb-3">{g}</p><ul className="flex flex-wrap gap-1.5">{items.map((i) => <li key={i} className="rounded-md bg-raise px-2 py-0.5 text-sm text-[#C9D2CD]">{i}</li>)}</ul></div>
            ))}
          </div>
        </section>

        <section aria-labelledby="evidence" id="evidence">
          <SectionHeader id="evidence-h" eyebrow="Evidence system" title="How claims are labelled" intro="The site makes unsupported claims hard to state. Every highlight carries one of these labels." />
          <dl className="grid gap-3 md:grid-cols-2">
            {LEVELS.map(([k, tone, d]) => (
              <div key={k} className="card flex flex-col gap-2 p-5"><dt><Pill tone={tone as "green"}>{k}</Pill></dt><dd className="text-[#C9D2CD]">{d}</dd></div>
            ))}
          </dl>
        </section>
      </Container>
    </>
  );
}
