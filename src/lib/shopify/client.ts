import "server-only";
import { createStorefrontApiClient } from "@shopify/storefront-api-client";
import { env } from "@/lib/env";

export const shopifyClient = createStorefrontApiClient({
  storeDomain: env.SHOPIFY_STORE_DOMAIN,
  apiVersion: env.SHOPIFY_API_VERSION,
  publicAccessToken: env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
});

export class ShopifyApiError extends Error {
  constructor(
    message: string,
    public readonly errors: unknown,
  ) {
    super(message);
    this.name = "ShopifyApiError";
  }
}

export async function shopifyFetch<TData, TVariables extends Record<string, unknown>>(
  query: string,
  variables?: TVariables,
  tags?: string[],
): Promise<TData> {
  const response = await shopifyClient.request<TData>(query, {
    variables,
    ...(tags ? { next: { tags } } : {}),
  });

  if (response.errors) {
    throw new ShopifyApiError("Shopify Storefront API request failed", response.errors);
  }

  if (!response.data) {
    throw new ShopifyApiError("Shopify Storefront API returned no data", response.errors);
  }

  return response.data;
}
