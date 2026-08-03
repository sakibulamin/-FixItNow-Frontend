"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Ban } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useUpdateBookingStatusMutation } from "@/features/bookings/hooks";

export function CancelBookingButton({ bookingId }: { bookingId: string }) {
  const [open, setOpen] = useState(false);

  const updateStatus = useUpdateBookingStatusMutation({
    onSuccess: () => {
      toast.success("Booking cancelled.");
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Couldn't cancel this booking.");
    },
  });

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)} className="gap-2">
        <Ban className="size-4" />
        Cancel booking
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Cancel this booking?"
        description="The technician will be notified. This can't be undone."
        confirmLabel="Cancel booking"
        cancelLabel="Keep booking"
        isLoading={updateStatus.isPending}
        onConfirm={() =>
          updateStatus.mutate({ id: bookingId, payload: { status: "CANCELLED" } })
        }
      />
    </>
  );
}
