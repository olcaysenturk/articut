import { HeroProductReveal } from "@/components/sections/hero/HeroProductReveal";
import { HeaderOverlay } from "@/components/sections/home-landing/HeaderOverlay";
import { DesktopImageShowcase } from "@/components/sections/home-landing/desktop/DesktopImageShowcase";
import { DesktopPackShowcase } from "@/components/sections/home-landing/desktop/DesktopPackShowcase";
import { DesktopProductSection } from "@/components/sections/home-landing/desktop/DesktopProductSection";
import { FooterBand } from "@/components/sections/home-landing/desktop/FooterBand";
import type { CmsContent } from "@/types/cms";
import type { Product } from "@/types/shopify";

export function DesktopHome({ cmsContent, product }: { cmsContent: CmsContent; product: Product }) {
  return (
    <div className="hidden bg-white text-[#e04d26] md:block">
      <HeroProductReveal
        header={<HeaderOverlay />}
        posterUrl={cmsContent.home.heroPoster.src}
        videoUrl={cmsContent.home.heroVideoUrl}
      />
      <DesktopProductSection product={product} />
      <DesktopPackShowcase
        imageAlt={cmsContent.home.packShowcaseImage.alt}
        imageSrc={cmsContent.home.packShowcaseImage.src}
      />
      <DesktopImageShowcase images={cmsContent.home.imageShowcase} />
      <FooterBand />
    </div>
  );
}
