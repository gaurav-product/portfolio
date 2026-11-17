import { test, expect } from "@playwright/test";

/* N1: a tap on "Open menu" before the app's JavaScript has hydrated the page must not be lost.
   The page's JavaScript bundles are held back, so the click lands on the bare prerendered HTML. */
test("Open menu tapped before hydration still opens the drawer once the app is live", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  let release!: () => void;
  const hold = new Promise<void>((r) => { release = r; });
  await page.route(/\/assets\/.*\.js$/, async (route) => { await hold; await route.continue(); });
  await page.goto("/about", { waitUntil: "domcontentloaded" });
  const btn = page.getByRole("button", { name: "Open menu" });
  await btn.click();
  // proof the click happened before hydration: the header has not mounted, no drawer exists yet
  expect(await page.evaluate(() => !!(window as unknown as { __gosMenuReady?: boolean }).__gosMenuReady)).toBe(false);
  await expect(page.getByRole("dialog", { name: "Site menu" })).toHaveCount(0);
  release();
  const drawer = page.getByRole("dialog", { name: "Site menu" });
  await expect(drawer).toBeVisible({ timeout: 15_000 });
  await expect(drawer.getByRole("link", { name: "Solar system in 3D" })).toHaveCount(1);
  await expect(btn).toHaveAttribute("aria-expanded", "true");
  await page.getByRole("button", { name: "Close menu" }).last().click(); // and it still closes normally
  await expect(drawer).toHaveCount(0);
});

/* Same class as N1: focusing the question box on /ask before hydration must still make the RoboGuide attend. */
test("RoboGuide attends to a question box that was focused before hydration", async ({ page }) => {
  let release!: () => void;
  const hold = new Promise<void>((r) => { release = r; });
  await page.route(/\/assets\/.*\.js$/, async (route) => { await hold; await route.continue(); });
  await page.goto("/ask", { waitUntil: "domcontentloaded" });
  await page.getByLabel("Your question").focus();
  release();
  await expect(page.getByTestId("robo-guide")).toHaveAttribute("data-attending", "true", { timeout: 15_000 });
});

/* N2: with storage blocked (some private modes, blocked site data), no uncaught errors, and the site works. */
test("storage blocked: no uncaught errors on load, navigation and Back", async ({ page }) => {
  await page.addInitScript(() => {
    for (const k of ["sessionStorage", "localStorage"]) Object.defineProperty(window, k, { get() { throw new DOMException("The operation is insecure.", "SecurityError"); } });
  });
  const errs: string[] = [];
  page.on("pageerror", (e) => errs.push(e.message));
  page.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
  await page.goto("/?nointro");
  await expect(page.getByRole("heading", { level: 1, name: "Gaurav Singh" })).toBeVisible();
  await page.goto("/projects");
  await expect(page.locator("main h1").first()).toBeVisible();
  await page.goBack();
  await expect(page.getByRole("heading", { level: 1, name: "Gaurav Singh" })).toBeVisible();
  expect(errs).toEqual([]);
});

// Guards that replacing React Router's <ScrollRestoration> script (N2) kept restoration working: Back returns to a
// scrolled position, not the top. (It lands ~408 px short of the original spot — identical with the stock
// component; recorded as N5 in the audit, not asserted here.)
test("scroll position is still restored on Back (normal storage)", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/projects");
  await expect(page.locator("main h1").first()).toBeVisible();
  await page.evaluate(() => scrollTo(0, 1600));
  await expect.poll(() => page.evaluate(() => Math.round(scrollY))).toBe(1600);
  await page.getByRole("link", { name: "Contact", exact: true }).first().click();
  await expect(page).toHaveURL(/\/contact/);
  await page.goBack();
  await expect(page).toHaveURL(/\/projects/);
  await expect.poll(() => page.evaluate(() => Math.round(scrollY)), { timeout: 10_000 }).toBeGreaterThan(800);
});
