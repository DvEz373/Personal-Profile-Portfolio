import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const pages = ["", "experience/", "education/", "projects/", "projects/sonodirect/", "skills/", "about/"];

function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  return errors;
}

for (const path of pages) {
  test(`page /${path} renders without errors or sideways scroll`, async ({ page }) => {
    const errors = collectErrors(page);
    const res = await page.goto(path);
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    expect(errors).toEqual([]);
  });

  test(`page /${path} has no serious accessibility violations`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
  });
}

test("content is in the HTML before any JavaScript runs", async ({ request }) => {
  const html = await (await request.get("")).text();
  expect(html).toMatch(/<h1[^>]*>Devin Ezekiel Purba<\/h1>/);
  const exp = await (await request.get("experience/")).text();
  expect(exp).toContain("Power System Engineer");
  expect(exp).toContain('property="og:image"');
});

test("command palette opens with the keyboard and navigates", async ({ page, isMobile }) => {
  test.skip(isMobile, "keyboard shortcut is a desktop feature");
  await page.goto("");
  await page.keyboard.press("Control+k");
  await expect(page.locator("[data-cmdk]")).toHaveAttribute("open", "");
  await page.keyboard.type("sono");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/projects\/sonodirect\/$/);
  await expect(page.locator("h1")).toHaveText("SonoDirect");
});

test("search button opens the palette", async ({ page }) => {
  await page.goto("");
  await page.locator("header [data-cmdk-open]").click();
  await expect(page.locator("[data-cmdk]")).toHaveAttribute("open", "");
  await expect(page.locator("[data-cmdk-list] [role=option]").first()).toBeVisible();
});

test("theme choice survives navigation", async ({ page }) => {
  await page.goto("");
  const before = await page.evaluate(() => document.documentElement.dataset.theme);
  await page.locator("[data-theme-toggle]").click();
  const after = await page.evaluate(() => document.documentElement.dataset.theme);
  expect(after).not.toBe(before);
  await page.goto("skills/");
  expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe(after);
});

test("experience filters and the career chart work", async ({ page }) => {
  await page.goto("experience/");
  await page.locator('[data-filter="internship"]').click();
  await expect(page.locator("[data-shown]")).toHaveText("Showing 2 of 7");
  await page.locator('[data-filter="all"]').click();
  await page.locator('.bar[data-target="teep-ntust"]').click();
  await expect(page.locator("#teep-ntust details")).toHaveAttribute("open", "");
});

test("instrument trips, reports a nadir and settles with the controller on", async ({ page }) => {
  await page.goto("");
  await page.locator('[data-ctl="on"]').click();
  await expect(page.locator('[data-ctl="on"]')).toHaveAttribute("aria-pressed", "true");
  await page.locator("[data-instrument]").scrollIntoViewIfNeeded();
  await page.locator("[data-trip]").click();
  await expect(page.locator("[data-settle]")).toHaveText(/^\d+\.\d$/, { timeout: 10_000 });
  const nadir = Number(await page.locator("[data-nadir]").textContent());
  expect(nadir).toBeGreaterThan(49.5);
  expect(nadir).toBeLessThan(50);
});

test("reduced motion: instrument is static and still answers a trip", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("");
  await expect(page.locator("[data-status]")).toHaveText("■ STATIC");
  await expect(page.locator("[data-run]")).toBeHidden();
  await page.locator("[data-trip]").click();
  await expect(page.locator("[data-nadir]")).toHaveText(/^49\.\d\d$/);
  await context.close();
});

test("contact card is a valid vCard", async ({ request }) => {
  const res = await request.get("devin-ezekiel-purba.vcf");
  expect(res.status()).toBe(200);
  const body = await res.text();
  expect(body.startsWith("BEGIN:VCARD\r\nVERSION:3.0\r\n")).toBe(true);
  expect(body).toContain("FN:Devin Ezekiel Purba");
  expect(body).toContain("TEL;TYPE=CELL:+6281291615474");
  expect(body.trimEnd().endsWith("END:VCARD")).toBe(true);
});

test("unknown pages show the 404 page", async ({ page }) => {
  const res = await page.goto("no-such-page/");
  expect(res?.status()).toBe(404);
  await expect(page.locator("h1")).toHaveText("This page isn't connected.");
});
