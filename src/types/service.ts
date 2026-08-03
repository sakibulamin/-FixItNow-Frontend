import type { Category } from "@/types/category";
import type { TechnicianProfile } from "@/types/technician";

/** Mirrors Service in service.prisma. */
export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  technicianId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  /** Present when the backend includes relations, per API doc: "Returns Category, Technician, User". */
  technician?: TechnicianProfile;
  category?: Category;
}

/**
 * Confirmed query params for GET /services (from the Postman example URL).
 * No `page`, `limit`, or `search` params are confirmed on this endpoint.
 */
export interface ServiceFilters {
  category?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
}
