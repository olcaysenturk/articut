import { type ReactNode } from "react";
import {
  FeatureSection,
  type FeatureSectionConfig,
} from "@/components/sections/features/FeatureSection";
import { VideoMuteButton } from "@/components/media/VideoMuteButton";
import { VideoPlaybackButton } from "@/components/media/VideoPlaybackButton";
import { FEATURES } from "@/components/sections/hero/hero-content";
import { HERO_VIDEO_POSTER_URL, HERO_VIDEO_URL } from "@/config/hero-video";

const CUTPILOT_FEATURE_CONFIG: FeatureSectionConfig = {
  title: ["Revolutionary", "at-home hair", "cutting gadget"],
  titleAriaLabel: "Revolutionary at-home hair cutting gadget",
  headingClassName:
    "section-two-heading absolute left-1/2 top-[52px] z-10 w-[min(1340px,92vw)] -translate-x-1/2",
  sectionClassName: "relative h-dvh overflow-hidden bg-black text-white",
  nodeId: "1:503",
  enablePngSequence: true,
  sequence: {
    path: "/images/sequence/Cutpilot_3D_Desktop{index}.webp",
    frameCount: 125,
    frameWidth: 1440,
    frameHeight: 810,
    indexPadding: 3,
    startAt: 0.65,
    duration: 5.4,
    canvasClassName:
      "absolute left-0 top-1/2 z-20 h-auto w-full -translate-y-1/2 object-contain xl:inset-0 xl:h-full xl:translate-y-0 xl:object-cover",
  },
  features: FEATURES,
  featuresClassName:
    "absolute bottom-[161px] left-1/2 w-[min(554px,82vw)] -translate-x-1/2 text-center text-[18px] font-light leading-[1.23]",
  featureItemClassName: "flex items-center justify-center gap-[10px]",
  showFeatureBullets: true,
  bulletClassName: "h-[8px] w-[8px] shrink-0 rounded-full bg-[#e04d26]",
  cta: {
    href: "/cutpilot",
    label: "Explore Cutpilot™",
    className:
      "feature-cta-hover absolute bottom-[75px] left-1/2 h-[61px] w-[304px] -translate-x-1/2",
    backgroundClassName: "feature-cta-pill absolute inset-0 rounded-full bg-[#e04d26]",
    contentClassName:
      "pointer-events-auto absolute inset-0 flex items-center justify-center text-[20px] text-[#e0e0e0]",
  },
  animation: {
    animateHeading: true,
    animateDetails: true,
    headingStartAt: 0.45,
    headingDuration: 1.35,
    headingStagger: 0.14,
    headingScrollStart: "top 50%",
    headingScrollEnd: "top -8%",
    headingScrollScrub: 0.45,
    scrollStart: "top top",
    scrollEnd: "+=220%",
    scrollScrub: 0.85,
    pin: true,
    pinAnticipate: 0.15,
  },
};

type HeroProductRevealProps = {
  header: ReactNode;
  posterUrl?: string;
  videoUrl?: string;
};

export function HeroProductReveal({
  header,
  posterUrl = HERO_VIDEO_POSTER_URL,
  videoUrl = HERO_VIDEO_URL,
}: HeroProductRevealProps) {
  return (
    <>
      <section
        data-video-frame
        className="relative h-dvh overflow-hidden bg-black"
        data-node-id="1:502"
      >
        {header}
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
        playsInline
        preload="metadata"
        poster={posterUrl}
      >
          <source src={videoUrl} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/10" />
        <VideoPlaybackButton className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2" />
        <VideoMuteButton className="absolute bottom-[34px] right-[50px] z-20" />
      </section>

      <FeatureSection config={CUTPILOT_FEATURE_CONFIG} />
    </>
  );
}
