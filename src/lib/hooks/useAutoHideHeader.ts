"use client";

import { useEffect, useRef, useState } from "react";

const TOP_THRESHOLD = 80;
const BOTTOM_THRESHOLD = 24;
const DIRECTION_THRESHOLD = 6;

export function useAutoHideHeader() {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    function handleScroll() {
      const scrollY = window.scrollY;
      const atTop = scrollY <= TOP_THRESHOLD;
      const atBottom =
        window.innerHeight + scrollY >= document.documentElement.scrollHeight - BOTTOM_THRESHOLD;

      if (atTop || atBottom) {
        setIsVisible(true);
        lastScrollY.current = scrollY;
        return;
      }

      const delta = scrollY - lastScrollY.current;
      // Ignore sub-threshold deltas (trackpad/momentum noise) so the state
      // doesn't flap back and forth on tiny direction reversals — only a
      // sustained scroll past DIRECTION_THRESHOLD commits a new direction.
      if (Math.abs(delta) < DIRECTION_THRESHOLD) {
        return;
      }

      setIsVisible(delta < 0);
      lastScrollY.current = scrollY;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return isVisible;
}
