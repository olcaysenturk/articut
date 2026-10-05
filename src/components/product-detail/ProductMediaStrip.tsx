"use client";

import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { ArrowIcon } from "@/components/ui/ArrowIcon";

export function ProductMediaStrip({ children }: { children: ReactNode }) {
  const stripRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = useCallback(() => {
    const strip = stripRef.current;
    if (!strip) return;

    const maxScrollLeft = strip.scrollWidth - strip.clientWidth;
    setCanScrollLeft(strip.scrollLeft > 1);
    setCanScrollRight(strip.scrollLeft < maxScrollLeft - 1);
  }, []);

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip || window.matchMedia("(min-width: 768px)").matches) return;

    const secondSlide = strip.children.item(1) as HTMLElement | null;
    if (!secondSlide) return;

    strip.scrollLeft = secondSlide.offsetLeft;
    updateScrollButtons();
  }, [updateScrollButtons]);

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;

    updateScrollButtons();
    strip.addEventListener("scroll", updateScrollButtons, { passive: true });
    window.addEventListener("resize", updateScrollButtons);

    const resizeObserver = new ResizeObserver(updateScrollButtons);
    resizeObserver.observe(strip);

    return () => {
      strip.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
      resizeObserver.disconnect();
    };
  }, [updateScrollButtons]);

  function scrollMedia(direction: -1 | 1) {
    const strip = stripRef.current;
    if (!strip) return;

    strip.scrollBy({
      left: direction * strip.clientWidth * 0.9,
      behavior: "smooth",
    });
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, direction: -1 | 1) {
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    scrollMedia(direction);
  }

  const arrowButtonClass = "absolute top-1/2 z-10 flex size-16 -translate-y-1/2 cursor-pointer items-center justify-center text-[#e04d26] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e04d26] md:size-20";

  return (
    <section data-scroll-snap-ignore aria-label="Product media gallery" className="relative h-[250px] border-y-[3px] border-[#e04d26] md:h-[640px]">
      <div
        ref={stripRef}
        tabIndex={0}
        className="media-scrollbar flex h-full snap-x snap-mandatory overflow-x-auto md:grid md:auto-cols-[minmax(25%,1fr)] md:grid-flow-col md:grid-rows-1"
      >
        {children}
      </div>
      {canScrollLeft && (
        <button
          type="button"
          aria-label="Scroll media left"
          className={`${arrowButtonClass} left-5 hidden md:flex`}
          onClick={() => scrollMedia(-1)}
          onKeyDown={(event) => handleKeyDown(event, -1)}
        >
          <ArrowIcon className="h-auto w-[38px] rotate-180" />
        </button>
      )}
      {canScrollRight && (
        <button
          type="button"
          aria-label="Scroll media right"
          className={`${arrowButtonClass} right-5 hidden md:flex`}
          onClick={() => scrollMedia(1)}
          onKeyDown={(event) => handleKeyDown(event, 1)}
        >
          <ArrowIcon className="h-auto w-[38px]" />
        </button>
      )}
    </section>
  );
}
