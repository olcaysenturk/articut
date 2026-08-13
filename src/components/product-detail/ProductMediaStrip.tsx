"use client";

import { type ReactNode, useEffect, useRef } from "react";

export function ProductMediaStrip({ children }: { children: ReactNode }) {
  const stripRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip || window.matchMedia("(min-width: 768px)").matches) return;

    const secondSlide = strip.children.item(1) as HTMLElement | null;
    if (!secondSlide) return;

    strip.scrollLeft = secondSlide.offsetLeft;
  }, []);

  return (
    <section
      ref={stripRef}
      data-scroll-snap-ignore
      className="flex h-[250px] snap-x snap-mandatory overflow-x-auto border-y-[3px] border-[#e04d26] md:grid md:h-[640px] md:grid-cols-4 md:snap-none md:overflow-hidden"
    >
      {children}
    </section>
  );
}
