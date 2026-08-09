import "server-only";
import { shopifyFetch } from "@/lib/shopify/client";
import { CART_FRAGMENT, IMAGE_FRAGMENT, MONEY_FRAGMENT } from "@/lib/shopify/fragments";
import type { ShopifyCart, ShopifyUserError } from "@/lib/shopify/types";

const CART_CREATE_MUTATION = /* GraphQL */ `
  mutation CartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
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

type CartCreateResponse = {
  cartCreate: {
    cart: ShopifyCart | null;
    userErrors: ShopifyUserError[];
  };
};

export async function cartCreate(lines: { merchandiseId: string; quantity: number }[] = []) {
  const data = await shopifyFetch<
    CartCreateResponse,
    { lines: { merchandiseId: string; quantity: number }[] }
  >(CART_CREATE_MUTATION, { lines });

  return data.cartCreate;
}
