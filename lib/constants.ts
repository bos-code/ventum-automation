/**
 * Canonical business information for Ventum Global Automation.
 *
 * These values are the build-time fallback. At runtime the `settings`
 * collection in Appwrite (if configured) overrides them — see
 * `lib/appwrite/settings.ts`. Keeping them here means the site renders
 * correctly before any Appwrite setup is done.
 */
export const BUSINESS = {
  name: "Ventum Global Automation",
  legalName: "Ventum Global Services Ltd",
  rc: "3777637",
  tagline: "High Value and Quality Commodities",
  description:
    "Electrical protection, industrial control and solar-protection products for homes, businesses and industrial applications.",
  email: "ventumglobal@gmail.com",
  /** Primary WhatsApp line, digits only, international format (no +). */
  whatsapp: "2348064870941",
  /** Human-readable primary phone. */
  phone: "+234 806 487 0941",
  secondaryPhone: "07055595398",
  address: "F1626 Alaba International Market, Ojo, Lagos, Nigeria",
  domain: "ventumautomation.com",
} as const;

/** Public site origin, used for absolute URLs (metadata, Telegram links, sitemap). */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || `https://${BUSINESS.domain}`
).replace(/\/$/, "");

/**
 * WhatsApp number for customer contact. Configurable via env so the
 * business can change it without a redeploy of the constants file.
 */
export const WHATSAPP_NUMBER = (
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || BUSINESS.whatsapp
).replace(/[^\d]/g, "");

export const CURRENCY = "NGN" as const;

/**
 * Initial category set from the project brief. The seed script creates
 * these; the admin can add/edit/remove them afterwards.
 */
export const INITIAL_CATEGORIES = [
  { name: "Circuit Breakers", slug: "circuit-breakers" },
  { name: "Contactors & Relays", slug: "contactors-relays" },
  { name: "Surge Protection", slug: "surge-protection" },
  { name: "Solar Protection", slug: "solar-protection" },
  { name: "Timers & Controllers", slug: "timers-controllers" },
  { name: "Voltage Protection", slug: "voltage-protection" },
  { name: "Electrical Accessories", slug: "electrical-accessories" },
] as const;

export const ENQUIRY_STATUSES = ["new", "contacted", "resolved"] as const;
export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];

export const ENQUIRY_SOURCES = ["request_form", "whatsapp"] as const;
export type EnquirySource = (typeof ENQUIRY_SOURCES)[number];
