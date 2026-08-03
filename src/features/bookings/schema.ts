import { z } from "zod";

export const bookingRequestSchema = z.object({
  serviceId: z.string().min(1, "Select a service"),
  bookingDate: z
    .string()
    .min(1, "Pick a date and time")
    .refine((val) => new Date(val).getTime() > Date.now(), {
      message: "Choose a date and time in the future",
    }),
  address: z.string().min(5, "Enter the full address for this job"),
});

export type BookingRequestFormValues = z.infer<typeof bookingRequestSchema>;
