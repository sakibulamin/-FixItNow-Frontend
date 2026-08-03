import { z } from "zod";

export const technicianProfileSchema = z.object({
  bio: z.string().max(1000, "Keep it under 1000 characters").optional().or(z.literal("")),
  skills: z.string().optional().or(z.literal("")),
  experience: z.coerce.number().min(0, "Must be 0 or more").max(60, "That's a lot of years"),
  hourlyRate: z.coerce.number().min(1, "Enter a valid hourly rate"),
  location: z.string().min(2, "Enter your service location"),
});

export type TechnicianProfileFormValues = z.infer<typeof technicianProfileSchema>;
