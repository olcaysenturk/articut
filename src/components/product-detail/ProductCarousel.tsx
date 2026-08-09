"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const SLIDES = [
  {
    src: "/images/product-detail/slider-package-table.png",
    alt: "Cutpilot package on a yellow table",
  },
  {
    src: "/images/product-detail/slider-family-mirror.png",
    alt: "Cutpilot beside a family haircut mirror scene",
  },
  {
    src: "/images/product-detail/slider-open-package.png",
    alt: "Open Cutpilot package on a sofa",
  },
];

export function ProductCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduceMotion) return;

    let frameId = 0;
    const updateFromScroll = () => {
      frameId = 0;
      const rect = root.getBoundingClientRect();
      const scrollRange = Math.max(1, root.offsetHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / scrollRange));
      const nextIndex = progress < 0.25 ? 0 : progress < 0.75 ? 1 : 2;
      setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
    };
    const requestUpdate = () => {
      if (!frameId) frameId = window.requestAnimationFrame(updateFromScroll);
    };

    updateFromScroll();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, [reduceMotion]);

  const goToSlide = (index: number) => {
    const root = rootRef.current;
    if (!root || reduceMotion) {
      setActiveIndex(index);
      return;
    }

    const sceneTop = window.scrollY + root.getBoundingClientRect().top;
    const scrollRange = Math.max(0, root.offsetHeight - window.innerHeight);
    const progress = index / (SLIDES.length - 1);
    window.scrollTo({ top: sceneTop + scrollRange * progress, behavior: "smooth" });
  };

  const activeSlide = SLIDES[activeIndex];

  return (
    <section ref={rootRef} className="relative h-[300svh] motion-reduce:h-svh" data-product-carousel>
      <div className="sticky top-0 h-svh min-h-[560px] overflow-hidden motion-reduce:static">
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={activeSlide.src}
          className="absolute inset-0"
          initial={reduceMotion ? false : { opacity: 0, scale: 1.025 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src={activeSlide.src}
            alt={activeSlide.alt}
            fill
            sizes="100vw"
            className="object-cover"
            priority={activeIndex === 0}
          />
        </motion.div>
      </AnimatePresence>
      <div className="absolute bottom-[28px] left-1/2 z-10 flex -translate-x-1/2 gap-[10px] md:bottom-[32px]">
        {SLIDES.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            aria-label={`Show image ${index + 1}`}
            aria-current={index === activeIndex}
            onClick={() => goToSlide(index)}
            className={`size-[14px] cursor-pointer rounded-full transition-colors md:size-[22px] ${
              index === activeIndex ? "bg-[#e04d26]" : "bg-[#e0e0e0]"
            }`}
          />
        ))}
      </div>
      </div>
    </section>
  );
}
