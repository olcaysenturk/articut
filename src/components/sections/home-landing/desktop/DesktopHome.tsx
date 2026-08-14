import { FeatureSection } from "@/components/sections/features/FeatureSection";
import { HeroProductReveal } from "@/components/sections/hero/HeroProductReveal";
import { HeaderOverlay } from "@/components/sections/home-landing/HeaderOverlay";
import { DESKTOP_CUTSCISSORS_FEATURE_CONFIG } from "@/components/sections/home-landing/feature-configs";
import { DesktopPackShowcase } from "@/components/sections/home-landing/desktop/DesktopPackShowcase";
import { DesktopProductSection } from "@/components/sections/home-landing/desktop/DesktopProductSection";
import { FooterBand } from "@/components/sections/home-landing/desktop/FooterBand";
import type { Product } from "@/types/shopify";

export function DesktopHome({ product }: { product: Product }) {
  return (
    <div className="hidden bg-white text-[#e04d26] md:block">
      <HeroProductReveal header={<HeaderOverlay />} />
      <DesktopProductSection product={product} />
      <DesktopPackShowcase />
      <FeatureSection config={DESKTOP_CUTSCISSORS_FEATURE_CONFIG} />
      <FooterBand />
    </div>
  );
}
