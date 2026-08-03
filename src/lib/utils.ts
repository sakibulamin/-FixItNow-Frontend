import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, isValid } from "date-fns";

/**
 * Merge Tailwind class names safely, resolving conflicting utility classes.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a numeric amount as BDT currency (FixItNow operates in Bangladesh
 * per the technician "location" examples in the backend data, e.g. "Dhaka").
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format an ISO date string / Date into a readable date, e.g. "Aug 1, 2026".
 */
export function formatDate(date: string | Date | undefined | null): string {
  if (!date) return "—";
  const parsed = typeof date === "string" ? new Date(date) : date;
  if (!isValid(parsed)) return "—";
  return format(parsed, "MMM d, yyyy");
}

/**
 * Format an ISO date string / Date into a readable date + time, e.g.
 * "Aug 1, 2026, 10:00 AM".
 */
export function formatDateTime(date: string | Date | undefined | null): string {
  if (!date) return "—";
  const parsed = typeof date === "string" ? new Date(date) : date;
  if (!isValid(parsed)) return "—";
  return format(parsed, "MMM d, yyyy, h:mm a");
}

/**
 * Format an ISO date string / Date as a relative time, e.g. "3 hours ago".
 */
export function formatRelativeTime(date: string | Date | undefined | null): string {
  if (!date) return "—";
  const parsed = typeof date === "string" ? new Date(date) : date;
  if (!isValid(parsed)) return "—";
  return formatDistanceToNow(parsed, { addSuffix: true });
}

/**
 * Turn "REQUESTED" / "IN_PROGRESS" into "Requested" / "In Progress".
 */
export function humanizeEnum(value: string): string {
  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Build initials from a full name, e.g. "Sakibul Amin" -> "SA".
 */
export function getInitials(name: string | undefined | null): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return `${first}${last}`.toUpperCase();
}

/**
 * Clamp a number between a min and max value.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Safely truncate a string to a given length, appending an ellipsis.
 */
export function truncate(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength).trimEnd()}…`;
}
