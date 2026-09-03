"use client";

import { useEffect, useRef, useState } from "react";

type VideoPlaybackButtonProps = {
  className?: string;
};

const HIDE_DELAY = 1200;

export function VideoPlaybackButton({ className = "" }: VideoPlaybackButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const hideTimerRef = useRef<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const frame = buttonRef.current?.closest<HTMLElement>("[data-video-frame]");
    const video = frame?.querySelector("video");

    if (!frame || !video) {
      return undefined;
    }

    function syncPausedState() {
      setIsPaused(Boolean(video?.paused));
    }

    function clearHideTimer() {
      if (!hideTimerRef.current) return;
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }

    function revealTemporarily() {
      clearHideTimer();
      setIsVisible(true);
      hideTimerRef.current = window.setTimeout(() => {
        setIsVisible(false);
      }, HIDE_DELAY);
    }

    syncPausedState();
    frame.addEventListener("pointermove", revealTemporarily);
    frame.addEventListener("pointerenter", revealTemporarily);
    frame.addEventListener("pointerdown", revealTemporarily);
    frame.addEventListener("mousemove", revealTemporarily);
    frame.addEventListener("mouseenter", revealTemporarily);
    frame.addEventListener("touchstart", revealTemporarily, { passive: true });
    video.addEventListener("pointermove", revealTemporarily);
    video.addEventListener("pointerenter", revealTemporarily);
    video.addEventListener("mousemove", revealTemporarily);
    video.addEventListener("mouseenter", revealTemporarily);
    video.addEventListener("touchstart", revealTemporarily, { passive: true });
    video.addEventListener("play", syncPausedState);
    video.addEventListener("pause", syncPausedState);

    return () => {
      clearHideTimer();
      frame.removeEventListener("pointermove", revealTemporarily);
      frame.removeEventListener("pointerenter", revealTemporarily);
      frame.removeEventListener("pointerdown", revealTemporarily);
      frame.removeEventListener("mousemove", revealTemporarily);
      frame.removeEventListener("mouseenter", revealTemporarily);
      frame.removeEventListener("touchstart", revealTemporarily);
      video.removeEventListener("pointermove", revealTemporarily);
      video.removeEventListener("pointerenter", revealTemporarily);
      video.removeEventListener("mousemove", revealTemporarily);
      video.removeEventListener("mouseenter", revealTemporarily);
      video.removeEventListener("touchstart", revealTemporarily);
      video.removeEventListener("play", syncPausedState);
      video.removeEventListener("pause", syncPausedState);
    };
  }, []);

  function showAfterToggle() {
    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current);
    }

    setIsVisible(true);
    hideTimerRef.current = window.setTimeout(() => {
      setIsVisible(false);
    }, HIDE_DELAY);
  }

  function togglePlayback() {
    const video = buttonRef.current
      ?.closest<HTMLElement>("[data-video-frame]")
      ?.querySelector("video");

    if (!video) {
      return;
    }

    if (video.paused) {
      void video.play().then(() => {
        setIsPaused(false);
      }).catch(() => {
        setIsPaused(video.paused);
      });
    } else {
      video.pause();
      setIsPaused(true);
    }

    showAfterToggle();
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      aria-label={isPaused ? "Play video" : "Pause video"}
      aria-pressed={!isPaused}
      onClick={togglePlayback}
      className={`video-playback-button ${isVisible ? "is-visible" : ""} ${className}`}
    >
      {isPaused ? (
        <svg aria-hidden="true" className="h-[24px] w-[19px]" viewBox="0 0 36 46" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0V45.2136L35.525 22.6068L0 0Z" fill="currentColor" />
        </svg>
      ) : (
        <svg aria-hidden="true" className="h-[24px] w-[18px]" viewBox="0 0 34 46" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="13.4455" height="45.0818" fill="currentColor" />
          <rect x="20.5635" width="13.4455" height="45.0818" fill="currentColor" />
        </svg>
        )}
    </button>
  );
}
