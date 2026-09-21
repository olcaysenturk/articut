import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { AddToCartButton } from "./AddToCartButton";
import { addToCart } from "@/app/actions/cart-actions";

vi.mock("@/app/actions/cart-actions", () => ({ addToCart: vi.fn() }));

it("replaces custom purchase content and prevents clicks when out of stock", () => {
  render(<AddToCartButton variantId="sold-out" quantity={1} disabled label="Add to Cart, $50"><span>Add to Cart → $50</span></AddToCartButton>);
  const button = screen.getByRole("button", { name: "Out of stock" });
  expect(button).toBeDisabled();
  expect(screen.queryByText("Add to Cart → $50")).not.toBeInTheDocument();
  fireEvent.click(button);
  expect(addToCart).not.toHaveBeenCalled();
});
