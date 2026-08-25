import Image from "next/image";
import { RibbonMarquee } from "@/components/sections/home-landing/RibbonMarquee";

export function MobilePackShowcase() {
  return (
    <section className="absolute left-0 top-[1951px] h-[300px] w-full overflow-hidden bg-[#fab446] [container-type:size]">
      <RibbonMarquee className="absolute left-[52px] top-0 h-[52px] w-[calc(100%-104px)]" />
      <RibbonMarquee
        reverse
        className="absolute bottom-0 left-[52px] h-[52px] w-[calc(100%-104px)] rotate-180"
      />
      <div className="absolute left-0 top-[52px] h-[196px] w-[52px] overflow-hidden">
        <RibbonMarquee
          vertical
          reverse
          className="absolute left-1/2 top-1/2 h-full w-[715.3846%] -translate-x-1/2 -translate-y-1/2 rotate-90"
        />
      </div>
      <div className="absolute right-0 top-[52px] h-[196px] w-[52px] overflow-hidden">
        <RibbonMarquee
          vertical
          className="absolute left-1/2 top-1/2 h-full w-[715.3846%] -translate-x-1/2 -translate-y-1/2 rotate-90"
        />
      </div>
      <div className="absolute left-[52px] right-[52px] top-[52px] h-[196px] overflow-hidden">
        <Image
          src="/figma/cutpilot-pack-mobile.png"
          alt="Cutpilot tool"
          fill
          sizes="calc(100vw - 104px)"
          className="object-center object-cover"
        />
      </div>
      <div className="absolute left-[52px] top-0 z-10 h-full w-[2px] bg-[#e04d26]" />
      <div className="absolute right-[52px] top-0 z-10 h-full w-[2px] bg-[#e04d26]" />
      <div className="absolute left-0 top-[52px] z-10 h-[2px] w-full bg-[#e04d26]" />
      <div className="absolute bottom-[52px] left-0 z-10 h-[2px] w-full bg-[#e04d26]" />
    </section>
  );
}
