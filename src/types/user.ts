import type { Role, UserStatus } from "@/types/enums";

/**
 * Mirrors User in user.prisma. `password` is intentionally excluded from
 * the frontend type — the backend must never return it, and the UI must
 * never render it (explicit instruction: "Do not display password field").
 */
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  profileImage: string | null;
  role: Role;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}
