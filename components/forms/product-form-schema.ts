import { z } from "zod";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Form-facing product schema. This mirrors `lib/validation/product.ts`'s
 * `productInputSchema` but uses plain types (no `z.coerce` / unions) so
 * react-hook-form gets clean input/output types. The server action
 * re-validates every submission against `productInputSchema` — this
 * schema only shapes the client form.
 */
export const productFormSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(200),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(2, "Slug is required")
    .max(120)
    .regex(SLUG_RE, "Use lowercase letters, numbers and hyphens only"),
  brand: z.string().trim().min(1, "Brand is required").max(120),
  categoryId: z.string().trim().min(1, "Choose a category").max(64),
  model: z.string().trim().max(160),
  shortDescription: z.string().trim().max(400),
  description: z.string().trim().max(3000),
  price: z.number().int().min(0).max(1_000_000_000).nullable(),
  currency: z.string().trim().min(1, "Required").max(8),
  featured: z.boolean(),
  inStock: z.boolean(),
  published: z.boolean(),
  imageIds: z.array(z.string()).max(12),
  specifications: z
    .array(
      z.object({
        label: z.string().max(100),
        value: z.string().max(250),
      }),
    )
    .max(20),
  sortOrder: z.number().int().min(0).max(100000),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

export const emptyProductFormValues: ProductFormValues = {
  name: "",
  slug: "",
  brand: "",
  categoryId: "",
  model: "",
  shortDescription: "",
  description: "",
  price: null,
  currency: "NGN",
  featured: false,
  inStock: true,
  published: false,
  imageIds: [],
  specifications: [],
  sortOrder: 0,
};
