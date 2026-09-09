"use client";

import { useCartStore } from "@/features/cart/cart-store";
import { cn } from "@/lib/utils";

type CartButtonProps = {
  className?: string;
  tabIndex?: number;
};

export function CartButton({ className, tabIndex }: CartButtonProps) {
  const openDrawer = useCartStore((state) => state.openDrawer);

  return (
    <button
      type="button"
      onClick={openDrawer}
      aria-label="Open cart"
      tabIndex={tabIndex}
      className={cn(
        "cursor-pointer text-sm font-semibold transition-opacity duration-200 hover:opacity-65",
        className,
      )}
    >
      Cart
    </button>
  );
}
