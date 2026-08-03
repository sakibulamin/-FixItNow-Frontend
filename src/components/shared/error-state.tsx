import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Couldn't load this",
  description = "Something went wrong while fetching data. Please try again.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed px-6 py-16 text-center",
        className,
      )}
    >
      <div className="bg-destructive/10 flex size-12 items-center justify-center rounded-full">
        <AlertTriangle className="text-destructive size-6" />
      </div>
      <div className="space-y-1">
        <p className="font-display font-medium">{title}</p>
        <p className="text-muted-foreground max-w-sm text-sm">{description}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="gap-2">
          <RotateCcw className="size-3.5" />
          Try again
        </Button>
      )}
    </div>
  );
}
