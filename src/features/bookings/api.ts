import { apiClient } from "@/lib/api-client";
import type {
  Booking,
  CreateBookingPayload,
  UpdateBookingStatusPayload,
} from "@/types/booking";

/**
 * POST /bookings — confirmed body: { customerId, technicianId, serviceId,
 * bookingDate, address, amount }.
 */
export function createBooking(payload: CreateBookingPayload) {
  return apiClient.post<Booking, CreateBookingPayload>("/bookings", payload);
}

/**
 * GET /bookings. No query params are confirmed on this endpoint — it's
 * assumed (standard REST/JWT pattern, not stated explicitly in the
 * Postman collection) that the backend scopes results to the
 * authenticated user's role, the same way /admin/bookings is a separate
 * endpoint for admins. If that's not how your backend behaves, tell me
 * and I'll add explicit client-side filtering instead.
 */
export function getBookings() {
  return apiClient.get<Booking[]>("/bookings");
}

/** GET /bookings/:id — includes nested customer, technician, service, payment. */
export function getBookingById(id: string) {
  return apiClient.get<Booking>(`/bookings/${id}`);
}

/** PUT /bookings/:id — the single confirmed endpoint for every status transition. */
export function updateBookingStatus(id: string, payload: UpdateBookingStatusPayload) {
  return apiClient.put<Booking, UpdateBookingStatusPayload>(`/bookings/${id}`, payload);
}

/** DELETE /bookings/:id */
export function deleteBooking(id: string) {
  return apiClient.delete<unknown>(`/bookings/${id}`);
}
