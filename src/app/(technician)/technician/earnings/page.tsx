"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { format } from "date-fns";
import { CheckCircle2, Receipt, Wallet } from "lucide-react";

import { useBookingsQuery } from "@/features/bookings/hooks";
import { StatCard } from "@/components/shared/stat-card";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";

export default function TechnicianEarningsPage() {
  const { data: bookings, isPending, isError, refetch } = useBookingsQuery();

  const { paidBookings, totalEarnings, monthly } = useMemo(() => {
    const paid = (bookings ?? []).filter((b) => b.payment?.status === "COMPLETED");
    const total = paid.reduce((sum, b) => sum + (b.payment?.amount ?? 0), 0);

    const byMonth = new Map<string, number>();
    for (const booking of paid) {
      const key = format(new Date(booking.payment?.paidAt ?? booking.createdAt), "MMM yyyy");
      byMonth.set(key, (byMonth.get(key) ?? 0) + (booking.payment?.amount ?? 0));
    }

    const chartData = Array.from(byMonth.entries()).map(([month, amount]) => ({
      month,
      amount,
    }));

    return { paidBookings: paid, totalEarnings: total, monthly: chartData };
  }, [bookings]);

  if (isPending) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Couldn't load your earnings"
        description="Something went wrong loading your booking payments."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Earnings</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {" Calculated from completed, paid bookings — there's no separate earnings endpoint, so this is derived from your booking history."}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard label="Total earnings" value={formatCurrency(totalEarnings)} icon={Wallet} />
        <StatCard
          label="Paid bookings"
          value={String(paidBookings.length)}
          icon={CheckCircle2}
        />
      </div>

      {monthly.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No earnings yet"
          description="Completed, paid bookings will show up here."
        />
      ) : (
        <Card className="p-5">
          <p className="font-display mb-4 text-sm font-semibold">Earnings by month</p>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                  stroke="var(--muted-foreground)"
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  stroke="var(--muted-foreground)"
                  tickFormatter={(value) => formatCurrency(Number(value))}
                  width={80}
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                    color: "var(--popover-foreground)",
                  }}
                />
                <Bar dataKey="amount" fill="var(--accent)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}
    </div>
  );
}
