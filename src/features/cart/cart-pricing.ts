import type { Money } from "@/types/shopify";

export function normalizeCartQuantity(quantity: number): number {
  if (!Number.isFinite(quantity)) {
    return 1;
  }

  return Math.max(1, Math.floor(quantity));
}

export function resolveCartLinePrice({
  reportedTotal,
  unitPrice,
  quantity,
  discountAmount,
}: {
  reportedTotal: Money;
  unitPrice: Money;
  quantity: number;
  discountAmount: number;
}): Money {
  if (reportedTotal.amount !== 0 || unitPrice.amount === 0 || discountAmount > 0) {
    return reportedTotal;
  }

  return {
    amount: unitPrice.amount * quantity,
    currencyCode: reportedTotal.currencyCode,
  };
}

export function resolveCartSubtotal({
  reportedSubtotal,
  linePrices,
  discountAmount,
}: {
  reportedSubtotal: Money;
  linePrices: Money[];
  discountAmount: number;
}): Money {
  if (reportedSubtotal.amount !== 0 || discountAmount > 0) {
    return reportedSubtotal;
  }

  return {
    amount: linePrices.reduce((total, price) => total + price.amount, 0),
    currencyCode: reportedSubtotal.currencyCode,
  };
}
