import "server-only";
import type {
  ShopifyCart,
  ShopifyImage,
  ShopifyMoney,
  ShopifyProduct,
  ShopifyProductVariant,
} from "@/lib/shopify/types";
import type { Cart, CartLine, Money, Product, ProductImage, ProductVariant } from "@/types/shopify";
import {
  normalizeCartQuantity,
  resolveCartLinePrice,
  resolveCartSubtotal,
} from "@/features/cart/cart-pricing";

function toMoney(money: ShopifyMoney): Money {
  return {
    amount: Number(money.amount),
    currencyCode: money.currencyCode,
  };
}

function toImage(image: ShopifyImage): ProductImage {
  return {
    url: image.url,
    alt: image.altText ?? "",
    width: image.width,
    height: image.height,
  };
}

function toVariant(variant: ShopifyProductVariant): ProductVariant {
  return {
    id: variant.id,
    title: variant.title,
    available: variant.availableForSale,
    price: toMoney(variant.price),
    compareAtPrice: variant.compareAtPrice ? toMoney(variant.compareAtPrice) : null,
    selectedOptions: variant.selectedOptions,
    image: variant.image ? toImage(variant.image) : null,
  };
}

export function toProduct(product: ShopifyProduct): Product {
  const variants = product.variants.nodes.map(toVariant);
  const firstAvailable = variants.find((variant) => variant.available) ?? variants[0];

  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    description: product.description,
    descriptionHtml: product.descriptionHtml,
    images: product.images.nodes.map(toImage),
    options: product.options,
    variants,
    price: toMoney(product.priceRange.minVariantPrice),
    compareAtPrice: firstAvailable?.compareAtPrice ?? null,
    available: variants.some((variant) => variant.available),
  };
}

export function toCart(cart: ShopifyCart): Cart {
  const discountAmount = cart.lines.nodes.reduce(
    (total, line) =>
      total +
      line.discountAllocations.reduce(
        (lineTotal, allocation) => lineTotal + Number(allocation.discountedAmount.amount),
        0,
      ),
    0,
  );
  const lines: CartLine[] = cart.lines.nodes.map((line) => {
    const quantity = normalizeCartQuantity(line.quantity);
    const unitPrice = toMoney(line.merchandise.price);
    const lineDiscountAmount = line.discountAllocations.reduce(
      (total, allocation) => total + Number(allocation.discountedAmount.amount),
      0,
    );

    return {
      id: line.id,
      quantity,
      variantId: line.merchandise.id,
      variantTitle: line.merchandise.title,
      productTitle: line.merchandise.product.title,
      productHandle: line.merchandise.product.handle,
      available: line.merchandise.availableForSale,
      image: line.merchandise.image ? toImage(line.merchandise.image) : null,
      linePrice: resolveCartLinePrice({
        reportedTotal: toMoney(line.cost.totalAmount),
        unitPrice,
        quantity,
        discountAmount: lineDiscountAmount,
      }),
      unitPrice,
    };
  });
  const subtotal = resolveCartSubtotal({
    reportedSubtotal: toMoney(cart.cost.subtotalAmount),
    linePrices: lines.map((line) => line.linePrice),
    discountAmount,
  });

  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    totalQuantity: cart.totalQuantity,
    subtotal,
    discountTotal: {
      amount: discountAmount,
      currencyCode: cart.cost.subtotalAmount.currencyCode,
    },
    total: toMoney(cart.cost.totalAmount),
    lines,
  };
}
