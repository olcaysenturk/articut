"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { overlayVariants, standardTransition, fadeInUp } from "@/lib/animation/motion-config";
import { useOverlayBehavior } from "@/components/ui/useOverlayBehavior";

type DialogProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

export function Dialog({ isOpen, onClose, title, children }: DialogProps) {
  const containerRef = useOverlayBehavior(isOpen, onClose);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={overlayVariants}
            transition={standardTransition}
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            ref={containerRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={fadeInUp}
            transition={standardTransition}
            className="relative z-10 w-full max-w-lg rounded-lg bg-background p-6 shadow-xl"
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
