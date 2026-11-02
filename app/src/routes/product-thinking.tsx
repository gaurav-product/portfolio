import { useState } from "react";
import { Link } from "react-router";
import { legacy } from "~/content/data";
import { TOOLS } from "~/content/nav";
import { PageHero, Container, SectionHeader, cx } from "~/components/ui";
import { Icon } from "~/components/Icon";
import { ProductOrbit } from "~/components/ProductOrbit";
import { seo, asset } from "~/lib/meta";
import { track } from "~/lib/analytics";

export const meta = () => seo("Product Thinking", "The operating loop, principles, product challenges with reasoning revealed after you answer, and seven working PM tools.", "/product-thinking");

export default function ProductThinking() {
  const [stage, setStage] = useState(0);
  const s = legacy.loop[stage];
  return (
    <>
      <PageHero eyebrow="Product Thinking" title="Discover → define → decide → measure → learn."
        intro="How the work gets done, with the evidence for each step — then tools you can use and challenges you can answer." />
      <Container wide className="grid gap-20 py-14">
        <section aria-labelledby="loop">
          <SectionHeader id="loop" eyebrow="Operating loop" title="Eight stages, each backed by real work" />
          <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr]">
            <div>
              <img src={asset("/brand/sections/section-operating-loop.svg")} alt="The operating loop: observe, frame, research, hypothesize, build, measure, learn, iterate." width={1600} height={900} className="mb-4 w-full rounded-xl border border-line" loading="lazy" />
              <div role="tablist" aria-label="Loop stages" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {legacy.loop.map((l, i) => (
                  <button key={l.id} role="tab" type="button" id={`tab-${l.id}`} aria-selected={i === stage} aria-controls="loop-panel" onClick={() => setStage(i)}
                    className={cx("min-h-10 rounded-lg border px-2 font-mono text-xs tracking-wider", i === stage ? "border-green bg-green/10 text-green" : "border-line text-muted hover:text-ink")}>{l.k}</button>
                ))}
              </div>
            </div>
            <div id="loop-panel" role="tabpanel" aria-labelledby={`tab-${s.id}`} className="card p-6">
              <p className="label">Stage {stage + 1} of {legacy.loop.length}</p>
              <h3 className="mt-2 text-3xl font-bold">{s.k}</h3>
              <p className="mt-3 text-lg text-[#C9D2CD]">{s.d}</p>
              <h4 className="label mb-3 mt-6">Evidence</h4>
              <ul className="grid gap-2">{s.e.map(([n, l]) => <li key={l} className="flex gap-3"><span className="min-w-20 font-mono text-green">{n}</span><span className="text-[#C9D2CD]">{l}</span></li>)}</ul>
              <div className="mt-6 flex gap-2">
                <button type="button" onClick={() => setStage((stage - 1 + legacy.loop.length) % legacy.loop.length)} className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-line px-3 text-sm"><Icon name="left" size={16} />Previous</button>
                <button type="button" onClick={() => setStage((stage + 1) % legacy.loop.length)} className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-line px-3 text-sm">Next<Icon name="right" size={16} /></button>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="orbit">
          <SectionHeader id="orbit" eyebrow="Product Orbit" title="Five domains, one loop" intro="The frame the work runs on — use the arrow keys or select a domain." />
          <ProductOrbit />
        </section>

        <section aria-labelledby="tools">
          <SectionHeader id="tools" eyebrow="Interactive tools" title="Working PM tools" intro="They calculate for real and keep your entries in this browser tab only — nothing is sent anywhere." />
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {TOOLS.map((t) => (
              <li key={t.slug}><Link to={`/product-thinking/${t.slug}`} onClick={() => track("tool_used", { tool: t.slug })} className="card card-link flex h-full flex-col p-5">
                <span className="font-display text-lg font-bold">{t.name}</span>
                <span className="mt-2 text-sm text-muted">{t.blurb}</span>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-medium text-green">Open <Icon name="arrow" size={16} /></span>
              </Link></li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="challenges">
          <SectionHeader id="challenges" eyebrow="Challenge Gaurav" title="Commit to an answer, then see the reasoning" intro="Three real product scenarios. The approach is drawn from documented work — no answer is graded as right or wrong." />
          <div className="grid gap-6">{legacy.challenges.map((c) => <Challenge key={c.id} c={c} />)}</div>
        </section>

        <section aria-labelledby="principles">
          <SectionHeader id="principles" eyebrow="Principles" title="Seven product principles" />
          <ol className="grid gap-3 md:grid-cols-2">
            {legacy.principles.map(([t, d], i) => <li key={t} className="card p-5"><span className="font-mono text-sm text-green">{String(i + 1).padStart(2, "0")}</span><h3 className="mt-1 text-lg font-bold">{t}</h3><p className="mt-1 text-[#C9D2CD]">{d}</p></li>)}
          </ol>
        </section>
      </Container>
    </>
  );
}

function Challenge({ c }: { c: (typeof legacy.challenges)[number] }) {
  const [pick, setPick] = useState<number | null>(null);
  return (
    <article className="card p-6" aria-labelledby={`${c.id}-h`}>
      <p className="label">Challenge {c.num} · {c.tag}</p>
      <h3 id={`${c.id}-h`} className="mt-2 text-xl font-bold">{c.scenario}</h3>
      <p className="mt-1 text-muted">{c.ask}</p>
      <fieldset className="mt-4">
        <legend className="sr-only">Your answer</legend>
        <div className="grid gap-2 md:grid-cols-2">
          {c.options.map((o, i) => (
            <label key={o} className={cx("flex cursor-pointer items-start gap-3 rounded-xl border p-3", pick === i ? "border-green bg-green/5" : "border-line hover:border-green/50")}>
              <input type="radio" name={c.id} checked={pick === i} onChange={() => { setPick(i); track("tool_used", { tool: "challenge", id: c.id }); }} className="mt-1 accent-[#4DFF4D]" />
              <span><span className="font-mono text-xs text-dim">{"ABCD"[i]}</span> {o}</span>
            </label>
          ))}
        </div>
      </fieldset>
      {pick === null ? <p className="mt-4 text-sm text-dim">Choose an option to reveal the reasoning.</p> : (
        <div className="mt-6 border-t border-line pt-5" aria-live="polite">
          <p className="label mb-3">You chose {"ABCD"[pick]}. Here is how I would approach it:</p>
          <dl className="grid gap-3">{c.approach.map(([k, v]) => <div key={k} className="grid gap-1 sm:grid-cols-[140px_1fr]"><dt className="label pt-1 !text-green">{k}</dt><dd className="text-[#C9D2CD]">{stripTags(v)}</dd></div>)}</dl>
          <button type="button" onClick={() => setPick(null)} className="mt-4 text-sm text-muted underline underline-offset-4 hover:text-ink">Reset this challenge</button>
        </div>
      )}
    </article>
  );
}
const stripTags = (s: string) => s.replace(/<[^>]+>/g, "");
