import { NextResponse, type NextRequest } from "next/server";
import { AUTH_ROLE_COOKIE, AUTH_TOKEN_COOKIE, ROLES } from "@/lib/constants";
import {
  ADMIN_ROUTE_PREFIX,
  AUTH_ROUTE_PREFIXES,
  CUSTOMER_ROUTE_PREFIX,
  ROLE_HOME_ROUTE,
  TECHNICIAN_ROUTE_PREFIX,
} from "@/lib/routes";
import type { Role } from "@/types/enums";



const ROLE_PREFIX_MAP: { prefix: string; role: Role }[] = [
  { prefix: CUSTOMER_ROUTE_PREFIX, role: ROLES.CUSTOMER },
  { prefix: TECHNICIAN_ROUTE_PREFIX, role: ROLES.TECHNICIAN },
  { prefix: ADMIN_ROUTE_PREFIX, role: ROLES.ADMIN },
];

function isValidRole(value: string | undefined): value is Role {
  return value === ROLES.CUSTOMER || value === ROLES.TECHNICIAN || value === ROLES.ADMIN;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(AUTH_TOKEN_COOKIE)?.value;
  const roleCookie = request.cookies.get(AUTH_ROLE_COOKIE)?.value;
  const role = isValidRole(roleCookie) ? roleCookie : undefined;
  const isAuthenticated = Boolean(token && role);

  const matchedProtected = ROLE_PREFIX_MAP.find(({ prefix }) =>
    pathname.startsWith(prefix),
  );


  const isAuthRoute = AUTH_ROUTE_PREFIXES.some(
    (route) => route === pathname,
  );

  if (isAuthRoute && isAuthenticated && role) {
    return NextResponse.redirect(new URL(ROLE_HOME_ROUTE[role], request.url));
  }

  if (matchedProtected) {
 
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (role !== matchedProtected.role) {
      return NextResponse.redirect(new URL(ROLE_HOME_ROUTE[role as Role], request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|gif|ico)$).*)",
  ],
};
