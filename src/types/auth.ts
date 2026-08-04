import type { Role } from "@/types/enums";
import type { User } from "@/types/user";


export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  role: Role;
}


export interface LoginPayload {
  email: string;
  password: string;
}


export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}


export type MeResponse = User;
