"use client";

import { cn } from "@/lib/utils";
import type { Product, ProductVariant } from "@/types/shopify";

type VariantSelectorProps = {
  options: Product["options"];
  variants: ProductVariant[];
  selectedVariantId: string | null;
  onSelectVariant: (variantId: string) => void;
};

function findVariant(variants: ProductVariant[], selectedOptions: Record<string, string>) {
  return variants.find((variant) =>
    variant.selectedOptions.every((option) => selectedOptions[option.name] === option.value),
  );
}

export function VariantSelector({
  options,
  variants,
  selectedVariantId,
  onSelectVariant,
}: VariantSelectorProps) {
  const selectedVariant = variants.find((variant) => variant.id === selectedVariantId);
  const selectedOptions: Record<string, string> = {};
  selectedVariant?.selectedOptions.forEach((option) => {
    selectedOptions[option.name] = option.value;
  });

  function handleSelect(optionName: string, value: string) {
    const nextSelectedOptions = { ...selectedOptions, [optionName]: value };
    const matchingVariant = findVariant(variants, nextSelectedOptions);
    if (matchingVariant) {
      onSelectVariant(matchingVariant.id);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {options.map((option) => (
        <div key={option.name}>
          <p className="mb-2 text-sm font-medium">{option.name}</p>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const isSelected = selectedOptions[option.name] === value;
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => handleSelect(option.name, value)}
                  className={cn(
                    "rounded-(--radius-button) border border-border px-4 py-2 text-sm transition-colors-standard",
                    isSelected && "border-accent bg-accent text-background",
                  )}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
