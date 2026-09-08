import { describe, expect, it } from "vitest";
import { getRevealSections } from "./product-reveal";

const image = (src: string) => ({ src, alt: src });
const detail = {
  productReveal: [image("left"), image("right"), image("extra")],
  productRevealMobile: [image("mobile-left"), image("mobile-right")],
  combsImage: image("combs"),
};

describe("product reveal compatibility", () => {
  it("preserves old images in order and appends the combs as a single section", () => {
    expect(getRevealSections(detail, "desktop")).toEqual([
      { layout: "grid", images: detail.productReveal.slice(0, 2) },
      { layout: "single", images: detail.productReveal.slice(2) },
      { layout: "single", images: [detail.combsImage] },
    ]);
    expect(getRevealSections(detail, "mobile")[0].images).toEqual(detail.productRevealMobile);
  });

  it("uses saved sections without duplicating the old combs image", () => {
    const revealSections = [{ layout: "single" as const, images: [image("new")] }];
    expect(getRevealSections({ ...detail, revealSections }, "desktop")).toEqual(revealSections);
  });

  it("does not restore sections intentionally removed from a viewport", () => {
    expect(getRevealSections({ ...detail, revealSections: [] }, "desktop")).toEqual([]);
    expect(getRevealSections({ ...detail, revealSectionsMobile: [] }, "mobile")).toEqual([]);
  });
});
