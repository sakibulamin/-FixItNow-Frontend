import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import { updateUser, type UpdateUserPayload } from "@/features/users/api";
import { authKeys } from "@/features/auth/hooks";
import type { ApiError } from "@/types/api";
import type { User } from "@/types/user";

interface UpdateUserVariables {
  id: string;
  payload: UpdateUserPayload;
}

export function useUpdateUserMutation(
  options?: UseMutationOptions<User, ApiError, UpdateUserVariables>,
) {
  const queryClient = useQueryClient();

  return useMutation<User, ApiError, UpdateUserVariables>({
    mutationFn: ({ id, payload }) => updateUser(id, payload),
    onSuccess: (updatedUser, ...rest) => {
      queryClient.setQueryData(authKeys.me, updatedUser);
      queryClient.invalidateQueries({ queryKey: authKeys.me });
      options?.onSuccess?.(updatedUser, ...rest);
    },
    ...options,
  });
}
