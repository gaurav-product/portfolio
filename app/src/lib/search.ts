import { projects } from "~/content/projects";
import { experience, education, certifications } from "~/content/experience";
import { capabilities } from "~/content/capabilities";
import { legacy } from "~/content/data";
import { corpus } from "~/content/corpus";
import { TOOLS } from "~/content/nav";
import { norm, stripHtml, tokens } from "./text";
import type { Block } from "~/content/types";

export type DocType = "Project" | "Case study" | "Experience" | "Skill" | "Research" | "Lab note" | "Tool" | "Page";
export interface Doc { id: string; type: DocType; title: string; text: string; tags: string[]; to: string }
export interface Hit extends Doc { score: number; snippet: string }

const blockText = (b: Block): string =>
  "p" in b ? b.p : "ul" in b ? b.ul.join(" ") : "ol" in b ? b.ol.join(" ") : "note" in b ? b.note : "flow" in b ? b.flow.join(" ") :
  "kv" in b ? b.kv.flat().join(" ") : "table" in b ? [...b.table.head, ...b.table.rows.flat()].join(" ") : "quote" in b ? b.quote : "";

const PAGES: Doc[] = [
  ["/", "Home", "Gaurav.OS overview"], ["/about", "About", "background education certifications writing"],
  ["/recruiter", "Recruiter Mode", "30-second overview CV skills experience"], ["/explore", "Explore Mode", "3D districts city map"], ["/universe", "90 case studies in 3D", "3D earth globe product universe research case studies map"], ["/worlds", "Project worlds", "3D buildings project worlds universe screenshots"], ["/writing/the-teardown", "The Teardown in 3D", "newsletter writing workshop 3D"], ["/ventures", "Emerging Ventures", "concepts interview radar repass startup ideas"],
  ["/case-studies", "Case Studies", "in-depth case studies"], ["/product-thinking", "Product Thinking", "operating loop principles challenge tools"],
  ["/skills", "Skills library", "product management capabilities evidence"], ["/atlas", "Product Atlas", "90 studies constellation evolution filters"],
  ["/ai-lab", "AI Lab", "AI safety evaluation guardrails experiments"], ["/ask", "Ask Gaurav", "questions grounded answers"],
  ["/contact", "Contact", "email linkedin github cv"], ["/lab-notes", "Lab Notes", "writing drafts"], ["/cv", "CV", "curriculum vitae resume download"],
].map(([to, title, text]) => ({ id: "page:" + to, type: "Page" as const, title, text, tags: [], to }));

export function buildIndex(): Doc[] {
  const docs: Doc[] = [...PAGES];
  for (const p of projects) {
    docs.push({ id: "project:" + p.slug, type: "Project", title: p.name, text: [p.subtitle, p.oneLine, p.role, p.kindLabel, p.status, ...p.highlights.map((h) => h.text)].join(" "), tags: [...p.categories, p.kindLabel], to: `/projects/${p.slug}` });
    for (const s of p.sections) docs.push({ id: `case:${p.slug}:${s.key}`, type: "Case study", title: `${p.name} — ${s.title}`, text: s.blocks.map(blockText).join(" "), tags: [p.name], to: `/projects/${p.slug}#${s.key}` });
  }
  for (const r of experience) docs.push({ id: "role:" + r.id, type: "Experience", title: `${r.role} — ${r.employer}`, text: [r.scope, ...r.work, r.period, r.location].join(" "), tags: r.tools, to: `/experience/${r.id}` });
  for (const e of education) docs.push({ id: "edu:" + e.id, type: "Page", title: `${e.what} — ${e.org}`, text: `${e.period} education`, tags: ["Education"], to: "/about#education" });
  for (const c of certifications) docs.push({ id: "cert:" + c.issuer, type: "Page", title: `Certifications — ${c.issuer}`, text: c.items.join(" "), tags: ["Certifications"], to: "/about#certifications" });
  for (const c of capabilities) docs.push({ id: "skill:" + c.id, type: "Skill", title: c.name, text: [c.definition, c.why, ...c.evidence.map((e) => e.note)].join(" "), tags: [c.category, c.status], to: `/skills/${c.id}` });
  for (const s of corpus.studies) docs.push({ id: "study:" + s.day, type: "Research", title: `Day ${String(s.day).padStart(2, "0")} — ${s.company}`, text: `${s.title} ${s.summary}`, tags: [s.category, s.evidence_level], to: `/research/${s.day}` });
  for (const n of legacy.lab_notes) docs.push({ id: "note:" + n.slug, type: "Lab note", title: n.title, text: `${n.excerpt} ${stripHtml(n.content)}`, tags: [n.category, ...n.tags], to: `/lab-notes/${n.slug}` });
  for (const t of TOOLS) docs.push({ id: "tool:" + t.slug, type: "Tool", title: t.name, text: t.blurb, tags: ["Product Thinking"], to: `/product-thinking/${t.slug}` });
  return docs;
}

let INDEX: (Doc & { _t: string; _x: string; _g: string })[] | null = null;
const index = () => (INDEX ??= buildIndex().map((d) => ({ ...d, _t: norm(d.title), _x: norm(d.text), _g: norm(d.tags.join(" ")) })));

function snippet(text: string, q: string[]) {
  const n = norm(text);
  const at = Math.max(0, Math.min(...q.map((t) => { const i = n.indexOf(t); return i < 0 ? Infinity : i; })) - 40);
  const s = isFinite(at) ? text.slice(at, at + 160) : text.slice(0, 160);
  return (at > 0 ? "…" : "") + s.trim() + (text.length > at + 160 ? "…" : "");
}

/** Every token must match the title, tags or text. Title matches rank highest. */
export function search(query: string, limit = 30): Hit[] {
  const q = tokens(query);
  if (!q.length) return [];
  const out: Hit[] = [];
  for (const d of index()) {
    let score = 0, ok = true;
    for (const t of q) {
      const s = (d._t.includes(t) ? 10 : 0) + (d._g.includes(t) ? 4 : 0) + (d._x.includes(t) ? 1 : 0);
      if (!s) { ok = false; break; }
      score += s;
    }
    if (!ok) continue;
    if (d._t === norm(query)) score += 25;
    if (d.type === "Project") score += 3;
    out.push({ ...d, score, snippet: snippet(d.text, q) });
  }
  return out.sort((a, b) => b.score - a.score).slice(0, limit);
}

export { highlight } from "./text";
