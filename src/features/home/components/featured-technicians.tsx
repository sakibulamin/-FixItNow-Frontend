"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Users } from "lucide-react";

import { useTechniciansQuery } from "@/features/technicians/hooks";
import { TechnicianCard } from "@/features/technicians/components/technician-card";
import { TechnicianCardSkeleton } from "@/components/skeletons/technician-card-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Button } from "@/components/ui/button";
import { PUBLIC_ROUTES } from "@/lib/routes";


export function FeaturedTechnicians() {
  const { data: technicians, isPending, isError, refetch } = useTechniciansQuery();

  const featured = [...(technicians ?? [])]
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, 3);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-accent font-mono text-xs tracking-wide uppercase">
            Top rated
          </p>
          <h2 className="font-display mt-1 text-2xl font-semibold sm:text-3xl">
            Featured technicians
          </h2>
        </div>
        <Button variant="outline" asChild>
          <Link href={PUBLIC_ROUTES.TECHNICIANS}>View all technicians</Link>
        </Button>
      </div>

      {isPending && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <TechnicianCardSkeleton key={i} />
          ))}
        </div>
      )}

      {isError && (
        <ErrorState
          title="Couldn't load technicians"
          description="We ran into a problem loading featured technicians."
          onRetry={() => refetch()}
        />
      )}

      {!isPending && !isError && featured.length === 0 && (
        <EmptyState
          icon={Users}
          title="No technicians yet"
          description="Verified technicians will show up here once they join."
        />
      )}

      {!isPending && !isError && featured.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((technician, i) => (
            <motion.div
              key={technician.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
            >
              <TechnicianCard technician={technician} />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
