"use client";

import Image from "next/image";
import Link from "next/link";
import { MobileScissorMenuButton } from "@/components/layout/MobileScissorMenuButton";
import { ViewportPinnedHeader } from "@/components/layout/ViewportPinnedHeader";
import { useIsOverVideoHero } from "@/lib/hooks/useIsOverVideoHero";
import { cn } from "@/lib/utils";

export function MobileStickyHeader({ tone = "accent" }: { tone?: "accent" | "black" }) {
  const isOverVideoHero = useIsOverVideoHero();
  const blend = tone === "black" ? isOverVideoHero : !isOverVideoHero;
  const adaptVideo = isOverVideoHero && tone === "black";

  return (
    <ViewportPinnedHeader className="contents md:hidden">
      <header className="contents">
        <Link
          href="/"
          aria-label="Articut home"
          tabIndex={1}
          className={cn("fixed left-[32px] top-[19px] z-30 h-[25px] w-[129px]", blend && (adaptVideo ? "mix-blend-difference text-white [&_img]:brightness-0 [&_img]:invert" : "mix-blend-difference text-[#1fb2d9] [&_img]:invert"))}
        >
          <Image src="/figma/articut-logo.svg" alt="Articut" fill priority className={cn("object-contain", !blend && tone === "black" && "brightness-0")} />
        </Link>
        <MobileScissorMenuButton tone={tone} blend={blend} tabIndex={2} />
      </header>
    </ViewportPinnedHeader>
  );
}
