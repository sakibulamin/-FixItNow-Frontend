import type { User } from "@/types/user";
import type { TechnicianProfile } from "@/types/technician";

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
