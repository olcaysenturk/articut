import { z } from "zod";

const countryCodes = ["US", "CA", "GB", "AU", "TR", "DE", "FR", "IT", "ES", "NL"] as const;

export const checkoutSchema = z.object({
  email: z.email("Enter a valid email address."),
  countryCode: z.enum(countryCodes, "Select a supported country."),
  firstName: z.string().trim().min(1, "Enter your first name."),
  lastName: z.string().trim().min(1, "Enter your last name."),
  address1: z.string().trim().min(3, "Enter a valid address."),
  address2: z.string().trim(),
  city: z.string().trim().min(1, "Enter your city."),
  provinceCode: z.string().trim().min(1, "Enter your state or region."),
  zip: z.string().trim().min(2, "Enter your ZIP or postal code."),
  phone: z
    .string()
    .trim()
    .refine((value) => value === "" || /^\+[1-9]\d{7,14}$/.test(value), {
      message: "Use international format, for example +12125551212.",
    }),
});

export type CheckoutField = keyof z.infer<typeof checkoutSchema>;

export type CheckoutActionState = {
  message: string | null;
  kind: "error" | "warning" | "info" | null;
  fieldErrors: Partial<Record<CheckoutField, string[]>>;
};

export const initialCheckoutState: CheckoutActionState = {
  message: null,
  kind: null,
  fieldErrors: {},
};
