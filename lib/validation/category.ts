import { z } from "zod";
import { slugify } from "@/lib/utils";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const categoryInputSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(120),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(2, "Slug is required")
    .max(140)
    .regex(SLUG_RE, "Use lowercase letters, numbers and hyphens only")
    // Guard against odd inputs even if the regex is loosened later.
    .refine((s) => s === slugify(s), "Slug contains unsupported characters"),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  sortOrder: z.coerce.number().int().min(0).max(100000).default(0),
  published: z.boolean().default(true),
});

export type CategoryInput = z.input<typeof categoryInputSchema>;
export type CategoryData = z.output<typeof categoryInputSchema>;

export const categoryReorderSchema = z.object({
  order: z.array(z.string().trim().min(1).max(64)).max(100),
});
