"use client";

import { type ReactNode, useTransition } from "react";
import { addToCart } from "@/app/actions/cart-actions";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/features/cart/cart-store";

type AddToCartButtonProps = {
  variantId: string | null;
  quantity: number;
  disabled?: boolean;
  className?: string;
  label?: string;
  children?: ReactNode;
};

export function AddToCartButton({
  variantId,
  quantity,
  disabled,
  className,
  label = "Add to Cart",
  children,
}: AddToCartButtonProps) {
  const [isPending, startTransition] = useTransition();
  const setError = useCartStore((state) => state.setError);
  const openDrawer = useCartStore((state) => state.openDrawer);

  function handleClick() {
    if (!variantId) {
      return;
    }

    startTransition(async () => {
      const result = await addToCart(variantId, quantity);

      if (!result.success) {
        setError(result.error);
        return;
      }

      setError(null);
      openDrawer();
    });
  }

  return (
    <Button
      onClick={handleClick}
      disabled={disabled || !variantId || isPending}
      aria-busy={isPending}
      aria-label={children ? label : undefined}
      className={className}
    >
      {isPending && !children ? "Adding..." : (children ?? label)}
    </Button>
  );
}
