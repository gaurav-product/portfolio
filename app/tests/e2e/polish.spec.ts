import { test, expect, devices } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

/** Final review pass: regressions for the defects found while reviewing the built site. */

test("the 404 shell has a title and readable content before JavaScript, and no developer hint after", async ({ page, browser }) => {
  const html = fs.readFileSync(path.join(process.cwd(), "build/client/404.html"), "utf8");
  expect(html).toMatch(/<title>[^<]+<\/title>/);
  expect(html).toContain("Go to the homepage");
  const logs: string[] = [];
  page.on("console", (m) => logs.push(m.text()));
  await page.goto("/no-such-page");
  await expect(page.getByRole("heading", { name: "This page does not exist." })).toBeVisible();
  await expect(page).toHaveTitle(/not found/i);
  expect(logs.filter((l) => l.includes("HydrateFallback"))).toEqual([]);
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const nojs = await ctx.newPage();
  await nojs.goto("/no-such-page");
  await expect(nojs.getByRole("link", { name: "Go to the homepage" })).toBeVisible();
  await ctx.close();
});

test("phone menu drawer sits above Oz and its backdrop covers the page", async ({ browser }) => {
  const ctx = await browser.newContext({ ...devices["Pixel 7"], reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("/projects/evamastu");
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(page.getByRole("dialog", { name: "Site menu" })).toBeVisible();
  const hit = await page.evaluate(() => {
    const oz = document.querySelector("[data-testid=oz]")!.getBoundingClientRect();
    const atOz = document.elementFromPoint(oz.x + oz.width / 2, oz.y + oz.height / 2);
    const left = document.elementFromPoint(20, innerHeight / 2);
    return { ozOnTop: !!atOz?.closest("[data-testid=oz]"), backdrop: left?.getAttribute("aria-label") };
  });
  expect(hit.ozOnTop).toBe(false);
  expect(hit.backdrop).toBe("Close menu");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Site menu" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
  await ctx.close();
});

test("footer lists each page once, with comfortable link targets", async ({ page }) => {
  await page.goto("/about");
  const links = page.getByRole("navigation", { name: "Footer" }).getByRole("link");
  const hrefs = await links.evaluateAll((a) => a.map((x) => x.getAttribute("href")));
  expect(new Set(hrefs).size).toBe(hrefs.length);
  const minH = await links.evaluateAll((a) => Math.min(...a.map((x) => x.getBoundingClientRect().height)));
  expect(minH).toBeGreaterThanOrEqual(32);
});

test("a study image deleted at its source is replaced by a plain note, not a broken image", async ({ page }) => {
  await page.goto("/research/1");
  await expect(page.locator("[data-missing-image]").first()).toContainText("Image unavailable at its source", { timeout: 15_000 });
  const broken = await page.locator("#study-body img").evaluateAll((i) => (i as HTMLImageElement[]).filter((x) => x.complete && x.naturalWidth === 0).length);
  expect(broken).toBe(0);
});

test("About: evidence section is labelled by its heading and The Teardown is not listed twice", async ({ page }) => {
  await page.goto("/about");
  await expect(page.getByRole("region", { name: "How claims are labelled" })).toBeVisible();
  await expect(page.locator("#writing-h ~ ul li", { hasText: "The Teardown" })).toHaveCount(0);
});

test("Project worlds uses the full page width and status pills fit their text", async ({ page }) => {
  await page.goto("/worlds");
  const grid = await page.getByTestId("world-cards").first().boundingBox();
  expect(grid!.x + grid!.width).toBeGreaterThan(1380);
  const widths = await page.locator("[data-testid=world-cards] li span.rounded-full").evaluateAll((e) => e.map((x) => x.getBoundingClientRect().width));
  for (const w of widths) expect(w).toBeLessThan(260);
});

test("case-study template chips are whole-chip links", async ({ page }) => {
  await page.goto("/case-studies");
  const minH = await page.locator('ul[aria-label^="Template coverage"] a').evaluateAll((a) => Math.min(...a.map((x) => x.getBoundingClientRect().height)));
  expect(minH).toBeGreaterThanOrEqual(24);
});

test("Contact fits a 320px phone: the long email address wraps instead of widening the page", async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 320, height: 720 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto("/contact");
  await expect(page.getByRole("heading", { name: "Direct" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - 320)).toBeLessThanOrEqual(1);
  await ctx.close();
});
