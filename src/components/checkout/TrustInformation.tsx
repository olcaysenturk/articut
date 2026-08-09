import Link from "next/link";

export function TrustInformation() {
  return (
    <section aria-label="Checkout information" className="mt-[34px] border-t border-black/10 pt-[24px]">
      <div className="grid gap-5 text-[12px] leading-[18px] text-black/55 sm:grid-cols-3">
        <div>
          <p className="font-medium text-black/80">Secure checkout</p>
          <p className="mt-1">Payment is completed through Shopify&apos;s encrypted checkout.</p>
        </div>
        <div>
          <p className="font-medium text-black/80">Delivery</p>
          <p className="mt-1">Available methods and final rates are confirmed before payment.</p>
        </div>
        <div>
          <p className="font-medium text-black/80">Support</p>
          <a href="mailto:info@articut.com" className="mt-1 block text-[#e94b24]">
            info@articut.com
          </a>
        </div>
      </div>
      <div className="mt-[22px] flex flex-wrap gap-x-6 gap-y-2 text-[11px] text-black/50">
        <Link href="/privacy">Privacy Policy</Link>
        <Link href="/terms">Terms & Conditions</Link>
        <Link href="/returns">Returns</Link>
      </div>
    </section>
  );
}
