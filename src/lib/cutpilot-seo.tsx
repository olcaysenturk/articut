import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { env } from "@/lib/env";
import { toProduct } from "@/lib/shopify/mappers";
import { getProductByHandle } from "@/lib/shopify/queries/product";
import { canonicalOrigin } from "@/lib/site-url";
import type { Product } from "@/types/shopify";

export const loadCutpilot = cache(async () => {
  const product = await getProductByHandle(env.SHOPIFY_PRODUCT_HANDLE);
  if (!product) notFound();
  return toProduct(product);
});

function getProductImages(product: Product) {
  const variantImages = product.variants.flatMap(({ image }) => (image ? [image] : []));
  const images = [...product.images, ...variantImages];
  const uniqueImages = [...new Map(images.map((image) => [image.url, image])).values()];

  return uniqueImages.length > 0
    ? uniqueImages
    : [{
        url: new URL("/images/product-detail/cutpilot-box-1.jpg", canonicalOrigin).href,
        alt: "Cutpilot haircutting kit packaging",
        width: 1440,
        height: 1620,
      }];
}

export function cutpilotMetadata(product: Product, path: "/" | "/cutpilot"): Metadata {
  const { title, description } = product;
  const images = getProductImages(product);
  return {
    title: path === "/" ? "Cutpilot At-Home Haircutting Kit" : title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, images },
    twitter: { card: "summary_large_image", title, description, images: [images[0].url] },
  };
}

export function CutpilotStructuredData({ product, path }: { product: Product; path: "/" | "/cutpilot" }) {
  const url = new URL(path, canonicalOrigin).href;
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    url,
    image: getProductImages(product).map((image) => image.url),
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: product.price.currencyCode,
      price: product.price.amount,
      availability: product.available
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
