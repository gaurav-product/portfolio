import { Link, useParams } from "react-router";
import { districts, districtById } from "~/content/districts";
import { projects } from "~/content/projects";
import { experience } from "~/content/experience";
import { Container, Pill, statusTone, ButtonLink } from "~/components/ui";
import { CinematicImage } from "~/components/CinematicImage";
import { Icon } from "~/components/Icon";
import { seo, asset } from "~/lib/meta";
import { track } from "~/lib/analytics";
import type { Route } from "./+types/district";

export const meta = ({ params }: Route.MetaArgs) => {
  const d = districtById(params.id ?? "");
  return d ? seo(`${d.name} — district`, d.summary, `/districts/${d.id}`) : seo("Not found", "District not found", "/explore");
};

const ROLES: Record<string, string[]> = {
  "professional-experience": ["apm-adhyatm-sadhna-kendra", "pm-intern-adhyatm-sadhna-kendra", "research-expert-lybl"],
  "research-analytics": ["research-expert-lybl"],
  "product-leadership": ["apm-adhyatm-sadhna-kendra"],
};

export default function DistrictPage() {
  const { id } = useParams();
  const i = districts.findIndex((x) => x.id === id);
  const d = districts[i];
  if (!d) throw new Response("Not found", { status: 404 });
  const prev = districts[(i - 1 + districts.length) % districts.length], next = districts[(i + 1) % districts.length];
  const related = projects.filter((p) => p.district === d.id);
  const roles = (ROLES[d.id] ?? []).map((r) => experience.find((e) => e.id === r)!).filter(Boolean);
  const tone = d.tone === "green" ? "text-green" : "text-cyan";

  return (
    <article>
      <header className="relative overflow-hidden border-b border-line-soft">
        {/* Illustration right-anchored on desktop with a solid fade under the text column, and a uniform
            scrim on phones, so the image's baked-in labels never sit behind real text. */}
        <div aria-hidden className="absolute inset-0">
          <div className="absolute inset-0 lg:left-auto lg:w-[58%]">
            {d.image
              ? <CinematicImage id={d.image} decorative priority sizes="(min-width: 1024px) 58vw, 100vw" className="h-full" imgClassName="h-full object-cover" />
              : <img src={asset(d.background)} alt="" className="h-full w-full object-cover" />}
          </div>
          <div className="absolute inset-0 bg-bg/[.86] lg:bg-transparent lg:bg-[linear-gradient(90deg,#0B1110_0%,#0B1110_50%,rgb(11_17_16/.88)_60%,rgb(11_17_16/.42)_80%,rgb(11_17_16/.1)_100%)]" />
          <div className="absolute inset-x-0 top-0 hidden h-40 bg-gradient-to-b from-bg to-transparent lg:block" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-bg to-transparent" />
        </div>
        <Container wide className="relative py-14 sm:py-20">
          <Link to="/explore" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink"><Icon name="back" size={16} />All districts</Link>
          <p className={`mt-6 font-mono text-sm tracking-[.18em] ${tone}`}>DISTRICT {d.index}</p>
          <h1 className="mt-2 flex items-center gap-3 text-4xl font-bold sm:text-6xl"><Icon name={d.icon} size={40} className={tone} />{d.name}</h1>
          <p className="mt-4 max-w-2xl text-lg text-[#D7DEDA]">{d.summary}</p>
          <ul className="mt-6 flex max-w-3xl flex-wrap gap-2" aria-label="What this district represents">
            {d.represents.map((r) => <li key={r} className="rounded-full border border-line bg-bg/70 px-3 py-1 text-sm">{r}</li>)}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink to={`/explore?d=${d.id}`} variant="primary" icon="explore" onClick={() => track("explore_mode_opened", { from: "district" })}>See it in Explore Mode</ButtonLink>
            <ButtonLink to="/recruiter" icon="recruiter">Recruiter Mode</ButtonLink>
          </div>
        </Container>
      </header>

      <Container wide className="grid gap-14 py-12">
        <section aria-labelledby="dest-h">
          <h2 id="dest-h" className="mb-5 text-2xl font-bold">Destinations</h2>
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {d.destinations.map((x) => (
              <li key={x.to}><Link to={x.to} className="card card-link flex h-full items-center justify-between gap-3 p-5">
                <span><span className="block font-medium">{x.label}</span><span className="block text-sm text-dim">{x.note}</span></span><Icon name="arrow" className="shrink-0 text-green" />
              </Link></li>
            ))}
          </ul>
        </section>

        {related.length > 0 && (
          <section aria-labelledby="proj-h">
            <h2 id="proj-h" className="mb-5 text-2xl font-bold">Projects in this district</h2>
            <ul className="grid gap-3 md:grid-cols-2">
              {related.map((p) => (
                <li key={p.slug}><Link to={`/projects/${p.slug}`} className="card card-link block h-full p-5">
                  <span className="flex flex-wrap items-center gap-2"><Pill tone={statusTone(p.status)}>{p.status}</Pill><span className="label">{p.kindLabel}</span></span>
                  <span className="mt-3 block font-display text-xl font-bold">{p.name}</span>
                  <span className="mt-1 block text-[15px] text-[#C9D2CD]">{p.oneLine}</span>
                </Link></li>
              ))}
            </ul>
          </section>
        )}

        {roles.length > 0 && (
          <section aria-labelledby="roles-h">
            <h2 id="roles-h" className="mb-5 text-2xl font-bold">Experience</h2>
            <ol className="grid gap-3 lg:grid-cols-3">
              {roles.map((r) => (
                <li key={r.id}><Link to={`/experience/${r.id}`} className="card card-link block h-full p-5">
                  <span className="label">{r.period}</span>
                  <span className="mt-2 block font-display text-lg font-bold">{r.role}</span>
                  <span className="block text-sm text-muted">{r.employer} · {r.location}</span>
                </Link></li>
              ))}
            </ol>
          </section>
        )}

        {!d.image && <p className="text-sm text-dim">The cinematic illustration for this district has not been supplied yet; an original vector illustration stands in.</p>}

        <nav aria-label="Other districts" className="grid gap-3 border-t border-line pt-8 sm:grid-cols-2">
          <Link to={`/districts/${prev.id}`} className="card card-link p-5"><span className="label">Previous district</span><span className="mt-1 flex items-center gap-2 font-medium"><Icon name="left" size={16} />{prev.name}</span></Link>
          <Link to={`/districts/${next.id}`} className="card card-link p-5 sm:text-right"><span className="label">Next district</span><span className="mt-1 flex items-center gap-2 font-medium sm:justify-end">{next.name}<Icon name="right" size={16} /></span></Link>
        </nav>
      </Container>
    </article>
  );
}
