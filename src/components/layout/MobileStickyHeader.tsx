"use client";

import Image from "next/image";
import Link from "next/link";
import { MobileScissorMenuButton } from "@/components/layout/MobileScissorMenuButton";
import { ViewportPinnedHeader } from "@/components/layout/ViewportPinnedHeader";
import { cn } from "@/lib/utils";

export function MobileStickyHeader({ tone = "accent" }: { tone?: "accent" | "black" }) {
  return (
    <ViewportPinnedHeader className="contents md:hidden">
      <header className="contents">
        <Link
          href="/"
          aria-label="Articut home"
          tabIndex={1}
          className="fixed left-[32px] top-[19px] z-30 h-[25px] w-[129px]"
        >
          <Image
            src="/figma/articut-logo.svg"
            alt="Articut"
            fill
            priority
            className={cn("object-contain", tone === "black" && "brightness-0")}
          />
        </Link>
        <MobileScissorMenuButton tone={tone} tabIndex={2} />
      </header>
    </ViewportPinnedHeader>
  );
}
