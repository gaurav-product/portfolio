import { useMemo, useState } from "react";
import { ToolShell, SampleBadge } from "./common";
import { Button } from "../ui";
import { Icon } from "../Icon";
import { riceScore, IMPACT, toCsv, download, uid, type RiceRow } from "~/lib/pm";
import { useSessionState } from "~/lib/session";
import { track } from "~/lib/analytics";

const SAMPLE: RiceRow[] = [
  { id: "s1", name: "Guided onboarding checklist", reach: 4000, impact: 2, confidence: 80, effort: 3 },
  { id: "s2", name: "Weekly progress email", reach: 6000, impact: 1, confidence: 50, effort: 1 },
  { id: "s3", name: "Practitioner chat", reach: 800, impact: 3, confidence: 50, effort: 8 },
];
const IMPACT_LABEL: Record<number, string> = { 3: "3 — massive", 2: "2 — high", 1: "1 — medium", 0.5: "0.5 — low", 0.25: "0.25 — minimal" };

export function RiceTool() {
  const [rows, setRows] = useSessionState<RiceRow[]>("rice", SAMPLE);
  const [sorted, setSorted] = useState(true);
  const isSample = rows.length === SAMPLE.length && rows.every((r, i) => JSON.stringify(r) === JSON.stringify(SAMPLE[i]));
  const view = useMemo(() => {
    const withScore = rows.map((r) => ({ ...r, score: riceScore(r) }));
    return sorted ? [...withScore].sort((a, b) => (b.score ?? -1) - (a.score ?? -1)) : withScore;
  }, [rows, sorted]);
  const upd = (id: string, k: keyof RiceRow, v: string) => setRows(rows.map((r) => (r.id === id ? { ...r, [k]: k === "name" ? v : v === "" ? NaN : Number(v) } : r)));
  const exportCsv = () => {
    download("rice-prioritization.csv", toCsv(["Feature", "Reach", "Impact", "Confidence %", "Effort", "RICE score"], view.map((r) => [r.name, r.reach, r.impact, r.confidence, r.effort, r.score == null ? "invalid" : r.score.toFixed(1)])), "text/csv");
    track("export_downloaded", { tool: "rice" });
  };

  return (
    <ToolShell slug="rice" actions={<>
      <Button icon="plus" onClick={() => setRows([...rows, { id: uid(), name: "New feature", reach: 1000, impact: 1, confidence: 50, effort: 1 }])}>Add feature</Button>
      <Button icon="download" onClick={exportCsv} disabled={!rows.length} variant="primary">Export CSV</Button>
      <Button icon="reset" variant="ghost" onClick={() => setRows(SAMPLE)}>Reset</Button>
    </>}>
      <div className="card mb-6 p-5">
        <p className="font-mono text-green">RICE = Reach × Impact × (Confidence ÷ 100) ÷ Effort</p>
        <p className="mt-2 text-sm text-muted">Reach: people affected per period. Impact: 3 / 2 / 1 / 0.5 / 0.25. Confidence: 0–100%. Effort: person-months (must be above 0). Invalid inputs show “—” instead of a score.</p>
        {isSample && <div className="mt-3"><SampleBadge /></div>}
      </div>
      <div className="mb-3 flex items-center gap-3">
        <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={sorted} onChange={(e) => setSorted(e.target.checked)} className="size-4 accent-[#6BE39A]" />Sort by score</label>
        <span role="status" className="label">{rows.length} feature{rows.length === 1 ? "" : "s"}</span>
      </div>
      <div className="overflow-x-auto rounded-xl border border-line">
        <table className="w-full min-w-[820px] text-left text-sm">
          <caption className="sr-only">RICE scores, editable</caption>
          <thead className="bg-raise"><tr>{["#", "Feature", "Reach", "Impact", "Confidence %", "Effort", "Score", ""].map((h) => <th key={h} scope="col" className="px-3 py-2.5 font-mono text-[11px] uppercase tracking-wider text-muted">{h}</th>)}</tr></thead>
          <tbody>
            {view.map((r, i) => (
              <tr key={r.id} className="border-t border-line-soft">
                <td className="px-3 py-2 font-mono text-dim">{i + 1}</td>
                <td className="px-3 py-2"><input aria-label={`Feature name, row ${i + 1}`} value={r.name} onChange={(e) => upd(r.id, "name", e.target.value)} className="field" /></td>
                <td className="px-3 py-2"><input aria-label={`Reach for ${r.name}`} type="number" min={0} value={Number.isNaN(r.reach) ? "" : r.reach} onChange={(e) => upd(r.id, "reach", e.target.value)} className="field w-28" /></td>
                <td className="px-3 py-2"><select aria-label={`Impact for ${r.name}`} value={r.impact} onChange={(e) => upd(r.id, "impact", e.target.value)} className="field w-36">{IMPACT.map((v) => <option key={v} value={v}>{IMPACT_LABEL[v]}</option>)}</select></td>
                <td className="px-3 py-2"><input aria-label={`Confidence for ${r.name}`} type="number" min={0} max={100} value={Number.isNaN(r.confidence) ? "" : r.confidence} onChange={(e) => upd(r.id, "confidence", e.target.value)} className="field w-24" /></td>
                <td className="px-3 py-2"><input aria-label={`Effort for ${r.name}`} type="number" min={0.1} step={0.5} value={Number.isNaN(r.effort) ? "" : r.effort} onChange={(e) => upd(r.id, "effort", e.target.value)} className="field w-24" /></td>
                <td className="px-3 py-2 font-mono text-lg text-green" data-testid="rice-score">{r.score == null ? "—" : r.score.toFixed(1)}</td>
                <td className="px-3 py-2"><button type="button" aria-label={`Remove ${r.name}`} onClick={() => setRows(rows.filter((x) => x.id !== r.id))} className="inline-flex size-10 items-center justify-center rounded-lg border border-line text-muted hover:text-red"><Icon name="trash" size={16} /></button></td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan={8} className="px-3 py-8 text-center text-muted">No features. Use “Add feature” or “Reset”.</td></tr>}
          </tbody>
        </table>
      </div>
    </ToolShell>
  );
}
