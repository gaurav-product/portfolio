import { useParams } from "react-router";
import { TOOLS } from "~/content/nav";
import { RiceTool } from "~/components/tools/Rice";
import { MoscowTool } from "~/components/tools/Moscow";
import { FunnelTool } from "~/components/tools/Funnel";
import { NorthStarTool, ExperimentTool, PrdTool } from "~/components/tools/Docs";
import { DecisionsTool } from "~/components/tools/Decisions";
import { seo } from "~/lib/meta";
import type { Route } from "./+types/tool";

const MAP = { rice: RiceTool, moscow: MoscowTool, funnel: FunnelTool, "north-star": NorthStarTool, experiment: ExperimentTool, prd: PrdTool, decisions: DecisionsTool } as const;

export const meta = ({ params }: Route.MetaArgs) => {
  const t = TOOLS.find((x) => x.slug === params.tool);
  return t ? seo(t.name, t.blurb, `/product-thinking/${t.slug}`) : seo("Not found", "Tool not found", "/product-thinking");
};

export default function Tool() {
  const { tool } = useParams();
  const C = MAP[tool as keyof typeof MAP];
  if (!C) throw new Response("Not found", { status: 404 });
  return <C />;
}
