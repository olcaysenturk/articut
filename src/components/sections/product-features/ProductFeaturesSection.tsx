import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";

const FEATURES = [
  { title: "Özellik 1" },
  { title: "Özellik 2" },
  { title: "Özellik 3" },
];

export function ProductFeaturesSection() {
  return (
    <section className="border-b border-border py-(--space-section)">
      <Container>
        <div className="grid gap-12 md:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <Reveal key={feature.title} delay={index * 0.1}>
              <h3>{feature.title}</h3>
              <p className="mt-3 text-muted">
                Figma tasarımı ve referans videodan çıkarılacak özellik açıklaması.
              </p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
