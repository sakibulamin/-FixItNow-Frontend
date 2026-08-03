import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { Wrench } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { PaymentSuccessContent } from "@/features/payments/components/payment-success-content";
import { PUBLIC_ROUTES } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Payment status",
  robots: { index: false, follow: false },
};

export default function PaymentSuccessPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex justify-center px-6 py-6">
        <Link href={PUBLIC_ROUTES.HOME} className="flex items-center gap-2">
          <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
            <Wrench className="size-4" />
          </span>
          <span className="font-display text-lg font-semibold">FixItNow</span>
        </Link>
      </header>
      <main className="flex flex-1 items-start justify-center">
        <Suspense
          fallback={
            <div className="mx-auto max-w-md space-y-4 px-4 py-16">
              <Skeleton className="mx-auto size-14 rounded-full" />
              <Skeleton className="mx-auto h-6 w-48" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
          }
        >
          <PaymentSuccessContent />
        </Suspense>
      </main>
    </div>
  );
}
