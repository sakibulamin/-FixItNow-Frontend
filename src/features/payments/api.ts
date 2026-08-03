import { apiClient } from "@/lib/api-client";
import type { Payment, PaymentInitResponse } from "@/types/payment";

/**
 * POST /payments/init/:bookingId — confirmed to return { paymentUrl }.
 * The caller is responsible for redirecting the browser to that URL.
 */
export function initPayment(bookingId: string) {
  return apiClient.post<PaymentInitResponse>(`/payments/init/${bookingId}`);
}

/** GET /payments/:id — takes a payment id, not a booking id. */
export function getPaymentById(id: string) {
  return apiClient.get<Payment>(`/payments/${id}`);
}
