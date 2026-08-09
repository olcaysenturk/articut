import "server-only";
import { shopifyFetch } from "@/lib/shopify/client";
import { CART_FRAGMENT, IMAGE_FRAGMENT, MONEY_FRAGMENT } from "@/lib/shopify/fragments";
import type { ShopifyCart, ShopifyUserError } from "@/lib/shopify/types";

const CART_LINES_ADD_MUTATION = /* GraphQL */ `
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
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

type CartLinesAddResponse = {
  cartLinesAdd: {
    cart: ShopifyCart | null;
    userErrors: ShopifyUserError[];
  };
};

export async function cartLinesAdd(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[],
) {
  const data = await shopifyFetch<
    CartLinesAddResponse,
    { cartId: string; lines: { merchandiseId: string; quantity: number }[] }
  >(CART_LINES_ADD_MUTATION, { cartId, lines });

  return data.cartLinesAdd;
}
