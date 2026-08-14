import Image from "next/image";
import Link from "next/link";

const GRAY = "#a5a5a5";

export function FooterBand() {
  return (
    <footer
      className="relative h-[690px] overflow-hidden text-[#e04d26]"
      style={{ backgroundColor: GRAY }}
    >
      <div className="absolute left-[50px] top-[63px] text-[18px] leading-[24px]">
        <Link href="/" className="block">
          Home
        </Link>
        <Link href="/cutpilot" className="block">
          Cutpilot™
        </Link>
        <Link href="/about" className="block">
          About
        </Link>
      </div>
      <div className="absolute left-[349px] top-[63px] text-[18px] leading-[24px]">
        <Link href="/faq" className="block">
          FAQ
        </Link>
        <Link href="/terms" className="block">
          Terms & Conditions
        </Link>
        <Link href="/privacy" className="block">
          Privacy Policy
        </Link>
      </div>
      <div className="absolute right-[50px] top-[63px] text-right text-[18px] leading-[24px]">
        <a href="mailto:info@articut.com" className="block">
          info@articut.com ↗
        </a>
        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="block">
          Instagram ↗
        </a>
      </div>
      <p className="absolute bottom-[48px] left-[50px] text-[18px] leading-[24px]">© 2026 Articut</p>
      <p className="absolute bottom-[48px] left-1/2 -translate-x-1/2 text-[18px] leading-[24px]">
        All rights reserved
      </p>
      <p className="absolute bottom-[48px] right-[50px] text-right text-[18px] leading-[24px]">
        Website by Artı Stüdyo
      </p>
      <div className="absolute bottom-[83px] left-1/2 aspect-[215/41] w-[calc(100%-100px)] max-w-[1340px] -translate-x-1/2">
        <Image
          src="/figma/articut-logo.svg"
          alt="Articut"
          fill
          sizes="1340px"
          className="object-contain"
        />
      </div>
    </footer>
  );
}
