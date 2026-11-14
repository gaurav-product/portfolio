import { Link } from "react-router";
import { profile, highlights } from "~/content/profile";
import { featuredProjects } from "~/content/projects";
import { experience, newsletter } from "~/content/experience";
import { NewsletterFeature } from "~/components/Newsletter";
import { capabilities, CAPABILITY_CATEGORIES } from "~/content/capabilities";
import { districts } from "~/content/districts";
import { legacy, corpusSummary } from "~/content/data";
import { Container, ButtonLink, SectionHeader, Pill, Button } from "~/components/ui";
import { ProjectCard } from "~/components/cards";
import { Icon } from "~/components/Icon";
import { IntroFilm, FILM, FILM_ID, useIntroFilm } from "~/components/IntroFilm";
import { Typewriter } from "~/components/Typewriter";
import { HeroBackdrop } from "~/components/HeroBackdrop";
import { Portrait } from "~/components/Portrait";
import { CinematicImage } from "~/components/CinematicImage";
import { cinematic } from "~/content/cinematic";
import { seo, structuredData, asset } from "~/lib/meta";
import { track } from "~/lib/analytics";

// Phones: the campus illustration is the largest paint, so fetch it with the document instead of
// after layout. AVIF only (browsers without AVIF ignore the hint) and only below the desktop breakpoint.
export const links = () => {
  const c = cinematic("gaurav-world-hero");
  return c.avif ? [{ rel: "preload", as: "image", type: "image/avif", media: "(max-width: 1023px)", imageSrcSet: Object.entries(c.avif).map(([w, f]) => `${asset(f.file)} ${w}w`).join(", "), imageSizes: "100vw", fetchPriority: "high" }] : [];
};
export const meta = () => [...seo(profile.brand, `${profile.seoDescription} ${profile.tagline}`, "/"), structuredData()];

// the approved tagline, typed: each of its three words, then the whole line (profile.tagline)
const TAG_PREFIX = "Building products with ";
const TAG_PHRASES = ["evidence.", "intelligence.", "execution."];
const TAG_FINAL = "evidence, intelligence and execution.";

export default function Home() {
  const playFilm = useIntroFilm();
  const demonstrated = (c: string) => capabilities.filter((x) => x.category === c && x.status === "Demonstrated in work").length;
  return (
    <>
      {/* ------------------------------------------------------------ HERO */}
      {/* one focused first screen: who, what, why — and one clear way in. Everything else is below the fold. */}
      <section aria-labelledby="hero-title" className="relative overflow-hidden lg:flex lg:min-h-[calc(100svh-72px)] lg:items-center">
        <HeroBackdrop />
        <div aria-hidden className="relative lg:hidden">
          <CinematicImage id="gaurav-world-hero" decorative priority sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-b from-bg/60 via-transparent to-bg" />
        </div>
        <Container wide className="relative w-full pb-16 lg:py-24">
          {/* data-oz-avoid: on narrow phones the floating Oz steps aside while it would cover this introduction */}
          <div className="max-w-[660px]" data-oz-avoid>
            <Portrait size={84} lazy className="-mt-12 mb-6 !mx-0 lg:hidden" />
            <p className="eyebrow mb-5">{profile.brandLine}</p>
            <h1 id="hero-title" className="text-[52px] font-bold leading-[.98] sm:text-7xl xl:text-[88px]">{profile.name}</h1>
            <p className="mt-6 min-h-[2.7em] font-display text-[22px] font-medium leading-snug text-ink sm:text-[28px]">
              <Typewriter prefix={TAG_PREFIX} phrases={TAG_PHRASES} final={TAG_FINAL} />
            </p>
            <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-muted">{profile.intro}</p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <ButtonLink to="/tour" variant="primary" icon="arrow" onClick={() => track("cta_click", { cta: "explore_work_tour" })}>Explore my work</ButtonLink>
              <ButtonLink to="/projects" icon="product" onClick={() => track("cta_click", { cta: "browse_projects" })}>Browse all projects</ButtonLink>
            </div>
            <ul className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-[14px] text-muted">
              <li><Link to="/universe" onClick={() => track("cta_click", { cta: "solar_system" })} className="inline-flex items-center gap-2 hover:text-ink"><Icon name="explore" size={16} className="text-green" />Solar system in 3D</Link></li>
              <li><Link to="/worlds" onClick={() => track("cta_click", { cta: "project_worlds" })} className="inline-flex items-center gap-2 hover:text-ink"><Icon name="product" size={16} />Project worlds in 3D</Link></li>
              <li><Link to="/explore/city" onClick={() => track("explore_mode_opened", { from: "hero" })} className="inline-flex items-center gap-2 hover:text-ink"><Icon name="hq" size={16} />3D city</Link></li>
              <li><Link to="/recruiter" onClick={() => track("recruiter_mode_opened")} className="inline-flex items-center gap-2 hover:text-ink"><Icon name="recruiter" size={16} />Recruiter Mode</Link></li>
              <li><a href={asset(profile.cvFile)} download="Gaurav-Kumar-Singh-CV.pdf" onClick={() => track("cv_downloaded")} className="inline-flex items-center gap-2 hover:text-ink"><Icon name="download" size={16} />Download CV</a></li>
              <li><button type="button" onClick={playFilm} data-cursor="play" aria-controls={FILM_ID} className="inline-flex items-center gap-2 rounded-full border border-green/40 bg-surface px-3.5 py-1.5 font-display text-[12.5px] font-semibold uppercase tracking-[.1em] text-green transition-colors hover:border-green hover:text-ink"><Icon name="play" size={14} />Watch the intro film · {FILM.duration}</button></li>
            </ul>
          </div>
        </Container>
        <a href="#glance" aria-label="Scroll to the overview" className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[.3em] text-dim hover:text-ink lg:flex">
          Scroll<span aria-hidden className="h-8 w-px bg-gradient-to-b from-green to-transparent motion-safe:animate-pulse" />
        </a>
      </section>

      {/* ------------------------------------------------------ INTRO FILM */}
      {/* the 45-second introduction film, inline at its own 9:16 shape; the hero CTA scrolls here and plays it */}
      <section id={FILM_ID} aria-labelledby="intro-film-title" className="scroll-mt-20 py-16 lg:py-20">
        <Container wide>
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto] lg:gap-16">
            <div className="max-w-xl">
              <p className="eyebrow">Introduction film · {FILM.duration}</p>
              <h2 id="intro-film-title" className="mt-4 text-4xl font-bold sm:text-5xl">Gaurav.OS in 45 seconds</h2>
              <p className="mt-5 text-lg leading-relaxed text-muted">A short introduction to me and to what this site holds. It plays only when you press play.</p>
            </div>
            <IntroFilm />
          </div>
        </Container>
      </section>

      {/* ---------------------------------------------- PROFILE + EVIDENCE */}
      <section id="glance" aria-label="At a glance" className="relative scroll-mt-20">
        <Container wide>
          <div className="grid gap-10 border-y border-line-soft py-12 lg:grid-cols-[320px_1fr] lg:items-start lg:gap-12">
            <div className="flex items-center gap-5 pt-1 max-lg:hidden">
              <Portrait size={96} lazy className="!mx-0" />
              <div className="text-sm">
                <p className="font-medium text-ink">{profile.location}</p>
                <p className="mt-1 flex items-center gap-2 text-muted"><span className="size-1.5 rounded-full bg-green" aria-hidden />{profile.availability}</p>
                <Link to="/contact" className="mt-2 inline-flex items-center gap-1.5 text-muted underline decoration-line underline-offset-4 hover:text-ink"><Icon name="mail" size={14} />Contact</Link>
              </div>
            </div>
            <p className="inline-flex items-center gap-2 text-sm text-muted lg:hidden"><span className="size-1.5 rounded-full bg-green" aria-hidden />{profile.availability} · {profile.location}</p>
            <aside aria-label="Verified highlights">
              <ul className="grid grid-cols-2 gap-x-8 gap-y-8 lg:grid-cols-4">
                {highlights.map((h) => (
                  <li key={h.label} className="border-l border-line pl-5">
                    <p className="font-display text-[34px] font-bold leading-none tracking-tight">{h.value}</p>
                    <p className="mt-2 text-sm font-medium text-ink">{h.label}</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-dim">{h.definition}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-xs text-dim">Every figure is from the CV or a public repository. <Link to="/about#evidence" className="underline decoration-line underline-offset-4 hover:text-ink">How evidence is labelled</Link></p>
            </aside>
          </div>

          {/* districts — the six areas of the Gaurav.OS world */}
          <nav aria-label="Explore districts" className="py-10">
            <p className="label mb-5">The Gaurav.OS world · six districts</p>
            <ul className="grid grid-cols-2 gap-x-6 sm:grid-cols-3 lg:grid-cols-6">
              {districts.map((d) => (
                <li key={d.id}>
                  <Link to={`/districts/${d.id}`} onClick={() => track("district_opened", { id: d.id, from: "home" })}
                    className="group flex items-center gap-3 border-t border-line-soft py-4 text-[15px] text-muted transition-colors hover:text-ink">
                    <span className="font-mono text-xs text-dim">{d.index}</span>
                    <span className="leading-tight">{d.name}</span>
                    <Icon name="arrow" size={14} className="ml-auto opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </section>

      {/* -------------------------------------------------- CASE STUDY FEATURE */}
      {/* the owner-supplied "Product Management Case Studies" artwork (brand/owner-art), leading into the 90 studies */}
      <section aria-labelledby="casestudies" className="py-20" data-testid="case-study-feature">
        <Container wide>
          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
            <div className="relative">
              <Link to="/research" aria-label="Open the research library: product management case studies" data-cursor="view" data-tilt
                className="group relative block overflow-hidden rounded-3xl border border-line-soft bg-surface">
                <CinematicImage id="brand-90-day-case-studies" sizes="(min-width: 1024px) 55vw, 100vw" className="aspect-[3/2]" imgClassName="h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
              </Link>
              <span className="pointer-events-none absolute bottom-3 right-4 rounded-full bg-black/55 px-2.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-[.08em] text-white/80">Project artwork</span>
            </div>
            <div>
              <p className="eyebrow">Featured · research & case studies</p>
              <h2 id="casestudies" className="mt-4 text-4xl font-bold sm:text-5xl">{corpusSummary.counts.written} product case studies, in public</h2>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">{`${(corpusSummary.counts.words / 1e6).toFixed(1)} million words and ${corpusSummary.counts.sources.toLocaleString("en-IN")} references across ${corpusSummary.counts.directories} studies — read straight from the public repository, each with its evidence level shown.`}</p>
              <p className="mt-3 max-w-xl text-sm text-dim">Research and analysis of real companies’ products — not products I launched.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink to="/research" variant="primary" icon="research">Open the research library</ButtonLink>
                <ButtonLink to="/universe?at=earth" icon="explore">See all 90 on the 3D Earth</ButtonLink>
              </div>
              <ul className="mt-8 grid gap-2 border-t border-line-soft pt-6 text-sm">
                {legacy.lab_notes.slice(0, 2).map((n) => (
                  <li key={n.slug}><Link to={`/lab-notes/${n.slug}`} className="group inline-flex items-baseline gap-2 text-muted hover:text-ink"><span className="label shrink-0">Lab note</span><span className="underline decoration-line underline-offset-4 group-hover:decoration-green">{n.title}</span></Link></li>
                ))}
                <li><Link to="/atlas" className="group inline-flex items-baseline gap-2 text-muted hover:text-ink"><span className="label shrink-0">Atlas</span><span className="underline decoration-line underline-offset-4 group-hover:decoration-green">The 90 studies as a constellation</span></Link></li>
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* -------------------------------------------------------- FEATURED */}
      <section aria-labelledby="featured" className="py-24">
        <Container wide>
          <SectionHeader id="featured" eyebrow="Featured work" title="Products, Prototypes & Research"
            intro="Each card carries its real status. Employment, independent builds and academic work are labelled differently."
            action={<ButtonLink to="/projects" icon="arrow">All projects</ButtonLink>} />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featuredProjects.map((p) => <ProjectCard key={p.slug} p={p} />)}
            <Link to="/case-studies" className="card card-link flex flex-col justify-between p-6">
              <span className="eyebrow">Case studies</span>
              <span className="mt-4 font-display text-2xl font-bold">How each project was framed, decided and measured</span>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-green">Read the case studies <Icon name="arrow" size={16} /></span>
            </Link>
          </div>
        </Container>
      </section>

      {/* ------------------------------------------------------ CAPABILITY */}
      <section aria-labelledby="capability" className="border-y border-line-soft bg-surface/40 py-20">
        <Container wide>
          <SectionHeader id="capability" eyebrow="Product management capability" title="Demonstrated through work, not listed as keywords"
            intro={<>{capabilities.length} capabilities, each linked to the project or role that shows it — or marked <em>not yet evidenced</em>.</>}
            action={<ButtonLink to="/skills" icon="arrow">Open the skills library</ButtonLink>} />
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {CAPABILITY_CATEGORIES.map((c) => (
              <li key={c}>
                <Link to={`/skills?category=${encodeURIComponent(c)}`} className="card card-link block h-full p-4">
                  <span className="block font-medium">{c}</span>
                  <span className="mt-1 block text-sm text-dim">{demonstrated(c)} demonstrated in work</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink to="/product-thinking" icon="product">Product Thinking</ButtonLink>
            <ButtonLink to="/product-thinking/rice" variant="ghost" icon="arrow">Try the RICE calculator</ButtonLink>
          </div>
        </Container>
      </section>

      {/* ------------------------------------------------------ EXPERIENCE */}
      <section aria-labelledby="exp" className="py-20">
        <Container wide>
          <SectionHeader id="exp" eyebrow="Experience" title="Research first, then product ownership" action={<ButtonLink to="/experience" icon="arrow">Full timeline</ButtonLink>} />
          <ol className="grid gap-4 lg:grid-cols-3">
            {experience.map((r) => (
              <li key={r.id}>
                <Link to={`/experience/${r.id}`} className="card card-link block h-full p-6">
                  <span className="label">{r.period} · {r.type}</span>
                  <span className="mt-3 block font-display text-xl font-bold">{r.role}</span>
                  <span className="block text-muted">{r.employer} · {r.location}</span>
                  <span className="mt-4 flex flex-wrap gap-2">{r.outcomes.slice(0, 2).map((o) => <span key={o.label} className="inline-flex items-baseline gap-1.5 rounded-full border border-line-soft bg-raise/60 px-3 py-1 text-[13px] text-muted"><b className="font-semibold text-ink">{o.value}</b>{o.label}</span>)}</span>
                </Link>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* ------------------------------------------------------ NEWSLETTER */}
      <section aria-label={`${newsletter.name} newsletter`} className="pb-16">
        <Container wide><NewsletterFeature /></Container>
      </section>

      {/* ------------------------------------------------------------- CTA */}
      <section aria-labelledby="cta" className="py-10">
        <Container wide>
          <div className="card hero-glow flex flex-col items-start gap-6 p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 id="cta" className="text-3xl font-bold sm:text-4xl">Hiring for product, analytics or health?</h2>
              <p className="mt-3 max-w-2xl text-muted">{profile.availability}. The 30-second Recruiter Mode has everything on one page.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <ButtonLink to="/recruiter" variant="primary" icon="recruiter">Recruiter Mode</ButtonLink>
              <ButtonLink to="/contact" icon="mail">Get in touch</ButtonLink>
              <Button onClick={playFilm} variant="ghost" icon="play" data-cursor="play" aria-controls={FILM_ID}>Intro film · {FILM.duration}</Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
