import "server-only";
import { shopifyFetch } from "@/lib/shopify/client";
import {
  IMAGE_FRAGMENT,
  MONEY_FRAGMENT,
  PRODUCT_FRAGMENT,
  PRODUCT_VARIANT_FRAGMENT,
} from "@/lib/shopify/fragments";
import type { ShopifyProductByHandleResponse } from "@/lib/shopify/types";

const PRODUCT_BY_HANDLE_QUERY = /* GraphQL */ `
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      ...ProductFragment
    }
  }
  ${PRODUCT_FRAGMENT}
  ${PRODUCT_VARIANT_FRAGMENT}
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
`;

export async function getProductByHandle(handle: string) {
  const data = await shopifyFetch<ShopifyProductByHandleResponse, { handle: string }>(
    PRODUCT_BY_HANDLE_QUERY,
    { handle },
    ["product"],
  );

  return data.product;
}
