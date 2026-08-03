import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function TechnicianCardSkeleton() {
  return (
    <Card className="border-l-accent/40 border-l-4 p-5">
      <div className="flex items-center gap-3">
        <Skeleton className="size-14 shrink-0 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-8 w-24" />
      </div>
    </Card>
  );
}
