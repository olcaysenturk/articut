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
  const [trackIndex, setTrackIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isJumpResetting, setIsJumpResetting] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const transitionTimerRef = useRef<number | undefined>(undefined);
  const resetFrameRef = useRef<number | undefined>(undefined);
  const carouselRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
    isDragging: boolean;
  } | null>(null);
  const reduceMotion = useReducedMotion();
  const visibleSlides = slides.length > 0 ? slides : DEFAULT_SLIDES;
  const renderedSlides =
    visibleSlides.length > 1
      ? [visibleSlides[visibleSlides.length - 1], ...visibleSlides, visibleSlides[0]]
      : visibleSlides;
  const currentTrackIndex = visibleSlides.length > 1 ? trackIndex : 0;

  const changeSlide = useCallback(
    (index: number, direction?: -1 | 1) => {
      if (index === activeIndex || (isTransitioning && !reduceMotion)) {
        return;
      }

      let nextTrackIndex = visibleSlides.length > 1 ? index + 1 : index;

      if (visibleSlides.length > 1) {
        if (direction === 1 && activeIndex === visibleSlides.length - 1 && index === 0) {
          nextTrackIndex = visibleSlides.length + 1;
        }

        if (direction === -1 && activeIndex === 0 && index === visibleSlides.length - 1) {
          nextTrackIndex = 0;
        }
      }

      setActiveIndex(index);
      setTrackIndex(nextTrackIndex);

      if (!reduceMotion) {
        window.clearTimeout(transitionTimerRef.current);
        window.cancelAnimationFrame(resetFrameRef.current ?? 0);
        setIsTransitioning(true);
        transitionTimerRef.current = window.setTimeout(() => {
          if (nextTrackIndex === visibleSlides.length + 1) {
            setIsJumpResetting(true);
            setTrackIndex(1);
            resetFrameRef.current = window.requestAnimationFrame(() => {
              setIsJumpResetting(false);
              resetFrameRef.current = undefined;
            });
          }

          if (nextTrackIndex === 0) {
            setIsJumpResetting(true);
            setTrackIndex(visibleSlides.length);
            resetFrameRef.current = window.requestAnimationFrame(() => {
              setIsJumpResetting(false);
              resetFrameRef.current = undefined;
            });
          }

          setIsTransitioning(false);
          transitionTimerRef.current = undefined;
        }, SLIDE_TRANSITION_MS);
      }
    },
    [activeIndex, isTransitioning, reduceMotion, visibleSlides.length],
  );

  useEffect(() => {
    return () => {
      window.clearTimeout(transitionTimerRef.current);
      window.cancelAnimationFrame(resetFrameRef.current ?? 0);
    };
  }, []);

  useEffect(() => {
    if (reduceMotion || isTransitioning || visibleSlides.length < 2) return;

    const timer = window.setTimeout(() => {
      changeSlide((activeIndex + 1) % visibleSlides.length, 1);
    }, AUTO_ADVANCE_MS);

    return () => window.clearTimeout(timer);
  }, [activeIndex, changeSlide, isTransitioning, reduceMotion, visibleSlides.length]);

  const goToSlide = useCallback(
    (index: number) => {
      if (index === 0 && activeIndex === visibleSlides.length - 1) {
        changeSlide(index, 1);
        return;
      }

      if (index === visibleSlides.length - 1 && activeIndex === 0) {
        changeSlide(index, -1);
        return;
      }

      changeSlide(index);
    },
    [activeIndex, changeSlide, visibleSlides.length],
  );

  const goToRelativeSlide = useCallback(
    (direction: -1 | 1) => {
      const nextIndex = (activeIndex + direction + visibleSlides.length) % visibleSlides.length;
      changeSlide(nextIndex, direction);
    },
    [activeIndex, changeSlide, visibleSlides.length],
  );

  function handlePointerDown(event: React.PointerEvent<HTMLElement>) {
    if (visibleSlides.length < 2 || isTransitioning || event.pointerType === "mouse") return;

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      currentX: event.clientX,
      currentY: event.clientY,
      isDragging: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    drag.currentX = event.clientX;
    drag.currentY = event.clientY;
    const deltaX = drag.currentX - drag.startX;
    const deltaY = drag.currentY - drag.startY;

    if (Math.abs(deltaX) > 8 && Math.abs(deltaX) > Math.abs(deltaY)) {
      drag.isDragging = true;
      setDragOffset(deltaX);
    }
  }

  function finishPointerGesture(event: React.PointerEvent<HTMLElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const deltaX = drag.currentX - drag.startX;
    const deltaY = drag.currentY - drag.startY;
    const width = carouselRef.current?.clientWidth ?? 0;
    const threshold = Math.max(40, Math.min(90, width * 0.16));

    if (drag.isDragging && Math.abs(deltaX) > threshold && Math.abs(deltaX) > Math.abs(deltaY)) {
      goToRelativeSlide(deltaX < 0 ? 1 : -1);
    }

    setDragOffset(0);
    dragRef.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  return (
    <section
      className={className}
      data-product-carousel
      data-node-id={nodeId}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishPointerGesture}
      onPointerCancel={finishPointerGesture}
      style={{ touchAction: "pan-y" }}
    >
      <div
        ref={carouselRef}
        className="flex h-full w-full"
        style={{
          transform: `translate3d(calc(${-currentTrackIndex * 100}% + ${dragOffset}px), 0, 0)`,
          transition: reduceMotion || dragOffset !== 0 || isJumpResetting
            ? "none"
            : `transform ${SLIDE_TRANSITION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
        }}
      >
        {renderedSlides.map((slide, index) => {
          const sourceIndex = visibleSlides.length > 1
            ? (index - 1 + visibleSlides.length) % visibleSlides.length
            : index;

          return (
            <div key={`${slide.src}-${index}`} className="relative h-full w-full shrink-0">
              {"type" in slide && slide.type === "video" ? (
                <video
                  src={slide.src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <Image
                  src={slide.src}
                  alt={"alt" in slide ? slide.alt : ""}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  priority={sourceIndex === 0}
                />
              )}
            </div>
          );
        })}
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
