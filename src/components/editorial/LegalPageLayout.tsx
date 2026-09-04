import type { CSSProperties, ReactNode } from "react";
import { EditorialFooter } from "@/components/editorial/EditorialFooter";
import { EditorialHeader } from "@/components/editorial/EditorialHeader";

export function LegalPageLayout({
  title,
  updated,
  children,
  long = false,
}: {
  title: ReactNode;
  updated?: string;
  children: ReactNode;
  long?: boolean;
}) {
  return (
    <div className="bg-[#d9d9d9] text-black">
      <main className={long ? "md:min-h-[8652px]" : "md:min-h-[3004px]"}>
        <EditorialHeader />
        <div
          className={`mx-auto grid max-w-[1340px] gap-[50px] px-[31px] ${
            long ? "pb-[127px] pt-[7px]" : "pb-[18px] pt-[39px]"
          } md:grid-cols-[280px_minmax(0,884px)] md:gap-[50px] md:px-0 md:pb-[150px] md:pt-[163px]`}
        >
          <aside>
            <h1 className="legal-title text-[#e04d26]">{title}</h1>
            {updated ? <p className="mt-[34px] hidden text-[18px] leading-none text-[#e04d26] md:block md:text-[20px]">Last updated: [{updated}]</p> : null}
          </aside>
          <article
            className={`legal-copy min-w-0 text-[15px] font-light leading-[1.08] md:text-[22px] [&_li]:leading-[1.08] [&_p]:leading-[1.08] ${long ? "legal-copy-long" : ""}`}
            style={{ "--legal-section-gap": long ? "90px" : "66px" } as CSSProperties}
          >
            {children}
          </article>
        </div>
      </main>
      <EditorialFooter />
    </div>
  );
}

export function LegalSection({
  title,
  children,
  html,
}: {
  title: string;
  children?: ReactNode;
  html?: string;
}) {
  return (
    <section className="legal-section mb-[54px] md:mb-[66px]">
      <h2 className="mb-[28px] md:mb-[42px]">{title}</h2>
      {html ? (
        <div
          className="space-y-[18px] md:space-y-[24px]"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <div className="space-y-[18px] md:space-y-[24px]">{children}</div>
      )}
    </section>
  );
}
