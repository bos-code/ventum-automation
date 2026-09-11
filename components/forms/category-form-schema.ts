import { z } from "zod";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Form-facing category schema (name/slug/description/published only —
 * display order is managed separately via the reorder buttons). The
 * server action fills in `sortOrder` and re-validates with
 * `lib/validation/category.ts`'s `categoryInputSchema`.
 */
export const categoryFormSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(120),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(2, "Slug is required")
    .max(140)
    .regex(SLUG_RE, "Use lowercase letters, numbers and hyphens only"),
  description: z.string().trim().max(500),
  published: z.boolean(),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export const emptyCategoryFormValues: CategoryFormValues = {
  name: "",
  slug: "",
  description: "",
  published: true,
};
