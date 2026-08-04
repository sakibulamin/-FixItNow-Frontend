import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, isValid } from "date-fns";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);
}


export function formatDate(date: string | Date | undefined | null): string {
  if (!date) return "—";
  const parsed = typeof date === "string" ? new Date(date) : date;
  if (!isValid(parsed)) return "—";
  return format(parsed, "MMM d, yyyy");
}


export function formatDateTime(date: string | Date | undefined | null): string {
  if (!date) return "—";
  const parsed = typeof date === "string" ? new Date(date) : date;
  if (!isValid(parsed)) return "—";
  return format(parsed, "MMM d, yyyy, h:mm a");
}


export function formatRelativeTime(date: string | Date | undefined | null): string {
  if (!date) return "—";
  const parsed = typeof date === "string" ? new Date(date) : date;
  if (!isValid(parsed)) return "—";
  return formatDistanceToNow(parsed, { addSuffix: true });
}


export function humanizeEnum(value: string): string {
  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}


export function getInitials(name: string | undefined | null): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return `${first}${last}`.toUpperCase();
}


export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function truncate(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength).trimEnd()}…`;
}
