
export type Role = "CUSTOMER" | "TECHNICIAN" | "ADMIN";

export type UserStatus = "ACTIVE" | "BLOCKED";

export type BookingStatus =
  | "REQUESTED"
  | "ACCEPTED"
  | "DECLINED"
  | "PAID"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";

export type PaymentProvider = "SSLCOMMERZ" | "STRIPE";
