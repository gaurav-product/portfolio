import { test, expect, type Page } from "@playwright/test";

/** The Product Universe. Headless Chromium renders WebGL in software, so these
 *  tests check behaviour and honesty (routes, panels, labels, fallbacks, sound
 *  rules), not frame rate or visual quality. */
const errorsOf = (page: Page) => {
  const errs: string[] = [];
  page.on("pageerror", (e) => errs.push(e.message));
  page.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
  return errs;
};
const seen = (page: Page) => page.addInitScript(() => localStorage.setItem("gos-universe-intro", "1"));

test("first visit: cinematic intro with Skip, then the Earth; no errors, no Oz bubble, no sound", async ({ page }) => {
  await page.addInitScript(() => {
    const w = window as unknown as Record<string, unknown>; w.__acCount = 0;
    const Orig = window.AudioContext; // count contexts: none may be created before a click
    window.AudioContext = class extends Orig { constructor(...a: ConstructorParameters<typeof AudioContext>) { super(...a); w.__acCount = (w.__acCount as number) + 1; } } as typeof AudioContext;
  });
  const errs = errorsOf(page);
  await page.goto("/universe?tier=laptop");
  await expect(page.getByTestId("intro-titles")).toBeVisible();
  await expect(page.getByTestId("skip-intro")).toBeVisible();
  await page.getByTestId("skip-intro").click();
  await expect(page.getByTestId("intro-titles")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Replay intro" })).toBeVisible({ timeout: 15_000 });
  await expect(page.getByText(/Solar System Scope, CC BY 4\.0/).first()).toBeVisible();
  await page.waitForTimeout(800);
  expect(await page.locator(".oz-bubble").count()).toBe(0);
  expect(await page.evaluate(() => (window as unknown as { __acCount: number }).__acCount)).toBe(0);
  expect(await page.getByRole("button", { name: "Sound off" }).getAttribute("aria-pressed")).toBe("false");
  expect(errs).toEqual([]);
});

test("the intro plays to the end and offers Enter exploration", async ({ page }) => {
  await page.goto("/universe?intro=1&tier=laptop");
  await expect(page.getByRole("button", { name: "Enter exploration" })).toBeVisible({ timeout: 25_000 });
  await page.getByRole("button", { name: "Enter exploration" }).click();
  await expect(page.getByTestId("intro-titles")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Replay intro" })).toBeVisible();
});

test("destination list → fly into CareConnect → honest case panel, gallery, lightbox → back to Earth", async ({ page }) => {
  await seen(page);
  await page.goto("/universe?tier=laptop");
  await page.getByTestId("destinations-toggle").click();
  const list = page.getByTestId("destination-list");
  await expect(list.getByRole("button")).toHaveCount(11);
  await list.getByRole("button", { name: /CareConnect/ }).click();
  await expect(page).toHaveURL(/\/universe\/careconnect$/, { timeout: 15_000 });
  const panel = page.getByTestId("case-panel");
  await expect(panel).toBeVisible();
  await expect(panel).toContainText("MVP · NO USERS");
  await panel.getByRole("tab", { name: "Case study" }).click();
  await expect(panel.locator("section h3").first()).toBeVisible();
  await panel.getByRole("tab", { name: /Gallery/ }).click();
  await panel.getByRole("tabpanel").getByRole("button").first().click();
  const lb = page.getByTestId("lightbox");
  await expect(lb).toBeVisible();
  await expect(lb).toContainText(/Actual product screenshot · demo data/i);
  const img = lb.locator("img");
  await expect(img).toHaveJSProperty("complete", true);
  expect(await img.evaluate((i: HTMLImageElement) => i.naturalWidth)).toBeGreaterThan(400);
  await page.keyboard.press("Escape");
  await expect(lb).toHaveCount(0);
  await page.getByTestId("back-to-earth").click();
  await expect(page).toHaveURL(/\/universe$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/universe\/careconnect$/);
});

test("concepts are labelled as concepts in development, never as built products", async ({ page }) => {
  for (const [slug, name] of [["interview-radar", "Interview Radar"], ["repass", "Repass"]]) {
    await page.goto(`/universe/${slug}`);
    const panel = page.getByTestId("case-panel");
    await expect(panel).toContainText("Concept in development");
    await expect(panel).toContainText(/Not built, not launched and not validated/);
    await expect(panel.getByRole("heading", { level: 1 })).toHaveText(name);
  }
  await page.goto("/ventures/repass");
  await expect(page.getByText("Illustrative example — not transaction data")).toBeVisible();
  await expect(page.getByText(/Indian Railways/)).toBeVisible();
});

test("2D list view works without WebGL and still reaches every case study", async ({ page }) => {
  await page.addInitScript(() => {
    const orig = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, ...rest: unknown[]) {
      if (/webgl/.test(type)) return null;
      return (orig as (...a: unknown[]) => unknown).call(this, type, ...rest);
    } as typeof orig;
  });
  await page.goto("/universe");
  await expect(page.getByText(/needs WebGL/)).toBeVisible();
  await expect(page.locator("canvas")).toHaveCount(0);
  await page.getByTestId("destination-list").getByRole("button", { name: /Nexus/ }).click();
  await expect(page).toHaveURL(/\/universe\/nexus$/);
  await expect(page.getByTestId("case-panel")).toContainText("Nexus");
});

test("without a graphics processor the list leads, and 3D can still be started", async ({ page }) => {
  await seen(page);
  await page.goto("/universe"); // headless Chromium renders WebGL in software
  await expect(page.getByText(/without a graphics processor/)).toBeVisible();
  await expect(page.locator("canvas")).toHaveCount(0);
  await page.getByRole("button", { name: "Start the 3D universe anyway" }).click();
  await expect(page.locator("canvas")).toHaveCount(1);
  await expect(page.getByRole("button", { name: "Replay intro" })).toBeVisible({ timeout: 15_000 });
});

test("sound: off by default, on with a click, remembered; settings popover works", async ({ page }) => {
  await seen(page);
  await page.goto("/universe");
  await page.getByRole("button", { name: "Sound off" }).click();
  await expect(page.getByRole("button", { name: "Sound on" })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Sound settings" }).click();
  await expect(page.getByRole("checkbox", { name: "Ambient soundtrack" })).toBeChecked();
  await page.getByRole("checkbox", { name: "Ambient soundtrack" }).uncheck();
  await page.reload();
  await expect(page.getByRole("button", { name: "Sound on" })).toBeVisible();
  const prefs = await page.evaluate(() => JSON.parse(localStorage.getItem("gos-audio") ?? "{}"));
  expect(prefs).toMatchObject({ enabled: true, ambient: false });
});

test("reduced motion: no flight, no skip button; keyboard reaches the list and Escape closes it", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce", baseURL: "http://127.0.0.1:4173" });
  const page = await ctx.newPage();
  await page.goto("/universe?intro=1&tier=laptop");
  await expect(page.getByTestId("skip-intro")).toHaveCount(0);
  await page.getByTestId("destinations-toggle").click();
  await expect(page.getByTestId("destination-list").getByRole("button").first()).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("destination-list")).toHaveCount(0);
  await ctx.close();
});

test("exit cinematic mode returns to where the visitor came from; home CTA opens the universe", async ({ page }) => {
  await seen(page);
  await page.goto("/?nointro");
  await page.getByRole("link", { name: "Explore my work" }).click();
  await expect(page).toHaveURL(/\/universe$/);
  await expect(page.locator("header").first()).toHaveCount(0); // site header hidden in cinematic mode
  await page.getByTestId("exit-universe").click();
  await expect(page).toHaveURL(/\/(\?nointro)?$/);
});

test("Oz can take a visitor to a concept world and back to Earth", async ({ page }) => {
  await seen(page);
  await page.goto("/universe");
  await page.getByRole("button", { name: "Open Oz, the Gaurav.OS AI Guide" }).click();
  await page.locator("#oz-input").fill("Take me to Repass");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/universe\/repass$/, { timeout: 10_000 });
  await page.locator("#oz-input").fill("Take me back to Earth");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/universe$/, { timeout: 10_000 });
});

test.describe("mobile", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  test("world panel is a bottom sheet, nothing overflows", async ({ page }) => {
    await page.goto("/universe/ghargyaan");
    const panel = page.getByTestId("case-panel");
    await expect(panel).toBeVisible();
    const box = (await panel.boundingBox())!;
    expect(box.width).toBeLessThanOrEqual(390);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
  });
});
