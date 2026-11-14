import { useState } from "react";
import { ToolShell, SampleBadge } from "./common";
import { Button, cx } from "../ui";
import { Icon } from "../Icon";
import { uid, download } from "~/lib/pm";
import { useSessionState } from "~/lib/session";

type Col = "must" | "should" | "could" | "wont";
const COLS: { id: Col; label: string }[] = [{ id: "must", label: "Must have" }, { id: "should", label: "Should have" }, { id: "could", label: "Could have" }, { id: "wont", label: "Won't have (now)" }];
interface Item { id: string; text: string; col: Col }
const SAMPLE: Item[] = [
  { id: "a", text: "Sign-in", col: "must" }, { id: "b", text: "Daily care record", col: "must" },
  { id: "c", text: "Handover summary", col: "should" }, { id: "d", text: "Dark mode", col: "could" }, { id: "e", text: "In-app payments", col: "wont" },
];

export function MoscowTool() {
  const [items, setItems] = useSessionState<Item[]>("moscow", SAMPLE);
  const [draft, setDraft] = useState(""); const [draftCol, setDraftCol] = useState<Col>("must");
  const [editing, setEditing] = useState<string | null>(null);
  const [drag, setDrag] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  const move = (id: string, dir: -1 | 1) => {
    const it = items.find((x) => x.id === id)!; const ci = COLS.findIndex((c) => c.id === it.col) + dir;
    if (ci < 0 || ci >= COLS.length) return;
    setItems(items.map((x) => (x.id === id ? { ...x, col: COLS[ci].id } : x))); setMsg(`Moved “${it.text}” to ${COLS[ci].label}`);
  };
  const reorder = (id: string, dir: -1 | 1) => {
    const it = items.find((x) => x.id === id)!; const same = items.filter((x) => x.col === it.col); const k = same.indexOf(it) + dir;
    if (k < 0 || k >= same.length) return;
    const other = same[k]; const a = items.indexOf(it), b = items.indexOf(other);
    const n = [...items]; [n[a], n[b]] = [n[b], n[a]]; setItems(n); setMsg(`Moved “${it.text}” ${dir < 0 ? "up" : "down"}`);
  };
  const add = (e: React.FormEvent) => { e.preventDefault(); if (!draft.trim()) return; setItems([...items, { id: uid(), text: draft.trim(), col: draftCol }]); setMsg(`Added “${draft.trim()}”`); setDraft(""); };
  const exportMd = () => download("moscow.md", COLS.map((c) => `## ${c.label}\n` + (items.filter((i) => i.col === c.id).map((i) => `- ${i.text}`).join("\n") || "- _None_")).join("\n\n") + "\n", "text/markdown");

  return (
    <ToolShell slug="moscow" actions={<><Button icon="download" variant="primary" onClick={exportMd}>Export Markdown</Button><Button icon="reset" variant="ghost" onClick={() => { setItems(SAMPLE); setMsg("Board reset"); }}>Reset board</Button></>}>
      <form onSubmit={add} className="card mb-6 flex flex-col gap-3 p-4 sm:flex-row sm:items-end">
        <div className="flex-1"><label htmlFor="m-new" className="mb-1.5 block text-sm font-medium">New item</label><input id="m-new" value={draft} onChange={(e) => setDraft(e.target.value)} className="field" placeholder="e.g. Export to PDF" /></div>
        <div><label htmlFor="m-col" className="mb-1.5 block text-sm font-medium">Column</label><select id="m-col" value={draftCol} onChange={(e) => setDraftCol(e.target.value as Col)} className="field">{COLS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}</select></div>
        <button type="submit" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-green px-4 font-semibold text-green-ink"><Icon name="plus" />Add item</button>
      </form>
      <p className="mb-3 text-sm text-dim">Drag cards between columns, or use the arrow buttons (keyboard and touch). <SampleBadge /></p>
      <p role="status" aria-live="polite" className="sr-only">{msg}</p>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {COLS.map((c, ci) => {
          const list = items.filter((i) => i.col === c.id);
          return (
            <section key={c.id} aria-labelledby={`col-${c.id}`} data-col={c.id}
              onDragOver={(e) => e.preventDefault()} onDrop={() => { if (drag) { setItems(items.map((x) => (x.id === drag ? { ...x, col: c.id } : x))); setDrag(null); } }}
              className={cx("card min-h-48 p-3", drag && "border-dashed border-green/50")}>
              <h2 id={`col-${c.id}`} className="mb-3 flex items-center justify-between px-1 font-display text-lg font-bold">{c.label}<span className="font-mono text-sm text-dim">{list.length}</span></h2>
              <ul className="grid gap-2">
                {list.map((it, k) => (
                  <li key={it.id} draggable onDragStart={() => setDrag(it.id)} onDragEnd={() => setDrag(null)} className="rounded-xl border border-line bg-bg p-3" data-testid="moscow-item">
                    {editing === it.id ? (
                      <form onSubmit={(e) => { e.preventDefault(); setEditing(null); }}>
                        <label htmlFor={`e-${it.id}`} className="sr-only">Edit item</label>
                        <input id={`e-${it.id}`} autoFocus value={it.text} onChange={(e) => setItems(items.map((x) => (x.id === it.id ? { ...x, text: e.target.value } : x)))} onBlur={() => setEditing(null)} className="field" />
                      </form>
                    ) : <p className="text-[15px]">{it.text}</p>}
                    <div className="mt-2 flex flex-wrap gap-1">
                      <IB icon="left" label={`Move ${it.text} to previous column`} disabled={ci === 0} onClick={() => move(it.id, -1)} />
                      <IB icon="right" label={`Move ${it.text} to next column`} disabled={ci === COLS.length - 1} onClick={() => move(it.id, 1)} />
                      <IB icon="up" label={`Move ${it.text} up`} disabled={k === 0} onClick={() => reorder(it.id, -1)} />
                      <IB icon="down" label={`Move ${it.text} down`} disabled={k === list.length - 1} onClick={() => reorder(it.id, 1)} />
                      <IB icon="edit" label={`Edit ${it.text}`} onClick={() => setEditing(it.id)} />
                      <IB icon="trash" label={`Delete ${it.text}`} onClick={() => { setItems(items.filter((x) => x.id !== it.id)); setMsg(`Deleted “${it.text}”`); }} />
                    </div>
                  </li>
                ))}
                {!list.length && <li className="rounded-xl border border-dashed border-line-soft p-4 text-center text-sm text-dim">Empty — drop or move an item here</li>}
              </ul>
            </section>
          );
        })}
      </div>
    </ToolShell>
  );
}

function IB({ icon, label, onClick, disabled }: { icon: "left" | "right" | "up" | "down" | "edit" | "trash"; label: string; onClick: () => void; disabled?: boolean }) {
  return <button type="button" aria-label={label} title={label} disabled={disabled} onClick={onClick} className="inline-flex size-9 items-center justify-center rounded-lg border border-line-soft text-muted hover:border-green/60 hover:text-ink disabled:opacity-30"><Icon name={icon} size={15} /></button>;
}
