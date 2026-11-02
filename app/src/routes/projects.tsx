import { useMemo } from "react";
import { useSearchParams } from "react-router";
import { projects, PROJECT_FILTERS } from "~/content/projects";
import { PageHero, Container, Empty, cx } from "~/components/ui";
import { ProjectCard } from "~/components/cards";
import { seo } from "~/lib/meta";
import { norm } from "~/lib/text";

export const meta = () => seo("Projects", "Project library: Evamastu, Aaroh, CareConnect, GharGyaan, PhonePe Smart Spend Coach (academic), Nexus and 90 product case studies.", "/projects");

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
      <PageHero eyebrow="Projects" title="Project library" intro="Professional work, independent builds, an academic capstone and published research — each with its real status." />
      <Container wide className="py-12">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div role="group" aria-label="Filter projects" className="flex flex-wrap gap-2">
            {PROJECT_FILTERS.map((f) => (
              <button key={f} type="button" aria-pressed={filter === f} onClick={() => update("filter", f)}
                className={cx("min-h-10 rounded-full border px-3.5 text-sm", filter === f ? "border-green bg-green text-green-ink font-semibold" : "border-line text-muted hover:text-ink hover:border-green/60")}>{f}</button>
            ))}
          </div>
          <label className="relative block w-full lg:w-72">
            <span className="sr-only">Search projects</span>
            <input type="search" value={q} onChange={(e) => update("q", e.target.value)} placeholder="Search projects" className="field" />
          </label>
        </div>
        <p role="status" className="label mb-4">{shown.length} of {projects.length} projects</p>
        {shown.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{shown.map((p) => <ProjectCard key={p.slug} p={p} headingLevel={2} />)}</div>
        ) : (
          <Empty title="No projects match">
            <button type="button" onClick={() => setParams(new URLSearchParams(), { replace: true })} className="mt-3 underline underline-offset-4">Clear filters</button>
          </Empty>
        )}
      </Container>
    </>
  );
}
