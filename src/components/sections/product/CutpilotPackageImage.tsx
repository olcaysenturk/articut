"use client";

import Image from "next/image";
import { useRef } from "react";
import { useSettleZoom } from "@/lib/animation/useSettleZoom";

type CutpilotPackageImageProps = {
  src?: string;
  alt?: string;
  imageClassName?: string;
  sizes: string;
};

export function CutpilotPackageImage({
  src = "/figma/cutpilot-tile.png",
  alt = "Cutpilot package",
  imageClassName = "object-cover",
  sizes,
}: CutpilotPackageImageProps) {
  const imageRef = useRef<HTMLDivElement>(null);
  useSettleZoom(imageRef);

  return (
    <div ref={imageRef} className="settle-zoom absolute inset-0 origin-center will-change-transform">
      <Image src={src} alt={alt} fill sizes={sizes} className={imageClassName} />
    </div>
  );
}
