"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CalendarClock, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader,
  DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import { useAuth } from "@/providers/auth-provider";
import { useCreateBookingMutation } from "@/features/bookings/hooks";
import {
  bookingRequestSchema,
  type BookingRequestFormValues,
} from "@/features/bookings/schema";
import { formatCurrency } from "@/lib/utils";
import { AUTH_ROUTES } from "@/lib/routes";
import type { Service } from "@/types/service";
import type { TechnicianProfile } from "@/types/technician";

interface BookingRequestDialogProps {
  technician: TechnicianProfile;
  services: Service[];
  defaultServiceId?: string;
}

export function BookingRequestDialog({
  technician,
  services,
  defaultServiceId,
}: BookingRequestDialogProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);

  const form = useForm<BookingRequestFormValues>({
    resolver: zodResolver(bookingRequestSchema),
    defaultValues: {
      serviceId: defaultServiceId ?? services[0]?.id ?? "",
      bookingDate: "",
      address: user?.address ?? "",
    },
  });

  const createBooking = useCreateBookingMutation({
    onSuccess: () => {
      toast.success("Booking request sent! The technician will review it shortly.");
      setOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast.error(error.message || "Could not send this booking request.");
    },
  });

  function handleTriggerClick() {
    if (!isAuthenticated) {
      toast.info("Sign in as a customer to request a booking.");
      router.push(`${AUTH_ROUTES.LOGIN}?callbackUrl=/technicians/${technician.id}`);
      return;
    }
    if (user?.role !== "CUSTOMER") {
      toast.error("Only customer accounts can request bookings.");
      return;
    }
    setOpen(true);
  }

  function onSubmit(values: BookingRequestFormValues) {
    if (!user) return;
    const selectedService = services.find((s) => s.id === values.serviceId);
    if (!selectedService) return;

    createBooking.mutate({
      customerId: user.id,
      technicianId: technician.id,
      serviceId: values.serviceId,
      bookingDate: new Date(values.bookingDate).toISOString(),
      address: values.address,
      amount: selectedService.price,
    });
  }

  if (services.length === 0) {
    return (
      <Button disabled className="gap-2">
        <CalendarClock className="size-4" />
        No services available
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={handleTriggerClick} className="gap-2">
          <CalendarClock className="size-4" />
          Request booking
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request a booking</DialogTitle>
          <DialogDescription>
            Send a booking request to {technician.user?.name ?? "this technician"}. They will
            accept or decline it from their dashboard.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <FormField
              control={form.control}
              name="serviceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.title} — {formatCurrency(service.price)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bookingDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred date & time</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service address</FormLabel>
                  <FormControl>
                    <Input placeholder="Where should the technician go?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={createBooking.isPending} className="gap-2">
                {createBooking.isPending && <Loader2 className="size-4 animate-spin" />}
                {createBooking.isPending ? "Sending request…" : "Send request"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
