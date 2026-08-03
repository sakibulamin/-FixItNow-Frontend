"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, PackageSearch, Wrench } from "lucide-react";

import { useBookingQuery } from "@/features/bookings/hooks";
import { usePaymentQuery } from "@/features/payments/hooks";
import { BookingStatusTimeline } from "@/features/bookings/components/booking-status-timeline";
import { TechnicianBookingActions } from "@/features/bookings/components/technician-booking-actions";
import { StatusBadge } from "@/components/shared/status-badge";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatCurrency, formatDateTime, getInitials } from "@/lib/utils";
import { TECHNICIAN_ROUTES } from "@/lib/routes";

export default function TechnicianBookingDetailsPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = use(params);
  const { data: booking, isPending, isError, refetch } = useBookingQuery(bookingId);
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

  const effectivePayment = payment ?? booking.payment ?? null;
  const customerName = booking.customer?.name ?? "Customer";

  return (
    <div className="max-w-3xl space-y-6">
      <Link
        href={TECHNICIAN_ROUTES.BOOKINGS}
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
          <div className="mt-2 flex items-center gap-2">
            <Avatar className="size-6">
              <AvatarImage
                src={booking.customer?.profileImage ?? undefined}
                alt={customerName}
              />
              <AvatarFallback className="text-[10px]">
                {getInitials(customerName)}
              </AvatarFallback>
            </Avatar>
            <p className="text-muted-foreground text-sm">for {customerName}</p>
          </div>
        </div>

        <TechnicianBookingActions bookingId={booking.id} status={booking.status} />
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
              <p className="text-muted-foreground text-xs">Job address</p>
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
            {effectivePayment.paidAt && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Paid at</span>
                <span className="font-medium">{formatDateTime(effectivePayment.paidAt)}</span>
              </div>
            )}
          </CardContent>
        ) : (
          <p className="text-muted-foreground text-sm">
            No payment has been made for this booking yet.
          </p>
        )}
      </Card>
    </div>
  );
}
