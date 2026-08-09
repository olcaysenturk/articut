import { ProductStoryMotion } from "@/components/sections/product-story/ProductStoryMotion";
import { Container } from "@/components/ui/Container";

const STORY_PANELS = [
  { title: "Tasarım" },
  { title: "Malzeme" },
  { title: "Detay" },
];

export function ProductStorySection() {
  return (
    <section className="border-b border-border py-(--space-section)">
      <Container>
        <ProductStoryMotion>
          <div className="flex flex-col gap-24">
            {STORY_PANELS.map((panel) => (
              <div key={panel.title} className="product-story-panel max-w-xl">
                <h2>{panel.title}</h2>
                <p className="mt-4 text-muted">
                  Bu bölümün içeriği ve animasyon zamanlaması Figma tasarımı ile referans video
                  analiz edildikten sonra doldurulacak.
                </p>
              </div>
            ))}
          </div>
        </ProductStoryMotion>
      </Container>
    </section>
  );
}
