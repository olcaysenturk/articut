import Image from "next/image";
import Link from "next/link";
import { CartButton } from "@/components/commerce/CartButton";
import { MobileScissorMenuButton } from "@/components/layout/MobileScissorMenuButton";

export function EditorialHeader({ dark = false }: { dark?: boolean }) {
  return (
    <header className="relative z-40 h-[64px] w-full text-[14px] font-medium md:h-[100px]">
      <nav className="hidden md:block" aria-label="Primary navigation">
        <Link href="/about" className="absolute left-[50px] top-[42px]">
          About
        </Link>
        <Link href="/#cutpilot-mobile" className="absolute left-[163px] top-[42px]">
          Cutpilot™
        </Link>
        <Link href="/" aria-label="Articut home" className="absolute left-1/2 top-[30px] h-[41px] w-[215px] -translate-x-1/2">
          <Image
            src="/figma/articut-logo.svg"
            alt="Articut"
            fill
            priority
            sizes="215px"
            className={dark ? "brightness-0" : undefined}
          />
        </Link>
        <CartButton className="absolute right-[50px] top-[42px] text-[14px] leading-none" />
      </nav>

      <Link href="/" aria-label="Articut home" className="absolute left-[32px] top-[19px] h-[25px] w-[129px] md:hidden">
        <Image
          src="/figma/articut-logo.svg"
          alt="Articut"
          fill
          priority
          sizes="129px"
          className={dark ? "brightness-0" : undefined}
        />
      </Link>
      <MobileScissorMenuButton tone={dark ? "black" : "accent"} />
    </header>
  );
}
