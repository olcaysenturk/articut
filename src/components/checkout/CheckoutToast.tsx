"use client";

import { useEffect } from "react";

export type CheckoutToastMessage = {
  type: "success" | "error" | "warning" | "info";
  message: string;
};

const toastColors = {
  success: "border-[#2f7d5a] bg-[#edf7f2] text-[#235f45]",
  error: "border-[#c23518] bg-[#fff0eb] text-[#9f2c16]",
  warning: "border-[#b66a08] bg-[#fff7e8] text-[#7f4a08]",
  info: "border-[#34718d] bg-[#eef8fc] text-[#285c73]",
};

export function CheckoutToast({
  toast,
  onDismiss,
}: {
  toast: CheckoutToastMessage | null;
  onDismiss: () => void;
}) {
  useEffect(() => {
    if (!toast) return;

    const timeout = window.setTimeout(onDismiss, 5000);
    return () => window.clearTimeout(timeout);
  }, [onDismiss, toast]);

  if (!toast) return null;

  return (
    <div
      role={toast.type === "error" ? "alert" : "status"}
      aria-live={toast.type === "error" ? "assertive" : "polite"}
      className={`fixed bottom-[20px] left-1/2 z-[120] flex w-[calc(100%-32px)] max-w-[420px] -translate-x-1/2 items-start justify-between gap-4 border-l-[4px] px-[16px] py-[14px] text-[13px] shadow-lg sm:left-auto sm:right-[24px] sm:translate-x-0 ${toastColors[toast.type]}`}
    >
      <p className="leading-[18px]">{toast.message}</p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="h-5 w-5 shrink-0 cursor-pointer text-[20px] leading-[18px]"
      >
        ×
      </button>
    </div>
  );
}
