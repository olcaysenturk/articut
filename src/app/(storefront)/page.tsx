import type { Metadata } from "next";
import { VideoLoadingGate } from "@/components/loading/VideoLoadingGate";
import { HomeLanding } from "@/components/sections/home-landing/HomeLanding";
import { CutpilotStructuredData, cutpilotMetadata, loadCutpilot } from "@/lib/cutpilot-seo";
import { getCmsContent } from "@/lib/cms-content";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return cutpilotMetadata(await loadCutpilot(), "/");
}

export default async function HomePage() {
  const [cmsContent, product] = await Promise.all([getCmsContent(), loadCutpilot()]);

  return (
    <VideoLoadingGate>
      <CutpilotStructuredData product={product} path="/" />
      <HomeLanding cmsContent={cmsContent} product={product} />
    </VideoLoadingGate>
  );
}
