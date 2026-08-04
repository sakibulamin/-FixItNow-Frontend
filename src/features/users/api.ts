import { apiClient } from "@/lib/api-client";
import type { User } from "@/types/user";

export interface UpdateUserPayload {
  name?: string;
  phone?: string;
  address?: string;
}

export function updateUser(id: string, payload: UpdateUserPayload) {
  return apiClient.patch<User, UpdateUserPayload>(`/users/${id}`, payload);
}
