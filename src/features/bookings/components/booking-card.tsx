import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { CUSTOMER_ROUTES } from "@/lib/routes";
import type { Booking } from "@/types/booking";

interface BookingCardProps {
  booking: Booking;
  href?: string;
  perspective?: "customer" | "technician";
}

export function BookingCard({
  booking,
  href,
  perspective = "customer",
}: BookingCardProps) {
  const subtitle =
    perspective === "technician"
      ? `for ${booking.customer?.name ?? "customer"}`
      : `with ${booking.technician?.user?.name ?? "technician"}`;

  return (
    <Link href={href ?? CUSTOMER_ROUTES.BOOKING_DETAILS(booking.id)}>
      <Card className="border-l-accent hover:border-l-primary border-l-4 p-5 transition-colors hover:shadow-md">
        <CardContent className="flex flex-col gap-3 p-0 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-display font-semibold">
                {booking.service?.title ?? "Service"}
              </p>
              <StatusBadge status={booking.status} />
            </div>
            <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>
            <div className="text-muted-foreground mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
              <span className="flex items-center gap-1">
                <Calendar className="size-3.5" />
                {formatDateTime(booking.bookingDate)}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="size-3.5" />
                {booking.address}
              </span>
            </div>
          </div>
          {booking.service && (
            <p className="font-display shrink-0 text-lg font-semibold">
              {formatCurrency(booking.service.price)}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
