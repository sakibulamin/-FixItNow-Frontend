import { apiClient } from "@/lib/api-client";
import type { AdminDashboardStats } from "@/types/admin";
import type { Booking } from "@/types/booking";
import type { User } from "@/types/user";
import type { UserStatus } from "@/types/enums";

/** GET /admin/dashboard —*/
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


export function updateAdminUserStatus(id: string, payload: UpdateAdminUserStatusPayload) {
  return apiClient.patch<User, UpdateAdminUserStatusPayload>(`/admin/users/${id}`, payload);
}
