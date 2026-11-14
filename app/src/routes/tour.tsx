import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { profile } from "~/content/profile";
import { projects } from "~/content/projects";
import { experience, education, certificationGroups, certificationCount } from "~/content/experience";
import { capabilities, CAPABILITY_CATEGORIES } from "~/content/capabilities";
import { legacy, corpusSummary } from "~/content/data";
import { CinematicImage } from "~/components/CinematicImage";
import { Pill, statusTone, cx } from "~/components/ui";
import { Icon } from "~/components/Icon";
import { seo, asset } from "~/lib/meta";
import { track } from "~/lib/analytics";

export const meta = () => seo("Explore my work — guided tour", `A guided tour of ${profile.name}'s work in eight stages: experience, how I think, projects, skills, research and learning. Plays on its own or step by step.`, "/tour");

/**
 * "Explore my work": a guided, cinematic tour of the portfolio.
 *  - Auto mode advances on its own; a CSS animation is the timer (no JS frame loop), and it holds while
 *    the pointer or keyboard focus is inside the stage, while the tab is hidden, or when paused.
 *  - Manual mode never advances on its own. Reduced motion starts in manual with no transitions.
 *  - Previous / Next / chapter list / Pause–Resume / Skip are always available; ←, →, Space and Esc work too.
 *  - The URL keeps the stage and mode (?stage=projects&mode=manual), so any stage can be shared.
 * Every word comes from the content modules; nothing here adds a claim.
 */
interface Stage { id: string; title: string; kicker: string; art: string; dwell: number; body: () => ReactNode }

const live = projects.filter((p) => p.slug !== "90-day-case-studies");
const demonstrated = (c: string) => capabilities.filter((x) => x.category === c && x.status === "Demonstrated in work").length;
const degrees = education.filter((e) => e.kind === "Degree");
const programmes = education.filter((e) => e.kind !== "Degree");

const STAGES: Stage[] = [
  { id: "intro", title: profile.name, kicker: profile.brandLine, art: "gaurav-world-hero", dwell: 7000, body: () => (
    <>
      <p className="font-display text-2xl font-medium leading-snug text-ink sm:text-3xl">{profile.tagline}</p>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{profile.intro}</p>
      <p className="mt-6 inline-flex items-center gap-2 text-sm text-muted"><span aria-hidden className="size-1.5 rounded-full bg-green" />{profile.availability} · {profile.location}</p>
    </>
  ) },
  { id: "experience", title: "Research first, then product ownership", kicker: "Experience", art: "professional-experience", dwell: 10000, body: () => (
    <ol className="grid gap-3 lg:grid-cols-3">
      {experience.map((r) => (
        <li key={r.id}><Link to={`/experience/${r.id}`} className="tour-card block h-full">
          <span className="label">{r.period}</span>
          <span className="mt-2 block font-display text-lg font-bold leading-tight">{r.role}</span>
          <span className="block text-sm text-muted">{r.employer}</span>
          <span className="mt-3 flex flex-wrap gap-1.5">{r.outcomes.slice(0, 2).map((o) => <span key={o.label} className="rounded-full border border-line-soft px-2.5 py-0.5 text-xs text-muted"><b className="text-ink">{o.value}</b> {o.label}</span>)}</span>
        </Link></li>
      ))}
    </ol>
  ) },
  { id: "thinking", title: "How I approach product problems", kicker: "Product thinking", art: "how-i-think", dwell: 12000, body: () => (
    <>
      <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {legacy.loop.map((l, i) => (
          <li key={l.id} className="tour-card block !p-3">
            <span className="font-mono text-[11px] text-green">{String(i + 1).padStart(2, "0")}</span>
            <span className="mt-1 block font-display text-sm font-bold tracking-wide">{l.k}</span>
            {l.e[0] && <span className="mt-1 block text-xs leading-snug text-muted"><b className="text-ink">{l.e[0][0]}</b> {l.e[0][1]}</span>}
          </li>
        ))}
      </ol>
      <p className="mt-4 text-sm text-dim">Each stage of the loop carries evidence from real work. <Link to="/product-thinking" className="text-ink underline underline-offset-4">The full method, tools and challenges</Link></p>
    </>
  ) },
  { id: "projects", title: `${live.length} projects, each with its real status`, kicker: "Projects", art: "render-projects", dwell: 13000, body: () => (
    <>
      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {live.map((p) => (
          <li key={p.slug} className="tour-card flex flex-col !p-3.5">
            <Pill tone={statusTone(p.status)} className="self-start">{p.status}</Pill>
            <Link to={`/projects/${p.slug}`} className="mt-2 block font-display text-lg font-bold leading-tight hover:text-green">{p.name}</Link>
            <span className="block text-xs text-muted">{p.subtitle}</span>
            <span className="mt-auto flex gap-3 pt-3 text-xs"><Link to={`/projects/${p.slug}`} className="text-ink underline underline-offset-4">Case study</Link><Link to={`/worlds/${p.slug}`} className="text-muted underline underline-offset-4 hover:text-ink">In 3D</Link></span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-dim">Each card carries its real status — employment, independent builds and academic work are labelled differently.</p>
    </>
  ) },
  { id: "skills", title: "Capabilities, mapped to evidence", kicker: "Skills", art: "render-skills", dwell: 9000, body: () => (
    <>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {CAPABILITY_CATEGORIES.map((c) => (
          <li key={c}><Link to={`/skills?category=${encodeURIComponent(c)}`} className="tour-card block h-full !p-3">
            <span className="block text-sm font-medium">{c}</span>
            <span className="mt-1 block text-xs text-dim">{demonstrated(c)} demonstrated in work</span>
          </Link></li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-dim">{capabilities.length} capabilities. No percentages or self-ratings: each is “demonstrated” only when a project or role shows it.</p>
    </>
  ) },
  { id: "research", title: `${corpusSummary.counts.written} product case studies, in public`, kicker: "Research", art: "brand-90-day-case-studies", dwell: 10000, body: () => (
    <>
      <dl className="grid grid-cols-3 gap-3 sm:max-w-xl">
        {[[corpusSummary.counts.written, "studies written"], [`${(corpusSummary.counts.words / 1e6).toFixed(1)}M`, "words"], [corpusSummary.counts.sources.toLocaleString("en-IN"), "references"]].map(([v, l]) => (
          <div key={String(l)} className="border-l border-line pl-3"><dt className="sr-only">{l}</dt><dd className="font-display text-3xl font-bold">{v}</dd><dd className="text-xs text-dim">{l}</dd></div>
        ))}
      </dl>
      <p className="mt-4 max-w-2xl text-muted">Research and analysis of real companies’ products — not products I launched. Every study shows its evidence level.</p>
      <p className="mt-4 flex flex-wrap gap-3 text-sm"><Link to="/research" className="tour-link">Research library</Link><Link to="/universe?at=earth" className="tour-link">All 90 on the 3D Earth</Link><Link to="/atlas" className="tour-link">Atlas</Link></p>
    </>
  ) },
  { id: "learning", title: "Education and structured learning", kicker: "Learning", art: "render-about", dwell: 9000, body: () => (
    <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
      <div>
        <h3 className="label mb-2">Degrees</h3>
        <ol className="grid gap-1.5">{degrees.map((e) => <li key={e.id} className="text-sm"><b className="text-ink">{e.what}</b> <span className="text-muted">· {e.org} · {e.period}</span></li>)}</ol>
        <h3 className="label mb-2 mt-4">Programmes</h3>
        <ol className="grid gap-1.5">{programmes.map((e) => <li key={e.id} className="text-sm"><b className="text-ink">{e.what}</b> <span className="text-muted">· {e.org} · {e.period}</span>{"note" in e && e.note && <span className="block text-xs text-white/60">{e.note}</span>}</li>)}</ol>
      </div>
      <div>
        <h3 className="label mb-2">{certificationCount} certificates</h3>
        <ul className="grid gap-1.5">{certificationGroups.map((g) => <li key={g.issuer} className="text-sm"><b className="text-ink">{g.issuer}</b> <span className="text-muted">· {g.items.length}</span></li>)}</ul>
        <Link to="/about#certifications" className="tour-link mt-3 inline-block text-sm">All certificates</Link>
      </div>
    </div>
  ) },
  { id: "close", title: "Let’s talk", kicker: "Next", art: "render-contact", dwell: 0, body: () => (
    <>
      <p className="max-w-2xl text-lg text-muted">{profile.availability}. Everything in this tour has a page of its own.</p>
      <p className="mt-6 flex flex-wrap gap-3">
        <Link to="/contact" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-green px-5 font-semibold text-green-ink"><Icon name="mail" size={16} />Get in touch</Link>
        <Link to="/recruiter" className="tour-pill"><Icon name="recruiter" size={16} />Recruiter Mode</Link>
        <a href={asset(profile.cvFile)} download="Gaurav-Kumar-Singh-CV.pdf" className="tour-pill"><Icon name="download" size={16} />Download CV</a>
      </p>
      <p className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted"><span className="label">Explore on your own</span><Link to="/projects" className="tour-link">All projects</Link><Link to="/worlds" className="tour-link">Project worlds in 3D</Link><Link to="/universe" className="tour-link">90 studies in 3D</Link><Link to="/explore/city" className="tour-link">3D city</Link></p>
    </>
  ) },
];
const indexOf = (id: string | null) => Math.max(0, STAGES.findIndex((s) => s.id === id));

export default function Tour() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  // the page is prerendered without a query string: read ?stage and ?mode only once in the browser,
  // so the first client render matches the prerendered HTML (no hydration mismatch)
  const [mounted, setMounted] = useState(false);
  const i = mounted ? indexOf(params.get("stage")) : 0;
  const stage = STAGES[i];
  const [mode, setMode] = useState<"auto" | "manual">("auto");
  const [paused, setPaused] = useState(false);
  const [held, setHeld] = useState(false); // pointer or focus inside the stage
  const [hidden, setHidden] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [announce, setAnnounce] = useState(false);
  const main = useRef<HTMLDivElement>(null);
  const focusNext = useRef(false); // move focus to the new chapter heading after a user-driven change, once it has rendered

  useEffect(() => {
    const rm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(rm);
    setMode(params.get("mode") === "manual" || (rm && params.get("mode") !== "auto") ? "manual" : "auto");
    setMounted(true);
    const vis = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", vis);
    track("tour_opened", {});
    return () => document.removeEventListener("visibilitychange", vis);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const go = useCallback((n: number, by: "auto" | "user") => {
    const k = Math.min(STAGES.length - 1, Math.max(0, n));
    const p = new URLSearchParams(params); p.set("stage", STAGES[k].id);
    if (mode === "manual") p.set("mode", "manual"); else p.delete("mode");
    setParams(p, { replace: true, preventScrollReset: true });
    setAnnounce(by === "user");
    focusNext.current = by === "user";
  }, [params, setParams, mode]);
  const setModeTo = (m: "auto" | "manual") => {
    setMode(m); setPaused(false);
    const p = new URLSearchParams(params); if (m === "manual") p.set("mode", "manual"); else p.delete("mode");
    setParams(p, { replace: true, preventScrollReset: true });
  };
  const exit = () => navigate("/");

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest?.("input, textarea, select")) return;
      if (e.key === "ArrowRight") { e.preventDefault(); go(i + 1, "user"); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); go(i - 1, "user"); }
      else if (e.key === " " && mode === "auto" && !(e.target as HTMLElement)?.closest?.("button, a")) { e.preventDefault(); setPaused((x) => !x); }
      else if (e.key === "Escape") exit();
    };
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  });

  useEffect(() => {
    if (!focusNext.current) return;
    focusNext.current = false;
    main.current?.querySelector<HTMLElement>("[data-stage-title]")?.focus({ preventScroll: true });
  }, [i, mounted]);

  const last = i === STAGES.length - 1;
  const running = mode === "auto" && !paused && !held && !hidden && !last;
  const state = mode === "manual" ? "manual" : last ? "done" : paused ? "paused" : held ? "held" : hidden ? "hidden" : "playing";

  return (
    <div className="fixed inset-0 z-40 flex flex-col overflow-hidden bg-[#050807] text-white" data-testid="tour" data-state={state}>
      {/* backdrop: one image per stage, crossfaded */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {STAGES.map((s, n) => (
          <div key={s.id} className={cx("absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none", n === i ? "opacity-100" : "opacity-0")}>
            {Math.abs(n - i) <= 1 && <CinematicImage id={s.art} decorative sizes="100vw" className="h-full" imgClassName={cx("h-full object-cover", s.art === "gaurav-world-hero" ? "object-[100%_60%]" : "", s.art.startsWith("brand-") ? "opacity-40" : "opacity-55")} />}
          </div>
        ))}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#050807_0%,rgb(5_8_7/.94)_38%,rgb(5_8_7/.62)_70%,rgb(5_8_7/.35)_100%)] max-lg:bg-[linear-gradient(180deg,rgb(5_8_7/.55)_0%,#050807_55%)]" />
      </div>

      {/* top bar */}
      <header className="relative z-10 flex items-center justify-between gap-3 p-3 pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))] pt-[max(0.75rem,env(safe-area-inset-top))] sm:p-4">
        <button type="button" onClick={exit} className="tour-pill max-[379px]:px-3" data-testid="tour-exit"><Icon name="close" size={16} /><span className="max-[379px]:sr-only">Exit<span className="max-sm:hidden"> tour</span></span></button>
        <p className="font-display text-lg font-bold max-md:hidden">Gaurav<span className="text-green">.OS</span> <span className="ml-2 font-mono text-[11px] font-normal uppercase tracking-[.22em] text-white/50">Guided tour</span></p>
        <div className="flex items-center gap-2">
          <div role="radiogroup" aria-label="Tour mode" className="flex rounded-full border border-white/15 bg-black/40 p-1 text-sm backdrop-blur-md">
            {(["auto", "manual"] as const).map((m) => (
              <button key={m} type="button" role="radio" aria-checked={mode === m} onClick={() => setModeTo(m)} data-testid={`mode-${m}`}
                className={cx("min-h-10 rounded-full px-3.5", mode === m ? "bg-green font-semibold text-green-ink" : "text-white/75 hover:text-white")}>{m === "auto" ? "Auto" : "Manual"}</button>
            ))}
          </div>
          <Link to="/projects" className="tour-pill max-sm:px-3" data-testid="tour-skip">Skip<span className="max-sm:hidden"> tour</span><Icon name="arrow" size={16} /></Link>
        </div>
      </header>

      {/* the stage */}
      <div ref={main} className="relative z-10 flex min-h-0 flex-1 items-center overflow-y-auto px-4 pb-6 sm:px-8 lg:px-16"
        onPointerEnter={() => setHeld(true)} onPointerLeave={() => setHeld(false)}
        onFocus={(e) => { if ((e.target as HTMLElement).matches("a, button, input")) setHeld(true); }} onBlur={() => setHeld(false)}>
        {mounted && <section key={stage.id} aria-roledescription="slide" aria-label={`Stage ${i + 1} of ${STAGES.length}: ${stage.title}`} data-testid="tour-stage" data-stage={stage.id}
          className="w-full max-w-5xl py-6 motion-safe:animate-[stagein_.6s_cubic-bezier(.2,.7,.2,1)_both]">
          <p className="eyebrow mb-4">{String(i + 1).padStart(2, "0")} · {stage.kicker}</p>
          <h1 data-stage-title tabIndex={-1} className="font-display text-4xl font-bold leading-[1.02] outline-none sm:text-6xl">{stage.title}</h1>
          <div className="mt-6">{stage.body()}</div>
        </section>}
      </div>
      <p className="sr-only" aria-live={announce ? "polite" : "off"}>{`Stage ${i + 1} of ${STAGES.length}: ${stage.title}`}</p>

      {/* controls */}
      <footer className="relative z-10 border-t border-white/10 bg-black/50 pb-[max(0.75rem,env(safe-area-inset-bottom))] pl-3 pr-[92px] pt-3 backdrop-blur-md sm:pl-6 sm:pr-[104px]">{/* right room: Oz floats bottom-right */}
        <ol className="mb-3 grid gap-1.5" style={{ gridTemplateColumns: `repeat(${STAGES.length}, minmax(0, 1fr))` }} aria-label="Chapters">
          {STAGES.map((s, n) => (
            <li key={s.id}>
              <button type="button" onClick={() => go(n, "user")} aria-current={n === i ? "step" : undefined} aria-label={`Chapter ${n + 1}: ${s.kicker}`} data-testid="tour-chapter"
                className="group flex min-h-6 w-full flex-col justify-center text-left">
                <span className="relative block h-1 w-full overflow-hidden rounded-full bg-white/15">
                  <span className={cx("absolute inset-y-0 left-0 rounded-full bg-green", n < i && "w-full", n > i && "w-0")}
                    style={n === i ? (mounted && mode === "auto" && !last ? { width: "100%", animation: `tourprogress ${s.dwell}ms linear both`, animationPlayState: running ? "running" : "paused" } : { width: "100%" }) : undefined}
                    onAnimationEnd={n === i ? () => go(i + 1, "auto") : undefined} data-testid={n === i ? "tour-progress" : undefined} />
                </span>
                <span className={cx("mt-1.5 block truncate text-[11px] max-md:hidden", n === i ? "text-white" : "text-white/50 group-hover:text-white/80")}>{s.kicker}</span>
              </button>
            </li>
          ))}
        </ol>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => go(i - 1, "user")} disabled={i === 0} className="tour-pill disabled:opacity-40 max-[479px]:px-3" data-testid="tour-prev"><Icon name="back" size={16} /><span className="max-[479px]:sr-only">Previous</span></button>
            <button type="button" onClick={() => go(i + 1, "user")} disabled={last} className="tour-pill disabled:opacity-40" data-testid="tour-next">Next<Icon name="arrow" size={16} /></button>
            {mode === "auto" && !last && (
              <button type="button" onClick={() => setPaused((x) => !x)} aria-pressed={paused} className="tour-pill max-sm:px-3" data-testid="tour-pause">
                <Icon name={paused ? "play" : "pause"} size={16} /><span className="max-sm:sr-only">{paused ? "Resume" : "Pause"}</span>
              </button>
            )}
          </div>
          <p className="shrink-0 whitespace-nowrap text-xs text-white/60 max-[379px]:sr-only" data-testid="tour-status">{/* phones: the chapter bar above shows the same progress; Oz needs the room */}
            {i + 1} / {STAGES.length}<span className="max-sm:hidden"> · {state === "manual" ? "manual" : state === "done" ? "end of tour" : state === "paused" ? "paused" : state === "held" ? "holding while you read" : state === "hidden" ? "paused (tab hidden)" : "playing"}</span>
          </p>
        </div>
        {reduced && mode === "auto" && <p className="mt-2 text-xs text-white/60">Reduced motion is on: the tour still advances, without animation.</p>}
      </footer>
    </div>
  );
}
