import Image from "next/image";

type BrandLoaderProps = {
  announce?: boolean;
  preload?: boolean;
};

export function BrandLoader({ announce = true, preload = false }: BrandLoaderProps) {
  return (
    <div
      role={announce ? "status" : undefined}
      aria-label={announce ? "Loading page" : undefined}
      aria-hidden={announce ? undefined : true}
      className="relative grid h-dvh w-full place-items-center overflow-hidden bg-[#fab446] text-[#e04d26]"
    >
      <div className="flex w-full flex-col items-center gap-10 px-8">
        <Image
          src="/figma/articut-logo.svg"
          alt=""
          width={430}
          height={82}
          preload={preload}
          className="brand-loader-logo h-auto w-[min(430px,72vw)]"
        />
        <div className="brand-loader-track" aria-hidden>
          <span />
        </div>
      </div>
      {announce && <span className="sr-only">Loading</span>}
    </div>
  );
}
