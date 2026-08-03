"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useDeleteBookingMutation } from "@/features/bookings/hooks";
import { CUSTOMER_ROUTES } from "@/lib/routes";

export function DeleteBookingButton({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const deleteBooking = useDeleteBookingMutation({
    onSuccess: () => {
      toast.success("Booking removed from your history.");
      router.replace(CUSTOMER_ROUTES.BOOKINGS);
    },
    onError: (error) => {
      toast.error(error.message || "Couldn't remove this booking.");
    },
  });

  return (
    <>
      <Button
        variant="ghost"
        onClick={() => setOpen(true)}
        className="text-destructive hover:text-destructive gap-2"
      >
        <Trash2 className="size-4" />
        Remove from history
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Remove this booking?"
        description="This permanently deletes the booking record. This can't be undone."
        confirmLabel="Remove"
        isLoading={deleteBooking.isPending}
        onConfirm={() => deleteBooking.mutate(bookingId)}
      />
    </>
  );
}
