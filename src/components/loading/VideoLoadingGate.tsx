"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { BrandLoader } from "@/components/loading/BrandLoader";

const MAX_WAIT_MS = 6000;

export function VideoLoadingGate({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const videos = Array.from(root.querySelectorAll("video"));
    if (videos.length === 0) {
      setReady(true);
      return;
    }

    let cancelled = false;
    const pending = new Set(videos);

    const markDone = (video: HTMLVideoElement) => {
      pending.delete(video);
      if (!cancelled && pending.size === 0) setReady(true);
    };

    videos.forEach((video) => {
      if (video.readyState >= 3) {
        markDone(video);
        return;
      }
      const onReady = () => markDone(video);
      video.addEventListener("canplaythrough", onReady, { once: true });
      video.addEventListener("loadeddata", onReady, { once: true });
    });

    const timeout = window.setTimeout(() => {
      if (!cancelled) setReady(true);
    }, MAX_WAIT_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, []);

  return (
    <div ref={rootRef}>
      {!ready && (
        <div className="fixed inset-0 z-[100]">
          <BrandLoader announce={false} preload />
        </div>
      )}
      {children}
    </div>
  );
}
