"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function StorefrontError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <h2>Bir şeyler ters gitti</h2>
      <p className="text-muted">Lütfen daha sonra tekrar deneyin.</p>
      <Button onClick={reset}>Tekrar dene</Button>
    </div>
  );
}
