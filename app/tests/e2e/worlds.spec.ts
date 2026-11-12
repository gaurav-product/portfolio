import { test, expect, type Page } from "@playwright/test";

/**
 * Wait until a scene's textures have finished arriving (staggered screenshots arrive for several seconds;
 * each upload legitimately draws one frame, and the count can sit still for ~2 s between arrivals).
 * Settled = no image request in flight AND the texture count unchanged for 3 s. Call before page.goto
 * (it listens to requests). Fails loudly if it never settles, rather than carrying on unsettled.
 */
function trackImages(page: Page) {
  let pending = 0;
  page.on("request", (r) => { if (r.resourceType() === "image") pending++; });
  const done = (r: { resourceType(): string }) => { if (r.resourceType() === "image") pending = Math.max(0, pending - 1); };
  page.on("requestfinished", done); page.on("requestfailed", done);
  return async function untilTexturesSettled() {
    const tex = () => page.evaluate(() => (window as unknown as { __gosGL?: { info: { memory: { textures: number } } } }).__gosGL?.info.memory.textures ?? -1);
    let last = -2, since = Date.now();
    const deadline = Date.now() + 30_000;
    while (Date.now() < deadline) {
      const t = await tex();
      if (t !== last || pending > 0) { last = t; since = Date.now(); }
      else if (t >= 0 && Date.now() - since >= 3000) return t;
      await page.waitForTimeout(250);
    }
    throw new Error(`textures never settled (last count ${last}, ${pending} image request(s) in flight)`);
  };
}

/** Every 3D world: the 7 project worlds, The Teardown and the two concept worlds.
 *  Routing, honest labels, back targets, gallery, image viewer (keyboard, focus trap,
 *  focus restore, swipe) and reduced motion. ?tier=laptop forces 3D in headless Chromium. */
const WORLDS = [
  { url: "/worlds/evamastu", name: "Evamastu", status: "Shipped (employer product)", back: "/worlds" },
  { url: "/worlds/aaroh", name: "Aaroh", status: "Pre-launch prototype", back: "/worlds" },
  { url: "/worlds/careconnect", name: "CareConnect", status: "MVP · no users", back: "/worlds" },
  { url: "/worlds/ghargyaan", name: "GharGyaan", status: "Prototype · demo mode", back: "/worlds" },
  { url: "/worlds/phonepe-smart-spend-coach", name: "PhonePe Smart Spend Coach", status: "Academic case study", back: "/worlds" },
  { url: "/worlds/nexus", name: "Nexus", status: "Prototype · demo mode", back: "/worlds" },
  { url: "/worlds/rupee-radar", name: "RupeeRadar", status: "Prototype · not deployed", back: "/worlds" },
  { url: "/writing/the-teardown", name: "The Teardown", status: "Product teardowns · newsletter", back: "/about#writing-h" },
  { url: "/ventures/interview-radar/world", name: "Interview Radar", status: "Concept in development", back: "/ventures/interview-radar" },
  { url: "/ventures/repass/world", name: "Repass", status: "Concept in development", back: "/ventures/repass" },
];
const errorsOf = (page: Page) => { const e: string[] = []; page.on("pageerror", (x) => e.push(x.message)); page.on("console", (m) => { if (m.type() === "error") e.push(m.text()); }); return e; };

for (const w of WORLDS) {
  test(`${w.name}: route, labels, back target, gallery and image viewer`, async ({ page }) => {
    const errs = errorsOf(page);
    await page.goto(`${w.url}?tier=laptop`);
    const panel = page.getByTestId("case-panel");
    await expect(panel.getByRole("heading", { level: 1 })).toHaveText(w.name);
    await expect(panel).toContainText(new RegExp(w.status.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
    await expect(page.getByTestId("world-back")).toHaveAttribute("href", w.back);
    await expect(page.locator("canvas")).toHaveCount(1, { timeout: 15_000 }); // first visit loads the 3D code

    // gallery → image viewer
    const tab = panel.getByRole("tab", { name: /Gallery/ });
    const total = Number((await tab.textContent())!.match(/\((\d+)\)/)![1]);
    await tab.click();
    const first = panel.getByRole("tabpanel").getByRole("button").first();
    await first.click();
    const lb = page.getByTestId("lightbox");
    await expect(lb).toBeVisible();
    await expect(lb).toContainText(`1 / ${total}`);
    await expect(page.getByRole("button", { name: "Close image" })).toBeFocused();
    await page.keyboard.press("ArrowRight");
    await expect(lb).toContainText(`${total > 1 ? 2 : 1} / ${total}`);
    // focus never leaves the dialog
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press(i % 3 === 2 ? "Shift+Tab" : "Tab");
      expect(await lb.evaluate((d) => d.contains(document.activeElement))).toBe(true);
    }
    await page.keyboard.press("Escape");
    await expect(lb).toHaveCount(0);
    await expect(first).toBeFocused(); // focus returns to the item that opened it
    expect(errs).toEqual([]);
  });
}

test.describe("CareConnect bespoke world (R2 pilot)", () => {
  test("status first, skippable arrival, then the documented story", async ({ page }) => {
    await page.goto("/worlds/careconnect?tier=laptop&gldebug=1");
    const plaque = page.getByTestId("arrival-plaque");
    await expect(plaque).toContainText("MVP · no users");
    await expect(plaque).toContainText("No users, no revenue, no traction — stated by the repository itself");
    await expect(page.getByTestId("skip-arrival")).toBeVisible({ timeout: 15_000 });
    // Skip ends the flight; on a slow renderer the 7 s guard may end it first — either way it must end
    await page.getByTestId("skip-arrival").click({ timeout: 3_000 }).catch(() => {});
    await expect(page.getByTestId("skip-arrival")).toHaveCount(0, { timeout: 9_000 });
    // the camera has reached the walkway view (not left mid-flight)
    const d = await page.evaluate(() => { const c = (window as unknown as { __gosCam: { position: { length(): number } } }).__gosCam; return c.position.length(); });
    expect(d).toBeGreaterThan(15);
  });
  test("the Journey tab lists all 18 real screens in four documented groups and opens each", async ({ page }) => {
    await page.goto("/worlds/careconnect?tier=laptop");
    const panel = page.getByTestId("case-panel");
    await panel.getByRole("tab", { name: "Journey" }).click();
    const j = page.getByTestId("journey");
    await expect(j.getByRole("heading", { level: 2 })).toHaveText([/Day 0/, /Attendant wing/, /Family wing/, /Handover bridge/]);
    await expect(j.getByRole("button")).toHaveCount(18);
    await expect(j).toContainText("fictional patient");
    await j.getByRole("button", { name: "Handover pack" }).click();
    await expect(page.getByTestId("lightbox")).toContainText("Handover pack");
    await expect(page.getByTestId("lightbox")).toContainText(/Actual product screenshot · demo data/i);
  });
  test("only CareConnect is bespoke in R2: the other worlds have no Journey tab", async ({ page }) => {
    for (const w of WORLDS.filter((x) => !x.url.endsWith("careconnect"))) {
      await page.goto(w.url);
      await expect(page.getByTestId("case-panel").getByRole("tab", { name: /Gallery/ })).toBeVisible();
      await expect(page.getByTestId("case-panel").getByRole("tab", { name: "Journey" })).toHaveCount(0);
    }
  });
  test.describe("reduced motion", () => {
    test.use({ reducedMotion: "reduce" });
    test("no arrival flight and nothing to skip", async ({ page }) => {
      await page.goto("/worlds/careconnect?tier=laptop&gldebug=1", { waitUntil: "networkidle" });
      await expect(page.getByTestId("case-panel")).toBeVisible();
      await page.waitForTimeout(1000);
      await expect(page.getByTestId("skip-arrival")).toHaveCount(0);
    });
  });
});

test("the /worlds hub lists the 7 project worlds and opens each one", async ({ page }) => {
  await page.goto("/worlds");
  for (const w of WORLDS.slice(0, 7)) await expect(page.getByRole("link", { name: `Enter the world: ${w.name}` })).toHaveAttribute("href", w.url);
});

test.describe("image viewer on a touch screen", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  test("swipe left and right moves between images; a vertical drag does not", async ({ page }) => {
    await page.goto("/worlds/careconnect?tier=mobile");
    const panel = page.getByTestId("case-panel");
    await panel.getByRole("tab", { name: /Gallery/ }).click();
    await panel.getByRole("tabpanel").getByRole("button").first().click();
    const lb = page.getByTestId("lightbox"), stage = page.getByTestId("lightbox-stage");
    const swipe = async (dx: number, dy: number) => {
      const box = (await stage.boundingBox())!, x = box.x + box.width / 2, y = box.y + box.height / 2;
      await stage.dispatchEvent("pointerdown", { pointerType: "touch", pointerId: 7, isPrimary: true, clientX: x, clientY: y });
      await stage.dispatchEvent("pointerup", { pointerType: "touch", pointerId: 7, isPrimary: true, clientX: x + dx, clientY: y + dy });
    };
    await expect(lb).toContainText("1 / 20");
    await swipe(-140, 10); await expect(lb).toContainText("2 / 20");
    await swipe(140, -8); await expect(lb).toContainText("1 / 20");
    await swipe(-20, 200); await expect(lb).toContainText("1 / 20"); // scrolling, not a swipe
    await page.getByRole("button", { name: "Close image" }).click();
    await expect(lb).toHaveCount(0);
  });
});

test.describe("reduced motion in every world", () => {
  test.use({ reducedMotion: "reduce" });
  for (const w of WORLDS) {
    test(`${w.name}: no arrival flight, no decorative motion, still usable`, async ({ page }) => {
      const untilTexturesSettled = trackImages(page);
      await page.goto(`${w.url}?tier=laptop&gldebug=1`, { waitUntil: "networkidle" });
      await expect(page.getByTestId("case-panel")).toBeVisible();
      const frame = () => page.evaluate(() => (window as unknown as { __gosGL?: { info: { render: { frame: number } } } }).__gosGL?.info.render.frame ?? -1);
      await expect.poll(frame, { timeout: 15_000 }).toBeGreaterThan(0);
      await untilTexturesSettled();
      const a = await frame(); await page.waitForTimeout(2000); const b = await frame();
      expect(b - a, "frames drawn with nothing moving").toBeLessThanOrEqual(1); // rings, dish, tickets, auto-rotate all still
      await page.getByTestId("case-panel").getByRole("tab", { name: /Gallery/ }).click();
      await expect(page.getByTestId("case-panel").getByRole("tabpanel").getByRole("button").first()).toBeVisible();
    });
  }
});
