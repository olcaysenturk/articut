import type { FeatureSectionConfig } from "@/components/sections/features/FeatureSection";
import { FEATURES } from "@/components/sections/hero/hero-content";

const CUTSCISSORS_FEATURES = [
  "Rounded safety tips",
  "Comfortable ergonomic grip",
  "Precision stainless steel blades",
];

export const MOBILE_CUTPILOT_FEATURE_CONFIG: FeatureSectionConfig = {
  sectionId: "cutpilot-mobile",
  title: ["Revolutionary", "at-home", "hair cutting", "gadget"],
  titleAriaLabel: "Revolutionary at-home hair cutting gadget",
  headingLevel: 2,
  headingClassName:
    "mobile-feature-heading absolute left-1/2 top-[40px] z-10 w-[calc(100%-64px)] max-w-[329px] -translate-x-1/2",
  sectionClassName:
    "absolute left-0 top-[492px] h-[580px] w-full overflow-hidden bg-black text-white",
  enablePngSequence: true,
  sequence: {
    path: "/images/sequence/mobile/cutpilot_3D_Mobile_HigRes{index}.webp",
    frameCount: 125,
    frameWidth: 1179,
    frameHeight: 1740,
    indexPadding: 3,
    preloadMediaQuery: "(max-width: 767px)",
    startAt: 1.05,
    duration: 3.3,
    canvasClassName: "absolute inset-0 z-0 h-full w-full object-cover",
  },
  features: FEATURES,
  featuresClassName:
    "absolute left-1/2 top-[426px] w-[330px] -translate-x-1/2 text-center text-[12px] leading-[17px]",
  featureItemClassName: "flex items-center justify-center gap-[10px]",
  showFeatureBullets: true,
  bulletClassName: "h-[5px] w-[5px] shrink-0 rounded-full bg-[#e04d26]",
  cta: {
    href: "/cutpilot",
    label: "Explore Cutpilot™",
    className:
      "feature-cta-hover absolute left-1/2 top-[494px] h-[46px] w-[241px] -translate-x-1/2",
    backgroundClassName: "feature-cta-pill absolute inset-0 rounded-full bg-[#e04d26]",
    contentClassName:
      "pointer-events-auto absolute inset-0 flex items-center justify-center text-[12px] text-[#e0e0e0]",
  },
  detailsClassName: "z-10",
  animation: {
    animateDetails: true,
  },
};

export const DESKTOP_CUTSCISSORS_FEATURE_CONFIG: FeatureSectionConfig = {
  title: ["Home-optimized", "cutting tool"],
  titleAriaLabel: "Home optimized cutting tool",
  headingLevel: 2,
  headingClassName:
    "section-two-heading absolute left-1/2 top-[52px] z-10 w-[min(1340px,92vw)] -translate-x-1/2",
  sectionClassName: "relative h-dvh overflow-hidden bg-[#e04d26] text-white",
  nodeId: "1:554",
  backgroundImage: {
    src: "/figma/scissors-hero.png",
    alt: "Articut scissors",
    fill: true,
    sizes: "100vw",
    className: "object-cover",
  },
  productImage: {
    src: "/figma/scissors-product.png",
    alt: "",
    width: 1664,
    height: 936,
    sizes: "1664px",
    className: "h-full w-full rotate-[3.34deg] object-contain",
  },
  productImageContainerClassName:
    "absolute left-1/2 top-1/2 z-20 h-[936px] w-[1664px] max-w-full -translate-x-1/2 -translate-y-1/2 xl:max-w-none",
  features: CUTSCISSORS_FEATURES,
  featuresClassName:
    "absolute bottom-[161px] left-1/2 w-[min(554px,82vw)] -translate-x-1/2 text-center text-[clamp(14px,1.53vw,22px)] font-light leading-[1.23]",
  featureItemClassName: "flex items-center justify-center gap-[10px]",
  showFeatureBullets: true,
  bulletClassName: "h-[8px] w-[8px] shrink-0 rounded-full bg-white",
  cta: {
    href: "#product",
    label: "Explore CutScissors™",
    className:
      "feature-cta-hover absolute bottom-[75px] left-1/2 h-[61px] w-[296px] -translate-x-1/2",
    backgroundClassName: "feature-cta-pill absolute inset-0 rounded-full bg-[#d9d9d9]",
    contentClassName:
      "pointer-events-auto absolute inset-0 flex items-center justify-center text-[20px] text-[#e04d26]",
  },
  animation: {
    animateHeading: true,
    animateDetails: true,
    animateProductImage: true,
    productImageStartAt: 2.2,
    productImageDuration: 2.15,
  },
};

export const MOBILE_CUTSCISSORS_FEATURE_CONFIG: FeatureSectionConfig = {
  sectionId: "cutscissors-mobile",
  title: ["Home optimized", "cutting tool"],
  titleAriaLabel: "Home optimized cutting tool",
  headingLevel: 2,
  headingClassName:
    "mobile-feature-heading absolute left-1/2 top-[40px] z-10 w-[calc(100%-64px)] max-w-[329px] -translate-x-1/2",
  sectionClassName:
    "absolute left-0 top-[2247px] h-[580px] w-full overflow-hidden bg-[#e04d26] text-white",
  backgroundImage: {
    src: "/figma/scissors-hero.png",
    alt: "Articut scissors",
    fill: true,
    sizes: "393px",
    className: "object-cover",
  },
  productImage: {
    src: "/figma/scissors-product.png",
    alt: "",
    width: 796,
    height: 478,
    sizes: "796px",
    className: "h-full w-full object-contain",
  },
  productImageContainerClassName:
    "absolute left-1/2 top-1/2 z-20 h-[478px] w-[796px] -translate-x-1/2 -translate-y-1/2",
  features: CUTSCISSORS_FEATURES,
  featuresClassName:
    "absolute left-[32px] top-[426px] w-[330px] text-center text-[12px] leading-[17px]",
  featureItemClassName: "flex items-center justify-center gap-[10px]",
  showFeatureBullets: true,
  bulletClassName: "h-[5px] w-[5px] shrink-0 rounded-full bg-white",
  cta: {
    href: "/cutpilot",
    label: "Explore Cutpilot™",
    className:
      "feature-cta-hover absolute left-1/2 top-[494px] h-[46px] w-[241px] -translate-x-1/2",
    backgroundClassName: "feature-cta-pill absolute inset-0 rounded-full bg-[#e04d26]",
    contentClassName:
      "pointer-events-auto absolute inset-0 flex items-center justify-center text-[12px] text-[#fab446]",
  },
  detailsClassName: "z-10",
  animation: {
    animateHeading: true,
    animateDetails: true,
    animateProductImage: true,
  },
};
