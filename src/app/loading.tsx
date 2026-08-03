import { Loader2 } from "lucide-react";

export default function RootLoading() {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-3">
      <Loader2 className="text-primary size-8 animate-spin" />
      <p className="text-muted-foreground text-sm">Loading FixItNow…</p>
    </div>
  );
}
