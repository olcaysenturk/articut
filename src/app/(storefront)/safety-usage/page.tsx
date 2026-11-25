import type { Metadata } from "next";
import { getCmsContent } from "@/lib/cms-content";
import { LegalPageLayout, LegalSection } from "@/components/editorial/LegalPageLayout";

export const metadata: Metadata = {
  alternates: { canonical: "/safety-usage" },
  description: "Read Articut’s safety and usage guidance before using the Cutpilot at-home haircutting kit.",
  title: "Safety & Usage",
};

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
