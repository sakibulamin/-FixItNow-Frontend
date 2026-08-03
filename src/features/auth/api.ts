import { apiClient } from "@/lib/api-client";
import type { AuthResponse, LoginPayload, MeResponse, RegisterPayload } from "@/types/auth";
import type { User } from "@/types/user";

/** POST /auth/login — confirmed body: { email, password }. */
export function login(payload: LoginPayload) {
  return apiClient.post<AuthResponse, LoginPayload>("/auth/login", payload);
}

/**
 * POST /auth/register — confirmed body: { name, email, password, phone,
 * address, role }. The Postman collection does not document a response
 * body beyond the standard envelope, so this is typed as returning the
 * created User (not tokens) — registration does NOT auto-login the user.
 * If your backend does return tokens here, tell me and I'll widen this
 * type instead of guessing.
 */
export function register(payload: RegisterPayload) {
  return apiClient.post<User, RegisterPayload>("/auth/register", payload);
}

/** GET /auth/me — confirmed Bearer-authenticated current-user endpoint. */
export function getMe() {
  return apiClient.get<MeResponse>("/auth/me");
}
