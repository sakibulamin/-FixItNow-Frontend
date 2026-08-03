"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { PackageSearch } from "lucide-react";

import { useServicesQuery } from "@/features/services/hooks";
import { ServiceCard } from "@/features/services/components/service-card";
import {
  ServiceFilters,
  type ServiceFilterState,
} from "@/features/services/components/service-filters";
import { ServiceCardSkeleton } from "@/components/skeletons/service-card-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Pagination } from "@/components/shared/pagination";
import { usePagination } from "@/hooks/use-pagination";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import type { Service } from "@/types/service";

const PAGE_SIZE = 9;

export function ServicesPageContent() {
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<ServiceFilterState>({
    category: searchParams.get("category") ?? undefined,
    location: searchParams.get("location") ?? undefined,
    q: searchParams.get("q") ?? undefined,
    sort: "newest",
  });

  const debouncedQuery = useDebouncedValue(filters.q, 300);

  // Only the confirmed backend params are actually sent to GET /services.
  const { data, isPending, isError, refetch } = useServicesQuery({
    category: filters.category,
    location: filters.location,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    rating: filters.rating,
  });

  const filteredAndSorted = useMemo(() => {
    let result: Service[] = data ?? [];

    if (debouncedQuery) {
      const q = debouncedQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q),
      );
    }

    const sorted = [...result];
    switch (filters.sort) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "rating-desc":
        sorted.sort(
          (a, b) => (b.technician?.averageRating ?? 0) - (a.technician?.averageRating ?? 0),
        );
        break;
      case "newest":
      default:
        sorted.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
    }

    return sorted;
  }, [data, debouncedQuery, filters.sort]);

  const { page, totalPages, paginatedItems, goToPage, resetPage } = usePagination(
    filteredAndSorted,
    PAGE_SIZE,
  );

  function handleFilterChange(next: ServiceFilterState) {
    setFilters(next);
    resetPage();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold">Browse services</h1>
        <p className="text-muted-foreground mt-1">
          Find and compare services from verified technicians near you.
        </p>
      </div>

      <div className="mb-8">
        <ServiceFilters
          filters={filters}
          onChange={handleFilterChange}
          resultCount={filteredAndSorted.length}
        />
      </div>

      {isPending && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ServiceCardSkeleton key={i} />
          ))}
        </div>
      )}

      {isError && (
        <ErrorState
          title="Couldn't load services"
          description="We ran into a problem loading services. Please try again."
          onRetry={() => refetch()}
        />
      )}

      {!isPending && !isError && filteredAndSorted.length === 0 && (
        <EmptyState
          icon={PackageSearch}
          title="No services match your filters"
          description="Try adjusting your search or filters to find more services."
        />
      )}

      {!isPending && !isError && paginatedItems.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedItems.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
              >
                <ServiceCard service={service} />
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
