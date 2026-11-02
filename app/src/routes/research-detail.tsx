import { useEffect, useRef, useState } from "react";
import { Link, useLoaderData, useParams } from "react-router";
import { corpus, studyByDay } from "~/content/corpus";
import { projects } from "~/content/projects";
import { Container, Pill, evidenceTone, ButtonLink, cx } from "~/components/ui";
import { Icon } from "~/components/Icon";
import { seo } from "~/lib/meta";
import type { Route } from "./+types/research-detail";

interface StudyText {
  day: number; html: string; toc: { id: string; text: string; level: number }[]; words: number; mermaid: number;
  assumptions: { html: string; toc: { id: string; text: string; level: number }[]; url: string } | null;
  source: { repo: string; commit: string; readme_url: string; path: string };
}

/** Runs at prerender time only: the study text is written into the HTML and a
 *  .data file, never into a JavaScript bundle. */
export async function loader({ params }: Route.LoaderArgs): Promise<StudyText> {
  const { readFile } = await import("node:fs/promises");
  const day = Number(params.day);
  if (!Number.isInteger(day) || day < 1 || day > 90) throw new Response("Not found", { status: 404 });
  return JSON.parse(await readFile(`src/data/generated/studies/${day}.json`, "utf8"));
}

export const meta = ({ params }: Route.MetaArgs) => {
  const s = studyByDay(Number(params.day));
  return s ? seo(`Day ${s.day} — ${s.company}`, s.summary.slice(0, 155), `/research/${s.day}`) : seo("Not found", "Study not found", "/research");
};

export default function Study() {
  const { day } = useParams();
  const text = useLoaderData<typeof loader>();
  const s = studyByDay(Number(day));
  if (!s) throw new Response("Not found", { status: 404 });
  const i = corpus.studies.indexOf(s);
  const prev = corpus.studies[i - 1], next = corpus.studies[i + 1];
  const [tab, setTab] = useState<"study" | "assumptions">("study");
  const body = useRef<HTMLDivElement>(null);
  const toc = (tab === "study" ? text.toc : text.assumptions?.toc ?? []).filter((t) => t.level >= 2);
  const related = projects.filter((p) => p.categories.some((c) => c.toLowerCase() === s.category.toLowerCase())).slice(0, 3);
  const facts: [string, string][] = [
    ["Evidence level", `${s.evidence_level} · score ${s.evidence_score}/8`], ["Category", `${s.category} (derived)`],
    ["Words", s.words.toLocaleString("en-IN")], ["References", String(s.sources)],
    ["ASSUMPTIONS file", s.has_assumptions ? "Yes" : "No"], ["Programmatic checks", s.checks != null ? String(s.checks) : "None stated"],
  ];

  useMermaid(body, `${day}-${tab}`);

  return (
    <article>
      <header className="border-b border-line-soft">
        <Container wide className="py-10">
          <Link to="/research" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink"><Icon name="back" size={16} />Research library</Link>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="font-mono text-green">DAY {String(s.day).padStart(2, "0")}</span>
            <Pill tone={evidenceTone(s.evidence_level)}>{s.evidence_level}</Pill>
            {s.flags.map((f) => <Pill key={f}>{f}</Pill>)}
          </div>
          <h1 className="mt-3 max-w-4xl text-4xl font-bold sm:text-5xl">{s.company}</h1>
          <p className="mt-2 max-w-4xl text-lg text-muted">{s.title}</p>
          {s.internal_day && s.internal_day !== s.day && <p className="mt-3 text-sm text-amber">This study numbers itself Day {s.internal_day}. Directory order is canonical, so it is listed as Day {s.day}.</p>}
          <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">{facts.map(([k, v]) => <div key={k} className="card px-4 py-3"><dt className="label">{k}</dt><dd className="mt-1 text-sm">{v}</dd></div>)}</dl>
          <p className="mt-4 text-sm text-dim">
            Full original text, rendered from <a href={text.source.readme_url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-ink">{text.source.path}</a> at commit <code className="font-mono text-xs">{text.source.commit.slice(0, 7)}</code>. Text and citations are unedited.
          </p>
        </Container>
      </header>

      <Container wide className="grid gap-10 py-10 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:self-start lg:overflow-y-auto">
          {text.assumptions && (
            <div role="tablist" aria-label="Document" className="mb-4 grid grid-cols-2 gap-1 rounded-xl border border-line p-1">
              {(["study", "assumptions"] as const).map((t) => (
                <button key={t} type="button" role="tab" aria-selected={tab === t} aria-controls="study-body" onClick={() => { setTab(t); window.scrollTo({ top: 0 }); }}
                  className={cx("min-h-9 rounded-lg text-sm", tab === t ? "bg-green font-semibold text-green-ink" : "text-muted hover:text-ink")}>{t === "study" ? "Case study" : "Assumptions"}</button>
              ))}
            </div>
          )}
          <details className="card lg:hidden"><summary className="cursor-pointer px-4 py-3 font-medium">Contents ({toc.length})</summary>
            <ol className="grid gap-0.5 px-2 pb-3">{toc.map((t) => <li key={t.id}><a href={`#${t.id}`} className={cx("block rounded px-2 py-1.5 text-sm text-muted hover:text-ink", t.level === 3 && "pl-5")}>{t.text}</a></li>)}</ol>
          </details>
          <nav aria-label="Contents" className="hidden lg:block">
            <p className="label mb-2">Contents</p>
            <ol className="grid gap-0.5 border-l border-line">{toc.map((t) => <li key={t.id}><a href={`#${t.id}`} className={cx("-ml-px block border-l-2 border-transparent py-1 text-sm text-dim hover:border-green hover:text-ink", t.level === 3 ? "pl-7" : "pl-4")}>{t.text}</a></li>)}</ol>
          </nav>
        </aside>

        <div className="min-w-0">
          <div id="study-body" ref={body} role="tabpanel" className="md max-w-[78ch]" data-testid="study-text"
            dangerouslySetInnerHTML={{ __html: tab === "study" || !text.assumptions ? text.html : text.assumptions.html }} />
          <div className="mt-12 flex flex-wrap gap-3 border-t border-line pt-6">
            <ButtonLink to={text.source.readme_url} external icon="github">View source on GitHub</ButtonLink>
            {text.assumptions && <ButtonLink to={text.assumptions.url} external variant="ghost">ASSUMPTIONS source</ButtonLink>}
          </div>
          {related.length > 0 && <section className="mt-10"><h2 className="label mb-3">Related projects</h2><ul className="flex flex-wrap gap-2">{related.map((p) => <li key={p.slug}><Link to={`/projects/${p.slug}`} className="inline-block rounded-lg border border-line px-3 py-1.5 text-sm hover:border-green/60">{p.name}</Link></li>)}</ul></section>}
          <nav aria-label="Adjacent studies" className="mt-10 grid gap-3 sm:grid-cols-2">
            {prev ? <Link to={`/research/${prev.day}`} className="card card-link p-4"><span className="label">Previous</span><span className="mt-1 block">Day {prev.day} · {prev.company}</span></Link> : <span />}
            {next && <Link to={`/research/${next.day}`} className="card card-link p-4 sm:text-right"><span className="label">Next</span><span className="mt-1 block">Day {next.day} · {next.company}</span></Link>}
          </nav>
        </div>
      </Container>
    </article>
  );
}

/** Mermaid is loaded only when a study contains diagrams. The source stays in
 *  the page (and remains readable) if rendering fails or JavaScript is off. */
function useMermaid(ref: React.RefObject<HTMLDivElement | null>, key: string) {
  useEffect(() => {
    const blocks = Array.from(ref.current?.querySelectorAll<HTMLElement>("figure.mermaid-block:not([data-done])") ?? []);
    if (!blocks.length) return;
    let cancelled = false;
    (async () => {
      const { default: mermaid } = await import("mermaid");
      mermaid.initialize({ startOnLoad: false, theme: "dark", securityLevel: "strict", fontFamily: "Inter Variable, sans-serif" });
      for (const [n, fig] of blocks.entries()) {
        if (cancelled) return;
        const src = fig.querySelector("code")?.textContent ?? "";
        try {
          const { svg } = await mermaid.render(`mmd-${key.replace(/\W/g, "")}-${n}`, src);
          fig.dataset.done = "1";
          fig.innerHTML = `${svg}<details class="mermaid-source"><summary>Diagram source</summary><pre><code></code></pre></details>`;
          fig.querySelector("details code")!.textContent = src;
        } catch { fig.dataset.done = "failed"; }
      }
    })();
    return () => { cancelled = true; };
  }, [ref, key]);
}
