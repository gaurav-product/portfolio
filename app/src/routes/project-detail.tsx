import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { projects } from "~/content/projects";
import { capabilityById } from "~/content/capabilities";
import { districtById } from "~/content/districts";
import { Container, Pill, statusTone, Blocks, SourceLinks, ClaimList, ButtonLink, cx } from "~/components/ui";
import { Icon } from "~/components/Icon";
import { seo, asset } from "~/lib/meta";
import type { Route } from "./+types/project-detail";

export const meta = ({ params }: Route.MetaArgs) => {
  const p = projects.find((x) => x.slug === params.slug);
  return p ? seo(`${p.name} — case study`, `${p.name}: ${p.oneLine}`, `/projects/${p.slug}`) : seo("Not found", "Project not found", "/projects");
};

export default function ProjectDetail() {
  const { slug } = useParams();
  const i = projects.findIndex((x) => x.slug === slug);
  const p = projects[i];
  if (!p) throw new Response("Not found", { status: 404 });
  const prev = projects[(i - 1 + projects.length) % projects.length], next = projects[(i + 1) % projects.length];
  const [active, setActive] = useState<string | undefined>(p.sections[0]?.key);

  useEffect(() => {
    const els = p.sections.map((s) => document.getElementById(s.key)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver((es) => { const v = es.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]; if (v) setActive(v.target.id); }, { rootMargin: "-90px 0px -60% 0px" });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [p]);

  const district = districtById(p.district);
  return (
    <article>
      <header className="relative overflow-hidden border-b border-line-soft">
        <img src={asset(p.cover)} alt="" aria-hidden width={1200} height={750} className="absolute inset-0 h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/90 to-bg/40" aria-hidden />
        <Container wide className="relative py-12 sm:py-16">
          <Link to="/projects" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink"><Icon name="back" size={16} />All projects</Link>
          <div className="mt-6 flex flex-wrap items-center gap-2"><Pill tone={statusTone(p.status)}>{p.status}</Pill><Pill>{p.kindLabel}</Pill></div>
          <h1 className="mt-4 text-4xl font-bold sm:text-6xl">{p.name}</h1>
          <p className="mt-2 text-xl text-muted">{p.subtitle}</p>
          <p className="mt-5 max-w-3xl text-lg text-[#C9D2CD]">{p.oneLine}</p>
          <dl className="mt-8 grid max-w-3xl gap-4 sm:grid-cols-3">
            <div><dt className="label">Role</dt><dd className="mt-1">{p.role}</dd></div>
            <div><dt className="label">Period</dt><dd className="mt-1">{p.period}</dd></div>
            <div><dt className="label">Type</dt><dd className="mt-1">{p.kindLabel}</dd></div>
          </dl>
          {p.repo && <div className="mt-6"><ButtonLink to={p.repo.href} external icon="github">{p.repo.label}</ButtonLink></div>}
        </Container>
      </header>

      <Container wide className="grid gap-10 py-12 lg:grid-cols-[240px_1fr]">
        <nav aria-label="Case study sections" className="lg:sticky lg:top-24 lg:self-start">
          <details className="card lg:hidden" open={false}>
            <summary className="cursor-pointer list-none px-4 py-3 font-medium">Sections ({p.sections.length})</summary>
            <ol className="grid gap-1 px-2 pb-3">{p.sections.map((s) => <li key={s.key}><a href={`#${s.key}`} className="block rounded-lg px-2 py-2 text-sm text-muted hover:bg-raise hover:text-ink">{s.title}</a></li>)}</ol>
          </details>
          <ol className="hidden gap-0.5 border-l border-line lg:grid">
            {p.sections.map((s) => (
              <li key={s.key}><a href={`#${s.key}`} aria-current={active === s.key ? "location" : undefined}
                className={cx("-ml-px block border-l-2 py-1.5 pl-4 text-sm", active === s.key ? "border-green text-ink" : "border-transparent text-dim hover:text-ink")}>{s.title}</a></li>
            ))}
          </ol>
        </nav>

        <div className="min-w-0 max-w-3xl">
          <section aria-labelledby="hl" className="card mb-12 p-6">
            <h2 id="hl" className="label mb-4">Evidence-backed highlights</h2>
            <ClaimList claims={p.highlights} />
            <h3 className="label mb-3 mt-6 !text-amber">What this does not show</h3>
            <ul className="grid gap-2 text-[15px] text-muted">{p.limits.map((l) => <li key={l} className="flex gap-2"><span aria-hidden className="text-amber">—</span>{l}</li>)}</ul>
          </section>

          {p.sections.map((s) => (
            <section key={s.key} id={s.key} aria-labelledby={`${s.key}-h`} className="mb-12 scroll-mt-24">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <h2 id={`${s.key}-h`} className="text-2xl font-bold">{s.title}</h2>
                {s.tag && <Pill tone="amber">{s.tag}</Pill>}
              </div>
              <Blocks blocks={s.blocks} />
              {s.sources && <SourceLinks ids={s.sources} className="mt-4" />}
            </section>
          ))}

          <section aria-labelledby="skills-h" className="mb-12">
            <h2 id="skills-h" className="mb-4 text-2xl font-bold">Capabilities shown</h2>
            <ul className="flex flex-wrap gap-2">
              {p.skills.map((id) => { const c = capabilityById(id); return c ? <li key={id}><Link to={`/skills/${id}`} className="inline-block rounded-lg border border-line px-3 py-1.5 text-sm hover:border-green/60">{c.name}</Link></li> : null; })}
            </ul>
            {district && <p className="mt-6 text-sm text-muted">In Explore Mode this project sits in <Link to={`/explore?d=${district.id}`} className="text-green underline underline-offset-4">{district.name}</Link>.</p>}
          </section>

          <nav aria-label="More projects" className="grid gap-3 border-t border-line pt-8 sm:grid-cols-2">
            <Link to={`/projects/${prev.slug}`} className="card card-link p-5"><span className="label">Previous project</span><span className="mt-1 flex items-center gap-2 font-medium"><Icon name="left" size={16} />{prev.name}</span></Link>
            <Link to={`/projects/${next.slug}`} className="card card-link p-5 sm:text-right"><span className="label">Next project</span><span className="mt-1 flex items-center gap-2 font-medium sm:justify-end">{next.name}<Icon name="right" size={16} /></span></Link>
          </nav>
        </div>
      </Container>
    </article>
  );
}
