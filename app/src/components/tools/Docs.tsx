import { ToolShell, SampleBadge, Field, ListEditor, mdList, slugDate } from "./common";
import { Button } from "../ui";
import { download } from "~/lib/pm";
import { useSessionState } from "~/lib/session";
import { track } from "~/lib/analytics";

/* ---------------------------------------------------------- NORTH STAR */
interface Metric { name: string; description: string }
interface NS { objective: string; northStar: string; definition: string; inputs: Metric[]; guardrails: string[] }
const NS_SAMPLE: NS = {
  objective: "Help families keep a reliable care record for a parent after hospital discharge",
  northStar: "Documented care days per active care plan",
  definition: "A day with at least one care entry by an identified user.",
  inputs: [{ name: "Attendant shift start rate", description: "Share of scheduled shifts that are started in the app" }, { name: "Medicines recorded on time", description: "Doses recorded within the window" }],
  guardrails: ["Attendant time per shift under 5 minutes", "False-alert rate under 20%"],
};
const NS_SUGGEST = ["Weekly active users completing the core action", "Documented care days per active care plan", "Insights acted on within 7 days", "Time to first value (median)"];

export function NorthStarTool() {
  const [v, setV] = useSessionState<NS>("northstar", NS_SAMPLE);
  const isSample = JSON.stringify(v) === JSON.stringify(NS_SAMPLE);
  const md = () => `# North Star framework\n\n_Exported ${slugDate()} from Gaurav.OS_\n\n**Objective:** ${v.objective}\n\n## North Star Metric\n**${v.northStar}**\n\n${v.definition}\n\n## Input metrics\n${v.inputs.filter((m) => m.name.trim()).map((m) => `- **${m.name}** — ${m.description}`).join("\n") || "- _None_"}\n\n## Guardrails\n${mdList(v.guardrails)}\n`;
  return (
    <ToolShell slug="north-star" actions={<><Button icon="download" variant="primary" onClick={() => { download("north-star.md", md(), "text/markdown"); track("export_downloaded", { tool: "north-star" }); }}>Export Markdown</Button><Button icon="reset" variant="ghost" onClick={() => setV(NS_SAMPLE)}>Reset</Button><Button variant="ghost" onClick={() => setV({ objective: "", northStar: "", definition: "", inputs: [{ name: "", description: "" }], guardrails: [""] })}>Start blank</Button></>}>
      {isSample && <div className="mb-5"><SampleBadge label="Illustrative example, modelled on CareConnect's documented metric design" /></div>}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card grid content-start gap-4 p-5">
          <Field id="ns-obj" label="Product objective"><textarea id="ns-obj" rows={2} value={v.objective} onChange={(e) => setV({ ...v, objective: e.target.value })} className="field" /></Field>
          <Field id="ns-m" label="North Star Metric" hint="Pick a suggestion or type your own.">
            <input id="ns-m" list="ns-suggest" value={v.northStar} onChange={(e) => setV({ ...v, northStar: e.target.value })} className="field" />
            <datalist id="ns-suggest">{NS_SUGGEST.map((s) => <option key={s} value={s} />)}</datalist>
          </Field>
          <Field id="ns-d" label="Precise definition"><textarea id="ns-d" rows={2} value={v.definition} onChange={(e) => setV({ ...v, definition: e.target.value })} className="field" /></Field>
        </div>
        <div className="card grid content-start gap-5 p-5">
          <fieldset className="grid gap-3">
            <legend className="mb-1.5 text-sm font-medium">Input metrics</legend>
            {v.inputs.map((m, i) => (
              <div key={i} className="grid gap-2 rounded-xl border border-line-soft p-3">
                <label className="sr-only" htmlFor={`in-${i}`}>Input metric {i + 1} name</label>
                <input id={`in-${i}`} value={m.name} placeholder="Metric name" onChange={(e) => setV({ ...v, inputs: v.inputs.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)) })} className="field" />
                <label className="sr-only" htmlFor={`ind-${i}`}>Input metric {i + 1} description</label>
                <input id={`ind-${i}`} value={m.description} placeholder="Description" onChange={(e) => setV({ ...v, inputs: v.inputs.map((x, j) => (j === i ? { ...x, description: e.target.value } : x)) })} className="field" />
                <button type="button" onClick={() => setV({ ...v, inputs: v.inputs.filter((_, j) => j !== i) })} className="w-fit text-sm text-muted underline underline-offset-4 hover:text-red">Remove input metric {i + 1}</button>
              </div>
            ))}
            <button type="button" onClick={() => setV({ ...v, inputs: [...v.inputs, { name: "", description: "" }] })} className="inline-flex min-h-10 w-fit items-center rounded-lg border border-dashed border-line px-3 text-sm text-muted hover:text-ink">+ Add input metric</button>
          </fieldset>
          <ListEditor id="ns-g" label="Guardrails" items={v.guardrails} onChange={(g) => setV({ ...v, guardrails: g })} placeholder="A metric that must not get worse" />
        </div>
      </div>
    </ToolShell>
  );
}

/* ---------------------------------------------------------- EXPERIMENT */
type Status = "Proposed" | "Designed — not run" | "Running" | "Completed";
interface Exp { name: string; hypothesis: string; control: string; treatment: string; primary: string; secondary: string[]; guardrails: string[]; sample: string; duration: string; success: string; status: Status; result: string }
const EXP_BLANK: Exp = { name: "", hypothesis: "We believe that … will result in … because …", control: "", treatment: "", primary: "", secondary: [""], guardrails: [""], sample: "", duration: "", success: "", status: "Proposed", result: "" };

export function ExperimentTool() {
  const [v, setV] = useSessionState<Exp>("experiment", EXP_BLANK);
  const needsResult = v.status === "Completed" && !v.result.trim();
  const md = () => `# Experiment: ${v.name || "Untitled"}\n\n**Status:** ${v.status}${v.status !== "Completed" ? " — no result exists" : ""}\n\n## Hypothesis\n${v.hypothesis}\n\n## Arms\n- **Control:** ${v.control}\n- **Treatment:** ${v.treatment}\n\n## Metrics\n- **Primary:** ${v.primary}\n\n### Secondary\n${mdList(v.secondary)}\n\n### Guardrails\n${mdList(v.guardrails)}\n\n## Design\n- **Sample size assumptions:** ${v.sample}\n- **Duration:** ${v.duration}\n- **Success criteria:** ${v.success}\n${v.status === "Completed" ? `\n## Result\n${v.result}\n` : ""}`;
  const text = (k: keyof Exp, label: string, rows = 1, hint?: string) => (
    <Field id={`x-${k}`} label={label} hint={hint}>
      {rows > 1 ? <textarea id={`x-${k}`} rows={rows} value={v[k] as string} onChange={(e) => setV({ ...v, [k]: e.target.value })} className="field" />
        : <input id={`x-${k}`} value={v[k] as string} onChange={(e) => setV({ ...v, [k]: e.target.value })} className="field" />}
    </Field>
  );
  return (
    <ToolShell slug="experiment" actions={<><Button icon="download" variant="primary" disabled={needsResult} onClick={() => { download("experiment.md", md(), "text/markdown"); track("export_downloaded", { tool: "experiment" }); }}>Export Markdown</Button><Button icon="reset" variant="ghost" onClick={() => setV(EXP_BLANK)}>Reset</Button></>}>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card grid content-start gap-4 p-5">
          {text("name", "Experiment name")}
          {text("hypothesis", "Hypothesis", 3)}
          {text("control", "Control group")}
          {text("treatment", "Treatment group")}
          {text("primary", "Primary metric", 1, "The one metric the decision is made on.")}
        </div>
        <div className="card grid content-start gap-4 p-5">
          <ListEditor id="x-sec" label="Secondary metrics" items={v.secondary} onChange={(s) => setV({ ...v, secondary: s })} placeholder="Metric" />
          <ListEditor id="x-gr" label="Guardrails" items={v.guardrails} onChange={(s) => setV({ ...v, guardrails: s })} placeholder="Must not get worse" />
          {text("sample", "Sample size assumptions", 2)}
          {text("duration", "Duration")}
          {text("success", "Success criteria", 2)}
          <Field id="x-status" label="Status" hint="Proposed and designed experiments have no result. A completed one must state its result.">
            <select id="x-status" value={v.status} onChange={(e) => setV({ ...v, status: e.target.value as Status })} className="field">
              {(["Proposed", "Designed — not run", "Running", "Completed"] as Status[]).map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
          {v.status === "Completed" && (
            <Field id="x-result" label="Result (required when completed)">
              <textarea id="x-result" rows={3} value={v.result} aria-invalid={needsResult} aria-describedby="x-result-err" onChange={(e) => setV({ ...v, result: e.target.value })} className="field" />
              {needsResult && <p id="x-result-err" className="mt-1 text-sm text-red">A completed experiment needs its result before it can be exported.</p>}
            </Field>
          )}
        </div>
      </div>
    </ToolShell>
  );
}

/* ----------------------------------------------------------------- PRD */
interface Prd { title: string; problem: string; goal: string; nonGoals: string[]; users: string; requirements: string[]; stories: string[]; criteria: string[]; dependencies: string[]; risks: string[]; metrics: string[] }
const PRD_BLANK: Prd = { title: "", problem: "", goal: "", nonGoals: [""], users: "", requirements: [""], stories: ["As a …, I want … so that …"], criteria: ["Given … when … then …"], dependencies: [""], risks: [""], metrics: [""] };

export function PrdTool() {
  const [v, setV] = useSessionState<Prd>("prd", PRD_BLANK);
  const missing = !v.title.trim() || !v.problem.trim();
  const md = () => `# PRD: ${v.title}\n\n_Exported ${slugDate()} from Gaurav.OS_\n\n## Problem\n${v.problem}\n\n## Goal\n${v.goal}\n\n## Non-goals\n${mdList(v.nonGoals)}\n\n## Users\n${v.users}\n\n## Requirements\n${mdList(v.requirements)}\n\n## User stories\n${mdList(v.stories)}\n\n## Acceptance criteria\n${mdList(v.criteria)}\n\n## Dependencies\n${mdList(v.dependencies)}\n\n## Risks\n${mdList(v.risks)}\n\n## Success metrics\n${mdList(v.metrics)}\n`;
  const lists: [keyof Prd, string, string][] = [["nonGoals", "Non-goals", "Explicitly out of scope"], ["requirements", "Requirements", "The system must…"], ["stories", "User stories", "As a …"], ["criteria", "Acceptance criteria", "Given … when … then …"], ["dependencies", "Dependencies", "Team, system or decision"], ["risks", "Risks", "Risk and mitigation"], ["metrics", "Success metrics", "Metric and target"]];
  return (
    <ToolShell slug="prd" actions={<><Button icon="download" variant="primary" disabled={missing} title={missing ? "Add a title and a problem first" : undefined} onClick={() => { download(`prd-${(v.title || "untitled").toLowerCase().replace(/[^a-z0-9]+/g, "-")}.md`, md(), "text/markdown"); track("export_downloaded", { tool: "prd" }); }}>Export Markdown</Button><Button icon="reset" variant="ghost" onClick={() => setV(PRD_BLANK)}>Reset</Button></>}>
      {missing && <p role="status" className="mb-4 text-sm text-amber">Add a title and a problem statement to enable export.</p>}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card grid content-start gap-4 p-5">
          <Field id="p-title" label="Title"><input id="p-title" value={v.title} onChange={(e) => setV({ ...v, title: e.target.value })} className="field" /></Field>
          <Field id="p-problem" label="Problem"><textarea id="p-problem" rows={3} value={v.problem} onChange={(e) => setV({ ...v, problem: e.target.value })} className="field" /></Field>
          <Field id="p-goal" label="Goal"><textarea id="p-goal" rows={2} value={v.goal} onChange={(e) => setV({ ...v, goal: e.target.value })} className="field" /></Field>
          <Field id="p-users" label="Users"><textarea id="p-users" rows={2} value={v.users} onChange={(e) => setV({ ...v, users: e.target.value })} className="field" /></Field>
          {lists.slice(0, 2).map(([k, l, ph]) => <ListEditor key={k} id={`p-${k}`} label={l} items={v[k] as string[]} onChange={(x) => setV({ ...v, [k]: x })} placeholder={ph} />)}
        </div>
        <div className="card grid content-start gap-5 p-5">
          {lists.slice(2).map(([k, l, ph]) => <ListEditor key={k} id={`p-${k}`} label={l} items={v[k] as string[]} onChange={(x) => setV({ ...v, [k]: x })} placeholder={ph} />)}
        </div>
      </div>
    </ToolShell>
  );
}
