import {
  useMutation, useQuery, useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import {
  createTechnicianProfile, getTechnicianById, getTechnicians, updateTechnicianProfile,
  type CreateTechnicianProfilePayload,
  type UpdateTechnicianProfilePayload,
} from "@/features/technicians/api";
import { useAuth } from "@/providers/auth-provider";
import type { ApiError } from "@/types/api";
import type { TechnicianProfile } from "@/types/technician";

export const technicianKeys = {
  all: ["technicians"] as const,
  list: () => ["technicians", "list"] as const,
  detail: (id: string) => ["technicians", "detail", id] as const,
};

export function useTechniciansQuery() {
  return useQuery<TechnicianProfile[], ApiError>({
    queryKey: technicianKeys.list(),
    queryFn: getTechnicians,
    staleTime: 60 * 1000,
  });
}

export function useTechnicianQuery(id: string) {
  return useQuery<TechnicianProfile, ApiError>({
    queryKey: technicianKeys.detail(id),
    queryFn: () => getTechnicianById(id),
    enabled: Boolean(id),
    staleTime: 60 * 1000,
  });
}


export function useMyTechnicianProfile() {
  const { user } = useAuth();
  const query = useTechniciansQuery();

  const profile = query.data?.find((t) => t.userId === user?.id) ?? null;

  return { ...query, data: profile, hasProfile: Boolean(profile) };
}

export function useCreateTechnicianProfileMutation(
  options?: UseMutationOptions<TechnicianProfile, ApiError, CreateTechnicianProfilePayload>,
) {
  const queryClient = useQueryClient();
  return useMutation<TechnicianProfile, ApiError, CreateTechnicianProfilePayload>({
    mutationFn: createTechnicianProfile,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: technicianKeys.list() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

interface UpdateTechnicianVariables {
  id: string;
  payload: UpdateTechnicianProfilePayload;
}

export function useUpdateTechnicianProfileMutation(
  options?: UseMutationOptions<TechnicianProfile, ApiError, UpdateTechnicianVariables>,
) {
  const queryClient = useQueryClient();
  return useMutation<TechnicianProfile, ApiError, UpdateTechnicianVariables>({
    mutationFn: ({ id, payload }) => updateTechnicianProfile(id, payload),
    onSuccess: (updated, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: technicianKeys.list() });
      queryClient.setQueryData(technicianKeys.detail(variables.id), updated);
      options?.onSuccess?.(updated, variables, ...rest);
    },
    ...options,
  });
}
