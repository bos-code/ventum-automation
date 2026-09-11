/** Cache tags for on-demand revalidation of public catalogue data. */
export const CACHE_TAGS = {
  products: "products",
  categories: "categories",
  settings: "settings",
} as const;

/**
 * How long public catalogue data may be served stale before a background
 * refresh. Admin mutations additionally call `revalidateTag(tag, "max")`
 * so edits propagate on the next request.
 */
export const PUBLIC_REVALIDATE_SECONDS = 300;
