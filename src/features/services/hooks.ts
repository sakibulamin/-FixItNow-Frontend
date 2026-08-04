import {
  useMutation, useQuery, useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import {
  createService, getServiceById, getServices, updateService,
  type CreateServicePayload,
  type UpdateServicePayload,
} from "@/features/services/api";
import { technicianKeys } from "@/features/technicians/hooks";
import type { ApiError } from "@/types/api";
import type { Service, ServiceFilters } from "@/types/service";

export const serviceKeys = {
  all: ["services"] as const,
  list: (filters?: ServiceFilters) => ["services", "list", filters ?? {}] as const,
  detail: (id: string) => ["services", "detail", id] as const,
};

export function useServicesQuery(filters?: ServiceFilters) {
  return useQuery<Service[], ApiError>({
    queryKey: serviceKeys.list(filters),
    queryFn: () => getServices(filters),
    staleTime: 60 * 1000,
  });
}

export function useServiceQuery(id: string) {
  return useQuery<Service, ApiError>({
    queryKey: serviceKeys.detail(id),
    queryFn: () => getServiceById(id),
    enabled: Boolean(id),
    staleTime: 60 * 1000,
  });
}

export function useCreateServiceMutation(
  options?: UseMutationOptions<Service, ApiError, CreateServicePayload>,
) {
  const queryClient = useQueryClient();
  return useMutation<Service, ApiError, CreateServicePayload>({
    mutationFn: createService,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.all });
      
      queryClient.invalidateQueries({ queryKey: technicianKeys.list() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

interface UpdateServiceVariables {
  id: string;
  payload: UpdateServicePayload;
}

export function useUpdateServiceMutation(
  options?: UseMutationOptions<Service, ApiError, UpdateServiceVariables>,
) {
  const queryClient = useQueryClient();
  return useMutation<Service, ApiError, UpdateServiceVariables>({
    mutationFn: ({ id, payload }) => updateService(id, payload),
    onSuccess: (updated, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.all });
      queryClient.invalidateQueries({ queryKey: technicianKeys.list() });
      queryClient.setQueryData(serviceKeys.detail(variables.id), updated);
      options?.onSuccess?.(updated, variables, ...rest);
    },
    ...options,
  });
}
