"use client";

import { AddToCartBadgeIcon } from "@/components/product-detail/AddToCartBadgeIcon";
import { AddToCartButton } from "@/components/commerce/AddToCartButton";
import type { Product } from "@/types/shopify";

export function ProductAddBadge({ product }: { product: Product }) {
  const variant = product.variants.find((item) => item.available) ?? product.variants[0];

  return (
    <div
      data-product-badge
      className="pointer-events-none fixed -bottom-16 -right-16 z-30 opacity-0 motion-reduce:opacity-100"
    >
      <AddToCartButton
        variantId={variant?.id ?? null}
        quantity={1}
        disabled={!variant || !product.available}
        label="Add to Cart"
        className="pointer-events-auto relative size-[86px] cursor-pointer bg-transparent p-0 transition-transform hover:scale-105 md:size-[158px]"
      >
        <AddToCartBadgeIcon />
      </AddToCartButton>
    </div>
  );
}
