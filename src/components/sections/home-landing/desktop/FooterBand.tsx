import Image from "next/image";
import Link from "next/link";
import { FooterArrowIcon } from "@/components/ui/FooterArrowIcon";

const GRAY = "#a5a5a5";

function FooterArrow() {
  return <FooterArrowIcon />;
}

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
          FAQs
        </Link>
        <span className="block">
          <Link href="/returns">Returns</Link>
          <span aria-hidden="true"> | </span>
          <Link href="/privacy">Privacy Policy</Link>
        </span>
        <span className="block">
          <Link href="/safety-usage">Safety & Usage</Link>
          <span aria-hidden="true"> | </span>
          <Link href="/terms">Terms & Conditions</Link>
        </span>
      </div>
      <div className="absolute right-[50px] top-[63px] text-right text-[18px] leading-[24px]">
        <a href="mailto:info@articut.com" className="footer-link-with-arrow block">
          info@articut.com
          <FooterArrow />
        </a>
        <a href="https://www.instagram.com/_articut_/" target="_blank" rel="noreferrer" className="footer-link-with-arrow block">
          Instagram
          <FooterArrow />
        </a>
      </div>
      <p className="absolute bottom-[16px] left-[50px] text-[14px] uppercase leading-none">© 2026 ARTICUT™</p>
      <p className="absolute bottom-[16px] left-1/2 -translate-x-1/2 text-[14px] uppercase leading-none">
        ALL RIGHTS RESERVED
      </p>
      <a
        href="https://artistudyo.com"
        target="_blank"
        rel="noreferrer"
        className="absolute bottom-[16px] right-[50px] text-right text-[14px] uppercase leading-none"
      >
        DESIGNED BY ARTI STÜDYO®
      </a>
      <div className="absolute bottom-[50px] left-[50px] aspect-[670/131] w-[calc(100%-100px)]">
        <Image
          src="/figma/footer-logo.svg"
          alt="Articut"
          fill
          sizes="calc(100vw - 100px)"
          className="object-contain"
        />
      </div>
    </footer>
  );
}
