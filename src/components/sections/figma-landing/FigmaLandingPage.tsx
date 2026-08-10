import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/commerce/AddToCartButton";
import { CartButton } from "@/components/commerce/CartButton";
import { MobileStickyHeader } from "@/components/layout/MobileStickyHeader";
import {
  FeatureSection,
  type FeatureSectionConfig,
} from "@/components/sections/features/FeatureSection";
import { HeroProductReveal } from "@/components/sections/hero/HeroProductReveal";
import { FEATURES } from "@/components/sections/hero/hero-content";
import { CutpilotPackageImage } from "@/components/sections/product/CutpilotPackageImage";
import { ProductPaymentReveal } from "@/components/sections/figma-landing/ProductPaymentReveal";
import { ScrollSnapNav } from "@/components/motion/ScrollSnapNav";
import { formatCompactMoney } from "@/features/cart/cart-utils";
import type { Product } from "@/types/shopify";

type FigmaLandingPageProps = {
  product: Product;
};

const YELLOW = "#fab446";
const GRAY = "#a5a5a5";

const CUTSCISSORS_FEATURES = [
  "Rounded safety tips",
  "Comfortable ergonomic grip",
  "Precision stainless steel blades",
];

const MOBILE_CUTPILOT_FEATURE_CONFIG: FeatureSectionConfig = {
  sectionId: "cutpilot-mobile",
  title: ["Revolutionary", "at-home", "hair cutting", "gadget"],
  titleAriaLabel: "Revolutionary at-home hair cutting gadget",
  headingLevel: 2,
  headingClassName:
    "mobile-feature-heading absolute left-1/2 top-[40px] z-10 w-[calc(100%-64px)] max-w-[329px] -translate-x-1/2",
  sectionClassName:
    "absolute left-0 top-[492px] h-[580px] w-full overflow-hidden bg-black text-white",
  productImage: {
    src: "/figma/cutpilot-product.png",
    alt: "",
    width: 398,
    height: 205,
    sizes: "398px",
    className: "absolute left-[-3px] top-[214px] w-[398px] max-w-none object-contain",
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
      "absolute left-1/2 top-[494px] h-[46px] w-[241px] -translate-x-1/2",
    backgroundClassName: "absolute inset-0 rounded-full bg-[#e04d26]",
    contentClassName:
      "pointer-events-auto absolute inset-0 flex items-center justify-center text-[12px] text-[#e0e0e0]",
  },
  detailsClassName: "z-10",
  animation: {
    animateDetails: true,
  },
};

const DESKTOP_CUTSCISSORS_FEATURE_CONFIG: FeatureSectionConfig = {
  title: ["Home-optimized", "cutting tool"],
  titleAriaLabel: "Home optimized cutting tool",
  headingLevel: 2,
  headingClassName:
    "section-two-heading absolute left-1/2 top-[52px] z-10 w-[min(1340px,92vw)] -translate-x-1/2",
  sectionClassName: "relative h-dvh overflow-hidden bg-[#e04d26] text-white",
  nodeId: "1:554",
  snapSection: true,
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
      "absolute bottom-[75px] left-1/2 h-[61px] w-[296px] -translate-x-1/2",
    backgroundClassName: "absolute inset-0 rounded-full bg-[#d9d9d9]",
    contentClassName:
      "pointer-events-auto absolute inset-0 flex items-center justify-center text-[20px] text-[#e04d26]",
  },
  animation: {
    animateHeading: true,
    animateDetails: true,
    animateProductImage: true,
  },
};

const MOBILE_CUTSCISSORS_FEATURE_CONFIG: FeatureSectionConfig = {
  sectionId: "cutscissors-mobile",
  title: ["Home optimized", "cutting tool"],
  titleAriaLabel: "Home optimized cutting tool",
  headingLevel: 2,
  headingClassName:
    "mobile-feature-heading absolute left-1/2 top-[40px] z-10 w-[calc(100%-64px)] max-w-[329px] -translate-x-1/2",
  sectionClassName:
    "absolute left-0 top-[2073px] h-[580px] w-full overflow-hidden bg-[#e04d26] text-white",
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
      "absolute left-1/2 top-[494px] h-[46px] w-[241px] -translate-x-1/2",
    backgroundClassName: "absolute inset-0 rounded-full bg-[#e04d26]",
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

function ProductCta({ product }: { product: Product }) {
  const variant = product.variants.find((item) => item.available) ?? product.variants[0];

  return (
    <div className="flex flex-col items-center gap-[12px]">
      <AddToCartButton
        variantId={variant?.id ?? null}
        quantity={1}
        disabled={!variant || !product.available}
        label={`Add to Cart    →    ${formatCompactMoney(variant?.price ?? product.price)}`}
        className="h-[61px] w-[304px] whitespace-pre bg-[#e0e0e0] px-8 text-[20px] font-normal text-[#e04d26] hover:bg-white"
      />
    </div>
  );
}

export function HeaderOverlay() {
  return (
    <header className="absolute left-0 top-0 z-30 h-[100px] w-full text-[14px] font-bold text-[#e04d26]">
      <div className="relative mx-auto h-full max-w-[1440px]">
        <Link href="/about" className="absolute left-[50px] top-[42px] leading-none">
          About
        </Link>
        <Link href="/cutpilot" className="absolute left-[163px] top-[42px] leading-none">
          Cutpilot™
        </Link>
        <Link
          href="/"
          aria-label="Articut home"
          className="absolute left-1/2 top-[30px] h-[41px] w-[215px] -translate-x-1/2"
        >
          <Image src="/figma/articut-logo.svg" alt="Articut" fill priority className="object-contain" />
        </Link>
        <CartButton className="absolute right-[50px] top-[42px] text-[14px] leading-none" />
        <button
          type="button"
          aria-label="Menu"
          className="absolute right-[50px] top-[70px] flex h-[26px] w-[30px] flex-col justify-center gap-[6px] md:hidden"
        >
          <span className="h-[3px] w-full bg-current" />
          <span className="h-[3px] w-full bg-current" />
        </button>
      </div>
    </header>
  );
}

const RIBBON_WORDS = ["set", "place", "split", "cut"];

function RibbonMarquee({
  reverse = false,
  vertical = false,
  className = "",
}: {
  reverse?: boolean;
  vertical?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none overflow-hidden text-[#e04d26] ${className}`}
    >
      <div
        className={`ribbon-marquee-track h-full ${reverse ? "ribbon-marquee-reverse" : ""} ${
          vertical ? "ribbon-marquee-vertical" : ""
        }`}
      >
        {[0, 1].map((group) => (
          <div key={group} className="ribbon-marquee-group h-full">
            {[0, 1, 2].flatMap((repeat) =>
              RIBBON_WORDS.map((word) => (
                <span key={`${repeat}-${word}`} className="contents">
                  <span>{word}</span>
                  <span className="ribbon-marquee-mark" />
                </span>
              )),
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function FooterBand() {
  return (
    <footer
      className="relative h-[690px] overflow-hidden text-[#e04d26]"
      style={{ backgroundColor: GRAY }}
      data-snap-section
    >
      <div className="absolute left-[50px] top-[63px] text-[18px] leading-[24px]">
        <Link href="/" className="block">
          Home
        </Link>
        <Link href="/cutpilot" className="block">
          Cutpilot™
        </Link>
        <Link href="/about" className="block">
          About
        </Link>
      </div>
      <div className="absolute left-[349px] top-[63px] text-[18px] leading-[24px]">
        <Link href="/faq" className="block">
          FAQ
        </Link>
        <Link href="/terms" className="block">
          Terms & Conditions
        </Link>
        <Link href="/privacy" className="block">
          Privacy Policy
        </Link>
      </div>
      <div className="absolute right-[50px] top-[63px] text-right text-[18px] leading-[24px]">
        <a href="mailto:info@articut.com" className="block">
          info@articut.com ↗
        </a>
        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="block">
          Instagram ↗
        </a>
      </div>
      <p className="absolute bottom-[48px] left-[50px] text-[18px] leading-[24px]">© 2026 Articut</p>
      <p className="absolute bottom-[48px] left-1/2 -translate-x-1/2 text-[18px] leading-[24px]">
        All rights reserved
      </p>
      <p className="absolute bottom-[48px] right-[50px] text-right text-[18px] leading-[24px]">
        Website by Artı Stüdyo
      </p>
      <p className="font-brand-wide absolute bottom-[83px] left-[50px] text-[220px] leading-[0.8] tracking-[0] md:text-[300px]">
        Articut
      </p>
    </footer>
  );
}

function MobileHomepage({ product }: { product: Product }) {
  const variant = product.variants.find((item) => item.available) ?? product.variants[0];

  return (
    <div id="mobile-home" className="relative h-[3106px] w-full overflow-hidden bg-white text-[#e04d26]">
      <MobileStickyHeader />

      <section className="absolute left-0 top-0 h-[492px] w-full overflow-hidden bg-black">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/images/hero-poster.png"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
      </section>

      <FeatureSection config={MOBILE_CUTPILOT_FEATURE_CONFIG} />

      <section id="product-mobile" className="absolute left-0 top-[1072px] h-[699px] w-full overflow-hidden">
        <CutpilotPackageImage imageClassName="scale-[1.045] object-cover" sizes="393px" />
        <ProductPaymentReveal
          button={
            <AddToCartButton
              variantId={variant?.id ?? null}
              quantity={1}
              disabled={!variant || !product.available}
              label={`Add to Cart    →    ${formatCompactMoney(variant?.price ?? product.price)}`}
              className="h-[46px] w-[241px] whitespace-pre bg-[#e0e0e0] px-4 text-[12px] font-normal text-[#e04d26] hover:bg-white"
            />
          }
          buttonClassName="absolute left-1/2 top-[583px] -translate-x-1/2"
          paymentClassName="absolute left-1/2 top-[649px] w-[241px] -translate-x-1/2"
        />
      </section>

      <section className="absolute left-0 top-[1771px] h-[302px] w-full overflow-hidden bg-[#fab446] [container-type:size]">
        <RibbonMarquee className="absolute left-[52px] top-0 h-[52px] w-[289px]" />
        <RibbonMarquee
          reverse
          className="absolute bottom-0 left-[52px] h-[52px] w-[289px] rotate-180"
        />
        <div className="absolute left-0 top-[52px] h-[198px] w-[52px] overflow-hidden">
          <RibbonMarquee
            vertical
            reverse
            className="absolute left-1/2 top-1/2 h-full w-[381%] -translate-x-1/2 -translate-y-1/2 rotate-90"
          />
        </div>
        <div className="absolute right-0 top-[52px] h-[198px] w-[52px] overflow-hidden">
          <RibbonMarquee
            vertical
            className="absolute left-1/2 top-1/2 h-full w-[381%] -translate-x-1/2 -translate-y-1/2 rotate-90"
          />
        </div>
        <div className="absolute left-[52px] top-[52px] h-[198px] w-[289px] overflow-hidden">
          <Image
            src="/figma/cutpilot-pack.png"
            alt="Cutpilot tool"
            fill
            sizes="289px"
            className="object-left object-cover"
          />
        </div>
        <div className="absolute left-[52px] top-0 z-10 h-full w-[2px] bg-[#e04d26]" />
        <div className="absolute right-[52px] top-0 z-10 h-full w-[2px] bg-[#e04d26]" />
        <div className="absolute left-0 top-[52px] z-10 h-[2px] w-full bg-[#e04d26]" />
        <div className="absolute bottom-[52px] left-0 z-10 h-[2px] w-full bg-[#e04d26]" />
      </section>

      <FeatureSection config={MOBILE_CUTSCISSORS_FEATURE_CONFIG} />

      <footer id="about-mobile" className="absolute left-0 top-[2653px] h-[453px] w-full overflow-hidden bg-[#a5a5a5] text-[#e04d26]">
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
    </div>
  );
}

export function FigmaLandingPage({ product }: FigmaLandingPageProps) {
  return (
    <>
      <div className="hidden bg-white text-[#e04d26] md:block">
      <ScrollSnapNav />
      <HeroProductReveal header={<HeaderOverlay />} />

      <section
        id="product"
        className="relative h-dvh overflow-hidden bg-white"
        data-node-id="1:538"
        data-snap-section
      >
        <CutpilotPackageImage sizes="100vw" />
        <ProductPaymentReveal
          button={<ProductCta product={product} />}
          buttonClassName="absolute bottom-20 left-1/2 -translate-x-1/2"
          paymentClassName="absolute bottom-[40px] left-1/2 w-[420px] -translate-x-1/2"
        />
      </section>

      <section
        className="relative h-dvh overflow-hidden"
        style={{ backgroundColor: YELLOW }}
        data-node-id="1:499"
        data-snap-section
      >
        <div
          className="absolute left-1/2 top-1/2 aspect-[16/9] w-[min(100%,177.7778dvh)] -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-[#fab446] [container-type:size]"
          style={{ border: "max(1px, 0.2083cqw) solid #e04d26" }}
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

      <FeatureSection config={DESKTOP_CUTSCISSORS_FEATURE_CONFIG} />

      <FooterBand />
      </div>
      <div className="md:hidden">
        <MobileHomepage product={product} />
      </div>
    </>
  );
}
