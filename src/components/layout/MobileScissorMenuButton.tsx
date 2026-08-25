"use client";

import Image from "next/image";
import Link from "next/link";
import { type MouseEvent, useCallback, useState } from "react";
import { motion, useAnimationControls } from "motion/react";
import { BrandAMark } from "@/components/editorial/BrandAMark";
import { useOverlayBehavior } from "@/components/ui/useOverlayBehavior";
import { useScrollLock } from "@/components/ui/useScrollLock";
import { useCartStore } from "@/features/cart/cart-store";

const MENU_LINKS = [
  { href: "/", label: "Home" },
  { href: "/cutpilot", label: "Cutpilot™" },
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

const panelTransition = { duration: 1.75, ease: [0.22, 1, 0.36, 1] as const };

function MenuArrow() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="footer-link-arrow ml-[0.28em] inline-block size-[0.82em]"
    >
      <path
        d="M4.8 20.7L17.1 8.4H8.3V5.2h14.1v14.1h-3.2v-8.7L7.1 22.9Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function MobileScissorMenuButton({
  tone = "accent",
  blend = false,
}: {
  tone?: "accent" | "black";
  blend?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const topBladeControls = useAnimationControls();
  const bottomBladeControls = useAnimationControls();
  const openCart = useCartStore((state) => state.openDrawer);
  const closeMenu = useCallback(() => setIsOpen(false), []);
  const containerRef = useOverlayBehavior(isOpen, closeMenu);
  useScrollLock(isOpen);

  const playScissorClick = useCallback(() => {
    const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];
    const transition = {
      duration: 0.42,
      ease,
      times: [0, 0.46, 0.64, 1],
    };

    void topBladeControls.start({
      top: ["0px", "7.5px", "7.5px", "0px"],
      x: ["0px", "-2px", "-2px", "0px"],
      y: ["0px", "-4.5px", "-4.5px", "0px"],
      rotate: [0, -10, -10, 0],
      transition,
    });

    void bottomBladeControls.start({
      top: ["15px", "7.5px", "7.5px", "15px"],
      x: ["0px", "-2px", "-2px", "0px"],
      y: ["0px", "4.5px", "4.5px", "0px"],
      rotate: [0, 10, 10, 0],
      transition,
    });
  }, [bottomBladeControls, topBladeControls]);

  const toggleMenu = useCallback(() => {
    playScissorClick();
    setIsOpen((open) => !open);
  }, [playScissorClick]);

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
        onClick={toggleMenu}
        className={`${isOpen ? "fixed" : "absolute"} right-[32px] top-[19px] z-[70] h-[24px] w-[24px] md:hidden ${
          blend ? "mix-blend-difference" : ""
        }`}
      >
        <motion.span
          animate={topBladeControls}
          initial={{ top: 0, x: 0, y: 0, rotate: 0 }}
          className="absolute left-0 h-[9px] w-[24px] origin-right"
        >
          <Image
            src="/figma/menu-top.svg"
            alt=""
            fill
            sizes="24px"
            className={!isOpen && tone === "black" ? "brightness-0" : undefined}
          />
        </motion.span>
        <motion.span
          animate={bottomBladeControls}
          initial={{ top: 15, x: 0, y: 0, rotate: 0 }}
          className="absolute left-0 h-[9px] w-[24px] origin-right"
        >
          <Image
            src="/figma/menu-bottom.svg"
            alt=""
            fill
            sizes="24px"
            className={!isOpen && tone === "black" ? "brightness-0" : undefined}
          />
        </motion.span>
      </button>

      <motion.div
        id="mobile-navigation"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        aria-hidden={!isOpen}
        className={`fixed inset-0 z-[60] h-dvh w-screen overflow-hidden text-[#e04d26] md:hidden ${
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <motion.div
          aria-hidden="true"
          initial={{ x: "100%", y: "-100%", rotate: -45 }}
          animate={isOpen ? { x: "0%", y: "0%", rotate: -45 } : { x: "100%", y: "-100%", rotate: -45 }}
          transition={isOpen ? panelTransition : { ...panelTransition, delay: 0.12 }}
          className="absolute right-[-75vmax] top-[-75vmax] h-[250vmax] w-[250vmax] origin-center bg-black"
        />
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={
            isOpen
              ? {
                  opacity: 1,
                  y: 0,
                  transition: {
                    opacity: { delay: 0.42, duration: 0.28 },
                    y: { delay: 0.42, duration: 0.34, ease: [0.22, 1, 0.36, 1] },
                  },
                }
              : {
                  opacity: 0,
                  y: 10,
                  transition: { duration: 0.16, ease: [0.22, 1, 0.36, 1] },
                }
          }
          className="absolute inset-0 z-10"
        >
              <motion.nav
                variants={menuItems}
                initial={false}
                animate={isOpen ? "visible" : "hidden"}
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
                <a href="mailto:info@articut.com" className="footer-link-with-arrow whitespace-nowrap">
                  info@articut.com
                  <MenuArrow />
                </a>
                <button type="button" onClick={showCart} className="cursor-pointer text-center">Cart</button>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="footer-link-with-arrow text-right">
                  Instagram
                  <MenuArrow />
                </a>
              </motion.div>
            </motion.div>
      </motion.div>
    </div>
  );
}
