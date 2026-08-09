"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { MobileScissorMenuButton } from "@/components/layout/MobileScissorMenuButton";

export function MobileStickyHeader() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let animationFrame = 0;

    function updateHeader() {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => setIsScrolled(window.scrollY > 8));
    }

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", updateHeader);
    };
  }, []);

  return (
    <header className="fixed left-0 top-0 z-50 h-[62px] w-full">
      <span
        aria-hidden
        className={`absolute inset-0 bg-white transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isScrolled ? "opacity-100" : "opacity-0"
        }`}
      />
      <Image
        src="/figma/articut-logo.svg"
        alt="Articut"
        width={129}
        height={25}
        priority
        className="absolute left-[32px] top-[19px]"
      />
      <MobileScissorMenuButton />
    </header>
  );
}
