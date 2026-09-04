import type { Metadata } from "next";
import { getCmsContent } from "@/lib/cms-content";
import { LegalPageLayout, LegalSection } from "@/components/editorial/LegalPageLayout";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default async function TermsPage() {
  const content = await getCmsContent();

  return (
    <LegalPageLayout title={<>Terms<br className="hidden md:block" /> &amp; Conditions</>} long>
      {content.terms.sections.map((section, index) => (
        <LegalSection key={index} title={section.title} html={section.content} />
      ))}
    </LegalPageLayout>
  );
}
