import { AccordionItem } from "@/components/ui/Accordion";
import { Container } from "@/components/ui/Container";

const FAQ_ITEMS = [
  { question: "Kargo süresi ne kadar?", answer: "İçerik Shopify ürün/sipariş politikalarına göre eklenecek." },
  { question: "İade koşulları nelerdir?", answer: "İçerik Shopify ürün/sipariş politikalarına göre eklenecek." },
  { question: "Ödeme yöntemleri nelerdir?", answer: "İçerik Shopify checkout yapılandırmasına göre eklenecek." },
];

export function FaqSection() {
  return (
    <section id="faq" className="border-b border-border py-(--space-section)">
      <Container>
        <h2 className="mb-8">Sıkça Sorulan Sorular</h2>
        <div>
          {FAQ_ITEMS.map((item) => (
            <AccordionItem key={item.question} question={item.question} answer={item.answer} />
          ))}
        </div>
      </Container>
    </section>
  );
}
