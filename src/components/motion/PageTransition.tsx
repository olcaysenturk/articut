"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { fadeInUp, standardTransition } from "@/lib/animation/motion-config";

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={fadeInUp}
        transition={standardTransition}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
