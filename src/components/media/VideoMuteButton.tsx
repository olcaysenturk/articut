"use client";

import { useEffect, useRef, useState } from "react";

type VideoMuteButtonProps = {
  className?: string;
};

export function VideoMuteButton({ className = "" }: VideoMuteButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const video = buttonRef.current
      ?.closest<HTMLElement>("[data-video-frame]")
      ?.querySelector("video");

    if (video) {
      setIsMuted(video.muted);
    }
  }, []);

  function toggleMute() {
    const video = buttonRef.current
      ?.closest<HTMLElement>("[data-video-frame]")
      ?.querySelector("video");

    const nextMuted = !isMuted;
    if (video) {
      video.muted = nextMuted;
      video.volume = nextMuted ? 0 : 1;
      if (!nextMuted) {
        void video.play().catch(() => {
          setIsMuted(video.muted);
        });
      }
    }
    setIsMuted(nextMuted);
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      aria-label={isMuted ? "Unmute video" : "Mute video"}
      aria-pressed={!isMuted}
      onClick={toggleMute}
      className={`video-mute-button ${isMuted ? "is-muted" : "is-unmuted"} ${className}`}
    >
      <svg
        aria-hidden="true"
        className="h-[31px] w-[38px]"
        viewBox="0 0 38 31"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 9.6875H8L18 0V31L8 21.3125H0V9.6875Z" fill="currentColor" />
        {isMuted ? (
          <path
            d="M27.18 15.5L22 10.4819L24.82 7.75L30 12.7681L35.18 7.75L38 10.4819L32.82 15.5L38 20.5181L35.18 23.25L30 18.2319L24.82 23.25L22 20.5181L27.18 15.5Z"
            fill="currentColor"
          />
        ) : (
          <>
            <path
              d="M23.15 9.25C24.78 10.82 25.7 13.05 25.7 15.5C25.7 17.95 24.78 20.18 23.15 21.75"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="3.4"
            />
            <path
              d="M29.15 5.35C31.95 7.92 33.55 11.58 33.55 15.5C33.55 19.42 31.95 23.08 29.15 25.65"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="3.4"
            />
          </>
        )}
      </svg>
    </button>
  );
}
