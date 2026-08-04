"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AlertTriangle, CheckCircle2, Loader2, Receipt, Wrench } from "lucide-react";

import { bookingKeys, useBookingQuery } from "@/features/bookings/hooks";
import { PayNowButton } from "@/features/payments/components/pay-now-button";
import {
  PAYMENT_POLL_INTERVAL_MS, PAYMENT_POLL_MAX_ATTEMPTS, isPaymentSettling,
} from "@/features/payments/utils";
import { ErrorState } from "@/components/shared/error-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { CUSTOMER_ROUTES, PUBLIC_ROUTES } from "@/lib/routes";
import type { Booking } from "@/types/booking";

export function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId") ?? undefined;
  const queryClient = useQueryClient();

  const notifiedRef = useRef(false);

  const {
    data: booking,
    isPending,
    isError,
    dataUpdatedAt,
    refetch,
  } = useBookingQuery(bookingId ?? "", {
    refetchInterval: (query) => {
      const data = query.state.data as Booking | undefined;

      return isPaymentSettling(data)
        ? PAYMENT_POLL_INTERVAL_MS
        : false;
    },
  });


  useEffect(() => {
    if (booking?.payment?.status === "COMPLETED" && !notifiedRef.current) {
      notifiedRef.current = true;
      toast.success("Payment confirmed!");
      queryClient.invalidateQueries({ queryKey: bookingKeys.list() });
    }
  }, [booking?.payment?.status, queryClient]);


  if (!bookingId) {
    return (
      <StatusShell
        icon={CheckCircle2}
        tone="success"
        title="Payment completed"
        description="Your payment was processed. Check your bookings for the latest status."
      >
        <Button asChild className="gap-2">
          <Link href={CUSTOMER_ROUTES.BOOKINGS}>View my bookings</Link>
        </Button>
      </StatusShell>
    );
  }

  if (isPending) {
    return (
      <div className="mx-auto max-w-md space-y-4 px-4 py-16">
        <Skeleton className="mx-auto size-14 rounded-full" />
        <Skeleton className="mx-auto h-6 w-48" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <ErrorState
          title="Could not confirm your payment"
          description="We could not load this booking to verify the payment. Check your bookings directly."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const isSettling = isPaymentSettling(booking);
  const paymentStatus = booking?.payment?.status;

  if (isSettling) {
    return (
      <StatusShell
        icon={Loader2}
        tone="pending"
        title="Confirming your payment…"
        description="This usually takes just a few seconds. Do not close this page."
        spin
      />
    );
  }

  if (paymentStatus === "COMPLETED" && booking) {
    return (
      <StatusShell
        icon={CheckCircle2}
        tone="success"
        title="Payment successful"
        description="Your booking is confirmed and paid for."
      >
        <BookingSummary booking={booking} />
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button asChild className="gap-2">
            <Link href={CUSTOMER_ROUTES.BOOKING_DETAILS(booking.id)}>
              <Receipt className="size-4" />
              View booking
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={PUBLIC_ROUTES.SERVICES}>Browse more services</Link>
          </Button>
        </div>
      </StatusShell>
    );
  }

  if (paymentStatus === "FAILED" || paymentStatus === "CANCELLED") {
    return (
      <StatusShell
        icon={AlertTriangle}
        tone="error"
        title="Payment did not go through"
        description="Your booking has not been charged. You can try paying again."
      >
        {booking && <BookingSummary booking={booking} />}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {booking?.status === "ACCEPTED" && <PayNowButton bookingId={booking.id} />}
          <Button variant="outline" asChild>
            <Link href={CUSTOMER_ROUTES.BOOKINGS}>Back to bookings</Link>
          </Button>
        </div>
      </StatusShell>
    );
  }

  return (
    <StatusShell
      icon={AlertTriangle}
      tone="pending"
      title="Still confirming your payment"
      description="This is taking longer than usual. You can check back on your booking in a moment."
    >
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Button
          variant="outline"
          onClick={() => {

            refetch();
          }}
        >
          Check again
        </Button>
        {booking && (
          <Button asChild>
            <Link href={CUSTOMER_ROUTES.BOOKING_DETAILS(booking.id)}>View booking</Link>
          </Button>
        )}
      </div>
    </StatusShell>
  );
}

function BookingSummary({ booking }: { booking: Booking }) {
  return (
    <Card className="mt-6 text-left">
      <CardContent className="space-y-3 p-5">
        <div className="flex items-center gap-2">
          <Wrench className="text-muted-foreground size-4" />
          <p className="font-medium">{booking.service?.title ?? "Service"}</p>
        </div>
        <Separator />
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Amount</span>
          <span className="font-medium">
            {formatCurrency(booking.payment?.amount ?? booking.service?.price ?? 0)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Scheduled for</span>
          <span className="font-medium">{formatDateTime(booking.bookingDate)}</span>
        </div>
        {booking.payment && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Payment status</span>
            <StatusBadge status={booking.payment.status} />
          </div>
        )}
        {booking.payment?.transactionId && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Transaction ID</span>
            <span className="font-mono text-xs">{booking.payment.transactionId}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StatusShell({
  icon: Icon,
  tone,
  title,
  description,
  spin = false,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  tone: "success" | "error" | "pending";
  title: string;
  description: string;
  spin?: boolean;
  children?: React.ReactNode;
}) {
  const toneClasses = {
    success: "bg-success/10 text-success",
    error: "bg-destructive/10 text-destructive",
    pending: "bg-accent/15 text-accent",
  }[tone];

  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <div className={`mx-auto flex size-14 items-center justify-center rounded-full ${toneClasses}`}>
        <Icon className={`size-7 ${spin ? "animate-spin" : ""}`} />
      </div>
      <h1 className="font-display mt-5 text-xl font-semibold">{title}</h1>
      <p className="text-muted-foreground mt-2 text-sm">{description}</p>
      {children}
    </div>
  );
}
