import { test, expect, type Page, type BrowserContext } from "@playwright/test";

/* The full-screen introduction (IntroGate). Browsers under automation skip it (navigator.webdriver), so these
   tests present themselves as an ordinary visitor's browser, in fresh contexts (= a fresh private window). */
const asVisitor = (ctx: BrowserContext | Page) => ctx.addInitScript(() => Object.defineProperty(Navigator.prototype, "webdriver", { get: () => false }));
/** A browser that refuses autoplay (as many do, e.g. iOS Low Power Mode): play() is rejected unless it follows a tap. */
const refuseAutoplay = (ctx: BrowserContext | Page) => ctx.addInitScript(() => {
  const play = HTMLMediaElement.prototype.play; let tapped = false;
  addEventListener("pointerdown", () => { tapped = true; }, true); addEventListener("keydown", () => { tapped = true; }, true);
  HTMLMediaElement.prototype.play = function () { return tapped ? play.call(this) : Promise.reject(new DOMException("blocked", "NotAllowedError")); };
});
const FILM = /\/media\/gaurav-os-intro-45s\.mp4$/;
const POSTER = "/media/gaurav-os-intro-45s-poster.jpg";
const state = (page: Page) => page.evaluate(() => document.documentElement.getAttribute("data-intro"));
const media = (page: Page) => page.getByTestId("intro-gate-video").evaluate((el: HTMLVideoElement) => ({ paused: el.paused, muted: el.muted, t: el.currentTime, controls: el.controls }));

test.describe("full-screen introduction", () => {
  test("fresh visit: the introduction comes first, starts muted with Enable sound; sound on; the end opens the portfolio; refresh, navigation and Back never repeat it", async ({ page }) => {
    await asVisitor(page);
    const errs: string[] = []; page.on("pageerror", (e) => errs.push(e.message));
    await page.goto("/");
    const gate = page.getByTestId("intro-gate");
    await expect(gate).toBeVisible();
    await expect(gate).toHaveAttribute("role", "dialog");
    await expect(page.locator("main h1").first()).toBeHidden(); // the portfolio is in the page, out of sight until entered
    const v = page.getByTestId("intro-gate-video");
    expect(await v.evaluate((el: HTMLVideoElement) => ({ poster: new URL(el.poster).pathname, inline: el.playsInline, fit: getComputedStyle(el).objectFit }))).toEqual({ poster: POSTER, inline: true, fit: "contain" });
    const box = (await v.boundingBox())!;
    expect(Math.abs(box.width / box.height - 9 / 16)).toBeLessThan(0.01); // whole 9:16 frame, never cropped
    expect(box.width).toBeLessThanOrEqual(page.viewportSize()!.width);
    expect(box.height).toBeLessThanOrEqual(page.viewportSize()!.height);

    // muted autoplay, honestly labelled
    const sound = page.getByRole("button", { name: "Enable sound" });
    await expect(sound).toBeVisible();
    await expect(sound).toBeFocused();
    await expect.poll(() => media(page).then((m) => m.t), { timeout: 20_000 }).toBeGreaterThan(0.3);
    expect(await media(page)).toMatchObject({ paused: false, muted: true, controls: true });
    await expect(page.getByText("The film is playing without sound.")).toBeAttached();
    await expect(page.getByRole("button", { name: "Skip intro · Enter portfolio" })).toBeVisible();

    // sound on
    await sound.click();
    expect(await media(page)).toMatchObject({ paused: false, muted: false });
    await expect(sound).toHaveCount(0);
    await expect(page.getByText("The film is playing with sound.")).toBeAttached();
    expect(await v.evaluate((el: HTMLVideoElement) => ({ w: el.videoWidth, h: el.videoHeight, d: Math.round(el.duration), src: new URL(el.currentSrc).pathname }))).toEqual({ w: 1080, h: 1920, d: 45, src: "/media/gaurav-os-intro-45s.mp4" });

    // the end: straight into the requested page, no extra click
    await v.evaluate((el: HTMLVideoElement) => { el.currentTime = 43.5; });
    await expect(gate).toHaveCount(0, { timeout: 15_000 });
    await expect(page.getByRole("heading", { level: 1, name: "Gaurav Singh" })).toBeVisible();
    await expect(page.locator("#main")).toBeFocused();
    expect(new URL(page.url()).pathname).toBe("/");
    expect(await page.getByTestId("intro-video").evaluate((el: HTMLVideoElement) => el.paused)).toBe(true); // the inline player does not start

    await page.reload();
    await expect(page.getByRole("heading", { level: 1, name: "Gaurav Singh" })).toBeVisible();
    expect(await state(page)).toBeNull();
    await page.goto("/projects");
    expect(await state(page)).toBeNull();
    await page.goBack();
    await expect(page).toHaveURL(/\/$/);
    expect(await state(page)).toBeNull();
    await page.goForward();
    await expect(page).toHaveURL(/\/projects/);
    expect(await state(page)).toBeNull();
    expect(errs).toEqual([]);
  });

  test("autoplay refused: the poster stays with Play with sound; nothing downloads until then; Play starts it with sound", async ({ page }) => {
    await asVisitor(page); await refuseAutoplay(page);
    const film: string[] = []; page.on("request", (r) => { if (FILM.test(new URL(r.url()).pathname)) film.push(r.url()); });
    await page.goto("/");
    const play = page.getByRole("button", { name: /Play with sound/ });
    await expect(play).toBeVisible();
    await expect(play).toBeFocused();
    await page.waitForTimeout(800);
    expect(await media(page)).toMatchObject({ paused: true, t: 0, controls: false });
    expect(await page.getByTestId("intro-gate-video").evaluate((el: HTMLVideoElement) => new URL(el.poster).pathname)).toBe(POSTER);
    const poster = await page.request.get(POSTER);
    expect([poster.status(), poster.headers()["content-type"]]).toEqual([200, "image/jpeg"]);
    expect(film).toEqual([]);
    await page.getByTestId("intro-gate").screenshot({ path: test.info().outputPath("poster-before-play.png") });
    await play.click();
    await expect.poll(() => media(page).then((m) => m.t), { timeout: 20_000 }).toBeGreaterThan(0.3);
    expect(await media(page)).toMatchObject({ paused: false, muted: false, controls: true });
    expect(film.length).toBeGreaterThan(0);
  });

  test("deep link: Skip lands on the exact address (path, query, hash); Esc skips; a new session shows it again", async ({ browser }) => {
    const ctx = await browser.newContext(); await asVisitor(ctx);
    const page = await ctx.newPage();
    await page.goto("/about?from=intro-test#certifications");
    await expect(page.getByTestId("intro-gate")).toBeVisible();
    await page.getByRole("button", { name: "Skip intro · Enter portfolio" }).click();
    expect(await state(page)).toBeNull();
    const u = new URL(page.url());
    expect([u.pathname.replace(/\/$/, ""), u.search, u.hash]).toEqual(["/about", "?from=intro-test", "#certifications"]);
    await expect(page.locator("#certifications")).toBeInViewport();
    await ctx.close();
    const ctx2 = await browser.newContext(); await asVisitor(ctx2);
    const p2 = await ctx2.newPage();
    await p2.goto("/worlds/careconnect");
    await expect(p2.getByTestId("intro-gate")).toBeVisible();
    await p2.keyboard.press("Escape");
    await expect(p2.getByTestId("intro-gate")).toHaveCount(0);
    expect(new URL(p2.url()).pathname.replace(/\/$/, "")).toBe("/worlds/careconnect");
    await ctx2.close();
  });

  test("keyboard stays inside the introduction, with a visible focus ring", async ({ page }) => {
    await asVisitor(page);
    await page.goto("/");
    await expect.poll(() => page.evaluate(() => !!document.activeElement?.closest(".intro-gate"))).toBe(true); // focus starts inside
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press("Tab");
      expect(await page.evaluate(() => !!document.activeElement?.closest(".intro-gate"))).toBe(true);
    }
    const skip = page.getByRole("button", { name: "Skip intro · Enter portfolio" });
    await skip.focus();
    expect(await skip.evaluate((e) => getComputedStyle(e).outlineStyle)).not.toBe("none");
    await page.keyboard.press("Enter");
    expect(await state(page)).toBeNull();
  });

  test("if the film cannot load, the visitor is told, the poster stays, and the way in still works", async ({ page }) => {
    await asVisitor(page);
    await page.route(FILM, (r) => r.fulfill({ status: 404, body: "" }));
    await page.goto("/");
    await expect(page.getByRole("alert")).toContainText("couldn’t play", { timeout: 15_000 });
    await expect(page.getByRole("button", { name: /Try again/ })).toBeVisible();
    expect(await page.getByTestId("intro-gate-video").evaluate((el: HTMLVideoElement) => new URL(el.poster).pathname)).toBe(POSTER);
    await page.getByRole("button", { name: "Skip intro · Enter portfolio" }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Gaurav Singh" })).toBeVisible();
  });

  test("storage unavailable (some private modes): it still shows, and Skip still enters", async ({ page }) => {
    await asVisitor(page);
    await page.addInitScript(() => { Object.defineProperty(window, "sessionStorage", { get() { throw new Error("storage blocked"); } }); });
    await page.goto("/");
    await expect(page.getByTestId("intro-gate")).toBeVisible();
    await page.getByRole("button", { name: "Skip intro · Enter portfolio" }).click();
    expect(await state(page)).toBeNull();
    await expect(page.getByRole("heading", { level: 1, name: "Gaurav Singh" })).toBeVisible();
  });

  test("reduced motion: poster and a choice, nothing plays or downloads by itself", async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: "reduce" }); await asVisitor(ctx);
    const page = await ctx.newPage();
    const film: string[] = []; page.on("request", (r) => { if (FILM.test(new URL(r.url()).pathname)) film.push(r.url()); });
    await page.goto("/");
    await expect(page.getByRole("button", { name: /Play with sound/ })).toBeVisible();
    await page.waitForTimeout(800);
    expect(await media(page)).toMatchObject({ paused: true, t: 0 });
    expect(film).toEqual([]);
    await page.getByRole("button", { name: "Skip intro · Enter portfolio" }).click();
    expect(await state(page)).toBeNull(); // no fade to wait for
    await ctx.close();
  });

  test("Watch full screen replays it from the homepage; ?nointro and automated browsers go straight in", async ({ page }) => {
    await page.goto("/"); // automation, no visitor override
    expect(await state(page)).toBeNull();
    await page.getByTestId("intro-replay").click();
    await expect(page.getByTestId("intro-gate")).toBeVisible();
    await page.getByRole("button", { name: "Close introduction" }).click();
    await expect(page.getByTestId("intro-gate")).toHaveCount(0);
    await asVisitor(page);
    await page.goto("/?nointro");
    expect(await state(page)).toBeNull();
  });
});

test("Oz holds its greeting while the inline film's controls are under it, and shows it elsewhere", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) < 1024, "the overlap is a desktop layout case");
  await page.goto("/?nointro");
  await page.evaluate(() => { const f = document.querySelector("#intro-film figure")!; scrollBy(0, f.getBoundingClientRect().bottom - innerHeight + 10); });
  await page.waitForTimeout(9_000); // past the first-visit greeting delay
  await expect(page.locator(".oz-bubble")).toHaveCount(0);
  await page.evaluate(() => scrollTo(0, 0));
  await expect(page.locator(".oz-bubble")).toHaveCount(1);
  await page.getByRole("button", { name: "Dismiss message" }).click(); // dismissing still works
  await expect(page.locator(".oz-bubble")).toHaveCount(0);
});
