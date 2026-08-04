
import type { Role } from "@/types/enums";



/** fully public  routes  */
export const PUBLIC_ROUTES = {
  HOME: "/",
  SERVICES: "/services",
  SERVICE_DETAILS: (id: string) => `/services/${id}`,
  TECHNICIANS: "/technicians",
  TECHNICIAN_DETAILS: (id: string) => `/technicians/${id}`,
  ABOUT: "/about",
  ABOUT_DETAILS: (id: string) => `/about/${id}`,
} as const;

/** public for proxy.ts */
export const PUBLIC_ROUTE_PREFIXES = ["/", "/services", "/technicians","/about"];

/** Auth routes —  */
export const AUTH_ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
} as const;

export const AUTH_ROUTE_PREFIXES = [AUTH_ROUTES.LOGIN, AUTH_ROUTES.REGISTER];

/** Payment redirect routes  */
export const PAYMENT_ROUTES = {
  SUCCESS: "/payment/success",
  CANCEL: "/payment/cancel",
} as const;

/** Customer dashboard routes. */
export const CUSTOMER_ROUTES = {
  ROOT: "/dashboard",
  BOOKINGS: "/dashboard/bookings",
  BOOKING_DETAILS: (id: string) => `/dashboard/bookings/${id}`,
  PAYMENTS: "/dashboard/payments",
  PROFILE: "/dashboard/profile",
  SETTINGS: "/dashboard/settings",
} as const;

export const CUSTOMER_ROUTE_PREFIX = "/dashboard";

/** Technician dashboard routes. */
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

/** Admin dashboard routes. */
export const ADMIN_ROUTES = {
  ROOT: "/admin",
  USERS: "/admin/users",
  BOOKINGS: "/admin/bookings",
  CATEGORIES: "/admin/categories",
} as const;

export const ADMIN_ROUTE_PREFIX = "/admin";

export const ROLE_ROUTE_PREFIX: Record<Role, string> = {
  CUSTOMER: CUSTOMER_ROUTE_PREFIX,
  TECHNICIAN: TECHNICIAN_ROUTE_PREFIX,
  ADMIN: ADMIN_ROUTE_PREFIX,
};

export const ROLE_HOME_ROUTE: Record<Role, string> = {
  CUSTOMER: CUSTOMER_ROUTES.ROOT,
  TECHNICIAN: TECHNICIAN_ROUTES.ROOT,
  ADMIN: ADMIN_ROUTES.ROOT,
};


export const PROTECTED_ROUTE_PREFIXES = [
  CUSTOMER_ROUTE_PREFIX,
  TECHNICIAN_ROUTE_PREFIX,
  ADMIN_ROUTE_PREFIX,
];
