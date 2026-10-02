import type { Metadata } from "next";
import { getCmsContent } from "@/lib/cms-content";
import { LegalPageLayout, LegalSection } from "@/components/editorial/LegalPageLayout";

export const metadata: Metadata = { title: "Safety & Usage" };

export default async function SafetyUsagePage() {
  const content = await getCmsContent();

  return (
    <LegalPageLayout title="Safety & Usage" updated={content.safety.updated}>
      {content.safety.sections.map((section, index) => (
        <LegalSection key={index} title={section.title} html={section.content} />
      ))}
    </LegalPageLayout>
  );
}
