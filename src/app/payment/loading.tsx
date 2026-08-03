import { Skeleton } from "@/components/ui/skeleton";

export default function PaymentLoading() {
  return (
    <div className="mx-auto max-w-md space-y-4 px-4 py-16">
      <Skeleton className="mx-auto size-14 rounded-full" />
      <Skeleton className="mx-auto h-6 w-48" />
      <Skeleton className="h-32 w-full rounded-xl" />
    </div>
  );
}
