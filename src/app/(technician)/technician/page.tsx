"use client";

import Link from "next/link";
import { CalendarClock, CheckCircle2, Inbox, Wallet } from "lucide-react";

import { useBookingsQuery } from "@/features/bookings/hooks";
import { BookingCard } from "@/features/bookings/components/booking-card";
import { BookingCardSkeleton } from "@/components/skeletons/booking-card-skeleton";
import { StatCard } from "@/components/shared/stat-card";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { formatCurrency } from "@/lib/utils";
import { TECHNICIAN_ROUTES } from "@/lib/routes";

export default function TechnicianDashboardPage() {
  const { user } = useAuth();
  const { data: bookings, isPending, isError, refetch } = useBookingsQuery();

  const list = bookings ?? [];
  const pendingRequests = list.filter((b) => b.status === "REQUESTED");
  const upcoming = list.filter((b) => ["ACCEPTED", "PAID", "IN_PROGRESS"].includes(b.status));
  const completed = list.filter((b) => b.status === "COMPLETED");
  const earnings = list.reduce((sum, b) => {
    if (b.payment?.status === "COMPLETED") return sum + b.payment.amount;
    return sum;
  }, 0);

  const recentRequests = [...pendingRequests]
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold">
          Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Here is an overview of your jobs and requests.
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Pending requests" value={String(pendingRequests.length)} icon={Inbox} />
          <StatCard label="Upcoming jobs" value={String(upcoming.length)} icon={CalendarClock} />
          <StatCard label="Completed jobs" value={String(completed.length)} icon={CheckCircle2} />
          <StatCard label="Total earnings" value={formatCurrency(earnings)} icon={Wallet} />
        </div>
      )}

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">New booking requests</h2>
          <Button variant="outline" size="sm" asChild>
            <Link href={TECHNICIAN_ROUTES.BOOKINGS}>View all bookings</Link>
          </Button>
        </div>

        {isPending && (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <BookingCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!isPending && !isError && recentRequests.length === 0 && (
          <EmptyState icon={Inbox} title="No pending requests" description="New booking requests will show up here." />
        )}

        {!isPending && !isError && recentRequests.length > 0 && (
          <div className="space-y-3">
            {recentRequests.map((booking) => (
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
    </div>
  );
}
