import { apiClient } from "@/lib/api-client";
import type { AdminDashboardStats } from "@/types/admin";
import type { Booking } from "@/types/booking";
import type { User } from "@/types/user";
import type { UserStatus } from "@/types/enums";

/** GET /admin/dashboard — confirmed fields only, taken verbatim from the API doc. */
export function getAdminDashboardStats() {
  return apiClient.get<AdminDashboardStats>("/admin/dashboard");
}

/** GET /admin/users */
export function getAdminUsers() {
  return apiClient.get<User[]>("/admin/users");
}

/** GET /admin/bookings */
export function getAdminBookings() {
  return apiClient.get<Booking[]>("/admin/bookings");
}

export interface UpdateAdminUserStatusPayload {
  status: UserStatus;
}

/**
 * PATCH /admin/users/:id. Both `/users/:id` and `/admin/users/:id` can set
 * `status` per the Postman collection — the admin-scoped route is used
 * here exclusively for consistency with the rest of this dashboard.
 */
export function updateAdminUserStatus(id: string, payload: UpdateAdminUserStatusPayload) {
  return apiClient.patch<User, UpdateAdminUserStatusPayload>(`/admin/users/${id}`, payload);
}
