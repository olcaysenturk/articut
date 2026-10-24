import { expect, test } from "@playwright/test";

for (const width of [1024, 1440, 1920]) {
  test(`desktop sequence stays in the viewport throughout its pinned scroll (${width}px)`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const stage = page.locator('[data-node-id="1:503"]');
    await expect(stage).toHaveAttribute("data-motion-ready", "true");
    await page.evaluate(() => document.fonts.ready);
    const start = await stage.evaluate((element) => element.parentElement!.getBoundingClientRect().top + scrollY);
    for (const offset of [100, 700, 1400]) {
      await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), start + offset);
      await expect.poll(() => stage.evaluate((element) => Math.abs(element.getBoundingClientRect().top))).toBeLessThan(2);
      await expect.poll(() => stage.locator("canvas").evaluate((element) => element.getBoundingClientRect().bottom)).toBeGreaterThan(700);
    }
    await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), start + 2500);
    await expect.poll(() => stage.evaluate((element) => element.getBoundingClientRect().bottom)).toBeLessThan(900);
    await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), start + 700);
    await expect.poll(() => stage.evaluate((element) => Math.abs(element.getBoundingClientRect().top))).toBeLessThan(2);
  });
}
