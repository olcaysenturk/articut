import "server-only";
import { shopifyFetch } from "@/lib/shopify/client";
import { CART_FRAGMENT, IMAGE_FRAGMENT, MONEY_FRAGMENT } from "@/lib/shopify/fragments";
import type { ShopifyCart, ShopifyUserError } from "@/lib/shopify/types";

const CART_LINES_REMOVE_MUTATION = /* GraphQL */ `
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
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

type CartLinesRemoveResponse = {
  cartLinesRemove: {
    cart: ShopifyCart | null;
    userErrors: ShopifyUserError[];
  };
};

export async function cartLinesRemove(cartId: string, lineIds: string[]) {
  const data = await shopifyFetch<
    CartLinesRemoveResponse,
    { cartId: string; lineIds: string[] }
  >(CART_LINES_REMOVE_MUTATION, { cartId, lineIds });

  return data.cartLinesRemove;
}
