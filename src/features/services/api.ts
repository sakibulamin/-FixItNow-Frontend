import { apiClient } from "@/lib/api-client";
import type { Service, ServiceFilters } from "@/types/service";

export function getServices(filters?: ServiceFilters) {
  return apiClient.get<Service[]>("/services", { params: filters });
}

/** GET /services/:id */
export function getServiceById(id: string) {
  return apiClient.get<Service>(`/services/${id}`);
}


export interface CreateServicePayload {
  title: string;
  description: string;
  price: number;
  technicianId: string;
  categoryId: string;
}

/** POST /services */
export function createService(payload: CreateServicePayload) {
  return apiClient.post<Service, CreateServicePayload>("/services", payload);
}


export interface UpdateServicePayload {
  title?: string;
  description?: string;
  price?: number;
  categoryId?: string;
}

export function updateService(id: string, payload: UpdateServicePayload) {
  return apiClient.patch<Service, UpdateServicePayload>(`/services/${id}`, payload);
}
