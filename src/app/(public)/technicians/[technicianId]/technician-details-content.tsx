"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MapPin, Star, User as UserIcon, Wrench } from "lucide-react";

import { useTechnicianQuery } from "@/features/technicians/hooks";
import { useReviewsQuery } from "@/features/reviews/hooks";
import { ServiceCard } from "@/features/services/components/service-card";
import { BookingRequestDialog } from "@/features/bookings/components/booking-request-dialog";
import { RatingStars } from "@/components/shared/rating-stars";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatDate, getInitials } from "@/lib/utils";
import { PUBLIC_ROUTES } from "@/lib/routes";

export function TechnicianDetailsContent({ technicianId }: { technicianId: string }) {
  const searchParams = useSearchParams();
  const defaultServiceId = searchParams.get("service") ?? undefined;

  const {
    data: technician,
    isPending,
    isError,
    refetch,
  } = useTechnicianQuery(technicianId);
  const { data: reviews } = useReviewsQuery();

  if (isPending) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Skeleton className="h-8 w-40" />
        <div className="mt-6 flex items-center gap-4">
          <Skeleton className="size-20 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="mt-8 h-24 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <ErrorState
          title="Couldn't load this technician"
          description="This profile may not exist anymore, or something went wrong."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (!technician) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <EmptyState icon={UserIcon} title="Technician not found" />
      </div>
    );
  }

  const name = technician.user?.name ?? "FixItNow technician";
  const image = technician.user?.profileImage;
  const services = technician.services ?? [];
  const technicianReviews = (reviews ?? [])
    .filter((r) => r.technicianId === technician.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href={PUBLIC_ROUTES.TECHNICIANS}
        className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-1.5 text-sm"
      >
        <ArrowLeft className="size-3.5" />
        Back to technicians
      </Link>

      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <Avatar className="size-20">
            {image ? (
              <Image
                src={image}
                alt={name}
                width={80}
                height={80}
                className="aspect-square size-full object-cover"
              />
            ) : (
              <AvatarImage src={undefined} alt={name} />
            )}
            <AvatarFallback className="text-xl">{getInitials(name)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-display text-2xl font-semibold sm:text-3xl">{name}</h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-1.5 text-sm">
              <MapPin className="size-3.5" />
              {technician.location}
            </p>
            <RatingStars
              rating={technician.averageRating}
              reviewCount={technicianReviews.length}
              size="md"
              className="mt-1.5"
            />
          </div>
        </div>

        <BookingRequestDialog
          technician={technician}
          services={services}
          defaultServiceId={defaultServiceId}
        />
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="border-l-accent border-l-4 p-4">
          <p className="text-muted-foreground text-xs">Hourly rate</p>
          <p className="font-display mt-1 text-lg font-semibold">
            {formatCurrency(technician.hourlyRate)}
          </p>
        </Card>
        <Card className="border-l-accent border-l-4 p-4">
          <p className="text-muted-foreground text-xs">Experience</p>
          <p className="font-display mt-1 text-lg font-semibold">
            {technician.experience} yrs
          </p>
        </Card>
        <Card className="border-l-accent border-l-4 p-4">
          <p className="text-muted-foreground text-xs">Services offered</p>
          <p className="font-display mt-1 text-lg font-semibold">{services.length}</p>
        </Card>
        <Card className="border-l-accent border-l-4 p-4">
          <p className="text-muted-foreground text-xs">Reviews</p>
          <p className="font-display mt-1 text-lg font-semibold">
            {technicianReviews.length}
          </p>
        </Card>
      </div>

      {technician.bio && (
        <div className="mt-8">
          <h2 className="font-display text-lg font-semibold">About</h2>
          <p className="text-muted-foreground mt-2 leading-relaxed">{technician.bio}</p>
        </div>
      )}

      {technician.skills.length > 0 && (
        <div className="mt-6">
          <h2 className="font-display text-lg font-semibold">Skills</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {technician.skills.map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10">
        <h2 className="font-display text-lg font-semibold">Services</h2>
        {services.length === 0 ? (
          <EmptyState
            icon={Wrench}
            title="No services listed yet"
            className="mt-4"
          />
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {services.map((service) => (
              <ServiceCard key={service.id} service={{ ...service, technician }} />
            ))}
          </div>
        )}
      </div>

      <div className="mt-10">
        <h2 className="font-display text-lg font-semibold">Reviews</h2>
        {technicianReviews.length === 0 ? (
          <EmptyState
            icon={Star}
            title="No reviews yet"
            description="This technician hasn't received any reviews yet."
            className="mt-4"
          />
        ) : (
          <div className="mt-4 space-y-4">
            {technicianReviews.map((review) => (
              <Card key={review.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Avatar className="size-8">
                      <AvatarImage
                        src={review.customer?.profileImage ?? undefined}
                        alt={review.customer?.name ?? "Customer"}
                      />
                      <AvatarFallback>
                        {getInitials(review.customer?.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        {review.customer?.name ?? "FixItNow customer"}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                  </div>
                  <RatingStars rating={review.rating} />
                </div>
                {review.comment && (
                  <p className="text-muted-foreground mt-3 text-sm">{review.comment}</p>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
