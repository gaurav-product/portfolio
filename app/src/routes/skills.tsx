import { heroArt } from "~/components/CinematicImage";
import { useEffect, useId, useMemo, useState } from "react";
import { Link } from "react-router";
import { useHydratedSearchParams } from "~/lib/useHydratedSearchParams";
import { capabilities, CAPABILITY_CATEGORIES, DOMAINS, domainOf, type CapabilityStatus, type Capability } from "~/content/capabilities";
import { projects } from "~/content/projects";
import { experience } from "~/content/experience";
import { PageHero, Container, Pill, Empty, cx } from "~/components/ui";
import { Icon } from "~/components/Icon";
import { seo } from "~/lib/meta";
import { norm } from "~/lib/text";

export const meta = () => seo("Skills library", "Product management capabilities in seven domains, each linked to the project or role that demonstrates it — with how it was used — or marked not yet evidenced.", "/skills");
const STATUSES: CapabilityStatus[] = ["Demonstrated in work", "Applied in case studies", "Not yet evidenced"];
export const statusPillTone = (s: CapabilityStatus) => (s === "Demonstrated in work" ? "green" : s === "Applied in case studies" ? "cyan" : "dim") as "green";
const STATUS_BAR: Record<CapabilityStatus, string> = { "Demonstrated in work": "bg-green", "Applied in case studies": "bg-cyan", "Not yet evidenced": "bg-line" };

/** Where a piece of evidence lives: a project, a role or the research corpus — as a short label and its page. */
function evidenceLink(ref: string): { label: string; to: string } {
  const [kind, id] = ref.split(":");
  if (kind === "project") { const p = projects.find((x) => x.slug === id); return { label: p?.name ?? id, to: `/projects/${id}` }; }
  if (kind === "role") { const r = experience.find((x) => x.id === id); return { label: r ? r.employer : id, to: `/experience/${id}` }; }
  return { label: "Research corpus", to: "/research" };
}
const shortStatus = (s: CapabilityStatus) => (s === "Demonstrated in work" ? "Work" : s === "Applied in case studies" ? "Case studies" : "Not yet");

/** Every project and role that evidences at least one capability (the "Shown in" filter). */
const SOURCES = (() => {
  const refs = new Map<string, number>();
  capabilities.forEach((c) => new Set(c.evidence.map((e) => e.ref)).forEach((r) => { if (!r.startsWith("corpus:")) refs.set(r, (refs.get(r) ?? 0) + 1); }));
  return [...refs.entries()].map(([ref, n]) => ({ ref, n, label: evidenceLink(ref).label + (ref.startsWith("role:") ? ` — ${experience.find((x) => x.id === ref.split(":")[1])?.role ?? ""}` : "") }))
    .sort((a, b) => b.n - a.n);
})();

export default function Skills() {
  const [p, setP] = useHydratedSearchParams();
  const dom = p.get("domain") ?? "All", cat = p.get("category") ?? "All", st = p.get("status") ?? "All", q = p.get("q") ?? "", src = p.get("source") ?? "";
  const set = (k: string, v: string) => { const n = new URLSearchParams(p); v && v !== "All" ? n.set(k, v) : n.delete(k); if (k === "domain") n.delete("category"); setP(n, { replace: true, preventScrollReset: true }); };
  const domain = DOMAINS.find((d) => d.id === dom) ?? null;
  const shown = useMemo(() => capabilities.filter((c) => (!domain || domain.categories.includes(c.category)) && (cat === "All" || c.category === cat) && (st === "All" || c.status === st) &&
    (!src || c.evidence.some((e) => e.ref === src)) &&
    (!q || norm(`${c.name} ${c.definition} ${c.category} ${c.evidence.map((e) => e.note).join(" ")}`).includes(norm(q)))), [domain, cat, st, q, src]);
  const counts = STATUSES.map((s) => [s, capabilities.filter((c) => c.status === s).length] as const);
  const cats = domain ? domain.categories : CAPABILITY_CATEGORIES;
  const groups = cats.map((c) => ({ c, items: shown.filter((x) => x.category === c) })).filter((g) => g.items.length);
  const chip = (on: boolean) => cx("inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm transition-colors", on ? "border-green bg-green/10 text-ink" : "border-line text-muted hover:border-green/50 hover:text-ink");
  const anyFilter = dom !== "All" || cat !== "All" || st !== "All" || q || src;
  return (
    <>
      <PageHero {...heroArt("render-skills")} eyebrow="Skills library" title="Capabilities, mapped to evidence"
        intro="No percentages, no self-ratings. A capability is “demonstrated” only when a project or role shows it; otherwise it says what kind of evidence exists, or that none does. Open any skill to see how it was used." >
        <ul className="flex flex-wrap gap-2">{counts.map(([s, n]) => <li key={s}><Pill tone={statusPillTone(s)}>{n} · {s}</Pill></li>)}</ul>
      </PageHero>
      <Container wide className="py-10">
        {/* the seven domains: what each holds and how much of it is evidenced */}
        <section aria-labelledby="domains-h" className="mb-10">
          <h2 id="domains-h" className="label mb-4">Seven domains · select one to focus</h2>
          {/* a plain labelled list: role="group" would strip the list semantics its <li> children need */}
          <ul aria-label="Domain" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" data-testid="skill-domains">
            {DOMAINS.map((d) => {
              const items = capabilities.filter((c) => d.categories.includes(c.category));
              const on = dom === d.id;
              return (
                <li key={d.id}>
                  <button type="button" aria-pressed={on} onClick={() => set("domain", on ? "All" : d.id)}
                    className={cx("card flex h-full w-full flex-col p-4 text-left transition-colors", on ? "border-green/70 bg-green/5" : "hover:border-green/40")}>
                    <span className="flex items-baseline justify-between gap-2"><span className="font-display text-lg font-bold leading-tight">{d.name}</span><span className="font-mono text-xs text-dim">{items.length}</span></span>
                    <span className="mt-1 text-sm text-muted">{d.blurb}</span>
                    <span aria-hidden className="mt-4 flex h-1.5 overflow-hidden rounded-full bg-raise">
                      {STATUSES.map((s) => { const n = items.filter((x) => x.status === s).length; return n ? <span key={s} className={STATUS_BAR[s]} style={{ width: `${(n / items.length) * 100}%` }} /> : null; })}
                    </span>
                    <span className="mt-2 text-xs text-dim">{STATUSES.map((s) => `${items.filter((x) => x.status === s).length} ${shortStatus(s).toLowerCase()}`).join(" · ")}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {/* filters: search, categories, evidence and source (state in the URL, shareable) */}
        <div className="grid gap-4" data-testid="skills-filters">
          <div className="flex flex-wrap items-center gap-3">
            <label className="min-w-0 flex-1 basis-72 sm:max-w-xl"><span className="sr-only">Search skills</span><input type="search" value={q} onChange={(e) => set("q", e.target.value)} placeholder="Search skills or how they were used — e.g. cohort, guardrails, RICE" className="field" /></label>
            <label className="flex min-w-0 flex-1 basis-64 items-center gap-2 sm:max-w-sm">
              <span className="shrink-0 text-sm text-muted">Shown in</span>
              <select value={src} onChange={(e) => set("source", e.target.value)} className="field min-w-0" data-testid="skill-source">
                <option value="">Any project or role</option>
                {SOURCES.map((s) => <option key={s.ref} value={s.ref}>{s.label} ({s.n})</option>)}
              </select>
            </label>
          </div>
          <div role="group" aria-label="Category" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
            {["All", ...cats].map((c) => {
              const n = c === "All" ? capabilities.filter((x) => !domain || domain.categories.includes(x.category)).length : capabilities.filter((x) => x.category === c).length;
              return <button key={c} type="button" aria-pressed={cat === c} onClick={() => set("category", c)} className={cx(chip(cat === c), "shrink-0")}>{c === "All" && domain ? `All in ${domain.name}` : c}<span className="text-xs text-dim">{n}</span></button>;
            })}
          </div>
          <div role="group" aria-label="Evidence" className="flex flex-wrap gap-2">
            {["All", ...STATUSES].map((s) => <button key={s} type="button" aria-pressed={st === s} onClick={() => set("status", s)} className={chip(st === s)}>{s === "All" ? "Any evidence" : s}</button>)}
          </div>
        </div>
        <p role="status" className="label mb-6 mt-6 flex flex-wrap items-center gap-3">
          <span>{shown.length} of {capabilities.length} capabilities</span>
          {anyFilter && <button type="button" className="normal-case tracking-normal text-muted underline underline-offset-4 hover:text-ink" onClick={() => setP(new URLSearchParams(), { replace: true, preventScrollReset: true })}>Clear all filters</button>}
        </p>
        {!shown.length ? <Empty title="No capabilities match"><button type="button" className="mt-2 underline" onClick={() => setP(new URLSearchParams(), { replace: true })}>Clear filters</button></Empty> : (
          <div className="grid gap-14">
            {groups.map(({ c, items }) => (
              <section key={c} aria-labelledby={`cat-${c.replace(/\W+/g, "-")}`} data-testid="skill-group">
                <header className="mb-4 flex flex-wrap items-baseline justify-between gap-3 border-b border-line-soft pb-3">
                  <h2 id={`cat-${c.replace(/\W+/g, "-")}`} className="font-display text-2xl font-bold">{c}<span className="ml-3 font-mono text-xs font-normal uppercase tracking-[.14em] text-dim">{domainOf(c).name}</span></h2>
                  <p className="text-sm text-dim">{STATUSES.map((s) => `${items.filter((x) => x.status === s).length} ${shortStatus(s).toLowerCase()}`).join(" · ")}</p>
                </header>
                <ul className="grid items-start gap-3 sm:grid-cols-2 xl:grid-cols-3">{items.map((x) => <SkillCard key={x.id} c={x} source={src} />)}</ul>
              </section>
            ))}
          </div>
        )}
      </Container>
    </>
  );
}

function SkillCard({ c, source }: { c: Capability; source: string }) {
  const ev = c.evidence.map((e) => ({ ...evidenceLink(e.ref), note: e.note, ref: e.ref }));
  const uniq = ev.filter((e, i) => ev.findIndex((x) => x.to === e.to) === i);
  const [open, setOpen] = useState(!!source);
  // filtering by a project or role opens every card's evidence, so the matching notes are visible at once
  useEffect(() => { if (source) setOpen(true); }, [source]);
  const id = useId();
  return (
    <li className={cx("card flex h-full flex-col p-5 transition-colors hover:border-green/40", c.status === "Not yet evidenced" && "border-dashed")} data-testid="skill-card">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-medium"><Link to={`/skills/${c.id}`} className="hover:text-green focus-visible:text-green">{c.name}</Link></h3>
        <Pill tone={statusPillTone(c.status)} className="shrink-0">{shortStatus(c.status)}</Pill>
      </div>
      <p className="mt-2 line-clamp-3 text-sm text-muted">{c.definition}</p>
      <div className="mt-auto pt-4">
        {uniq.length ? (
          <>
            <p className="flex flex-wrap items-center gap-1.5 text-xs"><span className="label mr-1">Shown in</span>
              {uniq.slice(0, 3).map((e) => <Link key={e.to} to={e.to} className="inline-flex min-h-7 items-center rounded-full border border-line-soft px-2.5 text-muted hover:border-green/50 hover:text-ink">{e.label}</Link>)}
              {uniq.length > 3 && <Link to={`/skills/${c.id}`} className="text-dim underline underline-offset-4 hover:text-ink">+{uniq.length - 3} more</Link>}
            </p>
            <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)} data-testid="skill-how"
              className="mt-3 inline-flex min-h-9 items-center gap-1.5 text-sm text-green hover:underline">
              <Icon name={open ? "up" : "down"} size={16} />{open ? "Hide how it was used" : "How it was used"}
            </button>
            {open && (
              <ul id={id} className="mt-2 grid gap-2 border-l border-green/40 pl-3 text-sm">
                {ev.map((e) => (
                  <li key={e.ref + e.note} className={cx(source && e.ref !== source && "opacity-60")}>
                    <Link to={e.to} className="font-medium text-ink underline decoration-line underline-offset-4 hover:decoration-green">{e.label}</Link>
                    <span className="text-muted"> — {e.note}</span>
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : <p className="text-xs text-dim">No evidence yet — <Link to={`/skills/${c.id}`} className="underline underline-offset-4 hover:text-ink">see why</Link></p>}
      </div>
    </li>
  );
}
