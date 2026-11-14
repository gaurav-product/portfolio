import type { ReactNode } from "react";
import { Link } from "react-router";
import { Container, Pill } from "../ui";
import { Icon } from "../Icon";
import { TOOLS } from "~/content/nav";

export function ToolShell({ slug, children, actions }: { slug: string; children: ReactNode; actions?: ReactNode }) {
  const t = TOOLS.find((x) => x.slug === slug)!;
  const i = TOOLS.indexOf(t);
  const next = TOOLS[(i + 1) % TOOLS.length];
  return (
    <Container wide className="py-10">
      <Link to="/product-thinking" className="inline-flex min-h-8 items-center gap-2 text-sm text-muted hover:text-ink"><Icon name="back" size={16} />Product Thinking</Link>
      <header className="mt-5 flex flex-col gap-4 border-b border-line pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="eyebrow mb-2">Tool {i + 1} of {TOOLS.length}</p>
          <h1 className="text-4xl font-bold">{t.name}</h1>
          <p className="mt-2 max-w-2xl text-muted">{t.blurb}</p>
          <p className="mt-3 flex items-center gap-2 text-sm text-dim"><Icon name="evidence" size={16} />Saved in this browser tab only (session storage). Nothing is sent to a server.</p>
        </div>
        <div className="flex flex-wrap gap-2">{actions}</div>
      </header>
      <div className="mt-8">{children}</div>
      <nav aria-label="Next tool" className="mt-14 border-t border-line pt-6">
        <Link to={`/product-thinking/${next.slug}`} className="inline-flex items-center gap-2 text-green">Next tool: {next.name}<Icon name="arrow" size={16} /></Link>
      </nav>
    </Container>
  );
}

export const SampleBadge = ({ label = "Illustrative sample — not project data" }: { label?: string }) => <Pill tone="amber">{label}</Pill>;

export function Field({ id, label, children, hint }: { id: string; label: string; children: ReactNode; hint?: string }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-dim">{hint}</p>}
    </div>
  );
}

export function ListEditor({ id, label, items, onChange, placeholder }: { id: string; label: string; items: string[]; onChange: (v: string[]) => void; placeholder: string }) {
  return (
    <fieldset className="grid gap-2">
      <legend className="mb-1.5 text-sm font-medium">{label}</legend>
      {items.map((v, i) => (
        <div key={i} className="flex gap-2">
          <label htmlFor={`${id}-${i}`} className="sr-only">{label} {i + 1}</label>
          <input id={`${id}-${i}`} value={v} onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))} className="field" placeholder={placeholder} />
          <button type="button" aria-label={`Remove ${label.toLowerCase()} ${i + 1}`} onClick={() => onChange(items.filter((_, j) => j !== i))} className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg border border-line text-muted hover:text-red"><Icon name="trash" size={16} /></button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...items, ""])} className="inline-flex min-h-10 w-fit items-center gap-1.5 rounded-lg border border-dashed border-line px-3 text-sm text-muted hover:text-ink"><Icon name="plus" size={16} />Add {label.toLowerCase().replace(/s$/, "")}</button>
    </fieldset>
  );
}

export const mdList = (items: string[]) => items.filter((x) => x.trim()).map((x) => `- ${x.trim()}`).join("\n") || "- _None_";
export const slugDate = () => new Date().toISOString().slice(0, 10);
