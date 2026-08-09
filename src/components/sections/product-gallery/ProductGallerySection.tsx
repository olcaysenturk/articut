import { ProductGallery } from "@/components/commerce/ProductGallery";
import { Container } from "@/components/ui/Container";
import type { ProductImage } from "@/types/shopify";

type ProductGallerySectionProps = {
  images: ProductImage[];
};

export function ProductGallerySection({ images }: ProductGallerySectionProps) {
  return (
    <section className="border-b border-border py-(--space-section)">
      <Container>
        <ProductGallery images={images} />
      </Container>
    </section>
  );
}
