import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  className?: string;
}

export function StatCard({ label, value, icon: Icon, className }: StatCardProps) {
  return (
    <Card className={cn("border-l-accent flex-row items-center gap-4 border-l-4 p-5", className)}>
      <div className="bg-primary/10 flex size-11 shrink-0 items-center justify-center rounded-lg">
        <Icon className="text-primary size-5" />
      </div>
      <div className="min-w-0">
        <p className="text-muted-foreground text-xs">{label}</p>
        <p className="font-display mt-0.5 truncate text-xl font-semibold">{value}</p>
      </div>
    </Card>
  );
}
