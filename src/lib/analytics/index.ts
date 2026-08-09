type AnalyticsEvent =
  | { name: "view_product"; productHandle: string }
  | { name: "add_to_cart"; variantId: string; quantity: number }
  | { name: "begin_checkout"; cartId: string };

type AnalyticsProvider = (event: AnalyticsEvent) => void;

const providers: AnalyticsProvider[] = [];

export function registerAnalyticsProvider(provider: AnalyticsProvider) {
  providers.push(provider);
}

export function track(event: AnalyticsEvent) {
  for (const provider of providers) {
    provider(event);
  }
}
