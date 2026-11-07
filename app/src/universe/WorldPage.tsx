import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import type { Destination } from "~/content/universe";
import { projectBySlug } from "~/content/projects";
import { cx } from "~/components/ui";
import { Icon } from "~/components/Icon";
import { track } from "~/lib/analytics";
import { audio } from "./audio";
import { CaseStudyPanel, Lightbox } from "./Panels";
import { CanvasBoundary, Shell, detectTier, softwareGL, webgl } from "./shell";
import type { SceneApi, SceneEvents, Tier } from "./bus";

const Scene = lazy(() => import("./Scene"));

/**
 * One 3D world (a project building, The Teardown workshop or a concept hall),
 * wherever it lives: /worlds/<slug>, /writing/the-teardown or /ventures/<slug>/world.
 * The building, panels and case-study panel are the same as before; only the
 * route and the back target (`d.back`) are configurable.
 */
export function WorldPage({ d, title }: { d: Destination; title: string }) {
  const loc = useLocation();
  const navigate = useNavigate();
  const arrive = !!(loc.state as { arrive?: boolean } | null)?.arrive;
  const [mode, setMode] = useState<"3d" | "2d" | null>(null);
  const [why2d, setWhy2d] = useState("");
  const [software, setSoftware] = useState(false);
  const [tier, setTier] = useState<Tier>("high");
  const [reduced, setReduced] = useState(false);
  const [compact, setCompact] = useState(false);
  const [ready, setReady] = useState(false);
  const [section, setSection] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const api = useRef<SceneApi | null>(null);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const p = new URLSearchParams(location.search);
    setReduced(matchMedia("(prefers-reduced-motion: reduce)").matches); setCompact(innerWidth < 900);
    const onResize = () => setCompact(innerWidth < 900);
    addEventListener("resize", onResize);
    if (p.get("view") === "2d") { setMode("2d"); setWhy2d("You chose the page view."); }
    else if (!webgl()) { setMode("2d"); setWhy2d("The 3D world needs WebGL, which this browser does not provide. The whole case study is in the panel."); }
    else {
      setTier(detectTier(p.get("tier")));
      if (!p.get("tier") && softwareGL()) { setSoftware(true); setMode("2d"); setWhy2d("This device draws 3D without a graphics processor, which would be slow, so the 3D building is off. The whole case study is in the panel."); }
      else { setMode("3d"); track("universe_opened", { slug: d.slug }); }
    }
    return () => removeEventListener("resize", onResize);
  }, [d.slug]);
  useEffect(() => { audio.ambientWanted(true); audio.cue("enter"); return () => audio.ambientWanted(false); }, []);
  useEffect(() => { setSection(null); setLightbox(null); setReady(false); }, [d.slug]);

  const events = useRef<SceneEvents>(null!);
  events.current = {
    onHover: () => {}, onSelect: () => {}, onIntro: () => {},
    onHotspot: (k) => { audio.cue("panel"); setSection(k); },
    onPanel: (i) => { audio.cue("panel"); setLightbox(i); },
    onReady: (k) => { if (k === d.slug) setReady(true); },
  };
  const onKey = (e: React.KeyboardEvent) => {
    const a = api.current; if (!a) return;
    const m: Record<string, () => void> = {
      ArrowLeft: () => a.rotate(-0.22, 0), ArrowRight: () => a.rotate(0.22, 0), ArrowUp: () => a.rotate(0, -0.15), ArrowDown: () => a.rotate(0, 0.15),
      "+": () => a.zoom(0.85), "=": () => a.zoom(0.85), "-": () => a.zoom(1.18), _: () => a.zoom(1.18),
    };
    if (m[e.key]) { e.preventDefault(); m[e.key](); }
  };
  const back = () => { audio.cue("back"); navigate(d.back.to); };
  const exit = () => { if (window.history.length > 1 && loc.key !== "default") navigate(-1); else navigate("/"); };

  return (
    <Shell exit={exit} title={title} back={{ to: d.back.to, label: d.back.label, onClick: () => audio.cue("back") }}>
      {mode === "3d" && (
        <div ref={box} tabIndex={0} onKeyDown={onKey} data-testid="universe-canvas" data-cursor="drag" role="application" aria-roledescription="3D view"
          aria-label={`3D view of the ${d.name} world. Arrow keys rotate, plus and minus zoom. The case study is in the panel.`}
          className="absolute inset-0 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-green/60">
          <CanvasBoundary onFail={() => { setMode("2d"); setWhy2d("The 3D scene could not start on this device. The whole case study is in the panel."); }}>
            <Suspense fallback={null}>
              <Scene world={d} tier={tier} reduced={reduced} paused={lightbox !== null} events={events} api={api} hotspots={hotspotsFor(d)} fromEarth={arrive} />
            </Suspense>
          </CanvasBoundary>
        </div>
      )}
      {(mode === null || (mode === "3d" && !ready)) && (
        <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center px-6 text-center" data-testid="title-card">
          <div>
            <p className="font-display text-4xl font-bold sm:text-6xl">Gaurav<span className="text-green">.OS</span></p>
            <p role="status" className="mt-3 font-mono text-xs uppercase tracking-[.3em] text-white/60">Entering {d.name}…</p>
          </div>
        </div>
      )}
      {mode === "2d" && (
        <div className="absolute inset-x-0 top-[76px] z-10 px-4 sm:px-8 min-[900px]:right-[calc(min(460px,40vw)+2rem)]" data-testid="world-2d">
          <p className="max-w-xl text-sm text-white/70">{why2d}</p>
          {software && <button type="button" onClick={() => { setSoftware(false); setTier("laptop"); setMode("3d"); }} className={cx("mt-3 inline-flex min-h-11 items-center gap-2 rounded-full border border-green/50 px-5 text-sm text-green hover:bg-green/10")}><Icon name="explore" size={16} />Start the 3D world anyway</button>}
          <p className="mt-3 text-sm text-white/60">{d.external
            ? <a href={d.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Open on LinkedIn</a>
            : <Link to={d.href} className="underline underline-offset-4">Read the full page</Link>}</p>
        </div>
      )}
      <CaseStudyPanel key={d.slug} d={d} section={section} onSection={setSection} onGallery={(i) => { audio.cue("panel"); setLightbox(i); }} onBack={back} backLabel={d.back.label.replace(/^All/, "all")} compact={compact} />
      {lightbox !== null && <Lightbox items={d.gallery} index={lightbox} onIndex={setLightbox} onClose={() => setLightbox(null)} />}
    </Shell>
  );
}

/** The building's floor directory: only sections the project actually has, in case-study order. */
function hotspotsFor(d: Destination) {
  const p = projectBySlug(d.slug); if (!p) return [];
  return d.sectionOrder.flatMap((k) => { const s = p.sections.find((x) => x.key === k); return s ? [{ key: k, title: s.title }] : []; }).slice(0, 7);
}
