import { describe, expect, it } from "vitest";
import { formatCompactMoney, formatMoney } from "@/features/cart/cart-utils";

describe("formatMoney", () => {
  it("formats an amount with the given currency", () => {
    expect(formatMoney({ amount: 199.9, currencyCode: "USD" })).toBe("$199.90");
  });
});

describe("formatCompactMoney", () => {
  it("omits decimals for whole amounts", () => {
    expect(formatCompactMoney({ amount: 85, currencyCode: "USD" })).toBe("$85");
  });

  it("keeps decimals for fractional amounts", () => {
    expect(formatCompactMoney({ amount: 85.5, currencyCode: "USD" })).toBe("$85.50");
  });
});
