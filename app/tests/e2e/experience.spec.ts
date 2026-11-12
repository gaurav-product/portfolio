import { test, expect, type Page } from "@playwright/test";

/** Final master pass: hero, guided tour, case-study feature, Skills, Learning, Product Thinking and Research. */
const noErrors = (page: Page) => { const errs: string[] = []; page.on("pageerror", (e) => errs.push(e.message)); page.on("console", (m) => m.type() === "error" && errs.push(m.text())); return errs; };

test.describe("home hero", () => {
  test("typewriter keeps the full sentence for assistive tech and settles on the approved line", async ({ page }) => {
    const errs = noErrors(page);
    await page.goto("/?nointro");
    const tw = page.getByTestId("typewriter");
    await expect(tw).toContainText("Building products with evidence, intelligence and execution.");
    // the animated text is hidden from screen readers; the full sentence is not
    await expect(tw.locator(".sr-only")).toHaveText("Building products with evidence, intelligence and execution.");
    await expect(page.getByTestId("typewriter-caret")).toHaveAttribute("data-typing", "false", { timeout: 15_000 }); // stops, no endless loop
    await expect(tw).toContainText("Building products with evidence, intelligence and execution.");
    expect(errs).toEqual([]);
  });

  test("reduced motion: typewriter is static and no background video loads", async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto("/?nointro");
    await page.waitForTimeout(1200); // past the typing start delay
    await expect(page.getByTestId("typewriter-caret")).toHaveAttribute("data-typing", "false");
    await expect(page.getByTestId("typewriter")).toContainText("Building products with evidence, intelligence and execution.");
    await page.waitForTimeout(1500);
    await expect(page.getByTestId("hero-video")).toHaveCount(0);
    await ctx.close();
  });

  test("desktop: the background loop is muted, inline, looping, with a poster, and loads after idle", async ({ page }) => {
    await page.goto("/?nointro");
    const v = page.getByTestId("hero-video");
    await expect(v).toHaveCount(1, { timeout: 10_000 });
    expect(await v.evaluate((el: HTMLVideoElement) => ({ m: el.muted, l: el.loop, p: el.playsInline, poster: !!el.poster }))).toEqual({ m: true, l: true, p: true, poster: true });
    await expect(page.getByTestId("hero-backdrop")).toHaveAttribute("aria-hidden", "true"); // decorative layer
  });

  test("primary CTA opens the guided tour; secondary opens the projects list", async ({ page }) => {
    await page.goto("/?nointro");
    await expect(page.getByRole("link", { name: "Explore my work" })).toHaveAttribute("href", "/tour");
    await expect(page.getByRole("link", { name: "Browse all projects" })).toHaveAttribute("href", "/projects");
    // every entry point the previous hero offered is still one click away
    for (const [name, href] of [["Solar system in 3D", "/universe"], ["Project worlds in 3D", "/worlds"], ["3D city", "/explore/city"], ["Recruiter Mode", "/recruiter"]] as const)
      await expect(page.locator('section[aria-labelledby="hero-title"]').getByRole("link", { name, exact: true })).toHaveAttribute("href", href);
    await expect(page.locator('section[aria-labelledby="hero-title"]').getByRole("link", { name: "Download CV" })).toHaveAttribute("download", /\.pdf$/);
    await expect(page.locator('section[aria-labelledby="hero-title"]').getByRole("button", { name: /Watch the intro film/ })).toBeVisible();
  });

  test("case-study feature uses the owner-supplied artwork and links to the research library", async ({ page }) => {
    await page.goto("/?nointro");
    const f = page.getByTestId("case-study-feature");
    await f.scrollIntoViewIfNeeded();
    await expect(f.locator('[data-cinematic="brand-90-day-case-studies"]')).toHaveCount(1);
    await expect(f.getByRole("heading", { name: /90 product case studies, in public/ })).toBeVisible();
    await expect(f).toContainText("not products I launched");
    await f.getByRole("link", { name: "Open the research library" }).first().click();
    await expect(page).toHaveURL(/\/research$/);
  });
});

test.describe("final corrections", () => {
  for (const w of [320, 412, 1440]) {
    test(`tagline typing causes no layout shift at ${w}px`, async ({ browser }) => {
      const ctx = await browser.newContext({ viewport: { width: w, height: w > 1000 ? 900 : 780 }, isMobile: w < 1024, hasTouch: w < 1024 });
      const page = await ctx.newPage();
      await page.addInitScript(() => { (window as unknown as { __ls: number[] }).__ls = []; new PerformanceObserver((l) => { for (const e of l.getEntries()) if (e.startTime > 500) (window as unknown as { __ls: number[] }).__ls.push((e as unknown as { value: number }).value); }).observe({ type: "layout-shift", buffered: true }); });
      await page.goto("/?nointro");
      const caret = page.getByTestId("typewriter-caret");
      await expect(caret).toHaveAttribute("data-typing", "true", { timeout: 5_000 });
      await expect(caret).toHaveAttribute("data-typing", "false", { timeout: 20_000 });
      expect(await page.evaluate(() => (window as unknown as { __ls: number[] }).__ls)).toEqual([]); // no shift at all while typing
      await expect(page.getByTestId("typewriter").locator(".sr-only")).toHaveText("Building products with evidence, intelligence and execution.");
      await ctx.close();
    });
  }

  for (const w of [320, 360, 390, 412]) {
    test(`Oz never covers the homepage introduction at ${w}px, and still works`, async ({ browser }) => {
      const ctx = await browser.newContext({ viewport: { width: w, height: 780 }, isMobile: true, hasTouch: true });
      const page = await ctx.newPage();
      await page.goto("/?nointro");
      const oz = page.getByTestId("oz");
      const intro = page.locator("[data-oz-avoid]");
      const covered = () => page.evaluate(() => {
        const l = document.querySelector("[data-testid=oz] .oz-launch")!; const b = l.getBoundingClientRect();
        if (+getComputedStyle(l).opacity < 0.05 || b.left >= innerWidth) return false;
        return [...document.querySelectorAll("[data-oz-avoid] h1, [data-oz-avoid] p, [data-oz-avoid] a, [data-oz-avoid] button")]
          .some((el) => [...el.getClientRects()].some((r) => r.right > b.left && r.left < b.right && r.bottom > b.top && r.top < b.bottom));
      });
      const bottom = await intro.evaluate((el) => el.getBoundingClientRect().bottom + scrollY);
      for (let y = 0; y <= bottom; y += 60) { await page.evaluate((v) => scrollTo(0, v), y); await page.waitForTimeout(80); expect(await covered(), `scrolled to ${y}`).toBe(false); }
      await page.evaluate((v) => scrollTo(0, v + 200), bottom);
      await expect(oz).not.toHaveAttribute("data-stepped-aside");
      await page.getByRole("button", { name: /Open Oz/ }).tap();
      await expect(page.locator("#oz-panel")).toBeVisible();
      await ctx.close();
    });
  }

  test("a spot the visitor drags Oz to is respected (it does not step away from it)", async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 780 }, isMobile: true, hasTouch: true });
    const page = await ctx.newPage();
    await page.addInitScript(() => localStorage.setItem("oz-pos", JSON.stringify({ x: 0, y: 260 }))); // placed by a previous drag
    await page.goto("/?nointro");
    await page.waitForTimeout(800);
    await expect(page.getByTestId("oz")).not.toHaveAttribute("data-stepped-aside");
    await expect(page.getByRole("button", { name: /Open Oz/ })).toBeVisible();
    await ctx.close();
  });

  test("Oz is unaffected on desktop and on other pages", async ({ page }) => {
    await page.goto("/?nointro");
    await expect(page.getByTestId("oz")).not.toHaveAttribute("data-stepped-aside");
    await page.goto("/projects");
    await expect(page.getByTestId("oz")).not.toHaveAttribute("data-stepped-aside");
    await page.getByRole("button", { name: /Open Oz/ }).click();
    await expect(page.locator("#oz-panel")).toBeVisible();
  });

  test("wording stays factual: featured heading, CareConnect summary, undated certificates", async ({ page }) => {
    await page.goto("/?nointro");
    await expect(page.getByRole("heading", { name: "Products, Prototypes & Research" })).toBeVisible();
    await expect(page.getByText("Products built, shipped and researched")).toHaveCount(0);
    await page.goto("/projects/careconnect");
    await expect(page.getByText("What was built", { exact: true })).toBeVisible();
    await expect(page.getByText("What shipped", { exact: true })).toHaveCount(0);
    await page.goto("/about");
    const undated = page.locator("#certifications li").filter({ hasText: "Date not stated" });
    await expect(undated).toHaveCount(3);
    for (const t of ["AI in Product Management and Product Strategy (Product School)", "Product Analytics (Pendo)", "Generative AI Mastermind"]) await expect(undated.filter({ hasText: t })).toHaveCount(1);
  });
});

test.describe("guided tour", () => {
  test("starts in auto mode, shows progress, Next/Previous move between chapters", async ({ page }) => {
    const errs = noErrors(page);
    await page.goto("/tour");
    const tour = page.getByTestId("tour");
    await expect(tour).toHaveAttribute("data-state", /playing|held/);
    await expect(page.getByTestId("tour-stage")).toHaveAttribute("data-stage", "intro");
    await expect(page.getByTestId("tour-progress")).toHaveCount(1);
    await expect(page.getByTestId("tour-chapter")).toHaveCount(8);
    await page.getByTestId("tour-next").click();
    await expect(page.getByTestId("tour-stage")).toHaveAttribute("data-stage", "experience");
    await expect(page).toHaveURL(/stage=experience/);
    await page.getByTestId("tour-prev").click();
    await expect(page.getByTestId("tour-stage")).toHaveAttribute("data-stage", "intro");
    expect(errs).toEqual([]);
  });

  test("auto mode advances on its own when nobody is interacting", async ({ page }) => {
    await page.goto("/tour");
    await page.mouse.move(2, 2); // outside the stage, so the tour is not holding for a reader
    await expect(page.getByTestId("tour-stage")).toHaveAttribute("data-stage", "experience", { timeout: 15_000 });
  });

  test("pause/resume, and the tour pauses while the tab is hidden", async ({ page }) => {
    await page.goto("/tour");
    await page.mouse.move(2, 2);
    const tour = page.getByTestId("tour");
    await page.getByTestId("tour-pause").click();
    await expect(tour).toHaveAttribute("data-state", "paused");
    await expect(page.getByTestId("tour-pause")).toHaveAttribute("aria-pressed", "true");
    expect(await page.getByTestId("tour-progress").evaluate((el) => getComputedStyle(el).animationPlayState)).toBe("paused");
    await page.getByTestId("tour-pause").click();
    await page.mouse.move(2, 2);
    await expect(tour).toHaveAttribute("data-state", "playing");
    await page.evaluate(() => { Object.defineProperty(document, "hidden", { value: true, configurable: true }); document.dispatchEvent(new Event("visibilitychange")); });
    await expect(tour).toHaveAttribute("data-state", "hidden");
    expect(await page.getByTestId("tour-progress").evaluate((el) => getComputedStyle(el).animationPlayState)).toBe("paused");
  });

  test("manual mode never advances on its own; keyboard arrows move; Escape exits", async ({ page }) => {
    await page.goto("/tour");
    await page.getByTestId("mode-manual").click();
    await expect(page.getByTestId("tour")).toHaveAttribute("data-state", "manual");
    await expect(page.getByTestId("tour-pause")).toHaveCount(0);
    await page.waitForTimeout(8_500); // longer than the first chapter's dwell
    await expect(page.getByTestId("tour-stage")).toHaveAttribute("data-stage", "intro");
    await page.keyboard.press("ArrowRight");
    await expect(page.getByTestId("tour-stage")).toHaveAttribute("data-stage", "experience");
    await expect(page).toHaveURL(/mode=manual/);
    await page.keyboard.press("Escape");
    await expect(page).toHaveURL(/\/$/);
  });

  test("deep link to a chapter hydrates without errors and ends at a closing chapter that stops", async ({ page }) => {
    const errs = noErrors(page);
    await page.goto("/tour?stage=projects");
    await expect(page.getByTestId("tour-stage")).toHaveAttribute("data-stage", "projects");
    // the seven projects, each with a status and a case-study link
    await expect(page.getByTestId("tour-stage").getByRole("link", { name: /Case study/ })).toHaveCount(7);
    await page.goto("/tour?stage=close");
    await expect(page.getByTestId("tour")).toHaveAttribute("data-state", "done");
    await expect(page.getByTestId("tour-next")).toBeDisabled();
    await expect(page.getByTestId("tour-progress")).toHaveCount(1);
    expect(errs).toEqual([]);
  });

  test("Skip tour goes to the project list; the research chapter says these are not launched products", async ({ page }) => {
    await page.goto("/tour?stage=research");
    await expect(page.getByTestId("tour-stage")).toContainText("not products I launched");
    await page.getByTestId("tour-skip").click();
    await expect(page).toHaveURL(/\/projects$/);
  });

  test("the learning chapter keeps the programme clarification (not an IIT Roorkee degree)", async ({ page }) => {
    await page.goto("/tour?stage=learning&mode=manual");
    await expect(page.getByTestId("tour-stage")).toContainText("not an IIT Roorkee degree");
  });

  test("reduced motion starts the tour in manual mode", async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto("/tour");
    await expect(page.getByTestId("tour")).toHaveAttribute("data-state", "manual");
    await ctx.close();
  });

  test("phone: controls fit on screen and stay usable", async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const page = await ctx.newPage();
    await page.goto("/tour?stage=skills&mode=manual");
    for (const id of ["tour-prev", "tour-next", "tour-exit"]) {
      const b = (await page.getByTestId(id).boundingBox())!;
      expect(b.x).toBeGreaterThanOrEqual(0); expect(b.x + b.width).toBeLessThanOrEqual(390); expect(b.y + b.height).toBeLessThanOrEqual(844);
      expect(b.height).toBeGreaterThanOrEqual(40);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    await page.getByTestId("tour-next").tap();
    await expect(page.getByTestId("tour-stage")).toHaveAttribute("data-stage", "research");
    await ctx.close();
  });
  test("user navigation moves focus to the new chapter heading (keyboard and buttons)", async ({ page }) => {
    await page.goto("/tour?mode=manual");
    await expect(page.getByTestId("tour-stage")).toHaveAttribute("data-stage", "intro");
    await page.keyboard.press("ArrowRight");
    await expect(page.getByTestId("tour-stage")).toHaveAttribute("data-stage", "experience");
    await expect(page.getByRole("heading", { level: 1, name: "Experience" }).or(page.locator("[data-stage-title]"))).toBeFocused();
    await page.getByTestId("tour-next").click();
    await expect(page.getByTestId("tour-stage")).toHaveAttribute("data-stage", "thinking");
    await expect(page.locator("[data-stage-title]")).toBeFocused();
  });

  for (const [w, h] of [[320, 568], [360, 740], [390, 664], [412, 839]] as const) {
    test(`phone ${w}px: top bar and footer fit, Skip is available, Oz never covers a control`, async ({ browser }) => {
      const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: true, hasTouch: true });
      const page = await ctx.newPage();
      // both modes: Auto adds the Pause button to the footer row, which is where room is tightest
      for (const mode of ["manual", "auto"] as const) {
        await page.goto(`/tour?stage=research${mode === "manual" ? "&mode=manual" : ""}`);
        await expect(page.getByTestId("tour-stage")).toHaveAttribute("data-stage", "research");
        await expect(page.getByTestId("tour-pause")).toHaveCount(mode === "auto" ? 1 : 0);
        const oz = await page.getByTestId("oz").boundingBox();
        const ids = ["tour-exit", "mode-auto", "mode-manual", "tour-skip", "tour-prev", "tour-next", ...(mode === "auto" ? ["tour-pause"] : []), "tour-status"];
        for (const id of ids) {
          const el = page.getByTestId(id);
          await expect(el, `${mode}: ${id}`).toBeVisible();
          const b = (await el.boundingBox())!;
          if (id === "tour-status" && b.width <= 2) continue; // narrowest phones: kept for screen readers only (the chapter bar shows progress)
          expect(b.x, id).toBeGreaterThanOrEqual(0); expect(b.x + b.width, id).toBeLessThanOrEqual(w); expect(b.y + b.height, id).toBeLessThanOrEqual(h);
          if (id !== "tour-status") expect(b.height, id).toBeGreaterThanOrEqual(40);
          if (oz && /prev|next|pause|status/.test(id)) expect(b.x + b.width <= oz.x || b.y + b.height <= oz.y, `${mode}: ${id} clear of Oz`).toBe(true);
        }
        await expect(page.getByTestId("tour-exit")).toHaveAccessibleName(/Exit/);
        await expect(page.getByTestId("tour-prev")).toHaveAccessibleName(/Previous/);
        if (mode === "auto") await expect(page.getByTestId("tour-pause")).toHaveAccessibleName(/Pause|Resume/);
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(w);
      }
      await ctx.close();
    });
  }
});

test("shared links with filters hydrate cleanly (no React hydration error) and apply their filters", async ({ page }) => {
  const errs: string[] = [];
  page.on("pageerror", (e) => errs.push(e.message));
  page.on("console", (m) => { if (m.type() === "error" && /#41[89]|#42[35]|hydrat/i.test(m.text())) errs.push(m.text()); });
  const cases: [string, () => Promise<void>][] = [
    ["/research?category=Fintech", () => expect(page.getByTestId("research-categories").getByRole("button", { name: /^Fintech/ })).toHaveAttribute("aria-pressed", "true")],
    ["/research?q=spotify", async () => { await expect(page.getByRole("searchbox").first()).toHaveValue("spotify"); }],
    ["/skills?category=Healthcare&status=Demonstrated%20in%20work", () => expect(page.getByRole("group", { name: "Evidence" }).getByRole("button", { name: "Demonstrated in work" })).toHaveAttribute("aria-pressed", "true")],
    ["/projects?filter=Healthcare", async () => { await expect(page).toHaveURL(/filter=Healthcare/); }],
    ["/search?q=careconnect", async () => { await expect(page.getByRole("searchbox").first()).toHaveValue("careconnect"); }],
    ["/recruiter?role=research", async () => { await expect(page).toHaveURL(/role=research/); }],
    ["/universe?study=12&view=2d", async () => { await expect(page).toHaveURL(/study=12/); }],
    ["/tour?stage=skills&mode=manual", () => expect(page.getByTestId("tour-stage")).toHaveAttribute("data-stage", "skills")],
  ];
  for (const [url, check] of cases) {
    await page.goto(url);
    await check();
    await page.waitForTimeout(300);
    expect(errs, url).toEqual([]);
  }
});

test.describe("library pages", () => {
  test("skills: search, category chips and evidence links", async ({ page }) => {
    const errs = noErrors(page);
    await page.goto("/skills");
    const cards = page.getByTestId("skill-card");
    const all = await cards.count();
    expect(all).toBeGreaterThan(50);
    await page.getByRole("group", { name: "Category" }).getByRole("button", { name: /^Healthcare/ }).click();
    await expect(page.getByRole("group", { name: "Category" }).getByRole("button", { name: /^Healthcare/ })).toHaveAttribute("aria-pressed", "true");
    const hc = await cards.count();
    expect(hc).toBeGreaterThan(0); expect(hc).toBeLessThan(all);
    await page.getByRole("group", { name: "Evidence" }).getByRole("button", { name: "Demonstrated in work" }).click();
    expect(await cards.count()).toBeLessThanOrEqual(hc);
    // every "Shown in" chip is a real link to a project, role or the research corpus
    const hrefs = await page.getByTestId("skill-card").locator('a[href^="/projects/"], a[href^="/experience/"], a[href="/research"]').evaluateAll((as) => as.map((a) => a.getAttribute("href")));
    expect(hrefs.length).toBeGreaterThan(0);
    expect(errs).toEqual([]);
  });

  test("about: education, certifications and professional learning are separate sections", async ({ page }) => {
    await page.goto("/about");
    await expect(page.locator("#education")).toBeVisible();
    await expect(page.locator("#certifications")).toBeVisible();
    await expect(page.locator("#learning")).toBeAttached();
    expect(await page.getByTestId("degree").count()).toBeGreaterThanOrEqual(3);
    expect(await page.getByTestId("cert-group").count()).toBeGreaterThan(0);
    expect(await page.getByTestId("programme").count()).toBeGreaterThan(0);
  });

  test("product thinking: the section nav jumps to each section", async ({ page }) => {
    await page.goto("/product-thinking");
    const nav = page.getByTestId("pt-nav");
    for (const id of ["s-loop", "s-orbit", "s-tools", "s-challenges", "s-principles"]) {
      await expect(nav.locator(`a[href="#${id}"]`)).toHaveCount(1);
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
    await nav.locator('a[href="#s-tools"]').click();
    await expect(page).toHaveURL(/#s-tools$/);
    // while stuck, the nav sits fully below the site header, and the section it jumped to is not hidden under it
    await page.evaluate(() => scrollTo(0, scrollY + 400));
    const header = (await page.locator("header").first().boundingBox())!, bar = (await nav.boundingBox())!;
    expect(bar.y).toBeGreaterThanOrEqual(header.y + header.height - 1.5);
    await nav.locator('a[href="#s-challenges"]').click();
    expect((await page.locator("#s-challenges").boundingBox())!.y).toBeGreaterThanOrEqual(bar.y + bar.height - 2);
  });

  test("research: colour-coded category chips filter the 90 studies and can be cleared", async ({ page }) => {
    await page.goto("/research");
    const g = page.getByTestId("research-categories");
    await expect(g.getByRole("button", { name: /^All categories/ })).toHaveAttribute("aria-pressed", "true");
    await g.getByRole("button", { name: /^Fintech/ }).click();
    await expect(page).toHaveURL(/category=/);
    await expect(g.getByRole("button", { name: /^Fintech/ })).toHaveAttribute("aria-pressed", "true");
    await page.getByRole("button", { name: "Clear filters" }).click();
    await expect(g.getByRole("button", { name: /^All categories/ })).toHaveAttribute("aria-pressed", "true");
  });
});
