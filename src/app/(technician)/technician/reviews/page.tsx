"use client";

import { Star } from "lucide-react";

import { TechnicianProfileGate } from "@/features/technicians/components/technician-profile-gate";
import { useReviewsQuery } from "@/features/reviews/hooks";
import { RatingStars } from "@/components/shared/rating-stars";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate, getInitials } from "@/lib/utils";

export default function TechnicianReviewsPage() {
  const { data: reviews, isPending, isError, refetch } = useReviewsQuery();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Reviews</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          What customers are saying about your work.
        </p>
      </div>

      <TechnicianProfileGate>
        {(profile) => {

          if (isPending) {
            return (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-xl" />
                ))}
              </div>
            );
          }

          if (isError) {
            return (
              <ErrorState
                title="Could not load reviews"
                description="Something went wrong loading your reviews."
                onRetry={() => refetch()}
              />
            );
          }

          const myReviews = (reviews ?? [])
            .filter((r) => r.technicianId === profile.id)
            .sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
            );

          if (myReviews.length === 0) {
            return (
              <EmptyState
                icon={Star}
                title="No reviews yet"
                description="Reviews from customers will appear here after completed jobs."
              />
            );
          }

          return (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <RatingStars rating={profile.averageRating} size="md" />
                <span className="text-muted-foreground text-sm">
                  ({myReviews.length} {myReviews.length === 1 ? "review" : "reviews"})
                </span>
              </div>

              {myReviews.map((review) => (
                <Card key={review.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="size-8">
                        <AvatarImage
                          src={review.customer?.profileImage ?? undefined}
                          alt={review.customer?.name ?? "Customer"}
                        />
                        <AvatarFallback>{getInitials(review.customer?.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {review.customer?.name ?? "FixItNow customer"}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {formatDate(review.createdAt)}
                        </p>
                      </div>
                    </div>
                    <RatingStars rating={review.rating} />
                  </div>
                  {review.comment && (
                    <p className="text-muted-foreground mt-3 text-sm">{review.comment}</p>
                  )}
                </Card>
              ))}
            </div>
          );
        }}
      </TechnicianProfileGate>
    </div>
  );
}
