"use client";

import { ProductCarousel } from "@/components/product-detail/ProductCarousel";
import type { CmsMediaItem } from "@/types/cms";

export function DesktopImageShowcase({
  images,
  className = "relative h-dvh overflow-hidden bg-black",
}: {
  images: CmsMediaItem[];
  className?: string;
}) {
  const slides: CmsMediaItem[] = images.length > 0 ? images : [{
    type: "image",
    src: "/images/product-detail/cutpilot-slider-3.jpg",
    alt: "Cutpilot in use",
  }];

  return <ProductCarousel slides={slides} className={className} nodeId="1:554" slideLabel="Show showcase image" />;
}
