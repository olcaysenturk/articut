"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { animate, useMotionValue } from "motion/react";
import { BrandLoader } from "@/components/loading/BrandLoader";

const MAX_WAIT_MS = 6000;
// While waiting, progress eases toward this cap so it never looks "done" before
// the videos actually are — the remainder is closed out by the finish animation.
const FAKE_PROGRESS_CAP = 0.9;
const FAKE_PROGRESS_TIME_CONSTANT_MS = 1200;
const FINISH_DURATION_S = 0.4;

export function VideoLoadingGate({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const progress = useMotionValue(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let cancelled = false;
    let rafId: number;
    const start = performance.now();

    const tick = () => {
      const elapsed = performance.now() - start;
      const target = FAKE_PROGRESS_CAP * (1 - Math.exp(-elapsed / FAKE_PROGRESS_TIME_CONSTANT_MS));
      progress.set(target);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const finish = () => {
      if (cancelled) return;
      cancelled = true;
      cancelAnimationFrame(rafId);
      animate(progress, 1, {
        duration: FINISH_DURATION_S,
        ease: "easeOut",
        onComplete: () => setReady(true),
      });
    };

    // The page is "done" only once the window has fully loaded (every
    // resource — scripts, images, fonts, videos) AND any hero videos in this
    // subtree can actually play. Either one lagging keeps the drawing going.
    let pageLoaded = document.readyState === "complete";
    const videos = Array.from(root.querySelectorAll("video"));
    const pendingVideos = new Set(videos);

    const maybeFinish = () => {
      if (pageLoaded && pendingVideos.size === 0) finish();
    };

    const onWindowLoad = () => {
      pageLoaded = true;
      maybeFinish();
    };
    if (!pageLoaded) window.addEventListener("load", onWindowLoad);

    const markVideoDone = (video: HTMLVideoElement) => {
      pendingVideos.delete(video);
      maybeFinish();
    };

    videos.forEach((video) => {
      if (video.readyState >= 3) {
        markVideoDone(video);
        return;
      }
      const onReady = () => markVideoDone(video);
      video.addEventListener("canplaythrough", onReady, { once: true });
      video.addEventListener("loadeddata", onReady, { once: true });
    });

    maybeFinish();

    const timeout = window.setTimeout(finish, MAX_WAIT_MS);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener("load", onWindowLoad);
      window.clearTimeout(timeout);
    };
  }, [progress]);

  return (
    <div ref={rootRef}>
      {!ready && (
        <div className="fixed inset-0 z-[100]">
          <BrandLoader announce={false} progress={progress} />
        </div>
      )}
      {children}
    </div>
  );
}
