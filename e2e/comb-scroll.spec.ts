import { expect, test } from "@playwright/test";

for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  test(`comb motion follows scroll after layout changes (${viewport.width}px)`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/cutpilot", { waitUntil: "domcontentloaded" });
    const stage = page.locator("[data-comb-stage]");
    const comb = page.locator("[data-comb-left]");
    await expect(comb).toHaveAttribute("style", /transform:/);

    const angle = () => comb.evaluate((element) => {
      const matrix = new DOMMatrixReadOnly(getComputedStyle(element).transform);
      return Math.atan2(matrix.b, matrix.a) * 180 / Math.PI;
    });
    const scrollTo = async (fraction: number) => {
      await stage.evaluate((element, fraction) => {
        window.scrollBy({ top: element.getBoundingClientRect().top - innerHeight * fraction, behavior: "instant" });
      }, fraction);
    };

    // Poll the position too: lazy media above the stage may still be loading.
    await expect.poll(async () => {
      await scrollTo(0.6);
      return angle();
    }).toBeGreaterThan(10);
    await expect.poll(angle).toBeLessThan(25);
    const middleAngle = await angle();

    // Reproduce a late-loading block changing the section's document position.
    await page.locator("[data-comb-callout-section]").evaluate((section) => {
      const spacer = document.createElement("div");
      spacer.style.height = "500px";
      section.before(spacer);
    });
    await expect.poll(async () => {
      await scrollTo(0.6);
      return Math.abs((await angle()) - middleAngle);
    }).toBeLessThan(1);

    await scrollTo(0.25);
    await expect.poll(angle).toBeLessThan(1);
    await scrollTo(0.6);
    await expect.poll(async () => Math.abs((await angle()) - middleAngle)).toBeLessThan(1);
    await scrollTo(0.96);
    await expect.poll(angle).toBeGreaterThan(34);
  });
}
