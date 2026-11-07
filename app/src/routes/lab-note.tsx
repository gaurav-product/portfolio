import { Link, useParams } from "react-router";
import { legacy, noteBySlug } from "~/content/data";
import { Container, Pill, ButtonLink } from "~/components/ui";
import { Icon } from "~/components/Icon";
import { seo } from "~/lib/meta";
import type { Route } from "./+types/lab-note";
export const meta = ({ params }: Route.MetaArgs) => { const n = noteBySlug(params.slug); return n ? seo(n.title, n.excerpt, `/lab-notes/${n.slug}`) : seo("Not found", "Note not found", "/lab-notes"); };
export default function LabNote() {
  const { slug } = useParams();
  const n = noteBySlug(slug ?? "");
  if (!n) throw new Response("Not found", { status: 404 });
  const i = legacy.lab_notes.indexOf(n), next = legacy.lab_notes[i + 1], prev = legacy.lab_notes[i - 1];
  return (
    <Container className="max-w-3xl py-12">
      <Link to="/lab-notes" className="inline-flex min-h-8 items-center gap-2 text-sm text-muted hover:text-ink"><Icon name="back" size={16} />Lab Notes</Link>
      <header className="mt-6"><div className="flex flex-wrap items-center gap-2"><Pill tone="amber">{n.status} · unpublished elsewhere</Pill><span className="label">{n.category} · {n.reading_time}</span></div>
        <h1 className="mt-3 text-4xl font-bold">{n.title}</h1><p className="mt-3 text-lg text-muted">{n.excerpt}</p></header>
      {/* First-party content from site/content.js, not user input. */}
      <div className="prose-os mt-8 text-[17px]" dangerouslySetInnerHTML={{ __html: n.content.replace(/<(\/?)h4\b/g, (_, c) => (c ? "</h2" : '<h2 class="as-label"')) /* section labels sit directly under the h1: h2 in the outline, label styling kept */ }} />
      <nav aria-label="Other notes" className="mt-12 flex flex-wrap justify-between gap-3 border-t border-line pt-6">
        {prev ? <ButtonLink to={`/lab-notes/${prev.slug}`} icon="left">Previous note</ButtonLink> : <span />}
        {next && <ButtonLink to={`/lab-notes/${next.slug}`}>Next note <Icon name="right" /></ButtonLink>}
      </nav>
    </Container>
  );
}
