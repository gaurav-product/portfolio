import { Link } from "react-router";
import { profile, highlights } from "~/content/profile";
import { featuredProjects } from "~/content/projects";
import { experience, writing } from "~/content/experience";
import { capabilities, CAPABILITY_CATEGORIES } from "~/content/capabilities";
import { districts } from "~/content/districts";
import { legacy, corpusSummary } from "~/content/data";
import { Container, ButtonLink, SectionHeader, Pill, Button } from "~/components/ui";
import { ProjectCard } from "~/components/cards";
import { Icon } from "~/components/Icon";
import { IntroFilm, useIntro } from "~/components/IntroFilm";
import { Portrait } from "~/components/Portrait";
import { CinematicImage } from "~/components/CinematicImage";
import { seo, asset } from "~/lib/meta";
import { track } from "~/lib/analytics";

export const meta = () => seo(profile.brand, `${profile.seoDescription} ${profile.tagline}`, "/");

export default function Home() {
  const intro = useIntro();
  const demonstrated = (c: string) => capabilities.filter((x) => x.category === c && x.status === "Demonstrated in work").length;
  return (
    <>
      {intro.open && <IntroFilm onClose={intro.close} />}

      {/* ------------------------------------------------------------ HERO */}
      <section aria-labelledby="hero-title" className="relative overflow-hidden border-b border-line-soft">
        {/* cinematic backdrop — the Gaurav.OS world (illustration); all text below is real HTML */}
        <div aria-hidden className="pointer-events-none absolute inset-0 max-lg:hidden">
          {/* right-anchored so the illustration's baked-in wordmark and labels sit under the solid part of the overlay, never behind the HTML text */}
          <div className="absolute inset-y-0 right-0 w-[72%]"><CinematicImage id="gaurav-world-hero" decorative priority sizes="72vw" className="h-full" imgClassName="h-full object-cover object-[50%_60%]" /></div>
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#0B1110_0%,#0B1110_36%,rgb(11_17_16/.93)_48%,rgb(11_17_16/.55)_64%,rgb(11_17_16/.12)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />
          <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-bg via-bg/70 to-transparent" />
        </div>
        <div aria-hidden className="relative lg:hidden">
          <CinematicImage id="gaurav-world-hero" decorative priority sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-b from-bg/70 via-transparent to-bg" />
        </div>
        <Container wide className="relative grid gap-10 pb-14 pt-2 sm:pb-20 lg:grid-cols-[1.25fr_.75fr] lg:items-center lg:py-24">
          <div>
            <Portrait size={112} className="-mt-16 mb-5 !mx-0 lg:hidden" />
            <p className="eyebrow mb-3">Gaurav.OS · Product × AI × Building</p>
            <h1 id="hero-title" className="text-[44px] font-bold leading-[1.02] sm:text-6xl xl:text-7xl">{profile.name}</h1>
            <p className="mt-3 font-display text-lg text-green sm:text-xl">{profile.tagline}</p>
            <p className="mt-5 max-w-2xl font-display text-xl font-medium leading-snug text-ink sm:text-2xl">
              Product Management · AI Product Development · <span className="text-green">Healthcare Technology</span> · Research &amp; Analytics
            </p>
            <p className="mt-5 max-w-2xl text-lg text-muted">{profile.intro}</p>
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Capabilities">
              {profile.capabilityTags.map((t) => <li key={t} className="rounded-full border border-line bg-surface/70 px-3 py-1 text-sm text-[#C9D2CD]">{t}</li>)}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink to="/explore" variant="primary" icon="explore" onClick={() => track("explore_mode_opened", { from: "hero" })}>Enter Explore Mode</ButtonLink>
              <ButtonLink to="/recruiter" icon="recruiter" onClick={() => track("recruiter_mode_opened")}>Recruiter Mode</ButtonLink>
              <ButtonLink to="/projects" icon="arrow" onClick={() => track("cta_click", { cta: "explore_work" })}>Explore my work</ButtonLink>
              <ButtonLink to={asset(profile.cvFile)} download="Gaurav-Kumar-Singh-CV.pdf" icon="download" onClick={() => track("cv_downloaded")}>Download CV</ButtonLink>
              <ButtonLink to="/contact" variant="ghost" icon="mail">Contact</ButtonLink>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-dim">
              <span className="inline-flex items-center gap-2"><span className="size-2 rounded-full bg-green" aria-hidden />{profile.availability}</span>
              <span>{profile.location}</span>
              <button type="button" onClick={intro.play} className="inline-flex items-center gap-1.5 underline decoration-line underline-offset-4 hover:text-ink"><Icon name="play" size={14} />Watch the intro film (1:05)</button>
            </div>
          </div>

          <div className="grid gap-8">
          <Portrait size={230} className="max-lg:hidden" />
          <aside aria-label="Verified highlights" className="card grid grid-cols-2 gap-px overflow-hidden bg-line/80 p-0 backdrop-blur-md">
            {highlights.map((h) => (
              <div key={h.label} className="bg-surface/90 p-5">
                <p className="font-display text-3xl font-bold">{h.value}</p>
                <p className="mt-1 text-sm font-medium text-ink">{h.label}</p>
                <p className="mt-2 text-xs leading-relaxed text-dim">{h.definition}</p>
              </div>
            ))}
            <p className="col-span-2 bg-surface/90 px-5 py-3 text-xs text-dim">Every figure is from the CV or a public repository. <Link to="/about#evidence" className="underline underline-offset-4 hover:text-ink">How evidence is labelled</Link></p>
          </aside>
          </div>
        </Container>

        {/* district strip */}
        <Container wide className="relative pb-12">
          <nav aria-label="Explore districts" className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {districts.map((d) => (
              <Link key={d.id} to={`/districts/${d.id}`} onClick={() => track("district_opened", { id: d.id, from: "home" })}
                className="card card-link flex items-center gap-3 bg-surface/85 px-4 py-3 backdrop-blur-md">
                <Icon name={d.icon} className={d.tone === "green" ? "text-green" : "text-cyan"} />
                <span className="text-sm font-medium leading-tight">{d.name}</span>
              </Link>
            ))}
          </nav>
        </Container>
      </section>

      {/* -------------------------------------------------------- FEATURED */}
      <section aria-labelledby="featured" className="py-20">
        <Container wide>
          <SectionHeader id="featured" eyebrow="Featured work" title="Products built, shipped and researched"
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
                  <span className="mt-4 flex flex-wrap gap-2">{r.outcomes.slice(0, 2).map((o) => <Pill key={o.label} tone="green">{o.value} {o.label}</Pill>)}</span>
                </Link>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* -------------------------------------------------------- RESEARCH */}
      <section aria-labelledby="research" className="border-t border-line-soft py-20">
        <Container wide className="grid gap-10 lg:grid-cols-[1fr_1fr]">
          <div>
            <SectionHeader id="research" eyebrow="Research & writing" title={`${corpusSummary.counts.written} product case studies, in public`}
              intro={`${(corpusSummary.counts.words / 1e6).toFixed(1)} million words and ${corpusSummary.counts.sources.toLocaleString("en-IN")} references across ${corpusSummary.counts.directories} studies — read straight from the repository.`} />
            <div className="flex flex-wrap gap-3">
              <ButtonLink to="/research" variant="primary" icon="research">Research library</ButtonLink>
              <ButtonLink to="/atlas" icon="arrow">Product Atlas</ButtonLink>
            </div>
          </div>
          <ul className="grid gap-3">
            {writing.map((w) => (
              <li key={w.title} className="card p-5">
                <div className="flex flex-wrap items-center justify-between gap-2"><span className="font-medium">{w.title}</span><Pill tone={w.status === "VERIFIED" ? "green" : "amber"}>{w.status}</Pill></div>
                <p className="mt-1 text-sm text-muted">{w.detail}</p>
              </li>
            ))}
            {legacy.lab_notes.slice(0, 2).map((n) => (
              <li key={n.slug}><Link to={`/lab-notes/${n.slug}`} className="card card-link block p-5"><span className="label">Lab note · {n.status}</span><span className="mt-1 block font-medium">{n.title}</span></Link></li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ------------------------------------------------------------- CTA */}
      <section aria-labelledby="cta" className="py-10">
        <Container wide>
          <div className="card grid-bg flex flex-col items-start gap-6 p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 id="cta" className="text-3xl font-bold sm:text-4xl">Hiring for product, analytics or health?</h2>
              <p className="mt-3 max-w-2xl text-muted">{profile.availability}. The 30-second Recruiter Mode has everything on one page.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <ButtonLink to="/recruiter" variant="primary" icon="recruiter">Recruiter Mode</ButtonLink>
              <ButtonLink to="/contact" icon="mail">Get in touch</ButtonLink>
              <Button onClick={intro.play} variant="ghost" icon="play">Intro film</Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
