import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md";
  className?: string;
}

export function RatingStars({ rating, reviewCount, size = "sm", className }: RatingStarsProps) {
  const iconSize = size === "sm" ? "size-3.5" : "size-4";
  const rounded = Math.round(rating);

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              iconSize,
              i < rounded
                ? "fill-accent text-accent"
                : "fill-transparent text-muted-foreground/40",
            )}
          />
        ))}
      </div>
      <span className="text-muted-foreground text-xs">
        {rating.toFixed(1)}
        {typeof reviewCount === "number" ? ` (${reviewCount})` : ""}
      </span>
      <span className="sr-only">{rating.toFixed(1)} out of 5 stars</span>
    </div>
  );
}
