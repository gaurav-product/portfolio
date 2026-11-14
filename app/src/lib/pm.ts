/** Pure calculations behind the Product Thinking tools. */
export interface RiceRow { id: string; name: string; reach: number; impact: number; confidence: number; effort: number }
export const IMPACT = [3, 2, 1, 0.5, 0.25] as const; // massive, high, medium, low, minimal
export function riceScore(r: Pick<RiceRow, "reach" | "impact" | "confidence" | "effort">): number | null {
  if (![r.reach, r.impact, r.confidence, r.effort].every((n) => Number.isFinite(n))) return null;
  if (r.effort <= 0 || r.reach < 0 || r.confidence < 0 || r.confidence > 100) return null;
  return (r.reach * r.impact * (r.confidence / 100)) / r.effort;
}

export interface FunnelStep { id: string; label: string; users: number }
export interface FunnelRow extends FunnelStep { stepConv: number | null; dropOff: number | null; overall: number }
export function funnel(steps: FunnelStep[]): FunnelRow[] {
  const top = steps[0]?.users ?? 0;
  return steps.map((s, i) => {
    const prev = i ? steps[i - 1].users : null;
    const stepConv = prev == null ? null : prev > 0 ? s.users / prev : 0;
    return { ...s, stepConv, dropOff: stepConv == null ? null : 1 - stepConv, overall: top > 0 ? s.users / top : 0 };
  });
}
export const pct = (n: number | null, d = 1) => (n == null || !Number.isFinite(n) ? "—" : (n * 100).toFixed(d) + "%");

export function toCsv(head: string[], rows: (string | number)[][]): string {
  const cell = (v: string | number) => {
    const s = String(v);
    // neutralise spreadsheet formula injection, then quote
    const safe = /^[=+\-@\t\r]/.test(s) && !/^-?\d/.test(s) ? "'" + s : s;
    return /[",\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
  };
  return [head, ...rows].map((r) => r.map(cell).join(",")).join("\n") + "\n";
}

export function download(filename: string, content: string, type = "text/plain") {
  const url = URL.createObjectURL(new Blob([content], { type: type + ";charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export const uid = () => Math.random().toString(36).slice(2, 10);
