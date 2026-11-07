import screenshots from "~/data/screenshots.json";
import { Pill } from "./ui";
import { asset } from "~/lib/meta";

interface Shot { id: string; project: string; src: string; panel?: string; width?: number; alt: string; caption: string; data_note: string; source: string }

/** Real product screenshots — rendered only once approved in
 *  brand/screenshot-review/approvals.json. Always labelled as demo data. */
export function Screenshots({ project }: { project: string }) {
  const list = (screenshots as Shot[]).filter((s) => s.project === project);
  if (!list.length) return null;
  return (
    <section aria-labelledby="shots-h" className="mb-12">
      <div className="mb-4 flex flex-wrap items-center gap-2"><h2 id="shots-h" className="text-2xl font-bold">Screens from the build</h2><Pill tone="amber">Demo data</Pill></div>
      <p className="mb-4 text-sm text-muted">{list[0].data_note}</p>
      <ul className="grid gap-4 sm:grid-cols-2">
        {list.map((s) => (
          <li key={s.id}>
            <figure className="card overflow-hidden" data-tilt>
              <a href={asset(s.src)} target="_blank" rel="noopener noreferrer" data-cursor="open"><img src={asset(s.panel ?? s.src)} alt={`${s.alt} (demo data)`} loading="lazy" decoding="async" width={960} height={600} className="aspect-[16/10] w-full object-cover object-top" /></a>
              <figcaption className="flex flex-wrap items-center justify-between gap-2 p-3 text-sm"><span>{s.caption} <span className="text-amber">· Demo data</span></span><a href={s.source} target="_blank" rel="noopener noreferrer" className="text-dim underline underline-offset-4 hover:text-ink">Original</a></figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
