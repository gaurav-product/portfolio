import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import type { Destination, GalleryItem } from "~/content/universe";
import { projectBySlug } from "~/content/projects";
import { ventureBySlug } from "~/content/ventures";
import { newsletter } from "~/content/newsletter";
import { THIRD_PARTY_MARK } from "~/content/cinematic";
import { Blocks, Pill, evidenceTone, cx } from "~/components/ui";
import { Icon } from "~/components/Icon";
import { VentureBody } from "~/routes/venture-detail";
import { asset } from "~/lib/meta";
import { audio } from "./audio";

type Tab = "summary" | "case" | "gallery";

/** The case-study interface beside a building: recruiter summary first, then the full case study and the gallery. */
export function CaseStudyPanel({ d, section, onSection, onGallery, onBack, compact }: {
  d: Destination; section: string | null; onSection: (k: string | null) => void; onGallery: (i: number) => void; onBack: () => void; compact: boolean;
}) {
  const p = projectBySlug(d.slug), v = ventureBySlug(d.slug);
  const sections = p ? d.sectionOrder.map((k) => p.sections.find((s) => s.key === k)).filter((s): s is NonNullable<typeof s> => !!s) : [];
  const [tab, setTab] = useState<Tab>(section ? "case" : "summary");
  const [open, setOpen] = useState(true);
  const body = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!section) return;
    setTab("case"); setOpen(true);
    requestAnimationFrame(() => { const el = document.getElementById(`cs-${section}`); el?.scrollIntoView({ block: "start", behavior: "smooth" }); (el?.querySelector("h3") as HTMLElement | null)?.focus({ preventScroll: true }); });
  }, [section]);
  const choose = (t: Tab) => { setTab(t); onSection(null); audio.cue("panel"); body.current?.scrollTo({ top: 0 }); };

  return (
    <aside aria-label={`${d.name} case study`} data-testid="case-panel" data-collapsed={!open}
      className={cx("pointer-events-auto absolute z-20 flex flex-col border-white/10 bg-[#0B1110]/92 text-ink shadow-2xl backdrop-blur-xl",
        // layout by breakpoint (no shift on load): a bottom sheet below 900px, a side panel above
        "inset-x-0 bottom-0 h-[62svh] rounded-t-3xl border-t data-[collapsed=true]:h-auto min-[900px]:inset-x-auto min-[900px]:bottom-4 min-[900px]:right-4 min-[900px]:top-[76px] min-[900px]:h-auto min-[900px]:w-[min(460px,40vw)] min-[900px]:rounded-3xl min-[900px]:border")}>
      <header className="border-b border-white/10 px-5 pb-4 pt-4">
        {(
          <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="mx-auto mb-3 block h-1.5 w-12 rounded-full bg-white/25 min-[900px]:hidden"><span className="sr-only">{open ? "Collapse case study" : "Expand case study"}</span></button>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <Pill tone={d.tone}>{d.statusLabel}</Pill>
          <span className="text-xs text-dim">{d.cluster}</span>
        </div>
        <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl">{d.name}</h1>
        <p className="mt-1 text-sm text-muted">{d.category}</p>
        {(open || !compact) && (
          <div role="tablist" aria-label="Case study views" className="mt-4 flex gap-1 rounded-full border border-white/10 p-1 text-sm">
            {(["summary", "case", "gallery"] as Tab[]).filter((t) => t !== "case" || sections.length).map((t) => (
              <button key={t} role="tab" type="button" aria-selected={tab === t} onClick={() => choose(t)}
                className={cx("min-h-9 flex-1 rounded-full px-3", tab === t ? "bg-green font-semibold text-green-ink" : "text-muted hover:text-ink")}>
                {t === "summary" ? (d.concept ? "Concept" : "Recruiter summary") : t === "case" ? "Case study" : `Gallery (${d.gallery.length})`}
              </button>
            ))}
          </div>
        )}
      </header>

      {(open || !compact) && (
        <div ref={body} role="tabpanel" tabIndex={0} aria-label="Case study content" className="min-h-0 flex-1 overflow-y-auto px-5 py-5 text-[15px] leading-relaxed">
          {tab === "summary" && (v ? <VentureBody v={v} bare headingLevel={1} /> : p ? (
            <div className="grid gap-5">
              <dl className="grid grid-cols-[110px_1fr] gap-x-4 gap-y-2 text-sm">
                <dt className="label pt-0.5">Role</dt><dd>{p.role}</dd>
                <dt className="label pt-0.5">Period</dt><dd>{p.period}</dd>
                <dt className="label pt-0.5">Type</dt><dd>{p.kindLabel}</dd>
                <dt className="label pt-0.5">Status</dt><dd>{p.status}</dd>
              </dl>
              <p className="text-[#D7DEDA]">{p.oneLine}</p>
              {THIRD_PARTY_MARK[p.slug] && <p className="text-sm text-dim">{THIRD_PARTY_MARK[p.slug]}</p>}
              <div><h2 className="label mb-2">Evidence-backed highlights</h2>
                <ul className="grid gap-2">{p.highlights.map((h) => <li key={h.text} className="flex gap-2"><Icon name="check" size={18} className="mt-0.5 shrink-0 text-green" /><span>{h.text} <Pill tone={evidenceTone(h.status)} className="ml-1 align-middle">{h.status}</Pill></span></li>)}</ul></div>
              {p.limits.length > 0 && <div><h2 className="label mb-2">What this does not show</h2><ul className="grid gap-1.5 text-sm text-muted">{p.limits.map((l) => <li key={l}>{l}</li>)}</ul></div>}
            </div>
          ) : (
            <div className="grid gap-4">
              <p className="text-[#D7DEDA]">{d.oneLine}</p>
              <p className="text-sm text-dim">Subscriber count is self-reported by Gaurav ({newsletter.subscribersNote}).</p>
            </div>
          ))}

          {tab === "case" && (
            <div className="grid gap-8">
              {sections.map((s) => (
                <section key={s.key} id={`cs-${s.key}`} className="scroll-mt-4">
                  <h3 tabIndex={-1} className="mb-3 font-display text-lg font-bold outline-none">{s.title}{s.tag && <Pill tone="amber" className="ml-2 align-middle">{s.tag}</Pill>}</h3>
                  <Blocks blocks={s.blocks} />
                </section>
              ))}
            </div>
          )}

          {tab === "gallery" && (
            <ul className="grid grid-cols-2 gap-3">
              {d.gallery.map((g, i) => (
                <li key={i}>
                  <button type="button" onClick={() => onGallery(i)} data-cursor="open" className="group block w-full overflow-hidden rounded-xl border border-white/10 text-left hover:border-green/50">
                    {g.src ? <img src={asset(g.panel ?? g.src)} alt="" loading="lazy" className="aspect-[16/10] w-full object-cover object-top" />
                      : <span className="grid aspect-[16/10] place-items-center bg-[#121C19] px-3 text-center text-xs text-muted">{g.lines?.[0] ?? g.title}</span>}
                    <span className="block px-2.5 py-2 text-xs"><span className="block truncate font-medium text-ink">{g.title}</span><span className="block truncate text-[10.5px] uppercase tracking-[.08em] text-amber">{g.label}</span></span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <footer className="flex flex-wrap gap-2 border-t border-white/10 py-3 pl-5 pr-24 min-[900px]:pr-5">{/* room for Oz on phones */}
        <button type="button" onClick={onBack} data-cursor="back" className="inline-flex min-h-10 items-center gap-2 rounded-full bg-green px-4 text-sm font-semibold text-green-ink"><Icon name="back" />Back to Earth</button>
        {d.external
          ? <a href={d.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/15 px-4 text-sm hover:bg-white/10">Subscribe on LinkedIn<Icon name="external" size={16} /></a>
          : <Link to={d.href} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/15 px-4 text-sm hover:bg-white/10">Read the full page<Icon name="arrow" size={16} /></Link>}
      </footer>
    </aside>
  );
}

/** Full-size, readable images: real aspect ratio, tall screenshots scroll, provenance always visible. */
export function Lightbox({ items, index, onIndex, onClose }: { items: GalleryItem[]; index: number; onIndex: (i: number) => void; onClose: () => void }) {
  const g = items[index];
  const close = useRef<HTMLButtonElement>(null);
  const opener = useRef<Element | null>(null);
  useEffect(() => {
    opener.current = document.activeElement; close.current?.focus();
    return () => { (opener.current as HTMLElement | null)?.focus?.(); };
  }, []);
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.stopPropagation(); onClose(); }
      if (e.key === "ArrowRight") onIndex((index + 1) % items.length);
      if (e.key === "ArrowLeft") onIndex((index - 1 + items.length) % items.length);
    };
    document.addEventListener("keydown", k, true); return () => document.removeEventListener("keydown", k, true);
  }, [index, items.length, onClose, onIndex]);
  return (
    <div role="dialog" aria-modal="true" aria-label={`${g.title} — image ${index + 1} of ${items.length}`} data-testid="lightbox"
      className="pointer-events-auto fixed inset-0 z-[60] flex flex-col bg-black/92 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-3 px-4 py-3 text-white">
        <div className="min-w-0"><p className="truncate font-medium">{g.title}</p><p className="truncate text-xs uppercase tracking-[.08em] text-amber">{g.label}</p></div>
        <div className="flex shrink-0 gap-2">
          <button type="button" aria-label="Previous image" onClick={() => onIndex((index - 1 + items.length) % items.length)} className="inline-flex size-11 items-center justify-center rounded-full border border-white/20 hover:bg-white/10"><Icon name="left" /></button>
          <button type="button" aria-label="Next image" onClick={() => onIndex((index + 1) % items.length)} className="inline-flex size-11 items-center justify-center rounded-full border border-white/20 hover:bg-white/10"><Icon name="right" /></button>
          <button ref={close} type="button" aria-label="Close image" onClick={onClose} className="inline-flex size-11 items-center justify-center rounded-full bg-white text-black"><Icon name="close" /></button>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-auto px-4 pb-4" tabIndex={0} aria-label="Image (scroll for tall screens)">
        {g.src
          ? <img src={asset(g.src)} alt={`${g.title} (${g.label})`} width={g.width} height={g.height} className="mx-auto h-auto max-w-full rounded-lg" style={{ maxWidth: g.width ? Math.min(g.width, 1280) : undefined }} />
          : <div className="mx-auto grid max-w-2xl gap-2 rounded-2xl border border-dashed border-amber/50 p-8 text-white">{(g.lines ?? [g.title]).map((l, i) => l ? <p key={i} className={i === 0 ? "font-display text-2xl font-bold" : "text-white/80"}>{l}</p> : <br key={i} />)}</div>}
      </div>
      {(g.note || g.source) && (
        <p className="px-4 pb-4 text-center text-xs text-white/70">{g.note}{g.source && <> · <a href={g.source} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Original in the repository</a></>}</p>
      )}
    </div>
  );
}
