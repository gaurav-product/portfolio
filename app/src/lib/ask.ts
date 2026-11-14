import { kb, NO_EVIDENCE_TERMS, NO_EVIDENCE_REPLY, type KbEntry } from "~/content/kb";
import type { Block } from "~/content/types";
import { hasTerm, norm } from "./text";
import { search, type Hit } from "./search";

export type AskResult =
  | { kind: "refused"; blocks: Block[]; trigger: string }
  | { kind: "answer"; entry: KbEntry; matched: string[] }
  | { kind: "related"; hits: Hit[] }
  | { kind: "none" };

/** 1. refuse unsupported asks  2. match a stored answer  3. point to pages  4. say so */
export function ask(question: string): AskResult {
  const q = question.trim();
  if (!q) return { kind: "none" };
  const trigger = NO_EVIDENCE_TERMS.find((t) => hasTerm(q, t));
  if (trigger) return { kind: "refused", blocks: NO_EVIDENCE_REPLY, trigger };
  let best: KbEntry | null = null, bestScore = 0, matched: string[] = [];
  for (const e of kb) {
    if (norm(e.q).replace(/[?.!]/g, "") === norm(q).replace(/[?.!]/g, "")) return { kind: "answer", entry: e, matched: ["exact question"] };
    const m = e.keys.filter((k) => hasTerm(q, k));
    const score = m.reduce((s, k) => s + k.split(" ").length + k.length / 20, 0);
    if (score > bestScore) { best = e; bestScore = score; matched = m; }
  }
  if (best) return { kind: "answer", entry: best, matched };
  const hits = search(q, 5);
  return hits.length ? { kind: "related", hits } : { kind: "none" };
}
