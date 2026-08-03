"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useDeleteCategoryMutation } from "@/features/categories/hooks";

export function DeleteCategoryButton({
  categoryId,
  categoryName,
}: {
  categoryId: string;
  categoryName: string;
}) {
  const [open, setOpen] = useState(false);

  const deleteCategory = useDeleteCategoryMutation({
    onSuccess: () => {
      toast.success("Category deleted.");
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Couldn't delete this category.");
    },
  });

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className="text-destructive hover:text-destructive gap-1.5"
      >
        <Trash2 className="size-3.5" />
        Delete
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={`Delete "${categoryName}"?`}
        description="Services in this category may be affected. This can't be undone."
        confirmLabel="Delete"
        isLoading={deleteCategory.isPending}
        onConfirm={() => deleteCategory.mutate(categoryId)}
      />
    </>
  );
}
