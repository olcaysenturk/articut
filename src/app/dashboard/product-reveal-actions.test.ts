import { beforeEach, expect, it, vi } from "vitest";
import { saveProductDetailContentAction } from "./actions";

const mocks = vi.hoisted(() => ({ get: vi.fn(), save: vi.fn(), upload: vi.fn() }));
vi.mock("@/lib/cms-content", () => ({ getCmsContent: mocks.get, saveCmsContent: mocks.save }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/netlify-blobs", () => ({ uploadCmsMedia: mocks.upload, cmsMediaUrl: (key: string) => `/media/${key}` }));

const image = { src: "/old.jpg", alt: "Old image" };
const detail = {
  featureBackground: image, featureTexts: ["Original"],
  packageImage: image, combsImage: image,
  productReveal: [image], productRevealMobile: [image], slider: [image], mediaStrip: [],
};

beforeEach(() => {
  vi.clearAllMocks();
  mocks.get.mockResolvedValue({ productDetail: detail });
  mocks.upload.mockResolvedValue({ key: "uploaded.jpg" });
});

it("saves ordered single/grid sections for both viewports and uploaded images", async () => {
  const form = new FormData();
  form.set("reveal-sections", JSON.stringify([
    { layout: "single", images: [image] },
    { layout: "grid", images: [image, { src: "", alt: "New image" }] },
  ]));
  form.set("reveal-sections-mobile", JSON.stringify([{ layout: "single", images: [image] }]));
  form.set("reveal-sections-1-1-file", new File(["image"], "new.jpg", { type: "image/jpeg" }));
  await saveProductDetailContentAction(form);
  expect(mocks.save).toHaveBeenCalledWith({ productDetail: expect.objectContaining({
    combsImage: image,
    revealSections: [
      { layout: "single", images: [image] },
      { layout: "grid", images: [image, { src: "/media/uploaded.jpg", alt: "New image" }] },
    ],
    revealSectionsMobile: [{ layout: "single", images: [image] }],
  }) });
});

it("saves an explicitly empty section list", async () => {
  const form = new FormData();
  form.set("reveal-sections", "[]");
  await saveProductDetailContentAction(form);
  expect(mocks.save).toHaveBeenCalledWith({ productDetail: expect.objectContaining({ revealSections: [] }) });
});

it("saves the feature background and ordered text lines", async () => {
  const form = new FormData();
  form.set("product-feature-background-src", "/new-background.jpg");
  form.set("product-feature-background-alt", "Product in use");
  form.set("product-feature-texts", " First message \r\n\nSecond message\nThird message");
  await saveProductDetailContentAction(form);
  expect(mocks.save).toHaveBeenCalledWith({ productDetail: expect.objectContaining({
    featureBackground: { src: "/new-background.jpg", alt: "Product in use" },
    featureTexts: ["First message", "Second message", "Third message"],
  }) });
});

it("rejects an empty feature text list", async () => {
  const form = new FormData();
  form.set("product-feature-texts", " \n ");
  await expect(saveProductDetailContentAction(form)).rejects.toThrow();
  expect(mocks.save).not.toHaveBeenCalled();
});

it("saves direct video URLs and uploaded strip videos", async () => {
  const form = new FormData();
  form.set("media-strip-0-type", "video");
  form.set("media-strip-0-src", "https://example.com/video.mp4");
  form.set("media-strip-1-type", "video");
  form.set("media-strip-1-file", new File(["video"], "reel.mp4", { type: "video/mp4" }));
  await saveProductDetailContentAction(form);
  expect(mocks.save).toHaveBeenCalledWith({ productDetail: expect.objectContaining({ mediaStrip: [
    { type: "video", src: "https://example.com/video.mp4" },
    { type: "video", src: "/media/uploaded.jpg" },
  ] }) });
});

it("saves additional images within both single and grid sections", async () => {
  const sections = [
    { layout: "single", images: [image, { src: "/second.jpg", alt: "Second" }] },
    { layout: "grid", images: [image, image, { src: "/third.jpg", alt: "Third" }] },
  ];
  const form = new FormData();
  form.set("reveal-sections", JSON.stringify(sections));
  await saveProductDetailContentAction(form);
  expect(mocks.save).toHaveBeenCalledWith({ productDetail: expect.objectContaining({ revealSections: sections }) });
});

it.each([
  { layout: "grid", images: [image] },
  { layout: "single", images: [] },
  { layout: "grid", images: [image, { src: "", alt: "Missing" }] },
])("rejects incomplete or invalid layouts before saving", async (section) => {
  const form = new FormData();
  form.set("reveal-sections", JSON.stringify([section]));
  await expect(saveProductDetailContentAction(form)).rejects.toThrow();
  expect(mocks.save).not.toHaveBeenCalled();
  expect(mocks.upload).not.toHaveBeenCalled();
});
