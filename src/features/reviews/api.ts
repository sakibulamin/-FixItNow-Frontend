import { apiClient } from "@/lib/api-client";
import type { CreateReviewPayload, Review } from "@/types/review";

/** GET /reviews — returns reviews with Customer, Technician, Rating, Comment. */
export function getReviews() {
  return apiClient.get<Review[]>("/reviews");
}

/**
 * POST /reviews — confirmed body: { customerId, technicianId, rating,
 * comment }. No bookingId field exists on this endpoint (see implementation
 * plan gap #8) — reviews aren't backend-linked to a specific booking.
 */
export function createReview(payload: CreateReviewPayload) {
  return apiClient.post<Review, CreateReviewPayload>("/reviews", payload);
}
