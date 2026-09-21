import "server-only";
import { shopifyFetch } from "@/lib/shopify/client";

export async function isVariantAvailable(id: string): Promise<boolean> {
  const data = await shopifyFetch<{
    node: { __typename: string; availableForSale?: boolean } | null;
  }, { id: string }>(`
    query VariantAvailability($id: ID!) {
      node(id: $id) {
        __typename
        ... on ProductVariant { availableForSale }
      }
    }
  `, { id });

  return data.node?.__typename === "ProductVariant" && data.node.availableForSale === true;
}
