import { useMutation, useQuery, type UseMutationOptions } from "@tanstack/react-query";
import { getPaymentById, initPayment } from "@/features/payments/api";
import type { ApiError } from "@/types/api";
import type { Payment, PaymentInitResponse } from "@/types/payment";

export const paymentKeys = {
  detail: (id: string) => ["payments", "detail", id] as const,
};

export function useInitPaymentMutation(
  options?: UseMutationOptions<PaymentInitResponse, ApiError, string>,
) {
  return useMutation<PaymentInitResponse, ApiError, string>({
    mutationFn: initPayment,
    ...options,
  });
}

export function usePaymentQuery(id: string | undefined) {
  return useQuery<Payment, ApiError>({
    queryKey: paymentKeys.detail(id ?? ""),
    queryFn: () => getPaymentById(id as string),
    enabled: Boolean(id),
    staleTime: 30 * 1000,
  });
}
