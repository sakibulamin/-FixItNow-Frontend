import { apiClient } from "@/lib/api-client";
import type {
  Booking,
  CreateBookingPayload,
  UpdateBookingStatusPayload,
} from "@/types/booking";

export function createBooking(payload: CreateBookingPayload) {
  return apiClient.post<Booking, CreateBookingPayload>("/bookings", payload);
}

export function getBookings() {
  return apiClient.get<Booking[]>("/bookings");
}

export function getBookingById(id: string) {
  return apiClient.get<Booking>(`/bookings/${id}`);
}

export function updateBookingStatus(id: string, payload: UpdateBookingStatusPayload) {
  return apiClient.put<Booking, UpdateBookingStatusPayload>(`/bookings/${id}`, payload);
}

export function deleteBooking(id: string) {
  return apiClient.delete<unknown>(`/bookings/${id}`);
}
