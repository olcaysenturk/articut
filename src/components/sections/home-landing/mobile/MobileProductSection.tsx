import { AddToCartButton } from "@/components/commerce/AddToCartButton";
import { CutpilotPackageImage } from "@/components/sections/product/CutpilotPackageImage";
import { ProductPaymentReveal } from "@/components/sections/home-landing/ProductPaymentReveal";
import { formatCompactMoney } from "@/features/cart/cart-utils";
import type { Product } from "@/types/shopify";

export function MobileProductSection({ product }: { product: Product }) {
  const variant = product.variants.find((item) => item.available) ?? product.variants[0];

  return (
    <section id="product-mobile" className="absolute left-0 top-[1072px] h-[699px] w-full overflow-hidden">
      <CutpilotPackageImage imageClassName="scale-[1.045] object-cover" sizes="393px" />
      <ProductPaymentReveal
        button={
          <AddToCartButton
            variantId={variant?.id ?? null}
            quantity={1}
            disabled={!variant || !product.available}
            label={`Add to Cart    →    ${formatCompactMoney(variant?.price ?? product.price)}`}
            className="yellow-center-hover h-[46px] w-[241px] whitespace-pre bg-[#e0e0e0] px-4 text-[12px] font-normal text-[#e04d26]"
          />
        }
        buttonClassName="absolute left-1/2 top-[583px] -translate-x-1/2"
        paymentClassName="absolute left-1/2 top-[649px] w-[241px] -translate-x-1/2"
      />
    </section>
  );
}
