import { Container } from "@/components/ui/Container";
import type { Product } from "@/types/shopify";

type ProductDetailsSectionProps = {
  product: Product;
};

export function ProductDetailsSection({ product }: ProductDetailsSectionProps) {
  return (
    <section id="product" className="border-b border-border py-(--space-section)">
      <Container>
        <div className="grid gap-12 md:grid-cols-2">
          <div
            className="max-w-none text-muted [&_p]:mb-4"
            dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
          />
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
            {product.options.map((option) => (
              <div key={option.name}>
                <dt className="text-muted">{option.name}</dt>
                <dd className="mt-1 font-medium">{option.values.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}
