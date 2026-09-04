import "server-only";
import { env } from "@/lib/env";

export class ShopifyAdminApiError extends Error {
  constructor(
    message: string,
    public readonly errors: unknown,
  ) {
    super(message);
    this.name = "ShopifyAdminApiError";
  }
}

export function isAdminApiConfigured(): boolean {
  return Boolean(env.SHOPIFY_ADMIN_API_ACCESS_TOKEN);
}

export async function shopifyAdminFetch<TData, TVariables extends Record<string, unknown> = Record<string, unknown>>(
  query: string,
  variables?: TVariables,
): Promise<TData> {
  if (!env.SHOPIFY_ADMIN_API_ACCESS_TOKEN) {
    throw new ShopifyAdminApiError("Shopify Admin API access token is not configured", null);
  }

  const apiVersion = env.SHOPIFY_ADMIN_API_VERSION || env.SHOPIFY_API_VERSION;
  const url = `https://${env.SHOPIFY_STORE_DOMAIN}/admin/api/${apiVersion}/graphql.json`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": env.SHOPIFY_ADMIN_API_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new ShopifyAdminApiError(`Shopify Admin API request failed with status ${response.status}`, text);
  }

  const json = await response.json();

  if (json.errors) {
    throw new ShopifyAdminApiError("Shopify Admin API request returned errors", json.errors);
  }

  return json.data as TData;
}
