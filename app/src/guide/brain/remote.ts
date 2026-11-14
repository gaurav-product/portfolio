/**
 * Optional remote brain: posts to the guide API (see /guide-api) which holds the
 * model key server-side. The endpoint URL is public configuration, not a secret:
 * VITE_GUIDE_API_URL. If it is unset, slow, or returns anything unexpected, the
 * guide answers with the local grounded brain and marks the reply `fellBack`.
 */
import type { Brain, GuideReply, Turn } from "./types";
import type { Reply } from "../lang";
import { answerLocally, toSpeech } from "./local";

export const GUIDE_API_URL = ((import.meta.env.VITE_GUIDE_API_URL as string | undefined) ?? "").trim();
const TIMEOUT_MS = 12_000;

/** Only same-shaped, size-bounded replies from the API are accepted. */
export function parseRemote(data: unknown, r: Reply): GuideReply | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (typeof d.text !== "string" || !d.text.trim() || d.text.length > 4000) return null;
  const kind = d.kind === "refused" || d.kind === "none" ? d.kind : "answer";
  const links = Array.isArray(d.links)
    ? d.links.filter((l): l is { label: string; to: string } => !!l && typeof (l as { label?: unknown }).label === "string" && typeof (l as { to?: unknown }).to === "string" && /^\/[a-z0-9/#?=&-]*$/i.test((l as { to: string }).to)).slice(0, 4)
    : [];
  return { text: d.text, speech: toSpeech(d.text), lang: r, kind, links, source: "remote" };
}

export function remoteBrain(url = GUIDE_API_URL): Brain {
  return {
    name: "remote",
    async answer({ text, reply: r, history }: { text: string; reply: Reply; history: Turn[] }, signal?: AbortSignal) {
      const ctl = new AbortController();
      const timer = setTimeout(() => ctl.abort(), TIMEOUT_MS);
      signal?.addEventListener("abort", () => ctl.abort(), { once: true });
      try {
        const res = await fetch(url, {
          method: "POST", headers: { "content-type": "application/json" }, signal: ctl.signal,
          body: JSON.stringify({ message: text.slice(0, 500), lang: r, history: history.slice(-6).map((t) => ({ role: t.role, text: t.text.slice(0, 600) })) }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const parsed = parseRemote(await res.json(), r);
        if (!parsed) throw new Error("bad response");
        return parsed;
      } catch (e) {
        if (signal?.aborted) throw e;
        return { ...answerLocally(text, r), fellBack: true };
      } finally { clearTimeout(timer); }
    },
  };
}
