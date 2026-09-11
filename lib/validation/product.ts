import { z } from "zod";
import { slugify } from "@/lib/utils";
import type { Specification } from "@/types";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const specificationSchema = z.object({
  label: z.string().trim().max(100),
  value: z.string().trim().max(250),
});

/**
 * The single source of truth for product create / edit. The admin form
 * (react-hook-form) and the server action both validate against this.
 *
 * Numeric fields accept strings too (`z.coerce`) so the action stays
 * usable when called with form-encoded values; `price: null` means
 * "Price on request".
 */
export const productInputSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(200),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(2, "Slug is required")
    .max(120)
    .regex(SLUG_RE, "Use lowercase letters, numbers and hyphens only")
    .refine((s) => s === slugify(s), "Slug contains unsupported characters"),
  brand: z.string().trim().min(1, "Brand is required").max(120),
  categoryId: z.string().trim().min(1, "Choose a category").max(64),
  model: z.string().trim().max(160).default(""),
  shortDescription: z.string().trim().max(400).default(""),
  description: z.string().trim().max(3000).default(""),
  price: z
    .union([z.null(), z.coerce.number().int().min(0).max(1_000_000_000)])
    .default(null),
  currency: z.string().trim().min(1).max(8).default("NGN"),
  featured: z.boolean().default(false),
  inStock: z.boolean().default(true),
  published: z.boolean().default(false),
  imageIds: z.array(z.string().trim().min(1).max(64)).max(12).default([]),
  specifications: z.array(specificationSchema).max(20).default([]),
  sortOrder: z.coerce.number().int().min(0).max(100000).default(0),
});

export type ProductInput = z.input<typeof productInputSchema>;
export type ProductData = z.output<typeof productInputSchema>;

/** Drop spec rows the admin left completely blank. */
export function cleanSpecifications(specs: Specification[]): Specification[] {
  return specs
    .map((s) => ({ label: s.label.trim(), value: s.value.trim() }))
    .filter((s) => s.label.length > 0 && s.value.length > 0);
}

export const productPublishSchema = z.object({
  id: z.string().trim().min(1).max(64),
  field: z.enum(["published", "featured", "inStock"]),
  value: z.boolean(),
});

export const productDeleteSchema = z.object({
  id: z.string().trim().min(1).max(64),
});
