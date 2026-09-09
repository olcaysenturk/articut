"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { CartButton } from "@/components/commerce/CartButton";
import { ViewportPinnedHeader } from "@/components/layout/ViewportPinnedHeader";
import { useAutoHideHeader } from "@/lib/hooks/useAutoHideHeader";

export function HeaderOverlay() {
  const isVisible = useAutoHideHeader();

  return (
    <ViewportPinnedHeader className="hidden md:contents">
      <header
        className="contents text-[14px] font-bold text-[#e04d26]"
        style={{ "--header-offset": isVisible ? "0px" : "-100px" } as CSSProperties}
      >
        <div className="contents">
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
            className="fixed left-1/2 top-[calc(30px+var(--header-offset))] transition-[top] duration-300 ease-out z-30 h-[41px] w-[215px] -translate-x-1/2"
          >
            <Image src="/figma/articut-logo.svg" alt="Articut" fill priority className="object-contain" />
          </Link>
          <CartButton tabIndex={4} className="fixed right-[50px] top-[calc(42px+var(--header-offset))] transition-[top] duration-300 ease-out z-30 text-[14px] leading-none" />
          <button
            type="button"
            aria-label="Menu"
            tabIndex={5}
            className="fixed right-[50px] top-[calc(70px+var(--header-offset))] transition-[top] duration-300 ease-out z-30 flex h-[26px] w-[30px] flex-col justify-center gap-[6px] md:hidden"
          >
            <span className="h-[3px] w-full bg-current" />
            <span className="h-[3px] w-full bg-current" />
          </button>
        </div>
      </header>
    </ViewportPinnedHeader>
  );
}
