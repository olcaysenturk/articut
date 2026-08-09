import { describe, expect, it } from "vitest";
import {
  normalizeCartQuantity,
  resolveCartLinePrice,
  resolveCartSubtotal,
} from "@/features/cart/cart-pricing";

const usd = (amount: number) => ({ amount, currencyCode: "USD" });

describe("normalizeCartQuantity", () => {
  it("normalizes zero, negative and invalid quantities to one", () => {
    expect(normalizeCartQuantity(0)).toBe(1);
    expect(normalizeCartQuantity(-2)).toBe(1);
    expect(normalizeCartQuantity(Number.NaN)).toBe(1);
  });

  it("keeps positive whole quantities", () => {
    expect(normalizeCartQuantity(3)).toBe(3);
  });
});

describe("resolveCartLinePrice", () => {
  it("uses the Shopify line total when it is non-zero", () => {
    expect(
      resolveCartLinePrice({
        reportedTotal: usd(80),
        unitPrice: usd(90),
        quantity: 1,
        discountAmount: 10,
      }),
    ).toEqual(usd(80));
  });

  it("recovers a stale zero line total from unit price and quantity", () => {
    expect(
      resolveCartLinePrice({
        reportedTotal: usd(0),
        unitPrice: usd(90),
        quantity: 2,
        discountAmount: 0,
      }),
    ).toEqual(usd(180));
  });

  it("preserves a zero total created by a full discount", () => {
    expect(
      resolveCartLinePrice({
        reportedTotal: usd(0),
        unitPrice: usd(90),
        quantity: 1,
        discountAmount: 90,
      }),
    ).toEqual(usd(0));
  });
});

describe("resolveCartSubtotal", () => {
  it("recovers a stale zero subtotal from resolved line prices", () => {
    expect(
      resolveCartSubtotal({
        reportedSubtotal: usd(0),
        linePrices: [usd(90), usd(30)],
        discountAmount: 0,
      }),
    ).toEqual(usd(120));
  });

  it("preserves a discounted zero subtotal", () => {
    expect(
      resolveCartSubtotal({
        reportedSubtotal: usd(0),
        linePrices: [usd(90)],
        discountAmount: 90,
      }),
    ).toEqual(usd(0));
  });
});
