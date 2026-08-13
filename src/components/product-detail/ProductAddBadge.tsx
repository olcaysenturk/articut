"use client";

import { motion } from "motion/react";
import { AddToCartBadgeIcon } from "@/components/product-detail/AddToCartBadgeIcon";
import { AddToCartButton } from "@/components/commerce/AddToCartButton";
import { useCartStore } from "@/features/cart/cart-store";
import type { Product } from "@/types/shopify";

export function ProductAddBadge({ product }: { product: Product }) {
  const variant = product.variants.find((item) => item.available) ?? product.variants[0];
  const isDrawerOpen = useCartStore((state) => state.isDrawerOpen);

  return (
    <div
      data-product-badge
      className="pointer-events-none fixed bottom-[-126px] right-[-123px] z-30 opacity-0 motion-reduce:opacity-100"
    >
      <motion.div
        initial={false}
        animate={isDrawerOpen ? "hidden" : "visible"}
        variants={{
          visible: { opacity: 1, scale: 1, rotate: 0, y: 0 },
          hidden: { opacity: 0, scale: 0.72, rotate: 18, y: 24 },
        }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        className={isDrawerOpen ? "pointer-events-none" : "pointer-events-auto"}
      >
        <AddToCartButton
          variantId={variant?.id ?? null}
          quantity={1}
          disabled={!variant || !product.available}
          label="Add to Cart"
          className="relative h-[241px] w-[243px] cursor-pointer bg-transparent p-0 transition-transform hover:scale-105"
        >
          <AddToCartBadgeIcon />
        </AddToCartButton>
      </motion.div>
    </div>
  );
}
