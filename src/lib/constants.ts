
export const APP_NAME = "FixItNow";


export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

export const AUTH_TOKEN_COOKIE =
  process.env.NEXT_PUBLIC_AUTH_TOKEN_COOKIE ?? "fixitnow_access_token";

export const AUTH_REFRESH_COOKIE =
  process.env.NEXT_PUBLIC_AUTH_REFRESH_COOKIE ?? "fixitnow_refresh_token";

export const AUTH_ROLE_COOKIE =
  process.env.NEXT_PUBLIC_AUTH_ROLE_COOKIE ?? "fixitnow_user_role";


export const ROLES = {
  CUSTOMER: "CUSTOMER",
  TECHNICIAN: "TECHNICIAN",
  ADMIN: "ADMIN",
} as const;

export const USER_STATUSES = {
  ACTIVE: "ACTIVE",
  BLOCKED: "BLOCKED",
} as const;

export const BOOKING_STATUSES = {
  REQUESTED: "REQUESTED",
  ACCEPTED: "ACCEPTED",
  DECLINED: "DECLINED",
  PAID: "PAID",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;

export const PAYMENT_STATUSES = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  CANCELLED: "CANCELLED",
} as const;

export const PAYMENT_PROVIDERS = {
  SSLCOMMERZ: "SSLCOMMERZ",
  
} as const;
