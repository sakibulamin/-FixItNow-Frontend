import { z } from "zod";

export const reviewFormSchema = z.object({
  rating: z.number().min(1, "Select a rating").max(5),
  comment: z.string().max(1000, "Keep it under 1000 characters").optional(),
});

export type ReviewFormValues = z.infer<typeof reviewFormSchema>;
