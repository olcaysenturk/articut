import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";

const TESTIMONIALS = [
  { quote: "Yorum içeriği referans video ve Figma incelemesi sonrası eklenecek.", author: "Müşteri" },
  { quote: "Yorum içeriği referans video ve Figma incelemesi sonrası eklenecek.", author: "Müşteri" },
];

export function TestimonialsSection() {
  return (
    <section className="border-b border-border py-(--space-section)">
      <Container>
        <div className="grid gap-12 md:grid-cols-2">
          {TESTIMONIALS.map((testimonial, index) => (
            <Reveal key={`${testimonial.author}-${index}`} delay={index * 0.1}>
              <blockquote className="text-lg">“{testimonial.quote}”</blockquote>
              <p className="mt-4 text-sm text-muted">{testimonial.author}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
