import type { Category } from "@/types/category";
import type { TechnicianProfile } from "@/types/technician";

export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  technicianId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  technician?: TechnicianProfile;
  category?: Category;
}


export interface ServiceFilters {
  category?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
}
