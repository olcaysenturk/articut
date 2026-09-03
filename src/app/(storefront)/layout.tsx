import type { ReactNode } from "react";
import { CartDrawer } from "@/components/commerce/CartDrawer";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { PageTransition } from "@/components/motion/PageTransition";

export default function StorefrontLayout({ children }: { children: ReactNode }) {
  return (
    <MotionProvider>
      <main className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <CartDrawer />
    </MotionProvider>
  );
}
