"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, Loader2, PlayCircle, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useUpdateBookingStatusMutation } from "@/features/bookings/hooks";
import type { BookingStatus } from "@/types/enums";

/**
 * Maps each status to the transitions a technician is actually allowed to
 * make from here, following the booking lifecycle exactly:
 * REQUESTED -> ACCEPTED | DECLINED (technician's call)
 * PAID -> IN_PROGRESS (once the customer has paid)
 * IN_PROGRESS -> COMPLETED
 * Every other status (ACCEPTED awaiting payment, COMPLETED, DECLINED,
 * CANCELLED) has no technician-side action — those are either waiting on
 * the customer or already terminal.
 */
export function TechnicianBookingActions({
  bookingId,
  status,
}: {
  bookingId: string;
  status: BookingStatus;
}) {
  const [declineOpen, setDeclineOpen] = useState(false);

  const updateStatus = useUpdateBookingStatusMutation({
    onError: (error) => {
      toast.error(error.message || "Couldn't update this booking.");
    },
  });

  function accept() {
    updateStatus.mutate(
      { id: bookingId, payload: { status: "ACCEPTED" } },
      { onSuccess: () => toast.success("Booking accepted.") },
    );
  }

  function decline() {
    updateStatus.mutate(
      { id: bookingId, payload: { status: "DECLINED" } },
      {
        onSuccess: () => {
          toast.success("Booking declined.");
          setDeclineOpen(false);
        },
      },
    );
  }

  function markInProgress() {
    updateStatus.mutate(
      { id: bookingId, payload: { status: "IN_PROGRESS" } },
      { onSuccess: () => toast.success("Marked as in progress.") },
    );
  }

  function markCompleted() {
    updateStatus.mutate(
      { id: bookingId, payload: { status: "COMPLETED" } },
      { onSuccess: () => toast.success("Booking marked complete.") },
    );
  }

  if (status === "REQUESTED") {
    return (
      <div className="flex flex-wrap gap-2">
        <Button onClick={accept} disabled={updateStatus.isPending} className="gap-2">
          {updateStatus.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Check className="size-4" />
          )}
          Accept
        </Button>
        <Button
          variant="outline"
          onClick={() => setDeclineOpen(true)}
          disabled={updateStatus.isPending}
          className="gap-2"
        >
          <X className="size-4" />
          Decline
        </Button>
        <ConfirmDialog
          open={declineOpen}
          onOpenChange={setDeclineOpen}
          title="Decline this booking?"
          description="The customer will be notified that you can't take this job."
          confirmLabel="Decline"
          isLoading={updateStatus.isPending}
          onConfirm={decline}
        />
      </div>
    );
  }

  if (status === "ACCEPTED") {
    return (
      <p className="text-muted-foreground text-sm">
        Waiting for the customer to complete payment.
      </p>
    );
  }

  if (status === "PAID") {
    return (
      <Button onClick={markInProgress} disabled={updateStatus.isPending} className="gap-2">
        {updateStatus.isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <PlayCircle className="size-4" />
        )}
        Mark in progress
      </Button>
    );
  }

  if (status === "IN_PROGRESS") {
    return (
      <Button onClick={markCompleted} disabled={updateStatus.isPending} className="gap-2">
        {updateStatus.isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Check className="size-4" />
        )}
        Mark completed
      </Button>
    );
  }

  return null;
}
