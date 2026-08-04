"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue} from "@/components/ui/select";
import { useCategoriesQuery } from "@/features/categories/hooks";
import type { ServiceFilters as ServiceFiltersType } from "@/types/service";

export interface ServiceFilterState extends ServiceFiltersType {
  q?: string;
  sort?: "price-asc" | "price-desc" | "rating-desc" | "newest";
}

interface ServiceFiltersProps {
  filters: ServiceFilterState;
  onChange: (filters: ServiceFilterState) => void;
  resultCount: number;
}

export function ServiceFilters({ filters, onChange, resultCount }: ServiceFiltersProps) {
  const { data: categories } = useCategoriesQuery();

  function update(patch: Partial<ServiceFilterState>) {
    onChange({ ...filters, ...patch });
  }

  const hasActiveFilters =
    filters.category || filters.location || filters.minPrice || filters.maxPrice || filters.rating;

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          value={filters.q ?? ""}
          onChange={(e) => update({ q: e.target.value })}
          placeholder="Search services by title or description…"
          className="pl-9"
          aria-label="Search services"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={filters.category ?? "all"}
          onValueChange={(v) => update({ category: v === "all" ? undefined : v })}
        >
          <SelectTrigger className="w-[170px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories?.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          value={filters.location ?? ""}
          onChange={(e) => update({ location: e.target.value || undefined })}
          placeholder="Location"
          className="w-[150px]"
          aria-label="Filter by location"
        />

        <Input
          type="number"
          min={0}
          value={filters.minPrice ?? ""}
          onChange={(e) =>
            update({ minPrice: e.target.value ? Number(e.target.value) : undefined })
          }
          placeholder="Min price"
          className="w-[110px]"
          aria-label="Minimum price"
        />

        <Input
          type="number"
          min={0}
          value={filters.maxPrice ?? ""}
          onChange={(e) =>
            update({ maxPrice: e.target.value ? Number(e.target.value) : undefined })
          }
          placeholder="Max price"
          className="w-[110px]"
          aria-label="Maximum price"
        />

        <Select
          value={filters.rating?.toString() ?? "any"}
          onValueChange={(v) => update({ rating: v === "any" ? undefined : Number(v) })}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Min rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any rating</SelectItem>
            <SelectItem value="4">4+ stars</SelectItem>
            <SelectItem value="3">3+ stars</SelectItem>
            <SelectItem value="2">2+ stars</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.sort ?? "newest"}
          onValueChange={(v) => update({ sort: v as ServiceFilterState["sort"] })}
        >
          <SelectTrigger className="ml-auto w-[170px]">
            <SlidersHorizontal className="size-3.5" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price-asc">Price: low to high</SelectItem>
            <SelectItem value="price-desc">Price: high to low</SelectItem>
            <SelectItem value="rating-desc">Highest rated</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              onChange({ q: filters.q, sort: filters.sort })
            }
            className="gap-1"
          >
            <X className="size-3.5" />
            Clear filters
          </Button>
        )}
      </div>

      <p className="text-muted-foreground text-sm">
        {resultCount} {resultCount === 1 ? "service" : "services"} found
      </p>
    </div>
  );
}
