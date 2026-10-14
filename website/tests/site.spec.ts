import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const pages = ["", "experience/", "education/", "projects/", "projects/sonodirect/", "projects/tw-fault-locator/", "skills/", "about/", "card/", "card/print/"];

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

  test(`page /${path} has no squeezed text or leftover placeholders`, async ({ page }) => {
    await page.goto(path);
    // A text block crushed into a narrow column (one word per line) means a grid track went wrong.
    const squeezed = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>("body *")]
        .filter((el) => [...el.childNodes].some((n) => n.nodeType === 3 && (n.textContent ?? "").trim().length >= 24))
        .filter((el) => {
          const r = el.getBoundingClientRect();
          const lh = parseFloat(getComputedStyle(el).lineHeight) || parseFloat(getComputedStyle(el).fontSize) * 1.4;
          return r.width > 0 && r.width < 120 && r.height / lh >= 4;
        })
        .map((el) => (el.textContent ?? "").trim().slice(0, 40)),
    );
    expect(squeezed).toEqual([]);
    const text = await page.locator("body").innerText();
    expect(text).not.toMatch(/placeholder|image to come|replace with/i);
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

test("home shows selected work and project figures load", async ({ page }) => {
  await page.goto("");
  const cards = page.locator(`section[aria-labelledby="s-work"] .card`);
  expect(await cards.count()).toBeGreaterThanOrEqual(1);
  await cards.first().click();
  await expect(page).toHaveURL(/\/projects\/[^/]+\/$/);
  const imgs = page.locator(".lead img, .figs img");
  expect(await imgs.count()).toBeGreaterThanOrEqual(1);
  for (const img of await imgs.all()) {
    await img.scrollIntoViewIfNeeded();
    await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
    expect(await img.getAttribute("alt")).toBeTruthy();
  }
});

test("case studies state the author's own part when it is known", async ({ page }) => {
  await page.goto("projects/tw-fault-locator/");
  await expect(page.locator(".head .role")).toContainText("My part:");
  await expect(page.locator(".spec dt", { hasText: "My part" })).toHaveCount(1);
  await page.goto("projects/sonodirect/");
  await expect(page.locator(".head .role")).toHaveCount(0);
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

test("project theme filters show client and academic work together", async ({ page }) => {
  await page.goto("projects/");
  const total = await page.locator("[data-kind]").count();
  await page.locator('[data-filter="machines"]').click();
  await expect(page.locator("[data-shown]")).toHaveText(`Showing 3 of ${total}`);
  await page.locator('[data-filter="ai"]').click();
  await expect(page.locator("[data-kind~='ai']:visible")).toHaveCount(3);
  await page.locator('[data-filter="all"]').click();
  await expect(page.locator("[data-shown]")).toHaveText(`Showing ${total} of ${total}`);
});

test("the closed phone menu does not block taps on the page", async ({ page }, info) => {
  test.skip(info.project.name !== "mobile", "phone layout only");
  await page.goto("projects/");
  const hit = await page.evaluate(() => document.elementFromPoint(150, 150)?.closest(".site-header") === null);
  expect(hit).toBe(true);
});

test("project lead figures show the whole image", async ({ page }) => {
  for (const slug of ["ccgt-excitation-limiters", "datacenter-grid-compliance", "tw-fault-locator"]) {
    await page.goto(`projects/${slug}/`);
    const img = page.locator(".lead img");
    await expect(img).toBeVisible();
    await img.evaluate((el: HTMLImageElement) => el.decode());
    const [box, frame] = await Promise.all([img.boundingBox(), page.locator(".lead .figure").boundingBox()]);
    expect(box && frame).toBeTruthy();
    expect(box!.y + box!.height).toBeLessThanOrEqual(frame!.y + frame!.height + 1);
    expect(box!.x + box!.width).toBeLessThanOrEqual(frame!.x + frame!.width + 1);
  }
});

test("acronyms are expanded once, at first use", async ({ page }) => {
  await page.goto("projects/pumped-storage-dfim-model/");
  await expect(page.locator('abbr:text-is("DFIM")')).toHaveCount(1);
  await expect(page.locator('abbr:text-is("DFIM")')).toHaveAttribute("title", "doubly fed induction machine");
  expect(await page.locator("main").innerText()).toContain("PSS/E");
  await expect(page.locator('abbr:text-is("PSS")')).toHaveCount(0);
});

test("home features four client case studies", async ({ page }) => {
  await page.goto("");
  await expect(page.locator(".work > li")).toHaveCount(4);
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

test("name card links contact routes and shows a scannable QR", async ({ page, request }) => {
  await page.goto("card/");
  for (const name of ["Save contact", "Email", "WhatsApp", "LinkedIn", "Instagram", "GitHub", "Website"]) {
    await expect(page.getByRole("link", { name: new RegExp(name) }).first()).toBeVisible();
  }
  await expect(page.locator('a[href^="https://wa.me/62"]')).toHaveCount(1);
  await page.getByRole("button", { name: "Show QR" }).click();
  await expect(page.locator("dialog[open] .qr-box svg")).toBeVisible();
  const qr = await request.get("card-qr.svg");
  expect(qr.status()).toBe(200);
  expect(await qr.text()).toContain("<svg");
});
