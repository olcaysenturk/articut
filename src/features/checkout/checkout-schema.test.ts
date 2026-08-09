import { describe, expect, it } from "vitest";
import { checkoutSchema } from "@/features/checkout/checkout-schema";

const validCheckout = {
  email: "buyer@example.com",
  countryCode: "US",
  firstName: "Ada",
  lastName: "Lovelace",
  address1: "131 Greene Street",
  address2: "",
  city: "New York",
  provinceCode: "NY",
  zip: "10012",
  phone: "+12125551212",
};

describe("checkoutSchema", () => {
  it("accepts a valid checkout address", () => {
    expect(checkoutSchema.safeParse(validCheckout).success).toBe(true);
  });

  it("rejects invalid contact and address fields", () => {
    const result = checkoutSchema.safeParse({
      ...validCheckout,
      email: "invalid",
      address1: "",
      phone: "555-1212",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.email).toBeDefined();
      expect(errors.address1).toBeDefined();
      expect(errors.phone).toBeDefined();
    }
  });
});
