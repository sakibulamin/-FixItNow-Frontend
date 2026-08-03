import { apiClient } from "@/lib/api-client";
import type { Category } from "@/types/category";

/** GET /categories */
export function getCategories() {
  return apiClient.get<Category[]>("/categories");
}

/** GET /categories/:id */
export function getCategoryById(id: string) {
  return apiClient.get<Category>(`/categories/${id}`);
}

export interface CategoryPayload {
  name: string;
  description?: string;
}

/** POST /categories */
export function createCategory(payload: CategoryPayload) {
  return apiClient.post<Category, CategoryPayload>("/categories", payload);
}

/** PATCH /categories/:id */
export function updateCategory(id: string, payload: Partial<CategoryPayload>) {
  return apiClient.patch<Category, Partial<CategoryPayload>>(`/categories/${id}`, payload);
}

/** DELETE /categories/:id */
export function deleteCategory(id: string) {
  return apiClient.delete<unknown>(`/categories/${id}`);
}
