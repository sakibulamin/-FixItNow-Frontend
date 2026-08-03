"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, PackageSearch, Wrench } from "lucide-react";

import { useBookingQuery } from "@/features/bookings/hooks";
import { usePaymentQuery } from "@/features/payments/hooks";
import { BookingStatusTimeline } from "@/features/bookings/components/booking-status-timeline";
import { CancelBookingButton } from "@/features/bookings/components/cancel-booking-button";
import { DeleteBookingButton } from "@/features/bookings/components/delete-booking-button";
import { PayNowButton } from "@/features/payments/components/pay-now-button";
import { ReviewFormDialog } from "@/features/reviews/components/review-form-dialog";
import { StatusBadge } from "@/components/shared/status-badge";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { CUSTOMER_ROUTES } from "@/lib/routes";
import type { BookingStatus } from "@/types/enums";

/**
 * Cancellation is only exposed for REQUESTED and ACCEPTED — i.e. before
 * any payment has been made. PAID is deliberately excluded: nothing in
 * the confirmed backend API documents a supported "cancel after payment"
 * transition, and the single PUT /bookings/:id status endpoint doesn't
 * distinguish a refund-triggering cancel from a no-op one. Exposing
 * Cancel on a PAID booking would let the UI claim a capability the
 * backend hasn't confirmed. If your backend does support this, tell me
 * and I'll widen this list.
 */
const CANCELLABLE_STATUSES: BookingStatus[] = ["REQUESTED", "ACCEPTED"];

export default function BookingDetailsPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = use(params);
  const { data: booking, isPending, isError, refetch } = useBookingQuery(bookingId);

  // GET /payments/:id takes a payment id — only call it once the booking
  // actually has a payment record with an id.
  const { data: payment } = usePaymentQuery(booking?.payment?.id);

  if (isPending) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Couldn't load this booking"
        description="This booking may not exist, or something went wrong."
        onRetry={() => refetch()}
      />
    );
  }

  if (!booking) {
    return <EmptyState icon={PackageSearch} title="Booking not found" />;
  }

  const canCancel = CANCELLABLE_STATUSES.includes(booking.status);
  const canPay = booking.status === "ACCEPTED";
  const canReview = booking.status === "COMPLETED";
  const canDelete = booking.status === "DECLINED" || booking.status === "CANCELLED";
  const effectivePayment = payment ?? booking.payment ?? null;

  return (
    <div className="max-w-3xl space-y-6">
      <Link
        href={CUSTOMER_ROUTES.BOOKINGS}
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm"
      >
        <ArrowLeft className="size-3.5" />
        Back to bookings
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-semibold">
              {booking.service?.title ?? "Booking"}
            </h1>
            <StatusBadge status={booking.status} />
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            with {booking.technician?.user?.name ?? "technician"}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {canPay && <PayNowButton bookingId={booking.id} />}
          {canReview && booking.technicianId && (
            <ReviewFormDialog
              technicianId={booking.technicianId}
              technicianName={booking.technician?.user?.name ?? "this technician"}
            />
          )}
          {canCancel && <CancelBookingButton bookingId={booking.id} />}
          {canDelete && <DeleteBookingButton bookingId={booking.id} />}
        </div>
      </div>

      <Card className="p-5">
        <p className="font-display mb-4 text-sm font-semibold">Status</p>
        <BookingStatusTimeline status={booking.status} />
      </Card>

      <Card className="p-5">
        <p className="font-display mb-4 text-sm font-semibold">Details</p>
        <CardContent className="grid gap-4 p-0 sm:grid-cols-2">
          <div className="flex items-start gap-2.5">
            <Wrench className="text-muted-foreground mt-0.5 size-4 shrink-0" />
            <div>
              <p className="text-muted-foreground text-xs">Service</p>
              <p className="text-sm font-medium">{booking.service?.title ?? "—"}</p>
              {booking.service && (
                <p className="text-muted-foreground text-xs">
                  {formatCurrency(booking.service.price)}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Calendar className="text-muted-foreground mt-0.5 size-4 shrink-0" />
            <div>
              <p className="text-muted-foreground text-xs">Scheduled for</p>
              <p className="text-sm font-medium">{formatDateTime(booking.bookingDate)}</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5 sm:col-span-2">
            <MapPin className="text-muted-foreground mt-0.5 size-4 shrink-0" />
            <div>
              <p className="text-muted-foreground text-xs">Service address</p>
              <p className="text-sm font-medium">{booking.address}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="p-5">
        <p className="font-display mb-4 text-sm font-semibold">Payment</p>
        {effectivePayment ? (
          <CardContent className="space-y-3 p-0">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Status</span>
              <StatusBadge status={effectivePayment.status} />
            </div>
            <Separator />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-medium">{formatCurrency(effectivePayment.amount)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Provider</span>
              <span className="font-medium">{effectivePayment.provider}</span>
            </div>
            {effectivePayment.transactionId && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Transaction ID</span>
                <span className="font-mono text-xs">{effectivePayment.transactionId}</span>
              </div>
            )}
            {effectivePayment.paidAt && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Paid at</span>
                <span className="font-medium">{formatDateTime(effectivePayment.paidAt)}</span>
              </div>
            )}
          </CardContent>
        ) : (
          <p className="text-muted-foreground text-sm">
            No payment has been initiated for this booking yet.
          </p>
        )}
      </Card>
    </div>
  );
}
