import { useMutation, useQuery, type UseMutationOptions } from "@tanstack/react-query";
import { getMe, login, register } from "@/features/auth/api";
import type { ApiError } from "@/types/api";
import type { AuthResponse, LoginPayload, RegisterPayload } from "@/types/auth";
import type { User } from "@/types/user";

export const authKeys = {
  me: ["auth", "me"] as const,
};

/**
 * Hydrates the current user from GET /auth/me. Disabled by default until
 * the caller (AuthProvider) confirms a token cookie exists, so we don't
 * fire an authenticated request with no token present.
 */
export function useMeQuery(enabled: boolean) {
  return useQuery<User, ApiError>({
    queryKey: authKeys.me,
    queryFn: getMe,
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useLoginMutation(
  options?: UseMutationOptions<AuthResponse, ApiError, LoginPayload>,
) {
  return useMutation<AuthResponse, ApiError, LoginPayload>({
    mutationFn: login,
    ...options,
  });
}

export function useRegisterMutation(
  options?: UseMutationOptions<User, ApiError, RegisterPayload>,
) {
  return useMutation<User, ApiError, RegisterPayload>({
    mutationFn: register,
    ...options,
  });
}
