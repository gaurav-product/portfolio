import { describe, it, expect } from "vitest";
import { riceScore, funnel, toCsv, pct } from "~/lib/pm";
import { ask } from "~/lib/ask";
import { search, highlight } from "~/lib/search";
import { hasTerm } from "~/lib/text";
import { suggested } from "~/content/kb";

describe("RICE", () => {
  it("computes Reach × Impact × Confidence ÷ Effort", () => expect(riceScore({ reach: 4000, impact: 2, confidence: 80, effort: 3 })).toBeCloseTo(2133.33, 1));
  it("rejects zero/negative effort and out-of-range confidence", () => {
    expect(riceScore({ reach: 1, impact: 1, confidence: 50, effort: 0 })).toBeNull();
    expect(riceScore({ reach: 1, impact: 1, confidence: 120, effort: 1 })).toBeNull();
    expect(riceScore({ reach: NaN, impact: 1, confidence: 50, effort: 1 })).toBeNull();
  });
});

describe("funnel", () => {
  const rows = funnel([{ id: "1", label: "a", users: 40000 }, { id: "2", label: "b", users: 16000 }, { id: "3", label: "c", users: 11200 }, { id: "4", label: "d", users: 9520 }, { id: "5", label: "e", users: 2856 }]);
  it("reproduces the capstone's own arithmetic", () => {
    expect(pct(rows[1].stepConv)).toBe("40.0%");
    expect(pct(rows[4].stepConv)).toBe("30.0%");
    expect(pct(rows[4].dropOff)).toBe("70.0%");
    expect(pct(rows[4].overall, 2)).toBe("7.14%");
  });
  it("handles a zero step without dividing by zero", () => expect(funnel([{ id: "a", label: "a", users: 0 }, { id: "b", label: "b", users: 0 }])[1].stepConv).toBe(0));
});

describe("CSV export", () => {
  it("quotes commas and quotes", () => expect(toCsv(["a"], [['x, "y"']])).toBe('a\n"x, ""y"""\n'));
  it("neutralises spreadsheet formula injection", () => expect(toCsv(["a"], [["=HYPERLINK(1)"]])).toBe("a\n'=HYPERLINK(1)\n"));
  it("keeps negative numbers as numbers", () => expect(toCsv(["a"], [["-5"]])).toBe("a\n-5\n"));
});

describe("Ask Gaurav", () => {
  it("refuses unsupported figures before topic matching", () => {
    const r = ask("What is Aaroh's revenue?");
    expect(r.kind).toBe("refused");
  });
  it("refuses requests for private details", () => expect(ask("What is his phone number?").kind).toBe("refused"));
  it("does not refuse PhonePe because it contains 'phone'", () => expect(ask("Tell me about the PhonePe case").kind).not.toBe("refused"));
  it("does not refuse 'page' because it contains 'age'", () => expect(hasTerm("which page shows this", "age")).toBe(false));
  it("answers every suggested question with its own entry", () => suggested.forEach((q) => { const r = ask(q); expect(r.kind, q).toBe("answer"); if (r.kind === "answer") expect(r.entry.q).toBe(q); }));
  it("states the correct MCA institution", () => { const r = ask("Where did he do his MCA?"); expect(r.kind).toBe("answer"); expect(JSON.stringify(r)).toContain("Chaudhary Charan Singh University"); });
  it("falls back to related pages, not a guess", () => expect(["related", "none"]).toContain(ask("Tell me about Zypp Electric").kind));
  it("returns nothing for gibberish rather than inventing", () => expect(ask("qwzx vbnm").kind).toBe("none"));
});

describe("search", () => {
  it("finds Evamastu as a project first", () => { const h = search("Evamastu"); expect(h[0].title).toBe("Evamastu"); expect(h[0].type).toBe("Project"); });
  it("searches research, skills and tools", () => {
    expect(search("Zypp").some((h) => h.type === "Research")).toBe(true);
    expect(search("cohort analysis").some((h) => h.type === "Skill")).toBe(true);
    expect(search("RICE calculator").some((h) => h.type === "Tool")).toBe(true);
  });
  it("requires every term to match", () => expect(search("evamastu zzzz")).toHaveLength(0));
  it("highlights matches", () => expect(highlight("Post-discharge care", "discharge").some((p) => p.m && p.t.toLowerCase() === "discharge")).toBe(true));
});
