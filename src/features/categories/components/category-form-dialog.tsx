"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Pencil, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader,
  DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form, FormControl, FormField, FormItem,
  FormLabel, FormMessage
} from "@/components/ui/form";
import { useCreateCategoryMutation, useUpdateCategoryMutation } from "@/features/categories/hooks";
import { categoryFormSchema, type CategoryFormValues } from "@/features/categories/schema";
import type { Category } from "@/types/category";

export function CategoryFormDialog({ category }: { category?: Category }) {
  const [open, setOpen] = useState(false);
  const isEditing = Boolean(category);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: category?.name ?? "",
      description: category?.description ?? "",
    },
  });

  const createCategory = useCreateCategoryMutation({
    onSuccess: () => {
      toast.success("Category created.");
      setOpen(false);
      form.reset({ name: "", description: "" });
    },
    onError: (error) => toast.error(error.message || "Couldn't create this category."),
  });

  const updateCategory = useUpdateCategoryMutation({
    onSuccess: () => {
      toast.success("Category updated.");
      setOpen(false);
    },
    onError: (error) => toast.error(error.message || "Couldn't update this category."),
  });

  const isPending = createCategory.isPending || updateCategory.isPending;

  function onSubmit(values: CategoryFormValues) {
    const payload = { name: values.name, description: values.description || undefined };
    if (isEditing && category) {
      updateCategory.mutate({ id: category.id, payload });
    } else {
      createCategory.mutate(payload);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEditing ? (
          <Button variant="outline" size="sm" className="gap-1.5">
            <Pencil className="size-3.5" />
            Edit
          </Button>
        ) : (
          <Button className="gap-2">
            <Plus className="size-4" />
            Add category
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit category" : "Add a new category"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update this category's name and description."
              : "Categories help customers filter and browse services."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Electrical" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder="Briefly describe this category…" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isPending} className="gap-2">
                {isPending && <Loader2 className="size-4 animate-spin" />}
                {isEditing ? "Save changes" : "Create category"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
