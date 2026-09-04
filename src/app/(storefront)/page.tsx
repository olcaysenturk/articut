import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VideoLoadingGate } from "@/components/loading/VideoLoadingGate";
import { HomeLanding } from "@/components/sections/home-landing/HomeLanding";
import { getCmsContent } from "@/lib/cms-content";
import { env } from "@/lib/env";
import { toProduct } from "@/lib/shopify/mappers";
import { getProductByHandle } from "@/lib/shopify/queries/product";

export const dynamic = "force-dynamic";

async function loadProduct() {
  const shopifyProduct = await getProductByHandle(env.SHOPIFY_PRODUCT_HANDLE);

  if (!shopifyProduct) {
    notFound();
  }

  return toProduct(shopifyProduct);
}

export async function generateMetadata(): Promise<Metadata> {
  const product = await loadProduct();

  return {
    title: product.title,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: product.images[0] ? [product.images[0].url] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description: product.description,
    },
  };
}

export default async function HomePage() {
  const [cmsContent, product] = await Promise.all([getCmsContent(), loadProduct()]);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images.map((image) => image.url),
    offers: {
      "@type": "Offer",
      priceCurrency: product.price.currencyCode,
      price: product.price.amount,
      availability: product.available
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <VideoLoadingGate>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <HomeLanding cmsContent={cmsContent} product={product} />
    </VideoLoadingGate>
  );
}
