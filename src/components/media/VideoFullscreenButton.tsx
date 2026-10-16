"use client";

import { useEffect, useRef, useState } from "react";

type SafariVideo = HTMLVideoElement & { webkitEnterFullscreen?: () => void };
type PortraitOrientation = ScreenOrientation & {
  lock?: (orientation: "portrait") => Promise<void>;
};

export function VideoFullscreenButton({ className = "", lockPortrait = false }: { className?: string; lockPortrait?: boolean }) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const frame = buttonRef.current?.closest<HTMLElement>("[data-video-frame]");
    function syncFullscreen() {
      setIsFullscreen(Boolean(frame && document.fullscreenElement === frame));
    }
    document.addEventListener("fullscreenchange", syncFullscreen);
    return () => document.removeEventListener("fullscreenchange", syncFullscreen);
  }, []);

  async function toggleFullscreen() {
    const frame = buttonRef.current?.closest<HTMLElement>("[data-video-frame]");
    const video = frame?.querySelector<SafariVideo>("video");
    if (!frame || !video) return;
    setError("");

    try {
      if (document.fullscreenElement === frame) {
        await document.exitFullscreen();
      } else if (frame.requestFullscreen && document.fullscreenEnabled) {
        await frame.requestFullscreen();
        // Orientation locking is optional; unsupported browsers keep their current orientation.
        if (lockPortrait) {
          const orientation = screen.orientation as PortraitOrientation | undefined;
          await orientation?.lock?.("portrait").catch(() => {});
        }
      } else if (video.webkitEnterFullscreen) {
        video.webkitEnterFullscreen();
      } else {
        setError("Fullscreen is unavailable in this browser.");
      }
    } catch {
      setError("Could not open fullscreen. Please try again.");
    }
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        aria-pressed={isFullscreen}
        onClick={() => void toggleFullscreen()}
        className={`flex h-[44px] w-[44px] items-center justify-center text-[#e04d26] transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 ${className}`}
      >
        <svg aria-hidden="true" width="31" height="31" viewBox="0 0 32 32" fill="none">
          <path
            d={isFullscreen
              ? "M2 11H11V2M21 2V11H30M30 21H21V30M11 30V21H2"
              : "M2 11V2H11M21 2H30V11M30 21V30H21M11 30H2V21"}
            stroke="currentColor"
            strokeWidth="4"
          />
        </svg>
      </button>
      {error ? <p role="status" className="absolute bottom-[70px] inset-x-8 z-30 text-center text-sm text-white">{error}</p> : null}
    </>
  );
}
