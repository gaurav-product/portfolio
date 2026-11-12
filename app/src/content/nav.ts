/** Navigation and tool registry — deliberately free of content data so the
 *  header does not pull the corpus into every page. */
/** Primary navigation — every item is a real, prerendered route. */
export const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/experience", label: "Experience" },
  { to: "/projects", label: "Projects" },
  { to: "/worlds", label: "Project Worlds" },
  { to: "/universe", label: "Solar system in 3D" },
  { to: "/ventures", label: "Emerging Ventures" },
  { to: "/case-studies", label: "Case Studies" },
  { to: "/product-thinking", label: "Product Thinking" },
  { to: "/research", label: "Research" },
  { to: "/atlas", label: "Product Atlas" },
  { to: "/ai-lab", label: "AI Lab" },
  { to: "/contact", label: "Contact" },
] as const;

/** The short desktop menu. Everything in NAV stays one click away in the menu drawer. */
export const PRIMARY_NAV = NAV.filter((n) => ["/about", "/experience", "/projects", "/product-thinking", "/research", "/contact"].includes(n.to));

export const TOOLS = [
  { slug: "rice", name: "RICE calculator", blurb: "Score features by Reach × Impact × Confidence ÷ Effort, sort and export CSV." },
  { slug: "moscow", name: "MoSCoW board", blurb: "Sort scope into Must, Should, Could and Won't; move, reorder and reset." },
  { slug: "north-star", name: "North Star builder", blurb: "Define an objective, a North Star, inputs and guardrails; export Markdown." },
  { slug: "funnel", name: "Funnel explorer", blurb: "Edit steps and counts; see step and overall conversion. Sample or capstone case data." },
  { slug: "experiment", name: "Experiment designer", blurb: "Hypothesis, arms, metrics, guardrails, duration and status; export Markdown." },
  { slug: "prd", name: "PRD builder", blurb: "A structured PRD template you can fill and export as Markdown." },
  { slug: "decisions", name: "Decision log", blurb: "Record decisions with context, options and trade-offs; filter and export CSV." },
] as const;

