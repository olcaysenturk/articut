import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CutpilotProductPage } from "@/components/product-detail/CutpilotProductPage";
import { env } from "@/lib/env";
import { toProduct } from "@/lib/shopify/mappers";
import { getProductByHandle } from "@/lib/shopify/queries/product";

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
  };
}

export default async function CutpilotPage() {
  const product = await loadProduct();

  return <CutpilotProductPage product={product} />;
}
