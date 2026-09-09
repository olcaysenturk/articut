"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { CartButton } from "@/components/commerce/CartButton";
import { MobileStickyHeader } from "@/components/layout/MobileStickyHeader";
import { ViewportPinnedHeader } from "@/components/layout/ViewportPinnedHeader";
import { useAutoHideHeader } from "@/lib/hooks/useAutoHideHeader";
import { useIsOverVideoHero } from "@/lib/hooks/useIsOverVideoHero";
import { cn } from "@/lib/utils";

export function StoreHeader({ tone = "accent" }: { tone?: "accent" | "black" }) {
  const isVisible = useAutoHideHeader();
  const isOverVideoHero = useIsOverVideoHero();
  const blend = tone === "black"
    ? isOverVideoHero
      ? "mix-blend-difference text-white [&_img]:brightness-0 [&_img]:invert"
      : "text-black [&_img]:brightness-0"
    : !isOverVideoHero && "mix-blend-difference text-[#1fb2d9] [&_img]:invert";

  return (
    <>
      <MobileStickyHeader tone={tone} />
      <ViewportPinnedHeader className="hidden md:contents">
        <header
          className={cn("contents text-[14px] font-bold", tone === "black" ? "text-black" : "text-[#e04d26]")}
          style={{ "--header-offset": isVisible ? "0px" : "-100px" } as CSSProperties}
        >
          <Link href="/about" tabIndex={1} className={cn("fixed left-[50px] top-[calc(42px+var(--header-offset))] transition-[top] duration-300 ease-out z-30 leading-none", blend)}>
            About
          </Link>
          <Link href="/cutpilot" tabIndex={2} className={cn("fixed left-[163px] top-[calc(42px+var(--header-offset))] transition-[top] duration-300 ease-out z-30 leading-none", blend)}>
            Cutpilot™
          </Link>
          <Link
            href="/"
            aria-label="Articut home"
            tabIndex={3}
            className={cn("fixed left-1/2 top-[calc(30px+var(--header-offset))] transition-[top] duration-300 ease-out z-30 h-[41px] w-[215px] -translate-x-1/2", blend)}
          >
            <Image src="/figma/articut-logo.svg" alt="Articut" fill priority className="object-contain" />
          </Link>
          <CartButton tabIndex={4} className={cn("fixed right-[50px] top-[calc(42px+var(--header-offset))] transition-[top] duration-300 ease-out z-30 text-[14px] leading-none", blend)} />
        </header>
      </ViewportPinnedHeader>
    </>
  );
}
