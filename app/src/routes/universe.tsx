import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router";
import { corpus } from "~/content/corpus";
import type { Study } from "~/content/data";
import { CAT_COLOR, HAS, LEVELS, LEVEL_NOTE, categoriesOf, filterFromParams, hasFlag, isFiltered, matches, studyLayout, type HasKey, type StudyFilter } from "~/content/studyMap";
import { EARTH_CREDIT } from "~/content/universe";
import { Pill, evidenceTone, cx } from "~/components/ui";
import { Icon } from "~/components/Icon";
import { seo } from "~/lib/meta";
import { track } from "~/lib/analytics";
import { audio } from "~/universe/audio";
import { CanvasBoundary, Shell, detectTier, shellButton, softwareGL, store, webgl } from "~/universe/shell";
import type { SceneApi, SceneEvents, Tier } from "~/universe/bus";

const Scene = lazy(() => import("~/universe/Scene"));
const SEEN = "gos-universe-intro";
const studies = corpus.studies;
const byDay = new Map(studies.map((s) => [s.day, s]));
const { pins, regions } = studyLayout(studies);
const CATS = categoriesOf(studies);

export const meta = () => seo("90 product case studies in 3D", `A 3D Earth with one marker for each of the ${studies.length} published product-management case studies, grouped by category and sized by evidence level. Search, filter and open any study.`, "/universe");

/** /universe: the Earth of the 90 individual case studies. State lives in the URL (?study, ?q, ?cat, ?ev, ?has). */
export default function Universe() {
  const [params, setParams] = useSearchParams();
  const loc = useLocation();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"3d" | "2d" | null>(null);
  const [why2d, setWhy2d] = useState("");
  const [tier, setTier] = useState<Tier>("high");
  const [reduced, setReduced] = useState(false);
  const [intro, setIntro] = useState(false);
  const [introP, setIntroP] = useState(1);
  const [titlesOff, setTitlesOff] = useState(false);
  const [ready, setReady] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [listOpen, setListOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [software, setSoftware] = useState(false);
  const api = useRef<SceneApi | null>(null);
  const preview = useRef<HTMLDivElement | null>(null);
  const canvasBox = useRef<HTMLDivElement>(null);

  /* URL state */
  const filter = useMemo(() => filterFromParams(params), [params]);
  const shown = useMemo(() => studies.filter((s) => matches(s, filter)), [filter]);
  const dim = useMemo(() => (isFiltered(filter) ? new Set(shown.map((s) => s.day)) : null), [filter, shown]);
  const selDay = Number(params.get("study"));
  const selected = byDay.has(selDay) ? selDay : null;
  const study = selected !== null ? byDay.get(selected)! : null;

  /* decide 3D or 2D, the tier and the intro, once, in the browser */
  useEffect(() => {
    const rm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(rm); setCompact(innerWidth < 900);
    const onResize = () => setCompact(innerWidth < 900);
    addEventListener("resize", onResize);
    const forced = params.get("view");
    if (forced === "2d") { setMode("2d"); setWhy2d("You chose the list view."); }
    else if (!webgl()) { setMode("2d"); setWhy2d("The 3D Earth needs WebGL, which this browser does not provide, so every study is listed here instead."); }
    else {
      setTier(detectTier(params.get("tier")));
      if (!params.get("tier") && softwareGL()) { setSoftware(true); setMode("2d"); setWhy2d("This device draws 3D without a graphics processor, which would be slow, so the list leads. You can still start the 3D Earth."); }
      else {
        // a shared link to a study or a filtered view goes straight to it
        const wantIntro = !params.get("study") && !isFiltered(filterFromParams(params)) && (params.get("intro") === "1" || !store.get(SEEN));
        setIntro(wantIntro); setIntroP(wantIntro && !rm ? 0 : 1);
        setMode("3d");
        track("universe_opened", { slug: "earth" });
      }
    }
    return () => removeEventListener("resize", onResize);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => { audio.ambientWanted(true); audio.cue("enter"); return () => audio.ambientWanted(false); }, []);
  // a new filter turns the Earth to its first match (not on load, and never away from an open study)
  const fkey = `${filter.q}|${filter.cats}|${filter.levels}|${filter.has}`;
  const firstF = useRef(true);
  useEffect(() => {
    if (firstF.current) { firstF.current = false; return; }
    if (selected === null && shown.length && isFiltered(filter)) api.current?.face(String(shown[0].day));
  }, [fkey]); // eslint-disable-line react-hooks/exhaustive-deps
  // the camera follows the URL: selecting, Back and Forward all land here
  // (on load, only a deep-linked study moves it: "nothing selected" must not cut the intro short)
  const lastSel = useRef<number | null>(null);
  useEffect(() => {
    if (!ready || selected === lastSel.current) return;
    lastSel.current = selected;
    api.current?.focus(selected !== null ? String(selected) : null);
  }, [selected, ready]);

  const update = (fn: (p: URLSearchParams) => void, replace: boolean) => {
    const p = new URLSearchParams(params); fn(p);
    ["view", "tier", "intro"].forEach((k) => { if (!params.get(k)) p.delete(k); });
    setParams(p, { replace, preventScrollReset: true });
  };
  const select = (day: number) => {
    track("universe_marker", { slug: `day-${day}` }); setHovered(null); if (compact) setListOpen(false);
    if (intro && introP < 1) skip();
    update((p) => p.set("study", String(day)), false);
  };
  const close = () => update((p) => p.delete("study"), false);
  const setFilter = (f: StudyFilter) => update((p) => {
    const put = (k: string, v: string[]) => (v.length ? p.set(k, v.join(",")) : p.delete(k));
    if (f.q) p.set("q", f.q); else p.delete("q");
    put("cat", f.cats); put("ev", f.levels.map((l) => l.toLowerCase())); put("has", f.has);
  }, true);
  // previous / next within the filtered set (or all 90 if the open study is filtered out)
  const ring = study && shown.some((s) => s.day === study.day) ? shown : studies;
  const step = (dir: 1 | -1) => {
    if (!ring.length) return;
    const i = study ? ring.findIndex((s) => s.day === study.day) : -1;
    select(ring[(i + dir + ring.length) % ring.length].day);
  };
  const exit = () => { if (window.history.length > 1 && !document.referrer.includes("/universe") && loc.key !== "default") navigate(-1); else navigate("/"); };

  const events = useRef<SceneEvents>(null!);
  events.current = {
    onHover: (s) => setHovered(s),
    onSelect: (s) => select(Number(s)),
    onIntro: (p) => { setIntroP(p); if (p >= 1) store.set(SEEN, "1"); },
    onHotspot: () => {}, onPanel: () => {},
    onReady: (k) => { if (k === "earth") setReady(true); },
  };

  const onKey = (e: React.KeyboardEvent) => {
    const a = api.current; if (!a) return;
    const m: Record<string, () => void> = {
      ArrowLeft: () => a.rotate(-0.22, 0), ArrowRight: () => a.rotate(0.22, 0), ArrowUp: () => a.rotate(0, -0.15), ArrowDown: () => a.rotate(0, 0.15),
      "+": () => a.zoom(0.85), "=": () => a.zoom(0.85), "-": () => a.zoom(1.18), _: () => a.zoom(1.18),
      "[": () => step(-1), "]": () => step(1),
    };
    if (m[e.key]) { e.preventDefault(); m[e.key](); }
    if (e.key === "Enter" && hovered) { e.preventDefault(); select(Number(hovered)); }
    if (e.key === "Escape" && study) { e.preventDefault(); close(); }
  };
  // Skip works even before the Earth has loaded: the intro simply never starts
  function skip() { api.current?.skipIntro(); setIntro(false); setIntroP(1); store.set(SEEN, "1"); canvasBox.current?.focus(); }
  const replay = () => { setTitlesOff(false); setIntroP(0); setIntro(true); api.current?.replayIntro(); };

  const hs = hovered ? byDay.get(Number(hovered)) : null;
  const inIntro = introP < 1;
  const showTitles = !titlesOff && intro && mode === "3d";

  return (
    <Shell exit={exit} title="90 case studies"
      actions={<>
        <Link to="/worlds" className={shellButton}><Icon name="product" size={16} /><span className="max-sm:sr-only">Project worlds</span></Link>
        {mode === "3d" && <button type="button" onClick={() => setListOpen(!listOpen)} aria-expanded={listOpen} className={shellButton} data-testid="studies-toggle"><Icon name="search" size={16} /><span className="max-sm:sr-only">Studies</span></button>}
      </>}>
      {mode === "3d" && <h1 className="sr-only">90 product case studies on a 3D Earth</h1>}
      {mode === "3d" && (
        <div ref={canvasBox} tabIndex={0} onKeyDown={onKey} data-testid="universe-canvas" data-cursor="drag" role="application" aria-roledescription="3D view"
          aria-label="3D Earth with one marker per case study. Arrow keys rotate, plus and minus zoom, square brackets step through studies. The Studies button opens the searchable list."
          className="absolute inset-0 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-green/60">
          <CanvasBoundary onFail={() => { setMode("2d"); setWhy2d("The 3D scene could not start on this device, so every study is listed here instead."); }}>
            <Suspense fallback={null}>
              <Scene tier={tier} reduced={reduced} paused={false} events={events} api={api}
                earth={{ pins, regions, dim, selected, hovered, intro, preview }} />
            </Suspense>
          </CanvasBoundary>
        </div>
      )}

      {/* title card: prerendered, so the first paint is never empty; it gives way when the Earth is ready */}
      {(mode === null || (mode === "3d" && !ready)) && !(showTitles && introP > 0.02) && (
        <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center px-6 text-center" data-testid="title-card">
          <div>
            <p className="font-display text-4xl font-bold sm:text-6xl">Gaurav<span className="text-green">.OS</span></p>
            <p role="status" className="mt-3 font-mono text-xs uppercase tracking-[.3em] text-white/60">90 case studies · loading</p>
          </div>
        </div>
      )}

      {showTitles && (
        <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center px-6 text-center" data-testid="intro-titles">
          <div>
            <p className={cx("font-display text-5xl font-bold tracking-tight text-white transition-all duration-1000 sm:text-7xl", introP > 0.02 && introP < 0.62 ? "opacity-100" : "opacity-0 -translate-y-2")}>Gaurav<span className="text-green">.OS</span></p>
            <p className={cx("mt-4 font-mono text-sm uppercase tracking-[.4em] text-[#35D6D0] transition-opacity delay-300 duration-1000", introP > 0.14 && introP < 0.62 ? "opacity-100" : "opacity-0")}>Product × AI × Building</p>
            <div className={cx("transition-opacity duration-1000", introP >= 0.74 ? "opacity-100" : "opacity-0")}>
              <p className="font-display text-3xl font-bold text-white sm:text-5xl">{studies.length} product case studies</p>
              <p className="mt-3 text-white/70">One light for each study, grouped by category. Drag to turn the Earth; choose a light to open its study.</p>
              {introP >= 1 && <button type="button" onClick={() => { setTitlesOff(true); canvasBox.current?.focus(); }} className="pointer-events-auto mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-green px-6 font-semibold text-green-ink">Enter exploration<Icon name="arrow" /></button>}
            </div>
          </div>
        </div>
      )}
      {inIntro && mode === "3d" && <button type="button" onClick={skip} className="absolute bottom-6 left-1/2 z-20 inline-flex min-h-11 -translate-x-1/2 items-center gap-2 rounded-full border border-white/25 bg-black/50 px-5 text-sm text-white backdrop-blur hover:bg-white/10" data-testid="skip-intro"><Icon name="skip" />Skip intro</button>}

      {/* hover preview that follows its marker */}
      {mode === "3d" && (
        <div ref={preview} data-visible="false" aria-hidden className="pointer-events-none absolute left-0 top-0 z-10 w-[250px] opacity-0 transition-opacity duration-200 data-[visible=true]:opacity-100" style={{ marginLeft: 18, marginTop: -40 }}>
          {hs && <PreviewCard s={hs} />}
        </div>
      )}

      {/* the accessible list of all 90, with search and filters — also the whole experience in 2D */}
      {(mode === "2d" || listOpen) && (
        <StudyBrowser flat={mode === "2d"} why={why2d} filter={filter} shown={shown} selected={selected} onFilter={setFilter} onPick={select}
          onFocus={(d) => { setHovered(String(d)); api.current?.face(String(d)); }} onClose={() => { setListOpen(false); canvasBox.current?.focus(); }}
          onStart3d={software ? () => { setSoftware(false); setTier("laptop"); setReady(false); setMode("3d"); } : undefined} />
      )}

      {mode === "3d" && !inIntro && !study && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-wrap items-end justify-between gap-3 p-4 text-xs text-white/60 sm:p-6">
          <p className="pointer-events-auto max-w-md">{compact ? "Drag to turn · pinch to zoom · tap a light" : "Drag to turn · scroll to zoom · click a light · or use Studies"}. {dim ? `${shown.length} of ${studies.length} studies match. ` : ""}Positions are a visual layout by category, not geography.</p>
          <div className="pointer-events-auto flex flex-wrap items-center gap-3">
            <button type="button" onClick={replay} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/20 px-4 text-white/80 hover:bg-white/10"><Icon name="reset" size={16} />Replay intro</button>
            <a href={EARTH_CREDIT.href} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">{EARTH_CREDIT.text}</a>
          </div>
        </div>
      )}

      {study && <StudyPanel s={study} index={ring.findIndex((x) => x.day === study.day)} total={ring.length} filtered={ring !== studies} onPrev={() => step(-1)} onNext={() => step(1)} onClose={close} />}
    </Shell>
  );
}

/* ---------------------------------------------------------------- parts */
const LEVEL_LABEL = (l: string) => l.charAt(0) + l.slice(1).toLowerCase();

function PreviewCard({ s }: { s: Study }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-[#0B1110]/90 p-3.5 shadow-2xl backdrop-blur-xl">
      <p className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[.16em] text-white/60"><span className="size-2 rounded-full" style={{ background: CAT_COLOR[s.category] }} />Day {s.day} · {s.category}</p>
      <p className="mt-1.5 font-display text-lg font-bold leading-tight">{s.company}</p>
      <p className="mt-1 line-clamp-2 text-[13px] text-white/80">{s.title}</p>
      <div className="mt-2"><Pill tone={evidenceTone(s.evidence_level)}>{s.evidence_level}</Pill></div>
    </div>
  );
}

/** The selected study: what the corpus records about it, and the way to the full study. */
function StudyPanel({ s, index, total, filtered, onPrev, onNext, onClose }: { s: Study; index: number; total: number; filtered: boolean; onPrev: () => void; onNext: () => void; onClose: () => void }) {
  const head = useRef<HTMLHeadingElement>(null);
  useEffect(() => { head.current?.focus({ preventScroll: true }); }, [s.day]);
  // the corpus's own flags (as on /research/:day), plus PRD / experiment, which no flag covers
  const flags = (["prd", "experiment"] as HasKey[]).filter((k) => hasFlag(s, k));
  return (
    <aside aria-label={`Day ${s.day}: ${s.company}`} data-testid="study-panel"
      className="pointer-events-auto absolute inset-x-0 bottom-0 z-20 flex max-h-[62svh] flex-col rounded-t-3xl border-t border-white/10 bg-[#0B1110]/92 text-ink shadow-2xl backdrop-blur-xl min-[900px]:inset-x-auto min-[900px]:bottom-4 min-[900px]:right-4 min-[900px]:top-[76px] min-[900px]:max-h-none min-[900px]:w-[min(440px,40vw)] min-[900px]:rounded-3xl min-[900px]:border">
      <header className="flex items-start justify-between gap-3 border-b border-white/10 px-5 pb-4 pt-4">
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[.16em] text-white/60"><span className="size-2 rounded-full" style={{ background: CAT_COLOR[s.category] }} />Day {s.day} · {s.category} (derived)</p>
          <h2 ref={head} tabIndex={-1} className="mt-2 font-display text-2xl font-bold outline-none sm:text-3xl">{s.company}</h2>
          <p className="mt-1 text-[15px] text-white/80">{s.title}</p>
        </div>
        <button type="button" onClick={onClose} className="grid size-10 shrink-0 place-items-center rounded-full border border-white/15 hover:bg-white/10" data-testid="close-study"><Icon name="close" size={16} /><span className="sr-only">Close the study and return to the Earth</span></button>
      </header>
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <p className="font-mono text-[11px] uppercase tracking-[.14em] text-amber">Case study (research) — not a launched product</p>
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <Pill tone={evidenceTone(s.evidence_level)}>{s.evidence_level}</Pill>
          {flags.map((k) => <Pill key={k}>{HAS[k]}</Pill>)}
          {s.flags.map((f) => <Pill key={f}>{f}</Pill>)}
        </div>
        <p className="mt-2 text-xs text-white/60">{LEVEL_NOTE[s.evidence_level]} Evidence score {s.evidence_score}/8 · {s.words.toLocaleString("en-IN")} words · {s.sources} sources.</p>
        <p className="mt-4 text-[15px] leading-relaxed text-[#D7DEDA]">{s.summary}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link to={`/research/${s.day}`} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-green px-4 text-sm font-semibold text-green-ink">Read the full study<Icon name="arrow" size={16} /></Link>
          <a href={s.github_url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/15 px-4 text-sm hover:bg-white/10">On GitHub<Icon name="external" size={16} /></a>
          <Link to={`/atlas?day=${s.day}`} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/15 px-4 text-sm hover:bg-white/10">Show on Atlas</Link>
        </div>
      </div>
      <footer className="flex flex-wrap items-center gap-2 border-t border-white/10 py-3 pl-5 pr-24">{/* the right edge stays clear for Oz */}
        <button type="button" onClick={onPrev} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/15 px-4 text-sm hover:bg-white/10" data-testid="prev-study"><Icon name="back" size={16} />Previous</button>
        <button type="button" onClick={onNext} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/15 px-4 text-sm hover:bg-white/10" data-testid="next-study">Next<Icon name="arrow" size={16} /></button>
        <span className="ml-1 text-xs text-white/60" aria-live="polite">{index + 1} of {total}{filtered ? " matching" : ""}</span>
      </footer>
    </aside>
  );
}

function StudyBrowser({ flat, why, filter, shown, selected, onFilter, onPick, onFocus, onClose, onStart3d }: {
  flat: boolean; why: string; filter: StudyFilter; shown: Study[]; selected: number | null;
  onFilter: (f: StudyFilter) => void; onPick: (day: number) => void; onFocus: (day: number) => void; onClose: () => void; onStart3d?: () => void;
}) {
  const search = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState(filter.q);
  useEffect(() => { if (!flat) search.current?.focus(); }, [flat]);
  useEffect(() => { setQ(filter.q); }, [filter.q]);
  useEffect(() => { if (q === filter.q) return; const t = setTimeout(() => onFilter({ ...filter, q }), 180); return () => clearTimeout(t); }, [q]); // eslint-disable-line react-hooks/exhaustive-deps
  const toggle = <T extends string>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  const chip = (on: boolean) => cx("inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 text-xs", on ? "border-green bg-green/15 text-white" : "border-white/15 text-white/75 hover:bg-white/10");
  const levelCount = (l: string) => studies.filter((s) => s.evidence_level === l).length;

  return (
    <section aria-label="Case studies" data-testid="study-browser" onKeyDown={(e) => { if (e.key === "Escape" && !flat) { e.stopPropagation(); onClose(); } }}
      className={cx("flex flex-col text-white", flat ? "absolute inset-0 z-10 overflow-y-auto px-4 pb-16 pt-24 sm:px-8" : "absolute bottom-4 left-4 top-[76px] z-20 w-[min(400px,calc(100%-2rem))] rounded-3xl border border-white/10 bg-[#0B1110]/94 backdrop-blur-xl")}>
      <div className={cx(!flat && "border-b border-white/10 p-4")}>
        {flat && <><h1 className="font-display text-4xl font-bold">{studies.length} product case studies</h1><p className="mt-2 max-w-2xl text-white/70">{why}</p>
          {onStart3d && <button type="button" onClick={onStart3d} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full border border-green/50 px-5 text-sm text-green hover:bg-green/10"><Icon name="explore" size={16} />Start the 3D Earth anyway</button>}</>}
        <label className={cx("block", flat && "mt-6 max-w-xl")}>
          <span className="sr-only">Search the case studies</span>
          <input ref={search} type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search company, title, summary or day" data-testid="study-search"
            className="min-h-11 w-full rounded-full border border-white/15 bg-black/40 px-4 text-sm text-white placeholder:text-white/45 focus:border-green focus:outline-none" />
        </label>
        <fieldset className="mt-3"><legend className="mb-1.5 font-mono text-[10.5px] uppercase tracking-[.16em] text-white/55">Category</legend>
          <div className="flex flex-wrap gap-1.5">
            {CATS.map((c) => <button key={c.name} type="button" aria-pressed={filter.cats.includes(c.name)} onClick={() => onFilter({ ...filter, cats: toggle(filter.cats, c.name) })} className={chip(filter.cats.includes(c.name))}><span aria-hidden className="size-2 rounded-full" style={{ background: CAT_COLOR[c.name] }} />{c.name} <span className="text-white/50">{c.count}</span></button>)}
          </div>
        </fieldset>
        <fieldset className="mt-3"><legend className="mb-1.5 font-mono text-[10.5px] uppercase tracking-[.16em] text-white/55">Evidence level</legend>
          <div className="flex flex-wrap gap-1.5">
            {LEVELS.map((l) => <button key={l} type="button" aria-pressed={filter.levels.includes(l)} title={LEVEL_NOTE[l]} onClick={() => onFilter({ ...filter, levels: toggle(filter.levels, l as string) })} className={chip(filter.levels.includes(l))}>{LEVEL_LABEL(l)} <span className="text-white/50">{levelCount(l)}</span></button>)}
          </div>
        </fieldset>
        <fieldset className="mt-3"><legend className="mb-1.5 font-mono text-[10.5px] uppercase tracking-[.16em] text-white/55">Contains</legend>
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(HAS) as HasKey[]).map((k) => <button key={k} type="button" aria-pressed={filter.has.includes(k)} onClick={() => onFilter({ ...filter, has: toggle(filter.has, k) })} className={chip(filter.has.includes(k))}>{HAS[k]}</button>)}
          </div>
        </fieldset>
        <p className="mt-3 flex items-center justify-between gap-2 text-xs text-white/65" role="status" data-testid="study-count">
          <span>{shown.length} of {studies.length} studies</span>
          {isFiltered(filter) && <button type="button" onClick={() => { setQ(""); onFilter({ q: "", cats: [], levels: [], has: [] }); }} className="underline underline-offset-4 hover:text-white">Clear filters</button>}
        </p>
      </div>
      <ol className={cx("grid gap-1.5", flat ? "mt-4 sm:grid-cols-2 lg:grid-cols-3" : "flex-1 overflow-y-auto p-3")} data-testid="study-list">
        {shown.map((s) => (
          <li key={s.day}>
            <button type="button" onClick={() => onPick(s.day)} onFocus={() => onFocus(s.day)} onMouseEnter={() => onFocus(s.day)} aria-current={selected === s.day ? "true" : undefined}
              className={cx("flex w-full items-start gap-3 rounded-xl border p-2.5 text-left hover:border-green/50 focus-visible:border-green", selected === s.day ? "border-green/70 bg-green/10" : "border-white/10")}>
              <span className="mt-0.5 w-12 shrink-0 font-mono text-[11px] text-white/55">Day {s.day}</span>
              <span className="min-w-0">
                <span className="block font-semibold leading-snug">{s.company}</span>
                <span className="block truncate text-xs text-white/65">{s.title}</span>
                <span className="mt-1 flex items-center gap-2 text-[11px] text-white/55"><span aria-hidden className="size-2 rounded-full" style={{ background: CAT_COLOR[s.category] }} />{s.category} · {LEVEL_LABEL(s.evidence_level)}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>
      {!shown.length && <p className="p-4 text-sm text-white/70">No study matches. <button type="button" className="underline underline-offset-4" onClick={() => { setQ(""); onFilter({ q: "", cats: [], levels: [], has: [] }); }}>Clear filters</button></p>}
      {flat && <p className="mt-10 text-sm text-white/60"><Link to="/research" className="underline underline-offset-4">Research index</Link> · <Link to="/atlas" className="underline underline-offset-4">Atlas (2D map)</Link> · <Link to="/worlds" className="underline underline-offset-4">Project worlds</Link></p>}
    </section>
  );
}
