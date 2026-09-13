/**
 * Static fallback for site-wide business details.
 * Source: VENTUM_STARTER.md §1 and the client's existing flyer
 * (assets/brand/ventum_logo/1000419120_transparent.png), which prints
 * the same RC number, email and phone directly.
 *
 * Once the Appwrite `settings` collection exists (step 3), this becomes
 * the seed data / fallback rather than the source of truth.
 */
export const siteConfig = {
  name: "Ventum Automation",
  legalName: "Ventum Global Services Ltd",
  tagline: "High Value and Quality Commodities",
  description:
    "We sell, construct and install electrical switches, lighting, solar energy systems, industrial parts, hand tools, contactors and breakers.",
  rcNumber: "3777637",
  whatsappNumber: "2348064870941",
  whatsappDisplay: "+234 806 487 0941",
  phoneSecondary: "07055595398",
  email: "ventumglobal@gmail.com",
  address: "F1626, Alaba International Market, Ojo, Lagos, Nigeria",
  // `||` on purpose, not `??` — an env var set to an empty string (as
  // opposed to unset) still needs to fall back, or `new URL(siteUrl)`
  // in layout.tsx throws ERR_INVALID_URL at build time.
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://ventumautomation.com",
} as const;

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/brands", label: "Brands" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export function whatsappLink(number: string, message?: string) {
  const base = `https://wa.me/${number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
