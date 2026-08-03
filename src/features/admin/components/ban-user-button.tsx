"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Ban, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useUpdateAdminUserStatusMutation } from "@/features/admin/hooks";
import type { User } from "@/types/user";

export function BanUserButton({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const isActive = user.status === "ACTIVE";

  const updateStatus = useUpdateAdminUserStatusMutation({
    onSuccess: () => {
      toast.success(isActive ? `${user.name} has been banned.` : `${user.name} has been unbanned.`);
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Couldn't update this user's status.");
    },
  });

  return (
    <>
      <Button
        variant={isActive ? "outline" : "default"}
        size="sm"
        onClick={() => setOpen(true)}
        className="gap-1.5"
      >
        {isActive ? <Ban className="size-3.5" /> : <ShieldCheck className="size-3.5" />}
        {isActive ? "Ban" : "Unban"}
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={isActive ? `Ban ${user.name}?` : `Unban ${user.name}?`}
        description={
          isActive
            ? "This user will no longer be able to sign in or use FixItNow."
            : "This will restore this user's access to FixItNow."
        }
        confirmLabel={isActive ? "Ban user" : "Unban user"}
        variant={isActive ? "destructive" : "default"}
        isLoading={updateStatus.isPending}
        onConfirm={() =>
          updateStatus.mutate({
            id: user.id,
            payload: { status: isActive ? "BLOCKED" : "ACTIVE" },
          })
        }
      />
    </>
  );
}
