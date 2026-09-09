"use client";

import { useEffect, useState } from "react";

// Keep the brand color over both the home video and the product hero.
const HERO_SELECTOR = "[data-video-frame], [data-product-hero]";

/** Disables backdrop blending while the header overlaps an opening hero. */
export function useIsOverVideoHero() {
  const [isOver, setIsOver] = useState(true);

  useEffect(() => {
    function check() {
      const hero = document.querySelector(HERO_SELECTOR);
      if (!hero) {
        setIsOver(false);
        return;
      }
      const rect = hero.getBoundingClientRect();
      const headerHeight = window.matchMedia("(min-width: 768px)").matches ? 100 : 62;
      setIsOver(rect.bottom > 0 && rect.top < headerHeight);
    }

    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  return isOver;
}
