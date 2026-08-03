import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { createReview, getReviews } from "@/features/reviews/api";
import type { ApiError } from "@/types/api";
import type { CreateReviewPayload, Review } from "@/types/review";

export const reviewKeys = {
  all: ["reviews"] as const,
  list: () => ["reviews", "list"] as const,
};

export function useReviewsQuery() {
  return useQuery<Review[], ApiError>({
    queryKey: reviewKeys.list(),
    queryFn: getReviews,
    staleTime: 60 * 1000,
  });
}

export function useCreateReviewMutation(
  options?: UseMutationOptions<Review, ApiError, CreateReviewPayload>,
) {
  const queryClient = useQueryClient();
  return useMutation<Review, ApiError, CreateReviewPayload>({
    mutationFn: createReview,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.list() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
