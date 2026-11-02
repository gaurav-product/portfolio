import { defineConfig, devices } from "@playwright/test";
import fs from "node:fs";
/** Use a pre-installed Chromium when one exists (this repo's cloud sandbox); otherwise Playwright's own. */
const local = process.env.CHROME_PATH || "/opt/pw-browsers/chromium";
const exe = fs.existsSync(local) ? local : undefined;
export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60_000,
  fullyParallel: true,
  reporter: [["list"], ["json", { outputFile: "reports/e2e-results.json" }]],
  use: { baseURL: "http://127.0.0.1:4173", launchOptions: { executablePath: exe }, trace: "off" },
  webServer: { command: "node scripts/serve.mjs", url: "http://127.0.0.1:4173/", reuseExistingServer: true, timeout: 30_000 },
  projects: [
    { name: "desktop", use: { viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"], launchOptions: { executablePath: exe } }, testMatch: /journeys|refinements|controls/ },
  ],
});
