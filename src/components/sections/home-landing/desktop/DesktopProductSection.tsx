import { AddToCartButton } from "@/components/commerce/AddToCartButton";
import { CutpilotPackageImage } from "@/components/sections/product/CutpilotPackageImage";
import { ProductPaymentReveal } from "@/components/sections/home-landing/ProductPaymentReveal";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { formatCompactMoney } from "@/features/cart/cart-utils";
import type { Product } from "@/types/shopify";
import type { CmsImage } from "@/types/cms";

function ProductCta({ product }: { product: Product }) {
  const variant = product.variants.find((item) => item.available) ?? product.variants[0];

  return (
    <div className="flex flex-col items-center gap-[12px]">
      <AddToCartButton
        variantId={variant?.id ?? null}
        quantity={1}
        disabled={!variant || !product.available}
        label={`Add to Cart    →    ${formatCompactMoney(variant?.price ?? product.price)}`}
        className="yellow-center-hover h-[61px] w-[304px] whitespace-pre bg-[#e0e0e0] px-8 text-[20px] font-normal text-[#e04d26]"
      >
        Add to Cart    <span className="relative left-[-10px] text-[12px]"><ArrowIcon /></span>    {formatCompactMoney(variant?.price ?? product.price)}
      </AddToCartButton>
    </div>
  );
}

export function DesktopProductSection({ product, image }: { product: Product; image: CmsImage }) {
  return (
    <section
      id="product"
      className="relative h-dvh overflow-hidden bg-white"
      data-node-id="1:538"
    >
      <CutpilotPackageImage src={image.src} alt={image.alt} sizes="100vw" />
      <ProductPaymentReveal
        button={<ProductCta product={product} />}
        buttonClassName="absolute bottom-20 left-1/2 -translate-x-1/2"
        paymentClassName="absolute bottom-[40px] left-1/2 w-[420px] -translate-x-1/2"
      />
    </section>
  );
}
