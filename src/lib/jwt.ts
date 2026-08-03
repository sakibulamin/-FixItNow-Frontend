import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  exp?: number;
  [key: string]: unknown;
}

/**
 * Decodes a JWT client-side to read its expiry claim. This never verifies
 * the token's signature — verification happens on the backend. It's used
 * only to set a matching cookie expiry so the browser doesn't hold onto a
 * cookie longer than the token inside it is actually valid.
 */
export function getTokenExpiryDate(token: string): Date | undefined {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    if (!decoded.exp) return undefined;
    return new Date(decoded.exp * 1000);
  } catch {
    return undefined;
  }
}
