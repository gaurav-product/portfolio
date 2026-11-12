import { test, expect, devices, type Page } from "@playwright/test";

/** Pre-launch pass: the solar system, the PhonePe tower, the world tour, the operating loop, skills, newsletter, certifications. */
const noErrors = (page: Page) => { const errs: string[] = []; page.on("pageerror", (e) => errs.push(e.message)); page.on("console", (m) => m.type() === "error" && errs.push(m.text())); return errs; };
const seen = (page: Page) => page.addInitScript(() => { try { localStorage.setItem("gos-universe-intro", "1"); } catch { /* ignore */ } });
const PROJECTS = ["evamastu", "aaroh", "careconnect", "ghargyaan", "nexus", "phonepe-smart-spend-coach", "rupee-radar"];

test.describe("solar system", () => {
  test("opens on the system: the Sun, the Earth and the seven project planets, in orbit order", async ({ page }) => {
    const errs = noErrors(page);
    await seen(page);
    await page.goto("/universe?tier=laptop");
    await expect(page.getByTestId("universe-canvas")).toHaveAttribute("data-stage", "system");
    const list = page.getByTestId("planet-list").getByRole("button");
    await expect(list).toHaveCount(8);
    await expect(list.nth(2)).toContainText("Earth");
    await expect(page.getByTestId("system-hint")).toBeVisible({ timeout: 20_000 });
    expect(errs).toEqual([]);
  });

  test("every project planet opens its own panel, 3D world and case study", async ({ page }) => {
    await seen(page);
    await page.goto("/universe?tier=laptop");
    for (const slug of PROJECTS) {
      await page.getByTestId(`planet-${slug}`).click();
      const panel = page.getByTestId("planet-panel");
      await expect(panel).toHaveAttribute("data-planet", slug);
      await expect(page).toHaveURL(new RegExp(`planet=${slug}`));
      await expect(panel.getByTestId("enter-world")).toHaveAttribute("href", `/worlds/${slug}`);
      await expect(panel.getByTestId("read-case")).toHaveAttribute("href", `/projects/${slug}`);
    }
    await page.getByTestId("enter-world").click();
    await expect(page).toHaveURL(/\/worlds\/rupee-radar$/);
    await expect(page.getByTestId("case-panel")).toBeVisible();
  });

  test("the Earth holds the 90 case studies; the way back returns to the system", async ({ page }) => {
    await seen(page);
    await page.goto("/universe?tier=laptop");
    await page.getByTestId("planet-earth").click();
    await expect(page.getByTestId("planet-panel")).toContainText("90");
    await page.getByTestId("enter-earth").click();
    await expect(page).toHaveURL(/at=earth/);
    await expect(page.getByTestId("universe-canvas")).toHaveAttribute("data-stage", "earth");
    await page.getByTestId("studies-toggle").click();
    await expect(page.getByTestId("study-list").getByRole("button")).toHaveCount(90);
    await page.getByTestId("to-system").click();
    await expect(page).toHaveURL(/planet=earth/);
    await expect(page.getByTestId("universe-canvas")).toHaveAttribute("data-stage", "system");
  });

  test("keyboard: brackets step through planets, Escape closes; Back and Forward follow the URL", async ({ page }) => {
    await seen(page);
    await page.goto("/universe?tier=laptop");
    await page.getByTestId("universe-canvas").focus();
    await page.keyboard.press("]");
    await expect(page).toHaveURL(/planet=evamastu/);
    await expect(page.getByTestId("planet-panel").getByRole("heading", { level: 2 })).toBeFocused();
    await page.getByTestId("next-planet").click();
    await expect(page).toHaveURL(/planet=aaroh/);
    await page.goBack();
    await expect(page).toHaveURL(/planet=evamastu/);
    await page.goForward();
    await expect(page).toHaveURL(/planet=aaroh/);
    await page.getByTestId("universe-canvas").focus();
    await page.keyboard.press("Escape");
    await expect(page.getByTestId("planet-panel")).toHaveCount(0);
  });

  test("without WebGL: the whole system as a page, and the Earth's list reaches every study", async ({ page }) => {
    await page.addInitScript(() => {
      const orig = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, ...rest: unknown[]) {
        if (/webgl/.test(type)) return null;
        return (orig as (...a: unknown[]) => unknown).call(this, type, ...rest);
      } as typeof orig;
    });
    await page.goto("/universe");
    await expect(page.locator("canvas")).toHaveCount(0);
    await expect(page.getByRole("heading", { level: 1, name: "The Gaurav.OS solar system" })).toBeVisible();
    await expect(page.getByTestId("system-2d-planet")).toHaveCount(8);
    await page.getByRole("button", { name: "Browse the 90 case studies" }).click();
    await expect(page.getByTestId("study-list").getByRole("button")).toHaveCount(90);
  });

  test("phone: planet strip and bottom-sheet panel, nothing overflows", async ({ browser }) => {
    const ctx = await browser.newContext({ ...devices["Pixel 7"], baseURL: "http://127.0.0.1:4173" });
    const page = await ctx.newPage();
    await seen(page);
    await page.goto("/universe?tier=mobile");
    await page.getByTestId("planet-nexus").click();
    const box = await page.getByTestId("planet-panel").boundingBox();
    const vp = page.viewportSize()!;
    expect(box!.y + box!.height).toBeLessThanOrEqual(vp.height + 1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    await ctx.close();
  });
});

test.describe("project worlds", () => {
  test("PhonePe tower: each of its seven floors opens that case-study section (clicked in 3D)", async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce", baseURL: "http://127.0.0.1:4173" });
    const page = await ctx.newPage();
    await page.goto("/worlds/phonepe-smart-spend-coach?tier=laptop&gldebug=1");
    await expect(page.getByTestId("title-card")).toHaveCount(0, { timeout: 30_000 });
    const FLOORS = [[1.0, 1.0], [2.25, 0.85], [3.35, 1.05], [4.65, 0.8], [5.7, 0.95], [6.9, 0.85], [8.0, 1.0]];
    const KEYS = ["summary", "segments", "prototype", "prd", "prioritization", "tradeoffs", "experimentation"];
    for (let i = 0; i < 7; i++) {
      const y = (FLOORS[i][0] + FLOORS[i][1] / 2) * 0.8; // the tower is drawn at 0.8 scale
      const pt = await page.evaluate((y) => {
        const cam = (window as unknown as { __gosCam: { updateMatrixWorld(): void; matrixWorldInverse: { elements: number[] }; projectionMatrix: { elements: number[] } } }).__gosCam; cam.updateMatrixWorld();
        const mul = (m: number[], a: number[]) => [0, 1, 2, 3].map((r) => m[r] * a[0] + m[4 + r] * a[1] + m[8 + r] * a[2] + m[12 + r] * a[3]);
        const c = mul(cam.projectionMatrix.elements, mul(cam.matrixWorldInverse.elements, [0, y, 1.2, 1]));
        const r = document.querySelector("[data-testid=universe-canvas] canvas")!.getBoundingClientRect();
        return { x: r.left + ((c[0] / c[3] + 1) / 2) * r.width, y: r.top + ((1 - c[1] / c[3]) / 2) * r.height };
      }, y);
      await page.mouse.click(pt.x, pt.y);
      await expect.poll(() => page.evaluate(() => document.activeElement?.closest("section")?.id ?? null)).toBe(`cs-${KEYS[i]}`);
    }
    await ctx.close();
  });

  test("the seven project worlds form a tour: Previous / Next without returning to the hub", async ({ page }) => {
    await page.goto("/worlds/evamastu?view=2d");
    await page.getByTestId("next-world").click();
    await expect(page).toHaveURL(/\/worlds\/aaroh$/);
    await page.getByTestId("prev-world").click();
    await expect(page).toHaveURL(/\/worlds\/evamastu$/);
    await page.getByTestId("prev-world").click();
    await expect(page).toHaveURL(/\/worlds\/rupee-radar$/); // wraps
  });
});

test.describe("pages", () => {
  test("operating loop: the ring is the control and changes with the stage", async ({ page }) => {
    await page.goto("/product-thinking");
    const ring = page.getByTestId("loop-ring");
    await expect(ring).toHaveAttribute("data-stage", "lp1");
    await ring.getByRole("tab", { name: "Measure" }).click();
    await expect(ring).toHaveAttribute("data-stage", "lp6");
    await expect(page.getByTestId("loop-panel")).toContainText("Stage 6 of 8");
    await ring.getByRole("tab", { name: "Measure" }).press("End");
    await expect(ring).toHaveAttribute("data-stage", "lp8");
    await expect(ring.getByRole("tab", { name: "Iterate" })).toBeFocused();
    // the old static picture of the loop is gone
    await expect(page.locator('img[src*="section-operating-loop"]')).toHaveCount(0);
  });

  test("skills: domains filter, and every card says how the skill was used", async ({ page }) => {
    const errs = noErrors(page);
    await page.goto("/skills");
    await page.getByTestId("skill-domains").getByRole("button", { name: /Healthcare product safety/ }).click();
    await expect(page).toHaveURL(/domain=health-safety/);
    const cards = page.getByTestId("skill-card");
    expect(await cards.count()).toBeGreaterThan(0);
    await cards.first().getByTestId("skill-how").click();
    await expect(cards.first().getByTestId("skill-how")).toHaveAttribute("aria-expanded", "true");
    await expect(cards.first().locator('a[href^="/projects/"], a[href^="/experience/"], a[href="/research"]').first()).toBeVisible();
    // "Shown in": pick the first real project or role offered (options come from the evidence itself)
    const first = await page.getByTestId("skill-source").locator("option").nth(1).getAttribute("value");
    await page.getByTestId("skill-source").selectOption(first!);
    await expect(page).toHaveURL(new RegExp(`source=${encodeURIComponent(first!)}`));
    for (const c of await cards.all()) await expect(c.getByTestId("skill-how")).toHaveAttribute("aria-expanded", "true"); // opened to show that evidence
    expect(errs).toEqual([]);
  });

  test("newsletter: a dated, self-reported snapshot with its source — never presented as live", async ({ page }) => {
    await page.goto("/about");
    const n = page.getByTestId("newsletter").first();
    await expect(n.getByTestId("newsletter-stats")).toContainText("806");
    await expect(n.getByTestId("newsletter-stats")).toContainText("+7");
    await expect(n.getByTestId("newsletter-source")).toContainText("10 Nov 2026");
    await expect(n.getByTestId("newsletter-source")).toContainText("Self-reported");
    await expect(n.getByTestId("newsletter-source")).toContainText("not a live feed");
    await expect(n.getByRole("link", { name: /Read the 10 editions/ })).toHaveAttribute("href", /linkedin\.com\/newsletters\//);
  });

  test("certifications: summary from the supplied data; undated ones say so", async ({ page }) => {
    await page.goto("/about");
    await expect(page.getByTestId("cert-summary")).toContainText("17 certificates");
    await expect(page.getByTestId("cert-summary")).toContainText("3 without a stated date");
    await expect(page.locator("#certifications").getByText("Date not stated")).toHaveCount(3);
  });
});

test.describe("project-world tour boundaries", () => {
  test("first and last worlds: Previous and Next name where they go, wrap round, and follow the planet order", async ({ page }) => {
    await page.goto("/worlds/rupee-radar?view=2d");
    const tour = page.getByTestId("world-tour");
    await expect(tour).toContainText("7/7");
    await expect(page.getByTestId("next-world")).toHaveAttribute("aria-label", "Next world: Evamastu");
    await expect(page.getByTestId("prev-world")).toHaveAttribute("aria-label", "Previous world: PhonePe Smart Spend Coach");
    await page.getByTestId("next-world").click();
    await expect(page).toHaveURL(/\/worlds\/evamastu$/);
    await expect(page.getByTestId("world-tour")).toContainText("1/7");
    await expect(page.getByTestId("prev-world")).toHaveAttribute("aria-label", "Previous world: RupeeRadar");
    // the tour walks the same order as the solar system's planets (Nexus before PhonePe)
    await page.goto("/worlds/nexus?view=2d");
    await expect(page.getByTestId("next-world")).toHaveAttribute("href", "/worlds/phonepe-smart-spend-coach");
  });
});
