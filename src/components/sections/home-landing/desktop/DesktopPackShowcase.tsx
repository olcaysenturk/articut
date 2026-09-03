import Image from "next/image";
import { RibbonMarquee } from "@/components/sections/home-landing/RibbonMarquee";

const YELLOW = "#fab446";

export function DesktopPackShowcase() {
  return (
    <section
      className="relative h-dvh overflow-hidden"
      style={{ backgroundColor: YELLOW }}
      data-node-id="1:499"
    >
      <div
        className="absolute inset-0 overflow-hidden bg-[#fab446] [container-type:size]"
        style={{
          borderTop: "max(1px, 0.2083cqw) solid #e04d26",
          borderBottom: "max(1px, 0.2083cqw) solid #e04d26",
        }}
      >
        <RibbonMarquee className="absolute left-[10.5556%] top-0 h-[18.5185%] w-[78.8889%]" />
        <RibbonMarquee
          reverse
          className="absolute bottom-0 left-[10.5556%] h-[18.5185%] w-[78.8889%] rotate-180"
        />
        <div className="absolute left-0 top-[18.5185%] h-[62.963%] w-[10.5556%] overflow-hidden">
          <RibbonMarquee
            vertical
            reverse
            className="absolute left-1/2 top-1/2 h-full w-[335.5263%] -translate-x-1/2 -translate-y-1/2 rotate-90"
          />
        </div>
        <div className="absolute right-0 top-[18.5185%] h-[62.963%] w-[10.5556%] overflow-hidden">
          <RibbonMarquee
            vertical
            className="absolute left-1/2 top-1/2 h-full w-[335.5263%] -translate-x-1/2 -translate-y-1/2 rotate-90"
          />
        </div>
        <div className="absolute left-[10.5556%] top-[18.5185%] h-[62.963%] w-[78.8889%] overflow-hidden">
          <Image
            src="/figma/cutpilot-pack.png"
            alt="Cutpilot tool"
            fill
            sizes="(min-aspect-ratio: 16/9) 78.9dvh, 78.9vw"
            className="object-cover"
          />
        </div>
        <div
          className="absolute left-[10.5556%] top-0 z-10 h-full bg-[#e04d26]"
          style={{ width: "max(1px, 0.2083cqw)" }}
        />
        <div
          className="absolute right-[10.5556%] top-0 z-10 h-full bg-[#e04d26]"
          style={{ width: "max(1px, 0.2083cqw)" }}
        />
        <div
          className="absolute left-0 top-[18.5185%] z-10 w-full bg-[#e04d26]"
          style={{ height: "max(1px, 0.2083cqw)" }}
        />
        <div
          className="absolute bottom-[18.5185%] left-0 z-10 w-full bg-[#e04d26]"
          style={{ height: "max(1px, 0.2083cqw)" }}
        />
      </div>
    </section>
  );
}
