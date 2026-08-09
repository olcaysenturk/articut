"use client";

import Image from "next/image";
import { useTransition } from "react";
import { removeCartLine, updateCartLineQuantity } from "@/app/actions/cart-actions";
import { formatCompactMoney } from "@/features/cart/cart-utils";
import { useCartStore } from "@/features/cart/cart-store";
import type { CartLine } from "@/types/shopify";

type CartItemProps = {
  line: CartLine;
  onChange: () => void;
};

export function CartItem({ line, onChange }: CartItemProps) {
  const [isPending, startTransition] = useTransition();
  const setError = useCartStore((state) => state.setError);
  const fallbackImage = line.productTitle.toLowerCase().includes("scissor")
    ? "/figma/scissors-product.png"
    : "/figma/cutpilot-product.png";

  function handleQuantityChange(quantity: number) {
    startTransition(async () => {
      const result = await updateCartLineQuantity(line.id, quantity);
      if (!result.success) {
        setError(result.error);
        return;
      }
      onChange();
    });
  }

  function handleRemove() {
    startTransition(async () => {
      const result = await removeCartLine(line.id);
      if (!result.success) {
        setError(result.error);
        return;
      }
      onChange();
    });
  }

  return (
    <article
      className="relative h-[195px] shrink-0 overflow-hidden border-b border-white/80 px-[32px] py-[54px] md:px-[50px]"
      aria-busy={isPending}
    >
      <Image
        src={line.image?.url ?? fallbackImage}
        alt=""
        fill
        sizes="(max-width: 767px) 100vw, 370px"
        className="pointer-events-none object-contain p-[10px] opacity-[0.08]"
      />

      <div className={`relative z-10 transition-opacity ${isPending ? "opacity-45" : "opacity-100"}`}>
        <div className="flex items-start justify-between gap-4 text-[22px] leading-none">
          <div className="min-w-0">
            <p className="truncate">{line.productTitle}</p>
            {line.variantTitle && line.variantTitle !== "Default Title" ? (
              <p className="mt-2 truncate text-[11px] opacity-60">{line.variantTitle}</p>
            ) : null}
          </div>
          <p className="shrink-0">{formatCompactMoney(line.linePrice)}</p>
        </div>

        <div className="mt-[25px] flex items-center justify-between text-[13px] leading-none">
          <div className="flex items-center gap-[22px]">
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => handleQuantityChange(Math.min(99, line.quantity + 1))}
              disabled={isPending || line.quantity >= 99}
              className="h-6 w-6 cursor-pointer text-[20px] transition-[color,transform,opacity] duration-200 hover:scale-110 hover:text-[#e94b24] active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100 disabled:hover:text-inherit"
            >
              +
            </button>
            <span aria-live="polite" className="min-w-3 text-center text-[20px] font-semibold">
              {line.quantity}
            </span>
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => handleQuantityChange(Math.max(1, line.quantity - 1))}
              disabled={isPending || line.quantity <= 1}
              className="h-6 w-6 cursor-pointer text-[20px] transition-[color,transform,opacity] duration-200 hover:scale-110 hover:text-[#e94b24] active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100 disabled:hover:text-inherit"
            >
              -
            </button>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            disabled={isPending}
            className="cursor-pointer transition-[color,opacity] duration-200 hover:text-[#e94b24] hover:underline hover:underline-offset-4 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-inherit disabled:hover:no-underline"
          >
            remove
          </button>
        </div>
      </div>
    </article>
  );
}
