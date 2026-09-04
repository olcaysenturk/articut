import type { Metadata } from "next";
import { getCmsContent } from "@/lib/cms-content";
import { EditorialFooter } from "@/components/editorial/EditorialFooter";
import { EditorialHeader } from "@/components/editorial/EditorialHeader";
import { FaqPageClient } from "./FaqPageClient";

export const metadata: Metadata = { title: "FAQ" };

export default async function FaqPage() {
  const content = await getCmsContent();
  const { sections } = content.faq;

  return (
    <div className="bg-[#e94b24] text-black">
      <main className="relative bg-[#e94b24] md:min-h-[3527px]">
        <div className="faq-pattern" aria-hidden />
        <div className="relative z-10">
          <EditorialHeader dark />
          <FaqPageClient sections={sections} />
        </div>
      </main>
      <EditorialFooter />
    </div>
  );
}
