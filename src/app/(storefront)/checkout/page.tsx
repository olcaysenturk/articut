import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { TrustInformation } from "@/components/checkout/TrustInformation";
import { getCartId } from "@/lib/shopify/cart-cookie";
import { toCart } from "@/lib/shopify/mappers";
import { getCart } from "@/lib/shopify/queries/cart";
import type { Cart } from "@/types/shopify";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your Articut order securely.",
};

export default async function CheckoutPage() {
  await connection();
  const cartId = await getCartId();
  let cart: Cart | null = null;
  let cartError = false;

  if (cartId) {
    try {
      const shopifyCart = await getCart(cartId);
      cart = shopifyCart ? toCart(shopifyCart) : null;
    } catch (error) {
      console.error("Checkout cart load failed", error);
      cartError = true;
    }
  }

  const hasItems = Boolean(cart?.lines.length);
  const unavailableLine = cart?.lines.find((line) => !line.available);
  const blockedMessage = unavailableLine
    ? `${unavailableLine.productTitle} is no longer available. Update your cart before continuing.`
    : null;

  return (
    <div className="min-h-dvh bg-[#dedede] text-black">
      <header className="border-b border-black/10">
        <div className="mx-auto flex h-[116px] w-full max-w-[1200px] items-center justify-between px-[24px] sm:px-[40px]">
          <Link href="/" aria-label="Articut home" className="relative h-[39px] w-[204px] sm:h-[46px] sm:w-[240px]">
            <Image src="/figma/articut-logo.svg" alt="Articut" fill priority sizes="240px" />
          </Link>
          <Link href="/" className="text-[13px] font-medium text-[#e94b24]">
            Return to store
          </Link>
        </div>
      </header>

      {!hasItems ? (
        <main className="mx-auto grid min-h-[calc(100dvh-116px)] w-full max-w-[720px] place-items-center px-[24px] py-[80px] text-center">
          <div>
            <h1
              style={{ fontFamily: "var(--font-display)", fontSize: 52, fontWeight: 700, lineHeight: 0.92 }}
              className="uppercase text-[#e94b24]"
            >
              Your cart is empty
            </h1>
            <p className="mx-auto mt-5 max-w-[440px] text-[15px] text-black/60">
              {cartError
                ? "Your cart could not be loaded. Return to the store and try again."
                : "Add a product before starting checkout."}
            </p>
            <Link
              href="/"
              className="mx-auto mt-8 flex h-[54px] w-[230px] items-center justify-center rounded-full bg-[#e94b24] text-[15px] text-white"
            >
              Continue shopping
            </Link>
          </div>
        </main>
      ) : (
        <main className="mx-auto grid w-full max-w-[1200px] lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="order-2 border-black/10 px-[24px] py-[52px] sm:px-[40px] lg:order-1 lg:border-r lg:px-[64px] lg:py-[68px]">
            <div className="mx-auto w-full max-w-[620px]">
              <p className="mb-[32px] text-[14px] font-semibold text-[#e94b24]">Secure checkout</p>
              <CheckoutForm blockedMessage={blockedMessage} />
              <TrustInformation />
            </div>
          </div>
          <OrderSummary cart={cart!} />
        </main>
      )}
    </div>
  );
}
