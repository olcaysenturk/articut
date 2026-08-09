import Image from "next/image";

export function BrandAMark({ className = "" }: { className?: string }) {
  return (
    <div className={`overflow-hidden ${className}`} aria-hidden>
      <Image
        src="/figma/articut-logo.svg"
        alt=""
        width={1685}
        height={319}
        sizes="1685px"
        className="h-full w-auto max-w-none"
      />
    </div>
  );
}
