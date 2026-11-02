import { Link } from "react-router";
import type { ReactNode, ButtonHTMLAttributes } from "react";
import type { Block, Claim, EvidenceStatus, ProjectStatus } from "~/content/types";
import { SOURCES } from "~/content/sources";
import { Icon, type IconName } from "./Icon";

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

export function Container({ children, className = "", wide = false }: { children: ReactNode; className?: string; wide?: boolean }) {
  return <div className={cx("mx-auto w-full px-4 sm:px-6 lg:px-8", wide ? "max-w-[1440px]" : "max-w-6xl", className)}>{children}</div>;
}

type Variant = "primary" | "secondary" | "ghost";
const BTN: Record<Variant, string> = {
  primary: "bg-green text-green-ink hover:bg-[#7dff7d] font-semibold",
  secondary: "border border-line bg-surface/70 text-ink hover:border-green/60 hover:bg-raise",
  ghost: "text-muted hover:text-ink hover:bg-raise",
};
const base = "inline-flex items-center justify-center gap-2 rounded-xl px-4 min-h-11 text-[15px] transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed";

export function ButtonLink({ to, children, variant = "secondary", icon, className = "", external, download, onClick, ...rest }:
  { to: string; children: ReactNode; variant?: Variant; icon?: IconName; className?: string; external?: boolean; download?: string | boolean; onClick?: () => void; "aria-label"?: string }) {
  const cls = cx(base, BTN[variant], className);
  const inner = <>{icon && <Icon name={icon} />}{children}{external && <Icon name="external" size={14} />}</>;
  if (external || download !== undefined || to.startsWith("mailto:"))
    return <a href={to} className={cls} onClick={onClick} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...(download !== undefined ? { download } : {})} {...rest}>{inner}</a>;
  return <Link to={to} className={cls} onClick={onClick} {...rest}>{inner}</Link>;
}

export function Button({ variant = "secondary", icon, children, className = "", ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; icon?: IconName }) {
  return <button type="button" className={cx(base, BTN[variant], className)} {...rest}>{icon && <Icon name={icon} />}{children}</button>;
}

export function IconButton({ icon, label, className = "", ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { icon: IconName; label: string }) {
  return (
    <button type="button" aria-label={label} title={label} className={cx("inline-flex size-10 items-center justify-center rounded-lg border border-line text-muted hover:text-ink hover:border-green/60 disabled:opacity-40 disabled:cursor-not-allowed", className)} {...rest}>
      <Icon name={icon} />
    </button>
  );
}

const TONES = {
  green: "text-green border-green/40 bg-green/10",
  cyan: "text-cyan border-cyan/40 bg-cyan/10",
  amber: "text-amber border-amber/40 bg-amber/10",
  violet: "text-violet border-violet/40 bg-violet/10",
  dim: "text-muted border-line bg-raise",
  red: "text-red border-red/40 bg-red/10",
} as const;
export type Tone = keyof typeof TONES;
export function Pill({ children, tone = "dim", className = "" }: { children: ReactNode; tone?: Tone; className?: string }) {
  return <span className={cx("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-[.1em]", TONES[tone], className)}>{children}</span>;
}

export const statusTone = (s: ProjectStatus): Tone =>
  s === "SHIPPED" || s === "PUBLISHED" ? "green" : s === "ACADEMIC CASE" ? "violet" : s.startsWith("PRE-LAUNCH") ? "amber" : "cyan";
export const evidenceTone = (s: EvidenceStatus | string): Tone =>
  s === "VERIFIED" ? "green" : s === "CV" ? "cyan" : s === "CASE DATA" || s === "DESIGNED, NOT RUN" ? "violet" : s === "SELF-REPORTED" ? "amber" : "dim";

export function SectionHeader({ eyebrow, title, intro, id, as: H = "h2", action }: { eyebrow?: string; title: string; intro?: ReactNode; id?: string; as?: "h1" | "h2"; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-3xl">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <H id={id} className={H === "h1" ? "text-4xl sm:text-5xl font-bold" : "text-3xl sm:text-4xl font-bold"}>{title}</H>
        {intro && <div className="mt-4 text-lg text-muted">{intro}</div>}
      </div>
      {action}
    </div>
  );
}

export function PageHero({ eyebrow, title, intro, children, backdrop }: { eyebrow: string; title: string; intro?: ReactNode; children?: ReactNode; backdrop?: ReactNode }) {
  return (
    <header className={cx("relative overflow-hidden border-b border-line-soft", !backdrop && "grid-bg")}>
      {backdrop && (
        <div aria-hidden="true" className="absolute inset-0" data-testid="hero-backdrop">
          <div className="absolute inset-y-0 right-0 w-full opacity-35 lg:w-[52%] lg:opacity-95 [&_img]:h-full [&_img]:w-full [&_img]:object-cover">{backdrop}</div>
          <div className="absolute inset-0 bg-bg/40 lg:bg-[linear-gradient(90deg,#0B1110_0%,#0B1110_50%,rgb(11_17_16/.75)_64%,rgb(11_17_16/.1)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-bg to-transparent" />
        </div>
      )}
      <Container className="relative py-14 sm:py-20">
        <p className="eyebrow mb-4">{eyebrow}</p>
        <h1 className="max-w-4xl text-4xl font-bold sm:text-6xl">{title}</h1>
        {intro && <div className="mt-5 max-w-3xl text-lg text-muted">{intro}</div>}
        {children && <div className="mt-8">{children}</div>}
      </Container>
    </header>
  );
}

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="prose-os space-y-4">
      {blocks.map((b, i) => {
        if ("p" in b) return <p key={i}>{b.p}</p>;
        if ("ul" in b) return <ul key={i}>{b.ul.map((x) => <li key={x}>{x}</li>)}</ul>;
        if ("ol" in b) return <ol key={i}>{b.ol.map((x) => <li key={x}>{x}</li>)}</ol>;
        if ("note" in b) return <p key={i} className="rounded-xl border border-amber/30 bg-amber/5 px-4 py-3 text-[15px] !text-[#E9DDBA]"><span className="label mr-2 !text-amber">Note</span>{b.note}</p>;
        if ("flow" in b) return (
          <ol key={i} aria-label="Sequence" className="!flex flex-wrap items-center !gap-2">
            {b.flow.map((x, j) => <li key={x} className="!pl-0 before:!hidden flex items-center gap-2"><span className="rounded-lg border border-green/40 bg-green/5 px-3 py-1.5 font-mono text-xs tracking-wider text-green">{x}</span>{j < b.flow.length - 1 && <Icon name="arrow" size={14} className="text-dim" />}</li>)}
          </ol>);
        if ("kv" in b) return (
          <dl key={i} className="grid gap-x-6 gap-y-3 sm:grid-cols-[minmax(140px,220px)_1fr]">
            {b.kv.map(([k, v]) => <div key={k} className="contents"><dt className="label pt-1">{k}</dt><dd className="text-[#C9D2CD]">{v}</dd></div>)}
          </dl>);
        if ("table" in b) return (
          <div key={i} className="overflow-x-auto rounded-xl border border-line">
            <table className="w-full min-w-[520px] text-left text-[15px]">
              {b.table.caption && <caption className="caption-bottom px-4 py-2 text-left text-sm text-dim">{b.table.caption}</caption>}
              <thead className="bg-raise"><tr>{b.table.head.map((h) => <th key={h} scope="col" className="px-4 py-2.5 font-mono text-[11.5px] font-medium uppercase tracking-wider text-muted">{h}</th>)}</tr></thead>
              <tbody>{b.table.rows.map((r, ri) => <tr key={ri} className="border-t border-line-soft">{r.map((c, ci) => <td key={ci} className="px-4 py-2.5 align-top text-[#C9D2CD]">{c}</td>)}</tr>)}</tbody>
            </table>
          </div>);
        if ("quote" in b) return <blockquote key={i} className="border-l-2 border-green pl-4 text-lg text-ink"><p>“{b.quote}”</p>{b.cite && <footer className="label mt-2">{b.cite}</footer>}</blockquote>;
        return null;
      })}
    </div>
  );
}

export function SourceLinks({ ids, className = "" }: { ids: string[]; className?: string }) {
  if (!ids.length) return null;
  return (
    <p className={cx("flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-dim", className)}>
      <span className="label">Source</span>
      {ids.map((id) => {
        const s = SOURCES[id];
        if (!s) return null;
        if (!s.href) return <span key={id}>{s.label}</span>;
        const ext = s.href.startsWith("http");
        return ext
          ? <a key={id} href={s.href} target="_blank" rel="noopener noreferrer" className="underline decoration-line underline-offset-4 hover:text-ink">{s.label}</a>
          : <Link key={id} to={s.href} className="underline decoration-line underline-offset-4 hover:text-ink">{s.label}</Link>;
      })}
    </p>
  );
}

export function ClaimList({ claims }: { claims: Claim[] }) {
  return (
    <ul className="grid gap-3">
      {claims.map((c) => (
        <li key={c.text} className="flex gap-3">
          <Icon name="check" size={18} className="mt-1 shrink-0 text-green" />
          <span className="text-[#C9D2CD]">{c.text} <Pill tone={evidenceTone(c.status)} className="ml-1 align-middle">{c.status}</Pill></span>
        </li>
      ))}
    </ul>
  );
}

export function Empty({ title, children }: { title: string; children?: ReactNode }) {
  return <div role="status" className="card p-8 text-center"><p className="font-display text-xl">{title}</p>{children && <div className="mt-2 text-muted">{children}</div>}</div>;
}
