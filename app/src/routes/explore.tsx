import { lazy, Suspense, useEffect, useRef, useState, Component, type ReactNode } from "react";
import { Link, useSearchParams } from "react-router";
import { districts, districtById } from "~/content/districts";
import { Container, Button, cx } from "~/components/ui";
import { CinematicImage } from "~/components/CinematicImage";
import { Icon } from "~/components/Icon";
import { seo, asset } from "~/lib/meta";
import { track } from "~/lib/analytics";
import { Ambient } from "~/lib/ambient";

export const meta = () => seo("Explore Mode", "Explore the Gaurav.OS world: six districts, from Product Leadership to AI & Safety, each opening real portfolio content.", "/explore");

const Scene = lazy(() => import("~/components/explore/Scene"));
const AUTO_MS = 6500;

function webglOk() {
  try { const c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); } catch { return false; }
}

class SceneBoundary extends Component<{ children: ReactNode; onFail: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFail(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function Explore() {
  const [params, setParams] = useSearchParams();
  const selected = districtById(params.get("d") ?? "")?.id ?? null;
  const [mode, setMode] = useState<"pending" | "3d" | "2d">("pending");
  const [why2d, setWhy2d] = useState("");
  const [reduced, setReduced] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [tour, setTour] = useState<number | null>(null);
  const [auto, setAuto] = useState(false);
  const [intro, setIntro] = useState(false); // cinematic opening (3D, full-tier GPUs, motion allowed)
  const [tier, setTier] = useState<"full" | "lite" | null>(null);
  const [sound, setSound] = useState(false);
  const [soundError, setSoundError] = useState("");
  const ambient = useRef<Ambient | null>(null);
  const labels = useRef<Record<string, HTMLElement | null>>({});
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(rm);
    const forced = params.get("view");
    if (forced === "2d") { setMode("2d"); setWhy2d("You chose the map view."); return; }
    if (!webglOk()) { setMode("2d"); setWhy2d("3D needs WebGL, which this browser does not provide, so the map is shown."); return; }
    if (forced !== "3d" && (innerWidth < 1024 || rm)) { setMode("2d"); setWhy2d(rm ? "Reduced motion is on, so the map is shown instead of the 3D scene." : "On smaller screens the lightweight map is shown by default."); return; }
    setMode("3d");
    if (!params.get("d")) setIntro(true);
    track("explore_mode_opened", { view: "3d" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => () => ambient.current?.dispose(), []);

  const select = (id: string | null, focusPanel = true) => {
    const n = new URLSearchParams(params);
    id ? n.set("d", id) : n.delete("d");
    setParams(n, { replace: true, preventScrollReset: true });
    if (id) { track("district_opened", { id }); if (focusPanel) setTimeout(() => panel.current?.focus({ preventScroll: true }), 50); }
  };
  const selectRef = useRef(select);
  selectRef.current = select;
  const selectedRef = useRef(selected);
  selectedRef.current = selected;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && selectedRef.current) { e.preventDefault(); setTour(null); selectRef.current(null); } };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, []);
  const switchTo = (m: "2d" | "3d") => { const n = new URLSearchParams(params); n.set("view", m); setParams(n, { replace: true }); setMode(m); if (m === "2d") setWhy2d("You chose the map view."); };

  const goTour = (i: number | null) => {
    setTour(i);
    if (i === null) { setAuto(false); select(null); return; }
    select(districts[i].id);
    if (i === 0) track("tool_used", { tool: "guided_tour" });
  };
  // Autoplay: each stop holds for a few seconds, then the camera flies on; it stops at the last stop.
  useEffect(() => {
    if (!auto || tour === null) return;
    if (tour >= districts.length - 1) { const t = setTimeout(() => setAuto(false), AUTO_MS); return () => clearTimeout(t); }
    const t = setTimeout(() => goTour(tour + 1), AUTO_MS);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto, tour]);
  const toggleSound = async () => {
    setSoundError("");
    try {
      ambient.current ??= new Ambient();
      if (sound) { await ambient.current.stop(); setSound(false); }
      else { await ambient.current.start(); setSound(true); }
    } catch { setSoundError("Sound is not available in this browser."); setSound(false); }
  };

  const d = selected ? districtById(selected)! : null;
  const tourBar = tour !== null && (
    <div role="group" aria-label="Guided tour" className="card relative flex flex-wrap items-center justify-between gap-3 overflow-hidden border-green/40 p-3" data-testid="tour-bar">
      <p aria-live="polite" className="text-sm"><span className="label mr-2 !text-green">Guided tour</span>Stop {tour + 1} of {districts.length} · <b>{districts[tour].name}</b></p>
      <div className="flex gap-2">
        <Button icon="left" disabled={tour === 0} onClick={() => goTour(tour - 1)} aria-label="Previous stop">Previous</Button>
        {tour < districts.length - 1
          ? <Button variant="primary" onClick={() => goTour(tour + 1)} aria-label="Next stop">Next <Icon name="right" /></Button>
          : <ButtonLinkLike to="/recruiter" />}
        <Button icon={auto ? "mute" : "play"} aria-pressed={auto} onClick={() => setAuto((a) => !a)}>Autoplay</Button>
        <Button variant="ghost" icon="close" onClick={() => goTour(null)}>End tour</Button>
      </div>
      {auto && <span aria-hidden key={tour} className="tour-progress absolute inset-x-0 bottom-0 h-0.5 origin-left bg-green" style={{ animationDuration: `${AUTO_MS}ms` }} />}
    </div>
  );

  const Panel = d && (
    <div ref={panel} tabIndex={-1} role="region" aria-label={`${d.name} district`} className="card relative overflow-hidden outline-none" data-testid="district-panel">
      <div className="relative">
        {d.image ? <CinematicImage id={d.image} decorative sizes="400px" imgClassName="aspect-[16/7] object-cover object-bottom" /> : <img src={asset(d.background)} alt="" className="aspect-[16/7] w-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
      </div>
      <div className="relative -mt-10 p-5">
        <div className="flex items-start justify-between gap-3">
          <div><p className="eyebrow">District {d.index}</p><h2 className="mt-2 text-2xl font-bold">{d.name}</h2></div>
          <button type="button" onClick={() => { setTour(null); select(null); }} aria-label="Close district" className="inline-flex size-10 items-center justify-center rounded-full border border-line bg-bg/70 hover:bg-raise"><Icon name="close" /></button>
        </div>
        <p className="mt-2 text-[#C9D2CD]">{d.summary}</p>
        <ul className="mt-4 grid gap-2">
          {d.destinations.map((x) => (
            <li key={x.to}><Link to={x.to} className="flex items-center justify-between gap-3 rounded-xl border border-line-soft bg-bg/70 px-4 py-3 transition-colors hover:border-green/40 hover:bg-raise">
              <span><span className="block font-medium">{x.label}</span><span className="block text-sm text-dim">{x.note}</span></span><Icon name="arrow" className="shrink-0 text-green" />
            </Link></li>
          ))}
        </ul>
        <Link to={`/districts/${d.id}`} className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-green">Open the {d.name} district page <Icon name="arrow" size={16} /></Link>
      </div>
    </div>
  );

  return (
    <div className="relative">
      <Container wide className="flex flex-wrap items-end justify-between gap-5 py-10">
        <div>
          <p className="eyebrow mb-2">Explore Mode · Gaurav.OS world</p>
          <h1 className="text-3xl font-bold sm:text-[44px] sm:leading-[1.05]">Six districts, one portfolio</h1>
          <p className="mt-3 max-w-2xl text-muted">Every district opens real content. Nothing essential lives only here — <Link to="/recruiter" className="text-green underline underline-offset-4">Recruiter Mode</Link> has it all on one page.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {tour === null && <Button variant="primary" icon="play" onClick={() => goTour(0)}>Guided tour</Button>}
          {mode === "3d" && <Button icon="reset" onClick={() => { setTour(null); select(null); setResetKey((k) => k + 1); }}>Reset camera</Button>}
          {mode === "3d" && <Button onClick={() => switchTo("2d")}>Map view</Button>}
          {mode === "2d" && webglOkSafe() && <Button onClick={() => switchTo("3d")} icon="explore">3D view</Button>}
          {/* a toggle keeps one stable name; its state is announced through aria-pressed (WCAG 2.5.3 label in name) */}
          <Button icon={sound ? "sound" : "mute"} onClick={toggleSound} aria-pressed={sound}>Ambient sound</Button>
          <Link to="/recruiter" onClick={() => track("recruiter_mode_opened", { from: "explore" })} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-5 text-[15px] font-medium transition-colors hover:border-ink/30 hover:bg-raise"><Icon name="recruiter" />Exit to Recruiter Mode</Link>
        </div>
        {soundError && <p role="alert" className="w-full text-sm text-amber">{soundError}</p>}
      </Container>

      {tourBar && <Container wide className="mb-3">{tourBar}</Container>}

      {mode === "pending" && <Container wide><p role="status" className="card grid min-h-[min(72vh,720px)] place-items-center p-10 text-center text-muted">Preparing Explore Mode…</p></Container>}

      {mode === "3d" && (
        <Container wide>
          <div className="relative h-[min(74vh,760px)] min-h-[460px] overflow-hidden rounded-3xl border border-line-soft" data-testid="scene" data-cursor="drag">
            <SceneBoundary onFail={() => { setMode("2d"); setWhy2d("The 3D scene failed to start, so the map is shown instead."); }}>
              <Suspense fallback={<p role="status" className="grid h-full place-items-center text-muted">Loading the 3D scene…</p>}>
                <Scene districts={districts} selected={selected} onSelect={(id) => { setTour(null); setAuto(false); select(id); }} resetKey={resetKey} labels={labels} reduced={reduced}
                  intro={intro} onIntroDone={() => setIntro(false)} onTier={setTier}
                  forceTier={params.get("tier") === "full" ? "full" : params.get("tier") === "lite" ? "lite" : undefined} />
              </Suspense>
            </SceneBoundary>
            <nav aria-label="Districts" className="pointer-events-none absolute inset-0">
              <ul>
                {districts.map((x) => (
                  <li key={x.id}>
                    <button ref={(el) => { labels.current[x.id] = el; }} type="button" onClick={() => { setTour(null); select(x.id); }} aria-pressed={selected === x.id}
                      className={cx("group pointer-events-auto absolute left-0 top-0 inline-flex min-h-10 items-center whitespace-nowrap rounded-full border px-3 text-sm backdrop-blur-md transition-colors",
                        selected === x.id ? "border-green bg-green text-green-ink font-semibold" : "border-line bg-bg/75 text-ink hover:border-green/60 focus-visible:border-green")}>
                      <Icon name={x.icon} size={16} />
                      {/* the name is always in the accessible name; visually it opens on hover, focus or selection — the world sign carries it otherwise */}
                      <span className={cx("overflow-hidden transition-[max-width,margin] duration-300", selected === x.id ? "ml-2 max-w-[260px]" : "max-w-0 group-hover:ml-2 group-hover:max-w-[260px] group-focus-visible:ml-2 group-focus-visible:max-w-[260px]")}>{x.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            {/* cinematic opening: letterbox bars and a title card while the camera descends */}
            <div aria-hidden className={cx("letterbox pointer-events-none absolute inset-x-0 top-0 bg-black transition-[height] duration-700", intro && tier === "full" ? "h-[11%]" : "h-0")} />
            <div aria-hidden className={cx("letterbox pointer-events-none absolute inset-x-0 bottom-0 bg-black transition-[height] duration-700", intro && tier === "full" ? "h-[11%]" : "h-0")} />
            {intro && tier === "full" && (
              <div className="intro-card pointer-events-none absolute inset-0 grid place-items-center text-center" aria-hidden>
                <div>
                  <p className="eyebrow">Gaurav.OS</p>
                  <p className="mt-3 font-display text-4xl font-bold text-ink sm:text-6xl">Six districts. One portfolio.</p>
                  <p className="mt-3 text-muted">Product · Health · AI safety · Research · Experience · Knowledge</p>
                </div>
              </div>
            )}
            {intro && tier === "full" && <Button onClick={() => { setIntro(false); setResetKey((k) => k + 1); }} className="!absolute right-4 top-4 z-10 !bg-bg/70 backdrop-blur" icon="skip">Skip intro</Button>}
            {/* district title card — the film's chapter title, lower left (the panel holds the detail) */}
            {d && !intro && (
              <div key={d.id} aria-hidden className="title-card pointer-events-none absolute bottom-12 left-6 hidden max-w-[44%] lg:block">
                <p className="eyebrow">District {d.index}</p>
                <p className="mt-2 font-display text-5xl font-bold leading-none text-ink [text-shadow:0_2px_24px_rgb(0_0_0/.8)]">{d.name}</p>
              </div>
            )}
            <p className="pointer-events-none absolute bottom-3 left-4 right-4 text-xs text-dim">Drag to orbit · scroll to zoom · Tab through districts · Esc to close · abstract architecture, not real facilities</p>
            {d && <div className="absolute right-3 top-3 max-h-[calc(100%-24px)] w-[min(400px,calc(100%-24px))] overflow-y-auto rounded-[var(--radius-card)]">{Panel}</div>}
          </div>
        </Container>
      )}

      {mode === "2d" && (
        <Container wide className="min-h-[min(72vh,720px)]">
          {why2d && <p role="status" className="mb-4 text-sm text-dim">{why2d}</p>}
          <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
            <figure className="card relative self-start overflow-hidden" data-testid="world-map">
              {/* the hotspot layer is exactly the image box, so percentages map onto the illustration */}
              <div className="kenburns relative">
              <CinematicImage id="gaurav-world-hero" decorative sizes="(min-width: 1280px) 60vw, 100vw" />
              <nav aria-label="Districts" className="absolute inset-0">
                <ul>
                  {districts.map((x) => (
                    <li key={x.id}><button type="button" onClick={() => { setTour(null); select(x.id); }} aria-pressed={selected === x.id} aria-label={x.name}
                      style={{ left: `${x.world[0]}%`, top: `${x.world[1]}%` }}
                      className={cx("hotspot absolute h-[11%] w-[17%] min-h-8 -translate-x-1/2 -translate-y-1/2 rounded-xl border-2 transition-colors",
                        selected === x.id ? "border-green bg-green/15 shadow-[0_0_24px_rgb(107_227_154/.45)]" : "border-transparent hover:border-green/70 focus-visible:border-green")} /></li>
                  ))}
                </ul>
              </nav>
              </div>
              <figcaption className="absolute bottom-2 left-3 rounded-full bg-black/60 px-2.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-[.08em] text-white/85">Illustration · select a district</figcaption>
            </figure>
            <div>{Panel ?? (
              <ul className="grid gap-2">
                {districts.map((x) => <li key={x.id}><button type="button" onClick={() => select(x.id)} className="card card-link flex w-full items-center gap-3 p-4 text-left"><Icon name={x.icon} className={x.tone === "green" ? "text-green" : "text-cyan"} /><span><span className="block font-medium">{x.name}</span><span className="block text-sm text-dim">{x.summary}</span></span></button></li>)}
              </ul>
            )}</div>
          </div>
        </Container>
      )}
    </div>
  );
}

function ButtonLinkLike({ to }: { to: string }) {
  return <Link to={to} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-green px-5 font-semibold text-green-ink hover:bg-[#8cebb2]">Finish in Recruiter Mode <Icon name="arrow" /></Link>;
}
function webglOkSafe() { return typeof document !== "undefined" && webglOk(); }
