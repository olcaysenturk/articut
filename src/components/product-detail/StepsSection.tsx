"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsapPlugins } from "@/lib/animation/gsap";
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
    <div className="flex h-[127px] items-center overflow-hidden bg-[#e04d26] text-[#fab446]">
      <div className="grid h-[80px] w-full grid-cols-4 items-center gap-x-5 border-y-[3px] border-[#fab446] px-4 font-[family-name:var(--font-editorial)] text-[18px] italic lowercase md:h-full md:gap-x-6 md:px-[50px] md:text-[52px]">
        {RIBBON_WORDS.map((word, wordIndex) => (
          <span
            key={word}
            data-step-ribbon-word
            className={`relative flex h-full items-center justify-center transition-[font-weight] duration-200 ${
              wordIndex < RIBBON_WORDS.length - 1
                ? "after:absolute after:left-full after:top-1/2 after:block after:h-[7px] after:w-[14px] after:-translate-y-1/2 after:rounded-b-full after:bg-current after:content-[''] md:after:mt-[7px] md:after:h-[22px] md:after:w-[44px]"
                : "md:after:absolute md:after:left-full md:after:top-1/2 md:after:mt-[7px] md:after:block md:after:h-[22px] md:after:w-[44px] md:after:-translate-y-1/2 md:after:rounded-b-full md:after:bg-current md:after:content-['']"
            } ${
              wordIndex === 0
                ? "md:before:absolute md:before:right-full md:before:top-1/2 md:before:mt-[7px] md:before:block md:before:h-[22px] md:before:w-[44px] md:before:-translate-y-1/2 md:before:rounded-b-full md:before:bg-current md:before:content-['']"
                : ""
            } ${
              activeIndex === wordIndex ? "font-bold" : "font-normal"
            }`}
          >
            {word}
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
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      registerGsapPlugins();
      const section = sectionRef.current;
      if (!section) return;

      const stepCards = gsap.utils.toArray<HTMLElement>("[data-step-card]", section);
      gsap.from(stepCards, {
        y: 44,
        opacity: 0,
        duration: 0.72,
        ease: "power3.out",
        stagger: 0.14,
        scrollTrigger: {
          trigger: section,
          start: "top 72%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="relative bg-white">
      <div className="overflow-hidden md:flex md:h-[112svh] md:min-h-[780px] md:flex-col">
        <WordRibbon activeIndex={hoveredIndex} />
        <div className="bg-white px-8 py-12 md:flex md:flex-1 md:items-center md:px-[50px] md:py-[72px]">
          <div className="grid w-full grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-12 md:gap-x-6 md:gap-y-0">
            {STEPS.map((step, index) => (
              <article key={step.title} data-step-card className="text-center md:px-4">
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
