import { test, expect, type Page } from "@playwright/test";

/** Phase 1 — the signature cursor, context labels, magnetic actions and spotlight. */
const ring = (p: Page) => p.locator(".gos-ring");
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
    await page.goto("/?nointro");
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
    await page.goto("/?nointro");
    await hoverCentre(page, page.getByRole("link", { name: "Explore my work" }));
    await expect(ring(page)).toHaveAttribute("data-state", "tag"); // small target: label beside the pointer, button text stays readable
    expect(await labelText(page)).toBe("Explore");
    await hoverCentre(page, page.getByRole("button", { name: /Watch the intro film/ }));
    expect(await labelText(page)).toBe("Play");
    await hoverCentre(page, page.getByRole("link", { name: "Contact", exact: true }).first());
    await expect(ring(page)).toHaveAttribute("data-state", "hover");

    await page.goto("/projects");
    await hoverCentre(page, page.locator(".chapter-art").first());
    await expect(ring(page)).toHaveAttribute("data-state", "label"); // big target: filled disc
    expect(await labelText(page)).toBe("View");

    await page.goto("/research");
    await hoverCentre(page, page.locator('a[href="/research/1"]').first());
    expect(await labelText(page)).toBe("Open");
  });

  test("DRAG over the 3D Universe, BACK on Back to Earth", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("gos-universe-intro", "1"));
    await page.goto("/universe/careconnect?tier=laptop");
    await expect(page.getByTestId("case-panel")).toBeVisible();
    await page.mouse.move(300, 700, { steps: 4 }); await page.waitForTimeout(200);
    expect(await labelText(page)).toBe("Drag");
    await hoverCentre(page, page.getByTestId("case-panel").getByRole("button", { name: "Back to Earth" }));
    expect(await labelText(page)).toBe("Back");
  });

  test("magnetic: a primary CTA leans towards the pointer, resets on leave, and still clicks", async ({ page }) => {
    await page.goto("/?nointro");
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
    await page.goto("/projects");
    const field = page.getByRole("searchbox", { name: "Search projects" });
    expect(await field.evaluate((el) => getComputedStyle(el).cursor)).not.toBe("none");
    await hoverCentre(page, field);
    await expect(ring(page)).toHaveAttribute("data-state", "native");
    expect(await page.locator(".gos-ring").evaluate((el) => getComputedStyle(el).opacity)).toBe("0");

    await page.goto("/about");
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
    await page.goto("/?nointro");
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
    await page.goto("/?nointro");
    await page.mouse.move(400, 400, { steps: 4 });
    await expect(page.locator("html")).not.toHaveClass(/gos-cursor/);
    expect(await page.locator("body").evaluate((b) => getComputedStyle(b).cursor)).not.toBe("none");
    await ctx.close();
  });
});
