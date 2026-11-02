import { lazy, Suspense, useEffect, useRef, useState, Component, type ReactNode } from "react";
import { Link, useSearchParams } from "react-router";
import { districts, districtById } from "~/content/districts";
import { Container, Button, cx } from "~/components/ui";
import { Icon } from "~/components/Icon";
import { seo, asset } from "~/lib/meta";
import { track } from "~/lib/analytics";

export const meta = () => seo("Explore Mode", "Six districts — Product Leadership, HealthTech Innovation, AI & Safety Lab, Research & Analytics, Experience & Growth, Knowledge & HQ — each opening real portfolio content.", "/explore");

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
  const labels = useRef<Record<string, HTMLElement | null>>({});
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(rm);
    const forced = params.get("view");
    if (forced === "2d") { setMode("2d"); setWhy2d("You chose the 2D map."); return; }
    if (!webglOk()) { setMode("2d"); setWhy2d("3D needs WebGL, which this browser does not provide."); return; }
    if (forced !== "3d" && (innerWidth < 1024 || rm)) { setMode("2d"); setWhy2d(rm ? "Reduced motion is on, so the map is shown instead of the 3D scene." : "On smaller screens the lightweight map is shown by default."); return; }
    setMode("3d");
    track("explore_mode_opened", { view: "3d" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const select = (id: string | null) => {
    const n = new URLSearchParams(params);
    id ? n.set("d", id) : n.delete("d");
    setParams(n, { replace: true, preventScrollReset: true });
    if (id) { track("district_opened", { id }); setTimeout(() => panel.current?.focus(), 50); }
  };
  const selectRef = useRef(select);
  selectRef.current = select;
  const selectedRef = useRef(selected);
  selectedRef.current = selected;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && selectedRef.current) { e.preventDefault(); selectRef.current(null); } };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, []);
  const switchTo = (m: "2d" | "3d") => { const n = new URLSearchParams(params); n.set("view", m); setParams(n, { replace: true }); setMode(m); if (m === "2d") setWhy2d("You chose the 2D map."); };
  const d = selected ? districtById(selected)! : null;

  const Panel = d && (
    <div ref={panel} tabIndex={-1} role="region" aria-label={`${d.name} district`} className="card relative overflow-hidden p-6 outline-none" data-testid="district-panel">
      <img src={asset(d.background)} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-25" />
      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div><p className="font-mono text-sm text-green">DISTRICT {d.index}</p><h2 className="mt-1 text-2xl font-bold">{d.name}</h2></div>
          <button type="button" onClick={() => select(null)} aria-label="Close district" className="inline-flex size-10 items-center justify-center rounded-lg border border-line bg-bg/70"><Icon name="close" /></button>
        </div>
        <p className="mt-2 text-[#C9D2CD]">{d.summary}</p>
        <ul className="mt-5 grid gap-2">
          {d.destinations.map((x) => (
            <li key={x.to}><Link to={x.to} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-bg/80 px-4 py-3 hover:border-green/60">
              <span><span className="block font-medium">{x.label}</span><span className="block text-sm text-dim">{x.note}</span></span><Icon name="arrow" className="shrink-0 text-green" />
            </Link></li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <div className="relative">
      <Container wide className="flex flex-wrap items-end justify-between gap-4 py-6">
        <div>
          <p className="eyebrow mb-2">Explore Mode</p>
          <h1 className="text-3xl font-bold sm:text-4xl">Six districts, one portfolio</h1>
          <p className="mt-1 text-muted">Every district opens real content. Nothing essential lives only in 3D — <Link to="/recruiter" className="text-green underline underline-offset-4">Recruiter Mode</Link> has it all on one page.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {mode === "3d" && <Button icon="reset" onClick={() => { select(null); setResetKey((k) => k + 1); }}>Reset camera</Button>}
          {mode === "3d" && <Button onClick={() => switchTo("2d")}>2D map</Button>}
          {mode === "2d" && webglOkSafe() && <Button onClick={() => switchTo("3d")} icon="explore">Try 3D</Button>}
        </div>
      </Container>

      {mode === "pending" && <Container wide><p role="status" className="card grid min-h-[min(72vh,720px)] place-items-center p-10 text-center text-muted">Preparing Explore Mode…</p></Container>}

      {mode === "3d" && (
        <Container wide>
          <div className="relative h-[min(72vh,720px)] min-h-[460px] overflow-hidden rounded-2xl border border-line" data-testid="scene">
            <SceneBoundary onFail={() => { setMode("2d"); setWhy2d("The 3D scene failed to start, so the map is shown instead."); }}>
              <Suspense fallback={<p role="status" className="grid h-full place-items-center text-muted">Loading the 3D scene…</p>}>
                <Scene districts={districts} selected={selected} onSelect={select} resetKey={resetKey} labels={labels} reduced={reduced} />
              </Suspense>
            </SceneBoundary>
            {/* DOM twin: real, focusable buttons projected onto the 3D districts */}
            <nav aria-label="Districts" className="pointer-events-none absolute inset-0">
              <ul>
                {districts.map((x) => (
                  <li key={x.id}>
                    <button ref={(el) => { labels.current[x.id] = el; }} type="button" onClick={() => select(x.id)} aria-pressed={selected === x.id}
                      className={cx("pointer-events-auto absolute left-0 top-0 inline-flex items-center gap-2 whitespace-nowrap rounded-xl border px-3 py-2 text-sm backdrop-blur transition-colors",
                        selected === x.id ? "border-green bg-green text-green-ink font-semibold" : "border-line bg-bg/80 text-ink hover:border-green/60")}>
                      <Icon name={x.icon} size={16} />{x.name}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            <p className="pointer-events-none absolute bottom-3 left-4 text-xs text-dim">Drag to orbit · scroll to zoom · Tab through districts · Esc to close · abstract architecture, not real facilities</p>
            {d && <div className="absolute right-3 top-3 w-[min(400px,calc(100%-24px))]">{Panel}</div>}
          </div>
        </Container>
      )}

      {mode === "2d" && (
        <Container wide className="min-h-[min(72vh,720px)]">
          {why2d && <p role="status" className="mb-4 text-sm text-dim">{why2d}</p>}
          <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
            <div className="card relative overflow-hidden">
              <img src={asset("/brand/spatial/district-map-2d.svg")} alt="" aria-hidden width={1600} height={1000} className="w-full" />
              <nav aria-label="Districts" className="absolute inset-0">
                <ul>
                  {districts.map((x) => (
                    <li key={x.id}><button type="button" onClick={() => select(x.id)} aria-pressed={selected === x.id} aria-label={x.name}
                      style={{ left: `${x.map[0]}%`, top: `${x.map[1]}%`, width: x.id === "knowledge-hq" ? "16%" : "14%", height: x.id === "knowledge-hq" ? "25%" : "9.6%" }}
                      className={cx("absolute -translate-x-1/2 -translate-y-1/2 rounded-xl border-2", x.id === "knowledge-hq" && "rounded-full", selected === x.id ? "border-green bg-green/10" : "border-transparent hover:border-green/60")} /></li>
                  ))}
                </ul>
              </nav>
            </div>
            <div>{Panel ?? <ul className="grid gap-2">{districts.map((x) => <li key={x.id}><button type="button" onClick={() => select(x.id)} className="card card-link flex w-full items-center gap-3 p-4 text-left"><Icon name={x.icon} className={x.tone === "green" ? "text-green" : "text-cyan"} /><span><span className="block font-medium">{x.name}</span><span className="block text-sm text-dim">{x.summary}</span></span></button></li>)}</ul>}</div>
          </div>
        </Container>
      )}
    </div>
  );
}

function webglOkSafe() { return typeof document !== "undefined" && webglOk(); }
