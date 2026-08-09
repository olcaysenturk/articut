import { type ReactNode } from "react";
import {
  FeatureSection,
  type FeatureSectionConfig,
} from "@/components/sections/features/FeatureSection";
import { FEATURES } from "@/components/sections/hero/hero-content";

const CUTPILOT_FEATURE_CONFIG: FeatureSectionConfig = {
  title: ["Revolutionary", "at-home hair", "cutting gadget"],
  titleAriaLabel: "Revolutionary at-home hair cutting gadget",
  headingClassName:
    "section-two-heading absolute left-1/2 top-[52px] z-10 w-[min(1340px,92vw)] -translate-x-1/2",
  sectionClassName: "relative h-dvh overflow-hidden bg-black text-white",
  nodeId: "1:503",
  snapSection: true,
  enablePngSequence: true,
  sequence: {
    path: "/images/sequence/Cutpilot_3D_Desktop{index}.png",
    frameCount: 125,
    frameWidth: 1440,
    frameHeight: 810,
    indexPadding: 3,
    startAt: 1.05,
    duration: 3.3,
    canvasClassName:
      "absolute left-0 top-1/2 z-20 h-auto w-full -translate-y-1/2 object-contain xl:inset-0 xl:h-full xl:translate-y-0 xl:object-cover",
  },
  features: FEATURES,
  featuresClassName:
    "absolute bottom-[161px] left-1/2 w-[min(554px,82vw)] -translate-x-1/2 text-center text-[clamp(14px,1.53vw,22px)] font-light leading-[1.23]",
  featureItemClassName: "flex items-center justify-center gap-[10px]",
  showFeatureBullets: true,
  bulletClassName: "h-[8px] w-[8px] shrink-0 rounded-full bg-[#e04d26]",
  cta: {
    href: "/cutpilot",
    label: "Explore Cutpilot™",
    className:
      "absolute bottom-[75px] left-1/2 h-[61px] w-[304px] -translate-x-1/2",
    backgroundClassName: "absolute inset-0 rounded-full bg-[#e04d26]",
    contentClassName:
      "pointer-events-auto absolute inset-0 flex items-center justify-center text-[20px] text-[#e0e0e0]",
  },
  animation: {
    animateHeading: true,
    animateDetails: true,
  },
};

type HeroProductRevealProps = {
  header: ReactNode;
};

export function HeroProductReveal({ header }: HeroProductRevealProps) {
  return (
    <>
      <section
        className="relative h-dvh overflow-hidden bg-black"
        data-node-id="1:502"
        data-snap-section
      >
        {header}
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/figma/cutpilot-pack.png"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/10" />
      </section>

      <FeatureSection config={CUTPILOT_FEATURE_CONFIG} />
    </>
  );
}
