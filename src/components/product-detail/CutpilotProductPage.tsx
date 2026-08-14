import Image from "next/image";
import Link from "next/link";
import { CartButton } from "@/components/commerce/CartButton";
import { CombCalloutFrame } from "@/components/product-detail/CombCalloutFrame";
import { EditorialFooter } from "@/components/editorial/EditorialFooter";
import { MobileStickyHeader } from "@/components/layout/MobileStickyHeader";
import { ProductAddBadge } from "@/components/product-detail/ProductAddBadge";
import { ProductCarousel } from "@/components/product-detail/ProductCarousel";
import { ProductDetailMotion } from "@/components/product-detail/ProductDetailMotion";
import { ProductFaq } from "@/components/product-detail/ProductFaq";
import { ProductMediaStrip } from "@/components/product-detail/ProductMediaStrip";
import { ProductPurchaseCta } from "@/components/product-detail/ProductPurchaseCta";
import { StepsSection } from "@/components/product-detail/StepsSection";
import { CutpilotPackageImage } from "@/components/sections/product/CutpilotPackageImage";
import type { Product } from "@/types/shopify";

const PRODUCT_ASSET = "/images/product-detail";

const HAIR_TYPES = [
  ["Straight / Fine", "Clean, towel-dried, fully detangled"],
  ["Wavy", "Clean, 70-80% dry, combed straight"],
  ["Curly (loose 3A-3C)", "Clean, damp, detangled with wide-tooth comb"],
  ["Coily / Kinky (4A-4C)", "Usually not recommended for Cutpilot-type tools"],
  ["Thick / Coarse", "Clean, slightly damp, well-combed"],
];

const FEATURES = [
  "compatible with most hair types",
  "full control with easy-to-hold grips",
  "6 adjustable length options",
];

function ProductHeader() {
  return (
    <>
      <div className="md:hidden">
        <MobileStickyHeader />
      </div>
      <header className="absolute left-0 top-0 z-40 hidden h-[100px] w-full text-[14px] font-bold text-[#e04d26] md:block">
        <Link href="/about" className="absolute left-[50px] top-[42px] leading-none">
          About
        </Link>
        <Link href="/cutpilot" className="absolute left-[163px] top-[42px] leading-none">
          Cutpilot™
        </Link>
        <Link href="/" aria-label="Articut home" className="absolute left-1/2 top-[30px] h-[41px] w-[215px] -translate-x-1/2">
          <Image src="/figma/articut-logo.svg" alt="Articut" fill priority className="object-contain" />
        </Link>
        <CartButton className="absolute right-[50px] top-[42px] text-[14px] leading-none" />
      </header>
    </>
  );
}

function ResponsiveImage({
  src,
  alt,
  className,
  sizes = "100vw",
}: {
  src: string;
  alt: string;
  className: string;
  sizes?: string;
}) {
  return <Image src={src} alt={alt} fill sizes={sizes} className={className} />;
}

function ResponsiveVideo({ src, className }: { src: string; className: string }) {
  return (
    <video
      src={src}
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      className={`absolute inset-0 h-full w-full ${className}`}
    />
  );
}

const GALLERY_ITEMS = [
  { type: "image" as const, src: `${PRODUCT_ASSET}/gallery-left.jpg`, alt: "Cutpilot lifestyle 1" },
  { type: "video" as const, src: "/videos/gallery-video-1.mp4" },
  { type: "image" as const, src: `${PRODUCT_ASSET}/package-room.jpg`, alt: "Cutpilot lifestyle 3" },
  { type: "video" as const, src: "/videos/gallery-video-2.mp4" },
];

export function CutpilotProductPage({ product }: { product: Product }) {
  return (
    <ProductDetailMotion>
    <main className="overflow-x-clip bg-[#d9d9d9] text-[#e04d26]">
      <ProductAddBadge product={product} />
      <section data-product-hero className="relative h-[533px] overflow-hidden bg-[#a5a5a5] md:h-dvh md:min-h-[620px]">
        <ProductHeader />
        <div className="absolute inset-x-0 top-[30%] z-0 flex justify-center">
          <h1 data-hero-title className="product-hero-title text-white">
            cutpilot
          </h1>
        </div>
        <div className="absolute inset-x-0 top-[19%] z-10 flex justify-center md:top-[-4%]">
          <Image
            data-hero-product
            src={`${PRODUCT_ASSET}/hero-product.png`}
            alt="Cutpilot home hair cutting tool"
            width={2400}
            height={1688}
            priority
            sizes="100vw"
            className="w-[122vw] max-w-none shrink-0 -rotate-[20deg] md:w-[78%] md:max-w-[78%] md:-rotate-[0.8deg]"
          />
        </div>
      </section>

      <section data-intro-story className="relative h-[50svh] min-h-[340px] overflow-hidden bg-[#fab446]">
        <div data-intro-stage className="relative h-full overflow-hidden bg-[#fab446]">
          <div data-intro-secondary className="absolute inset-0 z-0 flex items-center justify-center bg-[#e04d26] px-8 py-[58px] text-center text-[#fab446] md:py-10">
            <p className="max-w-[680px] text-[16px] font-medium leading-[1.08] md:max-w-[62vw] md:text-[clamp(14px,1.15vw,22px)] xl:max-w-[1160px]">
              Designed to follow the natural contours of any head shape, it lets you effortlessly select and trim to precise lengths from ½ inch to 3 inches. No guesswork, no mess. Perfect for busy moms keeping the kids&apos; hair neat and tidy between appointments, or roommates sharing quick, professional-looking touch-ups without the hassle. Save time, money, and trips out. Get salon-quality results right at home!
            </p>
          </div>
          {["left", "right"].map((side) => (
            <div
              key={side}
              data-intro-primary-half={side}
              aria-hidden="true"
              style={{
                clipPath:
                  side === "left"
                    ? "polygon(0% 0%, 59% 0%, 43% 100%, 0% 100%)"
                    : "polygon(59% 0%, 100% 0%, 100% 100%, 43% 100%)",
              }}
              className="absolute inset-0 z-10 flex items-center justify-center bg-[#fab446] px-8 py-[58px] text-center text-[#d9d9d9] md:py-10"
            >
              <p className="max-w-[760px] text-[16px] font-semibold leading-[1.08] md:text-[clamp(16px,1.25vw,24px)]">
                Tired of pricey salon trips or uneven DIY cuts?<br />Our innovative home hair cutting tool is your new best friend!
              </p>
            </div>
          ))}
          <p className="sr-only">
            Tired of pricey salon trips or uneven DIY cuts? Our innovative home hair cutting tool is your new best friend!
          </p>
        </div>
      </section>

      <div data-scroll-snap-ignore>
        <ProductCarousel />
      </div>

      <StepsSection />

      <section className="relative h-[calc(100svh-62px)] overflow-hidden md:h-[calc(100svh-100px)] md:min-h-[650px]">
        <CutpilotPackageImage src={`${PRODUCT_ASSET}/package-room.jpg`} alt="Cutpilot product packaging" sizes="100vw" />
        <div className="absolute inset-x-0 bottom-[34px] md:bottom-[36px]">
          <ProductPurchaseCta product={product} />
        </div>
      </section>

      <section data-product-reveal data-scroll-snap-ignore className="grid h-[350px] grid-cols-2 border-y-[3px] border-[#e04d26] md:h-[calc(100svh-100px)] md:min-h-[650px]">
        <div className="relative overflow-hidden border-r-[3px] border-[#e04d26]">
          <ResponsiveImage src={`${PRODUCT_ASSET}/gallery-left.jpg`} alt="Cutpilot package held above a model" sizes="50vw" className="object-cover" />
        </div>
        <div className="relative overflow-hidden">
          <ResponsiveImage src={`${PRODUCT_ASSET}/gallery-right.jpg`} alt="Open Cutpilot package" sizes="50vw" className="object-cover" />
        </div>
      </section>

      <section data-product-reveal data-scroll-snap-ignore className="relative h-[221px] overflow-hidden border-b-[3px] border-[#e04d26] md:h-[calc(100svh-100px)] md:min-h-[650px]">
        <ResponsiveImage src={`${PRODUCT_ASSET}/package-table.jpg`} alt="Cutpilot components" className="object-cover" />
      </section>

      <section data-comb-callout-section data-scroll-snap-ignore className="bg-[#d9d9d9] px-8 py-8 md:px-[50px] md:py-[50px]">
        <div className="relative mx-auto min-h-[519px] max-w-[1339px] overflow-hidden border-[3px] border-[#e04d26] md:min-h-[710px]">
          <div data-comb-frame className="relative mx-auto mt-6 h-[132px] w-[290px] md:mt-[80px] md:h-[315px] md:w-[695px]">
            <CombCalloutFrame />
            <div data-comb-frame-text className="absolute inset-0 flex items-center justify-center px-8 text-center text-[14px] font-semibold leading-[1.05] text-[#e04d26] md:text-[22px]">
              A couple of extra combs,<br />if you prefer a right-hand Cutpilot grip
            </div>
          </div>
          <div data-comb-stage className="relative mx-auto mt-4 h-[328px] w-full max-w-[1180px] md:mt-[40px] md:h-[340px]">
            <Image data-comb-left src={`${PRODUCT_ASSET}/comb-left.png`} alt="Cutpilot comb attachment" width={1800} height={935} className="absolute left-[31px] top-0 w-[86%] rotate-180 object-contain md:left-0 md:w-[52%]" />
            <Image data-comb-right src={`${PRODUCT_ASSET}/comb-right.png`} alt="Cutpilot reverse comb attachment" width={1800} height={790} className="absolute left-[31px] top-[164px] w-[86%] rotate-180 object-contain md:left-auto md:right-0 md:top-[48px] md:w-[52%]" />
          </div>
        </div>
      </section>

      <section data-product-reveal data-scroll-snap-ignore className="bg-[#e04d26] px-[30px] py-[31px] md:px-[50px] md:py-[50px]">
        <div className="mx-auto max-w-[1343px] border-x-[3px] border-t-[3px] border-[#fab446] text-[#fab446]">
          <div className="grid min-h-[76px] grid-cols-2 border-b-[3px] border-[#fab446] bg-[#fab446] text-[14px] font-semibold leading-[1.05] text-[#e04d26] md:min-h-[108px] md:text-[30px]">
            <div className="flex items-center border-r-[3px] border-[#e04d26] px-2 md:justify-center md:border-[#fab446]">Hair Type</div>
            <div className="flex items-center px-2 md:justify-center md:px-3 md:text-center">Best State for Using Cutpilot</div>
          </div>
          {HAIR_TYPES.map(([type, state]) => (
            <div key={type} className="grid min-h-[73px] grid-cols-2 border-b-[3px] border-[#fab446] text-[15px] leading-[1.05] md:min-h-[108px] md:text-[22px]">
              <div className="flex items-center border-r-[3px] border-[#fab446] px-2 md:justify-center md:px-3 md:text-center">{type}</div>
              <div className="flex items-center px-2 md:justify-center md:px-3 md:text-center">{state}</div>
            </div>
          ))}
        </div>
      </section>

      <section data-feature-overlay-section data-scroll-snap-ignore className="relative h-[2200px] overflow-visible text-white">
        <div className="sticky top-15.5 h-[calc(100svh-62px)] overflow-hidden md:top-0 md:h-[calc(100vh)]">
          {/* eslint-disable-next-line @next/next/no-img-element -- plain img avoids Next's image optimizer, which deadlocks under this sticky section on high-DPR mobile */}
          <img src={`${PRODUCT_ASSET}/in-use.jpg`} alt="Cutpilot in use" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[#e04d26]/10" />
          <div data-feature-overlay-panel className="pointer-events-none absolute left-0 top-1/2 z-10 h-75 w-full -translate-y-1/2 overflow-hidden text-center text-[14px] font-semibold md:h-[360px] md:text-[30px]">
            <div data-feature-overlay-track className="absolute left-0 top-0 flex w-full flex-col items-center gap-[90px]">
              {FEATURES.map((feature) => (
                <p data-feature-overlay-item key={feature} className="flex shrink-0 items-center justify-center px-6 opacity-0 text-xl">
                  {feature}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div data-scroll-snap-ignore>
        <ProductFaq />
      </div>

      <ProductMediaStrip>
        {GALLERY_ITEMS.map((item) => (
          <div
            key={item.src}
            className="relative w-[165px] shrink-0 snap-start overflow-hidden border-r-[3px] border-[#e04d26] last:border-r-0 md:w-auto md:shrink md:snap-align-none"
          >
            {item.type === "image" ? (
              <ResponsiveImage src={item.src} alt={item.alt} sizes="(max-width: 767px) 165px, 25vw" className="object-cover" />
            ) : (
              <ResponsiveVideo src={item.src} className="object-cover" />
            )}
          </div>
        ))}
      </ProductMediaStrip>

      <div data-scroll-snap-ignore>
        <EditorialFooter />
      </div>
    </main>
    </ProductDetailMotion>
  );
}
