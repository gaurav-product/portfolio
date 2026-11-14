#!/usr/bin/env node
/** Prints the built /cv route to public/media/gaurav-kumar-singh-cv.pdf (and the
 *  build). The CV is rendered from the same content as the site — no phone number. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import { start } from "./serve.mjs";
const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const server = await start(4199);
const local = process.env.CHROME_PATH || "/opt/pw-browsers/chromium";
const browser = await chromium.launch(fs.existsSync(local) ? { executablePath: local } : {});
const page = await browser.newPage();
await page.goto("http://127.0.0.1:4199/cv", { waitUntil: "networkidle" });
const text = await page.locator("#cv").innerText();
if (/\+91|81275/.test(text)) throw new Error("CV contains a phone number — refusing to publish");
const pdf = await page.pdf({ format: "A4", printBackground: true, margin: { top: "10mm", bottom: "10mm", left: "10mm", right: "10mm" } });
for (const out of ["public/media/gaurav-kumar-singh-cv.pdf", "build/client/media/gaurav-kumar-singh-cv.pdf"]) {
  fs.mkdirSync(path.dirname(path.join(APP, out)), { recursive: true });
  fs.writeFileSync(path.join(APP, out), pdf);
}
console.log(`cv: ${(pdf.length / 1024).toFixed(0)} KB, phone-free`);
await browser.close(); server.close();
