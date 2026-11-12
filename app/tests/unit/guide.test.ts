import { describe, it, expect } from "vitest";
import { next, type GuideState } from "~/guide/machine";
import { detect, asksFor, replyLang, SPEECH_TAG } from "~/guide/lang";
import { answerLocally, REFUSAL, toSpeech } from "~/guide/brain/local";
import { parseRemote } from "~/guide/brain/remote";
import { chunk, pickVoice } from "~/guide/voice/tts";
import { buildKnowledgePack } from "~/guide/knowledge";
import { projects } from "~/content/projects";

describe("guide state machine", () => {
  it("runs the happy path: open → ask → answer → speak → settle", () => {
    let s: GuideState = "sleeping";
    s = next(s, { type: "OPEN" }); expect(s).toBe("greeting");
    s = next(s, { type: "ASK" }); expect(s).toBe("thinking");
    s = next(s, { type: "ANSWER", kind: "answer" }); expect(s).toBe("happy");
    s = next(s, { type: "SPEECH_START" }); expect(s).toBe("speaking");
    s = next(s, { type: "SPEECH_END" }); expect(s).toBe("happy");
    s = next(s, { type: "SETTLE" }); expect(s).toBe("idle");
  });
  it("a refusal makes Oz confused, a failure makes it an error, close always sleeps", () => {
    expect(next("thinking", { type: "ANSWER", kind: "refused" })).toBe("confused");
    expect(next("listening", { type: "FAIL" })).toBe("error");
    for (const s of ["idle", "speaking", "listening", "thinking"] as GuideState[]) expect(next(s, { type: "CLOSE" })).toBe("sleeping");
  });
  it("ignores events that do not apply (no races)", () => {
    expect(next("sleeping", { type: "SPEECH_END" })).toBe("sleeping");
    expect(next("sleeping", { type: "LISTEN" })).toBe("sleeping");
  });
  it("lets the visitor interrupt speech by listening", () => expect(next("speaking", { type: "LISTEN" })).toBe("listening"));
});

describe("language", () => {
  it("detects Devanagari, Hinglish and English", () => {
    expect(detect("गौरव के प्रोजेक्ट्स दिखाओ")).toBe("hi");
    expect(detect("Gaurav ke projects kya hain")).toBe("hinglish");
    expect(detect("What has Gaurav built?")).toBe("en");
  });
  it("honours explicit requests over detection", () => {
    expect(asksFor("tell me in Hindi")).toBe("hi");
    expect(replyLang("kya hai ye, in English please", "auto")).toBe("en");
    expect(replyLang("What has he built?", "hi")).toBe("hi");
  });
  it("speaks Hinglish with an Indian English voice", () => expect(SPEECH_TAG.hinglish).toBe("en-IN"));
});

describe("local brain is grounded", () => {
  it("refuses figures the portfolio does not hold, in every language", () => {
    expect(answerLocally("What is Aaroh's revenue?", "en")).toMatchObject({ kind: "refused", text: REFUSAL.en });
    expect(answerLocally("Gaurav ki salary kitni hai", "hinglish").text).toBe(REFUSAL.hinglish);
    expect(answerLocally("how many active users does CareConnect have", "en").kind).toBe("refused");
  });
  it("refuses unrelated questions instead of improvising", () => {
    const r = answerLocally("What is the capital of Peru?", "en");
    expect(["refused", "none"]).toContain(r.kind); expect(r.text).toBe(REFUSAL.en);
  });
  it("lists only real projects with their real statuses", () => {
    const r = answerLocally("Explore Gaurav's projects", "en");
    expect(r.kind).toBe("answer");
    for (const p of projects.filter((p) => p.featured)) expect(r.text).toContain(p.name);
    expect(r.text).not.toMatch(/\b\d[\d,]* (users|customers)\b/i);
  });
  it("answers in Hindi from data fields", () => {
    const r = answerLocally("गौरव के प्रोजेक्ट्स दिखाओ", "hi");
    expect(r.lang).toBe("hi"); expect(r.kind).toBe("answer"); expect(r.text).toMatch(/[ऀ-ॿ]/);
  });
  it("turns 'open RupeeRadar' into navigation to the project page", () => {
    expect(answerLocally("open RupeeRadar", "en").navigate).toBe("/projects/rupee-radar");
    expect(answerLocally("take me to the contact page", "en").navigate).toBe("/contact");
  });
  it("speech text has no URLs or bullets and is capped", () => {
    const s = toSpeech("• one\n• two https://example.com → three".repeat(40));
    expect(s).not.toMatch(/https?:|•|→/); expect(s.length).toBeLessThanOrEqual(420);
  });
});

describe("remote brain response validation", () => {
  it("accepts a well-formed reply and keeps only internal links", () => {
    const r = parseRemote({ text: "Hi", kind: "answer", links: [{ label: "A", to: "/projects" }, { label: "B", to: "https://evil.example" }, { label: "C", to: "javascript:alert(1)" }] }, "en");
    expect(r?.links).toEqual([{ label: "A", to: "/projects" }]); expect(r?.source).toBe("remote");
  });
  it("rejects malformed or oversized replies (falls back to local)", () => {
    expect(parseRemote(null, "en")).toBeNull();
    expect(parseRemote({ text: "" }, "en")).toBeNull();
    expect(parseRemote({ text: "x".repeat(4001) }, "en")).toBeNull();
  });
});

describe("voice helpers", () => {
  it("chunks long text at sentence boundaries under the limit", () => {
    const parts = chunk("One sentence here. ".repeat(30), 180);
    expect(parts.length).toBeGreaterThan(1);
    for (const p of parts) expect(p.length).toBeLessThanOrEqual(180);
  });
  it("prefers an Indian voice and falls back by base language", () => {
    const v = (name: string, lang: string) => ({ name, lang }) as SpeechSynthesisVoice;
    const voices = [v("US", "en-US"), v("Heera", "en-IN"), v("Kalpana", "hi-IN")];
    expect(pickVoice(voices, "en-IN")?.name).toBe("Heera");
    expect(pickVoice(voices, "hi-IN")?.name).toBe("Kalpana");
    expect(pickVoice([v("US", "en-US")], "en-IN")?.name).toBe("US");
    expect(pickVoice([v("US", "en-US")], "hi-IN")).toBeNull();
  });
});

describe("knowledge pack for the optional AI endpoint", () => {
  it("is built from content modules and lists the refusal terms", () => {
    const k = buildKnowledgePack();
    for (const p of projects) expect(k).toContain(p.name);
    expect(k).toContain("Not in the portfolio (always refuse)");
    expect(k).not.toContain("legalName");
  });
});

describe("Oz voice: quality ranking and pronunciation", () => {
  const v = (name: string, lang: string) => ({ name, lang }) as SpeechSynthesisVoice;
  it("prefers a natural or neural voice over a legacy desktop voice, and an Indian natural voice above all", async () => {
    const { pickVoice, voiceQuality } = await import("~/guide/voice/tts");
    const desk = v("Microsoft Hazel Desktop - English (Great Britain)", "en-GB");
    const google = v("Google UK English Female", "en-GB");
    const neerja = v("Microsoft Neerja Online (Natural) - English (India)", "en-IN");
    expect(voiceQuality(desk)).toBeLessThan(voiceQuality(google));
    expect(pickVoice([desk, google], "en-IN")?.name).toBe(google.name);
    expect(pickVoice([desk, google, neerja], "en-IN")?.name).toBe(neerja.name);
    // never crosses languages: no Hindi voice means no voice (the answer stays as text)
    expect(pickVoice([desk, google, neerja], "hi-IN")).toBeNull();
  });
  it("says names and abbreviations the way a person would", async () => {
    const { pronounce } = await import("~/guide/voice/tts");
    expect(pronounce("Gaurav.OS shipped a PRD at GharGyaan")).toBe("Gaurav O S shipped a P R D at Ghar Gyaan");
    expect(pronounce("Nov 2024 – Apr 2026")).toBe("Nov 2024, Apr 2026");
    expect(pronounce("20–25% lift")).toBe("20 to 25% lift");
    expect(pronounce("APMs at RAPMATE")).toBe("APMs at RAPMATE"); // whole words only
  });
});
