type ArrowIconProps = {
  className?: string;
  preserveAspectRatio?: string;
};

export function ArrowIcon({ className, preserveAspectRatio }: ArrowIconProps) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 16.099 22.52"
      aria-hidden="true"
      preserveAspectRatio={preserveAspectRatio}
      xmlns="http://www.w3.org/2000/svg"
      className={className ?? "footer-link-arrow ml-[0.28em] inline-block size-[24px]"}
    >
      <path
        fill="currentColor"
        d="M12.222,13.119H1.34v-1.98h10.862l-3.78-4.141h2.381l4.461,5.141l-4.461,5.121H8.421L12.222,13.119z"
      />
    </svg>
  );
}
