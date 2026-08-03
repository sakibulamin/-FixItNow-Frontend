"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
 
    console.error("Unhandled application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="bg-destructive/10 flex size-14 items-center justify-center rounded-full">
        <AlertTriangle className="text-destructive size-7" />
      </div>
      <div className="space-y-1.5">
        <h1 className="font-display text-xl font-semibold">
          Something went wrong
        </h1>
        <p className="text-muted-foreground max-w-sm text-sm">
          This page ran into a problem loading. Try again, and if it keeps
          happening, let us know what you were doing.
        </p>
      </div>
      <Button onClick={reset} className="gap-2">
        <RotateCcw className="size-4" />
        Try again
      </Button>
    </div>
  );
}
