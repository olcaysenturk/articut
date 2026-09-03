"use client";

import Image from "next/image";
import Link from "next/link";
import { CartButton } from "@/components/commerce/CartButton";
import { MobileScissorMenuButton } from "@/components/layout/MobileScissorMenuButton";
import { useAutoHideHeader } from "@/lib/hooks/useAutoHideHeader";

export function EditorialHeader({ dark = false }: { dark?: boolean }) {
  const isVisible = useAutoHideHeader();

  return (
    <>
      <div className="hidden md:block md:h-[100px]" aria-hidden />
      <header
        className={`relative z-40 h-[64px] w-full text-[14px] font-medium md:fixed md:inset-x-0 md:top-0 md:h-[100px] md:transition-transform md:duration-300 md:ease-out ${
          isVisible ? "md:translate-y-0" : "md:-translate-y-full"
        }`}
      >
      <nav className="hidden md:block" aria-label="Primary navigation">
        <Link href="/about" className="absolute left-[50px] top-[42px]">
          About
        </Link>
        <Link href="/cutpilot" className="absolute left-[163px] top-[42px]">
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
    </>
  );
}
