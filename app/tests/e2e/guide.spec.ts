import { test, expect, type Page } from "@playwright/test";

/**
 * Oz, the Gaurav.OS guide. Browser speech engines are replaced with
 * deterministic fakes (headless Chromium has no voices and no microphone), so
 * these tests prove the wiring — start, interrupt, permission errors — not the
 * quality of any real voice.
 */
const FAKE_SPEECH = () => {
  const w = window as unknown as Record<string, unknown>;
  const log: string[] = ((w.__speech = []) as string[]);
  class Utt { text: string; lang = ""; rate = 1; pitch = 1; voice: unknown = null; onstart?: () => void; onend?: () => void; onerror?: (e: unknown) => void; onboundary?: () => void; constructor(t: string) { this.text = t; } }
  let current: Utt | null = null, timer: ReturnType<typeof setTimeout> | undefined;
  const synth = {
    speaking: false, pending: false, paused: false,
    getVoices: () => [{ name: "Fake Heera", lang: "en-IN", default: true, localService: true, voiceURI: "fake-en-IN" }, { name: "Fake Kalpana", lang: "hi-IN", default: false, localService: true, voiceURI: "fake-hi-IN" }],
    speak(u: Utt) { log.push(`speak:${u.lang}:${u.text.slice(0, 40)}`); current = u; synth.speaking = true; setTimeout(() => u.onstart?.(), 10); timer = setTimeout(() => { synth.speaking = false; if (current === u) u.onend?.(); }, 1500); },
    cancel() { log.push("cancel"); if (timer) clearTimeout(timer); const u = current; current = null; synth.speaking = false; u?.onend?.(); },
    pause() {}, resume() {}, addEventListener() {}, removeEventListener() {}, onvoiceschanged: null,
  };
  Object.defineProperty(window, "speechSynthesis", { value: synth, configurable: true });
  w.SpeechSynthesisUtterance = Utt;
  class Rec {
    lang = ""; interimResults = false; continuous = false; maxAlternatives = 1;
    onresult: ((e: unknown) => void) | null = null; onerror: ((e: unknown) => void) | null = null; onend: (() => void) | null = null;
    start() {
      log.push(`listen:${this.lang}`);
      setTimeout(() => {
        if (localStorage.getItem("__mic") === "denied") { this.onerror?.({ error: "not-allowed" }); this.onend?.(); return; }
        this.onresult?.({ resultIndex: 0, results: [{ isFinal: true, 0: { transcript: "What has Gaurav built?" } }] });
        this.onend?.();
      }, 200);
    }
    stop() { this.onend?.(); } abort() { log.push("abort"); }
  }
  w.SpeechRecognition = Rec; w.webkitSpeechRecognition = Rec;
};

async function openOz(page: Page) {
  await page.getByRole("button", { name: "Open Oz, the Gaurav.OS AI Guide" }).click();
  await expect(page.getByTestId("oz-panel")).toBeVisible();
}
const speech = (page: Page) => page.evaluate(() => (window as unknown as { __speech: string[] }).__speech);

test.beforeEach(async ({ page }) => { await page.addInitScript(FAKE_SPEECH); });

test("Oz is on every page (except the CV) and keeps the conversation across navigation", async ({ page }) => {
  for (const p of ["/?nointro", "/projects", "/about", "/contact"]) {
    await page.goto(p);
    await expect(page.getByTestId("oz")).toBeVisible();
  }
  await page.goto("/cv");
  await expect(page.getByTestId("oz")).toHaveCount(0);

  await page.goto("/?nointro");
  await openOz(page);
  await page.locator("#oz-input").fill("open RupeeRadar");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/projects\/rupee-radar/);
  await expect(page.getByTestId("oz-log")).toContainText("open RupeeRadar");
});

test("never speaks or listens on its own", async ({ page }) => {
  await page.goto("/?nointro");
  await openOz(page);
  await page.waitForTimeout(800);
  expect(await speech(page)).toEqual([]);
  await page.locator("#oz-input").fill("What has Gaurav built?");
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("oz-log")).toContainText("RupeeRadar");
  expect((await speech(page)).filter((s) => s.startsWith("speak") || s.startsWith("listen"))).toEqual([]);
});

test("typed question gets a grounded answer; unsupported question gets the refusal line", async ({ page }) => {
  await page.goto("/?nointro");
  await openOz(page);
  const log = page.getByTestId("oz-log");
  await page.locator("#oz-input").fill("Tell me about his product experience");
  await page.getByRole("button", { name: "Send" }).click();
  await expect(log).toContainText("Adhyatm Sadhna Kendra");
  await expect(log).toContainText("Verified local answer");
  await page.locator("#oz-input").fill("What is Aaroh's revenue?");
  await page.keyboard.press("Enter");
  await expect(log).toContainText("I don't have verified information about that yet. You can explore Gaurav's portfolio or contact him directly.");
});

test("Hindi and Hinglish replies", async ({ page }) => {
  await page.goto("/?nointro");
  await openOz(page);
  const log = page.getByTestId("oz-log");
  await page.locator("#oz-input").fill("गौरव के प्रोजेक्ट्स दिखाओ");
  await page.keyboard.press("Enter");
  await expect(log.locator("text=/प्रोजेक्ट/").last()).toBeVisible();
  await page.locator("#oz-input").fill("Gaurav ki salary kya hai");
  await page.keyboard.press("Enter");
  await expect(log).toContainText("verified jaankari nahi hai");
});

test("voice on: speaks the answer with an Indian voice, and Stop interrupts", async ({ page }) => {
  await page.goto("/?nointro");
  await openOz(page);
  const toggle = page.getByRole("button", { name: "Speak replies aloud" });
  if ((await toggle.getAttribute("aria-pressed")) !== "true") await toggle.click();
  await page.locator("#oz-input").fill("What has Gaurav built?");
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("oz-status")).toContainText(/speaking|talking/i);
  expect((await speech(page)).some((s) => s.startsWith("speak:en-IN"))).toBe(true);
  await page.getByRole("button", { name: "Stop speaking" }).click();
  expect(await speech(page)).toContain("cancel");
  await expect(page.getByRole("button", { name: "Send" })).toBeVisible();
});

test("microphone: one utterance per press, transcript is answered", async ({ page }) => {
  await page.goto("/?nointro");
  await openOz(page);
  await page.getByRole("button", { name: "Ask with your voice" }).click();
  await expect(page.getByTestId("oz-log")).toContainText("What has Gaurav built?");
  await expect(page.getByTestId("oz-log")).toContainText("RupeeRadar");
  expect((await speech(page)).filter((s) => s.startsWith("listen"))).toEqual(["listen:en-IN"]);
});

test("microphone permission denied shows a recoverable message and text still works", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("__mic", "denied"));
  await page.goto("/?nointro");
  await openOz(page);
  await page.getByRole("button", { name: "Ask with your voice" }).click();
  await expect(page.getByRole("alert")).toContainText(/microphone/i);
  await page.locator("#oz-input").fill("I'm a recruiter");
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("oz-log")).toContainText(/recruiter/i);
});

test("keyboard: open with Enter, Escape minimises and returns focus; arrows move Oz", async ({ page }) => {
  await page.goto("/?nointro");
  const launch = page.getByRole("button", { name: "Open Oz, the Gaurav.OS AI Guide" });
  await launch.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("oz-panel")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("oz-panel")).toHaveCount(0);
  await expect(page.locator(".oz-launch")).toBeFocused();
  const before = await page.getByTestId("oz").boundingBox();
  await page.keyboard.press("Shift+ArrowLeft");
  const after = await page.getByTestId("oz").boundingBox();
  expect(after!.x).toBeLessThan(before!.x);
});

test("drag repositions Oz and the position persists", async ({ page }) => {
  await page.goto("/?nointro");
  const btn = page.locator(".oz-launch");
  const b = (await btn.boundingBox())!;
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
  await page.mouse.down();
  await page.mouse.move(b.x - 200, b.y - 150, { steps: 8 });
  await page.mouse.up();
  await expect(page.getByTestId("oz-panel")).toHaveCount(0); // a drag is not a click
  const moved = (await btn.boundingBox())!;
  expect(moved.x).toBeLessThan(b.x - 100);
  await page.reload();
  const reloaded = (await page.locator(".oz-launch").boundingBox())!;
  expect(Math.abs(reloaded.x - moved.x)).toBeLessThan(4);
});

test("reduced motion: Oz does not animate", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("http://127.0.0.1:4173/?nointro");
  const anim = await page.locator(".oz-float").first().evaluate((el) => getComputedStyle(el).animationName);
  expect(anim).toBe("none");
  await ctx.close();
});

test.describe("mobile", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  test("panel fits the screen with no horizontal overflow", async ({ page }) => {
    await page.goto("/?nointro");
    // on a phone, Oz steps aside while it would cover the homepage introduction (inert, not tappable) …
    await expect(page.getByTestId("oz")).toHaveAttribute("data-stepped-aside", "");
    // … and is back once the introduction has scrolled clear
    await page.locator("[data-oz-avoid]").last().evaluate((el) => scrollTo(0, el.getBoundingClientRect().bottom + scrollY + 100));
    await expect(page.getByTestId("oz")).not.toHaveAttribute("data-stepped-aside");
    await page.getByRole("button", { name: "Open Oz, the Gaurav.OS AI Guide" }).tap();
    const panel = page.getByTestId("oz-panel");
    await expect(panel).toBeVisible();
    const box = (await panel.boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(390);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
    await page.getByRole("button", { name: "Minimise Oz" }).tap();
    await expect(page.getByTestId("oz")).toBeVisible();
  });
});
