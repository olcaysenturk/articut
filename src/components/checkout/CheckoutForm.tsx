"use client";

import Image from "next/image";
import {
  type ChangeEvent,
  type FocusEvent,
  useActionState,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { submitCheckout } from "@/app/actions/checkout-actions";
import {
  CheckoutToast,
  type CheckoutToastMessage,
} from "@/components/checkout/CheckoutToast";
import {
  checkoutSchema,
  initialCheckoutState,
  type CheckoutField,
} from "@/features/checkout/checkout-schema";

const COUNTRIES = [
  { code: "US", label: "United States" },
  { code: "CA", label: "Canada" },
  { code: "GB", label: "United Kingdom" },
  { code: "AU", label: "Australia" },
  { code: "TR", label: "Türkiye" },
  { code: "DE", label: "Germany" },
  { code: "FR", label: "France" },
  { code: "IT", label: "Italy" },
  { code: "ES", label: "Spain" },
  { code: "NL", label: "Netherlands" },
];

const PAYMENT_MARKS = [
  { src: "/figma/afterpay.svg", alt: "Afterpay", width: 57, height: 12 },
  { src: "/figma/apple-pay.svg", alt: "Apple Pay", width: 29, height: 12 },
  { src: "/figma/american-express.svg", alt: "American Express", width: 42, height: 12 },
  { src: "/figma/mastercard.svg", alt: "Mastercard", width: 19, height: 12 },
  { src: "/figma/visa.svg", alt: "Visa", width: 37, height: 12 },
];

type FormControl = HTMLInputElement | HTMLSelectElement;
type FieldErrors = Partial<Record<CheckoutField, string>>;

const baseControlClass =
  "h-[58px] w-full rounded-[8px] border bg-white px-[15px] text-[16px] text-black outline-none transition-[border-color,background-color,box-shadow] duration-200 placeholder:text-black/30 hover:border-black/35 focus:border-[#e94b24] focus:shadow-[0_0_0_3px_rgba(233,75,36,0.12)] disabled:cursor-not-allowed disabled:border-transparent disabled:bg-black/5 disabled:text-black/35";

function SectionHeading({ id, children, size = 24 }: { id: string; children: string; size?: number }) {
  return (
    <h2
      id={id}
      style={{ fontFamily: "var(--font-body)", fontSize: size, fontWeight: 500, lineHeight: 1 }}
    >
      {children}
    </h2>
  );
}

function FieldErrorMessage({
  field,
  message,
}: {
  field: CheckoutField;
  message?: string;
}) {
  if (!message) return null;

  return (
    <p id={`${field}-error`} className="mt-1 px-1 text-[12px] leading-[16px] text-[#c23518]">
      {message}
    </p>
  );
}

export function CheckoutForm({ blockedMessage }: { blockedMessage?: string | null }) {
  const [state, formAction, isPending] = useActionState(submitCheckout, initialCheckoutState);
  const formRef = useRef<HTMLFormElement>(null);
  const [clientErrors, setClientErrors] = useState<FieldErrors>({});
  const [touchedFields, setTouchedFields] = useState<Set<CheckoutField>>(new Set());
  const [filledFields, setFilledFields] = useState<Set<CheckoutField>>(new Set(["countryCode"]));
  const [hiddenServerErrors, setHiddenServerErrors] = useState<Set<CheckoutField>>(new Set());
  const [dismissedToastKey, setDismissedToastKey] = useState<string | null>(null);

  const fieldError = useCallback(
    (field: CheckoutField) =>
      clientErrors[field] ??
      (hiddenServerErrors.has(field) ? undefined : state.fieldErrors[field]?.[0]),
    [clientErrors, hiddenServerErrors, state.fieldErrors],
  );

  const validateField = useCallback((field: CheckoutField, value: string) => {
    const result = checkoutSchema.shape[field].safeParse(value);
    setClientErrors((errors) => ({
      ...errors,
      [field]: result.success ? undefined : result.error.issues[0]?.message,
    }));
  }, []);

  function handleBlur(event: FocusEvent<FormControl>) {
    const field = event.currentTarget.name as CheckoutField;
    setTouchedFields((fields) => new Set(fields).add(field));
    validateField(field, event.currentTarget.value);
  }

  function handleChange(event: ChangeEvent<FormControl>) {
    const field = event.currentTarget.name as CheckoutField;
    const value = event.currentTarget.value;
    setHiddenServerErrors((fields) => new Set(fields).add(field));
    setFilledFields((fields) => {
      const next = new Set(fields);
      if (value.trim()) next.add(field);
      else next.delete(field);
      return next;
    });
    if (touchedFields.has(field)) validateField(field, value);
  }

  useEffect(() => {
    if (state.message) {
      window.requestAnimationFrame(() => {
        const invalidField = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
        invalidField?.focus({ preventScroll: true });
        invalidField?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    }
  }, [state]);

  const activeToast: CheckoutToastMessage | null = isPending
    ? { type: "info", message: "Checkout is being prepared." }
    : state.message
      ? { type: state.kind ?? "error", message: state.message }
      : blockedMessage
        ? { type: "warning", message: blockedMessage }
        : null;
  const activeToastKey = activeToast ? `${activeToast.type}:${activeToast.message}` : null;
  const toast = activeToastKey === dismissedToastKey ? null : activeToast;
  const dismissToast = useCallback(() => setDismissedToastKey(activeToastKey), [activeToastKey]);

  function controlClass(field: CheckoutField) {
    const error = fieldError(field);
    if (error) return `${baseControlClass} border-[#c23518] bg-[#fff9f7]`;
    if (touchedFields.has(field) && filledFields.has(field)) {
      return `${baseControlClass} border-[#2f7d5a] bg-[#f8fffb]`;
    }
    if (filledFields.has(field)) return `${baseControlClass} border-black/20`;
    return `${baseControlClass} border-black/10`;
  }

  function errorProps(field: CheckoutField) {
    const error = fieldError(field);
    return {
      "aria-invalid": Boolean(error),
      "aria-describedby": error ? `${field}-error` : undefined,
    };
  }

  const fieldHandlers = { onBlur: handleBlur, onChange: handleChange };

  return (
    <>
      <form
        ref={formRef}
        action={formAction}
        className="w-full"
        noValidate
        onSubmit={() => setDismissedToastKey(null)}
      >
        <section aria-labelledby="contact-heading">
          <SectionHeading id="contact-heading">Contact</SectionHeading>
          <div className="mt-[18px]">
            <label htmlFor="email" className="mb-2 block text-[12px] font-medium text-black/70">
              Email address <span aria-hidden>*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              disabled={isPending}
              {...fieldHandlers}
              {...errorProps("email")}
              className={controlClass("email")}
            />
            <FieldErrorMessage field="email" message={fieldError("email")} />
          </div>
        </section>

        <section aria-labelledby="delivery-heading" className="mt-[34px]">
          <SectionHeading id="delivery-heading">Delivery</SectionHeading>
          <div className="mt-[18px] grid gap-[14px]">
            <div>
              <label htmlFor="countryCode" className="mb-2 block text-[12px] font-medium text-black/70">
                Country or region <span aria-hidden>*</span>
              </label>
              <select
                id="countryCode"
                name="countryCode"
                defaultValue="US"
                required
                disabled={isPending}
                {...fieldHandlers}
                {...errorProps("countryCode")}
                className={`${controlClass("countryCode")} cursor-pointer appearance-auto`}
              >
                {COUNTRIES.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.label}
                  </option>
                ))}
              </select>
              <FieldErrorMessage field="countryCode" message={fieldError("countryCode")} />
            </div>

            <div className="grid gap-[14px] sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="mb-2 block text-[12px] font-medium text-black/70">
                  First name <span aria-hidden>*</span>
                </label>
                <input id="firstName" name="firstName" autoComplete="given-name" placeholder="Ada" required disabled={isPending} {...fieldHandlers} {...errorProps("firstName")} className={controlClass("firstName")} />
                <FieldErrorMessage field="firstName" message={fieldError("firstName")} />
              </div>
              <div>
                <label htmlFor="lastName" className="mb-2 block text-[12px] font-medium text-black/70">
                  Last name <span aria-hidden>*</span>
                </label>
                <input id="lastName" name="lastName" autoComplete="family-name" placeholder="Lovelace" required disabled={isPending} {...fieldHandlers} {...errorProps("lastName")} className={controlClass("lastName")} />
                <FieldErrorMessage field="lastName" message={fieldError("lastName")} />
              </div>
            </div>

            <div>
              <label htmlFor="address1" className="mb-2 block text-[12px] font-medium text-black/70">
                Address <span aria-hidden>*</span>
              </label>
              <input id="address1" name="address1" autoComplete="address-line1" placeholder="131 Greene Street" required disabled={isPending} {...fieldHandlers} {...errorProps("address1")} className={controlClass("address1")} />
              <FieldErrorMessage field="address1" message={fieldError("address1")} />
            </div>

            <div>
              <label htmlFor="address2" className="mb-2 block text-[12px] font-medium text-black/70">
                Apartment, suite, etc. <span className="font-normal text-black/40">Optional</span>
              </label>
              <input id="address2" name="address2" autoComplete="address-line2" placeholder="Apartment 4B" disabled={isPending} {...fieldHandlers} {...errorProps("address2")} className={controlClass("address2")} />
              <FieldErrorMessage field="address2" message={fieldError("address2")} />
            </div>

            <div className="grid gap-[14px] sm:grid-cols-3">
              <div>
                <label htmlFor="city" className="mb-2 block text-[12px] font-medium text-black/70">
                  City <span aria-hidden>*</span>
                </label>
                <input id="city" name="city" autoComplete="address-level2" placeholder="New York" required disabled={isPending} {...fieldHandlers} {...errorProps("city")} className={controlClass("city")} />
                <FieldErrorMessage field="city" message={fieldError("city")} />
              </div>
              <div>
                <label htmlFor="provinceCode" className="mb-2 block text-[12px] font-medium text-black/70">
                  State or region <span aria-hidden>*</span>
                </label>
                <input id="provinceCode" name="provinceCode" autoComplete="address-level1" placeholder="NY" required disabled={isPending} {...fieldHandlers} {...errorProps("provinceCode")} className={controlClass("provinceCode")} />
                <FieldErrorMessage field="provinceCode" message={fieldError("provinceCode")} />
              </div>
              <div>
                <label htmlFor="zip" className="mb-2 block text-[12px] font-medium text-black/70">
                  ZIP or postal code <span aria-hidden>*</span>
                </label>
                <input id="zip" name="zip" autoComplete="postal-code" placeholder="10012" required disabled={isPending} {...fieldHandlers} {...errorProps("zip")} className={controlClass("zip")} />
                <FieldErrorMessage field="zip" message={fieldError("zip")} />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="mb-2 block text-[12px] font-medium text-black/70">
                Phone <span className="font-normal text-black/40">Optional</span>
              </label>
              <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+12125551212" disabled={isPending} {...fieldHandlers} {...errorProps("phone")} className={controlClass("phone")} />
              <FieldErrorMessage field="phone" message={fieldError("phone")} />
            </div>
          </div>
        </section>

        <section aria-labelledby="shipping-heading" className="mt-[34px]">
          <SectionHeading id="shipping-heading" size={20}>Shipping method</SectionHeading>
          <div className="mt-[16px] rounded-[8px] bg-white/45 px-[20px] py-[22px] text-[14px] text-black/55">
            Shipping options and final rates are calculated securely by Shopify.
          </div>
        </section>

        <section aria-labelledby="payment-heading" className="mt-[34px]">
          <SectionHeading id="payment-heading">Payment</SectionHeading>
          <p className="mt-2 text-[14px] leading-[20px] text-black/60">
            All transactions are secure and encrypted.
          </p>
          <div className="mt-[16px] rounded-[8px] bg-white px-[20px] py-[22px]">
            <div className="flex flex-wrap items-center gap-[22px]">
              {PAYMENT_MARKS.map((mark) => (
                <Image key={mark.src} src={mark.src} alt={mark.alt} width={mark.width} height={mark.height} className="h-[12px] w-auto" />
              ))}
            </div>
            <p className="mt-[18px] text-[13px] leading-[18px] text-black/55">
              Payment details are entered on Shopify&apos;s secure checkout.
            </p>
          </div>
        </section>

        {blockedMessage ? (
          <p className="mt-[20px] rounded-[8px] bg-[#fff7e8] px-[16px] py-[14px] text-[13px] text-[#7f4a08]">
            {blockedMessage}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isPending || Boolean(blockedMessage)}
          className="mt-[26px] flex h-[61px] w-full cursor-pointer items-center justify-center rounded-full bg-[#e94b24] text-[18px] text-white transition-colors hover:bg-[#d9401d] disabled:cursor-not-allowed disabled:opacity-55"
        >
          {isPending ? "Preparing secure checkout..." : "Continue to secure payment"}
        </button>
      </form>

      <CheckoutToast toast={toast} onDismiss={dismissToast} />
    </>
  );
}
