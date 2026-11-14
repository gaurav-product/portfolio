import { test, expect } from "@playwright/test";
import fs from "node:fs";

const FILM_RE = /\/media\/gaurav-os-intro-45s\.mp4$/;

test("J12 intro film — inline 9:16 player, nothing loads before play, the CTA plays it with sound", async ({ page }) => {
  const filmRequests: string[] = [];
  page.on("request", (r) => { if (FILM_RE.test(new URL(r.url()).pathname)) filmRequests.push(r.url()); });
  const errs: string[] = [];
  page.on("pageerror", (e) => errs.push(e.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Gaurav Singh" })).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(0); // never opens by itself
  const v = page.getByTestId("intro-video");
  await expect(v).toHaveAccessibleName("Gaurav.OS introduction film, 0:45");
  expect(await v.evaluate((el: HTMLVideoElement) => ({ controls: el.controls, inline: el.playsInline, preload: el.preload, autoplay: el.autoplay, paused: el.paused, poster: new URL(el.poster).pathname, src: el.querySelector("source")!.getAttribute("src") })))
    .toEqual({ controls: true, inline: true, preload: "none", autoplay: false, paused: true, poster: "/media/gaurav-os-intro-45s-poster.webp", src: "/media/gaurav-os-intro-45s.mp4" });
  // 9:16 frame reserved before any media loads (no layout shift), never cropped
  const box = await v.boundingBox();
  expect(Math.abs(box!.width / box!.height - 9 / 16)).toBeLessThan(0.01);
  expect(await v.evaluate((el) => getComputedStyle(el).objectFit)).toBe("contain");
  const poster = await page.request.get("/media/gaurav-os-intro-45s-poster.webp");
  expect(poster.status()).toBe(200);
  expect(poster.headers()["content-type"]).toContain("image/webp");
  await page.waitForTimeout(1500);
  expect(filmRequests).toEqual([]); // the 22 MB film is not fetched until someone presses play

  const cta = page.locator('section[aria-labelledby="hero-title"]').getByRole("button", { name: "Watch the intro film · 0:45" });
  await expect(cta).toBeVisible();
  await cta.click();
  await expect.poll(() => v.evaluate((el: HTMLVideoElement) => el.currentTime), { timeout: 15000 }).toBeGreaterThan(0.2);
  expect(await v.evaluate((el: HTMLVideoElement) => ({ muted: el.muted, w: el.videoWidth, h: el.videoHeight, d: Math.round(el.duration) }))).toEqual({ muted: false, w: 1080, h: 1920, d: 45 });
  expect(filmRequests.length).toBeGreaterThan(0);
  await expect(v).toBeInViewport();
  await expect(v).toBeFocused(); // keyboard users land on the player and its native controls
  await v.evaluate((el: HTMLVideoElement) => el.pause());
  // the closing CTA reaches the same film
  await page.getByRole("button", { name: "Intro film · 0:45", exact: true }).click();
  await expect.poll(() => v.evaluate((el: HTMLVideoElement) => el.paused)).toBe(false);
  expect(errs).toEqual([]);
});

test("J13 reduced motion: the film never starts by itself, and still plays on request", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const filmRequests: string[] = [];
  page.on("request", (r) => { if (FILM_RE.test(new URL(r.url()).pathname)) filmRequests.push(r.url()); });
  await page.goto("/");
  await expect(page.getByRole("dialog")).toHaveCount(0); // no autoplay
  const v = page.getByTestId("intro-video");
  await page.waitForTimeout(1500);
  expect(await v.evaluate((el: HTMLVideoElement) => el.paused)).toBe(true);
  expect(filmRequests).toEqual([]);
  await page.getByRole("button", { name: /Watch the intro film/ }).click();
  await expect.poll(() => v.evaluate((el: HTMLVideoElement) => el.currentTime), { timeout: 15000 }).toBeGreaterThan(0.2);
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
  // the study's own title renders one level down (the page owns the single h1); the text is unchanged
  await expect(text.locator('[data-l="1"]').first()).toContainText("Health in ChatGPT");
  await expect(page.locator("h1")).toHaveCount(1);
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
  await expect(portrait.getByRole("img", { name: "Gaurav Singh" })).toBeVisible();
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
  const targets = ["Home", "About", "Experience", "Projects", "Case Studies", "Product Thinking", "Research", "Product Atlas", "AI Lab", "Contact", "Project Worlds", "Emerging Ventures", "Recruiter Mode", "Skills library", "Ask Gaurav"];
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
