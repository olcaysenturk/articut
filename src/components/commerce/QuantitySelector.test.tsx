import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { QuantitySelector } from "@/components/commerce/QuantitySelector";

describe("QuantitySelector", () => {
  it("increments within bounds", () => {
    const handleChange = vi.fn();
    render(<QuantitySelector quantity={1} onChange={handleChange} min={1} max={3} />);

    fireEvent.click(screen.getByLabelText("Adedi artır"));
    expect(handleChange).toHaveBeenCalledWith(2);
  });

  it("disables decrement at the minimum", () => {
    render(<QuantitySelector quantity={1} onChange={() => {}} min={1} max={3} />);
    expect(screen.getByLabelText("Adedi azalt")).toBeDisabled();
  });

  it("disables increment at the maximum", () => {
    render(<QuantitySelector quantity={3} onChange={() => {}} min={1} max={3} />);
    expect(screen.getByLabelText("Adedi artır")).toBeDisabled();
  });
});
