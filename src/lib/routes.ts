import type { Role } from "@/types/enums";

/**
 * Single source of truth for every route grouping used by proxy.ts,
 * nav components, and role-based redirects. Nothing here is invented
 * backend behavior — these are frontend URL paths only.
 */

/** Fully public marketing/browse routes — no auth required. */
export const PUBLIC_ROUTES = {
  HOME: "/",
  SERVICES: "/services",
  SERVICE_DETAILS: (id: string) => `/services/${id}`,
  TECHNICIANS: "/technicians",
  TECHNICIAN_DETAILS: (id: string) => `/technicians/${id}`,
} as const;

/** Prefixes considered "public" for proxy.ts matching (no auth required). */
export const PUBLIC_ROUTE_PREFIXES = ["/", "/services", "/technicians"];

/** Auth routes — only accessible when logged out. */
export const AUTH_ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
} as const;

export const AUTH_ROUTE_PREFIXES = [AUTH_ROUTES.LOGIN, AUTH_ROUTES.REGISTER];

/** Payment redirect routes (SSLCommerz landing pages). */
export const PAYMENT_ROUTES = {
  SUCCESS: "/payment/success",
  CANCEL: "/payment/cancel",
} as const;

/** Customer-only dashboard routes. */
export const CUSTOMER_ROUTES = {
  ROOT: "/dashboard",
  BOOKINGS: "/dashboard/bookings",
  BOOKING_DETAILS: (id: string) => `/dashboard/bookings/${id}`,
  PAYMENTS: "/dashboard/payments",
  PROFILE: "/dashboard/profile",
  SETTINGS: "/dashboard/settings",
} as const;

export const CUSTOMER_ROUTE_PREFIX = "/dashboard";

/** Technician-only dashboard routes. */
export const TECHNICIAN_ROUTES = {
  ROOT: "/technician",
  BOOKINGS: "/technician/bookings",
  BOOKING_DETAILS: (id: string) => `/technician/bookings/${id}`,
  AVAILABILITY: "/technician/availability",
  SERVICES: "/technician/services",
  REVIEWS: "/technician/reviews",
  EARNINGS: "/technician/earnings",
  PROFILE: "/technician/profile",
} as const;

export const TECHNICIAN_ROUTE_PREFIX = "/technician";

/** Admin-only dashboard routes. */
export const ADMIN_ROUTES = {
  ROOT: "/admin",
  USERS: "/admin/users",
  BOOKINGS: "/admin/bookings",
  CATEGORIES: "/admin/categories",
} as const;

export const ADMIN_ROUTE_PREFIX = "/admin";

/** Maps each backend Role to the frontend prefix that role is allowed into. */
export const ROLE_ROUTE_PREFIX: Record<Role, string> = {
  CUSTOMER: CUSTOMER_ROUTE_PREFIX,
  TECHNICIAN: TECHNICIAN_ROUTE_PREFIX,
  ADMIN: ADMIN_ROUTE_PREFIX,
};

/** Where to send a user immediately after login/register, based on role. */
export const ROLE_HOME_ROUTE: Record<Role, string> = {
  CUSTOMER: CUSTOMER_ROUTES.ROOT,
  TECHNICIAN: TECHNICIAN_ROUTES.ROOT,
  ADMIN: ADMIN_ROUTES.ROOT,
};

/**
 * All prefixes that require *some* authenticated role. Used by proxy.ts
 * to decide whether a route needs a valid session at all before checking
 * which specific role it needs.
 */
export const PROTECTED_ROUTE_PREFIXES = [
  CUSTOMER_ROUTE_PREFIX,
  TECHNICIAN_ROUTE_PREFIX,
  ADMIN_ROUTE_PREFIX,
];
