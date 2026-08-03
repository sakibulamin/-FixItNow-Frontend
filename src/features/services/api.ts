import { apiClient } from "@/lib/api-client";
import type { Service, ServiceFilters } from "@/types/service";

/**
 * GET /services?category=&location=&minPrice=&maxPrice=&rating=
 * Only these five query params are confirmed against the Postman
 * collection — no `page`, `limit`, or `search` param exists on this
 * endpoint, so pagination/search are handled client-side (see
 * features/services/hooks.ts and components/service-list.tsx).
 */
export function getServices(filters?: ServiceFilters) {
  return apiClient.get<Service[]>("/services", { params: filters });
}

/** GET /services/:id */
export function getServiceById(id: string) {
  return apiClient.get<Service>(`/services/${id}`);
}

/** Confirmed request body for POST /services. */
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

/**
 * PATCH /services/:id. There is no confirmed DELETE endpoint for services
 * (implementation plan gap #6) — services can only be created and edited
 * from this UI, never deleted.
 */
export interface UpdateServicePayload {
  title?: string;
  description?: string;
  price?: number;
  categoryId?: string;
}

export function updateService(id: string, payload: UpdateServicePayload) {
  return apiClient.patch<Service, UpdateServicePayload>(`/services/${id}`, payload);
}
