import { DesktopHome } from "@/components/sections/home-landing/desktop/DesktopHome";
import { MobileHome } from "@/components/sections/home-landing/mobile/MobileHome";
import type { CmsContent } from "@/types/cms";
import type { Product } from "@/types/shopify";

type HomeLandingProps = {
  cmsContent: CmsContent;
  product: Product;
};

export function HomeLanding({ cmsContent, product }: HomeLandingProps) {
  return (
    <>
      <DesktopHome cmsContent={cmsContent} product={product} />
      <div className="md:hidden">
        <MobileHome cmsContent={cmsContent} product={product} />
      </div>
    </>
  );
}
