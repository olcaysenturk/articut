import { expect, test } from "@playwright/test";

test("product media gallery has no vertical gutters", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/cutpilot", { waitUntil: "domcontentloaded" });
  const gallery = page.getByRole("region", { name: "Product media gallery" });
  await gallery.scrollIntoViewIfNeeded();
  await expect(gallery).toHaveCSS("opacity", "1");
  await expect.poll(() => gallery.locator("img").first().evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
  const metrics = await gallery.evaluate((section) => {
    const strip = section.firstElementChild!;
    const bounds = section.getBoundingClientRect();
    const row = strip.getBoundingClientRect();
    return {
      height: bounds.height, row: row.height, top: row.top - bounds.top, bottom: bounds.bottom - row.bottom,
      cards: Array.from(strip.children).map((card) => {
        const b = card.getBoundingClientRect();
        const media = card.querySelector("img,video") as HTMLImageElement | HTMLVideoElement;
        return { width: b.width, height: b.height, top: b.top - row.top, bottom: row.bottom - b.bottom, ratio: media instanceof HTMLImageElement ? media.naturalWidth / media.naturalHeight : media.videoWidth / media.videoHeight };
      }),
    };
  });
  expect(metrics.top).toBe(3);
  expect(metrics.bottom).toBe(3);
  await expect(gallery.locator("img").first()).toHaveCSS("object-fit", "cover");
  for (const card of metrics.cards) {
    expect(card.top).toBeCloseTo(0, 1);
    expect(card.bottom).toBeCloseTo(0, 1);
  }
});
