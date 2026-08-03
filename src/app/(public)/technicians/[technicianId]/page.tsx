import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { TechnicianDetailsContent } from "@/app/(public)/technicians/[technicianId]/technician-details-content";

export default async function TechnicianDetailsPage({
  params,
}: {
  params: Promise<{ technicianId: string }>;
}) {
  const { technicianId } = await params;

  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <Skeleton className="h-64 w-full" />
        </div>
      }
    >
      <TechnicianDetailsContent technicianId={technicianId} />
    </Suspense>
  );
}
