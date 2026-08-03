"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Users } from "lucide-react";

import { useTechniciansQuery } from "@/features/technicians/hooks";
import { TechnicianCard } from "@/features/technicians/components/technician-card";
import { TechnicianCardSkeleton } from "@/components/skeletons/technician-card-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Pagination } from "@/components/shared/pagination";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePagination } from "@/hooks/use-pagination";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import type { TechnicianProfile } from "@/types/technician";

const PAGE_SIZE = 9;
type SortOption = "rating-desc" | "rate-asc" | "rate-desc" | "experience-desc";

export function TechniciansPageContent() {
  const { data, isPending, isError, refetch } = useTechniciansQuery();

  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("rating-desc");
  const debouncedQuery = useDebouncedValue(query, 300);

  const filteredAndSorted = useMemo(() => {
    let result: TechnicianProfile[] = data ?? [];

    if (debouncedQuery) {
      const q = debouncedQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.user?.name?.toLowerCase().includes(q) ||
          t.location.toLowerCase().includes(q) ||
          t.skills.some((skill) => skill.toLowerCase().includes(q)),
      );
    }

    const sorted = [...result];
    switch (sort) {
      case "rate-asc":
        sorted.sort((a, b) => a.hourlyRate - b.hourlyRate);
        break;
      case "rate-desc":
        sorted.sort((a, b) => b.hourlyRate - a.hourlyRate);
        break;
      case "experience-desc":
        sorted.sort((a, b) => b.experience - a.experience);
        break;
      case "rating-desc":
      default:
        sorted.sort((a, b) => b.averageRating - a.averageRating);
    }

    return sorted;
  }, [data, debouncedQuery, sort]);

  const { page, totalPages, paginatedItems, goToPage, resetPage } = usePagination(
    filteredAndSorted,
    PAGE_SIZE,
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold">Find a technician</h1>
        <p className="text-muted-foreground mt-1">
          Browse verified technicians by skill, location, and rating.
        </p>
      </div>

      <div className="mb-8 space-y-4">
        <div className="relative max-w-md">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              resetPage();
            }}
            placeholder="Search by name, skill, or location…"
            className="pl-9"
            aria-label="Search technicians"
          />
        </div>

        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            {filteredAndSorted.length}{" "}
            {filteredAndSorted.length === 1 ? "technician" : "technicians"} found
          </p>
          <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
            <SelectTrigger className="w-[190px]">
              <SlidersHorizontal className="size-3.5" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating-desc">Highest rated</SelectItem>
              <SelectItem value="rate-asc">Hourly rate: low to high</SelectItem>
              <SelectItem value="rate-desc">Hourly rate: high to low</SelectItem>
              <SelectItem value="experience-desc">Most experienced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isPending && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <TechnicianCardSkeleton key={i} />
          ))}
        </div>
      )}

      {isError && (
        <ErrorState
          title="Couldn't load technicians"
          description="We ran into a problem loading technicians. Please try again."
          onRetry={() => refetch()}
        />
      )}

      {!isPending && !isError && filteredAndSorted.length === 0 && (
        <EmptyState
          icon={Users}
          title="No technicians match your search"
          description="Try a different name, skill, or location."
        />
      )}

      {!isPending && !isError && paginatedItems.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedItems.map((technician, i) => (
              <motion.div
                key={technician.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
              >
                <TechnicianCard technician={technician} />
              </motion.div>
            ))}
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={goToPage}
            className="mt-10"
          />
        </>
      )}
    </div>
  );
}
