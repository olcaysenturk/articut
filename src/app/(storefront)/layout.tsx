import type { ReactNode } from "react";
import { CartDrawer } from "@/components/commerce/CartDrawer";
import { BrandLoader } from "@/components/loading/BrandLoader";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { PageTransition } from "@/components/motion/PageTransition";

export default function StorefrontLayout({ children }: { children: ReactNode }) {
  return (
    <MotionProvider>
      <div className="initial-loader-overlay fixed inset-0 z-[100]">
        <BrandLoader announce={false} preload />
      </div>
      <main className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <CartDrawer />
    </MotionProvider>
  );
}
