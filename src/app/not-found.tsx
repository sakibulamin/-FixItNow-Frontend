import Link from "next/link";
import { Wrench, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] w-full flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="bg-secondary flex size-16 items-center justify-center rounded-full">
        <Wrench className="text-muted-foreground size-8" />
      </div>
      <div className="space-y-1.5">
        <p className="text-muted-foreground font-mono text-sm tracking-wide">
          404
        </p>
        <h1 className="font-display text-2xl font-semibold">
          This page isn&apos;t available
        </h1>
        <p className="text-muted-foreground max-w-sm text-sm">
          The page you&apos;re looking for may have moved or doesn&apos;t exist.
          Head back home to keep browsing services.
        </p>
      </div>
      <Button asChild className="gap-2">
        <Link href="/">
          <Home className="size-4" />
          Back to home
        </Link>
      </Button>
    </div>
  );
}
