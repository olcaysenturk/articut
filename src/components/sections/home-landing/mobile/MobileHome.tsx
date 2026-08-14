import { FeatureSection } from "@/components/sections/features/FeatureSection";
import { MobileStickyHeader } from "@/components/layout/MobileStickyHeader";
import {
  MOBILE_CUTPILOT_FEATURE_CONFIG,
  MOBILE_CUTSCISSORS_FEATURE_CONFIG,
} from "@/components/sections/home-landing/feature-configs";
import { MobileFooter } from "@/components/sections/home-landing/mobile/MobileFooter";
import { MobileHeroVideo } from "@/components/sections/home-landing/mobile/MobileHeroVideo";
import { MobilePackShowcase } from "@/components/sections/home-landing/mobile/MobilePackShowcase";
import { MobileProductSection } from "@/components/sections/home-landing/mobile/MobileProductSection";
import type { Product } from "@/types/shopify";

export function MobileHome({ product }: { product: Product }) {
  return (
    <div id="mobile-home" className="relative h-[3280px] w-full overflow-hidden bg-white text-[#e04d26]">
      <MobileStickyHeader />
      <MobileHeroVideo />
      <FeatureSection config={MOBILE_CUTPILOT_FEATURE_CONFIG} />
      <MobileProductSection product={product} />
      <MobilePackShowcase />
      <FeatureSection config={MOBILE_CUTSCISSORS_FEATURE_CONFIG} />
      <MobileFooter />
    </div>
  );
}
