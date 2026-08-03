import type { Role } from "@/types/enums";
import type { User } from "@/types/user";

/** Confirmed request body for POST /auth/register. */
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  role: Role;
}

/** Confirmed request body for POST /auth/login. */
export interface LoginPayload {
  email: string;
  password: string;
}

/** Confirmed response `data` shape for POST /auth/login. */
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

/** Confirmed response `data` shape for GET /auth/me. */
export type MeResponse = User;
