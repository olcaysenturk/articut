"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";

const PAYMENT_MARKS = [
  { src: "/figma/afterpay.svg", alt: "Afterpay", width: 57, height: 12 },
  { src: "/figma/apple-pay.svg", alt: "Apple Pay", width: 29, height: 12 },
  { src: "/figma/american-express.svg", alt: "American Express", width: 42, height: 12 },
  { src: "/figma/mastercard.svg", alt: "Mastercard", width: 19, height: 12 },
  { src: "/figma/visa.svg", alt: "Visa", width: 37, height: 12 },
];

export function ProductPaymentReveal({
  button,
  buttonClassName,
  paymentClassName,
}: {
  button: ReactNode;
  buttonClassName: string;
  paymentClassName: string;
}) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(buttonRef, { amount: 0.85 });
  const reduceMotion = useReducedMotion();
  const isVisible = reduceMotion || isInView;

  return (
    <div className="pointer-events-none absolute inset-0">
      <div ref={buttonRef} className={`pointer-events-auto ${buttonClassName}`}>
        <motion.div
          data-product-button-reveal
          aria-hidden
          initial={false}
          animate={{ scaleX: isVisible ? 1 : 0, opacity: isVisible ? 1 : 0 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
          }
          style={{ transformOrigin: "center center" }}
          className="pointer-events-none absolute inset-0 rounded-full bg-[#e0e0e0]"
        >
        </motion.div>
        <motion.div
          initial={false}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { delay: isVisible ? 0.2 : 0, duration: 0.3, ease: "easeOut" }
          }
          className="relative z-10 [&_button]:!bg-transparent"
        >
          {button}
        </motion.div>
      </div>

      <motion.div
        data-product-payment-reveal
        initial={false}
        animate={isVisible ? "visible" : "hidden"}
        variants={{
          hidden: { opacity: 0, y: 10 },
          visible: {
            opacity: 1,
            y: 0,
            transition: reduceMotion
              ? { duration: 0 }
              : { delay: 0.85, duration: 0.35, staggerChildren: 0.07 },
          },
        }}
        className={paymentClassName}
      >
        <div className="flex items-center justify-center gap-[14px] opacity-90 md:gap-[26px]">
          {PAYMENT_MARKS.map((item) => (
            <motion.span
              key={item.src}
              variants={{
                hidden: { opacity: 0, y: 8 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.3, ease: "easeOut" }}
              className="inline-flex"
            >
              <Image
                src={item.src}
                alt={item.alt}
                width={item.width}
                height={item.height}
                className="h-[11px] w-auto brightness-0 invert md:h-[14px]"
              />
            </motion.span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
