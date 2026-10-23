import { expect, test, type Page } from "@playwright/test";

async function sections(page: Page) {
  return page.locator("#mobile-home").evaluate((root) =>
    Array.from(root.children)
      .filter((element) => element.matches("section, footer, div") && element.getBoundingClientRect().height > 0)
      .map((element) => {
        const box = element.getBoundingClientRect();
        return { top: box.top + window.scrollY, bottom: box.bottom + window.scrollY, height: box.height };
      }),
  );
}

async function expectContinuousFlow(page: Page) {
  const boxes = await sections(page);
  expect(boxes).toHaveLength(6);
  for (let index = 1; index < boxes.length; index++) {
    expect(boxes[index].top).toBeCloseTo(boxes[index - 1].bottom, 1);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(await page.evaluate(() => window.innerWidth));
  return boxes;
}

test("mobile sections reflow when hero height and feature copy grow", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/");
  await expect(page.locator('[aria-hidden="true"].relative.grid.h-dvh')).toBeHidden({ timeout: 15000 });

  for (const width of [320, 393, 767]) {
    await page.setViewportSize({ width, height: 852 });
    await expectContinuousFlow(page);
  }
  await page.setViewportSize({ width: 393, height: 852 });
  await page.screenshot({ path: "/private/tmp/cutpilot-mobile-layout.png", fullPage: true });
  const before = await expectContinuousFlow(page);
  await page.locator(".mobile-hero-video").evaluate((hero) => { hero.style.aspectRatio = "1 / 2"; });
  const tallerHero = await expectContinuousFlow(page);
  const increase = tallerHero[0].height - before[0].height;
  expect(increase).toBeGreaterThan(200);
  for (let index = 1; index < tallerHero.length; index++) {
    expect(tallerHero[index].top - before[index].top).toBeCloseTo(increase, 1);
  }

  await page.locator("#cutpilot-mobile [data-feature-item] span:last-child").first().evaluate((copy) => {
    copy.textContent = "Longer translated feature content that must wrap naturally without overlapping the next element. ".repeat(15);
  });
  const longerCopy = await expectContinuousFlow(page);
  expect(longerCopy[1].height).toBeGreaterThan(tallerHero[1].height);
  const details = await page.locator("#cutpilot-mobile ul").boundingBox();
  const cta = await page.locator('#cutpilot-mobile a[href="/cutpilot"]').boundingBox();
  expect(cta!.y).toBeGreaterThanOrEqual(details!.y + details!.height);
  const feature = await page.locator("#cutpilot-mobile").boundingBox();
  expect(cta!.y + cta!.height).toBeLessThanOrEqual(feature!.y + feature!.height);

  const footer = page.locator("#about-mobile");
  await footer.getByRole("navigation", { name: "Footer help and policies" }).evaluate((nav) => {
    const extra = document.createElement("p");
    extra.textContent = "Additional policy information. ".repeat(15);
    nav.append(extra);
  });
  const nav = await footer.getByRole("navigation", { name: "Footer help and policies" }).boundingBox();
  const mark = await footer.locator('img[src*="footer-mobile-mark"]').boundingBox();
  expect(mark!.y).toBeGreaterThanOrEqual(nav!.y + nav!.height);
});
