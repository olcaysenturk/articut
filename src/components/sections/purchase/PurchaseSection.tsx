"use client";

import { useEffect, useState } from "react";
import { AddToCartButton } from "@/components/commerce/AddToCartButton";
import { BuyNowButton } from "@/components/commerce/BuyNowButton";
import { ProductPrice } from "@/components/commerce/ProductPrice";
import { QuantitySelector } from "@/components/commerce/QuantitySelector";
import { VariantSelector } from "@/components/commerce/VariantSelector";
import { Container } from "@/components/ui/Container";
import { useCartStore } from "@/features/cart/cart-store";
import type { Product } from "@/types/shopify";

type PurchaseSectionProps = {
  product: Product;
};

export function PurchaseSection({ product }: PurchaseSectionProps) {
  const [quantity, setQuantity] = useState(1);
  const selectedVariantId = useCartStore((state) => state.selectedVariantId);
  const setSelectedVariantId = useCartStore((state) => state.setSelectedVariantId);

  useEffect(() => {
    if (!selectedVariantId) {
      const firstAvailable =
        product.variants.find((variant) => variant.available) ?? product.variants[0];
      if (firstAvailable) {
        setSelectedVariantId(firstAvailable.id);
      }
    }
  }, [product.variants, selectedVariantId, setSelectedVariantId]);

  const selectedVariant = product.variants.find((variant) => variant.id === selectedVariantId);
  const isAvailable = selectedVariant?.available ?? product.available;

  return (
    <section className="py-(--space-section)">
      <Container className="flex flex-col gap-8">
        <ProductPrice
          price={selectedVariant?.price ?? product.price}
          compareAtPrice={selectedVariant?.compareAtPrice ?? product.compareAtPrice}
        />

        {product.options.length > 0 && (
          <VariantSelector
            options={product.options}
            variants={product.variants}
            selectedVariantId={selectedVariantId}
            onSelectVariant={setSelectedVariantId}
          />
        )}

        <QuantitySelector quantity={quantity} onChange={setQuantity} />

        {!isAvailable && <p className="text-sm text-red-600">Stokta yok</p>}

        <div className="flex flex-wrap gap-4">
          <AddToCartButton variantId={selectedVariantId} quantity={quantity} disabled={!isAvailable} />
          <BuyNowButton variantId={selectedVariantId} quantity={quantity} disabled={!isAvailable} />
        </div>
      </Container>
    </section>
  );
}
