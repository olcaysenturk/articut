import "server-only";
import { shopifyFetch } from "@/lib/shopify/client";
import { CART_FRAGMENT, IMAGE_FRAGMENT, MONEY_FRAGMENT } from "@/lib/shopify/fragments";
import type { ShopifyCart, ShopifyUserError } from "@/lib/shopify/types";

const CART_LINES_UPDATE_MUTATION = /* GraphQL */ `
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
`;

type CartLinesUpdateResponse = {
  cartLinesUpdate: {
    cart: ShopifyCart | null;
    userErrors: ShopifyUserError[];
  };
};

export async function cartLinesUpdate(
  cartId: string,
  lines: { id: string; quantity: number }[],
) {
  const data = await shopifyFetch<
    CartLinesUpdateResponse,
    { cartId: string; lines: { id: string; quantity: number }[] }
  >(CART_LINES_UPDATE_MUTATION, { cartId, lines });

  return data.cartLinesUpdate;
}
