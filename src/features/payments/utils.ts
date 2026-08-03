import type { Booking } from "@/types/booking";

/** How often to re-check the booking while payment confirmation is settling. */
export const PAYMENT_POLL_INTERVAL_MS = 3000;

/** Stop polling after this many attempts (~30s at the interval above). */
export const PAYMENT_POLL_MAX_ATTEMPTS = 10;

/**
 * True when a booking has been paid for at the gateway but the backend
 * hasn't yet recorded a terminal payment status — i.e. there's no payment
 * record yet, or it's still PENDING. This is what the success page polls
 * on, since SSLCommerz confirmation can arrive a moment after redirect.
 */
export function isPaymentSettling(booking: Booking | undefined): boolean {
  if (!booking) return true;
  if (!booking.payment) return true;
  return booking.payment.status === "PENDING";
}
