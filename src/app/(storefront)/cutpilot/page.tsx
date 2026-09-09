import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VideoLoadingGate } from "@/components/loading/VideoLoadingGate";
import { CutpilotProductPage } from "@/components/product-detail/CutpilotProductPage";
import { getRevealSections } from "@/lib/product-reveal";
import { getCmsContent } from "@/lib/cms-content";
import { env } from "@/lib/env";
import { toProduct } from "@/lib/shopify/mappers";
import { getProductByHandle } from "@/lib/shopify/queries/product";

export const dynamic = "force-dynamic";

async function loadProduct() {
  const shopifyProduct = await getProductByHandle(env.SHOPIFY_PRODUCT_HANDLE);

  if (!shopifyProduct) {
    notFound();
  }

  return toProduct(shopifyProduct);
}

export async function generateMetadata(): Promise<Metadata> {
  const product = await loadProduct();

  return {
    title: product.title,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: product.images[0] ? [product.images[0].url] : [],
    },
  };
}

export default async function CutpilotPage() {
  const [cmsContent, product] = await Promise.all([getCmsContent(), loadProduct()]);

  return (
    <VideoLoadingGate>
      <CutpilotProductPage
      mediaStrip={cmsContent.productDetail.mediaStrip}
      packageImage={cmsContent.productDetail.packageImage}
      featureBackground={cmsContent.productDetail.featureBackground}
      featureBackgroundMobile={cmsContent.productDetail.featureBackgroundMobile}
      featureTexts={cmsContent.productDetail.featureTexts}
      revealSections={getRevealSections(cmsContent.productDetail, "desktop")}
      revealSectionsMobile={getRevealSections(cmsContent.productDetail, "mobile")}
      product={product}
        sliderImages={cmsContent.productDetail.slider}
        steps={cmsContent.productDetail.steps}
      />
    </VideoLoadingGate>
  );
}
