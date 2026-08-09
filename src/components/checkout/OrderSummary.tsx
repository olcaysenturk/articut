import Image from "next/image";
import { formatCompactMoney } from "@/features/cart/cart-utils";
import type { Cart } from "@/types/shopify";

export function OrderSummary({ cart }: { cart: Cart }) {
  return (
    <aside className="order-1 border-b border-black/10 bg-white/30 px-[24px] py-[38px] sm:px-[40px] lg:order-2 lg:min-h-[calc(100dvh-116px)] lg:border-b-0 lg:px-[36px] lg:py-[68px]">
      <h2 style={{ fontFamily: "var(--font-body)", fontSize: 20, fontWeight: 500, lineHeight: 1 }}>
        Order summary
      </h2>
      <ul className="mt-[26px] space-y-[22px]">
        {cart.lines.map((line) => {
          const fallbackImage = line.productTitle.toLowerCase().includes("scissor")
            ? "/figma/scissors-product.png"
            : "/figma/cutpilot-product.png";

          return (
            <li key={line.id} className="flex items-center gap-[16px]">
              <div className="relative h-[72px] w-[72px] shrink-0 rounded-[8px] bg-white">
                <Image
                  src={line.image?.url ?? fallbackImage}
                  alt={line.image?.alt ?? line.productTitle}
                  fill
                  sizes="72px"
                  className="object-contain p-1"
                />
                <span className="absolute -right-2 -top-2 grid h-[22px] min-w-[22px] place-items-center rounded-full bg-[#e94b24] px-1 text-[11px] text-white">
                  {line.quantity}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[16px]">{line.productTitle}</p>
                {line.variantTitle !== "Default Title" ? (
                  <p className="mt-1 truncate text-[11px] text-black/50">{line.variantTitle}</p>
                ) : null}
                <p className="mt-1 text-[11px] text-black/50">
                  {line.quantity} × {formatCompactMoney(line.unitPrice)}
                </p>
                {!line.available ? (
                  <p className="mt-1 text-[11px] text-[#b34720]">No longer available</p>
                ) : null}
              </div>
              <p className="shrink-0 text-[15px]">{formatCompactMoney(line.linePrice)}</p>
            </li>
          );
        })}
      </ul>

      <div className="mt-[34px] space-y-[12px] border-t border-black/10 pt-[22px] text-[14px]">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatCompactMoney(cart.subtotal)}</span>
        </div>
        <div className="flex justify-between gap-4 text-black/55">
          <span>Discounts</span>
          <span className="text-right">
            {cart.discountTotal.amount > 0
              ? `-${formatCompactMoney(cart.discountTotal)}`
              : "None"}
          </span>
        </div>
        <div className="flex justify-between gap-4 text-black/55">
          <span>Shipping</span>
          <span className="text-right">Calculated at checkout</span>
        </div>
        <div className="flex justify-between gap-4 text-black/55">
          <span>Taxes</span>
          <span className="text-right">Calculated at checkout</span>
        </div>
        <div className="flex items-end justify-between border-t border-black/10 pt-[18px] text-[20px]">
          <span>Total</span>
          <span className="text-right">
            <span className="mr-2 text-[11px] text-black/45">{cart.total.currencyCode}</span>
            {formatCompactMoney(cart.total)}
          </span>
        </div>
      </div>
    </aside>
  );
}
