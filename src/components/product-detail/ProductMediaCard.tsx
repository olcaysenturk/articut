"use client";

import Image from "next/image";
import { useState } from "react";
import type { CmsMediaItem } from "@/types/cms";

export function ProductMediaCard({ item }: { item: CmsMediaItem }) {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const ready = () => setStatus("ready");
  const failed = () => setStatus("error");

  return (
    <div className="relative w-[165px] shrink-0 snap-start overflow-hidden border-r-[3px] border-[#e04d26] bg-[#d9d9d9] last:border-r-0 md:w-auto" aria-busy={status === "loading"}>
      {status !== "ready" && (
        <div className="absolute inset-0 flex items-center justify-center" role="status">
          {status === "loading" ? (
            <>
              <span aria-hidden="true" className="size-8 animate-spin rounded-full border-2 border-[#e04d26]/20 border-t-[#e04d26] motion-reduce:animate-none" />
              <span className="sr-only">Loading media</span>
            </>
          ) : <span className="px-4 text-center text-sm text-[#e04d26]">Media unavailable</span>}
        </div>
      )}
      {item.type === "image" ? (
        <Image
          src={item.src}
          alt={item.alt}
          fill
          sizes="(max-width: 767px) 165px, 25vw"
          className={`object-cover transition-opacity duration-300 motion-reduce:transition-none ${status === "ready" ? "opacity-100" : "opacity-0"}`}
          onLoad={ready}
          onError={failed}
        />
      ) : (
        <video
          ref={(video) => { if (video && video.readyState >= 2) ready(); }}
          src={item.src}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          onLoadedData={ready}
          onCanPlay={ready}
          onError={failed}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 motion-reduce:transition-none ${status === "ready" ? "opacity-100" : "opacity-0"}`}
        />
      )}
    </div>
  );
}
