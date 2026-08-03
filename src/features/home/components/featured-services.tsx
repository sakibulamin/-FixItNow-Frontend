"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PackageSearch } from "lucide-react";

import { useServicesQuery } from "@/features/services/hooks";
import { ServiceCard } from "@/features/services/components/service-card";
import { ServiceCardSkeleton } from "@/components/skeletons/service-card-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Button } from "@/components/ui/button";
import { PUBLIC_ROUTES } from "@/lib/routes";

/**
 * No "featured" flag or endpoint exists on the backend — this pulls the
 * real GET /services result and shows the top 6, ranked by the offering
 * technician's averageRating where available. Nothing here is mock data.
 */
export function FeaturedServices() {
  const { data: services, isPending, isError, refetch } = useServicesQuery();

  const featured = [...(services ?? [])]
    .sort((a, b) => (b.technician?.averageRating ?? 0) - (a.technician?.averageRating ?? 0))
    .slice(0, 6);

  return (
    <section className="bg-secondary/30 border-y">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-accent font-mono text-xs tracking-wide uppercase">
              Popular right now
            </p>
            <h2 className="font-display mt-1 text-2xl font-semibold sm:text-3xl">
              Featured services
            </h2>
          </div>
          <Button variant="outline" asChild>
            <Link href={PUBLIC_ROUTES.SERVICES}>View all services</Link>
          </Button>
        </div>

        {isPending && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <ServiceCardSkeleton key={i} />
            ))}
          </div>
        )}

        {isError && (
          <ErrorState
            title="Couldn't load services"
            description="We ran into a problem loading featured services."
            onRetry={() => refetch()}
          />
        )}

        {!isPending && !isError && featured.length === 0 && (
          <EmptyState
            icon={PackageSearch}
            title="No services available yet"
            description="Check back soon — technicians are adding their services."
          />
        )}

        {!isPending && !isError && featured.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
              >
                <ServiceCard service={service} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
