"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useSettleZoom } from "@/lib/animation/useSettleZoom";

const PRODUCT_ASSET = "/images/product-detail";

const STEPS = [
  {
    title: "Set",
    image: `${PRODUCT_ASSET}/step-set.png`,
    description: "Set the numbered dial in the center of Cutpilot to set your desired cutting length.",
  },
  {
    title: "Place",
    image: `${PRODUCT_ASSET}/step-place.jpg`,
    description: "Place Cutpilot on your hair to position the cutting angle.",
  },
  {
    title: "Split",
    image: `${PRODUCT_ASSET}/step-split.jpg`,
    description: "Split Cutpilot with both fingers as much as you can.",
  },
  {
    title: "Cut",
    image: `${PRODUCT_ASSET}/step-cut.jpg`,
    description: "Cut any hair that remains outside Cutpilot using scissors or a hair clipper.",
  },
];

const RIBBON_WORDS = STEPS.map((step) => step.title.toLowerCase());

function WordRibbon({ activeIndex }: { activeIndex: number | null }) {
  return (
    <div className="flex h-[127px] items-center overflow-hidden border-y-[3px] border-[#fab446] bg-[#e04d26] text-[#fab446]">
      <div className="flex w-full items-center justify-between px-4 font-[family-name:var(--font-editorial)] text-[18px] italic lowercase md:px-8 md:text-[52px]">
        {RIBBON_WORDS.map((word, wordIndex) => (
          <span
            key={word}
            className={`flex items-center gap-[8px] transition-[font-weight] duration-200 md:gap-[76px] ${
              activeIndex === wordIndex ? "font-bold" : "font-normal"
            }`}
          >
            {word}
            <span className="inline-block h-[7px] w-[14px] rounded-b-full bg-current md:h-[22px] md:w-[44px]" />
          </span>
        ))}
      </div>
    </div>
  );
}

function StepCircle({
  step,
  onEnter,
  onLeave,
}: {
  step: (typeof STEPS)[number];
  onEnter: () => void;
  onLeave: () => void;
}) {
  const circleRef = useRef<HTMLDivElement>(null);
  useSettleZoom(circleRef);

  return (
    <div
      ref={circleRef}
      data-step-circle
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="settle-zoom relative mx-auto aspect-square w-full max-w-[272px] origin-center overflow-hidden rounded-full border-[3px] border-[#e04d26] bg-[#fab446] transition-transform duration-300 ease-out will-change-transform hover:scale-110"
    >
      <Image src={step.image} alt={`${step.title} Cutpilot`} fill sizes="(max-width: 767px) 150px, 272px" className="object-cover" />
    </div>
  );
}

export function StepsSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section data-snap-section className="relative bg-[#d9d9d9]">
      <div className="overflow-hidden md:flex md:h-svh md:min-h-[650px] md:flex-col md:justify-center">
        <WordRibbon activeIndex={hoveredIndex} />
        <div className="px-8 py-12 md:px-0 md:py-16">
          <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-4 md:gap-x-6 md:gap-y-0">
            {STEPS.map((step, index) => (
              <article key={step.title} className="text-center md:px-4">
                <StepCircle step={step} onEnter={() => setHoveredIndex(index)} onLeave={() => setHoveredIndex(null)} />
                <p className="mx-auto mt-6 max-w-[310px] text-[14px] leading-[1.05] md:text-[18px]">
                  <strong className="font-semibold">{step.title}</strong> {step.description.slice(step.title.length)}
                </p>
              </article>
            ))}
          </div>
        </div>
        <WordRibbon activeIndex={hoveredIndex} />
      </div>
    </section>
  );
}
