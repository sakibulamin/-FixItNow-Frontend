import {useMutation,useQuery,useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import {getAdminBookings,getAdminDashboardStats,getAdminUsers,updateAdminUserStatus,
  type UpdateAdminUserStatusPayload,
} from "@/features/admin/api";
import type { ApiError } from "@/types/api";
import type { AdminDashboardStats } from "@/types/admin";
import type { Booking } from "@/types/booking";
import type { User } from "@/types/user";

export const adminKeys = {
  dashboard: ["admin", "dashboard"] as const,
  users: ["admin", "users"] as const,
  bookings: ["admin", "bookings"] as const,
};

export function useAdminDashboardStatsQuery() {
  return useQuery<AdminDashboardStats, ApiError>({
    queryKey: adminKeys.dashboard,
    queryFn: getAdminDashboardStats,
    staleTime: 60 * 1000,
  });
}

export function useAdminUsersQuery() {
  return useQuery<User[], ApiError>({
    queryKey: adminKeys.users,
    queryFn: getAdminUsers,
    staleTime: 30 * 1000,
  });
}

export function useAdminBookingsQuery() {
  return useQuery<Booking[], ApiError>({
    queryKey: adminKeys.bookings,
    queryFn: getAdminBookings,
    staleTime: 30 * 1000,
  });
}

interface UpdateUserStatusVariables {
  id: string;
  payload: UpdateAdminUserStatusPayload;
}


export function useUpdateAdminUserStatusMutation(
  options?: UseMutationOptions<
    User,
    ApiError,
    UpdateUserStatusVariables,
    { previousUsers?: User[] }
  >,
) {
  const queryClient = useQueryClient();

  return useMutation<User, ApiError, UpdateUserStatusVariables, { previousUsers?: User[] }>({
    mutationFn: ({ id, payload }) => updateAdminUserStatus(id, payload),
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: adminKeys.users });
      const previousUsers = queryClient.getQueryData<User[]>(adminKeys.users);

      if (previousUsers) {
        queryClient.setQueryData<User[]>(
          adminKeys.users,
          previousUsers.map((u) => (u.id === id ? { ...u, status: payload.status } : u)),
        );
      }

      return { previousUsers };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(adminKeys.users, context.previousUsers);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users });
    },
    ...options,
  });
}
