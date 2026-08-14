import Image from "next/image";

export function MobilePackShowcase() {
  return (
    <section className="absolute left-0 top-[1771px] h-[476px] w-full overflow-hidden bg-[#fab446] [container-type:size]">
      <div className="absolute left-[52px] right-[52px] top-[52px] h-[372px] overflow-hidden">
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
