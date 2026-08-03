import { z } from "zod";
import { ROLES } from "@/lib/constants";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

/**
 * Registration only offers CUSTOMER and TECHNICIAN as selectable roles —
 * ADMIN accounts aren't self-service per the backend's role model, and
 * nothing in the API doc suggests otherwise.
 */
export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().min(1, "Email is required").email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Include at least one uppercase letter")
      .regex(/[0-9]/, "Include at least one number"),
    confirmPassword: z.string().min(1, "Confirm your password"),
    phone: z.string().optional().or(z.literal("")),
    address: z.string().optional().or(z.literal("")),
    role: z.enum([ROLES.CUSTOMER, ROLES.TECHNICIAN], {
      message: "Select an account type",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
