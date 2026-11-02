import { useMemo } from "react";
import { Link, useSearchParams } from "react-router";
import { capabilities, CAPABILITY_CATEGORIES, type CapabilityStatus } from "~/content/capabilities";
import { PageHero, Container, Pill, Empty, cx } from "~/components/ui";
import { seo } from "~/lib/meta";
import { norm } from "~/lib/text";

export const meta = () => seo("Skills library", "Product management capabilities, each linked to the project or role that demonstrates it — or marked not yet evidenced.", "/skills");
const STATUSES: CapabilityStatus[] = ["Demonstrated in work", "Applied in case studies", "Not yet evidenced"];
export const statusPillTone = (s: CapabilityStatus) => (s === "Demonstrated in work" ? "green" : s === "Applied in case studies" ? "cyan" : "dim") as "green";

export default function Skills() {
  const [p, setP] = useSearchParams();
  const cat = p.get("category") ?? "All", st = p.get("status") ?? "All", q = p.get("q") ?? "";
  const set = (k: string, v: string) => { const n = new URLSearchParams(p); v && v !== "All" ? n.set(k, v) : n.delete(k); setP(n, { replace: true, preventScrollReset: true }); };
  const shown = useMemo(() => capabilities.filter((c) => (cat === "All" || c.category === cat) && (st === "All" || c.status === st) &&
    (!q || norm(`${c.name} ${c.definition} ${c.category}`).includes(norm(q)))), [cat, st, q]);
  const counts = STATUSES.map((s) => [s, capabilities.filter((c) => c.status === s).length] as const);
  return (
    <>
      <PageHero eyebrow="Skills library" title="Capabilities, mapped to evidence"
        intro="No percentages, no self-ratings. A capability is “demonstrated” only when a project or role shows it; otherwise it says what kind of evidence exists, or that none does." >
        <ul className="flex flex-wrap gap-2">{counts.map(([s, n]) => <li key={s}><Pill tone={statusPillTone(s)}>{n} · {s}</Pill></li>)}</ul>
      </PageHero>
      <Container wide className="py-10">
        <div className="mb-6 grid gap-3 lg:grid-cols-[1fr_auto_auto]">
          <label><span className="sr-only">Search skills</span><input type="search" value={q} onChange={(e) => set("q", e.target.value)} placeholder="Search skills — e.g. cohort, guardrails, RICE" className="field" /></label>
          <label><span className="sr-only">Category</span><select value={cat} onChange={(e) => set("category", e.target.value)} className="field">{["All", ...CAPABILITY_CATEGORIES].map((c) => <option key={c}>{c}</option>)}</select></label>
          <label><span className="sr-only">Evidence status</span><select value={st} onChange={(e) => set("status", e.target.value)} className="field">{["All", ...STATUSES].map((c) => <option key={c}>{c}</option>)}</select></label>
        </div>
        <p role="status" className="label mb-4">{shown.length} of {capabilities.length} capabilities</p>
        {!shown.length ? <Empty title="No capabilities match"><button type="button" className="mt-2 underline" onClick={() => setP(new URLSearchParams(), { replace: true })}>Clear filters</button></Empty> : (
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {shown.map((c) => (
              <li key={c.id}>
                <Link to={`/skills/${c.id}`} className={cx("card card-link flex h-full flex-col p-4", c.status === "Not yet evidenced" && "opacity-80")}>
                  <span className="flex items-start justify-between gap-2"><span className="font-medium">{c.name}</span><Pill tone={statusPillTone(c.status)} className="shrink-0">{c.status === "Demonstrated in work" ? "Work" : c.status === "Applied in case studies" ? "Case studies" : "None"}</Pill></span>
                  <span className="label mt-1">{c.category}</span>
                  <span className="mt-2 text-sm text-muted">{c.definition}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </>
  );
}
