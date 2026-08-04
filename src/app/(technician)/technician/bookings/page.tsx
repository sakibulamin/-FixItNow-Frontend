"use client";

import { useMemo, useState } from "react";
import { Inbox } from "lucide-react";

import { useBookingsQuery } from "@/features/bookings/hooks";
import { BookingCard } from "@/features/bookings/components/booking-card";
import { BookingCardSkeleton } from "@/components/skeletons/booking-card-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue} from "@/components/ui/select";
import { BOOKING_STATUSES } from "@/lib/constants";
import { TECHNICIAN_ROUTES } from "@/lib/routes";
import { humanizeEnum } from "@/lib/utils";
import type { BookingStatus } from "@/types/enums";

export default function TechnicianBookingsPage() {
  const { data: bookings, isPending, isError, refetch } = useBookingsQuery();
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "ALL">("ALL");

  const filtered = useMemo(() => {
    const list = bookings ?? [];
    const scoped = statusFilter === "ALL" ? list : list.filter((b) => b.status === statusFilter);
    return [...scoped].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [bookings, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold">Bookings</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Review requests and manage jobs in progress.
          </p>
        </div>

        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
          <SelectTrigger className="w-[170px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All statuses</SelectItem>
            {Object.values(BOOKING_STATUSES).map((status) => (
              <SelectItem key={status} value={status}>
                {humanizeEnum(status)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isPending && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <BookingCardSkeleton key={i} />
          ))}
        </div>
      )}

      {isError && (
        <ErrorState
          title="Couldn't load your bookings"
          description="We ran into a problem loading your bookings. Please try again."
          onRetry={() => refetch()}
        />
      )}

      {!isPending && !isError && filtered.length === 0 && (
        <EmptyState
          icon={Inbox}
          title="No bookings found"
          description={
            statusFilter === "ALL"
              ? "You don't have any bookings yet."
              : `You don't have any ${humanizeEnum(statusFilter).toLowerCase()} bookings.`
          }
        />
      )}

      {!isPending && !isError && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              href={TECHNICIAN_ROUTES.BOOKING_DETAILS(booking.id)}
              perspective="technician"
            />
          ))}
        </div>
      )}
    </div>
  );
}
