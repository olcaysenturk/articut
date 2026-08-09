import { formatMoney } from "@/features/cart/cart-utils";
import type { Money } from "@/types/shopify";
import { cn } from "@/lib/utils";

type ProductPriceProps = {
  price: Money;
  compareAtPrice?: Money | null;
  className?: string;
};

export function ProductPrice({ price, compareAtPrice, className }: ProductPriceProps) {
  const isDiscounted = Boolean(compareAtPrice && compareAtPrice.amount > price.amount);

  return (
    <div className={cn("flex items-baseline gap-3", className)}>
      <span className="text-lg font-medium">{formatMoney(price)}</span>
      {isDiscounted && compareAtPrice && (
        <span className="text-sm text-muted line-through">{formatMoney(compareAtPrice)}</span>
      )}
    </div>
  );
}
