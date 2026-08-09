import { expect, test } from "@playwright/test";

test("ana sayfa açılıyor ve ürün görünüyor", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toBeVisible();
});

test("her wheel hareketi yalnızca bir sonraki bölüme geçiyor", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const sections = page.locator("[data-snap-section]");
  await expect(sections).toHaveCount(6);
  await expect
    .poll(() =>
      sections.evaluateAll((items) =>
        items.slice(0, -1).every((section) => section.getBoundingClientRect().height === 900),
      ),
    )
    .toBe(true);
  await expect.poll(() => sections.last().evaluate((section) => section.getBoundingClientRect().height)).toBe(690);

  await page.mouse.wheel(0, 1);
  await page.waitForTimeout(100);
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  await expect
    .poll(() => sections.nth(1).evaluate((section) => Math.abs(section.getBoundingClientRect().top)))
    .toBeLessThan(2);

  await page.waitForTimeout(2500);
  expect(await sections.nth(1).evaluate((section) => Math.abs(section.getBoundingClientRect().top))).toBeLessThan(2);

  await page.mouse.wheel(0, 500);
  await expect
    .poll(() => sections.nth(2).evaluate((section) => Math.abs(section.getBoundingClientRect().top)))
    .toBeLessThan(2);

  await page.waitForTimeout(1200);
  await page.mouse.wheel(0, -500);
  await expect
    .poll(() => sections.nth(1).evaluate((section) => Math.abs(section.getBoundingClientRect().top)))
    .toBeLessThan(2);
});

test("footer sonrası ilk yukarı wheel hareketi beklemeden çalışıyor", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const sections = page.locator("[data-snap-section]");
  await sections.nth(4).evaluate((section) => section.scrollIntoView({ behavior: "instant" }));

  await page.mouse.wheel(0, 1);
  await page.waitForTimeout(500);
  await page.mouse.wheel(0, -1);

  await expect
    .poll(() => sections.nth(4).evaluate((section) => Math.abs(section.getBoundingClientRect().top)))
    .toBeLessThan(2);
});

test("ardışık yukarı scroll hareketleri tıklama olmadan ilerliyor", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const sections = page.locator("[data-snap-section]");
  await sections.nth(4).evaluate((section) => section.scrollIntoView({ behavior: "instant" }));

  await page.mouse.wheel(0, -1);
  await page.waitForTimeout(250);
  await page.mouse.wheel(0, -1);

  await expect
    .poll(() => sections.nth(2).evaluate((section) => Math.abs(section.getBoundingClientRect().top)))
    .toBeLessThan(2);
});

test("ikinci bölüm animasyonu her girişte yeniden başlıyor", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const sections = page.locator("[data-snap-section]");
  const heading = sections.nth(1).locator("h1");
  const headingLines = heading.locator("[data-heading-line]");
  const firstLine = headingLines.first();
  const cta = sections.nth(1).getByRole("link", { name: "Explore Cutpilot™" });
  const opacity = () => firstLine.evaluate((element) => Number(getComputedStyle(element).opacity));
  const ctaOpacity = () => cta.evaluate((element) => Number(getComputedStyle(element).opacity));

  await expect
    .poll(() =>
      headingLines.evaluateAll((lines) => lines.map((line) => Number(getComputedStyle(line).opacity))),
    )
    .toEqual([0.2, 0.4, 0.6]);

  await sections.nth(1).evaluate((section) => section.scrollIntoView({ behavior: "instant" }));
  await page.waitForTimeout(3400);
  expect(await ctaOpacity()).toBe(0);
  await expect.poll(ctaOpacity).toBe(1);
  await expect.poll(opacity).toBe(1);

  await page.mouse.wheel(0, 1);
  await page.waitForTimeout(450);
  expect(await opacity()).toBe(1);

  await expect
    .poll(() => sections.nth(2).evaluate((section) => Math.abs(section.getBoundingClientRect().top)))
    .toBeLessThan(2);
  await expect.poll(opacity).toBe(0.2);

  await sections.nth(1).evaluate((section) => section.scrollIntoView({ behavior: "instant" }));
  await expect.poll(opacity).toBe(1);
});

test("mobil menü açılıp kapanıyor", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await page.getByLabel("Open menu").click();
  await expect(page.getByLabel("Mobile navigation")).toBeVisible();

  await page.getByLabel("Close menu").click();
  await expect(page.getByLabel("Mobile navigation")).toBeHidden();
});
