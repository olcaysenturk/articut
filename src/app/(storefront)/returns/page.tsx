import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "İade Koşulları",
};

export default function ReturnsPage() {
  return (
    <Container className="py-(--space-section)">
      <h1>İade Koşulları</h1>
      <p className="mt-6 text-muted">
        Bu sayfanın içeriği mağaza politikalarına göre doldurulacak.
      </p>
    </Container>
  );
}
