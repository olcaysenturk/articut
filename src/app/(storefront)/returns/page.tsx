import type { Metadata } from "next";
import { getCmsContent } from "@/lib/cms-content";
import { LegalPageLayout, LegalSection } from "@/components/editorial/LegalPageLayout";

export const metadata: Metadata = {
  alternates: { canonical: "/returns" },
  description: "Read Articut’s return policy and find out how to request a return for your order.",
  title: "Returns",
};

export default async function ReturnsPage() {
  const content = await getCmsContent();

  return (
    <LegalPageLayout title="Returns" updated={content.returns.updated}>
      {content.returns.sections.map((section, index) => (
        <LegalSection key={index} title={section.title} html={section.content} />
      ))}
    </LegalPageLayout>
  );
}
