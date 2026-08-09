"use client";

import { useEffect, type RefObject } from "react";
import { mediaQueries } from "@/lib/animation/breakpoints";

const ZOOM_CLASS = "settle-zoom";

export function useSettleZoom(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const element = ref.current;
    if (!element || window.matchMedia(mediaQueries.reducedMotion).matches) {
      return;
    }

    let animation: Animation | undefined;
    let isArmed = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          animation?.cancel();
          animation = undefined;
          isArmed = true;
          element.style.transform = "";
          element.style.willChange = "transform";
          element.classList.add(ZOOM_CLASS);
          return;
        }

        if (!isArmed || entry.intersectionRatio < 0.6) {
          return;
        }

        isArmed = false;
        const currentAnimation = element.animate(
          [
            { transform: "scale(1.08)", offset: 0, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
            { transform: "scale(1)", offset: 1 },
          ],
          { duration: 1400, fill: "forwards" },
        );
        animation = currentAnimation;
        currentAnimation.onfinish = () => {
          element.classList.remove(ZOOM_CLASS);
          element.style.transform = "";
          element.style.willChange = "auto";
          currentAnimation.cancel();
          if (animation === currentAnimation) {
            animation = undefined;
          }
        };
      },
      { threshold: [0, 0.6] },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      animation?.cancel();
    };
  }, [ref]);
}
