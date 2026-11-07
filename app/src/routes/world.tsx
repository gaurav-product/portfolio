import { Link, useParams } from "react-router";
import { worldBySlug } from "~/content/universe";
import { seo } from "~/lib/meta";
import { WorldPage } from "~/universe/WorldPage";
import type { Route } from "./+types/world";

export const meta = ({ params }: Route.MetaArgs) => {
  const d = worldBySlug(params.slug);
  return d ? seo(`${d.name} — 3D project world`, `${d.name} (${d.statusLabel}). ${d.oneLine}`, `/worlds/${d.slug}`) : seo("Project world not found", "No project world at this address.", "/worlds");
};

/** /worlds/<slug>: one actual project's 3D world. */
export default function World() {
  const { slug = "" } = useParams();
  const d = worldBySlug(slug);
  if (!d) return (
    <div className="grid min-h-[60svh] place-items-center p-6 text-center"><div><h1 className="text-3xl font-bold">No project world called “{slug}”</h1><p className="mt-3 text-muted"><Link to="/worlds" className="underline underline-offset-4">All project worlds</Link></p></div></div>
  );
  return <WorldPage d={d} title="Project worlds" />;
}
