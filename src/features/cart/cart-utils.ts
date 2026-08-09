import type { Money } from "@/types/shopify";

export function formatMoney({ amount, currencyCode }: Money, locale = "en-US"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
  }).format(amount);
}

export function formatCompactMoney(
  { amount, currencyCode }: Money,
  locale = "en-US",
): string {
  const hasFraction = !Number.isInteger(amount);

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: hasFraction ? 2 : 0,
    maximumFractionDigits: hasFraction ? 2 : 0,
  }).format(amount);
}
