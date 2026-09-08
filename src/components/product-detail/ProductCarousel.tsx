"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import type { CmsImage, CmsMediaItem } from "@/types/cms";

const DEFAULT_SLIDES = [
  {
    src: "/images/product-detail/cutpilot-slider-1.jpg",
    alt: "Open Cutpilot package and tool on a sofa",
  },
  {
    src: "/images/product-detail/cutpilot-slider-2.jpg",
    alt: "Cutpilot tool below a bathroom mirror",
  },
  {
    src: "/images/product-detail/cutpilot-slider-3.jpg",
    alt: "Cutpilot package on a yellow table",
  },
];

const AUTO_ADVANCE_MS = 4200;
const SLIDE_TRANSITION_MS = 720;

export function ProductCarousel({
  slides = DEFAULT_SLIDES,
  className = "relative aspect-[16/9] w-full overflow-hidden",
  nodeId,
  slideLabel = "Show image",
}: {
  slides?: (CmsImage | CmsMediaItem)[];
  className?: string;
  nodeId?: string;
  slideLabel?: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimerRef = useRef<number | undefined>(undefined);
  const reduceMotion = useReducedMotion();
  const visibleSlides = slides.length > 0 ? slides : DEFAULT_SLIDES;

  const changeSlide = useCallback(
    (index: number) => {
      if (index === activeIndex || (isTransitioning && !reduceMotion)) {
        return;
      }

      setActiveIndex(index);

      if (!reduceMotion) {
        window.clearTimeout(transitionTimerRef.current);
        setIsTransitioning(true);
        transitionTimerRef.current = window.setTimeout(() => {
          setIsTransitioning(false);
          transitionTimerRef.current = undefined;
        }, SLIDE_TRANSITION_MS);
      }
    },
    [activeIndex, isTransitioning, reduceMotion],
  );

  useEffect(() => {
    return () => window.clearTimeout(transitionTimerRef.current);
  }, []);

  useEffect(() => {
    if (reduceMotion || isTransitioning || visibleSlides.length < 2) return;

    const timer = window.setTimeout(() => {
      changeSlide((activeIndex + 1) % visibleSlides.length);
    }, AUTO_ADVANCE_MS);

    return () => window.clearTimeout(timer);
  }, [activeIndex, changeSlide, isTransitioning, reduceMotion, visibleSlides.length]);

  const goToSlide = useCallback(
    (index: number) => {
      changeSlide(index);
    },
    [changeSlide],
  );

  return (
    <section className={className} data-product-carousel data-node-id={nodeId}>
      <div
        className="flex h-full w-full"
        style={{
          transform: `translate3d(${-activeIndex * 100}%, 0, 0)`,
          transition: reduceMotion
            ? "none"
            : `transform ${SLIDE_TRANSITION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
        }}
      >
        {visibleSlides.map((slide, index) => (
          <div key={`${slide.src}-${index}`} className="relative h-full w-full shrink-0">
          {"type" in slide && slide.type === "video" ? (
            <video src={slide.src} autoPlay loop muted playsInline preload="metadata" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
          <Image
            src={slide.src}
            alt={"alt" in slide ? slide.alt : ""}
            fill
            sizes="100vw"
            className="object-cover"
            priority={index === 0}
          />
          )}
          </div>
        ))}
      </div>
      {visibleSlides.length > 1 && <div className="absolute bottom-[28px] left-1/2 z-10 flex -translate-x-1/2 gap-[10px] md:bottom-[32px]">
        {visibleSlides.map((slide, index) => (
          <button
            key={`${slide.src}-${index}`}
            type="button"
            aria-label={`${slideLabel} ${index + 1}`}
            aria-current={index === activeIndex}
            disabled={isTransitioning && index !== activeIndex}
            onClick={() => goToSlide(index)}
            className={`size-[14px] cursor-pointer rounded-full transition-[background-color,transform] duration-300 ease-out active:scale-125 disabled:cursor-default md:size-[22px] ${
              index === activeIndex ? "scale-125 bg-[#e04d26]" : "scale-100 bg-[#e0e0e0] hover:scale-110"
            }`}
          />
        ))}
      </div>}
    </section>
  );
}
