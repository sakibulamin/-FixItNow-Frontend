import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RatingStars } from "@/components/shared/rating-stars";
import { formatCurrency, getInitials } from "@/lib/utils";
import type { TechnicianProfile } from "@/types/technician";

interface TechnicianCardProps {
  technician: TechnicianProfile;
}

export function TechnicianCard({ technician }: TechnicianCardProps) {
  const name = technician.user?.name ?? "FixItNow technician";
  const image = technician.user?.profileImage;

  return (
    <Card className="border-l-accent border-l-4 p-5 transition-shadow hover:shadow-md">
      <CardContent className="p-0">
        <div className="flex items-center gap-3">
          <Avatar className="size-14">
            {image ? (
              <Image
                src={image}
                alt={name}
                width={56}
                height={56}
                className="aspect-square size-full object-cover"
              />
            ) : (
              <AvatarImage src={undefined} alt={name} />
            )}
            <AvatarFallback className="text-base">{getInitials(name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <Link href={`/technicians/${technician.id}`}>
              <h3 className="font-display hover:text-primary truncate font-semibold transition-colors">
                {name}
              </h3>
            </Link>
            <p className="text-muted-foreground flex items-center gap-1 text-xs">
              <MapPin className="size-3" />
              {technician.location}
            </p>
          </div>
        </div>

        {technician.bio && (
          <p className="text-muted-foreground mt-4 line-clamp-2 text-sm">
            {technician.bio}
          </p>
        )}

        {technician.skills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {technician.skills.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-[10px]">
                {skill}
              </Badge>
            ))}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <div>
            <RatingStars rating={technician.averageRating} />
            <p className="font-display mt-1 text-sm font-semibold">
              {formatCurrency(technician.hourlyRate)}
              <span className="text-muted-foreground text-xs font-normal">/hr</span>
            </p>
          </div>
          <Button size="sm" asChild>
            <Link href={`/technicians/${technician.id}`}>View profile</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
