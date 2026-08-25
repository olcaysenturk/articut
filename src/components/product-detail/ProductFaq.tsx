"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const ITEMS = [
  {
    question: "What is Cutpilot™ made from?",
    answer:
      "Cutpilot is made from durable, lightweight materials selected for comfortable handling, easy cleaning and repeated use at home.",
  },
  {
    question: "Is Cutpilot™ waterproof?",
    answer:
      "Cutpilot can be wiped clean after use. Do not submerge the complete tool or leave it soaking in water.",
  },
  {
    question: "Is Cutpilot™ packaging recyclable?",
    answer:
      "The paper-based parts of the packaging can be recycled where local recycling facilities accept them.",
  },
  {
    question: "Is Cutpilot™ safe for kids?",
    answer:
      "Cutpilot should always be used by an adult. Keep cutting tools and loose accessories away from children when not in use.",
  },
];

export function ProductFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-[#d9d9d9] px-8 py-8 text-[#e04d26] md:px-[50px] md:py-[50px]">
      <div className="mx-auto max-w-[1340px] border-x border-t border-[#e04d26] md:border-x-[3px] md:border-t-[3px]">
        {ITEMS.map((item, index) => {
          const isOpen = openIndex === index;
          const panelId = `cutpilot-faq-panel-${index}`;

          return (
            <div key={item.question} className="border-b border-[#e04d26] md:border-b-[3px]">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex min-h-[76px] w-full cursor-pointer items-center px-5 text-left text-[14px] font-semibold transition-colors hover:bg-[#e04d26] hover:text-[#fff4de] md:min-h-[117px] md:px-[64px] md:text-[30px]"
              >
                <span>{item.question}</span>
              </button>
              <motion.div
                id={panelId}
                initial={false}
                animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden bg-[#e04d26] text-[#fff4de]"
              >
                <p className="px-5 py-7 text-[14px] leading-[1.25] md:px-[64px] md:py-[48px] md:text-[22px]">
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
