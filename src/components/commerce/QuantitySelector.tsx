"use client";

import { cn } from "@/lib/utils";

type QuantitySelectorProps = {
  quantity: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
  className?: string;
};

export function QuantitySelector({
  quantity,
  onChange,
  min = 1,
  max = 99,
  className,
}: QuantitySelectorProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-4 rounded-(--radius-button) border border-border px-4 py-2",
        className,
      )}
    >
      <button
        type="button"
        aria-label="Adedi azalt"
        onClick={() => onChange(Math.max(min, quantity - 1))}
        disabled={quantity <= min}
        className="text-lg disabled:opacity-30"
      >
        −
      </button>
      <span aria-live="polite" className="w-6 text-center">
        {quantity}
      </span>
      <button
        type="button"
        aria-label="Adedi artır"
        onClick={() => onChange(Math.min(max, quantity + 1))}
        disabled={quantity >= max}
        className="text-lg disabled:opacity-30"
      >
        +
      </button>
    </div>
  );
}
