"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CUSTOMER_ROUTES } from "@/lib/routes";

export default function PaymentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
  
    console.error("Payment page error:", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <div className="bg-destructive/10 mx-auto flex size-14 items-center justify-center rounded-full">
        <AlertTriangle className="text-destructive size-7" />
      </div>
      <h1 className="font-display mt-5 text-xl font-semibold">
        Something went wrong
      </h1>
      <p className="text-muted-foreground mt-2 text-sm">
        We could not load this payment status page. Your booking and payment
        are unaffected — check your bookings directly.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Button onClick={reset} className="gap-2">
          <RotateCcw className="size-4" />
          Try again
        </Button>
        <Button variant="outline" asChild>
          <Link href={CUSTOMER_ROUTES.BOOKINGS}>Back to bookings</Link>
        </Button>
      </div>
    </div>
  );
}
