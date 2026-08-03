"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, PackageSearch, Wrench } from "lucide-react";

import { useServiceQuery } from "@/features/services/hooks";
import { RatingStars } from "@/components/shared/rating-stars";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, getInitials } from "@/lib/utils";
import { PUBLIC_ROUTES } from "@/lib/routes";

export default function ServiceDetailsPage({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}) {
  const { serviceId } = use(params);
  const { data: service, isPending, isError, refetch } = useServiceQuery(serviceId);

  if (isPending) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="mt-6 h-48 w-full rounded-xl" />
        <Skeleton className="mt-4 h-6 w-2/3" />
        <Skeleton className="mt-2 h-4 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <ErrorState
          title="Couldn't load this service"
          description="This service may not exist anymore, or something went wrong."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <EmptyState icon={PackageSearch} title="Service not found" />
      </div>
    );
  }

  const technicianName = service.technician?.user?.name ?? "FixItNow technician";

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href={PUBLIC_ROUTES.SERVICES}
        className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-1.5 text-sm"
      >
        <ArrowLeft className="size-3.5" />
        Back to services
      </Link>

      <div className="from-primary/15 to-accent/20 flex h-48 items-center justify-center rounded-xl bg-gradient-to-br sm:h-64">
        <Wrench className="text-primary/40 size-16" />
      </div>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          {service.category?.name && (
            <Badge variant="secondary" className="font-mono text-[10px] tracking-wide uppercase">
              {service.category.name}
            </Badge>
          )}
          <h1 className="font-display mt-2 text-2xl font-semibold sm:text-3xl">
            {service.title}
          </h1>
        </div>
        <p className="font-display text-2xl font-semibold">
          {formatCurrency(service.price)}
        </p>
      </div>

      <p className="text-muted-foreground mt-4 leading-relaxed">{service.description}</p>

      {service.technician && (
        <Card className="border-l-accent mt-8 border-l-4">
          <CardContent className="flex flex-wrap items-center justify-between gap-4">
            <Link
              href={`/technicians/${service.technician.id}`}
              className="flex items-center gap-3"
            >
              <Avatar className="size-12">
                <AvatarImage
                  src={service.technician.user?.profileImage ?? undefined}
                  alt={technicianName}
                />
                <AvatarFallback>{getInitials(technicianName)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{technicianName}</p>
                <RatingStars rating={service.technician.averageRating} />
              </div>
            </Link>
            <Button asChild>
              <Link href={`/technicians/${service.technician.id}?service=${service.id}`}>
                Book this service
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
