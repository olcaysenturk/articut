import Image from "next/image";
import Link from "next/link";
import { BrandAMark } from "@/components/editorial/BrandAMark";

export function EditorialFooter() {
  return (
    <footer
      data-site-footer
      className="relative flex h-[453px] flex-col justify-between overflow-hidden bg-[#a5a5a5] px-[24px] pb-[14px] pt-[32px] text-[#e04d26] md:min-h-[690px] md:h-auto md:px-[50px] md:pb-[12px] md:pt-[63px] [&_p]:leading-[inherit]"
    >
      <div className="relative z-10 grid grid-cols-3 gap-4 text-[8px] leading-[13px] md:text-[18px] md:leading-[24px]">
        <nav className="flex flex-col" aria-label="Footer navigation">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/cutpilot">Cutpilot™</Link>
        </nav>
        <nav className="flex flex-col" aria-label="Policies">
          <Link href="/faq">FAQ</Link>
          <Link href="/terms">Terms &amp; Conditions</Link>
          <Link href="/privacy">Privacy Policy</Link>
        </nav>
        <div className="flex flex-col items-end text-right">
          <a href="mailto:info@articut.com">info@articut.com ↗</a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram ↗</a>
        </div>
      </div>

      <BrandAMark className="absolute left-1/2 top-[102px] h-[319px] w-[345px] -translate-x-1/2 md:hidden" />

      <div className="relative mx-auto mt-[160px] hidden aspect-[215/41] w-full max-w-[1340px] md:block">
        <Image src="/figma/articut-logo.svg" alt="Articut" fill sizes="(max-width: 768px) 90vw, 1340px" />
      </div>

      <div className="relative z-10 grid grid-cols-3 items-end gap-2 text-[6px] leading-[8px] md:text-[18px] md:leading-[24px]">
        <p>© 2026 Articut</p>
        <p className="text-center">All rights reserved</p>
        <p className="text-right">Website by Artı Stüdyo</p>
      </div>
    </footer>
  );
}
