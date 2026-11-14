import { test, expect, type Page } from "@playwright/test";

/** The 3D pages: the Earth of the 90 case studies (/universe), the project
 *  worlds (/worlds), The Teardown and the two concept worlds. Headless Chromium
 *  renders WebGL in software, so these tests check behaviour and honesty
 *  (routes, URL state, panels, labels, fallbacks, sound rules), not frame rate. */
const errorsOf = (page: Page) => {
  const errs: string[] = [];
  page.on("pageerror", (e) => errs.push(e.message));
  page.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
  return errs;
};
const seen = (page: Page) => page.addInitScript(() => localStorage.setItem("gos-universe-intro", "1"));
const studyList = (page: Page) => page.getByTestId("study-list");

test("first visit: cinematic intro with Skip, then the Earth; no errors, no Oz bubble, no sound", async ({ page }) => {
  await page.addInitScript(() => {
    const w = window as unknown as Record<string, unknown>; w.__acCount = 0;
    const Orig = window.AudioContext; // count contexts: none may be created before a click
    window.AudioContext = class extends Orig { constructor(...a: ConstructorParameters<typeof AudioContext>) { super(...a); w.__acCount = (w.__acCount as number) + 1; } } as typeof AudioContext;
  });
  const errs = errorsOf(page);
  await page.goto("/universe?at=earth&tier=laptop");
  await expect(page.getByTestId("intro-titles")).toBeVisible();
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
  await page.goto("/universe?at=earth&intro=1&tier=laptop");
  await expect(page.getByRole("button", { name: "Enter exploration" })).toBeVisible({ timeout: 25_000 });
  await page.getByRole("button", { name: "Enter exploration" }).click();
  await expect(page.getByTestId("intro-titles")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Replay intro" })).toBeVisible();
});

test("the Earth lists exactly the 90 studies — no projects, concepts, newsletter or corpus marker", async ({ page }) => {
  await seen(page);
  await page.goto("/universe?at=earth&tier=laptop");
  await page.getByTestId("studies-toggle").click();
  await expect(studyList(page).getByRole("button")).toHaveCount(90);
  await expect(page.getByTestId("study-count")).toContainText("90 of 90 studies");
  for (const name of ["CareConnect", "Interview Radar", "Repass", "The Teardown", "90-Day"]) await expect(studyList(page).getByRole("button", { name: new RegExp(name) })).toHaveCount(0);
});

test("select a study: panel, URL, Previous/Next, Back/Forward, close; the full study is one click away", async ({ page }) => {
  await seen(page);
  await page.goto("/universe?at=earth&tier=laptop");
  await page.getByTestId("studies-toggle").click();
  await studyList(page).getByRole("button", { name: /^Day 12\b/ }).click();
  await expect(page).toHaveURL(/[?&]study=12\b/);
  const panel = page.getByTestId("study-panel");
  await expect(panel).toContainText("Day 12");
  await expect(panel).toContainText("Netflix");
  await expect(panel).toContainText("Case study (research) — not a launched product");
  await expect(panel).toContainText(/SOURCED|DOCUMENTED|VERIFIED|NARRATIVE/);
  await expect(panel.getByRole("link", { name: "Read the full study" })).toHaveAttribute("href", "/research/12");
  await panel.getByTestId("next-study").click();
  await expect(page).toHaveURL(/study=13\b/);
  await panel.getByTestId("prev-study").click();
  await panel.getByTestId("prev-study").click();
  await expect(page).toHaveURL(/study=11\b/);
  await page.goBack(); await expect(page).toHaveURL(/study=12\b/);
  await page.goBack(); await expect(page).toHaveURL(/study=13\b/);
  await page.goForward(); await expect(page).toHaveURL(/study=12\b/);
  await expect(page.getByTestId("study-panel")).toContainText("Netflix");
  await page.getByTestId("close-study").click();
  await expect(page).not.toHaveURL(/study=/);
  await expect(page.getByTestId("study-panel")).toHaveCount(0);
  await page.goBack(); await expect(page.getByTestId("study-panel")).toContainText("Netflix");
  await page.getByTestId("study-panel").getByRole("link", { name: "Read the full study" }).click();
  await expect(page).toHaveURL(/\/research\/12$/);
  await expect(page.locator("h1").first()).toBeVisible();
});

test("search and filters live in the URL, narrow the list, and Previous/Next stays inside the filtered set", async ({ page }) => {
  await seen(page);
  await page.goto("/universe?at=earth&tier=laptop");
  await page.getByTestId("studies-toggle").click();
  await page.getByRole("button", { name: /^Fintech/ }).click();
  await expect(page).toHaveURL(/cat=Fintech/);
  // the URL can change a frame before React commits the filtered list; count() does not retry, so wait for it to narrow
  await expect.poll(() => studyList(page).getByRole("button").count()).toBeLessThan(90);
  const n = await studyList(page).getByRole("button").count();
  expect(n).toBeGreaterThan(0); expect(n).toBeLessThan(90);
  await expect(page.getByTestId("study-count")).toContainText(`${n} of 90 studies`);
  await page.getByRole("button", { name: /^Verified/ }).click();
  await expect(page).toHaveURL(/ev=verified/);
  await page.getByRole("button", { name: "Clear filters" }).first().click();
  await expect(studyList(page).getByRole("button")).toHaveCount(90);
  await page.getByTestId("study-search").fill("day 40");
  await expect(page).toHaveURL(/q=day\+40|q=day%2040/);
  await expect(studyList(page).getByRole("button")).toHaveCount(1);

  // a shared filtered link: no intro, the same filtered set; stepping wraps within it
  await page.goto("/universe?tier=laptop&cat=Fintech&study=7");
  await expect(page.getByTestId("intro-titles")).toHaveCount(0);
  const panel = page.getByTestId("study-panel");
  await expect(panel).toContainText(`of ${n} matching`);
  for (let i = 0; i < n; i++) await panel.getByTestId("next-study").click();
  await expect(page).toHaveURL(/study=7\b/);
});

test("2D list view works without WebGL and still reaches every study", async ({ page }) => {
  await page.addInitScript(() => {
    const orig = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, ...rest: unknown[]) {
      if (/webgl/.test(type)) return null;
      return (orig as (...a: unknown[]) => unknown).call(this, type, ...rest);
    } as typeof orig;
  });
  await page.goto("/universe?at=earth");
  await expect(page.getByText(/needs WebGL/)).toBeVisible();
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1, name: "90 product case studies" })).toBeVisible();
  await expect(studyList(page).getByRole("button")).toHaveCount(90);
  await studyList(page).getByRole("button", { name: /^Day 40\b/ }).click();
  await expect(page).toHaveURL(/study=40\b/);
  await expect(page.getByTestId("study-panel")).toContainText("Day 40");
});

test("without a graphics processor the list leads, and 3D can still be started", async ({ page }) => {
  await seen(page);
  await page.goto("/universe?at=earth"); // headless Chromium renders WebGL in software
  await expect(page.getByText(/without a graphics processor/)).toBeVisible();
  await expect(page.locator("canvas")).toHaveCount(0);
  await page.getByRole("button", { name: "Start the 3D Earth anyway" }).click();
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

test("reduced motion: no flight, no skip button; keyboard reaches the search and Escape closes the list", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce", baseURL: "http://127.0.0.1:4173" });
  const page = await ctx.newPage();
  await page.goto("/universe?at=earth&intro=1&tier=laptop");
  await expect(page.getByTestId("skip-intro")).toHaveCount(0);
  await page.getByTestId("studies-toggle").click();
  await expect(page.getByTestId("study-search")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("study-browser")).toHaveCount(0);
  await ctx.close();
});

test("home: Explore my work opens the guided tour; the 3D Earth is the secondary CTA; Exit returns", async ({ page }) => {
  await seen(page);
  await page.goto("/?nointro");
  await expect(page.getByRole("link", { name: "Explore my work" })).toHaveAttribute("href", "/tour");
  await page.locator("#main").getByRole("link", { name: "Solar system in 3D" }).click(); // the footer has the same link
  await expect(page).toHaveURL(/\/universe$/);
  await expect(page.locator("header").first()).toHaveCount(0); // site header hidden in cinematic mode
  await page.getByTestId("exit-universe").click();
  await expect(page).toHaveURL(/\/(\?nointro)?$/);
});

test("project worlds: the hub holds exactly 7 projects; a world keeps its building, panel, gallery and lightbox", async ({ page }) => {
  await page.goto("/worlds");
  const cards = page.getByTestId("world-cards").getByRole("listitem");
  await expect(cards).toHaveCount(7);
  for (const name of ["Interview Radar", "Repass", "The Teardown", "90-Day"]) await expect(page.getByTestId("world-cards").getByText(name)).toHaveCount(0);
  await page.getByRole("link", { name: "Enter the world: CareConnect" }).click();
  await expect(page).toHaveURL(/\/worlds\/careconnect$/);
  const panel = page.getByTestId("case-panel");
  await expect(panel).toContainText("MVP · NO USERS");
  await panel.getByRole("tab", { name: "Case study" }).click();
  await expect(panel.locator("section h3").first()).toBeVisible();
  await panel.getByRole("tab", { name: /Gallery/ }).click();
  await panel.getByRole("tabpanel").getByRole("button").first().click();
  const lb = page.getByTestId("lightbox");
  await expect(lb).toContainText(/Actual product screenshot · demo data/i);
  const img = lb.locator("img");
  await expect(img).toHaveJSProperty("complete", true);
  expect(await img.evaluate((i: HTMLImageElement) => i.naturalWidth)).toBeGreaterThan(400);
  await page.keyboard.press("Escape");
  await expect(lb).toHaveCount(0);
  await panel.getByRole("button", { name: "Back to all worlds" }).click();
  await expect(page).toHaveURL(/\/worlds$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/worlds\/careconnect$/);
});

test("The Teardown and the concepts keep their 3D worlds at their own routes, labelled honestly", async ({ page }) => {
  await page.goto("/writing/the-teardown");
  const tp = page.getByTestId("case-panel");
  await expect(tp).toContainText("The Teardown");
  await expect(tp.getByRole("link", { name: /Subscribe on LinkedIn/ })).toBeVisible();
  await expect(page.getByTestId("world-back")).toHaveAttribute("href", "/about#writing-h");
  for (const [slug, name] of [["interview-radar", "Interview Radar"], ["repass", "Repass"]]) {
    await page.goto(`/ventures/${slug}/world`);
    const panel = page.getByTestId("case-panel");
    await expect(panel).toContainText("Concept in development");
    await expect(panel).toContainText(/Not built, not launched and not validated/);
    await expect(panel.getByRole("heading", { level: 1 })).toHaveText(name);
    await expect(page.getByTestId("world-back")).toHaveAttribute("href", `/ventures/${slug}`);
  }
  await page.goto("/ventures/repass");
  await expect(page.getByText("Illustrative example — not transaction data")).toBeVisible();
  await page.getByRole("link", { name: "Visit in 3D" }).click();
  await expect(page).toHaveURL(/\/ventures\/repass\/world$/);
  await page.goto("/about");
  await page.getByRole("link", { name: "See it in 3D" }).click();
  await expect(page).toHaveURL(/\/writing\/the-teardown$/);
});

test("old /universe/<slug> addresses redirect to their new homes", async ({ page }) => {
  for (const [from, to] of [["careconnect", /\/worlds\/careconnect$/], ["the-teardown", /\/writing\/the-teardown$/], ["repass", /\/ventures\/repass\/world$/], ["interview-radar", /\/ventures\/interview-radar\/world$/], ["90-day-case-studies", /\/universe\?at=earth$/]] as const) { // the 90 studies live on the Earth stage
    await page.goto(`/universe/${from}`);
    await expect(page).toHaveURL(to, { timeout: 10_000 });
  }
});

test("old addresses keep their query string and hash: with the app running and before it starts", async ({ page }) => {
  await page.goto("/universe/careconnect?tier=laptop&view=2d#gallery");
  await expect(page).toHaveURL(/\/worlds\/careconnect\?tier=laptop&view=2d#gallery$/, { timeout: 10_000 });
  await page.goto("/universe/90-day-case-studies?study=40&cat=SaaS");
  await expect(page).toHaveURL(/\/universe\?at=earth&study=40&cat=SaaS$/, { timeout: 10_000 });
  await expect(page.getByTestId("study-panel")).toContainText("Day 40");
  // the app's scripts never load: the inline head script still carries the query across
  await page.route(/\/assets\/.*\.js$/, (r) => r.abort());
  await page.goto("/universe/repass?view=2d");
  await expect(page).toHaveURL(/\/ventures\/repass\/world\?view=2d$/, { timeout: 10_000 });
});

test("the menu drawer links the 3D Earth exactly once", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/about");
  await page.getByRole("button", { name: "Open menu" }).click();
  const drawer = page.getByRole("dialog", { name: "Site menu" });
  await expect(drawer.getByRole("link", { name: "Solar system in 3D" })).toHaveCount(1);
  await expect(drawer.getByRole("link", { name: "Project Worlds" })).toHaveCount(1);
});

test("Oz opens a concept page and offers its 3D world, and finds the Earth", async ({ page }) => {
  await seen(page);
  await page.goto("/ventures");
  await page.getByRole("button", { name: "Open Oz, the Gaurav.OS AI Guide" }).click();
  await page.locator("#oz-input").fill("Take me to Repass");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/ventures\/repass$/, { timeout: 10_000 });
  await expect(page.getByRole("link", { name: "Visit Repass in 3D" }).last()).toHaveAttribute("href", "/ventures/repass/world");
  await page.locator("#oz-input").fill("Take me to the Earth");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/universe\?at=earth$/, { timeout: 10_000 });
});

test.describe("phone landscape", () => {
  test.use({ viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true });
  test("short landscape screens get a side panel, not a sheet over the scene; Previous and Next stay reachable", async ({ page }) => {
    for (const [url, id] of [["/worlds/careconnect?tier=mobile", "case-panel"], ["/universe?tier=mobile&study=40", "study-panel"]] as const) {
      await page.goto(url);
      const box = (await page.getByTestId(id).boundingBox())!;
      expect(box.width, url).toBeLessThan(844 * 0.5);   // a side panel, the scene stays visible beside it
      expect(box.y + box.height, url).toBeLessThanOrEqual(390);
    }
    await expect(page.getByTestId("next-study")).toBeInViewport();
    await page.getByTestId("next-study").click();
    await expect(page).toHaveURL(/study=41\b/);
  });
});

test.describe("mobile", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  test("world panel and study panel are bottom sheets, nothing overflows", async ({ page }) => {
    await page.goto("/worlds/ghargyaan");
    const panel = page.getByTestId("case-panel");
    await expect(panel).toBeVisible();
    expect((await panel.boundingBox())!.width).toBeLessThanOrEqual(390);
    // the sheet leaves the upper part of the screen to the building, and collapsing it gives the whole screen back
    expect((await panel.boundingBox())!.y).toBeGreaterThan(844 * 0.4);
    await page.getByTestId("sheet-toggle").click();
    await expect(panel).toHaveAttribute("data-collapsed", "true");
    expect((await panel.boundingBox())!.y).toBeGreaterThan(844 * 0.6);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
    await page.goto("/universe?study=40");
    const sp = page.getByTestId("study-panel");
    await expect(sp).toBeVisible();
    expect((await sp.boundingBox())!.width).toBeLessThanOrEqual(390);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
  });
});
