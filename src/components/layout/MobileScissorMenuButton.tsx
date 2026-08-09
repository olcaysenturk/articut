"use client";

import Image from "next/image";
import Link from "next/link";
import { type MouseEvent, useCallback, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BrandAMark } from "@/components/editorial/BrandAMark";
import { useOverlayBehavior } from "@/components/ui/useOverlayBehavior";
import { useScrollLock } from "@/components/ui/useScrollLock";
import { useCartStore } from "@/features/cart/cart-store";

const MENU_LINKS = [
  { href: "/", label: "Home" },
  { href: "/#cutpilot-mobile", label: "Cutpilot™" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQs" },
];

const menuItems = {
  hidden: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
  visible: {
    transition: { delayChildren: 0.18, staggerChildren: 0.075 },
  },
};

const menuItem = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export function MobileScissorMenuButton({ tone = "accent" }: { tone?: "accent" | "black" }) {
  const [isOpen, setIsOpen] = useState(false);
  const openCart = useCartStore((state) => state.openDrawer);
  const closeMenu = useCallback(() => setIsOpen(false), []);
  const containerRef = useOverlayBehavior(isOpen, closeMenu);
  useScrollLock(isOpen);

  const navigateToSection = useCallback(
    (event: MouseEvent<HTMLAnchorElement>, href: string) => {
      event.preventDefault();
      closeMenu();

      window.setTimeout(() => {
        const url = new URL(href, window.location.origin);
        const isCurrentPage = url.pathname === window.location.pathname;
        const target = isCurrentPage && url.hash
          ? document.querySelector<HTMLElement>(url.hash)
          : null;

        if (!target) {
          window.location.assign(url.href);
          return;
        }

        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
        window.history.replaceState(null, "", href);
      }, 50);
    },
    [closeMenu],
  );

  const showCart = useCallback(() => {
    closeMenu();
    window.setTimeout(openCart, 420);
  }, [closeMenu, openCart]);

  return (
    <div ref={containerRef} className="contents">
      <button
        type="button"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        onClick={() => setIsOpen((open) => !open)}
        className={`${isOpen ? "fixed" : "absolute"} right-[32px] top-[19px] z-[70] h-[24px] w-[24px] md:hidden`}
      >
        <span
          className={`absolute left-0 h-[9px] w-[24px] transition-[top,bottom,rotate,translate] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
          }`}
        >
            <Image src="/figma/menu-top.svg" alt="" fill sizes="24px" className={!isOpen && tone === "black" ? "brightness-0" : undefined} />
        </span>
        <span
          className={`absolute left-0 h-[9px] w-[24px] transition-[top,bottom,rotate,translate] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isOpen ? "bottom-1/2 translate-y-1/2 -rotate-45" : "bottom-0"
          }`}
        >
            <Image src="/figma/menu-bottom.svg" alt="" fill sizes="24px" className={!isOpen && tone === "black" ? "brightness-0" : undefined} />
        </span>
      </button>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            initial={{ clipPath: "circle(0% at calc(100% - 44px) 31px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 44px) 31px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 44px) 31px)" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[60] h-dvh w-screen overflow-hidden bg-black text-[#e04d26] md:hidden"
          >
            <motion.nav
              variants={menuItems}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="absolute left-0 right-0 top-[60px] px-[32px]"
            >
              <ul className="flex flex-col items-center gap-[46px]">
                {MENU_LINKS.map((link) => (
                  <motion.li
                    key={link.href}
                    variants={menuItem}
                    transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={link.href}
                      onClick={(event) => navigateToSection(event, link.href)}
                      className="font-[family-name:var(--font-body)] text-[40px] font-semibold leading-none"
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.nav>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ delay: 0.3, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-none absolute inset-0"
            >
              <BrandAMark className="absolute bottom-[75px] left-1/2 h-[298px] w-[327px] -translate-x-1/2" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.48, duration: 0.35 }}
              className="absolute inset-x-[31px] bottom-[35px] grid grid-cols-3 items-center text-[11px] leading-none"
            >
              <a href="mailto:info@articut.com" className="whitespace-nowrap">info@articut.com ↗</a>
              <button type="button" onClick={showCart} className="cursor-pointer text-center">Cart</button>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-right">Instagram ↗</a>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
