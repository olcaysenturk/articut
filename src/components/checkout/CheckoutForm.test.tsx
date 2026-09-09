import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import { submitCheckout } from "@/app/actions/checkout-actions";
import { CheckoutForm } from "./CheckoutForm";

vi.mock("@/app/actions/checkout-actions", () => ({ submitCheckout: vi.fn() }));
vi.mock("@/components/checkout/CheckoutToast", () => ({ CheckoutToast: () => null }));

beforeEach(() => {
  HTMLElement.prototype.scrollIntoView = vi.fn();
  vi.mocked(submitCheckout).mockResolvedValue({
    message: "Check the highlighted fields.",
    kind: "error",
    fieldErrors: { email: ["Enter a valid email address."] },
  });
});

it("preserves entered values and shows repeated server errors after submission", async () => {
  render(<CheckoutForm />);
  const email = screen.getByLabelText(/Email address/);
  const firstName = screen.getByLabelText(/First name/);
  const country = screen.getByLabelText(/Country or region/);
  fireEvent.change(email, { target: { value: "invalid" } });
  fireEvent.change(firstName, { target: { value: "Ada" } });
  fireEvent.change(country, { target: { value: "TR" } });
  fireEvent.click(screen.getByRole("button", { name: "Continue to secure payment" }));
  await waitFor(() => expect(email).toHaveAttribute("aria-invalid", "true"));
  expect(email).toHaveValue("invalid");
  expect(firstName).toHaveValue("Ada");
  expect(country).toHaveValue("TR");

  fireEvent.change(email, { target: { value: "still-invalid" } });
  fireEvent.click(screen.getByRole("button", { name: "Continue to secure payment" }));
  await waitFor(() => expect(submitCheckout).toHaveBeenCalledTimes(2));
  await waitFor(() => expect(email).toHaveAttribute("aria-invalid", "true"));
  expect(email).toHaveValue("still-invalid");
  expect(firstName).toHaveValue("Ada");
  expect(country).toHaveValue("TR");
});
