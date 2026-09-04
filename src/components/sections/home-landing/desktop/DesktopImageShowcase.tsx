"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { CmsMediaItem } from "@/types/cms";

const AUTO_ADVANCE_MS = 4500;

export function DesktopImageShowcase({ images }: { images: CmsMediaItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const visibleImages: CmsMediaItem[] = images.length > 0 ? images : [
    {
      type: "image",
      src: "/images/product-detail/cutpilot-slider-3.jpg",
      alt: "Cutpilot in use",
    },
  ];

  useEffect(() => {
    if (visibleImages.length < 2) return;

    const timer = window.setTimeout(() => {
      setActiveIndex((index) => (index + 1) % visibleImages.length);
    }, AUTO_ADVANCE_MS);

    return () => window.clearTimeout(timer);
  }, [activeIndex, visibleImages.length]);

  return (
    <section className="relative h-dvh overflow-hidden bg-black" data-node-id="1:554">
      {visibleImages.map((item, index) =>
        item.type === "video" ? (
          <video
            key={`${item.src}-${index}`}
            src={item.src}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out ${
              index === activeIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ) : (
          <Image
            key={`${item.src}-${index}`}
            src={item.src}
            alt={item.alt}
            fill
            sizes="100vw"
            className={`object-cover transition-opacity duration-700 ease-out ${
              index === activeIndex ? "opacity-100" : "opacity-0"
            }`}
            priority={index === 0}
          />
        ),
      )}

      {visibleImages.length > 1 ? (
        <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-3">
          {visibleImages.map((image, index) => (
            <button
              key={`${image.src}-dot-${index}`}
              type="button"
              aria-label={`Show showcase image ${index + 1}`}
              aria-current={index === activeIndex}
              onClick={() => setActiveIndex(index)}
              className={`size-3 rounded-full transition ${
                index === activeIndex ? "scale-125 bg-[#e04d26]" : "bg-white/70 hover:bg-white"
              }`}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
