"use client";

import { type ReactNode, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsapPlugins } from "@/lib/animation/gsap";
import { mediaQueries } from "@/lib/animation/breakpoints";

export function HeroMotion({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsapPlugins();

      if (!scope.current || window.matchMedia(mediaQueries.reducedMotion).matches) {
        return;
      }

      gsap.fromTo(
        scope.current.children,
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.12 },
      );
    },
    { scope },
  );

  return <div ref={scope}>{children}</div>;
}
