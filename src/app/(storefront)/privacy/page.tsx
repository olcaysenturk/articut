import type { Metadata } from "next";
import { getCmsContent } from "@/lib/cms-content";
import { LegalPageLayout, LegalSection } from "@/components/editorial/LegalPageLayout";

export const metadata: Metadata = { title: "Privacy Policy" };

export default async function PrivacyPage() {
  const content = await getCmsContent();

  return (
    <LegalPageLayout title="Privacy Policy" updated={content.privacy.updated}>
      {content.privacy.sections.map((section, index) => (
        <LegalSection key={index} title={section.title} html={section.content} />
      ))}
    </LegalPageLayout>
  );
}
