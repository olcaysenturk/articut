"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  checkoutSchema,
  type CheckoutActionState,
} from "@/features/checkout/checkout-schema";
import { getCartId } from "@/lib/shopify/cart-cookie";
import { ShopifyApiError } from "@/lib/shopify/client";
import { cartLinesUpdate } from "@/lib/shopify/mutations/cart-update";
import { getCart } from "@/lib/shopify/queries/cart";
import {
  addCartDeliveryAddress,
  updateCartBuyerIdentity,
} from "@/lib/shopify/mutations/cart-checkout";

export async function submitCheckout(
  _previousState: CheckoutActionState,
  formData: FormData,
): Promise<CheckoutActionState> {
  const parsed = checkoutSchema.safeParse({
    email: formData.get("email"),
    countryCode: formData.get("countryCode"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    address1: formData.get("address1"),
    address2: formData.get("address2"),
    city: formData.get("city"),
    provinceCode: formData.get("provinceCode"),
    zip: formData.get("zip"),
    phone: formData.get("phone"),
  });

  if (!parsed.success) {
    return {
      message: "Check the highlighted fields.",
      kind: "error",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const cartId = await getCartId();
  if (!cartId) {
    return {
      message: "Your cart has expired. Return to the store and try again.",
      kind: "error",
      fieldErrors: {},
    };
  }

  const { email, countryCode, phone, ...address } = parsed.data;
  let checkoutUrl: string | null = null;

  try {
    const currentCart = await getCart(cartId);
    if (!currentCart || currentCart.lines.nodes.length === 0) {
      return { message: "Your cart is empty.", kind: "warning", fieldErrors: {} };
    }

    const refreshed = await cartLinesUpdate(
      cartId,
      currentCart.lines.nodes.map((line) => ({ id: line.id, quantity: line.quantity })),
    );
    if (refreshed.userErrors.length > 0 || !refreshed.cart) {
      return {
        message:
          refreshed.userErrors[0]?.message ??
          "One or more cart quantities are no longer available.",
        kind: "warning",
        fieldErrors: {},
      };
    }

    const invalidLine = refreshed.cart.lines.nodes.find(
      (line) => !line.merchandise.availableForSale,
    );
    if (invalidLine || refreshed.cart.lines.nodes.length !== currentCart.lines.nodes.length) {
      revalidatePath("/checkout");
      return {
        message: invalidLine
          ? `${invalidLine.merchandise.product.title} is no longer available.`
          : "A product in your cart is no longer available.",
        kind: "warning",
        fieldErrors: {},
      };
    }

    const priceChanged = refreshed.cart.lines.nodes.some((line) => {
      const previousLine = currentCart.lines.nodes.find((item) => item.id === line.id);
      return (
        !previousLine ||
        previousLine.merchandise.price.amount !== line.merchandise.price.amount ||
        previousLine.merchandise.price.currencyCode !== line.merchandise.price.currencyCode ||
        previousLine.cost.totalAmount.amount !== line.cost.totalAmount.amount
      );
    });
    if (priceChanged) {
      revalidatePath("/checkout");
      return {
        message: "Price information was updated. Review your order before continuing.",
        kind: "info",
        fieldErrors: {},
      };
    }

    const identityResult = await updateCartBuyerIdentity(cartId, {
      email,
      countryCode,
      ...(phone ? { phone } : {}),
    });
    if (identityResult.userErrors.length > 0 || !identityResult.cart) {
      return {
        message: identityResult.userErrors[0]?.message ?? "Contact details could not be saved.",
        kind: "error",
        fieldErrors: {},
      };
    }

    const addressResult = await addCartDeliveryAddress(cartId, {
      ...address,
      countryCode,
      ...(phone ? { phone } : {}),
    });
    if (addressResult.userErrors.length > 0 || !addressResult.cart) {
      return {
        message: addressResult.userErrors[0]?.message ?? "Delivery address could not be saved.",
        kind: "error",
        fieldErrors: {},
      };
    }

    if (addressResult.cart.lines.nodes.length === 0) {
      return { message: "Your cart is empty.", kind: "warning", fieldErrors: {} };
    }

    checkoutUrl = addressResult.cart.checkoutUrl;
  } catch (error) {
    console.error("submitCheckout failed", error);

    if (error instanceof TypeError) {
      return {
        message: "We could not connect to Shopify. Check your connection and try again.",
        kind: "error",
        fieldErrors: {},
      };
    }

    if (error instanceof ShopifyApiError) {
      return {
        message: "Shopify checkout could not be prepared. Please try again.",
        kind: "error",
        fieldErrors: {},
      };
    }

    return {
      message: "An unexpected error occurred. Please try again.",
      kind: "error",
      fieldErrors: {},
    };
  }

  if (!checkoutUrl) {
    return {
      message: "Shopify checkout link could not be created. Please try again.",
      kind: "error",
      fieldErrors: {},
    };
  }

  redirect(checkoutUrl);
}
