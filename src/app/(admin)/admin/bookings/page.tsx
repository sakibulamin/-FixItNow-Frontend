"use client";

import { useMemo, useState } from "react";
import { Receipt, Search } from "lucide-react";

import { useAdminBookingsQuery } from "@/features/admin/hooks";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Pagination } from "@/components/shared/pagination";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue} from "@/components/ui/select";
import { usePagination } from "@/hooks/use-pagination";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { BOOKING_STATUSES } from "@/lib/constants";
import { formatCurrency, formatDateTime, humanizeEnum } from "@/lib/utils";
import type { BookingStatus } from "@/types/enums";

const PAGE_SIZE = 10;

export default function AdminBookingsPage() {
  const { data: bookings, isPending, isError, refetch } = useAdminBookingsQuery();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "ALL">("ALL");
  const debouncedQuery = useDebouncedValue(query, 300);

  const filtered = useMemo(() => {
    let list = bookings ?? [];

    if (statusFilter !== "ALL") {
      list = list.filter((b) => b.status === statusFilter);
    }

    if (debouncedQuery) {
      const q = debouncedQuery.toLowerCase();
      list = list.filter(
        (b) =>
          b.customer?.name?.toLowerCase().includes(q) ||
          b.technician?.user?.name?.toLowerCase().includes(q) ||
          b.service?.title?.toLowerCase().includes(q),
      );
    }

    return [...list].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [bookings, statusFilter, debouncedQuery]);

  const { page, totalPages, paginatedItems, goToPage, resetPage } = usePagination(
    filtered,
    PAGE_SIZE,
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Bookings</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Every booking across the platform.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input value={query} onChange={(e) => {
              setQuery(e.target.value);
              resetPage();
            }}
            placeholder="Search by customer, technician, or service…" className="pl-9"
            aria-label="Search bookings"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter(v as typeof statusFilter);
            resetPage();
          }}
        >
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
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      )}

      {isError && (
        <ErrorState
          title="Couldn't load bookings"
          description="Something went wrong loading GET /admin/bookings."
          onRetry={() => refetch()}
        />
      )}

      {!isPending && !isError && filtered.length === 0 && (
        <EmptyState icon={Receipt} title="No bookings found" />
      )}

      {!isPending && !isError && paginatedItems.length > 0 && (
        <>
          <div className="space-y-2">
            {paginatedItems.map((booking) => (
              <Card key={booking.id} className="border-l-accent border-l-4 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">{booking.service?.title ?? "Service"}</p>
                      <StatusBadge status={booking.status} />
                    </div>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {booking.customer?.name ?? "Customer"} →{" "}
                      {booking.technician?.user?.name ?? "Technician"}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {formatDateTime(booking.bookingDate)}
                    </p>
                  </div>
                  {booking.service && (
                    <p className="font-display shrink-0 font-semibold">
                      {formatCurrency(booking.service.price)}
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>

          <Pagination page={page} totalPages={totalPages} onPageChange={goToPage} className="mt-2" />
        </>
      )}
    </div>
  );
}
