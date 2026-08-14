import Image from "next/image";

export function MobileFooter() {
  return (
    <footer id="about-mobile" className="absolute left-0 top-[2827px] h-[453px] w-full overflow-hidden bg-[#a5a5a5] text-[#e04d26]">
      <div className="absolute left-[32px] top-[24px] w-[48px] text-[9px] leading-[24px]">
        Home
        <br />
        About
        <br />
        Cutpilot™
      </div>
      <div className="absolute left-[103px] top-[24px] w-[94px] text-[9px] leading-[24px]">
        FAQs
        <br />
        Terms & Conditions
        <br />
        Privacy Policy
      </div>
      <div className="absolute left-[267px] top-[24px] w-[94px] text-right text-[9px] leading-[24px]">
        info@articut.com ↗
        <br />
        Instagram ↗
      </div>
      <div className="absolute left-[32px] top-[125px] h-[270px] w-[329px] overflow-hidden">
        <Image
          src="/figma/articut-logo.svg"
          alt=""
          width={1600}
          height={270}
          className="h-[270px] w-[1600px] max-w-none"
        />
      </div>
      <p className="absolute bottom-[14px] left-[32px] text-[8px] leading-none">© 2026 Articut</p>
      <p className="absolute bottom-[14px] left-[102px] text-[8px] leading-none">
        All rights reserved
      </p>
      <p className="absolute bottom-[14px] right-[32px] w-[100px] text-right text-[8px] leading-none">
        Website by Artı Stüdyo
      </p>
    </footer>
  );
}
