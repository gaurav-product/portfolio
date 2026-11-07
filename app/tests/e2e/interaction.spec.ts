import { test, expect, type Page } from "@playwright/test";

/** Phase 1 — the signature cursor, context labels, magnetic actions and spotlight. */
const ring = (p: Page) => p.locator(".gos-ring");
/** Wait until the app has started (hydrated): the cursor engine and the transition listener mount in the
 *  same commit. Before that, links are plain links — a full page load with no transition, by design. */
/** SLOW_JS=<ms> delays every JS module, like a cold, busy CI runner (used to verify the ready() wait). */
const maybeSlow = async (p: Page) => { const ms = Number(process.env.SLOW_JS || 0); if (ms) await p.route("**/assets/*.js", async (r) => { await new Promise((res) => setTimeout(res, ms)); await r.continue(); }); };
const ready = (p: Page) => p.waitForFunction(() => document.documentElement.classList.contains("gos-cursor"), null, { timeout: 15_000 });
const labelText = (p: Page) => p.locator(".gos-label").textContent();
async function hoverCentre(p: Page, sel: ReturnType<Page["locator"]>) {
  await sel.scrollIntoViewIfNeeded();
  const b = (await sel.boundingBox())!;
  await p.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 4 });
  await p.waitForTimeout(150);
}

test.describe("desktop (fine pointer)", () => {
  test("cursor starts, follows the pointer and never takes pointer events", async ({ page }) => {
    const errs: string[] = []; page.on("pageerror", (e) => errs.push(e.message));
    await page.goto("/?nointro"); await ready(page);
    await expect(page.locator("html")).toHaveClass(/gos-cursor/);
    await page.mouse.move(300, 300); await page.mouse.move(420, 360, { steps: 5 });
    await expect(page.locator("html")).toHaveClass(/gos-cursor-visible/);
    for (const c of [".gos-dot", ".gos-ring", ".gos-spot"]) {
      const s = await page.locator(c).evaluate((el) => ({ pe: getComputedStyle(el).pointerEvents, hidden: el.getAttribute("aria-hidden") }));
      expect(s).toEqual({ pe: "none", hidden: "true" });
    }
    const t = await page.locator(".gos-dot").evaluate((el) => el.style.transform);
    expect(t).toContain("420px, 360px");
    expect(await page.locator("body").evaluate((b) => getComputedStyle(b).cursor)).toBe("none");
    expect(errs).toEqual([]);
  });

  test("context labels: EXPLORE on the Universe CTA, VIEW on project art, OPEN on studies, PLAY on the film", async ({ page }) => {
    await page.goto("/?nointro"); await ready(page);
    await hoverCentre(page, page.getByRole("link", { name: "Explore my work" }));
    await expect(ring(page)).toHaveAttribute("data-state", "tag"); // small target: label beside the pointer, button text stays readable
    expect(await labelText(page)).toBe("Explore");
    await hoverCentre(page, page.getByRole("button", { name: /Watch the intro film/ }));
    expect(await labelText(page)).toBe("Play");
    await hoverCentre(page, page.getByRole("link", { name: "Contact", exact: true }).first());
    await expect(ring(page)).toHaveAttribute("data-state", "hover");

    await page.goto("/projects"); await ready(page);
    await hoverCentre(page, page.locator(".chapter-art").first());
    await expect(ring(page)).toHaveAttribute("data-state", "label"); // big target: filled disc
    expect(await labelText(page)).toBe("View");

    await page.goto("/research"); await ready(page);
    await hoverCentre(page, page.locator('a[href="/research/1"]').first());
    expect(await labelText(page)).toBe("Open");
  });

  test("DRAG over the 3D Universe, BACK on Back to Earth", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("gos-universe-intro", "1"));
    await page.goto("/universe/careconnect?tier=laptop"); await ready(page);
    await expect(page.getByTestId("case-panel")).toBeVisible();
    await page.mouse.move(300, 700, { steps: 4 }); await page.waitForTimeout(200);
    expect(await labelText(page)).toBe("Drag");
    await hoverCentre(page, page.getByTestId("case-panel").getByRole("button", { name: "Back to Earth" }));
    expect(await labelText(page)).toBe("Back");
  });

  test("magnetic: a primary CTA leans towards the pointer, resets on leave, and still clicks", async ({ page }) => {
    await page.goto("/?nointro"); await ready(page);
    const cta = page.getByRole("link", { name: "Explore my work" });
    await expect(cta).toHaveAttribute("data-magnetic", "");
    const b = (await cta.boundingBox())!;
    await page.mouse.move(b.x + b.width - 6, b.y + b.height / 2, { steps: 4 });
    await expect.poll(() => cta.evaluate((el) => el.style.translate)).toMatch(/^[1-9]/);
    const px = parseFloat(await cta.evaluate((el) => el.style.translate));
    expect(px).toBeLessThanOrEqual(6);
    await page.mouse.move(b.x + b.width / 2, b.y - 160, { steps: 4 });
    await expect.poll(() => cta.evaluate((el) => el.style.translate)).toBe("");
    await cta.click();
    await expect(page).toHaveURL(/\/universe$/);
  });

  test("text fields and text selection keep the native cursor", async ({ page }) => {
    await page.goto("/projects"); await ready(page);
    const field = page.getByRole("searchbox", { name: "Search projects" });
    expect(await field.evaluate((el) => getComputedStyle(el).cursor)).not.toBe("none");
    await hoverCentre(page, field);
    await expect(ring(page)).toHaveAttribute("data-state", "native");
    expect(await page.locator(".gos-ring").evaluate((el) => getComputedStyle(el).opacity)).toBe("0");

    await page.goto("/about"); await ready(page);
    const para = page.locator("main p").filter({ hasText: /./ }).nth(2);
    const pb = (await para.boundingBox())!;
    await page.mouse.move(pb.x + 4, pb.y + pb.height / 2);
    await page.mouse.down(); await page.mouse.move(pb.x + Math.min(240, pb.width - 4), pb.y + pb.height / 2, { steps: 6 });
    await expect(page.locator("html")).toHaveClass(/gos-selecting/);
    expect(await page.locator("body").evaluate((b) => getComputedStyle(b).cursor)).toBe("text");
    await page.mouse.up();
    await expect(page.locator("html")).not.toHaveClass(/gos-selecting/);
  });

  test("keyboard navigation and focus are unaffected", async ({ page }) => {
    await page.goto("/?nointro"); await ready(page);
    await page.keyboard.press("Tab"); // skip link
    await page.keyboard.press("Tab");
    const focused = await page.evaluate(() => document.activeElement?.getAttribute("aria-label") ?? document.activeElement?.textContent);
    expect(focused).toBeTruthy();
    await page.getByRole("link", { name: "Explore my work" }).focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/universe$/);
  });
});

test.describe("touch and reduced motion keep the native cursor", () => {
  test.describe("touch", () => {
    test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
    test("no custom cursor on a touch screen", async ({ page }) => {
      await page.goto("/?nointro");
      await page.getByRole("link", { name: "Explore my work" }).tap();
      await expect(page).toHaveURL(/\/universe$/);
      await expect(page.locator("html")).not.toHaveClass(/gos-cursor/);
      expect(await page.locator(".gos-ring").evaluate((el) => getComputedStyle(el).opacity)).toBe("0");
    });
  });
  test("reduced motion", async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: "reduce", baseURL: "http://127.0.0.1:4173" });
    const page = await ctx.newPage();
    await page.goto("/?nointro", { waitUntil: "networkidle" });
    await page.mouse.move(400, 400, { steps: 4 });
    await expect(page.locator("html")).not.toHaveClass(/gos-cursor/);
    expect(await page.locator("body").evaluate((b) => getComputedStyle(b).cursor)).not.toBe("none");
    await ctx.close();
  });
});

/* ------------------------------------------------------------------ Phase 2 */
const countTransitions = () => {
  const w = window as unknown as { __vt: number; __vtDone: number; __vtFlags: string[] }; w.__vt = 0; w.__vtDone = 0; w.__vtFlags = [];
  const d = document as Document & { startViewTransition?: (cb: () => unknown) => { finished: Promise<unknown> } };
  const orig = d.startViewTransition?.bind(d);
  if (orig) d.startViewTransition = (cb: () => unknown) => { w.__vt++; const t = orig(cb); t.finished.finally(() => { w.__vtDone++; }); return t; };
  // record every value the reveal flag takes, however briefly (the observer attaches once <html> exists)
  const watch = () => new MutationObserver(() => { const v = document.documentElement.dataset.vt; if (v) w.__vtFlags.push(v); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ["data-vt"] });
  if (document.documentElement) watch(); else { const t = setInterval(() => { if (document.documentElement) { clearInterval(t); watch(); } }, 1); }
};
const vtCount = (p: Page) => p.evaluate(() => (window as unknown as { __vt: number }).__vt);
const rot = (p: Page, sel: ReturnType<Page["locator"]>) => sel.evaluate((el) => ({ rx: parseFloat(el.style.getPropertyValue("--rx") || "0"), ry: parseFloat(el.style.getPropertyValue("--ry") || "0"), tilting: el.classList.contains("is-tilting") }));

test.describe("Phase 2 — tilt cards", () => {
  test("a project card tilts towards the pointer within 5°, lights up, and springs back", async ({ page }) => {
    await maybeSlow(page);
    await page.goto("/?nointro"); await ready(page);
    const card = page.locator("article[data-tilt]").first();
    await card.scrollIntoViewIfNeeded();
    const b = (await card.boundingBox())!;
    await page.mouse.move(b.x + b.width * 0.9, b.y + b.height * 0.1, { steps: 6 }); // top-right corner
    await expect.poll(async () => (await rot(page, card)).tilting).toBe(true);
    const r = await rot(page, card);
    expect(r.ry).toBeGreaterThan(2); expect(r.rx).toBeGreaterThan(2); // leans right and back, towards the pointer
    expect(Math.abs(r.rx)).toBeLessThanOrEqual(5); expect(Math.abs(r.ry)).toBeLessThanOrEqual(5);
    await expect.poll(() => card.evaluate((el) => Number(getComputedStyle(el, "::before").opacity))).toBeGreaterThan(0.5); // light fades in over .45 s
    await page.mouse.move(b.x + b.width / 2, b.y - 200, { steps: 6 });
    await expect.poll(async () => (await rot(page, card)).tilting).toBe(false);
    expect(await rot(page, card)).toEqual({ rx: 0, ry: 0, tilting: false });
    // still a normal link
    await card.getByRole("link").first().click();
    await expect(page).toHaveURL(/\/projects\/[a-z0-9-]+$/);
  });

  test("chapter art and study cards tilt; layout does not move", async ({ page }) => {
    await page.goto("/research"); await ready(page);
    const card = page.locator('a[href="/research/5"]');
    await card.scrollIntoViewIfNeeded();
    const before = (await card.boundingBox())!;
    await page.mouse.move(before.x + 10, before.y + before.height - 10, { steps: 6 });
    await expect.poll(async () => (await rot(page, card)).tilting).toBe(true);
    const next = page.locator('a[href="/research/6"]');
    const nb = (await next.boundingBox())!;
    await page.mouse.move(before.x + 10, before.y + before.height - 12);
    expect((await next.boundingBox())!.y).toBe(nb.y); // neighbours never shift
  });

  test.describe("touch", () => {
    test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
    test("no tilt on touch", async ({ page }) => {
      await page.goto("/?nointro");
      const card = page.locator("article[data-tilt]").first();
      await card.scrollIntoViewIfNeeded();
      await card.tap({ position: { x: 20, y: 20 } }).catch(() => {});
      expect((await rot(page, card)).tilting).toBe(false);
    });
  });
  test("no tilt with reduced motion", async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: "reduce", baseURL: "http://127.0.0.1:4173" });
    const page = await ctx.newPage(); await page.goto("/?nointro", { waitUntil: "networkidle" });
    const card = page.locator("article[data-tilt]").first(); await card.scrollIntoViewIfNeeded();
    const b = (await card.boundingBox())!; await page.mouse.move(b.x + 20, b.y + 20, { steps: 4 }); await page.waitForTimeout(200);
    expect((await rot(page, card)).tilting).toBe(false);
    await ctx.close();
  });
});

test.describe("Phase 2 — page transitions", () => {
  test("internal links animate; Back, Forward and direct URLs still work", async ({ page }) => {
    await page.addInitScript(countTransitions);
    await page.goto("/about"); await ready(page);
    await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Experience" }).click();
    await expect(page).toHaveURL(/\/experience$/);
    await expect(page.locator("h1").first()).toBeVisible();
    await expect.poll(() => vtCount(page)).toBe(1); // the router updates the URL first, then starts the transition
    await page.goBack(); await expect(page).toHaveURL(/\/about$/);
    await page.goForward(); await expect(page).toHaveURL(/\/experience$/);
    await page.goto("/research/12"); await expect(page.locator("h1").first()).toBeVisible(); // direct URL
  });

  test("entering the Universe uses the circular reveal", async ({ page }) => {
    // CPU_THROTTLE=6 reproduces a slow CI runner (CDP CPU throttling)
    await maybeSlow(page);
    if (process.env.CPU_THROTTLE) { const cdp = await page.context().newCDPSession(page); await cdp.send("Emulation.setCPUThrottlingRate", { rate: Number(process.env.CPU_THROTTLE) }); }
    await page.addInitScript(countTransitions);
    await page.goto("/?nointro"); await ready(page);
    await page.getByRole("link", { name: "Explore my work" }).click();
    await expect(page).toHaveURL(/\/universe$/);
    // 1. the reveal flag was applied (recorded when set, so the check cannot be too late)
    await expect.poll(() => page.evaluate(() => (window as unknown as { __vtFlags: string[] }).__vtFlags)).toContain("reveal");
    // 2. the browser's own transition started and finished
    await expect.poll(() => vtCount(page)).toBe(1);
    await expect.poll(() => page.evaluate(() => (window as unknown as { __vtDone: number }).__vtDone), { timeout: 10_000 }).toBeGreaterThanOrEqual(1);
    // 3. only then is the flag cleared
    await expect.poll(() => page.evaluate(() => document.documentElement.dataset.vt ?? null)).toBeNull();
  });

  test("leaves new-tab clicks, same-page anchors and downloads alone", async ({ page, context }) => {
    await page.addInitScript(countTransitions);
    await page.goto("/projects"); await ready(page);
    await page.getByRole("link", { name: "Emerging Ventures" }).first().click(); // #hash on the same page
    await expect(page).toHaveURL(/\/projects#emerging-ventures$/);
    const [popup] = await Promise.all([context.waitForEvent("page"), page.getByRole("link", { name: "Read the case study: CareConnect" }).click({ modifiers: ["ControlOrMeta"] })]);
    await popup.close();
    await expect(page).toHaveURL(/\/projects#emerging-ventures$/);
    expect(await vtCount(page)).toBe(0);
  });

  test("rapid clicks never get stuck: the last navigation wins and no overlay remains", async ({ page }) => {
    await page.addInitScript(countTransitions);
    await page.goto("/about"); await ready(page);
    const nav = page.getByRole("navigation", { name: "Primary" });
    await nav.getByRole("link", { name: "Experience" }).click({ noWaitAfter: true });
    await nav.getByRole("link", { name: "Research" }).click({ noWaitAfter: true });
    await nav.getByRole("link", { name: "Contact" }).click();
    await expect(page).toHaveURL(/\/contact$/);
    await expect(page.locator("h1").first()).toBeVisible();
    await page.getByRole("link", { name: "Gaurav.OS — home" }).click(); // still interactive afterwards
    await expect(page).toHaveURL(/\/$/);
  });

  test("browsers without View Transitions (e.g. Firefox) navigate normally", async ({ page }) => {
    await page.addInitScript(() => { delete (Document.prototype as unknown as Record<string, unknown>).startViewTransition; delete (document as unknown as Record<string, unknown>).startViewTransition; });
    await page.goto("/about", { waitUntil: "networkidle" });
    expect(await page.evaluate(() => "startViewTransition" in document)).toBe(false);
    await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Projects" }).click();
    await expect(page).toHaveURL(/\/projects$/);
    expect(await page.evaluate(() => document.documentElement.dataset.vt ?? null)).toBeNull();
  });

  test("reduced motion: no transition", async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: "reduce", baseURL: "http://127.0.0.1:4173" });
    const page = await ctx.newPage(); await page.addInitScript(countTransitions);
    await page.goto("/about", { waitUntil: "networkidle" });
    await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Projects" }).click();
    await expect(page).toHaveURL(/\/projects$/);
    expect(await vtCount(page)).toBe(0);
    await ctx.close();
  });
});
