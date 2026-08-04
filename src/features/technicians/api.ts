import { apiClient } from "@/lib/api-client";
import type { AvailabilitySlot, TechnicianProfile } from "@/types/technician";

/** GET /technicians */
export function getTechnicians() {
  return apiClient.get<TechnicianProfile[]>("/technicians");
}

/** GET /technicians/:id */
export function getTechnicianById(id: string) {
  return apiClient.get<TechnicianProfile>(`/technicians/${id}`);
}


export interface CreateTechnicianProfilePayload {
  userId: string;
  bio?: string;
  skills?: string[];
  experience: number;
  hourlyRate: number;
  location: string;
}

/** POST /technicians */
export function createTechnicianProfile(payload: CreateTechnicianProfilePayload) {
  return apiClient.post<TechnicianProfile, CreateTechnicianProfilePayload>(
    "/technicians",
    payload,
  );
}


export interface UpdateTechnicianProfilePayload {
  bio?: string;
  skills?: string[];
  experience?: number;
  hourlyRate?: number;
  location?: string;
  availability?: AvailabilitySlot[];
}

export function updateTechnicianProfile(
  id: string,
  payload: UpdateTechnicianProfilePayload,
) {
  return apiClient.patch<TechnicianProfile, UpdateTechnicianProfilePayload>(
    `/technicians/${id}`,
    payload,
  );
}
