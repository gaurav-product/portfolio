import { Component, lazy, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router";
import { destinations, destinationBySlug, CLUSTERS, EARTH_CREDIT, type Destination } from "~/content/universe";
import { projectBySlug } from "~/content/projects";
import { CinematicImage } from "~/components/CinematicImage";
import { Pill, cx } from "~/components/ui";
import { Icon } from "~/components/Icon";
import { seo } from "~/lib/meta";
import { track } from "~/lib/analytics";
import { audio } from "~/universe/audio";
import { SoundController } from "~/universe/SoundController";
import { CaseStudyPanel, Lightbox } from "~/universe/Panels";
import { CLUSTER_COLOR_DOM } from "~/universe/colors";
import type { SceneApi, SceneEvents, Tier } from "~/universe/bus";
import type { Route } from "./+types/universe";

const Scene = lazy(() => import("~/universe/Scene"));
const SEEN = "gos-universe-intro";

export const meta = ({ params }: Route.MetaArgs) => {
  const d = params.slug ? destinationBySlug(params.slug) : null;
  return d
    ? seo(`${d.name} — Product Universe`, `${d.name} (${d.statusLabel}). ${d.oneLine}`, `/universe/${d.slug}`)
    : seo("Explore the Product Universe", "A cinematic 3D Earth: every Gaurav.OS project, research corpus and concept in development as a destination, each with its own 3D world, real screenshots and an honest case study.", "/universe");
};

function webgl() { try { const c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); } catch { return false; } }
/** True when WebGL is drawn on the CPU (no graphics processor): 3D would be slow, so the list leads. */
function softwareGL() {
  try {
    const gl = document.createElement("canvas").getContext("webgl"); const ext = gl?.getExtension("WEBGL_debug_renderer_info");
    const name = String(ext ? gl!.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl?.getParameter(gl.RENDERER) ?? "");
    return /swiftshader|llvmpipe|softpipe|software|basic render/i.test(name);
  } catch { return false; }
}
function detectTier(forced: string | null): Tier {
  if (forced === "high" || forced === "laptop" || forced === "mobile") return forced;
  if (matchMedia("(pointer: coarse)").matches || innerWidth < 768) return "mobile";
  return (navigator.hardwareConcurrency ?? 8) <= 4 ? "laptop" : "high";
}
const store = { get: (k: string) => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* ignore */ } } };

export default function Universe() {
  const { slug } = useParams();
  const [params] = useSearchParams();
  const loc = useLocation();
  const navigate = useNavigate();
  const world = slug ? destinationBySlug(slug) ?? null : null;
  const state = (loc.state ?? {}) as { fromEarth?: boolean; returnFrom?: string };

  const [mode, setMode] = useState<"3d" | "2d" | null>(null);
  const [why2d, setWhy2d] = useState("");
  const [tier, setTier] = useState<Tier>("high");
  const [reduced, setReduced] = useState(false);
  const [intro, setIntro] = useState(false);
  const [introP, setIntroP] = useState(1);
  const [titlesOff, setTitlesOff] = useState(false);
  const [readyKey, setReadyKey] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [fadeFor, setFadeFor] = useState<string | null>(null);
  const [listOpen, setListOpen] = useState(false);
  const [section, setSection] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [compact, setCompact] = useState(false);
  const [software, setSoftware] = useState(false);
  const api = useRef<SceneApi | null>(null);
  const preview = useRef<HTMLDivElement | null>(null);
  const canvasBox = useRef<HTMLDivElement>(null);

  /* decide 3D or 2D, the tier and the intro, once, in the browser */
  useEffect(() => {
    const rm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(rm); setCompact(innerWidth < 900);
    const forced = params.get("view");
    if (forced === "2d") { setMode("2d"); setWhy2d("You chose the list view."); return; }
    if (!webgl()) { setMode("2d"); setWhy2d("The 3D universe needs WebGL, which this browser does not provide — every destination is listed here instead."); return; }
    setTier(detectTier(params.get("tier")));
    if (!params.get("tier") && softwareGL()) { setSoftware(true); setMode("2d"); setWhy2d("This device draws 3D without a graphics processor, which would be slow — so the list view leads. You can still start the 3D universe."); return; }
    const wantIntro = !slug && !state.returnFrom && (params.get("intro") === "1" || !store.get(SEEN));
    setIntro(wantIntro); setIntroP(wantIntro && !rm ? 0 : 1);
    setMode("3d");
    track("universe_opened", { slug: slug ?? "earth" });
    const onResize = () => setCompact(innerWidth < 900);
    addEventListener("resize", onResize); return () => removeEventListener("resize", onResize);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => { audio.ambientWanted(true); audio.cue("enter"); return () => audio.ambientWanted(false); }, []);
  useEffect(() => { setSection(null); setLightbox(null); setHovered(null); if (world) { setIntro(false); setIntroP(1); } }, [world]);
  const sceneKey = world?.slug ?? "earth";
  const ready = readyKey === sceneKey;
  // the cut to black lasts until the destination world reports ready (or 2.5 s at most)
  const fade = fadeFor !== null && readyKey !== fadeFor && mode === "3d";
  useEffect(() => { if (!fadeFor) return; const t = setTimeout(() => setFadeFor(null), 2500); return () => clearTimeout(t); }, [fadeFor]);

  const select = (s: string) => {
    track("universe_marker", { slug: s }); setListOpen(false); setHovered(null);
    if (mode !== "3d" || !api.current) { navigate(`/universe/${s}`, { state: { fromEarth: true } }); return; }
    api.current.fly(s);
  };
  const backToEarth = () => { if (!world) return; audio.cue("back"); navigate("/universe", { state: { returnFrom: world.slug } }); };
  const exit = () => { if (window.history.length > 1 && !document.referrer.includes("/universe") && loc.key !== "default") navigate(-1); else navigate("/"); };

  const events = useRef<SceneEvents>(null!);
  events.current = {
    onHover: (s) => setHovered(s),
    onSelect: select,
    onArrive: (s) => { setIntro(false); setFadeFor(s); setTimeout(() => navigate(`/universe/${s}`, { state: { fromEarth: true } }), reduced ? 0 : 380); },
    onIntro: (p) => { setIntroP(p); if (p >= 1) store.set(SEEN, "1"); },
    onHotspot: (k) => { audio.cue("panel"); setSection(k); },
    onPanel: (i) => { audio.cue("panel"); setLightbox(i); },
    onReady: (k) => setReadyKey(k),
  };

  /* keyboard control of the 3D view */
  const onKey = (e: React.KeyboardEvent) => {
    const a = api.current; if (!a) return;
    const m: Record<string, () => void> = {
      ArrowLeft: () => a.rotate(-0.22, 0), ArrowRight: () => a.rotate(0.22, 0), ArrowUp: () => a.rotate(0, -0.15), ArrowDown: () => a.rotate(0, 0.15),
      "+": () => a.zoom(0.85), "=": () => a.zoom(0.85), "-": () => a.zoom(1.18), _: () => a.zoom(1.18),
    };
    if (m[e.key]) { e.preventDefault(); m[e.key](); }
    if (e.key === "Enter" && hovered && !world) { e.preventDefault(); select(hovered); }
  };
  // Skip works even before the Earth has loaded: the intro simply never starts
  const skip = () => { api.current?.skipIntro(); setIntro(false); setIntroP(1); store.set(SEEN, "1"); canvasBox.current?.focus(); };
  const replay = () => { setTitlesOff(false); setIntroP(0); setIntro(true); api.current?.replayIntro(); };

  if (slug && !world) return <Shell exit={exit}><div className="grid h-full place-items-center p-6 text-center"><div><h1 className="text-3xl font-bold">No destination called “{slug}”</h1><p className="mt-3 text-muted"><Link to="/universe" className="underline underline-offset-4">Back to the Earth</Link></p></div></div></Shell>;

  const hd = hovered ? destinationBySlug(hovered) : null;
  const inIntro = !world && introP < 1;
  const showTitles = !world && !titlesOff && intro && mode === "3d";

  return (
    <Shell exit={exit} world={world} onBack={backToEarth} onList={world ? undefined : () => setListOpen(!listOpen)} listOpen={listOpen}>
      {!world && mode === "3d" && <h1 className="sr-only">Explore the Product Universe</h1>}
      {mode === "3d" && (
        <div ref={canvasBox} tabIndex={0} onKeyDown={onKey} data-testid="universe-canvas" role="application" aria-roledescription="3D view"
          aria-label={world ? `3D view of the ${world.name} world. Arrow keys rotate, plus and minus zoom. The case study is in the panel.` : "3D Earth. Arrow keys rotate, plus and minus zoom. Use the destination list to choose a project."}
          className="absolute inset-0 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-green/60">
          <CanvasBoundary onFail={() => { setMode("2d"); setWhy2d("The 3D scene could not start on this device, so every destination is listed here instead."); }}>
            <Suspense fallback={null}>
              <Scene list={destinations} world={world} tier={tier} reduced={reduced} paused={lightbox !== null} events={events} api={api} preview={preview}
                hovered={hovered} intro={intro} returnFrom={state.returnFrom ?? null} fromEarth={!!state.fromEarth}
                hotspots={world ? hotspotsFor(world) : []} />
            </Suspense>
          </CanvasBoundary>
        </div>
      )}

      {/* loading and the cut between Earth and a world */}
      {/* title card: prerendered, so the first paint is never empty; it gives way when the scene is ready */}
      {(mode === null || (mode === "3d" && !ready)) && !(showTitles && introP > 0.02) && (
        <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center px-6 text-center" data-testid="title-card">
          <div>
            <p className="font-display text-4xl font-bold sm:text-6xl">Gaurav<span className="text-green">.OS</span></p>
            <p role="status" className="mt-3 font-mono text-xs uppercase tracking-[.3em] text-white/60">{world ? `Entering ${world.name}…` : "Product Universe · loading"}</p>
          </div>
        </div>
      )}
      <div aria-hidden className={cx("pointer-events-none absolute inset-0 z-30 bg-black transition-opacity duration-500", fade ? "opacity-100" : "opacity-0")} />

      {/* opening titles */}
      {showTitles && (
        <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center px-6 text-center" data-testid="intro-titles">
          <div>
            <p className={cx("font-display text-5xl font-bold tracking-tight text-white transition-all duration-1000 sm:text-7xl", introP > 0.02 && introP < 0.62 ? "opacity-100" : "opacity-0 -translate-y-2")}>Gaurav<span className="text-green">.OS</span></p>
            <p className={cx("mt-4 font-mono text-sm uppercase tracking-[.4em] text-[#35D6D0] transition-opacity delay-300 duration-1000", introP > 0.14 && introP < 0.62 ? "opacity-100" : "opacity-0")}>Product × AI × Building</p>
            <div className={cx("transition-opacity duration-1000", introP >= 0.74 ? "opacity-100" : "opacity-0")}>
              <p className="font-display text-3xl font-bold text-white sm:text-5xl">Explore the Product Universe</p>
              <p className="mt-3 text-white/70">Drag to turn the Earth. Choose a light to enter its world.</p>
              {introP >= 1 && <button type="button" onClick={() => { setTitlesOff(true); canvasBox.current?.focus(); }} className="pointer-events-auto mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-green px-6 font-semibold text-green-ink">Enter exploration<Icon name="arrow" /></button>}
            </div>
          </div>
        </div>
      )}
      {inIntro && mode === "3d" && <button type="button" onClick={skip} className="absolute bottom-6 left-1/2 z-20 inline-flex min-h-11 -translate-x-1/2 items-center gap-2 rounded-full border border-white/25 bg-black/50 px-5 text-sm text-white backdrop-blur hover:bg-white/10" data-testid="skip-intro"><Icon name="skip" />Skip intro</button>}

      {/* hover preview that follows its marker */}
      {mode === "3d" && !world && (
        <div ref={preview} data-visible="false" aria-hidden className="pointer-events-none absolute left-0 top-0 z-10 w-[260px] opacity-0 transition-opacity duration-200 data-[visible=true]:opacity-100" style={{ marginLeft: 18, marginTop: -40 }}>
          {hd && <PreviewCard d={hd} />}
        </div>
      )}

      {/* the accessible destination list — also the whole experience in 2D */}
      {!world && (mode === "2d" || listOpen) && (
        <DestinationList flat={mode === "2d"} why={why2d} onStart3d={software ? () => { setSoftware(false); setTier("laptop"); setReadyKey(null); setMode("3d"); } : undefined} onPick={select} onFocus={(s) => { setHovered(s); api.current?.face(s); }} onClose={() => setListOpen(false)} />
      )}

      {!world && mode === "3d" && !inIntro && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-wrap items-end justify-between gap-3 p-4 text-xs text-white/60 sm:p-6">
          <p className="pointer-events-auto max-w-md">{compact ? "Drag to turn · pinch to zoom · tap a light" : "Drag to turn · scroll to zoom · click a light · or use the list"}. Positions are a visual layout, not where the work happened.</p>
          <div className="pointer-events-auto flex flex-wrap items-center gap-3">
            <button type="button" onClick={replay} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/20 px-4 text-white/80 hover:bg-white/10"><Icon name="reset" size={16} />Replay intro</button>
            <a href={EARTH_CREDIT.href} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">{EARTH_CREDIT.text}</a>
          </div>
        </div>
      )}

      {world && <CaseStudyPanel key={world.slug} d={world} section={section} onSection={setSection} onGallery={(i) => { audio.cue("panel"); setLightbox(i); }} onBack={backToEarth} compact={compact} />}
      {world && lightbox !== null && <Lightbox items={world.gallery} index={lightbox} onIndex={setLightbox} onClose={() => setLightbox(null)} />}
    </Shell>
  );
}

/** The building's floor directory: only sections the project actually has, in case-study order. */
function hotspotsFor(d: Destination) {
  const p = projectBySlug(d.slug); if (!p) return [];
  return d.sectionOrder.flatMap((k) => { const s = p.sections.find((x) => x.key === k); return s ? [{ key: k, title: s.title }] : []; }).slice(0, 7);
}

/* ---------------------------------------------------------------- frame */
function Shell({ children, exit, world, onBack, onList, listOpen }: { children: ReactNode; exit: () => void; world?: Destination | null; onBack?: () => void; onList?: () => void; listOpen?: boolean }) {
  return (
    <div className="fixed inset-0 z-40 overflow-hidden bg-[#020405] text-white" data-testid="universe">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-3 p-3 sm:p-4">
        <div className="pointer-events-auto flex items-center gap-2">
          <button type="button" onClick={exit} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-black/40 px-4 text-sm backdrop-blur-md hover:bg-white/10" data-testid="exit-universe"><Icon name="close" size={16} /><span>Exit<span className="max-sm:hidden"> cinematic mode</span></span></button>
          {world && onBack && <button type="button" onClick={onBack} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-black/40 px-4 text-sm backdrop-blur-md hover:bg-white/10" data-testid="back-to-earth"><Icon name="back" size={16} />Earth</button>}
        </div>
        <p className="pointer-events-none font-display text-lg font-bold max-md:hidden">Gaurav<span className="text-green">.OS</span> <span className="ml-2 font-mono text-[11px] font-normal uppercase tracking-[.22em] text-white/50">Product Universe</span></p>
        <div className="pointer-events-auto flex items-center gap-2">
          {onList && <button type="button" onClick={onList} aria-expanded={listOpen} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-black/40 px-4 text-sm backdrop-blur-md hover:bg-white/10" data-testid="destinations-toggle"><Icon name="menu" size={16} /><span className="max-sm:sr-only">Destinations</span></button>}
          <Link to="/recruiter" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-black/40 px-4 text-sm backdrop-blur-md hover:bg-white/10"><Icon name="recruiter" size={16} /><span className="max-sm:sr-only">Recruiter view</span></Link>
          <SoundController />
        </div>
      </div>
      {children}
    </div>
  );
}

function PreviewCard({ d }: { d: Destination }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/15 bg-[#0B1110]/90 shadow-2xl backdrop-blur-xl">
      {d.art ? <CinematicImage id={d.art} decorative sizes="260px" imgClassName="aspect-[16/9] object-cover" />
        : <div className="grid aspect-[16/9] place-items-center bg-[radial-gradient(circle_at_30%_20%,#2a1d14,#0B1110)] font-mono text-[10px] uppercase tracking-[.2em] text-[#FF9E6B]">Concept in development</div>}
      <div className="p-3.5">
        <div className="flex flex-wrap items-center gap-1.5"><Pill tone={d.tone}>{d.statusLabel}</Pill></div>
        <p className="mt-2 font-display text-lg font-bold leading-tight">{d.name}</p>
        <p className="text-xs text-white/60">{d.category}</p>
        <p className="mt-2 line-clamp-3 text-[13px] text-white/80">{d.oneLine}</p>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[.16em] text-green">Click to enter</p>
      </div>
    </div>
  );
}

function DestinationList({ flat, why, onPick, onFocus, onClose, onStart3d }: { flat: boolean; why: string; onPick: (s: string) => void; onFocus: (s: string) => void; onClose: () => void; onStart3d?: () => void }) {
  const groups = useMemo(() => CLUSTERS.map((c) => ({ c, items: destinations.filter((d) => d.cluster === c) })), []);
  const first = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (!flat) first.current?.focus(); }, [flat]);
  return (
    <nav aria-label="Destinations" data-testid="destination-list" onKeyDown={(e) => { if (e.key === "Escape" && !flat) { e.stopPropagation(); onClose(); } }}
      className={cx("overflow-y-auto text-white", flat ? "absolute inset-0 z-10 px-4 pb-16 pt-24 sm:px-8" : "absolute z-20 bottom-4 left-4 top-[76px] w-[min(380px,calc(100%-2rem))] rounded-3xl border border-white/10 bg-[#0B1110]/92 p-5 backdrop-blur-xl")}>
      {flat && <><h1 className="font-display text-4xl font-bold">The Product Universe</h1><p className="mt-2 max-w-2xl text-white/70">{why}</p>
        {onStart3d && <button type="button" onClick={onStart3d} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full border border-green/50 px-5 text-sm text-green hover:bg-green/10"><Icon name="explore" size={16} />Start the 3D universe anyway</button>}</>}
      {groups.map(({ c, items }, gi) => (
        <section key={c} className={flat ? "mt-10" : gi ? "mt-6" : ""}>
          <h2 className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[.2em] text-white/60"><span className="size-2 rounded-full" style={{ background: CLUSTER_COLOR_DOM[c] }} />{c}{c === "Emerging Ventures" && <span className="normal-case tracking-normal text-[#FF9E6B]">· concepts, not built</span>}</h2>
          <ul className={cx("grid gap-2", flat && "sm:grid-cols-2 lg:grid-cols-3")}>
            {items.map((d, i) => (
              <li key={d.slug}>
                <button ref={gi === 0 && i === 0 ? first : undefined} type="button" onClick={() => onPick(d.slug)} onFocus={() => onFocus(d.slug)} onMouseEnter={() => onFocus(d.slug)}
                  className="group flex w-full items-start gap-3 rounded-2xl border border-white/10 p-3 text-left hover:border-green/50 focus-visible:border-green">
                  {flat && d.art && <CinematicImage id={d.art} decorative sizes="96px" className="w-24 shrink-0 overflow-hidden rounded-lg" imgClassName="aspect-[4/3] object-cover" />}
                  <span className="min-w-0">
                    <span className="block font-semibold">{d.name}</span>
                    <span className="block text-xs text-white/60">{d.category}</span>
                    <Pill tone={d.tone} className="mt-1.5">{d.statusLabel}</Pill>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
      {flat && <p className="mt-10 text-sm text-white/60"><Link to="/projects" className="underline underline-offset-4">Classic project list</Link> · <Link to="/ventures" className="underline underline-offset-4">Emerging Ventures</Link></p>}
    </nav>
  );
}

class CanvasBoundary extends Component<{ children: ReactNode; onFail: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFail(); }
  render() { return this.state.failed ? null : this.props.children; }
}
