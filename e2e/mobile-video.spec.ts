import { expect, test } from "@playwright/test";
import cmsContent from "../data/cms-content.json";

test("mobile hero stays 4:5 and opens the separate 9:16 edit in fullscreen", async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/");
  await expect(page.locator('[aria-hidden="true"].relative.grid.h-dvh')).toBeHidden({ timeout: 15000 });
  const hero = page.locator("#mobile-home .mobile-hero-video");
  const inline = hero.locator(":scope > video");
  for (const width of [320, 393, 767]) {
    await page.setViewportSize({ width, height: 852 });
    const box = await hero.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width / box!.height).toBeCloseTo(4 / 5, 3);
    const next = await page.locator("#cutpilot-mobile").boundingBox();
    expect(next!.y).toBeCloseTo(box!.y + box!.height, 1);
  }
  await page.setViewportSize({ width: 393, height: 852 });
  await expect(inline).toHaveAttribute("src", cmsContent.home.mobileHeroVideoUrl);
  await expect.poll(() => inline.evaluate((video: HTMLVideoElement) => video.readyState)).toBeGreaterThanOrEqual(1);
  await inline.evaluate((video: HTMLVideoElement) => { video.pause(); video.currentTime = 12; });
  await hero.getByRole("button", { name: "Enter fullscreen", exact: true }).click();
  const dialog = hero.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect.poll(() => page.evaluate(() => document.fullscreenElement?.getAttribute("aria-label"))).toBe("Fullscreen video");
  const portrait = dialog.locator("video");
  await expect(portrait).toHaveAttribute("src", cmsContent.home.mobileHeroFullscreenVideoUrl);
  await expect.poll(() => portrait.evaluate((video: HTMLVideoElement) => video.videoWidth / video.videoHeight)).toBeCloseTo(9 / 16, 3);
  await expect.poll(() => portrait.evaluate((video: HTMLVideoElement) => video.currentTime)).toBeCloseTo(12, 0);
  await portrait.evaluate((video: HTMLVideoElement) => { video.currentTime = 24; });
  await dialog.getByRole("button", { name: "Exit fullscreen" }).click();
  await expect(dialog).toBeHidden();
  await expect.poll(() => inline.evaluate((video: HTMLVideoElement) => video.currentTime)).toBeCloseTo(24, 0);
});
