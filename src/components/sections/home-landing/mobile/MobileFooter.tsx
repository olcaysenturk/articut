import Image from "next/image";
import Link from "next/link";
import { FooterArrowIcon } from "@/components/ui/FooterArrowIcon";

function FooterArrow() {
  return <FooterArrowIcon />;
}

export function MobileFooter() {
  return (
    <footer id="about-mobile" className="relative flex w-full flex-col gap-6 bg-[#a5a5a5] px-[min(32px,8.14vw)] pb-[min(14px,3.56vw)] pt-[min(24px,6.11vw)] text-[#e04d26]">
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-[min(23px,5.85vw)] gap-y-4 text-[10px] leading-[24px]">
        <nav aria-label="Footer main navigation">
          <Link href="/" className="block">
            Home
          </Link>
          <Link href="/about" className="block">
            About
          </Link>
          <Link href="/cutpilot" className="block">
            Cutpilot™
          </Link>
        </nav>
        <nav aria-label="Footer help and policies">
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
        </nav>
        <div className="text-right">
          <a href="mailto:info@articut.com" className="footer-link-with-arrow block">
            info@articut.com
            <FooterArrow />
          </a>
          <a href="https://www.instagram.com/_articut_/" target="_blank" rel="noreferrer" className="footer-link-with-arrow block">
            Instagram
            <FooterArrow />
          </a>
        </div>
      </div>
      <div className="relative mx-auto aspect-[329/293] w-full max-w-[329px]">
        <Image
          src="/figma/footer-mobile-mark.svg"
          alt=""
          fill
          sizes="(max-width: 393px) 83.72vw, 329px"
          className="object-contain"
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 text-[min(7px,1.79vw)] uppercase leading-normal">
        <p>© 2026 ARTICUT®</p>
        <p className="text-center">
          ALL RIGHTS RESERVED
        </p>
        <a
          href="https://artistudyo.com"
          target="_blank"
          rel="noreferrer"
          className="text-right"
        >
          DESIGNED BY ARTI STÜDYO®
        </a>
      </div>
    </footer>
  );
}
