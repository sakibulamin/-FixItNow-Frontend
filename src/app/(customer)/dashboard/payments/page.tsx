"use client";

import Link from "next/link";
import { Wallet } from "lucide-react";

import { useBookingsQuery } from "@/features/bookings/hooks";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { CUSTOMER_ROUTES } from "@/lib/routes";

export default function CustomerPaymentsPage() {
  const { data: bookings, isPending, isError, refetch } = useBookingsQuery();

  const payments = (bookings ?? [])
    .filter((b) => Boolean(b.payment))
    .sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Payment history</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Payments are shown here once a booking has been paid for.
        </p>
      </div>

      {isPending && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      )}

      {isError && (
        <ErrorState
          title="Couldn't load your payments"
          description="We ran into a problem loading your payment history."
          onRetry={() => refetch()}
        />
      )}

      {!isPending && !isError && payments.length === 0 && (
        <EmptyState
          icon={Wallet}
          title="No payments yet"
          description="Once you pay for an accepted booking, it will show up here."
        />
      )}

      {!isPending && !isError && payments.length > 0 && (
        <div className="space-y-3">
          {payments.map((booking) => (
            <Link key={booking.id} href={CUSTOMER_ROUTES.BOOKING_DETAILS(booking.id)}>
              <Card className="border-l-accent flex flex-row items-center justify-between border-l-4 p-4 transition-shadow hover:shadow-md">
                <div>
                  <p className="font-medium">{booking.service?.title ?? "Service"}</p>
                  <p className="text-muted-foreground text-xs">
                    {booking.payment?.paidAt
                      ? formatDateTime(booking.payment.paidAt)
                      : formatDateTime(booking.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-display font-semibold">
                    {formatCurrency(booking.payment?.amount ?? 0)}
                  </p>
                  {booking.payment && <StatusBadge status={booking.payment.status} />}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
