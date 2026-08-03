"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingInputProps {
  value: number;
  onChange: (value: number) => void;
}

export function RatingInput({ value, onChange }: RatingInputProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const display = hovered ?? value;

  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
      {Array.from({ length: 5 }).map((_, i) => {
        const starValue = i + 1;
        return (
          <button
            key={starValue}
            type="button"
            role="radio"
            aria-checked={value === starValue}
            aria-label={`${starValue} star${starValue > 1 ? "s" : ""}`}
            onClick={() => onChange(starValue)}
            onMouseEnter={() => setHovered(starValue)}
            onMouseLeave={() => setHovered(null)}
            className="p-0.5"
          >
            <Star
              className={cn(
                "size-6 transition-colors",
                starValue <= display
                  ? "fill-accent text-accent"
                  : "fill-transparent text-muted-foreground/40",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
