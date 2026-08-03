import type { Metadata } from "next";
import { Suspense } from "react";
import { ServicesPageContent } from "@/app/(public)/services/services-page-content";
import { ServiceCardSkeleton } from "@/components/skeletons/service-card-skeleton";

export const metadata: Metadata = {
  title: "Browse services",
  description: "Find and compare home services from verified technicians on FixItNow.",
};

export default function ServicesPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <ServiceCardSkeleton key={i} />
            ))}
          </div>
        </div>
      }
    >
      <ServicesPageContent />
    </Suspense>
  );
}
