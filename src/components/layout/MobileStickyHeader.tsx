"use client";

import Image from "next/image";
import Link from "next/link";
import { MobileScissorMenuButton } from "@/components/layout/MobileScissorMenuButton";

export function MobileStickyHeader() {
  return (
    <header className="fixed left-0 top-0 z-50 h-[62px] w-full">
      <Link href="/" aria-label="Articut home" className="absolute left-[32px] top-[19px] h-[25px] w-[129px] mix-blend-difference">
        <Image src="/figma/articut-logo.svg" alt="Articut" fill priority className="object-contain" />
      </Link>
      <MobileScissorMenuButton blend />
    </header>
  );
}
