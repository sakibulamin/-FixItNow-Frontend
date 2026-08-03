import { apiClient } from "@/lib/api-client";
import type { User } from "@/types/user";

/**
 * PATCH /users/:id — restricted to the three fields you've authorized:
 * name, phone, address. Email, role, status, and password are never sent
 * from this function, regardless of what's passed in — see
 * UpdateUserPayload below, which doesn't even have fields for them.
 */
export interface UpdateUserPayload {
  name?: string;
  phone?: string;
  address?: string;
}

export function updateUser(id: string, payload: UpdateUserPayload) {
  return apiClient.patch<User, UpdateUserPayload>(`/users/${id}`, payload);
}
