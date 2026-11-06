import { profile } from "~/content/profile";
import { experience, education, certifications, tools, writing } from "~/content/experience";
import { projects } from "~/content/projects";
import { Container, ButtonLink, Button } from "~/components/ui";
import { seo, asset } from "~/lib/meta";

export const meta = () => seo("CV", `${profile.name} (${profile.legalName}) — CV. ${profile.cvHeadline}.`, "/cv");

/** The public CV, rendered from the same content as every other page.
 *  No phone number. scripts/build-cv.mjs prints this page to the PDF. */
const CV_PROJECTS = ["aaroh", "careconnect", "ghargyaan", "phonepe-smart-spend-coach"];

export default function CV() {
  const list = CV_PROJECTS.map((s) => projects.find((p) => p.slug === s)!).filter(Boolean);
  return (
    <Container wide className="py-12 print:p-0">
      <div className="mx-auto mb-6 flex max-w-[860px] flex-wrap gap-2 print:hidden">
        <ButtonLink to={asset(profile.cvFile)} download="Gaurav-Kumar-Singh-CV.pdf" variant="primary" icon="download">Download PDF</ButtonLink>
        <Button icon="download" onClick={() => window.print()}>Print</Button>
      </div>
      <article id="cv" className="cv mx-auto max-w-[860px] rounded-2xl bg-white p-8 text-[#111] sm:p-12 print:rounded-none print:p-0">
        <header className="border-b-2 border-[#0B3D0B] pb-3 text-center">
          <h1 className="font-display text-3xl font-bold text-[#0B3D0B]">{profile.legalName}</h1>
          <p className="mt-1 font-semibold">{profile.cvHeadline} | Product Analyst · APM · Research Associate · Health-Tech Operations</p>
          <p className="mt-1 text-sm">{profile.location} | {profile.contact.email} | {profile.contact.linkedinLabel} | {profile.contact.githubLabel}</p>
          <p className="text-sm">{profile.availability}</p>
        </header>
        <CvSection title="Summary"><p>{profile.summary}</p></CvSection>
        <CvSection title="Skills">
          {Object.entries(tools).map(([k, v]) => <p key={k}><b>{k}:</b> {v.join(", ")}</p>)}
        </CvSection>
        <CvSection title="Experience">
          {experience.map((r) => (
            <div key={r.id} className="mb-2.5">
              <p className="flex justify-between gap-4"><b>{r.role} — {r.employer}, {r.location}</b><span className="whitespace-nowrap">{r.period}</span></p>
              <ul className="ml-5 list-disc">{r.work.map((w) => <li key={w}>{w}</li>)}</ul>
            </div>
          ))}
        </CvSection>
        <CvSection title="Health product projects">
          {list.map((p) => (
            <div key={p.slug} className="mb-2">
              <p className="flex justify-between gap-4"><span><b>{p.name} — {p.subtitle}</b> | {p.kind === "academic" ? "Masai School × IIT Roorkee (academic)" : p.role}</span><span className="whitespace-nowrap">{p.period}</span></p>
              <ul className="ml-5 list-disc">{p.highlights.slice(0, 2).map((h) => <li key={h.text}>{h.text}.</li>)}</ul>
            </div>
          ))}
        </CvSection>
        <CvSection title="Education">
          {education.map((e) => <p key={e.id} className="flex justify-between gap-4"><b>{e.what} — {e.org}</b><span className="whitespace-nowrap">{e.period}</span></p>)}
        </CvSection>
        <CvSection title="Certifications and writing">
          {certifications.map((c) => <p key={c.issuer}><b>{c.issuer}:</b> {c.items.join(", ")}</p>)}
          <p><b>Writing:</b> {writing.map((w) => `${w.title} (${w.detail})`).join("; ")}</p>
        </CvSection>
      </article>
    </Container>
  );
}

function CvSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-4 text-[13.5px] leading-snug">
      <h2 className="mb-1.5 border-b border-[#0B3D0B] pb-0.5 font-display text-[15px] font-bold uppercase tracking-wide text-[#0B3D0B]">{title}</h2>
      {children}
    </section>
  );
}
