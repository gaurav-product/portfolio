import { Link } from "react-router";
import type { Project } from "~/content/types";
import { capabilityById } from "~/content/capabilities";
import { Pill, statusTone, cx } from "./ui";
import { Icon } from "./Icon";
import { asset } from "~/lib/meta";
import { projectArt } from "~/content/cinematic";
import { CinematicImage } from "./CinematicImage";
import { track } from "~/lib/analytics";

export function ProjectCard({ p, compact = false, headingLevel = 3 }: { p: Project; compact?: boolean; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <article className="card card-link group relative flex flex-col overflow-hidden">
      {!compact && (projectArt(p.slug)
        ? <span className="block overflow-hidden border-b border-line"><CinematicImage id={projectArt(p.slug)!} decorative sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw" imgClassName="aspect-[16/10] object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]" /></span>
        : <img src={asset(p.cover)} alt="" width={1200} height={750} loading="lazy" decoding="async" className="aspect-[16/10] w-full border-b border-line object-cover" />)}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Pill tone={statusTone(p.status)}>{p.status}</Pill>
          <span className="label">{p.kindLabel}</span>
        </div>
        <H className="text-xl font-bold">
          <Link to={`/projects/${p.slug}`} onClick={() => track("project_opened", { slug: p.slug })} className="after:absolute after:inset-0 focus-visible:outline-none">{p.name}</Link>
        </H>
        <p className="text-sm text-muted">{p.subtitle} · {p.period}</p>
        <p className="mt-3 text-[15px] text-[#C9D2CD]">{p.oneLine}</p>
        {!compact && (
          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Relevant skills">
            {p.skills.slice(0, 4).map((s) => <li key={s} className="rounded-md bg-raise px-2 py-0.5 text-xs text-muted">{capabilityById(s)?.name ?? s}</li>)}
          </ul>
        )}
        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-medium text-green">View case study <Icon name="arrow" size={16} className="transition-transform group-hover:translate-x-1" /></span>
      </div>
    </article>
  );
}

export function StatCard({ value, label, definition, className = "" }: { value: string; label: string; definition: string; className?: string }) {
  return (
    <div className={cx("card p-5", className)}>
      <p className="font-display text-3xl font-bold text-ink">{value}</p>
      <p className="mt-1 font-medium text-ink">{label}</p>
      <p className="mt-2 text-sm text-dim">{definition}</p>
    </div>
  );
}
