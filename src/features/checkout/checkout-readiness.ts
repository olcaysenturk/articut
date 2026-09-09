import type { ShopifyCart } from "@/lib/shopify/types";

/** Recheck after buyer country/address changes, which can alter availability. */
export function checkoutReadinessError(cart: ShopifyCart, expected: ShopifyCart): string | null {
  if (!cart.lines.nodes.length) return "Your cart is empty. Return to the store to add a product.";
  const unavailable = cart.lines.nodes.some((line) => !line.merchandise.availableForSale);
  const changed = expected.lines.nodes.length !== cart.lines.nodes.length ||
    expected.lines.nodes.some((line) => !cart.lines.nodes.some((current) =>
      current.merchandise.id === line.merchandise.id && current.quantity === line.quantity,
    ));
  if (unavailable || changed) {
    return "Some products are unavailable for your delivery location. Review your cart or delivery address.";
  }
  try {
    const url = new URL(cart.checkoutUrl);
    if (url.protocol === "https:" && url.pathname !== "/" && !/^\/password\/?$/.test(url.pathname)) return null;
  } catch {
    // Keep the buyer in our checkout when Shopify doesn't return a usable link.
  }
  return "Checkout is currently unavailable. Please try again later.";
}
