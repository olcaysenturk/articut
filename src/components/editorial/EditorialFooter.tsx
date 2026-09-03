import Image from "next/image";
import Link from "next/link";

function FooterArrow() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="footer-link-arrow relative top-[-0.12em] ml-[0.28em] inline-block size-[0.82em] align-middle"
    >
      <path
        d="M4.8 20.7L17.1 8.4H8.3V5.2h14.1v14.1h-3.2v-8.7L7.1 22.9Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function EditorialFooter() {
  return (
    <footer
      data-site-footer
      className="relative flex h-[min(453px,115.27vw)] flex-col justify-between overflow-hidden bg-[#a5a5a5] px-[min(32px,8.14vw)] pb-[min(14px,3.56vw)] pt-[min(24px,6.11vw)] text-[#e04d26] md:block md:h-[690px] md:px-[50px] md:pb-0 md:pt-[63px] [&_p]:leading-[inherit]"
    >
      <div className="relative z-10 grid grid-cols-[min(48px,12.21vw)_min(94px,23.92vw)_min(126px,32.06vw)] justify-between gap-0 text-[10px] leading-[24px] md:grid-cols-3 md:gap-4 md:text-[18px] md:leading-[24px]">
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
        <div className="flex flex-col items-end whitespace-nowrap text-right">
          <a href="mailto:info@articut.com" className="footer-link-with-arrow">
            info@articut.com
            <FooterArrow />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="footer-link-with-arrow">
            Instagram
            <FooterArrow />
          </a>
        </div>
      </div>

      <div className="absolute left-1/2 top-[min(121px,30.79vw)] aspect-[329/293] w-[min(329px,83.72vw)] -translate-x-1/2 md:hidden">
        <Image src="/figma/footer-mobile-mark.svg" alt="Articut" fill sizes="(max-width: 393px) 83.72vw, 329px" className="object-contain" />
      </div>

      <div className="absolute bottom-[50px] left-[50px] hidden aspect-[670/131] w-[calc(100%-100px)] md:block">
        <Image src="/figma/footer-logo.svg" alt="Articut" fill sizes="calc(100vw - 100px)" className="object-contain" />
      </div>

      <div className="relative z-10 text-[min(7px,1.79vw)] uppercase leading-none md:absolute md:bottom-[16px] md:left-[50px] md:right-[50px] md:grid md:grid-cols-3 md:items-end md:gap-2 md:text-[12px] md:leading-none">
        <p className="absolute bottom-0 left-0 md:static">© 2026 ARTICUT</p>
        <p className="absolute inset-x-0 bottom-0 whitespace-nowrap text-center md:static">ALL RIGHTS RESERVED</p>
        <p className="absolute bottom-0 right-0 text-right md:static">
          <a href="https://artistudyo.com" target="_blank" rel="noreferrer">
            WEBSITE BY ARTI STÜDYO
          </a>
        </p>
      </div>
    </footer>
  );
}
