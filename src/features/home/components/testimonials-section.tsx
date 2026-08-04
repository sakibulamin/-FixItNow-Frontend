"use client";

import { motion } from "framer-motion";
import { MessageSquareQuote, Quote } from "lucide-react";

import { useReviewsQuery } from "@/features/reviews/hooks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RatingStars } from "@/components/shared/rating-stars";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { getInitials } from "@/lib/utils";


export function TestimonialsSection() {
  const { data: reviews, isPending, isError, refetch } = useReviewsQuery();

  const testimonials = (reviews ?? [])
    .filter((r) => r.comment && r.comment.trim().length > 0)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);

  return (
    <section className="bg-secondary/30 border-y">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-accent font-mono text-xs tracking-wide uppercase">
            Real reviews
          </p>
          <h2 className="font-display mt-1 text-2xl font-semibold sm:text-3xl">
            What customers are saying
          </h2>
        </div>

        {isPending && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-xl" />
            ))}
          </div>
        )}

        {isError && (
          <ErrorState
            title="Couldn't load reviews"
            description="We ran into a problem loading customer reviews."
            onRetry={() => refetch()}
          />
        )}

        {!isPending && !isError && testimonials.length === 0 && (
          <EmptyState
            icon={MessageSquareQuote}
            title="No reviews yet"
            description="Customer reviews will appear here once bookings are completed."
          />
        )}

        {!isPending && !isError && testimonials.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className="bg-card border-border relative rounded-xl border p-5"
              >
                <Quote className="text-accent/30 absolute top-4 right-4 size-8" />
                <RatingStars rating={review.rating} />
                <p className="text-foreground/90 mt-3 line-clamp-4 text-sm">
                  {review.comment}
                </p>
                <div className="mt-4 flex items-center gap-2.5">
                  <Avatar className="size-8">
                    <AvatarImage
                      src={review.customer?.profileImage ?? undefined}
                      alt={review.customer?.name ?? "Customer"}
                    />
                    <AvatarFallback>
                      {getInitials(review.customer?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-sm font-medium">
                    {review.customer?.name ?? "FixItNow customer"}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
