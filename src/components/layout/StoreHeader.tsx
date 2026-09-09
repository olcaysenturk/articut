"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { CartButton } from "@/components/commerce/CartButton";
import { MobileStickyHeader } from "@/components/layout/MobileStickyHeader";
import { ViewportPinnedHeader } from "@/components/layout/ViewportPinnedHeader";
import { useAutoHideHeader } from "@/lib/hooks/useAutoHideHeader";

export function StoreHeader() {
  const isVisible = useAutoHideHeader();

  return (
    <>
      <MobileStickyHeader tone="black" />
      <ViewportPinnedHeader className="hidden md:contents">
        <header
          className="contents text-[14px] font-bold text-black"
          style={{ "--header-offset": isVisible ? "0px" : "-100px" } as CSSProperties}
        >
          <Link href="/about" tabIndex={1} className="fixed left-[50px] top-[calc(42px+var(--header-offset))] transition-[top] duration-300 ease-out z-30 leading-none">
            About
          </Link>
          <Link href="/cutpilot" tabIndex={2} className="fixed left-[163px] top-[calc(42px+var(--header-offset))] transition-[top] duration-300 ease-out z-30 leading-none">
            Cutpilot™
          </Link>
          <Link
            href="/"
            aria-label="Articut home"
            tabIndex={3}
            className="fixed left-1/2 top-[calc(30px+var(--header-offset))] transition-[top] duration-300 ease-out z-30 h-[41px] w-[215px] -translate-x-1/2 [&_img]:brightness-0"
          >
            <Image src="/figma/articut-logo.svg" alt="Articut" fill priority className="object-contain" />
          </Link>
          <CartButton tabIndex={4} className="fixed right-[50px] top-[calc(42px+var(--header-offset))] transition-[top] duration-300 ease-out z-30 text-[14px] leading-none" />
        </header>
      </ViewportPinnedHeader>
    </>
  );
}
