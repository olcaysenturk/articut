"use client";

import { useCallback, useRef } from "react";

/**
 * Keeps an element visually pinned to the viewport's top edge, like
 * `position: fixed`, but without ever using `fixed`/`sticky`/`transform`,
 * and without a JS loop writing `top` as an inline style every frame.
 *
 * Those properties (fixed/sticky/transform on an ancestor) promote the
 * element to its own compositing layer in Chromium, which silently breaks
 * `mix-blend-mode` on its descendants (the blend can no longer see the
 * real page content behind it) — see the header components using this
 * hook. So the element has to track scroll via `top` instead. A per-frame
 * `requestAnimationFrame` loop writing `style.top` works, but only as
 * well as the main thread keeps up with every single frame; any
 * main-thread work in a given frame (a React re-render, GSAP, video
 * decode) can make the element skip a frame relative to the
 * compositor-scrolled page under it, which reads as a stutter/jitter.
 *
 * Instead this applies the `.scroll-pinned` class (see animations.css),
 * which drives `top` with a CSS scroll-driven animation
 * (`animation-timeline: scroll(root)`) — evaluated by the browser's
 * style/animation engine against the actual scroll offset, independent of
 * main-thread frame budget, so it can't fall behind that way. The only
 * thing this hook writes in JS is the `--scroll-pin-max` custom property
 * (the page's max scroll distance, in px, which the keyframe's `to` value
 * reads), and only when it changes — on mount, on viewport resize, and
 * whenever the document's height changes (content loading in, images
 * resolving), never per scroll frame.
 *
 * Uses a callback ref (not a plain object ref + mount effect) because the
 * pinned element is often mounted late — e.g. behind a portal that only
 * appears once its target node is found in an effect. A mount-effect with
 * an empty dependency array would run before that node exists and never
 * see it.
 */
export function useScrollSyncedTop<T extends HTMLElement>() {
  const cleanupRef = useRef<(() => void) | null>(null);

  return useCallback((node: T | null) => {
    cleanupRef.current?.();
    cleanupRef.current = null;

    if (!node) return;

    node.classList.add("scroll-pinned");

    function setMaxScroll() {
      const max = Math.max(
        0,
        document.documentElement.scrollHeight - document.documentElement.clientHeight,
      );
      node!.style.setProperty("--scroll-pin-max", `${max}px`);
    }
    setMaxScroll();

    // Observe <body>, not <html>: the root element's own box is clamped to
    // the viewport (it doesn't grow with overflowing content), so it never
    // reports the content-height changes we actually need to react to —
    // images resolving, CMS content streaming in, etc. <body> does.
    const resizeObserver = new ResizeObserver(setMaxScroll);
    resizeObserver.observe(document.body);
    window.addEventListener("resize", setMaxScroll);

    cleanupRef.current = () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", setMaxScroll);
    };
  }, []);
}
