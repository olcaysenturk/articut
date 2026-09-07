import { AddToCartButton } from "@/components/commerce/AddToCartButton";
import { CutpilotPackageImage } from "@/components/sections/product/CutpilotPackageImage";
import { ProductPaymentReveal } from "@/components/sections/home-landing/ProductPaymentReveal";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { formatCompactMoney } from "@/features/cart/cart-utils";
import type { Product } from "@/types/shopify";
import type { CmsImage } from "@/types/cms";

export function MobileProductSection({ product, image }: { product: Product; image: CmsImage }) {
  const variant = product.variants.find((item) => item.available) ?? product.variants[0];

  return (
    <section id="product-mobile" className="absolute left-0 top-[1200px] h-[699px] w-full overflow-hidden">
      <CutpilotPackageImage src={image.src} alt={image.alt} imageClassName="scale-[1.045] object-cover" sizes="393px" />
      <ProductPaymentReveal
        button={
          <AddToCartButton
            variantId={variant?.id ?? null}
            quantity={1}
            disabled={!variant || !product.available}
            label={`Add to Cart    →    ${formatCompactMoney(variant?.price ?? product.price)}`}
            className="yellow-center-hover h-[46px] w-[241px] whitespace-pre bg-[#e0e0e0] px-4 text-[12px] font-normal text-[#e04d26]"
          >
            Add to Cart    <span className="relative left-[-10px] text-[12px]"><ArrowIcon /></span>    {formatCompactMoney(variant?.price ?? product.price)}
          </AddToCartButton>
        }
        buttonClassName="absolute left-1/2 top-[583px] -translate-x-1/2"
        paymentClassName="absolute left-1/2 top-[649px] w-[241px] -translate-x-1/2"
      />
    </section>
  );
}
