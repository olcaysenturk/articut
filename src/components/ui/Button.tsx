import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-accent text-background hover:opacity-90",
  secondary: "bg-transparent border border-border hover:bg-surface",
  ghost: "bg-transparent hover:bg-surface",
};

export function Button({ variant = "primary", className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex cursor-pointer items-center justify-center rounded-(--radius-button) px-6 py-3 text-sm font-medium transition-colors-standard disabled:cursor-not-allowed disabled:opacity-50",
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      <span className="relative z-10 inline-flex h-full w-full items-center justify-center">{children}</span>
    </button>
  );
}
