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
  const setCart = useCartStore((state) => state.setCart);
  const setError = useCartStore((state) => state.setError);
  const openDrawer = useCartStore((state) => state.openDrawer);
  const setLoading = useCartStore((state) => state.setLoading);

  function handleClick() {
    if (!variantId) {
      return;
    }

    setError(null);
    setLoading(true);
    openDrawer();

    startTransition(async () => {
      const result = await addToCart(variantId, quantity);

      if (!result.success) {
        setError(result.error);
        setLoading(false);
        return;
      }

      setError(null);
      setCart(result.cart);
      setLoading(false);
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
      {children ?? label}
    </Button>
  );
}
