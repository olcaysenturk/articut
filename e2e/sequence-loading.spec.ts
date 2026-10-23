import { expect, test } from "@playwright/test";

test("desktop sequence recovers on a cold load after transient frame errors", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  const attempts = new Map<string, number>();
  await page.route("**/images/sequence/Cutpilot_3D_Desktop*.webp*", async (route) => {
    const name = new URL(route.request().url()).pathname;
    const attempt = (attempts.get(name) ?? 0) + 1;
    attempts.set(name, attempt);
    if (attempt === 1) await route.abort("failed");
    else await route.continue();
  });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const canvas = page.locator('[data-node-id="1:503"] canvas');
  await expect.poll(() => attempts.get("/images/sequence/Cutpilot_3D_Desktop124.webp") ?? 0).toBeGreaterThanOrEqual(2);
  await expect(canvas).toHaveAttribute("data-sequence-ready", "true");
  const paintedPixels = () => canvas.evaluate((element: HTMLCanvasElement) => {
    const pixels = element.getContext("2d")!.getImageData(0, 0, element.width, element.height).data;
    let colored = 0;
    for (let index = 0; index < pixels.length; index += 4) {
      if (pixels[index] > 20 || pixels[index + 1] > 20 || pixels[index + 2] > 20) colored++;
    }
    return colored;
  });
  await expect.poll(paintedPixels).toBeGreaterThan(10000);
  await canvas.evaluate((element: HTMLCanvasElement) => {
    element.getContext("2d")!.clearRect(0, 0, element.width, element.height);
    element.dispatchEvent(new Event("contextrestored"));
  });
  await expect.poll(paintedPixels).toBeGreaterThan(10000);
});

test("a delayed first load paints the current frame after the user stops scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  let releaseFrames!: () => void;
  const framesAllowed = new Promise<void>((resolve) => { releaseFrames = resolve; });
  await page.route("**/images/sequence/Cutpilot_3D_Desktop*.webp*", async (route) => {
    await framesAllowed;
    await route.continue();
  });
  try {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const section = page.locator('[data-node-id="1:503"]');
    const canvas = section.locator("canvas");
    await expect.poll(() => section.evaluate((element) => element.parentElement?.className)).toContain("pin-spacer");
    await page.evaluate(() => document.fonts.ready);
    await section.evaluate((element) => {
      window.scrollTo({ top: window.scrollY + element.getBoundingClientRect().top + innerHeight * 1.5, behavior: "instant" });
    });
    await expect(canvas).not.toHaveAttribute("data-sequence-ready", "true");
    releaseFrames();
    await expect(canvas).toHaveAttribute("data-sequence-ready", "true");
    await expect.poll(() => canvas.evaluate((element: HTMLCanvasElement) => {
      const pixels = element.getContext("2d")!.getImageData(0, 0, element.width, element.height).data;
      let colored = 0;
      for (let index = 0; index < pixels.length; index += 4) {
        if (pixels[index] > 20 || pixels[index + 1] > 20 || pixels[index + 2] > 20) colored++;
      }
      return colored;
    })).toBeGreaterThan(10000);
  } finally {
    releaseFrames();
    await page.unrouteAll({ behavior: "wait" });
  }
});
