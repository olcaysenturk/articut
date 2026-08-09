"use client";

import { type ReactNode, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsapPlugins } from "@/lib/animation/gsap";
import { mediaQueries } from "@/lib/animation/breakpoints";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsapPlugins();

      if (!scope.current) {
        return;
      }

      if (window.matchMedia(mediaQueries.reducedMotion).matches) {
        gsap.set(scope.current, { opacity: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        scope.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay,
          ease: "power2.out",
          scrollTrigger: {
            trigger: scope.current,
            start: "top 85%",
          },
        },
      );
    },
    { scope, dependencies: [delay] },
  );

  return (
    <div ref={scope} className={cn(className)}>
      {children}
    </div>
  );
}
