import type { PaymentProvider, PaymentStatus } from "@/types/enums";

/** Mirrors Payment in payment.prisma. */
export interface Payment {
  id: string;
  transactionId: string | null;
  bookingId: string;
  amount: number;
  method: string | null;
  provider: PaymentProvider;
  status: PaymentStatus;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Response shape confirmed from POST /payments/init/:bookingId. */
export interface PaymentInitResponse {
  paymentUrl: string;
}
