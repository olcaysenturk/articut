"use server";

import { clearCartId, getCartId, setCartId } from "@/lib/shopify/cart-cookie";
import { ShopifyApiError } from "@/lib/shopify/client";
import { cartCreate } from "@/lib/shopify/mutations/cart-create";
import { cartLinesAdd } from "@/lib/shopify/mutations/cart-add";
import { cartLinesRemove } from "@/lib/shopify/mutations/cart-remove";
import { cartLinesUpdate } from "@/lib/shopify/mutations/cart-update";
import { getCart } from "@/lib/shopify/queries/cart";
import { toCart } from "@/lib/shopify/mappers";
import type { BuyNowResult, CartActionResult } from "@/features/cart/cart-types";
import { normalizeCartQuantity } from "@/features/cart/cart-pricing";
import type { ShopifyCart, ShopifyUserError } from "@/lib/shopify/types";

const GENERIC_CART_ERROR = "Sepet güncellenemedi. Lütfen tekrar deneyin.";

function firstUserError(userErrors: ShopifyUserError[]): string | null {
  return userErrors[0]?.message ?? null;
}

function toActionResult(cart: ShopifyCart | null, userErrors: ShopifyUserError[]): CartActionResult {
  if (userErrors.length > 0 || !cart) {
    console.error("Shopify cart mutation user errors", userErrors);
    return { success: false, error: firstUserError(userErrors) ?? GENERIC_CART_ERROR };
  }

  return { success: true, cart: toCart(cart) };
}

async function ensureCart(): Promise<string> {
  const existingCartId = await getCartId();
  if (existingCartId) {
    return existingCartId;
  }

  const { cart, userErrors } = await cartCreate();
  if (userErrors.length > 0 || !cart) {
    throw new ShopifyApiError(GENERIC_CART_ERROR, userErrors);
  }

  await setCartId(cart.id);
  return cart.id;
}

export async function getOrCreateCart(): Promise<CartActionResult> {
  try {
    const cartId = await ensureCart();
    let cart = await getCart(cartId);

    if (!cart) {
      await clearCartId();
      return { success: false, error: GENERIC_CART_ERROR };
    }

    const invalidLines = cart.lines.nodes.filter((line) => line.quantity < 1);
    if (invalidLines.length > 0) {
      const repaired = await cartLinesUpdate(
        cartId,
        invalidLines.map((line) => ({ id: line.id, quantity: 1 })),
      );

      if (repaired.cart && repaired.userErrors.length === 0) {
        cart = repaired.cart;
      } else {
        console.error("Shopify invalid cart quantity repair failed", repaired.userErrors);
      }
    }

    return { success: true, cart: toCart(cart) };
  } catch (error) {
    console.error("getOrCreateCart failed", error);
    return { success: false, error: GENERIC_CART_ERROR };
  }
}

export async function addToCart(variantId: string, quantity: number): Promise<CartActionResult> {
  try {
    const cartId = await ensureCart();
    const { cart, userErrors } = await cartLinesAdd(cartId, [
      { merchandiseId: variantId, quantity: normalizeCartQuantity(quantity) },
    ]);
    return toActionResult(cart, userErrors);
  } catch (error) {
    console.error("addToCart failed", error);
    return { success: false, error: GENERIC_CART_ERROR };
  }
}

export async function updateCartLineQuantity(
  lineId: string,
  quantity: number,
): Promise<CartActionResult> {
  try {
    const cartId = await getCartId();
    if (!cartId) {
      return { success: false, error: GENERIC_CART_ERROR };
    }

    const { cart, userErrors } = await cartLinesUpdate(cartId, [
      { id: lineId, quantity: normalizeCartQuantity(quantity) },
    ]);
    return toActionResult(cart, userErrors);
  } catch (error) {
    console.error("updateCartLineQuantity failed", error);
    return { success: false, error: GENERIC_CART_ERROR };
  }
}

export async function removeCartLine(lineId: string): Promise<CartActionResult> {
  try {
    const cartId = await getCartId();
    if (!cartId) {
      return { success: false, error: GENERIC_CART_ERROR };
    }

    const { cart, userErrors } = await cartLinesRemove(cartId, [lineId]);
    return toActionResult(cart, userErrors);
  } catch (error) {
    console.error("removeCartLine failed", error);
    return { success: false, error: GENERIC_CART_ERROR };
  }
}

export async function buyNow(variantId: string, quantity: number): Promise<BuyNowResult> {
  try {
    const cartId = await ensureCart();
    const { cart, userErrors } = await cartLinesAdd(cartId, [
      { merchandiseId: variantId, quantity: normalizeCartQuantity(quantity) },
    ]);

    if (userErrors.length > 0 || !cart) {
      console.error("Shopify buyNow user errors", userErrors);
      return { success: false, error: firstUserError(userErrors) ?? GENERIC_CART_ERROR };
    }

    return { success: true, checkoutUrl: cart.checkoutUrl };
  } catch (error) {
    console.error("buyNow failed", error);
    return { success: false, error: GENERIC_CART_ERROR };
  }
}
