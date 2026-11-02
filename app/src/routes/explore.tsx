import { lazy, Suspense, useEffect, useRef, useState, Component, type ReactNode } from "react";
import { Link, useSearchParams } from "react-router";
import { districts, districtById } from "~/content/districts";
import { Container, Button, cx } from "~/components/ui";
import { CinematicImage } from "~/components/CinematicImage";
import { Icon } from "~/components/Icon";
import { seo, asset } from "~/lib/meta";
import { track } from "~/lib/analytics";
import { Ambient } from "~/lib/ambient";

export const meta = () => seo("Explore Mode", "The Gaurav.OS world: six districts — Product Leadership, HealthTech Innovation, AI & Safety Lab, Research & Analytics, Professional Experience, Knowledge & Headquarters — each opening real portfolio content.", "/explore");

const Scene = lazy(() => import("~/components/explore/Scene"));

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
    if (i === null) { select(null); return; }
    select(districts[i].id);
    if (i === 0) track("tool_used", { tool: "guided_tour" });
  };
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
    <div role="group" aria-label="Guided tour" className="card flex flex-wrap items-center justify-between gap-3 border-green/40 p-3" data-testid="tour-bar">
      <p aria-live="polite" className="text-sm"><span className="label mr-2 !text-green">Guided tour</span>Stop {tour + 1} of {districts.length} · <b>{districts[tour].name}</b></p>
      <div className="flex gap-2">
        <Button icon="left" disabled={tour === 0} onClick={() => goTour(tour - 1)} aria-label="Previous stop">Previous</Button>
        {tour < districts.length - 1
          ? <Button variant="primary" onClick={() => goTour(tour + 1)} aria-label="Next stop">Next <Icon name="right" /></Button>
          : <ButtonLinkLike to="/recruiter" />}
        <Button variant="ghost" icon="close" onClick={() => goTour(null)}>End tour</Button>
      </div>
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
          <div><p className="font-mono text-sm text-green">DISTRICT {d.index}</p><h2 className="mt-1 text-2xl font-bold">{d.name}</h2></div>
          <button type="button" onClick={() => { setTour(null); select(null); }} aria-label="Close district" className="inline-flex size-10 items-center justify-center rounded-lg border border-line bg-bg/70"><Icon name="close" /></button>
        </div>
        <p className="mt-2 text-[#C9D2CD]">{d.summary}</p>
        <ul className="mt-4 grid gap-2">
          {d.destinations.map((x) => (
            <li key={x.to}><Link to={x.to} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-bg/80 px-4 py-2.5 hover:border-green/60">
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
      <Container wide className="flex flex-wrap items-end justify-between gap-4 py-6">
        <div>
          <p className="eyebrow mb-2">Explore Mode · Gaurav.OS world</p>
          <h1 className="text-3xl font-bold sm:text-4xl">Six districts, one portfolio</h1>
          <p className="mt-1 text-muted">Every district opens real content. Nothing essential lives only here — <Link to="/recruiter" className="text-green underline underline-offset-4">Recruiter Mode</Link> has it all on one page.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {tour === null && <Button variant="primary" icon="play" onClick={() => goTour(0)}>Guided tour</Button>}
          {mode === "3d" && <Button icon="reset" onClick={() => { setTour(null); select(null); setResetKey((k) => k + 1); }}>Reset camera</Button>}
          {mode === "3d" && <Button onClick={() => switchTo("2d")}>Map view</Button>}
          {mode === "2d" && webglOkSafe() && <Button onClick={() => switchTo("3d")} icon="explore">3D view</Button>}
          <Button icon={sound ? "sound" : "mute"} onClick={toggleSound} aria-pressed={sound} aria-label={sound ? "Turn ambient sound off" : "Turn ambient sound on"}>{sound ? "Sound on" : "Sound off"}</Button>
          <Link to="/recruiter" onClick={() => track("recruiter_mode_opened", { from: "explore" })} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line px-4 text-[15px] hover:border-green/60"><Icon name="recruiter" />Exit to Recruiter Mode</Link>
        </div>
        {soundError && <p role="alert" className="w-full text-sm text-amber">{soundError}</p>}
      </Container>

      {tourBar && <Container wide className="mb-3">{tourBar}</Container>}

      {mode === "pending" && <Container wide><p role="status" className="card grid min-h-[min(72vh,720px)] place-items-center p-10 text-center text-muted">Preparing Explore Mode…</p></Container>}

      {mode === "3d" && (
        <Container wide>
          <div className="relative h-[min(72vh,720px)] min-h-[460px] overflow-hidden rounded-2xl border border-line" data-testid="scene">
            <SceneBoundary onFail={() => { setMode("2d"); setWhy2d("The 3D scene failed to start, so the map is shown instead."); }}>
              <Suspense fallback={<p role="status" className="grid h-full place-items-center text-muted">Loading the 3D scene…</p>}>
                <Scene districts={districts} selected={selected} onSelect={(id) => { setTour(null); select(id); }} resetKey={resetKey} labels={labels} reduced={reduced} />
              </Suspense>
            </SceneBoundary>
            <nav aria-label="Districts" className="pointer-events-none absolute inset-0">
              <ul>
                {districts.map((x) => (
                  <li key={x.id}>
                    <button ref={(el) => { labels.current[x.id] = el; }} type="button" onClick={() => { setTour(null); select(x.id); }} aria-pressed={selected === x.id}
                      className={cx("pointer-events-auto absolute left-0 top-0 inline-flex items-center gap-2 whitespace-nowrap rounded-xl border px-3 py-2 text-sm backdrop-blur transition-colors",
                        selected === x.id ? "border-green bg-green text-green-ink font-semibold" : "border-line bg-bg/80 text-ink hover:border-green/60")}>
                      <Icon name={x.icon} size={16} />{x.name}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            <p className="pointer-events-none absolute bottom-3 left-4 text-xs text-dim">Drag to orbit · scroll to zoom · Tab through districts · Esc to close · abstract architecture, not real facilities</p>
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
              <div className="relative">
              <CinematicImage id="gaurav-world-hero" decorative sizes="(min-width: 1280px) 60vw, 100vw" />
              <nav aria-label="Districts" className="absolute inset-0">
                <ul>
                  {districts.map((x) => (
                    <li key={x.id}><button type="button" onClick={() => { setTour(null); select(x.id); }} aria-pressed={selected === x.id} aria-label={x.name}
                      style={{ left: `${x.world[0]}%`, top: `${x.world[1]}%` }}
                      className={cx("absolute h-[11%] w-[17%] min-h-8 -translate-x-1/2 -translate-y-1/2 rounded-xl border-2 transition-colors",
                        selected === x.id ? "border-green bg-green/15 shadow-[0_0_24px_rgb(77_255_77/.45)]" : "border-transparent hover:border-green/70 focus-visible:border-green")} /></li>
                  ))}
                </ul>
              </nav>
              </div>
              <figcaption className="absolute bottom-2 left-3 rounded-md bg-black/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[.14em] text-white/80">Illustration · select a district</figcaption>
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
  return <Link to={to} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-green px-4 font-semibold text-green-ink">Finish in Recruiter Mode <Icon name="arrow" /></Link>;
}
function webglOkSafe() { return typeof document !== "undefined" && webglOk(); }
