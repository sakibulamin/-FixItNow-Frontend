import { z } from "zod";

export const serviceFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().min(1, "Enter a valid price"),
  categoryId: z.string().min(1, "Select a category"),
});

export type ServiceFormValues = z.infer<typeof serviceFormSchema>;
