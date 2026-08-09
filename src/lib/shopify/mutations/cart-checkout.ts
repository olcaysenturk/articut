import "server-only";

import { shopifyFetch } from "@/lib/shopify/client";
import { CART_FRAGMENT, IMAGE_FRAGMENT, MONEY_FRAGMENT } from "@/lib/shopify/fragments";
import type { ShopifyCart, ShopifyUserError } from "@/lib/shopify/types";

export type CheckoutAddressInput = {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  provinceCode: string;
  zip: string;
  countryCode: string;
  phone?: string;
};

type CartMutationPayload = {
  cart: ShopifyCart | null;
  userErrors: ShopifyUserError[];
};

type BuyerIdentityUpdateResponse = {
  cartBuyerIdentityUpdate: CartMutationPayload;
};

type DeliveryAddressAddResponse = {
  cartDeliveryAddressesAdd: CartMutationPayload;
};

const BUYER_IDENTITY_UPDATE_MUTATION = /* GraphQL */ `
  mutation CartBuyerIdentityUpdate($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
    cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
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

const DELIVERY_ADDRESS_ADD_MUTATION = /* GraphQL */ `
  mutation CartDeliveryAddressesAdd($cartId: ID!, $addresses: [CartSelectableAddressInput!]!) {
    cartDeliveryAddressesAdd(cartId: $cartId, addresses: $addresses) {
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

export async function updateCartBuyerIdentity(
  cartId: string,
  buyer: { email: string; countryCode: string; phone?: string },
) {
  const data = await shopifyFetch<
    BuyerIdentityUpdateResponse,
    { cartId: string; buyerIdentity: typeof buyer }
  >(BUYER_IDENTITY_UPDATE_MUTATION, { cartId, buyerIdentity: buyer });

  return data.cartBuyerIdentityUpdate;
}

export async function addCartDeliveryAddress(cartId: string, address: CheckoutAddressInput) {
  const addresses = [
    {
      selected: true,
      oneTimeUse: true,
      address: { deliveryAddress: address },
    },
  ];
  const data = await shopifyFetch<
    DeliveryAddressAddResponse,
    { cartId: string; addresses: typeof addresses }
  >(DELIVERY_ADDRESS_ADD_MUTATION, { cartId, addresses });

  return data.cartDeliveryAddressesAdd;
}
