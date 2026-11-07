import type { AnswerKind } from "../machine";
import type { Reply } from "../lang";

export interface GuideLink { label: string; to: string }
export interface Turn { role: "visitor" | "guide"; text: string }

export interface GuideReply {
  /** Shown in the chat (plain text; lines starting with "• " render as a list). */
  text: string;
  /** What is spoken aloud: shorter, without bullets or URLs. */
  speech: string;
  lang: Reply;
  kind: AnswerKind;
  links: GuideLink[];
  /** A route the visitor explicitly asked to open ("open RupeeRadar"). */
  navigate?: string;
  /** Which brain produced the reply. "local" is the grounded on-device engine. */
  source: "local" | "remote";
  /** Set when the remote brain failed and the local one answered instead. */
  fellBack?: boolean;
}

/** The replaceable "brain". Implementations must only state verified portfolio facts. */
export interface Brain {
  readonly name: "local" | "remote";
  answer(input: { text: string; reply: Reply; history: Turn[] }, signal?: AbortSignal): Promise<GuideReply>;
}
