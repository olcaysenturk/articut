"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";

export type FaqItem = {
  question: string;
  answer: string;
  mobileQuestion?: string;
  mobileOnly?: boolean;
};

export function FaqAccordion({
  id,
  title,
  questions,
  initialOpenIndex = null,
}: {
  id: string;
  title: string;
  questions: FaqItem[];
  initialOpenIndex?: number | null;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(initialOpenIndex);
  const reduceMotion = useReducedMotion();

  return (
    <section id={id} className="scroll-mt-[30px]">
      <h2 className="faq-group-title pb-[40px] text-[#fab446]">{title}</h2>
      <div className="border-t border-white/70">
        {questions.map((item, index) => {
          const isOpen = openIndex === index;
          const panelId = `${id}-panel-${index}`;
          const buttonId = `${id}-button-${index}`;

          return (
            <div
              key={`${item.question}-${index}`}
              className={`border-b border-white/70 ${item.mobileOnly ? "md:hidden" : ""}`}
            >
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full cursor-pointer items-center justify-between gap-6 py-[14px] text-left font-[family-name:var(--font-body)] text-[16px] font-semibold leading-none text-white md:py-[29px] md:text-[40px]"
              >
                <span>
                  <span className="md:hidden">{item.mobileQuestion ?? item.question}</span>
                  <span className="hidden md:inline">{item.question}</span>
                </span>
                <span aria-hidden className="hidden shrink-0 text-[24px] font-normal md:block md:text-[32px]">
                  {isOpen ? "−" : "+"}
                </span>
              </button>
              <motion.div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                aria-hidden={!isOpen}
                initial={false}
                animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { duration: 0.42, ease: [0.22, 1, 0.36, 1] }
                }
                className="overflow-hidden"
              >
                <p className="max-w-[884px] pb-[14px] text-[15px] leading-[1.05] text-black md:pb-[32px] md:text-[22px]">
                  {item.answer}
                </p>
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function FaqSectionNav() {
  const reduceMotion = useReducedMotion();
  const links = [
    { href: "#products", label: "Products" },
    { href: "#shipping", label: "Shipping" },
    { href: "#orders", label: "Orders and Payment" },
    { href: "#returns", label: "Returns and Refunds" },
  ];

  return (
    <nav className="flex flex-col gap-[5px] font-[family-name:var(--font-body)] text-[14px] font-semibold leading-none text-white md:mt-[36px] md:gap-[18px] md:text-[20px]">
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          onClick={(event) => {
            event.preventDefault();
            const target = document.querySelector<HTMLElement>(link.href);
            target?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
            window.history.replaceState(null, "", link.href);
          }}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
