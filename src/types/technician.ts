import type { User } from "@/types/user";
import type { Service } from "@/types/service";

export interface AvailabilitySlot {
  date: string;
  startTime: string;
  endTime: string;
}

export interface TechnicianProfile {
  id: string;
  userId: string;
  bio: string | null;
  skills: string[];
  experience: number;
  hourlyRate: number;
  location: string;
  averageRating: number;
  availability: AvailabilitySlot[] | null;
  createdAt: string;
  updatedAt: string;
  user?: User;
  services?: Service[];
}
