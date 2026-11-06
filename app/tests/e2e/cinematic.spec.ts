import { test, expect, type Page } from "@playwright/test";
import { districts } from "../../src/content/districts";

const noErrors = (page: Page) => { const errs: string[] = []; page.on("pageerror", (e) => errs.push(e.message)); page.on("console", (m) => m.type() === "error" && errs.push(m.text())); return errs; };

test("J18 home hero: cinematic world image, tagline, Explore + Recruiter entry points", async ({ page }) => {
  const errs = noErrors(page);
  await page.goto("/?nointro");
  await expect(page.getByText("Building products with evidence, intelligence and execution.")).toBeVisible();
  const hero = page.locator('section[aria-labelledby="hero-title"] [data-cinematic="gaurav-world-hero"] img').filter({ visible: true });
  await expect(hero).toHaveCount(1);
  expect(await hero.evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth > 0)).toBe(true);
  expect(await hero.getAttribute("alt")).toBe(""); // atmospheric, decorative — the real text is HTML
  await expect(page).toHaveTitle("Gaurav Singh — Product × AI × Building | Gaurav.OS");
  await expect(page.getByRole("heading", { level: 1, name: "Gaurav Singh" })).toBeVisible();
  expect(await page.locator('section[aria-labelledby="hero-title"] source[type="image/avif"]').count()).toBeGreaterThan(0);
  const ld = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!);
  expect(ld["@graph"][0]).toMatchObject({ "@type": "Person", name: "Gaurav Singh", sameAs: ["https://www.linkedin.com/in/gaurav-singh-product", "https://github.com/gaurav-product"] });
  expect(JSON.stringify(ld)).not.toMatch(/8127|\+91/); // no phone number
  expect(await page.content()).not.toContain("Gaurav Kumar Singh"); // legal name is for the formal CV only
  expect(await page.locator('meta[property="og:title"]').getAttribute("content")).toMatch(/^Gaurav Singh/);
  expect(await page.locator('meta[name="description"]').getAttribute("content")).toMatch(/Product Management, AI and Digital Product Building/);
  await page.getByRole("link", { name: "Enter Explore Mode" }).click();
  await expect(page).toHaveURL(/\/explore/);
  await page.getByRole("link", { name: "Exit to Recruiter Mode" }).click();
  await expect(page).toHaveURL(/\/recruiter$/);
  expect(errs).toEqual([]);
});

test("J19 every district page opens with its destinations and navigates onward", async ({ page }) => {
  const errs = noErrors(page);
  for (const d of districts) {
    await page.goto(`/districts/${d.id}`);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(d.name);
    for (const x of d.destinations) await expect(page.getByRole("link", { name: new RegExp(x.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")) }).first()).toBeVisible();
    const img = page.locator(`header [data-cinematic="${d.image}"] img`).first();
    await expect(img).toBeVisible();
    expect(await img.evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth > 0), `${d.id} image decoded`).toBe(true);
    await expect(page.getByText(/illustration for this district has not been supplied/i)).toHaveCount(0);
  }
  await page.goto("/districts/ai-safety-lab");
  await page.getByRole("link", { name: /See it in Explore Mode/ }).click();
  await expect(page).toHaveURL(/\/explore\?d=ai-safety-lab/);
  await expect(page.getByTestId("district-panel")).toContainText("AI & Safety Lab");
  await page.getByTestId("district-panel").getByRole("link", { name: /district page/ }).click();
  await expect(page).toHaveURL(/\/districts\/ai-safety-lab$/);
  expect(errs.filter((e) => !/WebGL|GPU|context/i.test(e))).toEqual([]);
});

test("J20 world map: every hotspot sits on the illustration and opens its district", async ({ page }) => {
  await page.goto("/explore?view=2d");
  const map = page.getByTestId("world-map");
  const img = map.locator("img");
  await expect(img).toBeVisible();
  // the map opens with a short settle-in zoom; measure alignment once it has come to rest
  await map.locator(".kenburns").evaluate((el) => Promise.all(el.getAnimations().map((a) => a.finished)));
  const box = (await img.boundingBox())!;
  for (const d of districts) {
    const b = map.getByRole("button", { name: d.name, exact: true });
    const r = (await b.boundingBox())!;
    const cx = r.x + r.width / 2, cy = r.y + r.height / 2;
    expect(Math.abs((cx - box.x) / box.width * 100 - d.world[0]), `${d.id} x`).toBeLessThan(1.5);
    expect(Math.abs((cy - box.y) / box.height * 100 - d.world[1]), `${d.id} y`).toBeLessThan(1.5);
    await b.click();
    await expect(page).toHaveURL(new RegExp(`d=${d.id}`));
    await expect(page.getByTestId("district-panel")).toContainText(d.name);
  }
});

test("J21 guided tour visits all six districts in order, then ends", async ({ page }) => {
  await page.goto("/explore?view=2d");
  await page.getByRole("button", { name: "Guided tour" }).click();
  const bar = page.getByTestId("tour-bar");
  for (const [i, d] of districts.entries()) {
    await expect(bar).toContainText(`Stop ${i + 1} of ${districts.length}`);
    await expect(page.getByTestId("district-panel")).toContainText(d.name);
    await expect(page).toHaveURL(new RegExp(`d=${d.id}`));
    if (i < districts.length - 1) await page.getByRole("button", { name: "Next stop" }).click();
  }
  await expect(bar.getByRole("link", { name: /Finish in Recruiter Mode/ })).toBeVisible();
  await page.getByRole("button", { name: "Previous stop" }).click();
  await expect(bar).toContainText(`Stop ${districts.length - 1} of`);
  await page.getByRole("button", { name: "End tour" }).click();
  await expect(bar).toHaveCount(0);
  await expect(page).not.toHaveURL(/d=/);
});

test("J22 ambient sound is off by default and toggles only on request", async ({ page }) => {
  await page.goto("/explore?view=2d");
  // one stable name ("Ambient sound"); the on/off state is aria-pressed
  const toggle = page.getByRole("button", { name: "Ambient sound", exact: true });
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  expect(await page.evaluate(() => document.querySelectorAll("audio").length)).toBe(0);
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
});

test("J23 About → How I Think: illustration and interactive loop", async ({ page }) => {
  await page.goto("/about");
  const sec = page.locator("#how-i-think");
  await expect(sec.locator('[data-cinematic="how-i-think"] img')).toHaveAttribute("alt", /\(Illustration\)$/);
  await expect(sec.getByText("Illustration", { exact: true })).toBeVisible();
  const panel = sec.getByTestId("loop-panel");
  await expect(panel).toContainText("Stage 1 of 8");
  await sec.getByRole("button", { name: "Next" }).click();
  await expect(panel).toContainText("Stage 2 of 8");
  await sec.getByRole("tab", { name: "ITERATE" }).click();
  await expect(panel).toContainText("Stage 8 of 8");
  await sec.getByRole("tab", { name: "ITERATE" }).press("ArrowRight");
  await expect(panel).toContainText("Stage 1 of 8");
});

test("J24 Explore my work — every project is a chapter with its own art (brand artwork or 3D render), status and case-study link", async ({ page }) => {
  const errs = noErrors(page);
  await page.goto("/projects");
  await expect(page.getByRole("heading", { level: 1, name: "Explore my work" })).toBeVisible();
  const chapters = page.getByRole("list", { name: "Projects" }).locator(":scope > li");
  await expect(chapters).toHaveCount(7);
  for (const li of await chapters.all()) {
    await li.scrollIntoViewIfNeeded();
    const img = li.locator("[data-cinematic^='render-project-'] img, [data-cinematic^='brand-'] img");
    await expect(img).toHaveCount(1);
    await expect.poll(() => img.evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth > 0)).toBe(true);
    await expect(li.getByRole("link", { name: /^Read the case study: / })).toBeVisible();
  }
  // filters still narrow the chapters, and clearing restores them
  await page.getByRole("group", { name: "Filter projects" }).getByRole("button", { name: "Academic" }).click();
  await expect(chapters).toHaveCount(1);
  await expect(chapters.first()).toContainText("PhonePe Smart Spend Coach");
  await page.getByRole("group", { name: "Filter projects" }).getByRole("button", { name: "All" }).click();
  await expect(chapters).toHaveCount(7);
  expect(errs).toEqual([]);
});

test("J25 guided tour autoplay advances on its own and can be paused", async ({ page }) => {
  await page.goto("/explore?view=2d");
  await page.getByRole("button", { name: "Guided tour" }).click();
  const bar = page.getByTestId("tour-bar");
  await expect(bar).toContainText("Stop 1 of 6");
  const auto = bar.getByRole("button", { name: "Autoplay" });
  await auto.click();
  await expect(auto).toHaveAttribute("aria-pressed", "true");
  await expect(bar).toContainText("Stop 2 of 6", { timeout: 10_000 });
  await auto.click();
  await expect(auto).toHaveAttribute("aria-pressed", "false");
  await page.waitForTimeout(7000);
  await expect(bar).toContainText("Stop 2 of 6");
});
