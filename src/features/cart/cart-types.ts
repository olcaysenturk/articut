import type { Cart } from "@/types/shopify";

export type CartActionResult =
  | { success: true; cart: Cart }
  | { success: false; error: string };

export type BuyNowResult =
  | { success: true; checkoutUrl: string }
  | { success: false; error: string };
