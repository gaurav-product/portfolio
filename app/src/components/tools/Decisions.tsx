import { useMemo, useState } from "react";
import { ToolShell, Field } from "./common";
import { Button, Pill, Empty } from "../ui";
import { Icon } from "../Icon";
import { legacy } from "~/content/data";
import { toCsv, download, uid } from "~/lib/pm";
import { useSessionState } from "~/lib/session";

type St = "Proposed" | "Decided" | "Revisited";
interface D { id: string; decision: string; context: string; options: string; rationale: string; tradeoffs: string; owner: string; date: string; status: St; source?: string }
/** Seeded from Aaroh's real decision log, labelled as such. */
const SEED: D[] = legacy.aaroh_decision_log.map((d) => ({ id: d.id, decision: d.decision, context: d.why, options: "—", rationale: d.evidence, tradeoffs: d.tradeoff, owner: "Gaurav (Aaroh)", date: "2026", status: "Decided", source: "Aaroh decision log" }));
const BLANK = (): D => ({ id: uid(), decision: "", context: "", options: "", rationale: "", tradeoffs: "", owner: "", date: new Date().toISOString().slice(0, 10), status: "Proposed" });

export function DecisionsTool() {
  const [list, setList] = useSessionState<D[]>("decisions", SEED);
  const [draft, setDraft] = useState<D | null>(null);
  const [q, setQ] = useState(""); const [fs, setFs] = useState<"All" | St>("All");
  const [err, setErr] = useState("");
  const shown = useMemo(() => list.filter((d) => (fs === "All" || d.status === fs) && (!q || JSON.stringify(d).toLowerCase().includes(q.toLowerCase()))), [list, q, fs]);
  const save = (e: React.FormEvent) => {
    e.preventDefault(); if (!draft) return;
    if (!draft.decision.trim()) { setErr("Describe the decision."); document.getElementById("d-decision")?.focus(); return; }
    setErr(""); setList(list.some((d) => d.id === draft.id) ? list.map((d) => (d.id === draft.id ? draft : d)) : [draft, ...list]); setDraft(null);
  };
  const exportCsv = () => download("decision-log.csv", toCsv(["Decision", "Context", "Options", "Rationale", "Trade-offs", "Owner", "Date", "Status", "Source"], shown.map((d) => [d.decision, d.context, d.options, d.rationale, d.tradeoffs, d.owner, d.date, d.status, d.source ?? "Entered in browser"])), "text/csv");
  const f = (k: keyof D, label: string, rows = 1) => draft && (
    <Field id={`d-${k}`} label={label}>{rows > 1 ? <textarea id={`d-${k}`} rows={rows} value={draft[k] as string} onChange={(e) => setDraft({ ...draft, [k]: e.target.value })} className="field" />
      : <input id={`d-${k}`} value={draft[k] as string} onChange={(e) => setDraft({ ...draft, [k]: e.target.value })} className="field" aria-invalid={k === "decision" && !!err} />}</Field>
  );
  return (
    <ToolShell slug="decisions" actions={<><Button icon="plus" variant="primary" onClick={() => setDraft(BLANK())}>Add decision</Button><Button icon="download" onClick={exportCsv} disabled={!shown.length}>Export CSV</Button><Button icon="reset" variant="ghost" onClick={() => setList(SEED)}>Reset</Button></>}>
      {draft && (
        <form onSubmit={save} className="card mb-6 grid gap-4 p-5 md:grid-cols-2" aria-label={list.some((d) => d.id === draft.id) ? "Edit decision" : "New decision"}>
          <div className="md:col-span-2">{f("decision", "Decision")}{err && <p className="mt-1 text-sm text-red">{err}</p>}</div>
          {f("context", "Context", 2)}{f("options", "Options considered", 2)}{f("rationale", "Rationale", 2)}{f("tradeoffs", "Trade-offs", 2)}{f("owner", "Owner")}
          <Field id="d-date" label="Date"><input id="d-date" type="date" value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} className="field" /></Field>
          <Field id="d-status" label="Status"><select id="d-status" value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as St })} className="field">{(["Proposed", "Decided", "Revisited"] as St[]).map((s) => <option key={s}>{s}</option>)}</select></Field>
          <div className="flex gap-2 md:col-span-2"><button type="submit" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-green px-5 font-semibold text-green-ink"><Icon name="check" />Save decision</button><Button variant="ghost" onClick={() => { setDraft(null); setErr(""); }}>Cancel</Button></div>
        </form>
      )}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <label className="flex-1"><span className="sr-only">Filter decisions</span><input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter decisions" className="field" /></label>
        <label><span className="sr-only">Status</span><select value={fs} onChange={(e) => setFs(e.target.value as "All" | St)} className="field">{["All", "Proposed", "Decided", "Revisited"].map((s) => <option key={s}>{s}</option>)}</select></label>
      </div>
      <p role="status" className="label mb-3">{shown.length} of {list.length} decisions</p>
      {!shown.length ? <Empty title="No decisions match">Change the filter or add a decision.</Empty> : (
        <ul className="grid gap-3">
          {shown.map((d) => (
            <li key={d.id} className="card p-5" data-testid="decision">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div><h2 className="text-lg font-bold">{d.decision}</h2><p className="text-sm text-dim">{d.owner || "No owner"} · {d.date}{d.source && <> · <span className="text-cyan">{d.source}</span></>}</p></div>
                <Pill tone={d.status === "Decided" ? "green" : d.status === "Revisited" ? "amber" : "dim"}>{d.status}</Pill>
              </div>
              <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                {([["Context", d.context], ["Rationale / evidence", d.rationale], ["Trade-offs", d.tradeoffs], ["Options", d.options]] as const).map(([k, v]) => v && <div key={k}><dt className="label">{k}</dt><dd className="text-[#C9D2CD]">{v}</dd></div>)}
              </dl>
              <div className="mt-3 flex gap-2">
                <Button icon="edit" onClick={() => setDraft(d)} aria-label={`Edit decision: ${d.decision}`}>Edit</Button>
                <Button icon="trash" variant="ghost" onClick={() => setList(list.filter((x) => x.id !== d.id))} aria-label={`Delete decision: ${d.decision}`}>Delete</Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </ToolShell>
  );
}
