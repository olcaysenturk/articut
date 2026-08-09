"use client";

import { useTransition } from "react";
import { buyNow } from "@/app/actions/cart-actions";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/features/cart/cart-store";

type BuyNowButtonProps = {
  variantId: string | null;
  quantity: number;
  disabled?: boolean;
};

export function BuyNowButton({ variantId, quantity, disabled }: BuyNowButtonProps) {
  const [isPending, startTransition] = useTransition();
  const setError = useCartStore((state) => state.setError);

  function handleClick() {
    if (!variantId) {
      return;
    }

    startTransition(async () => {
      const result = await buyNow(variantId, quantity);

      if (!result.success) {
        setError(result.error);
        return;
      }

      window.location.href = result.checkoutUrl;
    });
  }

  return (
    <Button
      variant="secondary"
      onClick={handleClick}
      disabled={disabled || !variantId || isPending}
      aria-busy={isPending}
    >
      {isPending ? "Yönlendiriliyor..." : "Hemen Satın Al"}
    </Button>
  );
}
