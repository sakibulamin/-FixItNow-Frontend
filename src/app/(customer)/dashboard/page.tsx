"use client";

import Link from "next/link";
import { CalendarClock, CheckCircle2, PackageSearch, Wallet } from "lucide-react";

import { useBookingsQuery } from "@/features/bookings/hooks";
import { BookingCard } from "@/features/bookings/components/booking-card";
import { BookingCardSkeleton } from "@/components/skeletons/booking-card-skeleton";
import { StatCard } from "@/components/shared/stat-card";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { formatCurrency } from "@/lib/utils";
import { CUSTOMER_ROUTES, PUBLIC_ROUTES } from "@/lib/routes";
import type { BookingStatus } from "@/types/enums";

const ACTIVE_STATUSES: BookingStatus[] = ["REQUESTED", "ACCEPTED", "PAID", "IN_PROGRESS"];

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  const { data: bookings, isPending, isError, refetch } = useBookingsQuery();

  const list = bookings ?? [];
  const active = list.filter((b) => ACTIVE_STATUSES.includes(b.status));
  const completed = list.filter((b) => b.status === "COMPLETED");
  const totalSpent = list.reduce((sum, b) => {
    if (b.payment?.status === "COMPLETED") return sum + b.payment.amount;
    return sum;
  }, 0);

  const recentBookings = [...list]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold">
          Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Here is what is happening with your bookings.
        </p>
      </div>

      {isError && (
        <ErrorState
          title="Could not load your dashboard"
          description="We ran into a problem loading your bookings."
          onRetry={() => refetch()}
        />
      )}

      {!isError && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Active bookings" value={String(active.length)} icon={CalendarClock} />
          <StatCard label="Completed jobs" value={String(completed.length)} icon={CheckCircle2} />
          <StatCard label="Total spent" value={formatCurrency(totalSpent)} icon={Wallet} />
        </div>
      )}

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Recent bookings</h2>
          <Button variant="outline" size="sm" asChild>
            <Link href={CUSTOMER_ROUTES.BOOKINGS}>View all</Link>
          </Button>
        </div>

        {isPending && (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <BookingCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!isPending && !isError && recentBookings.length === 0 && (
          <EmptyState
            icon={PackageSearch}
            title="No bookings yet"
            description="Browse services and request your first booking."
            action={
              <Button asChild>
                <Link href={PUBLIC_ROUTES.SERVICES}>Browse services</Link>
              </Button>
            }
          />
        )}

        {!isPending && !isError && recentBookings.length > 0 && (
          <div className="space-y-3">
            {recentBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
