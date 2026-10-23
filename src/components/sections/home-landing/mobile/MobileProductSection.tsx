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
    <section id="product-mobile" className="relative flex min-h-[699px] w-full flex-col justify-end overflow-hidden px-6 pb-[39px] pt-12">
      <CutpilotPackageImage src={image.src} alt={image.alt} imageClassName="scale-[1.045] object-cover" sizes="(max-width: 767px) 100vw, 393px" />
      <ProductPaymentReveal
        button={
          <AddToCartButton
            variantId={variant?.id ?? null}
            quantity={1}
            disabled={!variant?.available || !product.available}
            label={`Add to Cart, ${formatCompactMoney(variant?.price ?? product.price)}`}
            className="yellow-center-hover h-[46px] w-[241px] whitespace-pre bg-[#e0e0e0] px-4 text-[12px] font-normal text-[#e04d26]"
          >
            Add to Cart    <span className="relative left-[-10px] mx-[5px] text-[12px]"><ArrowIcon className="inline-block h-auto w-[16px]" /></span>    {formatCompactMoney(variant?.price ?? product.price)}
          </AddToCartButton>
        }
        className="relative z-10 flex flex-col items-center gap-5"
        buttonClassName="relative max-w-full"
        paymentClassName="w-full max-w-[241px]"
      />
    </section>
  );
}
