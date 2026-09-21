"use client";

import type { FaqItem } from "@/types/cms";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";



export function ProductFaq({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-[#d9d9d9] px-8 py-8 text-[#e04d26] md:px-[50px] md:py-[50px]">
      <div className="mx-auto max-w-[1340px] border-x-[3px] border-t-[3px] border-[#e04d26]">
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          const panelId = `cutpilot-faq-panel-${index}`;

          return (
            <div key={index} className="border-b-[3px] border-[#e04d26]">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className={`flex min-h-[76px] w-full cursor-pointer items-center justify-center px-5 text-center text-[14px] font-semibold transition-colors hover:bg-[#e04d26] hover:text-[#fff4de] md:min-h-[117px] md:px-[64px] md:text-[30px] ${isOpen ? "bg-[#e04d26] text-[#fff4de]" : ""}`}
              >
                <span>{item.question}</span>
              </button>
              <motion.div
                id={panelId}
                initial={false}
                animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden text-[#e04d26]"
              >
                <p className="whitespace-pre-line px-5 py-7 text-center text-[14px] leading-[1.25] md:px-[64px] md:py-[48px] md:text-[22px]">
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
