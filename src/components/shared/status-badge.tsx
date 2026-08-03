import { Badge } from "@/components/ui/badge";
import { humanizeEnum } from "@/lib/utils";
import type { BookingStatus, PaymentStatus, UserStatus } from "@/types/enums";

type AnyStatus = BookingStatus | PaymentStatus | UserStatus;

const STATUS_VARIANT: Record<
  AnyStatus,
  "default" | "secondary" | "accent" | "destructive" | "success" | "outline"
> = {
  // Booking statuses
  REQUESTED: "secondary",
  ACCEPTED: "accent",
  DECLINED: "destructive",
  PAID: "accent",
  IN_PROGRESS: "default",
  COMPLETED: "success",
  CANCELLED: "destructive",
  // Payment statuses
  PENDING: "secondary",
  FAILED: "destructive",
  // UserStatus
  ACTIVE: "success",
  BLOCKED: "destructive",
};

interface StatusBadgeProps {
  status: AnyStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge variant={STATUS_VARIANT[status] ?? "secondary"} className={className}>
      {humanizeEnum(status)}
    </Badge>
  );
}
