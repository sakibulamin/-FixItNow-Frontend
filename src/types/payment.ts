import type { PaymentProvider, PaymentStatus } from "@/types/enums";

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

export interface PaymentInitResponse {
  paymentUrl: string;
}
