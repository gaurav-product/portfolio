import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { profile, highlights } from "~/content/profile";
import { experience, education, certifications, writing, tools } from "~/content/experience";
import { projects } from "~/content/projects";
import { capabilities, type CapabilityCategory } from "~/content/capabilities";
import type { ProjectCategory } from "~/content/types";
import { Container, Pill, statusTone, ButtonLink, cx } from "~/components/ui";
import { Icon } from "~/components/Icon";
import { seo, asset } from "~/lib/meta";
import { track } from "~/lib/analytics";

export const meta = () => seo("Recruiter Mode", `${profile.name} in 30 seconds: summary, experience, projects, skills, education and CV.`, "/recruiter");

/** A lens only reorders and emphasises existing content. It never adds any. */
const LENSES: { id: string; label: string; projects: Partial<Record<ProjectCategory, number>>; caps: CapabilityCategory[]; why: string }[] = [
  { id: "all", label: "All roles", projects: { "Professional Projects": 3, Healthcare: 1, "Product Management": 1 }, caps: ["Discovery", "Execution", "Analytics", "AI", "Healthcare"], why: "Default ordering: employment first, then the strongest independent and academic work." },
  { id: "apm", label: "Associate Product Manager", projects: { "Professional Projects": 4, "Product Management": 2, Research: 1 }, caps: ["Execution", "Discovery", "Product Strategy", "Analytics"], why: "Ownership from discovery to release, prioritization and delivery come first." },
  { id: "analyst", label: "Product Analyst", projects: { Analytics: 4, Growth: 3, "Professional Projects": 2 }, caps: ["Analytics", "Growth", "Discovery"], why: "Funnel, cohort and experiment work come first." },
  { id: "ai", label: "AI Product", projects: { AI: 4, Healthcare: 1 }, caps: ["AI", "Healthcare", "Product Strategy"], why: "Guardrails, evaluation and AI product boundaries come first." },
  { id: "health", label: "Healthcare Product", projects: { Healthcare: 4, "Professional Projects": 1 }, caps: ["Healthcare", "AI", "Discovery"], why: "Health products and safety design come first." },
  { id: "research", label: "Product Research", projects: { Research: 4, "Professional Projects": 1, Healthcare: 1 }, caps: ["Discovery", "Analytics", "Communication & Collaboration"], why: "Interviews, synthesis and the 90-study corpus come first." },
];

export default function Recruiter() {
  const [params, setParams] = useSearchParams();
  const lens = LENSES.find((l) => l.id === params.get("role")) ?? LENSES[0];
  const [detail, setDetail] = useState(false);
  const ordered = useMemo(() => [...projects].map((p) => ({ p, s: p.categories.reduce((a, c) => a + (lens.projects[c] ?? 0), 0) }))
    .sort((a, b) => b.s - a.s).map((x) => x.p).slice(0, 5), [lens]);
  const topCaps = useMemo(() => lens.caps.flatMap((cat) => capabilities.filter((c) => c.category === cat && c.status === "Demonstrated in work").slice(0, 4)), [lens]);
  const cv = asset(profile.cvFile);

  return (
    <Container wide className="py-14">
      <header className="flex flex-col gap-6 border-b border-line-soft pb-10 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="eyebrow mb-4">Recruiter Mode · 30-second overview</p>
          <h1 className="text-[40px] font-bold leading-[1.04] sm:text-6xl">{profile.name}</h1>
          <p className="mt-4 font-display text-xl text-ink">{profile.cvHeadline}</p>
          <p className="mt-2 text-muted">{profile.location} · {profile.availability}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ButtonLink to={cv} download="Gaurav-Kumar-Singh-CV.pdf" variant="primary" icon="download" onClick={() => track("cv_downloaded", { from: "recruiter" })}>Download CV</ButtonLink>
          <ButtonLink to={`mailto:${profile.contact.email}`} icon="mail" onClick={() => track("contact_click", { via: "email" })}>Email</ButtonLink>
          <ButtonLink to={profile.contact.linkedin} external icon="linkedin">LinkedIn</ButtonLink>
        </div>
      </header>

      <div role="group" aria-label="Emphasise for a role" className="mt-6 flex flex-wrap items-center gap-2">
        <span className="label mr-1">Emphasise for</span>
        {LENSES.map((l) => (
          <button key={l.id} type="button" aria-pressed={lens.id === l.id} onClick={() => { const n = new URLSearchParams(params); l.id === "all" ? n.delete("role") : n.set("role", l.id); setParams(n, { replace: true, preventScrollReset: true }); }}
            className={cx("min-h-10 rounded-full border px-3.5 text-sm", lens.id === l.id ? "border-green bg-green font-semibold text-green-ink" : "border-line text-muted hover:text-ink")}>{l.label}</button>
        ))}
      </div>
      <p className="mt-2 text-sm text-dim" role="status">{lens.why} Content is the same for every role; only the order changes.</p>

      {/* 30-second view */}
      <section aria-labelledby="summary-h" className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="card p-6">
          <h2 id="summary-h" className="label mb-3">Summary</h2>
          <p className="text-[17px] leading-relaxed text-[#D7DEDA]">{profile.summary}</p>
          <h3 className="label mb-2 mt-5">Positioning</h3>
          <p className="text-muted">{profile.headline}</p>
        </div>
        <ul className="grid grid-cols-2 gap-3" aria-label="Key figures">
          {highlights.map((h) => <li key={h.label} className="card p-4"><p className="font-display text-2xl font-bold">{h.value}</p><p className="text-sm text-muted">{h.label}</p></li>)}
        </ul>
      </section>

      <section aria-labelledby="timeline-h" className="mt-10">
        <h2 id="timeline-h" className="label mb-4">Career timeline (employment)</h2>
        <ol className="grid gap-3 lg:grid-cols-3">
          {experience.map((r) => (
            <li key={r.id}><Link to={`/experience/${r.id}`} className="card card-link block h-full p-5">
              <span className="label">{r.period}</span>
              <span className="mt-2 block font-display text-lg font-bold">{r.role}</span>
              <span className="block text-sm text-muted">{r.employer} · {r.location}</span>
              {detail && <ul className="mt-3 grid gap-1.5 text-sm text-[#C9D2CD]">{r.work.map((w) => <li key={w}>· {w}</li>)}</ul>}
            </Link></li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="proj-h" className="mt-10">
        <h2 id="proj-h" className="label mb-4">Featured projects — ordered for “{lens.label}”</h2>
        <ol className="grid gap-3">
          {ordered.map((p, i) => (
            <li key={p.slug}><Link to={`/projects/${p.slug}`} className="card card-link grid gap-2 p-5 sm:grid-cols-[32px_1fr_auto] sm:items-center">
              <span className="font-mono text-sm text-dim">{String(i + 1).padStart(2, "0")}</span>
              <span><span className="font-medium">{p.name}</span> <span className="text-muted">— {p.subtitle}</span><span className="block text-sm text-dim">{p.kindLabel} · {p.role} · {p.period}</span>{detail && <span className="mt-1 block text-sm text-[#C9D2CD]">{p.oneLine}</span>}</span>
              <Pill tone={statusTone(p.status)}>{p.status}</Pill>
            </Link></li>
          ))}
        </ol>
      </section>

      <div className="mt-8 flex justify-center">
        <button type="button" onClick={() => setDetail((d) => !d)} aria-expanded={detail} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line px-5 text-sm hover:border-green/60">
          <Icon name={detail ? "up" : "down"} />{detail ? "Show the 30-second view" : "Show the detailed profile"}
        </button>
      </div>

      <section aria-labelledby="skills-h" className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 id="skills-h" className="label mb-4">Core skills — with evidence</h2>
          <ul className="flex flex-wrap gap-2">{topCaps.map((c) => <li key={c.id}><Link to={`/skills/${c.id}`} className="inline-block rounded-lg border border-line px-3 py-1 text-sm hover:border-green/60">{c.name}</Link></li>)}</ul>
        </div>
        <div className="card p-6">
          <h2 className="label mb-4">Tools</h2>
          <p className="text-sm text-[#C9D2CD]">{tools.Tools.join(" · ")}</p>
          {detail && Object.entries(tools).filter(([k]) => k !== "Tools").map(([k, v]) => <p key={k} className="mt-3 text-sm text-muted"><span className="text-ink">{k}:</span> {v.join(", ")}</p>)}
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-3" aria-label="Education, certifications and writing">
        <div className="card p-6"><h2 className="label mb-4">Education</h2><ul className="grid gap-3 text-sm">{education.map((e) => <li key={e.id}><span className="font-medium">{e.what}</span><span className="block text-muted">{e.org} · {e.period}</span></li>)}</ul></div>
        <div className="card p-6"><h2 className="label mb-4">Certifications</h2>{certifications.map((c) => <div key={c.issuer} className="mb-3"><p className="text-xs text-dim">{c.issuer}</p><ul className="mt-1 grid gap-1 text-sm">{c.items.map((i) => <li key={i} className="text-[#C9D2CD]">{i}</li>)}</ul></div>)}</div>
        <div className="card p-6"><h2 className="label mb-4">Research and writing</h2><ul className="grid gap-3 text-sm">{writing.map((w) => <li key={w.title}><span className="font-medium">{w.title}</span><span className="block text-muted">{w.detail}</span></li>)}</ul>
          <Link to="/research" className="mt-4 inline-block text-sm text-green underline underline-offset-4">Open the research library</Link></div>
      </section>

      <section aria-labelledby="contact-h" className="card mt-6 flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div><h2 id="contact-h" className="font-display text-xl font-bold">Contact</h2><p className="text-muted">{profile.contact.email} · {profile.contact.linkedinLabel}</p></div>
        <div className="flex flex-wrap gap-2">
          <ButtonLink to={`mailto:${profile.contact.email}`} variant="primary" icon="mail">Email Gaurav</ButtonLink>
          <ButtonLink to="/" variant="ghost" icon="back">Full portfolio</ButtonLink>
        </div>
      </section>
    </Container>
  );
}
