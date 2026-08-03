import type { User } from "@/types/user";
import type { TechnicianProfile } from "@/types/technician";

/** Mirrors Review in review.prisma. */
export interface Review {
  id: string;
  customerId: string;
  technicianId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  customer?: User;
  technician?: TechnicianProfile;
}

/**
 * Confirmed request body for POST /reviews. Note: no `bookingId` field
 * exists in the documented example — reviews aren't backend-linked to a
 * specific booking, so this type intentionally has no bookingId.
 */
export interface CreateReviewPayload {
  customerId: string;
  technicianId: string;
  rating: number;
  comment?: string;
}

export interface UpdateReviewPayload {
  rating?: number;
  comment?: string;
}
