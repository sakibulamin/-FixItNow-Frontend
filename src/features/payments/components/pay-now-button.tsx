"use client";

import { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useInitPaymentMutation } from "@/features/payments/hooks";

export function PayNowButton({ bookingId }: { bookingId: string }) {
 
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
