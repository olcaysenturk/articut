"use client";

import Image from "next/image";
import { useCallback, useEffect, useTransition } from "react";
import { AnimatePresence, motion } from "motion/react";
import { getOrCreateCart } from "@/app/actions/cart-actions";
import { CartItem } from "@/components/commerce/CartItem";
import { useOverlayBehavior } from "@/components/ui/useOverlayBehavior";
import { useScrollLock } from "@/components/ui/useScrollLock";
import { drawerVariants, overlayVariants } from "@/lib/animation/motion-config";
import { formatCompactMoney } from "@/features/cart/cart-utils";
import { useCartStore } from "@/features/cart/cart-store";

const PAYMENT_MARKS = [
  { src: "/figma/afterpay.svg", alt: "Afterpay", width: 57, height: 12 },
  { src: "/figma/apple-pay.svg", alt: "Apple Pay", width: 29, height: 12 },
  { src: "/figma/american-express.svg", alt: "American Express", width: 42, height: 12 },
  { src: "/figma/mastercard.svg", alt: "Mastercard", width: 19, height: 12 },
  { src: "/figma/visa.svg", alt: "Visa", width: 37, height: 12 },
];

const cartTransition = { duration: 0.52, ease: [0.22, 1, 0.36, 1] as const };

export function CartDrawer() {
  const isDrawerOpen = useCartStore((state) => state.isDrawerOpen);
  const cart = useCartStore((state) => state.cart);
  const setCart = useCartStore((state) => state.setCart);
  const isCartLoading = useCartStore((state) => state.isLoading);
  const closeDrawer = useCartStore((state) => state.closeDrawer);
  const errorMessage = useCartStore((state) => state.errorMessage);
  const setError = useCartStore((state) => state.setError);
  const [isPending, startTransition] = useTransition();
  const containerRef = useOverlayBehavior(isDrawerOpen, closeDrawer);
  useScrollLock(isDrawerOpen);

  const refreshCart = useCallback(() => {
    startTransition(async () => {
      const result = await getOrCreateCart();
      if (result.success) {
        setCart(result.cart);
        setError(null);
        return;
      }
      setError(result.error);
    });
  }, [setCart, setError]);

  useEffect(() => {
    if (isDrawerOpen) {
      refreshCart();
    }
  }, [isDrawerOpen, refreshCart]);

  return (
    <AnimatePresence>
      {isDrawerOpen ? (
        <div className="fixed inset-0 z-[90]">
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={overlayVariants}
            transition={cartTransition}
            className="absolute inset-0 bg-black/0"
            onClick={closeDrawer}
            aria-hidden
          />
          <motion.div
            ref={containerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-drawer-title"
            data-scroll-snap-ignore
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={drawerVariants}
            transition={cartTransition}
            className="absolute inset-y-0 right-0 flex w-full flex-col overflow-hidden bg-[#dedede] text-black md:w-[370px]"
          >
            <header className="flex h-[94px] shrink-0 items-center justify-between border-b border-white/80 px-[32px] text-[#e94b24] md:px-[50px]">
              <p
                id="cart-drawer-title"
                className="font-[family-name:var(--font-body)] text-[14px] font-semibold leading-none"
              >
                Cart
              </p>
              <button
                type="button"
                onClick={closeDrawer}
                aria-label="Close cart"
                className="cart-close-button relative h-[24px] w-[24px] cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-95"
              >
                <span className="cart-close-blade-top absolute left-0 top-1/2 h-[3px] w-[24px] bg-current" />
                <span className="cart-close-blade-bottom absolute left-0 top-1/2 h-[3px] w-[24px] bg-current" />
              </button>
            </header>

            {errorMessage ? (
              <p role="alert" className="border-b-2 border-white/80 px-[32px] py-3 text-[12px] text-[#e94b24] md:px-[50px]">
                {errorMessage}
              </p>
            ) : null}

            <div className="relative min-h-0 flex-1">
              <div
                data-cart-scroll-area
                className="h-full overflow-y-auto overscroll-y-contain touch-pan-y"
                aria-live="polite"
              >
                {(isCartLoading || (isPending && !cart)) ? (
                  <div className="grid h-full place-items-center text-[14px] text-black/45">Loading...</div>
                ) : null}

                {!isCartLoading && cart && cart.lines.length === 0 ? (
                  <div className="grid h-full place-items-center px-[32px] text-center text-[20px]">
                    Your cart is empty.
                  </div>
                ) : null}

                {!isCartLoading && cart?.lines.map((line) => (
                  <CartItem key={line.id} line={line} onChange={refreshCart} />
                ))}
              </div>
              {!isCartLoading && cart && cart.lines.length > 0 ? (
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[84px] bg-[linear-gradient(to_bottom,rgba(224,224,224,0.34),rgba(225,225,225,1))]"
                />
              ) : null}
            </div>

            {!isCartLoading && cart && cart.lines.length > 0 ? (
              <footer className="shrink-0 border-t-2 border-white/80 bg-[#dedede] px-[28px] pb-[26px] pt-[24px]">
                <div className="flex items-center justify-between px-[22px] text-[22px] leading-none">
                  <span>Subtotal</span>
                  <span>{formatCompactMoney(cart.subtotal)}</span>
                </div>
                <a
                  href="/checkout"
                  onClick={closeDrawer}
                  className="mt-[22px] flex h-[61px] w-full cursor-pointer items-center justify-center rounded-full bg-[#e94b24] text-[20px] text-white transition-[background-color,transform] duration-200 hover:scale-[1.015] hover:bg-[#d9401d] active:scale-[0.985]"
                >
                  Check Out
                </a>
                <div className="mt-[25px] flex items-center justify-between px-[12px]">
                  {PAYMENT_MARKS.map((mark) => (
                    <Image
                      key={mark.src}
                      src={mark.src}
                      alt={mark.alt}
                      width={mark.width}
                      height={mark.height}
                      className="h-[10px] w-auto object-contain"
                    />
                  ))}
                </div>
              </footer>
            ) : null}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
