import { DesktopHome } from "@/components/sections/home-landing/desktop/DesktopHome";
import { MobileHome } from "@/components/sections/home-landing/mobile/MobileHome";
import type { Product } from "@/types/shopify";

type HomeLandingProps = {
  product: Product;
};

export function HomeLanding({ product }: HomeLandingProps) {
  return (
    <>
      <DesktopHome product={product} />
      <div className="md:hidden">
        <MobileHome product={product} />
      </div>
    </>
  );
}
