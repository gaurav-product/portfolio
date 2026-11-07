import { project3dPath } from "~/lib/immersive";
import { useMemo } from "react";
import { Link, useSearchParams } from "react-router";
import { projects, PROJECT_FILTERS } from "~/content/projects";
import { projectArt, THIRD_PARTY_MARK } from "~/content/cinematic";
import { PageHero, Container, Empty, Pill, statusTone, evidenceTone, ButtonLink, cx } from "~/components/ui";
import { CinematicImage, heroArt } from "~/components/CinematicImage";
import { Icon } from "~/components/Icon";
import { asset, seo } from "~/lib/meta";
import { norm } from "~/lib/text";
import { track } from "~/lib/analytics";
import type { Project } from "~/content/types";
import { ventures, VENTURES_NOTE } from "~/content/ventures";

export const meta = () => seo("Explore my work", "Eight projects with their real status: Evamastu, Aaroh, CareConnect, GharGyaan, PhonePe Smart Spend Coach (academic), Nexus, RupeeRadar and 90 case studies.", "/projects");

export default function Projects() {
  const [params, setParams] = useSearchParams();
  const filter = (PROJECT_FILTERS as readonly string[]).includes(params.get("filter") ?? "") ? params.get("filter")! : "All";
  const q = params.get("q") ?? "";
  const shown = useMemo(() => projects.filter((p) =>
    (filter === "All" || p.categories.includes(filter as never)) &&
    (!q || norm([p.name, p.subtitle, p.oneLine, ...p.categories].join(" ")).includes(norm(q)))), [filter, q]);
  const update = (k: string, v: string) => { const n = new URLSearchParams(params); v && v !== "All" ? n.set(k, v) : n.delete(k); setParams(n, { replace: true, preventScrollReset: true }); };

  return (
    <>
      <PageHero {...heroArt("render-projects")} eyebrow={`Projects · ${projects.length} builds`} title="Explore my work"
        intro="Professional work, independent builds, an academic capstone and published research. Each chapter carries its real status, my role, and only the outcomes the evidence supports.">
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink to="/worlds" variant="primary" icon="explore">Project worlds in 3D</ButtonLink>
          <ButtonLink to="/universe" icon="explore">Explore 90 case studies in 3D</ButtonLink>
          <ButtonLink to="#emerging-ventures" icon="down">Emerging Ventures</ButtonLink>
        </div>
      </PageHero>

      <Container wide className="sticky top-[72px] z-30 -mt-px border-b border-line-soft bg-bg/85 py-4 backdrop-blur-xl">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div role="group" aria-label="Filter projects" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:flex-wrap lg:overflow-visible lg:pb-0">
            {PROJECT_FILTERS.map((f) => (
              <button key={f} type="button" aria-pressed={filter === f} onClick={() => update("filter", f)}
                className={cx("min-h-10 shrink-0 rounded-full border px-3 text-[13px] transition-colors", filter === f ? "border-green bg-green text-green-ink font-semibold" : "border-line text-muted hover:text-ink hover:border-ink/30")}>{f}</button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <p role="status" className="label shrink-0">{shown.length} of {projects.length}</p>
            <label className="relative block w-full lg:w-52">
              <span className="sr-only">Search projects</span>
              <input type="search" value={q} onChange={(e) => update("q", e.target.value)} placeholder="Search projects" className="field" />
            </label>
          </div>
        </div>
      </Container>

      <Container wide>
        {shown.length ? (
          <ol aria-label="Projects">
            {shown.map((p, i) => <Chapter key={p.slug} p={p} n={projects.indexOf(p) + 1} flip={i % 2 === 1} />)}
          </ol>
        ) : (
          <div className="py-16"><Empty title="No projects match">
            <button type="button" onClick={() => setParams(new URLSearchParams(), { replace: true })} className="mt-3 underline underline-offset-4">Clear filters</button>
          </Empty></div>
        )}
      </Container>

      <Container wide>
        <section id="emerging-ventures" aria-labelledby="ev-h" className="scroll-mt-40 border-t border-line-soft py-16">
          <p className="eyebrow">Emerging Ventures · concepts in development</p>
          <h2 id="ev-h" className="mt-3 text-4xl font-bold">The next chapter</h2>
          <p className="mt-3 max-w-2xl text-muted">{VENTURES_NOTE} They are not counted among the builds above.</p>
          <ul className="mt-8 grid gap-5 md:grid-cols-2">
            {ventures.map((v) => (
              <li key={v.slug} className="card p-6">
                <div className="flex flex-wrap items-center gap-2"><Pill tone="amber">{v.status}</Pill><span className="text-sm text-dim">{v.category}</span></div>
                <h3 className="mt-3 text-2xl font-bold"><Link to={`/ventures/${v.slug}`} className="hover:text-green">{v.name}</Link></h3>
                <p className="mt-2 text-[#D7DEDA]">“{v.vision}”</p>
                <div className="mt-5 flex flex-wrap gap-3"><ButtonLink to={`/ventures/${v.slug}`} icon="arrow" aria-label={`Read the concept: ${v.name}`}>Read the concept</ButtonLink><ButtonLink to={`/ventures/${v.slug}/world`} icon="explore" aria-label={`Visit in 3D: ${v.name}`}>Visit in 3D</ButtonLink></div>
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </>
  );
}

/** One project as a film chapter: a large render beside the story, revealed as it scrolls in. */
function Chapter({ p, n, flip }: { p: Project; n: number; flip: boolean }) {
  const art = projectArt(p.slug);
  const to = `/projects/${p.slug}`;
  const open = () => track("project_opened", { slug: p.slug, from: "projects" });
  return (
    <li id={p.slug} className="chapter grid scroll-mt-40 items-center gap-8 border-b border-line-soft py-14 last:border-b-0 lg:grid-cols-2 lg:gap-16 lg:py-24">
      <Link to={to} onClick={open} tabIndex={-1} aria-hidden="true" data-cursor="view" data-tilt
        className={cx("chapter-art group relative block overflow-hidden rounded-3xl border border-line-soft bg-surface", flip && "lg:order-2")}>
        {art
          ? <CinematicImage id={art} decorative sizes="(min-width: 1024px) 46vw, 100vw" imgClassName="aspect-[16/10] object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]" />
          : <img src={asset(p.cover)} alt="" width={1200} height={750} loading="lazy" className="aspect-[16/10] w-full object-cover" />}
        {!art?.startsWith("brand-") && <span aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent to-transparent" />}
        {!art?.startsWith("brand-") && <span aria-hidden className="pointer-events-none absolute left-5 top-4 font-display text-6xl font-bold text-ink/15 sm:text-7xl">{String(n).padStart(2, "0")}</span>}
        <span className="pointer-events-none absolute bottom-3 right-4 rounded-full bg-black/55 px-2.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-[.08em] text-white/80">{art?.startsWith("brand-") ? "Project artwork" : art ? "3D render" : "Illustration"}</span>
      </Link>

      <div className="chapter-copy">
        <p className="eyebrow">Chapter {String(n).padStart(2, "0")} · {p.kindLabel}</p>
        <h2 className="mt-4 text-4xl font-bold sm:text-5xl">
          <Link to={to} onClick={open} className="hover:text-green focus-visible:text-green">{p.name}</Link>
        </h2>
        <p className="mt-2 text-lg text-muted">{p.subtitle} · {p.period}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2"><Pill tone={statusTone(p.status)}>{p.status}</Pill><span className="text-sm text-dim">{p.role}</span></div>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#D7DEDA]">{p.oneLine}</p>
        {THIRD_PARTY_MARK[p.slug] && <p className="mt-3 max-w-xl text-sm text-dim">{THIRD_PARTY_MARK[p.slug]}</p>}
        <ul className="mt-6 grid max-w-xl gap-2.5">
          {p.highlights.slice(0, 3).map((h) => (
            <li key={h.text} className="flex gap-3 text-[15px] text-[#C9D2CD]">
              <Icon name="check" size={18} className="mt-0.5 shrink-0 text-green" />
              <span>{h.text} <Pill tone={evidenceTone(h.status)} className="ml-1 align-middle">{h.status}</Pill></span>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink to={to} variant="primary" icon="arrow" onClick={open} aria-label={`Read the case study: ${p.name}`}>Read the case study</ButtonLink>
          <ButtonLink to={project3dPath(p.slug)} icon="explore" aria-label={`Explore in 3D: ${p.name}`}>Explore in 3D</ButtonLink>
          {p.repo && <ButtonLink to={p.repo.href} external icon="github" aria-label={`View repository: ${p.repo.label}`}>View repository</ButtonLink>}
        </div>
      </div>
    </li>
  );
}
