"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { AddToCartButton } from "@/components/commerce/AddToCartButton";
import { formatCompactMoney } from "@/features/cart/cart-utils";
import type { Product } from "@/types/shopify";

const PAYMENT_METHODS = [
  { src: "/figma/afterpay.svg", alt: "Afterpay", width: 65, height: 14 },
  { src: "/figma/apple-pay.svg", alt: "Apple Pay", width: 33, height: 14 },
  { src: "/figma/american-express.svg", alt: "American Express", width: 48, height: 14 },
  { src: "/figma/mastercard.svg", alt: "Mastercard", width: 22, height: 14 },
  { src: "/figma/visa.svg", alt: "Visa", width: 42, height: 14 },
];

export function ProductPurchaseCta({ product }: { product: Product }) {
  const variant = product.variants.find((item) => item.available) ?? product.variants[0];
  const price = formatCompactMoney(variant?.price ?? product.price);
  const rootRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(rootRef, { amount: 0.85 });
  const reduceMotion = useReducedMotion();
  const isVisible = reduceMotion || isInView;

  return (
    <div ref={rootRef} className="flex flex-col items-center gap-[22px]">
      <div className="product-purchase-hover relative h-[46px] w-[227px] md:h-[61px] md:w-[304px]">
        <motion.div
          aria-hidden
          initial={false}
          animate={{ scaleX: isVisible ? 1 : 0, opacity: isVisible ? 1 : 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: "center center" }}
          className="product-purchase-pill pointer-events-none absolute inset-0 rounded-full bg-[#e04d26]"
        />
        <motion.div
          initial={false}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={reduceMotion ? { duration: 0 } : { delay: isVisible ? 0.2 : 0, duration: 0.3, ease: "easeOut" }}
          className="relative z-10 h-full w-full"
        >
          <AddToCartButton
            variantId={variant?.id ?? null}
            quantity={1}
            disabled={!variant || !product.available}
            label={`Add to Cart    →    ${price}`}
            className="h-full w-full cursor-pointer whitespace-pre bg-transparent px-4 text-[14px] font-normal text-[#e0e0e0] md:px-8 md:text-[20px]"
          />
        </motion.div>
      </div>
      <motion.div
        initial={false}
        animate={isVisible ? "visible" : "hidden"}
        variants={{
          hidden: { opacity: 0, y: 10 },
          visible: {
            opacity: 1,
            y: 0,
            transition: reduceMotion ? { duration: 0 } : { delay: 0.85, duration: 0.35, staggerChildren: 0.07 },
          },
        }}
        className="flex h-[14px] items-center justify-center gap-[18px] md:gap-[27px]"
      >
        {PAYMENT_METHODS.map((method) => (
          <motion.span
            key={method.alt}
            variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.3, ease: "easeOut" }}
            className="inline-flex"
          >
            <Image
              src={method.src}
              alt={method.alt}
              width={method.width}
              height={method.height}
              className="h-[11px] w-auto brightness-0 invert md:h-[14px]"
            />
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}
