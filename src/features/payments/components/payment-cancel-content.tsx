"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Ban } from "lucide-react";

import { useBookingQuery } from "@/features/bookings/hooks";
import { PayNowButton } from "@/features/payments/components/pay-now-button";
import { ErrorState } from "@/components/shared/error-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import { CUSTOMER_ROUTES } from "@/lib/routes";

export function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId") ?? undefined;
  const notifiedRef = useRef(false);

  const { data: booking, isPending, isError, refetch } = useBookingQuery(bookingId ?? "");

  useEffect(() => {
    if (!notifiedRef.current) {
      notifiedRef.current = true;
      toast.info("Payment cancelled — you weren't charged.");
    }
  }, []);

  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <div className="bg-secondary mx-auto flex size-14 items-center justify-center rounded-full">
        <Ban className="text-muted-foreground size-7" />
      </div>
      <h1 className="font-display mt-5 text-xl font-semibold">Payment cancelled</h1>
      <p className="text-muted-foreground mt-2 text-sm">
        You backed out before completing payment. Nothing was charged.
      </p>

      {bookingId && isPending && (
        <Skeleton className="mt-6 h-24 w-full rounded-xl" />
      )}

      {bookingId && isError && (
        <div className="mt-6 text-left">
          <ErrorState
            title="Couldn't load this booking"
            description="You can still find it from your bookings list."
            onRetry={() => refetch()}
          />
        </div>
      )}

      {booking && (
        <Card className="mt-6 text-left">
          <CardContent className="space-y-2 p-5">
            <p className="font-medium">{booking.service?.title ?? "Service"}</p>
            <p className="text-muted-foreground text-sm">
              {formatCurrency(booking.service?.price ?? 0)}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {booking?.status === "ACCEPTED" && <PayNowButton bookingId={booking.id} />}
        <Button variant="outline" asChild>
          <Link href={CUSTOMER_ROUTES.BOOKINGS}>Back to bookings</Link>
        </Button>
      </div>
    </div>
  );
}
