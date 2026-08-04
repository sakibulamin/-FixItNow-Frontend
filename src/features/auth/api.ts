import { apiClient } from "@/lib/api-client";
import type { AuthResponse, LoginPayload, MeResponse, RegisterPayload } from "@/types/auth";
import type { User } from "@/types/user";

/** POST /auth/login — confirmed body: { email, password }. */
export function login(payload: LoginPayload) {
  return apiClient.post<AuthResponse, LoginPayload>("/auth/login", payload);
}

/** POST /auth/register — */

export function register(payload: RegisterPayload) {
  return apiClient.post<User, RegisterPayload>("/auth/register", payload);
}

/** GET /auth/me */
export function getMe() {
  return apiClient.get<MeResponse>("/auth/me");
}
