"use client";

import { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useInitPaymentMutation } from "@/features/payments/hooks";

export function PayNowButton({ bookingId }: { bookingId: string }) {
  // Tracks the window between a successful POST /payments/init/:bookingId
  // and the actual browser navigation to the gateway — kept separate from
  // the mutation's own isPending so the button can't be double-clicked
  // during that gap (the mutation resolves before navigation completes).
  const [isRedirecting, setIsRedirecting] = useState(false);

  const initPayment = useInitPaymentMutation({
    onSuccess: (data) => {
      setIsRedirecting(true);
      window.location.href = data.paymentUrl;
    },
    onError: (error) => {
      toast.error(error.message || "Couldn't start the payment. Please try again.");
    },
  });

  const isBusy = initPayment.isPending || isRedirecting;

  return (
    <Button
      onClick={() => {
        if (isBusy) return;
        initPayment.mutate(bookingId);
      }}
      disabled={isBusy}
      className="gap-2"
    >
      {isBusy ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <CreditCard className="size-4" />
      )}
      {isBusy ? "Redirecting…" : "Pay now"}
    </Button>
  );
}
