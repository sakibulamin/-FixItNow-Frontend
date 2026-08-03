import type { User } from "@/types/user";
import type { Service } from "@/types/service";

/**
 * Shape observed in the Postman collection's availability example payload.
 * The schema only declares `availability Json?`, so this structure is
 * inferred from real request examples, not a backend-enforced contract.
 */
export interface AvailabilitySlot {
  date: string;
  startTime: string;
  endTime: string;
}

/** Mirrors TechnicianProfile in technicianProfile.prisma. */
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
  /** Present when the backend includes the relation (e.g. GET /technicians). */
  user?: User;
  services?: Service[];
}
