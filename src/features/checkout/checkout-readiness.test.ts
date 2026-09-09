import { expect, it } from "vitest";
import type { ShopifyCart } from "@/lib/shopify/types";
import { checkoutReadinessError } from "./checkout-readiness";

const cart = {
  checkoutUrl: "https://example.myshopify.com/checkouts/cn/test?key=test",
  lines: { nodes: [{ quantity: 1, merchandise: { id: "variant-1", availableForSale: true } }] },
} as ShopifyCart;

it("allows an available cart with its checkout link intact", () => {
  expect(checkoutReadinessError(cart, cart)).toBeNull();
});

it.each(["https://example.myshopify.com/", "https://example.myshopify.com/password", "invalid"])("keeps invalid checkout destination %s local", (checkoutUrl) => {
  expect(checkoutReadinessError({ ...cart, checkoutUrl }, cart)).toBeTruthy();
});

it("blocks products removed or made unavailable after a country change", () => {
  expect(checkoutReadinessError({ ...cart, lines: { nodes: [] } }, cart)).toBeTruthy();
  const line = cart.lines.nodes[0];
  expect(checkoutReadinessError({ ...cart, lines: { nodes: [{ ...line, merchandise: { ...line.merchandise, availableForSale: false } }] } }, cart)).toBeTruthy();
  expect(checkoutReadinessError({ ...cart, lines: { nodes: [{ ...line, quantity: 2 }] } }, cart)).toBeTruthy();
});
