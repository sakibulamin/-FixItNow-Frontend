import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function ServiceCardSkeleton() {
  return (
    <Card className="border-l-accent/40 overflow-hidden border-l-4 py-0">
      <Skeleton className="h-40 w-full rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </Card>
  );
}
