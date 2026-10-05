import { ArrowIcon } from "@/components/ui/ArrowIcon";

export function FooterArrowIcon({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={className ?? "footer-link-arrow ml-[0.28em] inline-flex size-[0.82em] items-center justify-center"}
    >
      <ArrowIcon className="h-auto w-full -rotate-45" />
    </span>
  );
}
