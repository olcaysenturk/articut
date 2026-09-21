"use client";

import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";

function StripArrow({ direction }: { direction: -1 | 1 }) {
  return (
    <svg
      viewBox="0 0 42 24"
      aria-hidden="true"
      fill="none"
      className={`h-8 w-14 ${direction === -1 ? "rotate-180" : ""}`}
    >
      <path
        d="M4 12H35M35 12L27 4M35 12L27 20"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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

  const arrowButtonClass = "absolute bottom-3 z-10 flex size-16 items-center justify-center text-[#e04d26] transition-opacity hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e04d26] md:bottom-5 md:size-20";

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
          <StripArrow direction={-1} />
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
          <StripArrow direction={1} />
        </button>
      )}
    </section>
  );
}
