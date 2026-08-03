"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminError({ error,reset,}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {

    console.error("Admin dashboard error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] w-full flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="bg-destructive/10 flex size-14 items-center justify-center rounded-full">
        <AlertTriangle className="text-destructive size-7" />
      </div>
      <div className="space-y-1.5">
        <h2 className="font-display text-lg font-semibold">
          Something went wrong in the admin dashboard
        </h2>
        <p className="text-muted-foreground max-w-sm text-sm">
          This section ran into a problem. Try again, or head back to the overview.
        </p>
      </div>
      <Button onClick={reset} className="gap-2">
        <RotateCcw className="size-4" />
        Try again
      </Button>
    </div>
  );
}
