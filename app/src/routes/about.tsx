import { Link } from "react-router";
import { profile } from "~/content/profile";
import { education, certificationGroups, certificationCount, writing, tools } from "~/content/experience";
import { NewsletterFeature } from "~/components/Newsletter";
import { newsletter } from "~/content/newsletter";
import { EARTH_CREDIT } from "~/content/universe";
import { legacy } from "~/content/data";
import { PageHero, Container, SectionHeader, Pill, ButtonLink, cx } from "~/components/ui";
import { seo, asset } from "~/lib/meta";
import { OperatingLoop } from "~/components/OperatingLoop";
import { CinematicImage, heroArt } from "~/components/CinematicImage";

export const meta = () => seo("About", `About ${profile.name}: background, education, certifications and how evidence is labelled on this site.`, "/about");

const LEVELS: [string, string, string][] = [
  ["VERIFIED", "green", "Checked against a primary artefact — a public repository or the corpus."],
  ["CV", "cyan", "Stated in the CV; the underlying artefact (e.g. employer data) is not public."],
  ["CASE DATA", "violet", "Supplied by a course. Not production data."],
  ["DESIGNED, NOT RUN", "violet", "An experiment with a design and no result."],
  ["SELF-REPORTED", "amber", "Owner-stated with no public artefact."],
  ["NOT DOCUMENTED", "dim", "No evidence exists. Said plainly rather than filled in."],
];


const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
/** "Aug 2026" → a sortable number; undated items sort last */
const monthIdx = (d?: string) => { if (!d) return -1; const [m, y] = d.split(" "); return Number(y) * 12 + MONTHS.indexOf(m); };

/** One line above the issuer cards: how many, from how many issuers, over which months (all from the supplied data). */
function CertSummary() {
  const all = certificationGroups.flatMap((g) => g.items);
  const dated = all.filter((i) => i.date).sort((a, b) => monthIdx(a.date) - monthIdx(b.date));
  return (
    <ul className="mb-5 flex flex-wrap gap-2 text-sm" data-testid="cert-summary">
      <li className="rounded-full border border-line px-3 py-1"><b className="font-semibold text-ink">{all.length}</b> <span className="text-muted">certificates</span></li>
      <li className="rounded-full border border-line px-3 py-1"><b className="font-semibold text-ink">{certificationGroups.length}</b> <span className="text-muted">issuers</span></li>
      {dated.length > 0 && <li className="rounded-full border border-line px-3 py-1 text-muted">{dated[0].date} – {dated[dated.length - 1].date}</li>}
      <li className="rounded-full border border-dashed border-line px-3 py-1 text-dim">{all.length - dated.length} without a stated date</li>
    </ul>
  );
}

export default function About() {
  return (
    <>
      <PageHero {...heroArt("render-about")} eyebrow="About" title="Behavioural research first. Product second. AI where it earns its place."
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

        <section aria-labelledby="how-i-think-h" id="how-i-think">
          <SectionHeader id="how-i-think-h" eyebrow="How I think" title="Observe → frame → research → hypothesize → build → measure → learn → iterate."
            intro="The loop I run on every problem. Select a stage to see where it shows up in real work on this site." />
          <OperatingLoop idPrefix="about-loop" figure={<CinematicImage id="how-i-think" tag sizes="(min-width: 1024px) 460px, 100vw" className="mb-4 overflow-hidden rounded-xl border border-line" />} />
        </section>

        <section aria-labelledby="roles">
          <SectionHeader id="roles" eyebrow="Open to" title="Roles" intro="Positioning, not a claim of seniority. Role fit follows the evidence on this site." />
          <ul className="flex flex-wrap gap-2">{profile.roles.map((r) => <li key={r}><Pill tone="green">{r}</Pill></li>)}</ul>
        </section>

        {/* Education, certifications and professional learning — three kinds, kept apart. Only owner-supplied
            facts: no credential IDs or verification links are shown, because none have been supplied. */}
        <section aria-labelledby="education-h" id="education">
          <SectionHeader id="education-h" eyebrow="Education" title="Degrees" />
          <ol className="relative grid gap-6 border-l border-line-soft pl-6 sm:ml-2">
            {education.filter((e) => e.kind === "Degree").map((e) => (
              <li key={e.id} className="relative" data-testid="degree">
                <span aria-hidden className="absolute -left-[31px] top-1.5 size-3 rounded-full border-2 border-green bg-bg" />
                <p className="font-mono text-xs uppercase tracking-[.14em] text-dim">{e.period}</p>
                <p className="mt-1 font-display text-xl font-bold">{e.what}</p>
                <p className="text-muted">{e.org}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="certifications-h" id="certifications">
          <SectionHeader id="certifications-h" eyebrow="Certifications" title="Certificates, by issuer"
            intro={`${certificationCount} certificates, with issuer and issue date as stated. Where no date was supplied, none is shown.`} />
          <CertSummary />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {certificationGroups.map((c) => {
              const items = [...c.items].sort((a, b) => monthIdx(b.date) - monthIdx(a.date));
              const dated = items.filter((i) => i.date).map((i) => i.date!);
              const span = dated.length ? (dated[0] === dated[dated.length - 1] ? dated[0] : `${dated[dated.length - 1]} – ${dated[0]}`) : "Dates not stated";
              return (
                <article key={c.issuer} className="card flex flex-col overflow-hidden" data-testid="cert-group">
                  <header className="flex items-center gap-3 border-b border-line-soft bg-raise/40 px-5 py-4">
                    {c.logo
                      ? <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white p-1.5"><img src={asset(c.logo)} alt="" width={28} height={28} className="size-7" /></span>
                      : <span aria-hidden className="grid size-11 shrink-0 place-items-center rounded-xl border border-line font-display text-sm font-bold text-green">{c.issuer.split(/\s+/).map((w) => w[0]).join("").slice(0, 3)}</span>}
                    <div className="min-w-0">
                      <h3 className="font-display text-lg font-bold leading-tight">{c.issuer}</h3>
                      <p className="font-mono text-[11px] uppercase tracking-[.12em] text-dim">{c.items.length} {c.items.length === 1 ? "certificate" : "certificates"} · {span}</p>
                    </div>
                  </header>
                  <ul className="grid flex-1 content-start gap-0 px-5 py-2">
                    {items.map((i) => (
                      <li key={i.title} className="grid grid-cols-[1fr_auto] items-start gap-3 border-t border-line-soft py-3 first:border-0">
                        <span className="text-[15px] leading-snug text-[#D7DEDA]">{i.url ? <a href={i.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-ink">{i.title}</a> : i.title}</span>
                        <span className={cx("mt-0.5 whitespace-nowrap rounded-full border px-2 py-0.5 font-mono text-[11px]", i.date ? "border-line text-muted" : "border-dashed border-line text-dim")}>{i.date ?? "Date not stated"}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-dim">Titles, issuers and dates as supplied by Gaurav. Verification links will be added when supplied — none is shown or implied until then. Logos are trademarks of their owners, shown only to identify the issuer.</p>
        </section>

        <section aria-labelledby="learning-h" id="learning">
          <SectionHeader id="learning-h" eyebrow="Professional learning" title="Structured programmes" />
          <ul className="grid gap-3 md:grid-cols-2">
            {education.filter((e) => e.kind !== "Degree").map((e) => (
              <li key={e.id} className="card p-5" data-testid="programme">
                <p className="font-mono text-xs uppercase tracking-[.14em] text-dim">{e.period} · {e.kind}</p>
                <p className="mt-1 font-display text-lg font-bold">{e.what}</p>
                <p className="text-muted">{e.org}</p>
                {"note" in e && e.note && <p className="mt-2 text-sm text-dim">{e.note}</p>}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="writing-h">
          <SectionHeader id="writing-h" eyebrow="Writing" title="Writing and research" />
          <div className="mb-6"><NewsletterFeature headingLevel={3} /></div>
          <p className="mb-6"><ButtonLink to="/writing/the-teardown" icon="explore">See it in 3D</ButtonLink> <span className="ml-2 text-sm text-dim">The Teardown's workshop: the brand artwork and the newsletter, in a small 3D scene.</span></p>
          <ul className="grid gap-3 md:grid-cols-2">
            {/* The Teardown is already featured just above (NewsletterFeature); list only the other writing */}
            {writing.filter((w) => w.title !== newsletter.name).map((w) => (
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

        <section aria-labelledby="evidence-h" id="evidence">
          <SectionHeader id="evidence-h" eyebrow="Evidence system" title="How claims are labelled" intro="The site makes unsupported claims hard to state. Every highlight carries one of these labels." />
          <dl className="grid gap-3 md:grid-cols-2">
            {LEVELS.map(([k, tone, d]) => (
              <div key={k} className="card flex flex-col gap-2 p-5"><dt><Pill tone={tone as "green"}>{k}</Pill></dt><dd className="text-[#C9D2CD]">{d}</dd></div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="credits-h">
          <SectionHeader id="credits-h" eyebrow="Credits" title="Third-party assets" />
          <p className="max-w-3xl text-muted">The 3D Earth of case studies uses textures by <a href={EARTH_CREDIT.href} target="_blank" rel="noopener noreferrer" className="text-ink underline underline-offset-4">Solar System Scope</a>, licensed <a href={EARTH_CREDIT.license} target="_blank" rel="noopener noreferrer" className="text-ink underline underline-offset-4">CC BY 4.0</a> and based on NASA imagery, as distributed with three.js; resized for the web. All sound is synthesised in the browser and original.</p>
        </section>
      </Container>
    </>
  );
}
