import { apiClient } from "@/lib/api-client";
import type { AvailabilitySlot, TechnicianProfile } from "@/types/technician";

/** GET /technicians — confirmed to return technician profiles with User + Services relations. */
export function getTechnicians() {
  return apiClient.get<TechnicianProfile[]>("/technicians");
}

/** GET /technicians/:id */
export function getTechnicianById(id: string) {
  return apiClient.get<TechnicianProfile>(`/technicians/${id}`);
}

/** Confirmed request body for POST /technicians (create a technician profile). */
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

/**
 * PATCH /technicians/:id. `availability` is included here since the schema
 * models it as a plain `Json?` field on TechnicianProfile and there is no
 * separate availability endpoint (see implementation plan gap #4) — this
 * is the only confirmed way to persist it.
 */
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
