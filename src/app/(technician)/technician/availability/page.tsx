"use client";

import { TechnicianProfileGate } from "@/features/technicians/components/technician-profile-gate";
import { AvailabilityScheduler } from "@/features/technicians/components/availability-scheduler";

export default function TechnicianAvailabilityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Availability</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {"Let customers know when you're free to take jobs."}
        </p>
      </div>

      <TechnicianProfileGate>
        {(profile) => <AvailabilityScheduler technician={profile} />}
      </TechnicianProfileGate>
    </div>
  );
}
