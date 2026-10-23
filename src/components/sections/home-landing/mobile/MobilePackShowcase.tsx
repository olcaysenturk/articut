import Image from "next/image";
import { RibbonMarquee } from "@/components/sections/home-landing/RibbonMarquee";

type MobilePackShowcaseProps = {
  imageAlt: string;
  imageSrc: string;
};

export function MobilePackShowcase({ imageAlt, imageSrc }: MobilePackShowcaseProps) {
  return (
    <section className="relative grid w-full grid-cols-[52px_minmax(0,1fr)_52px] grid-rows-[52px_minmax(196px,auto)_52px] overflow-hidden bg-[#fab446] [container-type:inline-size]">
      <div aria-hidden className="border-b-2 border-[#e04d26]" />
      <RibbonMarquee className="border-x-2 border-b-2 border-[#e04d26]" />
      <div aria-hidden className="border-b-2 border-[#e04d26]" />
      <div className="relative overflow-hidden">
        <RibbonMarquee
          vertical
          reverse
          className="absolute left-1/2 top-1/2 h-[52px] w-[372px] -translate-x-1/2 -translate-y-1/2 rotate-90"
        />
      </div>
      <div className="relative min-h-[196px] overflow-hidden border-x-2 border-[#e04d26]">
        <Image src={imageSrc} alt={imageAlt} fill sizes="calc(100vw - 104px)" className="object-cover object-center" />
      </div>
      <div className="relative overflow-hidden">
        <RibbonMarquee
          vertical
          className="absolute left-1/2 top-1/2 h-[52px] w-[372px] -translate-x-1/2 -translate-y-1/2 rotate-90"
        />
      </div>
      <div aria-hidden className="border-t-2 border-[#e04d26]" />
      <div className="overflow-hidden border-x-2 border-t-2 border-[#e04d26]">
        <RibbonMarquee reverse className="h-full rotate-180" />
      </div>
      <div aria-hidden className="border-t-2 border-[#e04d26]" />
    </section>
  );
}
