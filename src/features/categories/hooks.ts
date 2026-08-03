import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
  type CategoryPayload,
} from "@/features/categories/api";
import type { ApiError } from "@/types/api";
import type { Category } from "@/types/category";

export const categoryKeys = {
  all: ["categories"] as const,
  list: () => ["categories", "list"] as const,
};

export function useCategoriesQuery() {
  return useQuery<Category[], ApiError>({
    queryKey: categoryKeys.list(),
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000, // categories change rarely
  });
}

export function useCreateCategoryMutation(
  options?: UseMutationOptions<Category, ApiError, CategoryPayload>,
) {
  const queryClient = useQueryClient();
  return useMutation<Category, ApiError, CategoryPayload>({
    mutationFn: createCategory,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.list() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

interface UpdateCategoryVariables {
  id: string;
  payload: Partial<CategoryPayload>;
}

export function useUpdateCategoryMutation(
  options?: UseMutationOptions<Category, ApiError, UpdateCategoryVariables>,
) {
  const queryClient = useQueryClient();
  return useMutation<Category, ApiError, UpdateCategoryVariables>({
    mutationFn: ({ id, payload }) => updateCategory(id, payload),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.list() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

export function useDeleteCategoryMutation(
  options?: UseMutationOptions<unknown, ApiError, string>,
) {
  const queryClient = useQueryClient();
  return useMutation<unknown, ApiError, string>({
    mutationFn: deleteCategory,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.list() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
