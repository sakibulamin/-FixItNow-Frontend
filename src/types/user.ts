import type { Role, UserStatus } from "@/types/enums";


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
