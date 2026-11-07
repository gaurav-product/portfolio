/**
 * Language handling for the guide. Replies follow the visitor: Devanagari input
 * gets Hindi in Devanagari, romanised Hindi ("Hinglish") gets romanised Hindi,
 * and everything else gets Indian English. Explicit requests ("in Hindi",
 * "English please") override detection.
 */
export type Reply = "en" | "hi" | "hinglish";
export type LangPref = "auto" | "en" | "hi";

const DEVANAGARI = /[ऀ-ॿ]/;
/** Common Hindi function words written in Latin script. Two or more → Hinglish. */
const HINGLISH = [
  "kya", "hai", "hain", "kaun", "kaise", "kaisa", "kaisi", "batao", "bataiye", "bataye", "btao", "mujhe", "hume", "humein",
  "unke", "unka", "unki", "uske", "uska", "aap", "aapka", "aapke", "kahan", "kahaan", "kyun", "kyon", "kitna", "kitne",
  "baare", "bare", "mein", "nahi", "nahin", "hoon", "hu", "karo", "kariye", "dikhao", "dikhaiye", "chahiye", "kuch",
  "namaste", "bhai", "acha", "accha", "theek", "samjhao", "karta", "karte", "kiya", "kiye", "koi", "sabse", "wala", "wale",
];

export function asksFor(text: string): "en" | "hi" | null {
  const t = text.toLowerCase();
  if (/\b(in hindi|hindi (mein|me|main)|hindi please|hindi me bolo|hindi mein bolo)\b/.test(t) || /हिंदी|हिन्दी/.test(text)) return "hi";
  if (/\b(in english|english (please|mein|me|main)|speak english)\b/.test(t) || /अंग्रेज़ी|अंग्रेजी|इंग्लिश/.test(text)) return "en";
  return null;
}

export function detect(text: string): Reply {
  if (DEVANAGARI.test(text)) return "hi";
  const words = text.toLowerCase().match(/[a-z]+/g) ?? [];
  const hits = words.filter((w) => HINGLISH.includes(w)).length;
  return hits >= 2 || (hits === 1 && words.length <= 3 && words.some((w) => ["namaste", "kya", "kaun", "batao"].includes(w))) ? "hinglish" : "en";
}

/** The reply language for a message, given the visitor's preference. */
export function replyLang(text: string, pref: LangPref): Reply {
  const asked = asksFor(text);
  const pick = asked ?? (pref === "auto" ? null : pref);
  if (pick === "en") return "en";
  const d = detect(text);
  if (pick === "hi") return d === "hinglish" ? "hinglish" : "hi";
  return d;
}

/** BCP-47 tags for speech engines. Hinglish is spoken with an Indian English voice:
 *  Hindi voices read Latin-script Hindi poorly, Indian English voices read it naturally. */
export const SPEECH_TAG: Record<Reply, string> = { en: "en-IN", hi: "hi-IN", hinglish: "en-IN" };
export const LISTEN_TAG: Record<"en" | "hi", string> = { en: "en-IN", hi: "hi-IN" };
