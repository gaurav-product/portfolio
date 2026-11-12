import { test, expect, type Page } from "@playwright/test";

/**
 * Wait until a scene's textures have finished arriving before taking a baseline. Worlds load their
 * panel images on a stagger (1.2 s, then every 220 ms) and upload each on its next drawn frame, so the
 * count can sit still for ~2 s between arrivals. Settled = no image request in flight AND the texture
 * count unchanged for 3 s. Call before page.goto (it listens to requests). Fails loudly if it never settles.
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

/** Rendering cost and GPU lifecycle. ?gldebug=1 exposes the renderer's own counters. */
type Info = { frame: number; geometries: number; textures: number };
const info = (page: Page) => page.evaluate(() => {
  const gl = (window as unknown as { __gosGL?: { info: { render: { frame: number }; memory: { geometries: number; textures: number } } } }).__gosGL;
  return gl ? { frame: gl.info.render.frame, geometries: gl.info.memory.geometries, textures: gl.info.memory.textures } : null;
}) as Promise<Info | null>;
const seen = (page: Page) => page.addInitScript(() => localStorage.setItem("gos-universe-intro", "1"));

test.describe("rendering on demand", () => {
  test.use({ reducedMotion: "reduce" });
  test("a still 3D scene stops drawing (reduced motion, no input)", async ({ page }) => {
    await seen(page);
    const untilTexturesSettled = trackImages(page);
    for (const url of ["/universe?at=earth&tier=laptop&gldebug=1", "/worlds/careconnect?tier=laptop&gldebug=1"]) {
      await page.goto(url, { waitUntil: "networkidle" }); // screenshots and textures uploaded: their arrival legitimately draws
      await expect.poll(async () => (await info(page))?.frame ?? 0, { timeout: 15_000 }).toBeGreaterThan(0);
      await untilTexturesSettled();
      const a = (await info(page))!.frame;
      await page.waitForTimeout(2000);
      const b = (await info(page))!.frame;
      expect(b - a, `${url}: frames drawn while idle`).toBeLessThanOrEqual(1);
      // input still draws immediately
      await page.mouse.move(400, 400); await page.mouse.move(420, 410);
      await expect.poll(async () => (await info(page))!.frame).toBeGreaterThan(b);
    }
  });
});

test("decorative motion keeps drawing without reduced motion, but below the display rate once input stops", async ({ page }) => {
  await seen(page);
  await page.goto("/universe?at=earth&tier=laptop&gldebug=1");
  await expect.poll(async () => (await info(page))?.frame ?? 0, { timeout: 15_000 }).toBeGreaterThan(0);
  await page.waitForTimeout(3500); // past the full-rate window after load
  const a = (await info(page))!.frame;
  await page.waitForTimeout(2000);
  const b = (await info(page))!.frame;
  expect(b - a).toBeGreaterThan(5);      // the Earth still turns
  expect(b - a).toBeLessThanOrEqual(70); // ≈30 fps cap over 2 s, not the display rate
});

test("GPU objects stay level while a world is used (no per-render clones)", async ({ page }) => {
  const untilTexturesSettled = trackImages(page);
  await page.goto("/worlds/careconnect?tier=laptop&gldebug=1", { waitUntil: "networkidle" });
  await expect(page.getByTestId("case-panel")).toBeVisible();
  await expect.poll(async () => (await info(page))?.textures ?? 0, { timeout: 15_000 }).toBeGreaterThan(0);
  await untilTexturesSettled(); // baseline only after the staggered screenshots have all arrived
  const before = (await info(page))!;
  const panel = page.getByTestId("case-panel");
  for (let i = 0; i < 3; i++) {
    await panel.getByRole("tab", { name: "Case study" }).click();
    await panel.getByRole("tab", { name: /Gallery/ }).click();
    await panel.getByRole("tabpanel").getByRole("button").first().click();
    await page.keyboard.press("Escape");
    await page.setViewportSize({ width: 1200 + i * 40, height: 860 });
  }
  // rendering is on demand: a leaked texture reaches the GPU (and the counter) only when a frame is drawn,
  // so draw one deliberately, then let anything legitimately in flight settle before reading the counters
  const f0 = (await info(page))!.frame;
  await page.mouse.move(300, 300); await page.mouse.move(330, 320);
  await expect.poll(async () => (await info(page))!.frame).toBeGreaterThan(f0);
  await untilTexturesSettled();
  const after = (await info(page))!;
  expect(after.geometries - before.geometries).toBeLessThanOrEqual(2);
  expect(after.textures - before.textures).toBeLessThanOrEqual(2);
});

test("GPU objects stay level while studies are selected on the Earth", async ({ page }) => {
  test.setTimeout(120_000);
  await seen(page);
  await page.goto("/universe?tier=laptop&gldebug=1&study=1", { waitUntil: "networkidle" });
  await expect(page.getByTestId("study-panel")).toBeVisible();
  // first round: anything drawn for the first time is uploaded once (each category label when it first comes into view)
  for (let i = 0; i < 40; i++) await page.getByTestId("next-study").click();
  await page.waitForTimeout(2000);
  const mid = (await info(page))!;
  // second round of the same action must not add anything: a leak grows with every selection
  for (let i = 0; i < 8; i++) await page.getByTestId("next-study").click();
  await page.waitForTimeout(2000);
  const after = (await info(page))!;
  expect(after.geometries).toBe(mid.geometries);
  // a leak adds a texture per selection (16 here); at most one category label may still be appearing for the first time
  expect(after.textures - mid.textures).toBeLessThanOrEqual(1);
});

test("solar system: planet selection and system ⇄ Earth round trips hold GPU objects and canvas listeners level", async ({ page, context }) => {
  test.setTimeout(180_000);
  await seen(page);
  await page.goto("/universe?tier=laptop&gldebug=1", { waitUntil: "networkidle" });
  await expect.poll(async () => (await info(page))?.frame ?? 0, { timeout: 15_000 }).toBeGreaterThan(0);
  const cdp = await context.newCDPSession(page);
  const canvasListeners = async () => {
    const { result } = await cdp.send("Runtime.evaluate", { expression: "document.querySelector('[data-testid=universe-canvas] canvas')" });
    return (await cdp.send("DOMDebugger.getEventListeners", { objectId: result.objectId! })).listeners.length;
  };
  const stage = (s: string) => expect(page.getByTestId("universe-canvas")).toHaveAttribute("data-stage", s);
  const draw = async () => { const f = (await info(page))!.frame; await page.mouse.move(200, 820); await page.mouse.move(230, 830); await expect.poll(async () => (await info(page))!.frame).toBeGreaterThan(f); };
  const round = async () => {
    for (const s of ["evamastu", "aaroh", "earth", "careconnect", "ghargyaan", "nexus", "phonepe-smart-spend-coach", "rupee-radar"]) await page.getByTestId(`planet-${s}`).click();
    await page.getByTestId("planet-earth").click();
    await page.getByTestId("enter-earth").click(); await stage("earth");
    await page.waitForTimeout(1200);
    await page.getByTestId("to-system").click(); await stage("system");
    await page.waitForTimeout(800);
  };
  // first round uploads everything the Earth and each planet need once
  await round(); await draw(); await page.waitForTimeout(2000); await draw();
  const mid = { ...(await info(page))!, listeners: await canvasListeners() };
  for (let i = 0; i < 3; i++) await round();
  await draw(); await page.waitForTimeout(2000); await draw();
  const after = { ...(await info(page))!, listeners: await canvasListeners() };
  expect(after.geometries).toBe(mid.geometries);
  expect(after.textures).toBe(mid.textures);
  expect(after.listeners, "listeners left on the shared canvas by unmounted views").toBe(mid.listeners);
});
