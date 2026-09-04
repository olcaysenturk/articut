import type { Metadata } from "next";
import React from "react";
import Image from "next/image";
import { EditorialFooter } from "@/components/editorial/EditorialFooter";
import { EditorialHeader } from "@/components/editorial/EditorialHeader";
import { VideoLoadingGate } from "@/components/loading/VideoLoadingGate";
import { VideoMuteButton } from "@/components/media/VideoMuteButton";
import { VideoPlaybackButton } from "@/components/media/VideoPlaybackButton";
import { Reveal } from "@/components/motion/Reveal";
import { getCmsContent } from "@/lib/cms-content";

function ContactArrow() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="relative top-[-0.12em] ml-[0.28em] mt-[10px] inline-block size-[0.82em] align-middle"
    >
      <path
        d="M4.8 20.7L17.1 8.4H8.3V5.2h14.1v14.1h-3.2v-8.7L7.1 22.9Z"
        fill="currentColor"
      />
    </svg>
  );
}

export const metadata: Metadata = {
  title: "About",
  description: "The story behind Articut and Cutpilot.",
};

export default async function AboutPage() {
  const cmsContent = await getCmsContent();
  const about = cmsContent.about;
  const paragraphs = about.storyContent.split("\n\n");
  const heroTitleLines = about.heroTitle.split("\n");

  return (
    <VideoLoadingGate>
    <div className="bg-[#d9d9d9] text-black">
      <section data-video-frame className="relative h-dvh overflow-hidden bg-black">
        <EditorialHeader dark />
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={about.heroPosterUrl}
        >
          <source src={about.heroMobileVideoUrl} type="video/mp4" media="(max-width: 767px)" />
          <source src={about.heroVideoUrl} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/10" />
        <p className="pointer-events-none absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 px-8 text-center font-[family-name:var(--font-gamay-editorial)] text-[30px] font-semibold leading-none tracking-normal text-white md:px-24">
          {about.heroTitle.split("\n").map((line, i, arr) => (
            <React.Fragment key={i}>
              {line}
              {i < arr.length - 1 ? <br /> : null}
            </React.Fragment>
          ))}
        </p>
        <VideoPlaybackButton className="absolute bottom-[18px] left-[18px] z-20 scale-[0.82] md:bottom-[34px] md:left-[50px] md:scale-100" />
        <VideoMuteButton className="absolute bottom-[18px] right-[18px] z-20 scale-[0.82] md:bottom-[34px] md:right-[50px] md:scale-100" />
      </section>

      <section className="flex h-[807px] flex-col items-center px-6 pt-[95px] text-center text-[#e04d26] md:h-[810px] md:justify-center md:pt-0">
        <Image src="/images/editorial/story-mark.svg" alt="The story of a childhood dream" width={184} height={201} className="h-[201px] w-auto" />
        <div className="about-story mt-[110px] max-w-[1114px] text-center text-[14px] leading-none md:mt-[70px] md:text-[22px] md:leading-[1.4]">
          {paragraphs.map((paragraph, idx) => (
            <Reveal key={idx} delay={idx * 0.1}>
              <p className={idx > 0 ? "mt-[21px] md:mt-7" : ""}>
                {paragraph.split("\n").map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < paragraph.split("\n").length - 1 ? <br /> : null}
                  </span>
                ))}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      <div className="relative h-[393px] w-full md:h-[686px]">
        <Image src={about.storyImageUrl} alt="Articut founder cutting a client’s hair" fill sizes="100vw" className="object-cover" priority />
      </div>

      <section className="h-[427px] bg-[#e04d26] px-6 py-[45px] text-[#e0e0e0] md:h-[810px] md:px-[50px] md:py-[190px]">
        <div className="mx-auto grid max-w-[1340px] gap-[40px] md:items-center md:grid-cols-[260px_minmax(0,1fr)] md:gap-[80px]">
          <Reveal>
            <h2 className="contact-heading text-center md:text-left">{about.contactTitle}</h2>
          </Reveal>
          <div className="max-w-[1000px]">
            {about.contactItems.map((item, index) => (
              <div key={index} className={index > 0 ? "mt-[38px] md:mt-[80px]" : ""}>
                <Reveal delay={0.08 + index * 0.06}>
                  <h3 className="contact-copy text-[#fab446]">{item.text}</h3>
                </Reveal>
                <Reveal delay={0.14 + index * 0.06}>
                  <a href={`mailto:${item.email}`} className="mt-[24px] inline-flex items-center gap-[0.28em] text-[12px] md:mt-[45px] md:text-[22px]">
                    {item.email}
                    <ContactArrow />
                  </a>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      <EditorialFooter />
    </div>
    </VideoLoadingGate>
  );
}
