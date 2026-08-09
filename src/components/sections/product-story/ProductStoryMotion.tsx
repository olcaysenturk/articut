"use client";

import { type ReactNode, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsapPlugins } from "@/lib/animation/gsap";
import { mediaQueries } from "@/lib/animation/breakpoints";

export function ProductStoryMotion({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsapPlugins();

      if (!scope.current || window.matchMedia(mediaQueries.reducedMotion).matches) {
        return;
      }

      const panels = gsap.utils.toArray<HTMLElement>(".product-story-panel", scope.current);

      panels.forEach((panel) => {
        gsap.fromTo(
          panel,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: panel,
              start: "top 80%",
              end: "top 40%",
              scrub: true,
            },
          },
        );
      });
    },
    { scope },
  );

  return <div ref={scope}>{children}</div>;
}
