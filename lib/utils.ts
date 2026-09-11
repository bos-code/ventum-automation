import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional class names and dedupe conflicting Tailwind utilities. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Turn arbitrary text into a URL-safe slug.
 * Lowercase, ASCII-ish, hyphen-separated, no leading/trailing hyphen.
 */
export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** A slug is valid if slugify() would leave it unchanged and it is non-empty. */
export function isValidSlug(slug: string): boolean {
  return slug.length > 0 && slug === slugify(slug);
}

const nairaFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** Format a price. Amounts are stored as whole units (Naira), not kobo. */
export function formatPrice(amount: number, currency = "NGN"): string {
  if (!Number.isFinite(amount)) return "Price on request";
  if (currency === "NGN") return nairaFormatter.format(amount);
  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

/** Format an ISO date string for admin tables / enquiry views. */
export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Lagos",
  }).format(date);
}

/** Normalise a phone number to digits only (keeps a leading +). */
export function normalizePhone(input: string): string {
  const trimmed = input.trim();
  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");
  return hasPlus ? `+${digits}` : digits;
}

/** Convert a local Nigerian number (0803…) to international digits (234803…). */
export function toWhatsAppDigits(input: string): string {
  let digits = input.replace(/\D/g, "");
  if (digits.startsWith("0")) digits = `234${digits.slice(1)}`;
  if (digits.startsWith("234")) return digits;
  if (digits.length === 10) return `234${digits}`;
  return digits;
}
