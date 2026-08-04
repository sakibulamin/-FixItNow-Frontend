import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  exp?: number;
  [key: string]: unknown;
}


export function getTokenExpiryDate(token: string): Date | undefined {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    if (!decoded.exp) return undefined;
    return new Date(decoded.exp * 1000);
  } catch {
    return undefined;
  }
}
