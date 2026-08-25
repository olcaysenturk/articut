import Image from "next/image";
import Link from "next/link";

function FooterArrow() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="footer-link-arrow ml-[0.28em] inline-block size-[0.82em]"
    >
      <path
        d="M4.8 20.7L17.1 8.4H8.3V5.2h14.1v14.1h-3.2v-8.7L7.1 22.9Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function MobileFooter() {
  return (
    <footer id="about-mobile" className="absolute left-0 top-[2831px] h-[min(453px,115.27vw)] w-full overflow-hidden bg-[#a5a5a5] text-[#e04d26]">
      <div className="absolute left-[min(32px,8.14vw)] top-[min(24px,6.11vw)] w-[min(48px,12.21vw)] text-[10px] leading-[24px]">
        <Link href="/" className="block">
          Home
        </Link>
        <Link href="/about" className="block">
          About
        </Link>
        <Link href="/cutpilot" className="block">
          Cutpilot™
        </Link>
      </div>
      <div className="absolute left-[min(103px,26.21vw)] top-[min(24px,6.11vw)] w-[min(94px,23.92vw)] text-[10px] leading-[24px]">
        <Link href="/faq" className="block">
          FAQs
        </Link>
        <Link href="/terms" className="block">
          Terms & Conditions
        </Link>
        <Link href="/privacy" className="block">
          Privacy Policy
        </Link>
      </div>
      <div className="absolute right-[min(32px,8.14vw)] top-[min(24px,6.11vw)] w-[min(126px,32.06vw)] whitespace-nowrap text-right text-[10px] leading-[24px]">
        <a href="mailto:info@articut.com" className="footer-link-with-arrow block">
          info@articut.com
          <FooterArrow />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="footer-link-with-arrow block">
          Instagram
          <FooterArrow />
        </a>
      </div>
      <div className="absolute left-1/2 top-[min(121px,30.79vw)] aspect-[329/293] w-[min(329px,83.72vw)] -translate-x-1/2">
        <Image
          src="/figma/footer-mobile-mark.svg"
          alt=""
          fill
          sizes="(max-width: 393px) 83.72vw, 329px"
          className="object-contain"
        />
      </div>
      <p className="absolute bottom-[min(14px,3.56vw)] left-[min(32px,8.14vw)] text-[min(8px,2.04vw)] uppercase leading-none">© 2026 ARTICUT</p>
      <p className="absolute bottom-[min(14px,3.56vw)] left-1/2 -translate-x-1/2 whitespace-nowrap text-center text-[min(8px,2.04vw)] leading-none">
        ALL RIGHTS RESERVED
      </p>
      <a
        href="https://artistudyo.com"
        target="_blank"
        rel="noreferrer"
        className="absolute bottom-[min(14px,3.56vw)] right-[min(32px,8.14vw)] w-[min(103px,26.21vw)] text-right text-[min(8px,2.04vw)] uppercase leading-none"
      >
        WEBSITE BY ARTI STÜDYO
      </a>
    </footer>
  );
}
