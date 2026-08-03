import Link from "next/link";
import { Wrench } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RatingStars } from "@/components/shared/rating-stars";
import { formatCurrency } from "@/lib/utils";
import type { Service } from "@/types/service";

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Card className="border-l-accent group overflow-hidden border-l-4 py-0 transition-shadow hover:shadow-md">
      <Link href={`/services/${service.id}`} className="block">
        <div className="from-primary/15 to-accent/20 flex h-32 items-center justify-center bg-gradient-to-br">
          <Wrench className="text-primary/40 size-10" />
        </div>
      </Link>
      <CardContent className="space-y-3 px-5 pt-4 pb-5">
        {service.category?.name && (
          <Badge variant="secondary" className="font-mono text-[10px] tracking-wide uppercase">
            {service.category.name}
          </Badge>
        )}

        <Link href={`/services/${service.id}`} className="block">
          <h3 className="font-display group-hover:text-primary line-clamp-1 font-semibold transition-colors">
            {service.title}
          </h3>
        </Link>

        <p className="text-muted-foreground line-clamp-2 text-sm">
          {service.description}
        </p>

        {service.technician && (
          <p className="text-muted-foreground text-xs">
            by{" "}
            <span className="text-foreground font-medium">
              {service.technician.user?.name ?? "FixItNow technician"}
            </span>
          </p>
        )}

        {service.technician && (
          <RatingStars rating={service.technician.averageRating} />
        )}

        <div className="flex items-center justify-between pt-1">
          <p className="font-display text-lg font-semibold">
            {formatCurrency(service.price)}
          </p>
          <Button size="sm" asChild>
            <Link href={`/services/${service.id}`}>View details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
