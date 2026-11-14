import { Link, useParams } from "react-router";
import { ventureWorlds } from "~/content/universe";
import { seo } from "~/lib/meta";
import { WorldPage } from "~/universe/WorldPage";
import type { Route } from "./+types/venture-world";

const bySlug = (s: string) => ventureWorlds.find((d) => d.slug === s);
export const meta = ({ params }: Route.MetaArgs) => {
  const d = bySlug(params.slug);
  return d ? seo(`${d.name} in 3D — concept in development`, `${d.name} (${d.statusLabel}): concept visuals in 3D, not a product. ${d.oneLine}`, `/ventures/${d.slug}/world`) : seo("Concept not found", "No concept at this address.", "/ventures");
};

/** /ventures/<slug>/world: a concept's 3D hall, reached from its concept page. */
export default function VentureWorld() {
  const { slug = "" } = useParams();
  const d = bySlug(slug);
  if (!d) return (
    <div className="grid min-h-[60svh] place-items-center p-6 text-center"><div><h1 className="text-3xl font-bold">No concept called “{slug}”</h1><p className="mt-3 text-muted"><Link to="/ventures" className="underline underline-offset-4">Emerging Ventures</Link></p></div></div>
  );
  return <WorldPage d={d} title="Emerging Ventures · concept" />;
}
