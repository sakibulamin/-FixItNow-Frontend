"use client";

import { Loader2 } from "lucide-react";
import { ErrorState } from "@/components/shared/error-state";
import { CreateTechnicianProfileForm } from "@/features/technicians/components/create-technician-profile-form";
import { useMyTechnicianProfile } from "@/features/technicians/hooks";
import type { TechnicianProfile } from "@/types/technician";

export function TechnicianProfileGate({
  children,
}: {
  children: (profile: TechnicianProfile) => React.ReactNode;
}) {
  const { data: profile, isPending, isError, refetch, hasProfile } = useMyTechnicianProfile();

  if (isPending) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="text-primary size-6 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Couldn't load your technician profile"
        description="Something went wrong. Please try again."
        onRetry={() => refetch()}
      />
    );
  }

  if (!hasProfile || !profile) {
    return <CreateTechnicianProfileForm />;
  }

  return <>{children(profile)}</>;
}
