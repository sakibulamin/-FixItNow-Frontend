import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function BookingCardSkeleton() {
  return (
    <Card className="border-l-accent/40 border-l-4 p-5">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-52" />
        </div>
        <Skeleton className="h-6 w-16" />
      </div>
    </Card>
  );
}
