import { apiClient } from "@/lib/api-client";
import type { CreateReviewPayload, Review } from "@/types/review";

export function getReviews() {
  return apiClient.get<Review[]>("/reviews");
}


export function createReview(payload: CreateReviewPayload) {
  return apiClient.post<Review, CreateReviewPayload>("/reviews", payload);
}
