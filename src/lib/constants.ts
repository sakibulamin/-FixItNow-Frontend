/**
 * Central constants. Values that must match the backend exactly (enums,
 * base URL) are sourced here so nothing gets re-typed/re-guessed elsewhere.
 */

export const APP_NAME = "FixItNow";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api";

export const AUTH_TOKEN_COOKIE =
  process.env.NEXT_PUBLIC_AUTH_TOKEN_COOKIE ?? "fixitnow_access_token";

export const AUTH_REFRESH_COOKIE =
  process.env.NEXT_PUBLIC_AUTH_REFRESH_COOKIE ?? "fixitnow_refresh_token";

export const AUTH_ROLE_COOKIE =
  process.env.NEXT_PUBLIC_AUTH_ROLE_COOKIE ?? "fixitnow_user_role";

/** Mirrors the `Role` enum in enum.prisma exactly. */
export const ROLES = {
  CUSTOMER: "CUSTOMER",
  TECHNICIAN: "TECHNICIAN",
  ADMIN: "ADMIN",
} as const;

/** Mirrors the `UserStatus` enum in enum.prisma exactly. */
export const USER_STATUSES = {
  ACTIVE: "ACTIVE",
  BLOCKED: "BLOCKED",
} as const;

/** Mirrors the `BookingStatus` enum in enum.prisma exactly. */
export const BOOKING_STATUSES = {
  REQUESTED: "REQUESTED",
  ACCEPTED: "ACCEPTED",
  DECLINED: "DECLINED",
  PAID: "PAID",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;

/** Mirrors the `PaymentStatus` enum in enum.prisma exactly. */
export const PAYMENT_STATUSES = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  CANCELLED: "CANCELLED",
} as const;

/** Mirrors the `PaymentProvider` enum in enum.prisma exactly. */
export const PAYMENT_PROVIDERS = {
  SSLCOMMERZ: "SSLCOMMERZ",
  STRIPE: "STRIPE",
} as const;

/**
 * Route constants (public/auth/customer/technician/admin routes,
 * ROLE_HOME_ROUTE, etc.) live in `@/lib/routes` — imported from there
 * to keep a single source of truth instead of duplicating here.
 */
