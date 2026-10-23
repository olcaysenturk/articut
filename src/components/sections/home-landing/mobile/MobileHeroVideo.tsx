"use client";

import { useEffect, useRef, useState } from "react";
import { VideoMuteButton } from "@/components/media/VideoMuteButton";
import { VideoPlaybackButton } from "@/components/media/VideoPlaybackButton";
import { HERO_VIDEO_POSTER_URL, MOBILE_HERO_VIDEO_URL } from "@/config/hero-video";

type PortraitVideo = HTMLVideoElement & {
  webkitEnterFullscreen?: () => void;
  webkitExitFullscreen?: () => void;
  webkitDisplayingFullscreen?: boolean;
  webkitPresentationMode?: string;
};

function seek(video: HTMLVideoElement, time: number) {
  const apply = () => { video.currentTime = Math.min(time, Number.isFinite(video.duration) ? Math.max(0, video.duration - 0.05) : time); };
  if (video.readyState >= 1) apply();
  else video.addEventListener("loadedmetadata", apply, { once: true });
}

export function MobileHeroVideo({
  posterUrl = HERO_VIDEO_POSTER_URL,
  videoUrl = MOBILE_HERO_VIDEO_URL,
  fullscreenVideoUrl,
}: {
  posterUrl?: string;
  videoUrl?: string;
  fullscreenVideoUrl?: string;
}) {
  const inlineRef = useRef<HTMLVideoElement>(null);
  const portraitRef = useRef<PortraitVideo>(null);
  const fullscreenRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const activeRef = useRef(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const portrait = portraitRef.current;
    const frame = fullscreenRef.current;
    function restore() {
      if (!activeRef.current) return;
      activeRef.current = false;
      const inline = inlineRef.current;
      if (inline && portrait) {
        const playing = !portrait.paused;
        portrait.pause();
        seek(inline, portrait.currentTime);
        inline.muted = portrait.muted;
        inline.volume = portrait.volume;
        if (playing) void inline.play().catch(() => {});
        // Notify the inline controls after returning from native controls.
        inline.dispatchEvent(new Event("volumechange"));
      }
      setActive(false);
      triggerRef.current?.focus();
    }
    let previousFullscreenElement: Element | null = null;
    function onFullscreenChange() {
      const current = document.fullscreenElement;
      // Native controls can fullscreen the video inside the fullscreen frame.
      // Leaving that nested video must also leave the frame behind it.
      if (previousFullscreenElement === portrait && current === frame) {
        void document.exitFullscreen().then(restore).catch(() => {});
      } else if (!current) {
        restore();
      }
      previousFullscreenElement = current;
    }
    function onPresentationModeChange() {
      if (portrait?.webkitPresentationMode === "inline") restore();
    }
    function onKeyDown(event: KeyboardEvent) {
      if (!activeRef.current) return;
      if (event.key === "Escape" && !document.fullscreenElement) restore();
      if (event.key === "Tab") {
        // Native video controls are a single tab stop in the viewport fallback.
        const close = frame?.querySelector<HTMLButtonElement>("button");
        if (event.shiftKey && document.activeElement === portrait) {
          event.preventDefault();
          close?.focus();
        } else if (!event.shiftKey && document.activeElement === close) {
          event.preventDefault();
          portrait?.focus();
        }
      }
    }
    document.addEventListener("fullscreenchange", onFullscreenChange);
    document.addEventListener("keydown", onKeyDown);
    portrait?.addEventListener("webkitendfullscreen", restore);
    portrait?.addEventListener("webkitpresentationmodechanged", onPresentationModeChange);
    frame?.addEventListener("close-mobile-video", restore);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      document.removeEventListener("keydown", onKeyDown);
      portrait?.removeEventListener("webkitendfullscreen", restore);
      portrait?.removeEventListener("webkitpresentationmodechanged", onPresentationModeChange);
      frame?.removeEventListener("close-mobile-video", restore);
      portrait?.pause();
    };
  }, []);

  useEffect(() => {
    if (!active) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    fullscreenRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
    return () => { document.body.style.overflow = overflow; };
  }, [active]);

  function openFullscreen() {
    const inline = inlineRef.current;
    const portrait = portraitRef.current;
    const frame = fullscreenRef.current;
    if (!inline || !portrait || !frame) return;
    const wasPlaying = !inline.paused;
    portrait.muted = inline.muted;
    portrait.volume = inline.volume;
    seek(portrait, inline.currentTime);
    inline.pause();
    activeRef.current = true;
    setActive(true);
    // Reveal synchronously so native fullscreen stays within the tap gesture.
    frame.hidden = false;
    if (wasPlaying) void portrait.play().catch(() => {});
    if (frame.requestFullscreen && document.fullscreenEnabled) {
      void frame.requestFullscreen().then(() => {
        const orientation = screen.orientation as ScreenOrientation & { lock?: (value: string) => Promise<void> };
        return orientation?.lock?.("portrait").catch(() => {});
      }).catch(() => { /* The viewport player remains available if native fullscreen is denied. */ });
    } else if (portrait.webkitEnterFullscreen && portrait.readyState >= 1) {
      try { portrait.webkitEnterFullscreen(); } catch { /* Keep the viewport player available. */ }
    }
  }

  function closeFullscreen() {
    if (document.fullscreenElement === fullscreenRef.current || document.fullscreenElement === portraitRef.current) {
      void document.exitFullscreen().then(() => {
        // A nested native video can leave the container fullscreen underneath.
        if (document.fullscreenElement === fullscreenRef.current) return document.exitFullscreen();
      }).then(() => {
        fullscreenRef.current?.dispatchEvent(new Event("close-mobile-video"));
      }).catch(() => {});
    } else if (portraitRef.current?.webkitDisplayingFullscreen && portraitRef.current.webkitExitFullscreen) {
      portraitRef.current.webkitExitFullscreen();
    } else {
      fullscreenRef.current?.dispatchEvent(new Event("close-mobile-video"));
    }
  }

  return (
    <section data-video-frame className="mobile-hero-video relative aspect-[4/5] w-full overflow-hidden bg-black">
      <video ref={inlineRef} data-start-on-ready className="absolute inset-0 h-full w-full object-contain" muted loop playsInline preload="metadata" poster={posterUrl} src={videoUrl} />
      <VideoPlaybackButton className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 scale-[0.82]" />
      <VideoMuteButton className="absolute bottom-[24px] left-[26px] z-20 scale-[0.82]" />
      <button ref={triggerRef} type="button" aria-label="Enter fullscreen" onClick={openFullscreen} className="absolute bottom-[24px] right-[26px] z-20 flex h-11 w-11 items-center justify-center text-[#e04d26] focus-visible:outline-2">
        <svg aria-hidden="true" width="31" height="31" viewBox="0 0 32 32" fill="none"><path d="M2 11V2H11M21 2H30V11M30 21V30H21M11 30H2V21" stroke="currentColor" strokeWidth="4" /></svg>
      </button>
      <div ref={fullscreenRef} hidden={!active} role={active ? "dialog" : undefined} aria-modal={active || undefined} aria-label="Fullscreen video" className="fixed inset-0 z-[100] h-dvh w-screen bg-black">
        <video ref={portraitRef} src={fullscreenVideoUrl || videoUrl} className="h-full w-full object-contain" playsInline controls controlsList="nofullscreen" loop preload="metadata" />
        <button type="button" aria-label="Exit fullscreen" onClick={closeFullscreen} className="absolute right-4 top-[max(16px,env(safe-area-inset-top))] z-10 rounded-full bg-black/70 flex h-11 w-11 items-center justify-center text-white focus-visible:outline-2">
          <svg aria-hidden="true" width="27" height="27" viewBox="0 0 32 32" fill="none">
            <path d="M2 11H11V2M21 2V11H30M30 21H21V30M11 30V21H2" stroke="currentColor" strokeWidth="3" />
          </svg>
        </button>
      </div>
    </section>
  );
}
