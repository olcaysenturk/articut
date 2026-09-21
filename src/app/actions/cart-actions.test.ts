import { beforeEach, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/shopify/client", () => ({ ShopifyApiError: class extends Error {} }));
vi.mock("@/lib/shopify/queries/variant", () => ({ isVariantAvailable: vi.fn() }));
vi.mock("@/lib/shopify/cart-cookie", () => ({ getCartId: vi.fn(), setCartId: vi.fn(), clearCartId: vi.fn() }));
vi.mock("@/lib/shopify/mutations/cart-create", () => ({ cartCreate: vi.fn() }));
vi.mock("@/lib/shopify/mutations/cart-add", () => ({ cartLinesAdd: vi.fn() }));
vi.mock("@/lib/shopify/mutations/cart-update", () => ({ cartLinesUpdate: vi.fn() }));
vi.mock("@/lib/shopify/mutations/cart-remove", () => ({ cartLinesRemove: vi.fn() }));
vi.mock("@/lib/shopify/queries/cart", () => ({ getCart: vi.fn() }));
vi.mock("@/lib/shopify/mappers", () => ({ toCart: vi.fn((cart) => cart) }));

import { addToCart, buyNow, updateCartLineQuantity } from "./cart-actions";
import { isVariantAvailable } from "@/lib/shopify/queries/variant";
import { getCartId } from "@/lib/shopify/cart-cookie";
import { cartLinesAdd } from "@/lib/shopify/mutations/cart-add";
import { cartLinesUpdate } from "@/lib/shopify/mutations/cart-update";
import { getCart } from "@/lib/shopify/queries/cart";
import type { ShopifyCart } from "@/lib/shopify/types";

beforeEach(() => vi.resetAllMocks());

it.each([addToCart, buyNow])("blocks unavailable variants before changing the cart", async (action) => {
  vi.mocked(isVariantAvailable).mockResolvedValue(false);
  expect((await action("sold-out", 1)).success).toBe(false);
  expect(getCartId).not.toHaveBeenCalled();
  expect(cartLinesAdd).not.toHaveBeenCalled();
});

it.each([addToCart, buyNow])("allows available variants", async (action) => {
  vi.mocked(isVariantAvailable).mockResolvedValue(true);
  vi.mocked(getCartId).mockResolvedValue("cart-1");
  vi.mocked(cartLinesAdd).mockResolvedValue({ cart: { id: "cart-1" } as ShopifyCart, userErrors: [] });
  expect((await action("available", 1)).success).toBe(true);
  expect(cartLinesAdd).toHaveBeenCalledWith("cart-1", [{ merchandiseId: "available", quantity: 1 }]);
});

it("blocks quantity changes when an existing item sells out", async () => {
  vi.mocked(getCartId).mockResolvedValue("cart-1");
  vi.mocked(getCart).mockResolvedValue({ lines: { nodes: [{ id: "line-1", merchandise: { availableForSale: false } }] } } as ShopifyCart);
  expect((await updateCartLineQuantity("line-1", 2)).success).toBe(false);
  expect(cartLinesUpdate).not.toHaveBeenCalled();
});
