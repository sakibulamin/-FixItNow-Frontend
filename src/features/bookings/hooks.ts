import {
  useMutation, useQuery, useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";
import {
  createBooking, deleteBooking, getBookingById, getBookings,
  updateBookingStatus,
} from "@/features/bookings/api";
import type { ApiError } from "@/types/api";
import type {
  Booking,
  CreateBookingPayload,
  UpdateBookingStatusPayload,
} from "@/types/booking";

export const bookingKeys = {
  all: ["bookings"] as const,
  list: () => ["bookings", "list"] as const,
  detail: (id: string) => ["bookings", "detail", id] as const,
};

export function useCreateBookingMutation(
  options?: UseMutationOptions<Booking, ApiError, CreateBookingPayload>,
) {
  const queryClient = useQueryClient();
  return useMutation<Booking, ApiError, CreateBookingPayload>({
    mutationFn: createBooking,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.list() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

export function useBookingsQuery() {
  return useQuery<Booking[], ApiError>({
    queryKey: bookingKeys.list(),
    queryFn: getBookings,
    staleTime: 30 * 1000,
  });
}

export function useBookingQuery(
  id: string,
  options?: Omit<UseQueryOptions<Booking, ApiError>, "queryKey" | "queryFn" | "enabled">,
) {
  return useQuery<Booking, ApiError>({
    queryKey: bookingKeys.detail(id),
    queryFn: () => getBookingById(id),
    enabled: Boolean(id),
    staleTime: 30 * 1000,
    ...options,
  });
}



interface UpdateStatusVariables {
  id: string;
  payload: UpdateBookingStatusPayload;
}

export function useUpdateBookingStatusMutation(
  options?: UseMutationOptions<
    Booking,
    ApiError,
    UpdateStatusVariables,
    { previousList?: Booking[]; previousDetail?: Booking }
  >,
) {
  const queryClient = useQueryClient();

  return useMutation<
    Booking,
    ApiError,
    UpdateStatusVariables,
    { previousList?: Booking[]; previousDetail?: Booking }
  >({
    mutationFn: ({ id, payload }) => updateBookingStatus(id, payload),
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: bookingKeys.list() });
      await queryClient.cancelQueries({ queryKey: bookingKeys.detail(id) });

      const previousList = queryClient.getQueryData<Booking[]>(bookingKeys.list());
      const previousDetail = queryClient.getQueryData<Booking>(bookingKeys.detail(id));

      if (previousList) {
        queryClient.setQueryData<Booking[]>(
          bookingKeys.list(),
          previousList.map((b) => (b.id === id ? { ...b, status: payload.status } : b)),
        );
      }
      if (previousDetail) {
        queryClient.setQueryData<Booking>(bookingKeys.detail(id), {
          ...previousDetail,
          status: payload.status,
        });
      }

      return { previousList, previousDetail };
    },
    onError: (_err, { id }, context) => {
      if (context?.previousList) {
        queryClient.setQueryData(bookingKeys.list(), context.previousList);
      }
      if (context?.previousDetail) {
        queryClient.setQueryData(bookingKeys.detail(id), context.previousDetail);
      }
    },
    onSettled: (_data, _err, { id }) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.list() });
      queryClient.invalidateQueries({ queryKey: bookingKeys.detail(id) });
    },
    ...options,
  });
}

export function useDeleteBookingMutation(
  options?: UseMutationOptions<unknown, ApiError, string>,
) {
  const queryClient = useQueryClient();
  return useMutation<unknown, ApiError, string>({
    mutationFn: deleteBooking,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.list() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
