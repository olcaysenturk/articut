import { MobileStickyHeader } from "@/components/layout/MobileStickyHeader";
import { FeatureSection } from "@/components/sections/features/FeatureSection";
import { MOBILE_CUTPILOT_FEATURE_CONFIG } from "@/components/sections/home-landing/feature-configs";
import { DesktopImageShowcase } from "@/components/sections/home-landing/desktop/DesktopImageShowcase";
import { MobileFooter } from "@/components/sections/home-landing/mobile/MobileFooter";
import { MobileHeroVideo } from "@/components/sections/home-landing/mobile/MobileHeroVideo";
import { MobilePackShowcase } from "@/components/sections/home-landing/mobile/MobilePackShowcase";
import { MobileProductSection } from "@/components/sections/home-landing/mobile/MobileProductSection";
import type { CmsContent } from "@/types/cms";
import type { Product } from "@/types/shopify";

export function MobileHome({ cmsContent, product }: { cmsContent: CmsContent; product: Product }) {
  return (
    <div id="mobile-home" className="relative w-full overflow-hidden bg-white text-[#e04d26]">
      <MobileStickyHeader />
      <MobileHeroVideo
        posterUrl={cmsContent.home.mobileHeroPoster.src}
        videoUrl={cmsContent.home.mobileHeroVideoUrl}
        fullscreenVideoUrl={cmsContent.home.mobileHeroFullscreenVideoUrl}
      />
      <FeatureSection config={MOBILE_CUTPILOT_FEATURE_CONFIG} />
      <MobileProductSection product={product} image={cmsContent.home.productImage} />
      <MobilePackShowcase
        imageAlt={cmsContent.home.mobilePackShowcaseImage.alt}
        imageSrc={cmsContent.home.mobilePackShowcaseImage.src}
      />
      <DesktopImageShowcase
        images={cmsContent.home.imageShowcase}
        className="relative h-[580px] w-full overflow-hidden bg-black"
      />
      <MobileFooter />
    </div>
  );
}
