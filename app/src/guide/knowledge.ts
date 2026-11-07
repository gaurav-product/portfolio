/**
 * The knowledge pack for the optional server-side AI brain (guide-api/). It is
 * built ONLY from the portfolio's content modules — the same verified facts the
 * site shows — so a language model behind the endpoint is grounded in exactly
 * what the portfolio says and nothing more. Regenerate with:
 *   node scripts/build-guide-knowledge.mjs
 */
import { profile } from "~/content/profile";
import { projects } from "~/content/projects";
import { experience, education, certifications, tools } from "~/content/experience";
import { newsletter } from "~/content/newsletter";
import { ventures, VENTURES_NOTE, MODEL_NOTE } from "~/content/ventures";
import { kb, NO_EVIDENCE_TERMS } from "~/content/kb";
import { blocksToText } from "./brain/local";

export function buildKnowledgePack(): string {
  const out: string[] = [];
  out.push(`# ${profile.name} — ${profile.brand}`, profile.headline, profile.summary,
    `Location: ${profile.location}. ${profile.availability}.`,
    `Target roles: ${profile.roles.join(", ")}.`,
    `Contact: email ${profile.contact.email}; LinkedIn ${profile.contact.linkedin}; GitHub ${profile.contact.github}. Contact page: /contact. CV: /cv.`);

  out.push("", "## Employment");
  for (const r of experience) {
    out.push(`- ${r.role}, ${r.employer} (${r.location}), ${r.period}, ${r.type}. ${r.scope}`);
    r.work.forEach((w) => out.push(`  - ${w}`));
    r.outcomes.forEach((o) => out.push(`  - Outcome: ${o.value} — ${o.label}`));
  }

  out.push("", "## Projects (status is exactly as stated; do not upgrade it)");
  for (const p of projects) {
    out.push(`- ${p.name} — ${p.subtitle}. Page: /projects/${p.slug}. ${p.kindLabel}. Role: ${p.role}. Period: ${p.period}. Status: ${p.status}.`, `  ${p.oneLine}`);
    p.highlights.forEach((h) => out.push(`  - ${h.text} [evidence: ${h.status}]`));
    (p.limits ?? []).forEach((l) => out.push(`  - Limit: ${l}`));
  }

  out.push("", "## Education");
  education.forEach((e) => out.push(`- ${e.what}, ${e.org}, ${e.period}${"note" in e ? ` — ${e.note}` : ""}`));
  out.push("", "## Certifications");
  certifications.forEach((c) => out.push(`- ${c.issuer}: ${c.items.join("; ")}`));
  out.push("", "## Tools and methods");
  Object.entries(tools).forEach(([k, v]) => out.push(`- ${k}: ${v.join(", ")}`));
  out.push("", "## Newsletter", `${newsletter.name}: ${newsletter.cadence} on ${newsletter.platform} — ${newsletter.tagline}. ${newsletter.subscribers} subscribers (${newsletter.subscribersNote}).`);

  out.push("", "## Emerging Ventures (concepts in development — never describe them as built, launched or validated)", VENTURES_NOTE);
  for (const v of ventures) {
    out.push(`- ${v.name} (${v.category}) — ${v.status}. Vision: “${v.vision}”. Page: /ventures/${v.slug}; 3D world: /universe/${v.slug}.`, `  Problem: ${v.problem.join(" ")}`, `  Proposed solution: ${v.solution}`,
      `  Proposed features: ${v.features.map((f) => f.name).join("; ")}`, `  Business model (${MODEL_NOTE}): ${v.model.join("; ")}`);
    if (v.example) out.push(`  ${v.example.label}: ${v.example.rows.map(([k, val]) => `${k} ${val}`).join("; ")}`);
    v.trust?.forEach((t) => out.push(`  Trust/legal: ${t}`));
  }

  out.push("", "## Verified Q&A");
  for (const e of kb) out.push(`Q: ${e.q}`, `A: ${blocksToText(e.answer)}`, `Links: ${e.links.map((l) => `${l.label} (${l.to})`).join("; ")}`, "");

  out.push("## Not in the portfolio (always refuse)", NO_EVIDENCE_TERMS.join(", "));
  out.push("", "## Site pages", "/, /about, /experience, /projects, /case-studies, /product-thinking, /research, /ai-lab, /skills, /explore, /universe, /ventures, /recruiter, /contact, /cv");
  return out.join("\n");
}
