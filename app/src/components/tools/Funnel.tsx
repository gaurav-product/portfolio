import { useMemo } from "react";
import { ToolShell, SampleBadge } from "./common";
import { Button, Pill } from "../ui";
import { Icon } from "../Icon";
import { funnel, pct, toCsv, download, uid, type FunnelStep } from "~/lib/pm";
import { useSessionState } from "~/lib/session";
import { Link } from "react-router";

/** Two datasets that are never mixed. Editing the capstone data relabels it. */
const SAMPLE: FunnelStep[] = [
  { id: "a", label: "Visited landing page", users: 10000 }, { id: "b", label: "Started sign-up", users: 3200 },
  { id: "c", label: "Completed onboarding", users: 1900 }, { id: "d", label: "Reached first value", users: 1100 },
];
const CAPSTONE: FunnelStep[] = [
  { id: "1", label: "Entry banner shown", users: 40000 }, { id: "2", label: "Feature opened", users: 16000 },
  { id: "3", label: "Onboarding / transaction-linking completed", users: 11200 }, { id: "4", label: "First personalised insight viewed", users: 9520 },
  { id: "5", label: "Recommended action taken", users: 2856 },
];
type Source = "sample" | "capstone" | "edited";

export function FunnelTool() {
  const [state, setState] = useSessionState<{ source: Source; steps: FunnelStep[] }>("funnel", { source: "sample", steps: SAMPLE });
  const rows = useMemo(() => funnel(state.steps), [state.steps]);
  const worst = rows.slice(1).reduce<null | (typeof rows)[number]>((w, r) => (r.dropOff != null && (!w || r.dropOff > (w.dropOff ?? 0)) ? r : w), null);
  const edit = (steps: FunnelStep[]) => setState({ source: state.source === "sample" ? "sample" : "edited", steps });
  const max = Math.max(1, ...state.steps.map((s) => s.users));

  return (
    <ToolShell slug="funnel" actions={<>
      <Button icon="plus" onClick={() => edit([...state.steps, { id: uid(), label: "New step", users: Math.round((state.steps.at(-1)?.users ?? 100) / 2) }])}>Add step</Button>
      <Button icon="download" variant="primary" onClick={() => download("funnel.csv", toCsv(["Step", "Users", "Step conversion", "Drop-off", "Overall conversion", "Data"], rows.map((r) => [r.label, r.users, pct(r.stepConv), pct(r.dropOff), pct(r.overall), state.source]) ), "text/csv")}>Export CSV</Button>
      <Button icon="reset" variant="ghost" onClick={() => setState({ source: "sample", steps: SAMPLE })}>Reset</Button>
    </>}>
      <div role="group" aria-label="Dataset" className="mb-4 flex flex-wrap items-center gap-2">
        <span className="label mr-1">Dataset</span>
        <button type="button" aria-pressed={state.source === "sample"} onClick={() => setState({ source: "sample", steps: SAMPLE })} className="min-h-10 rounded-full border border-line px-3.5 text-sm aria-pressed:border-green aria-pressed:text-green">Illustrative sample</button>
        <button type="button" aria-pressed={state.source !== "sample"} onClick={() => setState({ source: "capstone", steps: CAPSTONE })} className="min-h-10 rounded-full border border-line px-3.5 text-sm aria-pressed:border-green aria-pressed:text-green">PhonePe capstone — case data</button>
      </div>
      <div className="mb-6" role="status">
        {state.source === "sample" && <SampleBadge />}
        {state.source === "capstone" && <p className="flex flex-wrap items-center gap-2 text-sm text-muted"><Pill tone="violet">Case data</Pill>Supplied by the Masai School × IIT Roorkee capstone, used exactly as given — not PhonePe production data. <Link to="/projects/phonepe-smart-spend-coach" className="underline underline-offset-4">Case study</Link></p>}
        {state.source === "edited" && <p className="flex flex-wrap items-center gap-2 text-sm text-muted"><Pill tone="amber">Edited</Pill>You changed the capstone figures, so this is no longer case data.</p>}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_1fr]">
        <div className="relative overflow-x-auto rounded-xl border border-line">
          <table className="w-full min-w-[640px] text-left text-sm">
            <caption className="sr-only">Funnel steps, editable</caption>
            <thead className="bg-raise"><tr>{["Step", "Users", "Step conv.", "Drop-off", "Overall", ""].map((h) => <th key={h} scope="col" className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[.08em] text-muted">{h || <span className="sr-only">Actions</span>}</th>)}</tr></thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.id} className="border-t border-line-soft">
                  <td className="px-3 py-2"><input aria-label={`Step ${i + 1} name`} value={r.label} onChange={(e) => edit(state.steps.map((s) => (s.id === r.id ? { ...s, label: e.target.value } : s)))} className="field" /></td>
                  <td className="px-3 py-2"><input aria-label={`Users at ${r.label}`} type="number" min={0} value={r.users} onChange={(e) => edit(state.steps.map((s) => (s.id === r.id ? { ...s, users: Math.max(0, Number(e.target.value) || 0) } : s)))} className="field w-28" /></td>
                  <td className="px-3 py-2 font-mono" data-testid="step-conv">{pct(r.stepConv)}</td>
                  <td className="px-3 py-2 font-mono text-red">{pct(r.dropOff)}</td>
                  <td className="px-3 py-2 font-mono text-green" data-testid="overall">{pct(r.overall, 2)}</td>
                  <td className="px-3 py-2"><button type="button" aria-label={`Remove ${r.label}`} disabled={state.steps.length <= 2} onClick={() => edit(state.steps.filter((s) => s.id !== r.id))} className="inline-flex size-10 items-center justify-center rounded-lg border border-line text-muted hover:text-red disabled:opacity-30"><Icon name="trash" size={16} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <figure className="card p-5">
          <figcaption className="label mb-4">Funnel — bar width is users relative to the first step</figcaption>
          <ol className="grid gap-2.5" aria-hidden>
            {rows.map((r) => (
              <li key={r.id}>
                <div className="mb-1 flex justify-between gap-2 text-xs text-muted"><span className="truncate">{r.label}</span><span className="font-mono">{r.users.toLocaleString("en-IN")}</span></div>
                <div className="h-7 rounded-md bg-raise"><div className="h-7 rounded-md bg-green/80" style={{ width: `${Math.max(0.6, (r.users / max) * 100)}%` }} /></div>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-sm text-[#C9D2CD]">Overall conversion: <b className="font-mono text-green">{pct(rows.at(-1)?.overall ?? 0, 2)}</b>{worst && <> · Largest step loss: <b>{worst.label}</b> ({pct(worst.dropOff)} drop-off)</>}</p>
        </figure>
      </div>
    </ToolShell>
  );
}
