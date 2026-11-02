import { useState } from "react";
import { Link } from "react-router";
import { legacy } from "~/content/data";
import { PageHero, Container, Pill, cx } from "~/components/ui";
import { seo } from "~/lib/meta";
export const meta = () => seo("Lab Notes", legacy.lab_config.subtitle, "/lab-notes");
export default function LabNotes() {
  const cats = ["All", ...Array.from(new Set(legacy.lab_notes.map((n) => n.category)))];
  const [cat, setCat] = useState("All");
  const list = legacy.lab_notes.filter((n) => cat === "All" || n.category === cat);
  return (
    <>
      <PageHero eyebrow="Lab Notes" title="What I'm learning, building and questioning" intro={legacy.lab_config.publishing_note} />
      <Container className="py-10">
        <div role="group" aria-label="Filter by category" className="mb-6 flex flex-wrap gap-2">
          {cats.map((c) => <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)} className={cx("min-h-10 rounded-full border px-3.5 text-sm", cat === c ? "border-green bg-green font-semibold text-green-ink" : "border-line text-muted hover:text-ink")}>{c}</button>)}
        </div>
        <ul className="grid gap-4">
          {list.map((n) => (
            <li key={n.slug}><Link to={`/lab-notes/${n.slug}`} className="card card-link block p-6">
              <span className="flex flex-wrap items-center gap-2"><Pill tone="amber">{n.status}</Pill><span className="label">{n.week} · {n.category} · {n.reading_time}</span></span>
              <span className="mt-3 block font-display text-2xl font-bold">{n.title}</span>
              <span className="mt-2 block text-muted">{n.excerpt}</span>
            </Link></li>
          ))}
        </ul>
      </Container>
    </>
  );
}
