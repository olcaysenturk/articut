import type { Metadata } from "next";
import { VideoLoadingGate } from "@/components/loading/VideoLoadingGate";
import { CutpilotProductPage } from "@/components/product-detail/CutpilotProductPage";
import { getRevealSections } from "@/lib/product-reveal";
import { CutpilotStructuredData, cutpilotMetadata, loadCutpilot } from "@/lib/cutpilot-seo";
import { getCmsContent } from "@/lib/cms-content";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return cutpilotMetadata(await loadCutpilot(), "/cutpilot");
}

export default async function CutpilotPage() {
  const [cmsContent, product] = await Promise.all([getCmsContent(), loadCutpilot()]);

  return (
    <VideoLoadingGate>
      <CutpilotStructuredData product={product} />
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
        faq={cmsContent.productDetail.faq}
      />
    </VideoLoadingGate>
  );
}
