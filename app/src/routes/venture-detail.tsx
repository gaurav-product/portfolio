import { Link, useParams } from "react-router";
import { ventureBySlug, VENTURES_NOTE, MODEL_NOTE, type Venture } from "~/content/ventures";
import { Container, Pill, ButtonLink } from "~/components/ui";
import { Icon } from "~/components/Icon";
import { seo } from "~/lib/meta";
import NotFound from "./not-found";
import type { Route } from "./+types/venture-detail";

export const meta = ({ params }: Route.MetaArgs) => {
  const v = ventureBySlug(params.slug ?? "");
  return v ? seo(`${v.name} — concept in development`, `${v.vision} ${v.category}. ${VENTURES_NOTE}`, `/ventures/${v.slug}`) : seo("Not found", "", "/ventures");
};

export default function VentureDetail() {
  const v = ventureBySlug(useParams().slug ?? "");
  if (!v) return <NotFound />;
  return (
    <Container className="py-12 sm:py-16">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-dim"><Link to="/ventures" className="hover:text-ink">Emerging Ventures</Link> / {v.name}</nav>
      <VentureBody v={v} headingLevel={1} />
      <div className="mt-10 flex flex-wrap gap-3">
        <ButtonLink to={`/ventures/${v.slug}/world`} variant="primary" icon="explore">Visit in 3D</ButtonLink>
        <ButtonLink to="/contact" icon="mail">Talk to Gaurav about it</ButtonLink>
      </div>
    </Container>
  );
}

/** Shared by the readable page and the 3D concept world's panel. */
export function VentureBody({ v, headingLevel = 2, bare = false }: { v: Venture; headingLevel?: 1 | 2; bare?: boolean }) {
  const H = headingLevel === 1 ? "h1" : "h2";
  const S = headingLevel === 1 ? "h2" : "h3";
  return (
    <article>
      {!bare && <>
        <div className="flex flex-wrap items-center gap-2"><Pill tone="amber">{v.status}</Pill><span className="text-sm text-dim">{v.category}</span></div>
        <H className="mt-4 text-4xl font-bold sm:text-5xl">{v.name}</H>
      </>}
      <p className={bare ? "text-lg text-[#D7DEDA]" : "mt-3 text-xl text-[#D7DEDA]"}>“{v.vision}”</p>
      <p role="note" className="mt-5 rounded-xl border border-amber/40 bg-amber/10 px-4 py-3 text-sm text-ink">{VENTURES_NOTE}</p>

      <section className="mt-10"><S className="text-2xl font-bold">Problem</S><ul className="mt-3 grid gap-2 text-muted">{v.problem.map((p) => <li key={p}>{p}</li>)}</ul></section>
      <section className="mt-8"><S className="text-2xl font-bold">Proposed solution</S><p className="mt-3 text-muted">{v.solution}</p></section>
      {v.market?.map((m) => (
        <section key={m.label} className="mt-8"><S className="text-2xl font-bold">{m.label}</S>
          <ul className="mt-3 flex flex-wrap gap-2">{m.items.map((i) => <li key={i} className="rounded-full border border-line px-3 py-1 text-sm text-muted">{i}</li>)}</ul></section>
      ))}
      <section className="mt-8"><S className="text-2xl font-bold">Proposed features</S>
        <ol className="mt-3 grid gap-3 sm:grid-cols-2">{v.features.map((f, i) => (
          <li key={f.name} className="card p-4"><p className="font-semibold">{i + 1}. {f.name}</p><p className="mt-1 text-sm text-muted">{f.detail}</p></li>
        ))}</ol></section>
      <section className="mt-8"><S className="text-2xl font-bold">Proposed business model</S>
        <p className="mt-2 text-sm text-amber">{MODEL_NOTE}</p>
        <ul className="mt-3 grid gap-2 text-muted">{v.model.map((m) => <li key={m} className="flex gap-2"><Icon name="check" size={18} className="mt-0.5 shrink-0 text-dim" />{m}</li>)}</ul></section>
      {v.example && (
        <section className="mt-8"><S className="text-2xl font-bold">{v.example.label}</S>
          <table className="mt-3 w-full max-w-md text-left text-sm"><tbody>{v.example.rows.map(([k, val]) => <tr key={k} className="border-b border-line-soft"><th scope="row" className="py-2 font-normal text-muted">{k}</th><td className="py-2 font-mono">{val}</td></tr>)}</tbody></table>
          <p className="mt-2 text-sm text-dim">{v.example.note}</p></section>
      )}
      {v.trust && (
        <section className="mt-8"><S className="text-2xl font-bold">Legal and trust requirements</S>
          <ul className="mt-3 grid gap-2 text-muted">{v.trust.map((t) => <li key={t} className="flex gap-2"><Icon name="shield" size={18} className="mt-0.5 shrink-0 text-cyan" />{t}</li>)}</ul></section>
      )}
      <section className="mt-8"><S className="text-2xl font-bold">Open questions</S><ul className="mt-3 grid gap-2 text-muted">{v.openQuestions.map((q) => <li key={q}>{q}</li>)}</ul></section>
    </article>
  );
}
