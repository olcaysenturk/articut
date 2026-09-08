import type { CmsContent, CmsRevealSection } from "@/types/cms";

export function getRevealSections(
  detail: Pick<CmsContent["productDetail"], "revealSections" | "revealSectionsMobile" | "productReveal" | "productRevealMobile" | "combsImage">,
  viewport: "desktop" | "mobile",
): CmsRevealSection[] {
  const saved = viewport === "desktop" ? detail.revealSections : detail.revealSectionsMobile;
  if (saved) return saved;

  const images = viewport === "desktop" ? detail.productReveal : detail.productRevealMobile;
  const sections: CmsRevealSection[] = [];
  for (let index = 0; index < images.length; index += 2) {
    const pair = images.slice(index, index + 2);
    sections.push({ layout: pair.length === 2 ? "grid" : "single", images: pair });
  }
  sections.push({ layout: "single", images: [detail.combsImage] });
  return sections;
}
