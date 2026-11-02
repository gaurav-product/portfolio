import { test, expect } from "@playwright/test";
import fs from "node:fs";

test("J12 intro film — first visit plays the optimised film, sound toggle, skip, no replay", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) < 1024, "Film autoplays on desktop only");
  await page.goto("/");
  const dialog = page.getByRole("dialog", { name: "Gaurav.OS introduction film" });
  await expect(dialog).toBeVisible();
  const v = page.getByTestId("intro-video");
  const sources = await v.locator("source").evaluateAll((s) => s.map((x) => (x as HTMLSourceElement).getAttribute("src")));
  expect(sources).toEqual(["/media/gaurav-os-intro-av1-1080p.mp4", "/media/gaurav-os-intro-h264-720p.mp4"]);
  await expect.poll(() => v.evaluate((el: HTMLVideoElement) => el.currentTime), { timeout: 15000 }).toBeGreaterThan(0.2);
  const playing = await v.evaluate((el: HTMLVideoElement) => el.currentSrc);
  expect(playing).toMatch(/gaurav-os-intro-(av1-1080p|h264-720p)\.mp4$/);
  await page.getByRole("button", { name: "Turn sound on" }).click();
  await expect(page.getByRole("button", { name: "Turn sound off" })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Skip intro" }).click();
  await expect(dialog).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole("heading", { level: 1, name: "Gaurav Kumar Singh" })).toBeVisible();
  await expect(dialog).toHaveCount(0);
  await page.getByRole("button", { name: /Watch the intro film/ }).click();
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
});

test("J13 reduced motion shows the poster, never the film", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto("/");
  await expect(page.getByRole("dialog", { name: "Gaurav.OS introduction film" })).toHaveCount(0); // no autoplay
  await page.getByRole("button", { name: /Watch the intro film/ }).click();
  await expect(page.getByRole("img", { name: /Final frame/ })).toBeVisible();
  await expect(page.getByTestId("intro-video")).toHaveCount(0);
  await page.getByRole("button", { name: "Enter Gaurav.OS" }).click();
  await ctx.close();
});

test("J14 recruiter mode loads no film, 3D or diagram code", async ({ page }) => {
  const heavy: string[] = [];
  page.on("request", (r) => { if (/\.mp4|Scene-|mermaid|corpus-/.test(r.url())) heavy.push(r.url()); });
  await page.goto("/recruiter");
  await expect(page.getByText("Recruiter Mode · 30-second overview")).toBeVisible();
  await page.waitForLoadState("networkidle");
  expect(heavy).toEqual([]);
});

test("J15 research reading page — full text, contents, assumptions, next study", async ({ page }) => {
  await page.goto("/research/90");
  const text = page.getByTestId("study-text");
  await expect(text.locator("h1")).toContainText("Health in ChatGPT");
  const words = await text.evaluate((el) => el.textContent!.split(/\s+/).length);
  expect(words).toBeGreaterThan(5000);
  await expect(page.getByText(/at commit 60c3c9b/)).toBeVisible();
  if ((page.viewportSize()?.width ?? 0) >= 1024) {
    const first = page.getByRole("navigation", { name: "Contents" }).getByRole("link").first();
    const id = (await first.getAttribute("href"))!.slice(1);
    await first.click();
    await expect(page.locator(`[id="${id}"]`)).toBeInViewport();
  }
  await page.getByRole("tab", { name: "Assumptions" }).click();
  await expect(text).toContainText(/assumption/i);
  await page.getByRole("tab", { name: "Case study" }).click();
  expect(await text.textContent()).not.toMatch(/8127|\+91 ?8/); // owner's phone is redacted
});

test("J16 portrait and RoboGuide", async ({ page }) => {
  await page.goto("/?nointro");
  const portrait = page.getByTestId("portrait").filter({ visible: true });
  await expect(portrait.getByRole("img", { name: "Gaurav Kumar Singh" })).toBeVisible();
  await page.goto("/ask");
  const robo = page.getByTestId("robo-guide");
  await expect(robo).toHaveAttribute("aria-hidden", "true");
  await page.getByLabel("Your question").focus();
  await expect(robo).toHaveAttribute("data-attending", "true");
  await page.getByRole("button", { name: "Send" }).focus();
  await expect(robo).not.toHaveAttribute("data-attending", "true");
});

test("J17 mobile menu — every drawer destination works", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 1440) >= 1440, "Drawer is used below 1440px");
  const targets = ["Home", "About", "Experience", "Projects", "Case Studies", "Product Thinking", "Research", "Product Atlas", "AI Lab", "Contact", "Explore Mode", "Recruiter Mode", "Skills library", "Ask Gaurav"];
  for (const name of targets) {
    await page.goto("/about");
    await page.getByRole("button", { name: "Open menu" }).click();
    const drawer = page.getByRole("dialog", { name: "Site menu" });
    await drawer.getByRole("link", { name, exact: true }).click();
    await expect(drawer).toHaveCount(0);
    await expect(page.locator("h1").first()).toBeVisible();
  }
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Site menu" })).toHaveCount(0);
  const [dl] = await Promise.all([page.waitForEvent("download"), (async () => { await page.getByRole("button", { name: "Open menu" }).click(); await page.getByRole("dialog", { name: "Site menu" }).getByRole("link", { name: "Download CV" }).click(); })()]);
  expect(fs.readFileSync((await dl.path())!).subarray(0, 4).toString()).toBe("%PDF");
});
