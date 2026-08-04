import { apiClient } from "@/lib/api-client";
import type { Payment, PaymentInitResponse } from "@/types/payment";

/** POST /payments/init/:bookingId*/

export function initPayment(bookingId: string) {
  return apiClient.post<PaymentInitResponse>(`/payments/init/${bookingId}`);
}

/** GET /payments/:id  */
export function getPaymentById(id: string) {
  return apiClient.get<Payment>(`/payments/${id}`);
}
