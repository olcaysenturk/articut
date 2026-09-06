"use client";

import { motion, type MotionValue } from "motion/react";

// Same outline as the source mark, re-rooted to start at the inner notch (the
// gap between the two strokes of the "A") and traced rightward first, closing
// back on itself at that same point.
const MARK_PATH =
  "M927.0717,544.9001L943.942,574.4354L979.1656,636.0467L1066.8966,636.0467L959.9723,443.9533L853.1034,636.0467L930.2266,636.0467C908.3743,613.2675 904.5687,577.5741 922.9635,550.3657C924.2526,548.4594 927.0717,544.9001 927.0717,544.9001Z";

type BrandLoaderProps = {
  announce?: boolean;
  progress: MotionValue<number>;
};

export function BrandLoader({ announce = true, progress }: BrandLoaderProps) {
  return (
    <div
      role={announce ? "status" : undefined}
      aria-label={announce ? "Loading page" : undefined}
      aria-hidden={announce ? undefined : true}
      className="relative grid h-dvh w-full place-items-center overflow-hidden bg-[#e04d26] text-[#1f1f1f]"
    >
      <div className="flex w-full items-center justify-center px-8">
        <svg
          viewBox="820 420 280 240"
          fill="none"
          aria-hidden="true"
          className="h-auto w-[min(280px,62vw)]"
        >
          <motion.path
            d={MARK_PATH}
            stroke="#1f1f1f"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ pathLength: progress }}
          />
        </svg>
      </div>
      {announce && <span className="sr-only">Loading</span>}
    </div>
  );
}
