"use client";

import { useEffect, useRef, useState } from "react";

const TOP_THRESHOLD = 80;
const BOTTOM_THRESHOLD = 24;

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
      const scrollingDown = scrollY > lastScrollY.current;

      if (atTop || atBottom || !scrollingDown) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      lastScrollY.current = scrollY;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return isVisible;
}
