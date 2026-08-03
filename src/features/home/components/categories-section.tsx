"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LayoutGrid } from "lucide-react";

import { useCategoriesQuery } from "@/features/categories/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { PUBLIC_ROUTES } from "@/lib/routes";

export function CategoriesSection() {
  const { data: categories, isPending, isError, refetch } = useCategoriesQuery();

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-accent font-mono text-xs tracking-wide uppercase">
            Categories
          </p>
          <h2 className="font-display mt-1 text-2xl font-semibold sm:text-3xl">
            Browse by category
          </h2>
        </div>
      </div>

      {isPending && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      )}

      {isError && (
        <ErrorState
          title="Couldn't load categories"
          description="We ran into a problem loading service categories."
          onRetry={() => refetch()}
        />
      )}

      {!isPending && !isError && categories && categories.length === 0 && (
        <EmptyState
          icon={LayoutGrid}
          title="No categories yet"
          description="Service categories will show up here once they're added."
        />
      )}

      {!isPending && !isError && categories && categories.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {categories.map((category, i) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
            >
              <Link
                href={`${PUBLIC_ROUTES.SERVICES}?category=${encodeURIComponent(category.id)}`}
                className="border-border bg-card hover:border-primary/40 group flex h-24 flex-col items-center justify-center gap-2 rounded-xl border px-3 text-center transition-colors hover:shadow-sm"
              >
                <LayoutGrid className="text-primary/60 group-hover:text-primary size-5 transition-colors" />
                <span className="line-clamp-1 text-sm font-medium">
                  {category.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
