import { test, expect, type Page } from "@playwright/test";
import fs from "node:fs";

const noErrors = (page: Page) => { const errs: string[] = []; page.on("pageerror", (e) => errs.push(e.message)); page.on("console", (m) => m.type() === "error" && errs.push(m.text())); return errs; };
const isMobile = (page: Page) => (page.viewportSize()?.width ?? 1440) < 1024;
const openNav = async (page: Page, name: string) => {
  if ((page.viewportSize()?.width ?? 1440) < 1440) { await page.getByRole("button", { name: "Open menu" }).click(); await page.getByRole("dialog", { name: "Site menu" }).getByRole("link", { name, exact: true }).click(); }
  else await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name, exact: true }).click();
};

test("J1 home → explore my work → project → case study → home", async ({ page }) => {
  const errs = noErrors(page);
  await page.goto("/?nointro");
  await expect(page.getByRole("heading", { level: 1, name: "Gaurav Kumar Singh" })).toBeVisible();
  await page.getByRole("link", { name: "Explore my work" }).click();
  await expect(page).toHaveURL(/\/projects$/);
  await page.getByRole("link", { name: "CareConnect", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1, name: "CareConnect" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Key decisions and trade-offs" })).toBeVisible();
  await page.getByRole("link", { name: /Next project/ }).click();
  await expect(page).toHaveURL(/\/projects\/ghargyaan$/);
  await page.getByRole("link", { name: "Gaurav.OS — home" }).click();
  await expect(page).toHaveURL(/\/$/);
  expect(errs).toEqual([]);
});

test("J2 home → recruiter mode → experience → projects → CV download", async ({ page }) => {
  await page.goto("/?nointro");
  await page.getByRole("link", { name: "Recruiter Mode" }).first().click();
  await expect(page.getByText("Recruiter Mode · 30-second overview")).toBeVisible();
  await page.getByRole("button", { name: "Product Analyst" }).click();
  await expect(page).toHaveURL(/role=analyst/);
  await expect(page.getByRole("heading", { name: /ordered for “Product Analyst”/ })).toBeVisible();
  await page.getByRole("button", { name: "Show the detailed profile" }).click();
  await expect(page.getByRole("button", { name: "Show the 30-second view" })).toBeVisible();
  const [dl] = await Promise.all([page.waitForEvent("download"), page.getByRole("link", { name: "Download CV" }).first().click()]);
  expect(dl.suggestedFilename()).toBe("Gaurav-Kumar-Singh-CV.pdf");
  const file = await dl.path();
  expect(fs.readFileSync(file!).subarray(0, 4).toString()).toBe("%PDF");
  await page.getByRole("link", { name: /Associate Product Manager/ }).first().click();
  await expect(page.getByRole("heading", { level: 1, name: "Associate Product Manager" })).toBeVisible();
  await openNav(page, "Projects");
  await expect(page).toHaveURL(/\/projects$/);
});

test("J3 search for Evamastu → result → project", async ({ page }) => {
  await page.goto("/?nointro");
  await page.getByRole("button", { name: "Search the portfolio" }).click();
  const box = page.getByRole("combobox", { name: "Search query" });
  await box.fill("Evamastu");
  await expect(page.getByRole("option").first()).toContainText("Evamastu");
  await box.press("Enter");
  await expect(page).toHaveURL(/\/projects\/evamastu$/);
  await expect(page.getByRole("heading", { level: 1, name: "Evamastu" })).toBeVisible();
  // keyboard shortcut, clear and no-results state
  await page.keyboard.press("Control+k");
  await page.getByRole("combobox").fill("zzqqxx");
  await expect(page.getByText(/No results for/)).toBeVisible();
  await page.getByRole("button", { name: "Clear" }).click();
  await expect(page.getByRole("combobox")).toHaveValue("");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Search the portfolio" })).toHaveCount(0);
});

test("J4 RICE calculator → add features → calculate → export CSV", async ({ page }) => {
  await page.goto("/product-thinking");
  await page.getByRole("link", { name: /RICE calculator/ }).click();
  await page.getByRole("button", { name: "Reset" }).click();
  await page.getByRole("button", { name: "Add feature" }).click();
  const rows = page.locator("tbody tr");
  await expect(rows).toHaveCount(4);
  await page.getByLabel("Reach for New feature").fill("10000");
  await page.getByLabel("Impact for New feature").selectOption("3");
  await page.getByLabel("Confidence for New feature").fill("100");
  await page.getByLabel("Effort for New feature").fill("2");
  await expect(page.getByTestId("rice-score").first()).toHaveText("15000.0"); // sorted: highest first
  await page.getByLabel("Effort for New feature").fill("0");
  await expect(page.getByTestId("rice-score")).toContainText(["—"]);
  await page.getByLabel("Effort for New feature").fill("2");
  const [dl] = await Promise.all([page.waitForEvent("download"), page.getByRole("button", { name: "Export CSV" }).click()]);
  const csv = fs.readFileSync((await dl.path())!, "utf8");
  expect(csv.split("\n")[0]).toBe("Feature,Reach,Impact,Confidence %,Effort,RICE score");
  expect(csv).toContain("New feature,10000,3,100,2,15000.0");
});

test("J5 MoSCoW → add → move → reorder → delete → reset", async ({ page }) => {
  await page.goto("/product-thinking/moscow");
  await page.getByRole("button", { name: "Reset board" }).click();
  await page.getByLabel("New item").fill("Offline mode");
  await page.getByLabel("Column", { exact: true }).selectOption("could");
  await page.getByRole("button", { name: "Add item" }).click();
  const could = page.locator('[data-col="could"]');
  await expect(could).toContainText("Offline mode");
  await page.getByRole("button", { name: "Move Offline mode to previous column" }).click();
  await expect(page.locator('[data-col="should"]')).toContainText("Offline mode");
  await page.getByRole("button", { name: "Move Offline mode up" }).click();
  await expect(page.locator('[data-col="should"] [data-testid="moscow-item"]').first()).toContainText("Offline mode");
  await page.getByRole("button", { name: "Delete Offline mode" }).click();
  await expect(page.getByTestId("moscow-item").filter({ hasText: "Offline mode" })).toHaveCount(0);
  await expect(page.getByRole("status").filter({ hasText: "Deleted" })).toHaveText("Deleted “Offline mode”");
  await page.getByRole("button", { name: "Edit Sign-in" }).click();
  await page.getByLabel("Edit item").fill("Sign-in with email");
  await page.getByLabel("Edit item").press("Enter");
  await expect(page.locator('[data-col="must"]')).toContainText("Sign-in with email");
});

test("J6 PRD builder → enter details → export Markdown", async ({ page }) => {
  await page.goto("/product-thinking/prd");
  await page.getByRole("button", { name: "Reset" }).click();
  await expect(page.getByRole("button", { name: "Export Markdown" })).toBeDisabled();
  await page.getByLabel("Title").fill("Handover pack");
  await page.getByLabel("Problem").fill("Care resets to Day 1 when an attendant changes.");
  await page.getByLabel("Requirements 1", { exact: true }).fill("Generate a pack on every attendant change");
  const [dl] = await Promise.all([page.waitForEvent("download"), page.getByRole("button", { name: "Export Markdown" }).click()]);
  expect(dl.suggestedFilename()).toBe("prd-handover-pack.md");
  const md = fs.readFileSync((await dl.path())!, "utf8");
  expect(md).toContain("# PRD: Handover pack");
  expect(md).toContain("- Generate a pack on every attendant change");
});

test("J7 research → filter → article → back to library", async ({ page }) => {
  await page.goto("/research");
  await page.getByLabel("Category").selectOption("Healthcare");
  await expect(page.getByRole("status").filter({ hasText: /of 90 studies/ })).toContainText("24 of 90");
  await page.getByLabel("Evidence level").selectOption("VERIFIED");
  await expect(page).toHaveURL(/category=Healthcare.*evidence=VERIFIED|evidence=VERIFIED.*category=Healthcare/);
  await page.locator('a[href^="/research/"]').first().click();
  await expect(page.getByTestId("study-text")).not.toBeEmpty();
  await expect(page.getByRole("link", { name: "View source on GitHub" })).toHaveAttribute("href", /^https:\/\/github\.com\/gaurav-product\/product-management-case-studies\/blob\/[0-9a-f]{40}\//);
  await page.getByRole("link", { name: "Research library" }).click();
  await expect(page).toHaveURL(/\/research$/);
});

test("J8 Ask Gaurav → grounded answer, refusal, clear", async ({ page }) => {
  await page.goto("/ask");
  await page.getByRole("button", { name: "Tell me about Evamastu." }).click();
  await expect(page.getByTestId("ask-answer")).toContainText("20–25%");
  await page.getByLabel("Your question").fill("What is Aaroh's revenue?");
  await page.getByRole("button", { name: "Send" }).click();
  await expect(page.getByTestId("ask-refused")).toContainText("no live users and no revenue");
  await page.getByLabel("Your question").press("Enter");
  await expect(page.getByRole("alert")).toHaveText("Type a question first.");
  await page.getByRole("button", { name: "Clear conversation" }).click();
  await expect(page.getByTestId("ask-answer")).toHaveCount(0);
});

test("J9 explore → select district → open content → reset camera", async ({ page }) => {
  const errs = noErrors(page);
  await page.goto("/explore");
  const district = page.getByRole("navigation", { name: "Districts" }).getByRole("button", { name: /AI & Safety Lab/ });
  await district.click();
  await expect(page).toHaveURL(/d=ai-safety-lab/);
  const panel = page.getByTestId("district-panel");
  await expect(panel).toContainText("GharGyaan");
  if (!isMobile(page)) {
    await expect(page.getByTestId("scene").locator("canvas")).toBeVisible();
    await page.getByRole("button", { name: "Reset camera" }).click();
    await expect(page).not.toHaveURL(/d=/);
    await district.click();
  }
  await expect(panel).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(panel).toHaveCount(0);
  await district.click();
  await panel.getByRole("link", { name: /GharGyaan/ }).click();
  await expect(page).toHaveURL(/\/projects\/ghargyaan$/);
  expect(errs.filter((e) => !/WebGL|GPU|context/i.test(e))).toEqual([]);
});

test("J10 menu → project → back → contact", async ({ page }) => {
  await page.goto("/?nointro");
  await openNav(page, "Projects");
  await page.getByRole("button", { name: "AI", exact: true }).click();
  await expect(page).toHaveURL(/filter=AI/);
  await page.getByRole("link", { name: "GharGyaan", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1, name: "GharGyaan" })).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/filter=AI/);
  await openNav(page, "Contact");
  await expect(page.getByRole("link", { name: /gauravkumarsingh773@gmail.com/ }).first()).toHaveAttribute("href", "mailto:gauravkumarsingh773@gmail.com");
  await page.getByRole("button", { name: "Open in my email app" }).click();
  await expect(page.getByText("Please enter your name.")).toBeVisible();
  await expect(page.getByLabel("Your name")).toHaveAttribute("aria-invalid", "true");
});

test("J11 product orbit — select and arrow-key through domains", async ({ page }) => {
  await page.goto("/product-thinking");
  const tabs = page.getByRole("tablist", { name: "Product Orbit domains" });
  await tabs.getByRole("tab", { name: "AI" }).click();
  await expect(page.locator("#orbit-panel")).toContainText("amplify reasoning");
  await page.keyboard.press("ArrowRight");
  await expect(tabs.getByRole("tab", { name: "HEALTHCARE" })).toHaveAttribute("aria-selected", "true");
  await expect(page.locator("#orbit-panel")).toContainText("trust, safety");
});
