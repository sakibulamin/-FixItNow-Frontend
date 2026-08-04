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
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  Form, FormControl, FormField, FormItem,
  FormLabel, FormMessage,
} from "@/components/ui/form";
import { useCategoriesQuery } from "@/features/categories/hooks";
import { useCreateServiceMutation, useUpdateServiceMutation } from "@/features/services/hooks";
import { serviceFormSchema, type ServiceFormValues } from "@/features/services/schema";
import type { Service } from "@/types/service";

interface ServiceFormDialogProps {
  technicianId: string;
  service?: Service;
}

export function ServiceFormDialog({ technicianId, service }: ServiceFormDialogProps) {
  const [open, setOpen] = useState(false);
  const isEditing = Boolean(service);
  const { data: categories } = useCategoriesQuery();

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      title: service?.title ?? "",
      description: service?.description ?? "",
      price: service?.price ?? 0,
      categoryId: service?.categoryId ?? "",
    },
  });

  const createService = useCreateServiceMutation({
    onSuccess: () => {
      toast.success("Service created.");
      setOpen(false);
      form.reset();
    },
    onError: (error) => toast.error(error.message || "Couldn't create this service."),
  });

  const updateService = useUpdateServiceMutation({
    onSuccess: () => {
      toast.success("Service updated.");
      setOpen(false);
    },
    onError: (error) => toast.error(error.message || "Couldn't update this service."),
  });

  const isPending = createService.isPending || updateService.isPending;

  function onSubmit(values: ServiceFormValues) {
    if (isEditing && service) {
      updateService.mutate({ id: service.id, payload: values });
    } else {
      createService.mutate({ ...values, technicianId });
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
            Add service
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit service" : "Add a new service"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the details customers see for this service."
              : "This will appear on your public profile for customers to book."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Ceiling fan installation" {...field} />
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder="Describe what's included…" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (BDT)</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories?.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isPending} className="gap-2">
                {isPending && <Loader2 className="size-4 animate-spin" />}
                {isEditing ? "Save changes" : "Create service"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
