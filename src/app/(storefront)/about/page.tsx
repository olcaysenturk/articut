import type { Metadata } from "next";
import Image from "next/image";
import { EditorialFooter } from "@/components/editorial/EditorialFooter";
import { EditorialHeader } from "@/components/editorial/EditorialHeader";

export const metadata: Metadata = {
  title: "About",
  description: "The story behind Articut and Cutpilot.",
};

export default function AboutPage() {
  return (
    <div className="bg-[#d9d9d9] text-black">
      <section className="relative h-[492px] bg-[#e04d26] md:h-[810px]">
        <EditorialHeader dark />
        <h1 className="about-hero-title absolute left-1/2 top-1/2 w-full max-w-[300px] -translate-x-1/2 -translate-y-1/2 px-3 text-center text-[#d9d9d9] md:max-w-[1325px] md:px-6">
          We are Articut™. An innovative company designing tools
          <br className="hidden md:block" /> that make professional-quality haircuts possible at home.
        </h1>
      </section>

      <section className="flex h-[807px] flex-col items-center px-6 pt-[95px] text-center text-[#e04d26] md:h-[810px] md:justify-center md:pt-0">
        <Image src="/images/editorial/story-mark.svg" alt="The story of a childhood dream" width={184} height={201} className="h-[201px] w-auto" />
        <div className="about-story mt-[110px] max-w-[1114px] text-[14px] leading-[1.04] md:mt-[70px] md:text-[22px]">
          <p>
            Articut™ carries a dream that’s been decades in the making. Sinan, the visionary behind Cutpilot by Articut™, grew up in a family of hairdressers. His early years were shaped by mirrors, scissors, and the constant buzz of clippers. At just 13, he and two close friends dreamed of designing and selling their own hair tool, a simple idea that never faded.
          </p>
          <p className="mt-[21px] md:mt-7">
            Decades later, the trio reunited. Sinan had become a successful hairdresser in New York. One friend helped craft the first Cutpilot prototype, while the other now manages its production at a family-run factory. What began as a childhood dream evolved into a story of real collaboration. More than thirty years on, that dream lives on in Cutpilot, the very first tool by Articut™. Rooted in experience.<br />Built with care. Designed by someone who’s lived and breathed the world of hair.
          </p>
        </div>
      </section>

      <div className="relative h-[393px] w-full md:h-[686px]">
        <Image src="/images/editorial/about-barber.png" alt="Articut founder cutting a client's hair" fill sizes="100vw" className="object-cover" priority />
      </div>

      <section className="h-[427px] bg-[#e04d26] px-6 py-[45px] text-[#e0e0e0] md:h-[810px] md:px-[50px] md:py-[190px]">
        <div className="mx-auto grid max-w-[1340px] gap-[40px] md:grid-cols-[260px_minmax(0,1fr)] md:gap-[80px]">
          <h2 className="contact-heading text-center md:text-left">Contact Us</h2>
          <div className="max-w-[1000px]">
            <h3 className="contact-copy text-[#fab446]">
              Have a question, concern, or just want to say hello? Reach out anytime — for existing orders, email us with your order number for a faster response.
            </h3>
            <a href="mailto:info@articut.com" className="mt-[24px] inline-block text-[12px] md:mt-[45px] md:text-[22px]">info@articut.com ↗</a>
            <h3 className="contact-copy mt-[38px] text-[#fab446] md:mt-[80px]">
              Looking to partner with us or collaborate on something meaningful? Let’s start a conversation.
            </h3>
            <a href="mailto:business@articut.com" className="mt-[24px] inline-block text-[12px] md:mt-[45px] md:text-[22px]">business@articut.com ↗</a>
          </div>
        </div>
      </section>

      <EditorialFooter />
    </div>
  );
}
