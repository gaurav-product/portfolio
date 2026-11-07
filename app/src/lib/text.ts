/** Small text helpers shared by search and Ask Gaurav. */
export const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "");
export const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");
/** whole-word / whole-phrase match: "age" never matches "page", "phone" never "phonepe" */
export const hasTerm = (haystack: string, term: string) =>
  new RegExp(`(^|[^a-z0-9])${escapeRe(norm(term))}($|[^a-z0-9])`).test(norm(haystack));
export const tokens = (q: string) => norm(q).split(/[^a-z0-9%+.&/-]+/).filter((t) => t.length > 1);
export const stripHtml = (h: string) => h.replace(/<[^>]*>/g, " ").replace(/&amp;/g, "&").replace(/&[a-z]+;/g, " ").replace(/\s+/g, " ").trim();

/** split text into [plain, match, plain…] for highlighting */
export function highlight(text: string, query: string): { t: string; m: boolean }[] {
  const q = tokens(query);
  if (!q.length) return [{ t: text, m: false }];
  const re = new RegExp(`(${q.map((t) => t.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&")).join("|")})`, "ig");
  return text.split(re).filter(Boolean).map((t) => ({ t, m: q.includes(norm(t)) }));
}
