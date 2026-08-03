"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, } from "recharts";
import { CalendarClock, CreditCard, DollarSign, UserCog, Users, Wrench } from "lucide-react";

import { useAdminDashboardStatsQuery } from "@/features/admin/hooks";
import { StatCard } from "@/components/shared/stat-card";
import { ErrorState } from "@/components/shared/error-state";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";

export default function AdminDashboardPage() {
  const { data: stats, isPending, isError, refetch } = useAdminDashboardStatsQuery();

  if (isPending) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <ErrorState
        title="Couldn't load platform statistics"
        description="Something went wrong loading GET /admin/dashboard."
        onRetry={() => refetch()}
      />
    );
  }

  const userBreakdown = [
    { role: "Customers", count: stats.totalCustomers },
    { role: "Technicians", count: stats.totalTechnicians },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold">Platform overview</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Global statistics across all of FixItNow.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total users" value={String(stats.totalUsers)} icon={Users} />
        <StatCard label="Customers" value={String(stats.totalCustomers)} icon={UserCog} />
        <StatCard label="Technicians" value={String(stats.totalTechnicians)} icon={Wrench} />
        <StatCard label="Total bookings" value={String(stats.totalBookings)} icon={CalendarClock} />
        <StatCard label="Total payments" value={String(stats.totalPayments)} icon={CreditCard} />
        <StatCard label="Total revenue" value={formatCurrency(stats.totalRevenue)}
          icon={DollarSign} />
      </div>

      <Card className="p-5">
        <p className="font-display mb-4 text-sm font-semibold">Customers vs. technicians</p>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={userBreakdown}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="role" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
              <YAxis tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  background: "var(--popover)", border: "1px solid var(--border)",
                   borderRadius: "var(--radius-md)",
                  color: "var(--popover-foreground)",
                }}
              />
              <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
