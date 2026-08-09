import { HeroMotion } from "@/components/sections/hero/HeroMotion";
import { ProductPrice } from "@/components/commerce/ProductPrice";
import { Container } from "@/components/ui/Container";
import type { Product } from "@/types/shopify";

type HeroSectionProps = {
  product: Product;
};

export function HeroSection({ product }: HeroSectionProps) {
  return (
    <section className="border-b border-border py-(--space-section)">
      <Container>
        <HeroMotion>
          <p className="mb-4 text-sm uppercase tracking-widest text-muted">Articut</p>
          <h1 className="max-w-3xl">{product.title}</h1>
          <p className="mt-6 max-w-xl text-muted">{product.description}</p>
          <div className="mt-8">
            <ProductPrice price={product.price} compareAtPrice={product.compareAtPrice} />
          </div>
        </HeroMotion>
      </Container>
    </section>
  );
}
