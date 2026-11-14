import { Link } from "react-router";
import { worlds, WORLD_CLUSTERS } from "~/content/universe";
import { CinematicImage } from "~/components/CinematicImage";
import { PageHero, Container, Pill, ButtonLink } from "~/components/ui";
import { CLUSTER_COLOR_DOM } from "~/universe/colors";
import { seo } from "~/lib/meta";

export const meta = () => seo("Project worlds", `${worlds.length} actual projects, each as a 3D world: its building, the approved screenshots and the case study floor by floor.`, "/worlds");

/** /worlds: the hub of the actual project worlds. Concepts, the newsletter and the 90 studies live elsewhere. */
export default function Worlds() {
  return (
    <>
      <PageHero eyebrow={`Project worlds · ${worlds.length} actual projects`} title="Walk through the work"
        intro={<>Each project is a 3D building holding its approved screenshots and its case study, floor by floor. The same case studies are on <Link to="/projects" className="underline underline-offset-4">the project list</Link> as ordinary pages.</>}>
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink to="/projects" variant="primary" icon="arrow">Project list</ButtonLink>
          <ButtonLink to="/universe" icon="explore">Solar system in 3D</ButtonLink>
        </div>
      </PageHero>
      {/* a card grid, not prose: use the full page width like /projects (the narrow container caps line length) */}
      <Container wide>
        <div className="pb-20 pt-12">
          {WORLD_CLUSTERS.map((c) => (
            <section key={c} aria-labelledby={`wc-${c}`} className="mt-10 first:mt-0">
              <h2 id={`wc-${c}`} className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-[.2em] text-dim"><span aria-hidden className="size-2 rounded-full" style={{ background: CLUSTER_COLOR_DOM[c] }} />{c}</h2>
              <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" data-testid="world-cards">
                {worlds.filter((w) => w.cluster === c).map((w) => (
                  <li key={w.slug} className="card flex flex-col overflow-hidden">
                    {w.art && <CinematicImage id={w.art} decorative sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" imgClassName="aspect-[16/9] object-cover" />}
                    <div className="flex flex-1 flex-col p-5">
                      <Pill tone={w.tone} className="self-start">{w.statusLabel}</Pill>
                      <h3 className="mt-3 text-2xl font-bold">{w.name}</h3>
                      <p className="text-sm text-dim">{w.category}</p>
                      <p className="mt-3 text-muted">{w.oneLine}</p>
                      <div className="mt-auto flex flex-wrap gap-3 pt-5">
                        <ButtonLink to={w.worldPath} variant="primary" icon="explore" aria-label={`Enter the world: ${w.name}`}>Enter the world</ButtonLink>
                        <ButtonLink to={w.href} icon="arrow" aria-label={`Case study: ${w.name}`}>Case study</ButtonLink>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Container>
    </>
  );
}
