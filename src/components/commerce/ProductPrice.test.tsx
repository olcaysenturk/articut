import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProductPrice } from "@/components/commerce/ProductPrice";

describe("ProductPrice", () => {
  it("shows a struck-through compare-at price when discounted", () => {
    render(
      <ProductPrice
        price={{ amount: 80, currencyCode: "USD" }}
        compareAtPrice={{ amount: 100, currencyCode: "USD" }}
      />,
    );

    expect(screen.getByText("$80.00")).toBeInTheDocument();
    expect(screen.getByText("$100.00")).toBeInTheDocument();
  });

  it("hides the compare-at price when not discounted", () => {
    render(<ProductPrice price={{ amount: 80, currencyCode: "USD" }} compareAtPrice={null} />);
    expect(screen.queryByText(/100/)).not.toBeInTheDocument();
  });
});
