import type { Booking } from "@/types/booking";



export const PAYMENT_POLL_INTERVAL_MS = 3000;
export const PAYMENT_POLL_MAX_ATTEMPTS = 10;

export function isPaymentSettling(booking: Booking | undefined): boolean {
  if (!booking) return true;
  if (!booking.payment) return true;
  return booking.payment.status === "PENDING";
}
