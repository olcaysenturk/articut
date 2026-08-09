import "server-only";
import { shopifyFetch } from "@/lib/shopify/client";
import { CART_FRAGMENT, IMAGE_FRAGMENT, MONEY_FRAGMENT } from "@/lib/shopify/fragments";
import type { ShopifyCartResponse } from "@/lib/shopify/types";

const CART_QUERY = /* GraphQL */ `
  query Cart($cartId: ID!) {
    cart(id: $cartId) {
      ...CartFragment
    }
  }
  ${CART_FRAGMENT}
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
`;

export async function getCart(cartId: string) {
  const data = await shopifyFetch<ShopifyCartResponse, { cartId: string }>(CART_QUERY, {
    cartId,
  });

  return data.cart;
}
