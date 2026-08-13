"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

const SLIDES = [
  {
    src: "/images/product-detail/cutpilot-photo-1.jpg",
    alt: "Open Cutpilot package and tool on a sofa",
  },
  {
    src: "/images/product-detail/cutpilot-photo-2.jpg",
    alt: "Cutpilot tool below a bathroom mirror",
  },
  {
    src: "/images/product-detail/cutpilot-photo-3.jpg",
    alt: "Cutpilot package on a yellow table",
  },
  {
    src: "/images/product-detail/cutpilot-photo-4.jpg",
    alt: "Cutpilot packaging on a cream chair",
  },
];

const AUTO_ADVANCE_MS = 4200;
const SLIDE_TRANSITION_MS = 720;

export function ProductCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimerRef = useRef<number | undefined>(undefined);
  const reduceMotion = useReducedMotion();

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
    if (reduceMotion || isTransitioning) return;

    const timer = window.setTimeout(() => {
      changeSlide((activeIndex + 1) % SLIDES.length);
    }, AUTO_ADVANCE_MS);

    return () => window.clearTimeout(timer);
  }, [activeIndex, changeSlide, isTransitioning, reduceMotion]);

  const goToSlide = useCallback(
    (index: number) => {
      changeSlide(index);
    },
    [changeSlide],
  );

  return (
    <section className="relative h-[calc(100svh-62px)] overflow-hidden md:h-[calc(100svh-100px)]" data-product-carousel>
      <div
        className="flex h-full w-full"
        style={{
          transform: `translate3d(${-activeIndex * 100}%, 0, 0)`,
          transition: reduceMotion
            ? "none"
            : `transform ${SLIDE_TRANSITION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
        }}
      >
        {SLIDES.map((slide, index) => (
          <div key={slide.src} className="relative h-full w-full shrink-0">
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            sizes="100vw"
            className="object-cover"
            priority={index === 0}
          />
          </div>
        ))}
      </div>
      <div className="absolute bottom-[28px] left-1/2 z-10 flex -translate-x-1/2 gap-[10px] md:bottom-[32px]">
        {SLIDES.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            aria-label={`Show image ${index + 1}`}
            aria-current={index === activeIndex}
            disabled={isTransitioning && index !== activeIndex}
            onClick={() => goToSlide(index)}
            className={`size-[14px] cursor-pointer rounded-full transition-colors disabled:cursor-default md:size-[22px] ${
              index === activeIndex ? "bg-[#e04d26]" : "bg-[#e0e0e0]"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
