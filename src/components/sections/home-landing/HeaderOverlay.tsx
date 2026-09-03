"use client";

import Image from "next/image";
import Link from "next/link";
import { CartButton } from "@/components/commerce/CartButton";
import { useAutoHideHeader } from "@/lib/hooks/useAutoHideHeader";

export function HeaderOverlay() {
  const isVisible = useAutoHideHeader();

  return (
    <header
      className={`left-0 top-0 z-30 h-[100px] w-full text-[14px] font-bold text-[#e04d26] md:fixed md:inset-x-0 md:transition-transform md:duration-300 md:ease-out ${
        isVisible ? "md:translate-y-0" : "md:-translate-y-full"
      } absolute`}
    >
      <div className="relative mx-auto h-full w-full">
        <Link href="/about" className="absolute left-[50px] top-[42px] leading-none">
          About
        </Link>
        <Link href="/cutpilot" className="absolute left-[163px] top-[42px] leading-none">
          Cutpilot™
        </Link>
        <Link
          href="/"
          aria-label="Articut home"
          className="absolute left-1/2 top-[30px] h-[41px] w-[215px] -translate-x-1/2"
        >
          <Image src="/figma/articut-logo.svg" alt="Articut" fill priority className="object-contain" />
        </Link>
        <CartButton className="absolute right-[50px] top-[42px] text-[14px] leading-none" />
        <button
          type="button"
          aria-label="Menu"
          className="absolute right-[50px] top-[70px] flex h-[26px] w-[30px] flex-col justify-center gap-[6px] md:hidden"
        >
          <span className="h-[3px] w-full bg-current" />
          <span className="h-[3px] w-full bg-current" />
        </button>
      </div>
    </header>
  );
}
